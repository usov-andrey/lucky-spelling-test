from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .audio import AudioGenerationError, generate_audio_assets
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
    write_site(out, entries)

    print(f"Generated {out / 'index.html'}")
    print(f"Words: {len(words)}")
    if audio.generated:
        print(f"Generated audio: {len(audio.generated)} file(s)")
    if audio.reused:
        print(f"Reused audio: {len(audio.reused)} file(s)")
    return 0


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

