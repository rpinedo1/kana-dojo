#!/usr/bin/env python3
"""
Generate a clip for every Japanese sentence and word in the Grammar dojo.

Same free voice as the kana and kanji clips (see scripts/jtalk_tts.py). The
sentence list comes from scripts/list-grammar-speech.ts; file names are a hash
of the ruby text (features/Grammar/lib/audio.ts), and clips for sentences that
no longer exist are removed.

Open JTalk reads the sentence with its kanji, which keeps particles and word
boundaries natural. When its reading of a kanji differs from the lesson's
furigana (日本人 as "nippon-jin", 降ります as "orimasu"), the furigana reading
is spoken instead.

Usage:
  pip install pyopenjtalk
  python3 scripts/generate-grammar-audio.py [--force]
"""

import json
import os
import re
import subprocess
import sys

import pyopenjtalk

from jtalk_tts import synthesize, to_katakana

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'sounds', 'grammar')
PUNCTUATION = re.compile(r'[\s。、？！?!「」…〜・,.／]')


def list_sentences() -> list[dict]:
    result = subprocess.run(
        ['npx', 'tsx', 'scripts/list-grammar-speech.ts'],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def speech_input(text: str, kana: str) -> str:
    """The sentence as written, unless Open JTalk would misread a kanji."""
    reading = ''.join(word['read'] for word in pyopenjtalk.run_frontend(text))
    if PUNCTUATION.sub('', reading) == PUNCTUATION.sub('', to_katakana(kana)):
        chosen = text
    else:
        chosen = kana
    # '何／何' lists alternatives: pause between them. '〜ません' is an ending.
    return chosen.replace('／', '、').strip('〜～')


def main() -> None:
    force = '--force' in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    sentences = list_sentences()
    made = 0
    from_kana = 0
    for sentence in sentences:
        out_path = os.path.join(OUT_DIR, sentence['file'])
        if os.path.exists(out_path) and not force:
            continue
        spoken = speech_input(sentence['text'], sentence['kana'])
        if spoken != sentence['text'].replace('／', '、').strip('〜～'):
            from_kana += 1
        synthesize(spoken, out_path)
        made += 1

    wanted = {sentence['file'] for sentence in sentences}
    stale = [f for f in os.listdir(OUT_DIR) if f.endswith('.mp3') and f not in wanted]
    for name in stale:
        os.remove(os.path.join(OUT_DIR, name))

    print(
        f'{len(sentences)} sentences, {made} clips written '
        f'({from_kana} read from furigana), {len(stale)} stale removed -> {OUT_DIR}'
    )


if __name__ == '__main__':
    main()
