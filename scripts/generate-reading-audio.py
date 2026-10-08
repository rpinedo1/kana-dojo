#!/usr/bin/env python3
"""
Generate pronunciation clips for every kanji reading in public/data-kanji.

Same free voice as the kana clips (see scripts/jtalk_tts.py). Each reading is
spoken as a whole word with its okurigana ("a(u) あ(う)" -> あう), matching
parseReading() in features/Kanji/lib/readings.ts. Files are named by the hex
code points of the hiragana form, so カイ and かい share one clip.

Usage:
  pip install pyopenjtalk
  python3 scripts/generate-reading-audio.py [--force]
"""

import json
import os
import re
import sys

from jtalk_tts import file_key, synthesize, to_hiragana, to_katakana

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KANJI_DIR = os.path.join(ROOT, 'public', 'data-kanji')
OUT_DIR = os.path.join(ROOT, 'public', 'sounds', 'readings')
LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']


O_ROW = 'オォコゴソゾトドノホボポモヨョロヲ'
U_ROW = 'ウゥクグスズツヅヌフブプムユュル'


def split_reading(raw: str) -> tuple[str, str]:
    """'a(u) あ(う)' -> ('あ', 'う'); 'カイ' -> ('カイ', '')."""
    kana = raw.split(' ', 1)[1] if ' ' in raw else raw
    kana = kana.strip().strip('-')
    match = re.search(r'[(（.](.*?)[)）]?$', kana)
    if not match:
        return kana, ''
    return kana[: match.start()], match.group(1)


def speech_input(stem: str, okurigana: str) -> str:
    """
    Text to feed Open JTalk. Katakana stops short readings like は or ハチ being
    read as the particle "wa", but then ou/uu is read as two vowels, so they are
    marked long (コウ -> コー) inside the stem. Okurigana stays in hiragana,
    which keeps it a separate sound: オモう is "omou", where オモウ is "omoo".
    """
    stem = to_katakana(stem)
    stem = re.sub(f'(?<=[{O_ROW}{U_ROW}])ウ', 'ー', stem)
    return stem + to_hiragana(okurigana)


def collect_readings() -> list[tuple[str, str]]:
    """(spoken hiragana, Open JTalk input) for every distinct reading."""
    seen: dict[str, tuple[str, str]] = {}
    for level in LEVELS:
        with open(os.path.join(KANJI_DIR, f'{level}.json'), encoding='utf-8') as f:
            for kanji in json.load(f):
                for raw in kanji['onyomi'] + kanji['kunyomi']:
                    stem, okurigana = split_reading(raw)
                    spoken = to_hiragana(stem + okurigana)
                    if spoken:
                        seen.setdefault(
                            file_key(spoken),
                            (spoken, speech_input(stem, okurigana)),
                        )
    return sorted(seen.values(), key=lambda item: file_key(item[0]))


def main() -> None:
    force = '--force' in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    readings = collect_readings()
    made = 0
    for spoken, text in readings:
        out_path = os.path.join(OUT_DIR, f'{file_key(spoken)}.mp3')
        if os.path.exists(out_path) and not force:
            continue
        synthesize(text, out_path)
        made += 1
    print(f'{len(readings)} readings, {made} clips written to {OUT_DIR}')


if __name__ == '__main__':
    main()
