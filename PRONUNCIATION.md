# Pronunciation Guide — Voice Rendering Fixes

When F5-TTS mispronounces a word, add the fix here. Use the phonetic version in voice scripts only (not in post text).

## Rules
- No ALL CAPS (model reads letter by letter)
- Use ellipsis (four dots ....) for pauses
- Avoid ambiguous homographs — rewrite instead

## Known Fixes

| Word/Phrase | Problem | Fix |
|-------------|---------|-----|
| lives (noun) | says "livz" (verb) | use "their existence" or "nine liyvz" |
| lives (verb) | says "liyvz" (noun) | use "is alive" or "resides" |
| read (past) | says "reed" | use "red" or rephrase |
| lead (metal) | says "leed" | use "led" (the metal) |
| the cosmos is all that is | first phrase elided | add ellipsis: "the cosmos.... is all that is" |

## Flagged Clips (fix and re-render)

| Clip | Timestamp | Issue | Status |
|------|-----------|-------|--------|
| sagan commercial (cosmos) | 0:03 | first phrase elided/mispronounced | needs re-render |

## Tips
- Longer text = fewer hallucinations (model stays on script better)
- Ellipsis pacing reduces rushing
- Phonetic spelling works: "NASS-uh" for NASA, "KWAZ-eye-crystals" for quasicrystals
