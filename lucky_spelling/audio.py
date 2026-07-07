from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

from .words import safe_audio_stem


SUPPORTED_AUDIO_SUFFIXES = (".mp3", ".wav", ".m4a", ".ogg")


class AudioGenerationError(RuntimeError):
    def __init__(self, missing_words: list[str], provider_errors: list[str]):
        self.missing_words = missing_words
        self.provider_errors = provider_errors
        lines = ["Could not generate audio for: " + ", ".join(missing_words)]
        if provider_errors:
            lines.append("Tried providers:")
            lines.extend(f"- {error}" for error in provider_errors)
        super().__init__("\n".join(lines))


@dataclass(frozen=True)
class AudioResult:
    suffixes: dict[int, str]
    reused: list[str]
    generated: list[str]


def generate_audio_assets(
    words: list[str],
    output_dir: str | Path,
    *,
    reuse_audio: bool = False,
    language: str = "en-US",
) -> AudioResult:
    audio_dir = Path(output_dir) / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    suffixes: dict[int, str] = {}
    reused: list[str] = []
    generated: list[str] = []
    missing: list[str] = []
    provider_errors: list[str] = []
    total = len(words)

    providers = _available_providers(language)
    if not providers:
        provider_errors.append("No TTS provider is available. Install edge-tts, gTTS, pyttsx3, or use Windows System.Speech.")

    for index, word in enumerate(words, start=1):
        stem = safe_audio_stem(index, total, word)
        existing = _find_existing_audio(audio_dir, stem)
        if reuse_audio and existing:
            suffixes[index] = existing.suffix
            reused.append(word)
            continue

        for provider in providers:
            try:
                created = provider(word, audio_dir / stem)
            except Exception as exc:  # pragma: no cover - provider availability is environment-specific.
                provider_errors.append(f"{provider.__name__}: {exc}")
                continue

            if created and created.exists() and created.stat().st_size > 0:
                suffixes[index] = created.suffix
                generated.append(word)
                break
        else:
            missing.append(word)

    if missing:
        raise AudioGenerationError(missing, provider_errors)

    return AudioResult(suffixes=suffixes, reused=reused, generated=generated)


def _find_existing_audio(audio_dir: Path, stem: str) -> Path | None:
    for suffix in SUPPORTED_AUDIO_SUFFIXES:
        candidate = audio_dir / f"{stem}{suffix}"
        if candidate.exists() and candidate.stat().st_size > 0:
            return candidate
    return None


def _available_providers(language: str):
    providers = []

    try:
        import edge_tts  # noqa: F401
    except Exception:
        pass
    else:
        providers.append(lambda word, stem: _edge_tts(word, stem, language))
        providers[-1].__name__ = "edge-tts"

    try:
        import gtts  # noqa: F401
    except Exception:
        pass
    else:
        providers.append(lambda word, stem: _gtts(word, stem))
        providers[-1].__name__ = "gTTS"

    try:
        import pyttsx3  # noqa: F401
    except Exception:
        pass
    else:
        providers.append(lambda word, stem: _pyttsx3(word, stem))
        providers[-1].__name__ = "pyttsx3"

    if sys.platform.startswith("win"):
        providers.append(lambda word, stem: _windows_system_speech(word, stem, language))
        providers[-1].__name__ = "Windows System.Speech"

    return providers


def _edge_tts(word: str, stem: Path, language: str) -> Path:
    import edge_tts

    voice = "en-US-JennyNeural" if language.lower() != "en-gb" else "en-GB-SoniaNeural"
    output = stem.with_suffix(".mp3")

    async def save() -> None:
        communicate = edge_tts.Communicate(word, voice=voice, rate="-20%")
        await communicate.save(str(output))

    asyncio.run(save())
    return output


def _gtts(word: str, stem: Path) -> Path:
    from gtts import gTTS

    output = stem.with_suffix(".mp3")
    tts = gTTS(text=word, lang="en", slow=True)
    tts.save(str(output))
    return output


def _pyttsx3(word: str, stem: Path) -> Path:
    import pyttsx3

    wav_path = stem.with_suffix(".wav")
    engine = pyttsx3.init()
    engine.setProperty("rate", 125)
    engine.save_to_file(word, str(wav_path))
    engine.runAndWait()
    return _convert_wav_to_mp3_if_possible(wav_path, stem.with_suffix(".mp3"))


def _windows_system_speech(word: str, stem: Path, language: str) -> Path:
    wav_path = stem.with_suffix(".wav")
    with tempfile.NamedTemporaryFile("w", suffix=".ps1", delete=False, encoding="utf-8") as script:
        script_path = Path(script.name)
        escaped_word = word.replace("'", "''")
        escaped_wav = str(wav_path).replace("'", "''")
        escaped_language = language.replace("'", "''")
        script.write(
            "\n".join(
                [
                    "Add-Type -AssemblyName System.Speech",
                    "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer",
                    "$s.Rate = -3",
                    f"$culture = [System.Globalization.CultureInfo]::GetCultureInfo('{escaped_language}')",
                    "try { $s.SelectVoiceByHints("
                    "[System.Speech.Synthesis.VoiceGender]::NotSet, "
                    "[System.Speech.Synthesis.VoiceAge]::NotSet, 0, $culture) } catch {}",
                    f"$s.SetOutputToWaveFile('{escaped_wav}')",
                    f"$s.Speak('{escaped_word}')",
                    "$s.Dispose()",
                ]
            )
        )

    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(script_path)],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    finally:
        try:
            os.remove(script_path)
        except OSError:
            pass

    return _convert_wav_to_mp3_if_possible(wav_path, stem.with_suffix(".mp3"))


def _convert_wav_to_mp3_if_possible(wav_path: Path, mp3_path: Path) -> Path:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return wav_path

    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(wav_path),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "4",
            str(mp3_path),
        ],
        check=True,
    )
    if mp3_path.exists() and mp3_path.stat().st_size > 0:
        try:
            wav_path.unlink()
        except OSError:
            pass
        return mp3_path
    return wav_path

