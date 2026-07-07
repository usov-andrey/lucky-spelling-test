import unittest

from lucky_spelling.words import build_entries, normalize_words, safe_audio_stem


class WordTests(unittest.TestCase):
    def test_normalizes_words_and_keeps_order(self):
        raw = [" Fungus ", "", "CACTUS", "fungus", "virus!", "two words", "well-being"]

        self.assertEqual(normalize_words(raw), ["fungus", "cactus", "virus", "well-being"])

    def test_filters_non_english_words(self):
        raw = ["кошка", "cafe", "hello123", "good-day"]

        self.assertEqual(normalize_words(raw), ["cafe", "good-day"])

    def test_strips_utf8_bom_from_first_word(self):
        raw = ["\ufeffFungus", "Cactus"]

        self.assertEqual(normalize_words(raw), ["fungus", "cactus"])

    def test_safe_audio_stem(self):
        self.assertEqual(safe_audio_stem(3, 18, "well-being"), "03_well-being")
        self.assertEqual(safe_audio_stem(12, 120, "cactus"), "012_cactus")

    def test_build_entries_default_to_mp3(self):
        entries = build_entries(["fungus", "cactus"])

        self.assertEqual(entries[0].audio, "audio/01_fungus.mp3")
        self.assertEqual(entries[1].to_json()["word"], "cactus")


if __name__ == "__main__":
    unittest.main()
