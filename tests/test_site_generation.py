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
            self.assertIn("Start", html)
            self.assertIn("Repeat word", html)
            self.assertIn("Show word", html)
            self.assertIn("Restart", html)
            self.assertIn("autoRepeat: true", (out / "app.js").read_text(encoding="utf-8"))
            self.assertEqual(data[0]["audio"], "audio/01_fungus.mp3")
            self.assertEqual(data[1]["word"], "cactus")


if __name__ == "__main__":
    unittest.main()
