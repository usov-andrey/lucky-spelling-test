import json
import tempfile
import unittest
from pathlib import Path

from lucky_spelling.site import write_site
from lucky_spelling.words import build_entries


class SiteGenerationTests(unittest.TestCase):
    def test_writes_static_site(self):
        entries = build_entries(["fungus", "cactus"])

        with tempfile.TemporaryDirectory() as temp_dir:
            out = Path(temp_dir) / "docs"
            write_site(out, entries)

            html = (out / "index.html").read_text(encoding="utf-8")
            data = json.loads((out / "words.json").read_text(encoding="utf-8"))

            self.assertTrue((out / ".nojekyll").exists())
            self.assertTrue((out / "styles.css").exists())
            self.assertTrue((out / "app.js").exists())
            self.assertIn("Repeat word", html)
            self.assertIn("Restart", html)
            self.assertIn(">Start<", html)
            self.assertIn("Learn this word", html)
            self.assertNotIn("Show word", html)
            self.assertLess(html.index('id="next"'), html.index('id="back"'))
            self.assertLess(html.index('id="auto-repeat"'), html.index('id="finish-screen"'))
            self.assertIn("autoRepeat: true", (out / "app.js").read_text(encoding="utf-8"))
            self.assertEqual(data["words"][0]["audio"], "audio/01_fungus.mp3")
            self.assertEqual(data["words"][1]["word"], "cactus")

    def test_writes_learning_metadata_and_copies_image(self):
        entries = build_entries(["author"])

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            image_dir = root / "lesson" / "images"
            image_dir.mkdir(parents=True)
            (image_dir / "author.svg").write_text("<svg></svg>", encoding="utf-8")
            lesson = {
                "title": "Lucky Spelling Test",
                "pageLabel": "Page 22",
                "topic": "Schwa ‹or›",
                "words": [{
                    "word": "author",
                    "definition": "A person who writes books.",
                    "image": "images/author.svg",
                    "imageAlt": "A writer",
                    "imageCredit": {"name": "OpenMoji"},
                }],
            }
            out = root / "docs"

            write_site(
                out,
                entries,
                lesson=lesson,
                lesson_dir=root / "lesson",
                definition_audio_suffixes={1: ".wav"},
            )

            data = json.loads((out / "words.json").read_text(encoding="utf-8"))
            self.assertEqual(data["pageLabel"], "Page 22")
            self.assertEqual(data["words"][0]["definition"], "A person who writes books.")
            self.assertEqual(data["words"][0]["definitionAudio"], "audio/definitions/01_author.wav")
            self.assertTrue((out / "images" / "author.svg").exists())


if __name__ == "__main__":
    unittest.main()
