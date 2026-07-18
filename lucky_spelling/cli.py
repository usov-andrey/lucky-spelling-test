from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .audio import AudioGenerationError, generate_audio_assets, generate_learning_audio_assets
from .deploy import DeployError, deploy
from .ocr import OCRError, extract_words_from_image
from .site import write_site
from .words import build_entries, read_words_file, write_words_file


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        if args.command == "generate":
            return generate_command(args)
        if args.command == "deploy":
            return deploy_command(args)
        if args.command == "publish":
            generate_command(args)
            return deploy_command(args)
    except (AudioGenerationError, OCRError, DeployError, ValueError, FileNotFoundError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    parser.print_help()
    return 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m lucky_spelling",
        description="Generate a static Lucky Spelling Test site and deploy it to GitHub Pages.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    generate = subparsers.add_parser("generate", help="Generate the static site.")
    add_input_args(generate)
    generate.add_argument("--out", default="docs", help="Output folder for the generated static site.")
    generate.add_argument("--reuse-audio", action="store_true", help="Reuse existing audio files when present.")
    generate.add_argument("--language", default="en-US", choices=["en-US", "en-GB"], help="TTS language.")

    deploy_parser = subparsers.add_parser("deploy", help="Deploy docs/ to GitHub Pages.")
    deploy_parser.add_argument("--repo", required=True, help="GitHub repository name, for example lucky-spelling-test.")

    publish = subparsers.add_parser("publish", help="Generate and deploy in one command.")
    add_input_args(publish)
    publish.add_argument("--repo", required=True, help="GitHub repository name.")
    publish.add_argument("--out", default="docs", help="Output folder for the generated static site.")
    publish.add_argument("--reuse-audio", action="store_true", help="Reuse existing audio files when present.")
    publish.add_argument("--language", default="en-US", choices=["en-US", "en-GB"], help="TTS language.")

    return parser


def add_input_args(parser: argparse.ArgumentParser) -> None:
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument("--words", help="Path to words.txt with one English word per line.")
    input_group.add_argument("--image", help="Path to a photo. Requires optional OCR dependencies.")


def generate_command(args: argparse.Namespace) -> int:
    out = Path(args.out)
    words = load_words(args, out)
    if not words:
        raise ValueError("No valid English spelling words were found.")

    audio = generate_audio_assets(
        words,
        out,
        reuse_audio=args.reuse_audio,
        language=args.language,
    )
    entries = build_entries(words, audio.suffixes)
    lesson, lesson_dir = load_lesson(args)
    definition_audio = None
    if lesson:
        learning = {
            str(item["word"]).lower(): str(item["definition"])
            for item in lesson.get("words", [])
        }
        missing = [word for word in words if word not in learning]
        if missing:
            raise ValueError("Lesson metadata is missing words: " + ", ".join(missing))
        definition_audio = generate_learning_audio_assets(
            [(word, learning[word]) for word in words],
            out,
            reuse_audio=args.reuse_audio,
            language=args.language,
        )
    write_site(
        out,
        entries,
        lesson=lesson,
        lesson_dir=lesson_dir,
        definition_audio_suffixes=definition_audio.suffixes if definition_audio else None,
    )

    print(f"Generated {out / 'index.html'}")
    print(f"Words: {len(words)}")
    if audio.generated:
        print(f"Generated audio: {len(audio.generated)} file(s)")
    if audio.reused:
        print(f"Reused audio: {len(audio.reused)} file(s)")
    return 0


def load_lesson(args: argparse.Namespace) -> tuple[dict[str, object] | None, Path | None]:
    words_path_value = getattr(args, "words", None)
    if not words_path_value:
        return None, None
    words_path = Path(words_path_value)
    lesson_path = words_path.with_name("lesson.json")
    if not lesson_path.exists():
        return None, None
    import json

    lesson = json.loads(lesson_path.read_text(encoding="utf-8"))
    if not isinstance(lesson, dict) or not isinstance(lesson.get("words"), list):
        raise ValueError(f"Invalid lesson metadata: {lesson_path}")
    return lesson, lesson_path.parent


def deploy_command(args: argparse.Namespace) -> int:
    url = deploy(args.repo)
    print(url)
    return 0


def load_words(args: argparse.Namespace, out: Path) -> list[str]:
    if getattr(args, "words", None):
        return read_words_file(args.words)

    words = extract_words_from_image(args.image)
    out.mkdir(parents=True, exist_ok=True)
    write_words_file(out / "words.txt", words)
    print(f"OCR words saved to {out / 'words.txt'}. Review this file if the photo was unclear.")
    return words
