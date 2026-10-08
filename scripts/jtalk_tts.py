"""
Shared Open JTalk helpers for the pronunciation clip generators.

Uses pyopenjtalk (MIT) with its bundled HTS voice "Mei" (Nagoya Institute of
Technology, CC BY 3.0). Requires ffmpeg on PATH.
"""

import os
import subprocess
import tempfile
import wave

import numpy as np
import pyopenjtalk


def to_hiragana(text: str) -> str:
    return ''.join(
        chr(ord(c) - 0x60) if 0x30A1 <= ord(c) <= 0x30F6 else c for c in text
    )


def to_katakana(text: str) -> str:
    return ''.join(
        chr(ord(c) + 0x60) if 0x3041 <= ord(c) <= 0x3096 else c for c in text
    )


def file_key(text: str) -> str:
    return '-'.join(f'{ord(c):x}' for c in to_hiragana(text))


def synthesize(spoken: str, out_path: str) -> None:
    """Speak `spoken` with Open JTalk and save it as a trimmed, normalized mp3."""
    samples, sr = pyopenjtalk.tts(spoken)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        wav_path = tmp.name
    try:
        with wave.open(wav_path, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes(np.clip(samples, -32768, 32767).astype(np.int16).tobytes())
        subprocess.run(
            [
                'ffmpeg', '-y', '-loglevel', 'error', '-i', wav_path,
                # Trim leading/trailing silence, then normalize loudness.
                '-af',
                'silenceremove=start_periods=1:start_threshold=-60dB,'
                'areverse,silenceremove=start_periods=1:start_threshold=-60dB,'
                'areverse,apad=pad_dur=0.05,loudnorm=I=-18:TP=-2',
                '-ac', '1', '-ar', '24000', '-b:a', '48k', out_path,
            ],
            check=True,
        )
    finally:
        os.remove(wav_path)
