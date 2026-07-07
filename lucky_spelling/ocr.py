from __future__ import annotations

from pathlib import Path

from .words import extract_word_tokens


class OCRError(RuntimeError):
    pass


def extract_words_from_image(image_path: str | Path) -> list[str]:
    """Try OCR if optional pytesseract/Pillow dependencies are installed."""
    image = Path(image_path)
    if not image.exists():
        raise OCRError(f"Image not found: {image}")

    try:
        from PIL import Image
        import pytesseract
    except Exception as exc:
        raise OCRError(
            "OCR is not available. Install optional dependencies with "
            "`pip install -e .[ocr]`, or create a words.txt file manually."
        ) from exc

    text = pytesseract.image_to_string(Image.open(image), lang="eng")
    words = extract_word_tokens(text)
    if not words:
        raise OCRError(
            "OCR did not find English spelling words. Create a words.txt file with one word per line."
        )
    return words

