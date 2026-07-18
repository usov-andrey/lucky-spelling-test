from __future__ import annotations

import json
import shutil
from pathlib import Path

from .words import WordEntry, write_words_file


PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = PROJECT_ROOT / "templates"


def write_site(
    output_dir: str | Path,
    entries: list[WordEntry],
    *,
    lesson: dict[str, object] | None = None,
    lesson_dir: str | Path | None = None,
    definition_audio_suffixes: dict[int, str] | None = None,
) -> None:
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "audio").mkdir(exist_ok=True)
    nojekyll = out / ".nojekyll"
    if not nojekyll.exists():
        nojekyll.write_text("", encoding="utf-8")

    _copy_template("index.html", out / "index.html")
    _copy_template("styles.css", out / "styles.css")
    _copy_template("app.js", out / "app.js")
    _copy_template_directory("pokemon", out / "pokemon")

    lesson_data = lesson or {}
    lesson_words = lesson_data.get("words", [])
    learning_by_word = {
        str(item.get("word", "")).lower(): item
        for item in lesson_words
        if isinstance(item, dict)
    }
    definition_suffixes = definition_audio_suffixes or {}
    json_words: list[dict[str, object]] = []
    for entry in entries:
        item = entry.to_json()
        learning = learning_by_word.get(entry.word)
        if learning:
            item["definition"] = learning["definition"]
            item["image"] = _copy_lesson_image(out, learning, lesson_dir)
            item["imageAlt"] = learning["imageAlt"]
            item["imageCredit"] = learning.get("imageCredit", {})
            suffix = definition_suffixes.get(entry.index, ".mp3")
            item["definitionAudio"] = (
                f"audio/definitions/{entry.audio.rsplit('/', 1)[-1].rsplit('.', 1)[0]}{suffix}"
            )
        json_words.append(item)

    json_data = {
        "title": lesson_data.get("title", "Lucky Spelling Test"),
        "pageLabel": lesson_data.get("pageLabel", ""),
        "topic": lesson_data.get("topic", ""),
        "words": json_words,
    }
    (out / "words.json").write_text(
        json.dumps(json_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_words_file(out / "words.txt", [entry.word for entry in entries])


def _copy_lesson_image(
    out: Path,
    learning: dict[str, object],
    lesson_dir: str | Path | None,
) -> str:
    relative = Path(str(learning["image"]))
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError(f"Lesson image must be a safe relative path: {relative}")
    if lesson_dir is None:
        raise ValueError("lesson_dir is required when lesson images are configured")
    source = Path(lesson_dir) / relative
    if not source.exists():
        raise FileNotFoundError(f"Missing lesson image: {source}")
    destination = out / "images" / source.name
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    return f"images/{source.name}"


def _copy_template(name: str, destination: Path) -> None:
    source = TEMPLATE_DIR / name
    if not source.exists():
        raise FileNotFoundError(f"Missing template: {source}")
    shutil.copyfile(source, destination)


def _copy_template_directory(name: str, destination: Path) -> None:
    source = TEMPLATE_DIR / name
    if not source.is_dir():
        raise FileNotFoundError(f"Missing template directory: {source}")
    shutil.copytree(source, destination, dirs_exist_ok=True)
