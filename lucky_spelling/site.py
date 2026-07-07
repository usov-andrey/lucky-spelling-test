from __future__ import annotations

import json
import shutil
from pathlib import Path

from .words import WordEntry, write_words_file


PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = PROJECT_ROOT / "templates"


def write_site(output_dir: str | Path, entries: list[WordEntry]) -> None:
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "audio").mkdir(exist_ok=True)
    (out / ".nojekyll").write_text("", encoding="utf-8")

    _copy_template("index.html", out / "index.html")
    _copy_template("styles.css", out / "styles.css")
    _copy_template("app.js", out / "app.js")

    json_data = [entry.to_json() for entry in entries]
    (out / "words.json").write_text(
        json.dumps(json_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_words_file(out / "words.txt", [entry.word for entry in entries])


def _copy_template(name: str, destination: Path) -> None:
    source = TEMPLATE_DIR / name
    if not source.exists():
        raise FileNotFoundError(f"Missing template: {source}")
    shutil.copyfile(source, destination)

