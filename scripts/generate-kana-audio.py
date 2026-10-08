#!/usr/bin/env python3
"""
Generate pronunciation clips for every kana in features/Kana/data/kana.ts.

Uses Open JTalk (via pyopenjtalk, MIT) with the bundled HTS voice "Mei"
(Nagoya Institute of Technology, CC BY 3.0). Both are free; credit is in
public/sounds/kana/CREDITS.md.

Katakana is folded into hiragana so each sound is generated once. Files are
named by the hex code points of the hiragana form (か -> 304b.mp3), matching
getKanaClipSrc() in features/Kana/lib/kanaAudio.ts.

Usage:
  pip install pyopenjtalk
  python3 scripts/generate-kana-audio.py [--force]

Requires ffmpeg on PATH.
"""

import os
import re
import sys

from jtalk_tts import file_key, synthesize, to_hiragana, to_katakana

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KANA_DATA = os.path.join(ROOT, 'features', 'Kana', 'data', 'kana.ts')
OUT_DIR = os.path.join(ROOT, 'public', 'sounds', 'kana')

# Open JTalk reads a lone は/へ as the particles "wa"/"e", so every kana is
# spoken in its katakana form. A few still need help in isolation.
SPOKEN_OVERRIDES = {
    'ん': 'ンー',  # a lone ン is too short to hear
}

# Sounds Open JTalk cannot produce; the app falls back to the browser voice.
SKIP = {
    'ふゅ',  # read as two syllables, "fu-yu"
}


def collect_kana() -> list[str]:
    src = open(KANA_DATA, encoding='utf-8').read()
    seen: dict[str, str] = {}
    for block in re.findall(r'kana:\s*\[([^\]]*)\]', src):
        for k in re.findall(r"'([^']+)'", block):
            seen.setdefault(file_key(k), k)
    return sorted(seen.values(), key=file_key)


def main() -> None:
    force = '--force' in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    kana_list = collect_kana()
    made = 0
    for k in kana_list:
        out_path = os.path.join(OUT_DIR, f'{file_key(k)}.mp3')
        if to_hiragana(k) in SKIP:
            if os.path.exists(out_path):
                os.remove(out_path)
            continue
        if os.path.exists(out_path) and not force:
            continue
        spoken = SPOKEN_OVERRIDES.get(to_hiragana(k), to_katakana(k))
        synthesize(spoken, out_path)
        made += 1
    print(f'{len(kana_list)} kana sounds, {made} clips written to {OUT_DIR}')


if __name__ == '__main__':
    main()
