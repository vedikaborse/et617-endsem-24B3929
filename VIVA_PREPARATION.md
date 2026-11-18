# VIVA_PREPARATION — Mission Marathi: Aksharveer! (24B3929 · P2 · T1 · L2 · C2)

## Live demo guide (≈ 4 minutes)
1. Open https://et617-24b3929.vercel.app → Home (mascot, ▶ खेलो, spoken Hindi greeting). Point out the footer `ET617 · 24B3929`.
2. ▶ → Map: 10 zones, all 🔓 unlocked. Tap व्यंजन जंगल → क → Letter Explorer (big letter, 🔊, कमळ 🪷, barakhadi strip, अभ्यास).
3. ℹ️ (About) → 🔒 Teacher panel (`#/teacher`).
4. **Scenario A:** "Run Scenario A" → tap भ, घ, कि, ब → praise, stars; on the 3rd correct answer "🚀 लेवल ऊपर!" (R1).
5. **Scenario B:** "Run Scenario B" → tap म for भाकरी → targeted hint (answer not shown), retry. Item 3: tap की → matra hint. Item 5: tap भ for मासा → COMPARE card (R3). Back in the Teacher panel, show the adaptation log.
6. **Scenario C:** C1 कमळ→"कमल" = VARIATION_ACCEPTED; C2 भ→"म" + visual evidence = LIKELY_LEARNING_ERROR; C3 no visual evidence = POSSIBLE_ERROR → tap check; C4 low confidence = UNCERTAIN. Show the "Judge pipeline" trace in the Teacher panel.
7. Live mic (Chrome): मेरी आवाज़ → 🎤 say "मोर".
8. Drag game (मात्रा मैदान): drag ◌ो into the slot of म▢र.

## Architecture (one minute)
React 18 + Vite, static, on Vercel. Hash routing (`src/main.jsx`). One dataset `src/data/marathi.js` (vowels, consonants, matras, generated barakhadi, words, look-alike pairs). `src/lib/audio.js` = TTS + WebAudio beeps. `src/lib/speech.js` = speech recognition + `judge()`. `src/lib/model.js` = localStorage learner model + adaptation rules R1–R5. Screens in `src/screens/`. No backend, no API keys.

## Why is there almost no text?
The persona cannot read Marathi or Hindi. So C2 (learner's own language) is delivered as *spoken* Hindi: the flying hero says every instruction, the demo hand shows the action, and feedback is the hero's reaction plus voice. On-screen writing is only the Marathi being learned.

## Where is progress data stored? Is it required?
Only in the tablet's localStorage (`src/lib/model.js`, key `aksharveer_v1`), with no server and no names. It is needed for adaptation (R1–R5), for the P2 judge's visual evidence, for the D8 log data and for high scores. A cloud database is not required, and leaving it out fits shared tablets, privacy and offline use.

## Likely questions
1. **Why Hindi instructions for a Marathi app?** C2 says the learner's own language. Arjun speaks Hindi at home and cannot follow Marathi instructions, so the task explanation must be in Hindi or he learns nothing. Marathi is the content, Hindi the scaffold, and both share the Devanagari script.
2. **How is C2 visible?** Every child-facing instruction, hint, feedback and reward is short spoken Hindi, and it is also spoken aloud. English appears only on the About and Teacher screens.
3. **How does L2 shape the design?** First-generation learner, so no help at home and no reading assumed: audio-first. Shared tablets: no login, no personal data, local storage, one-tap reset. NGO centre: 15-minute turns and short 6-item rounds. Weak internet: about 70 KB JS, emoji/SVG, games work offline.
4. **What NLP do you use?** Web Speech API speech recognition (mr-IN, fallback hi-IN, 5 alternatives) plus my own rule-based `judge()` that turns transcripts into a pedagogical decision.
5. **What if recognition is wrong?** A recogniser mistake can only lead to UNCERTAIN, TRY_AGAIN or a tap-check. The child is never marked wrong on speech alone. A low or unreported confidence is never judged.
6. **How do you tell an error from a variation?** Two evidence sources. Known Hindi-speaker substitutions (ळ→ल, ण→न, श→स, vowel length) are accepted as variation. A learning error needs the speech mismatch to be a look-alike that the child *also* chose in visual tap tasks (≥ 2 times). With only speech evidence, the child is asked to tap the letter.
7. **Concrete examples?** Variation: कमळ heard as "कमल" → accepted (Hindi has no ळ). Error: भ heard as "म" plus 2 visual भ/म confusions → comparison practice.
8. **What if there is no speech support or no internet?** A labelled "बिना माइक वाला खेल · कोई AI जाँच नहीं" self-check mode. Teacher demo samples are always badged DEMO / SIMULATED.
9. **How is adaptivity real?** R1 3 correct → level up (4 options + look-alike). R2 2 wrong → 2 options + picture hint. R3 same look-alike ×2 → comparison card. R4 matra errors ×2 → barakhadi review. R5 ≥ 3 hints → known letters only. All are logged with the rule ID in the Teacher panel.
10. **Which misconceptions and how are they addressed?** M1 look-alike letters (भ/म, घ/ध, ब/व, प/ष): stroke-specific hints, the COMPARE card, Game 3 and the maze. M2 matras (का as क, ि vs ी, left matra read first): the matra hint "consonant is right, change the matra", the barakhadi village with the ि rule, and drag-the-matra.
11. **Why games for barakhadi?** Barakhadi is a systematic pattern (consonant × matra). Interactively combining and hearing it builds the rule, and repetition with variety and rewards keeps an 8-year-old practising.
12. **Why are all levels unlocked?** Exploration and autonomy. The map motivates but does not gate. The difficulty adaptation happens *inside* games, not by locking zones.
13. **How do you avoid shame?** No lives or red crosses, a soft tone, a mascot that "thinks", private play, praise on retry, and speech never marked wrong.
14. **How will you evaluate?** Pre/post/retention tests built from the games (LO thresholds 80 %, 75 %, 4/5 + 3/5), logged accuracy, look-alike error rate, hints and response time. Success = ≥ 70 % of children reach all three thresholds. This is planned, not conducted.
15. **Limitations?** Marathi TTS depends on the device's voices (falls back to a Hindi voice). The recogniser is a cloud service on Chrome. The variation rules are conventional patterns, not a validated dialect model. No testing with children yet.

## Likely live-change requests and where to edit
- Add a word or letter → `src/data/marathi.js` (`WORDS`, `CONSONANTS`).
- Change Hindi feedback → `PRAISE`/`TRYAGAIN` in `src/components/ui.jsx`, `MSG` in `src/screens/Speak.jsx`.
- Change an adaptation threshold → `recordAnswer()` in `src/lib/model.js`.
- Add a variation rule / change confidence threshold → `VARIATION_RULES`, `THRESH` in `src/lib/speech.js`.
- Round length → `ROUND` in `src/screens/Game.jsx`.
- Redeploy: `npm run build` then `vercel --prod --yes` (put viva changes on a `viva` branch).
