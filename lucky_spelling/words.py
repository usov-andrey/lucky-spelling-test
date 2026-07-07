from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


WORD_RE = re.compile(r"^[a-z]+(?:-[a-z]+)*$")
TOKEN_RE = re.compile(r"[A-Za-z]+(?:-[A-Za-z]+)*")


@dataclass(frozen=True)
class WordEntry:
    index: int
    word: str
    audio: str

    def to_json(self) -> dict[str, object]:
        return {"index": self.index, "word": self.word, "audio": self.audio}


def normalize_words(raw_lines: list[str] | tuple[str, ...]) -> list[str]:
    """Normalize one-word-per-line input and remove duplicates in order."""
    seen: set[str] = set()
    words: list[str] = []

    for line in raw_lines:
        word = line.lstrip("\ufeff").strip().lower()
        word = word.replace("\u2010", "-").replace("\u2011", "-").replace("\u2012", "-")
        word = word.replace("\u2013", "-").replace("\u2014", "-")
        word = word.strip(".,:;!?()[]{}\"'")

        if not word or not WORD_RE.fullmatch(word):
            continue
        if word in seen:
            continue

        seen.add(word)
        words.append(word)

    return words


def extract_word_tokens(text: str) -> list[str]:
    """Extract likely English spelling words from OCR-like free text."""
    return normalize_words(TOKEN_RE.findall(text))


def read_words_file(path: str | Path) -> list[str]:
    return normalize_words(Path(path).read_text(encoding="utf-8").splitlines())


def write_words_file(path: str | Path, words: list[str]) -> None:
    Path(path).write_text("\n".join(words) + "\n", encoding="utf-8")


def safe_audio_stem(index: int, total: int, word: str) -> str:
    width = max(2, len(str(total)))
    safe_word = re.sub(r"[^a-z0-9-]+", "-", word.lower()).strip("-")
    safe_word = re.sub(r"-{2,}", "-", safe_word) or "word"
    return f"{index:0{width}d}_{safe_word}"


def build_entries(words: list[str], audio_suffixes: dict[int, str] | None = None) -> list[WordEntry]:
    suffixes = audio_suffixes or {}
    total = len(words)
    entries: list[WordEntry] = []
    for index, word in enumerate(words, start=1):
        suffix = suffixes.get(index, ".mp3")
        entries.append(
            WordEntry(
                index=index,
                word=word,
                audio=f"audio/{safe_audio_stem(index, total, word)}{suffix}",
            )
        )
    return entries
