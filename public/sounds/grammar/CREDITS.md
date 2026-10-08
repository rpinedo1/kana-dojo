# Grammar sentence pronunciation clips

Generated with `scripts/generate-grammar-audio.py`.

- Speech engine: [Open JTalk](https://open-jtalk.sourceforge.net/) via
  [pyopenjtalk](https://github.com/r9y9/pyopenjtalk) (Modified BSD / MIT).
- Voice: HTS Voice "Mei", Copyright (c) 2009-2013 Nagoya Institute of
  Technology, Department of Computer Science, released by the MMDAgent Project
  Team ([mmdagent.jp](http://www.mmdagent.jp/)) under the
  [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/)
  license.

Files are named by an FNV-1a hash of each sentence's ruby text
(`speechHash()` in `features/Grammar/lib/audio.ts`), so editing a sentence
gives it a new clip; the script removes clips for sentences that no longer
exist.
