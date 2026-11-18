# DESIGN.md — मिशन मराठी — अक्षरवीर! (Mission Marathi: Aksharveer!)

ET 617 End-Semester Examination · 18 Nov 2026

## 1. Identity card

| Field | Value |
|---|---|
| Course | ET 617 |
| Roll number / identity token | **24B3929** |
| Problem | **P2** — Contextual language and literacy application (NLP · language learning · localisation) |
| Topic | **P2-T1** — Marathi: barakhadi / matra recognition for early readers |
| Learner context | **L2** — First-generation learner in a low-income settlement, attends an NGO after-school centre with shared tablets |
| Design constraint | **C2** — Learner's own language: all learner-facing text and feedback in the persona's language (Hindi); English optional |
| Repository | https://github.com/vedikaborse/et617-endsem-24B3929 |
| Target URL | https://et617-24b3929.vercel.app |
| Author | Vedikaborse (GitHub: vedikaborse) |

## 2. Problem statement (D1 draft)

Children of Hindi-speaking migrant families in Niphad taluka (Nashik district) attend Marathi-medium government schools, but at home they hear only Hindi. By Grade 3 many cannot reliably recognise Marathi letters, confuse visually similar letters (घ/ध, भ/म, ब/व, प/ष) and do not notice how a matra changes a consonant's sound (क → का → कि → की). Classroom instruction is in Marathi, which the child only partly understands, so explanations do not land, and wrong answers in front of peers bring embarrassment. The NGO after-school centre has a few shared Android tablets and patchy internet, but no Marathi literacy app that explains the task in the child's own language (Hindi) and listens to the child read. *Mission Marathi: Aksharveer!* is a Hindi-instructed, audio-first, game-based app that teaches Marathi letters, matras and barakhadi through short games and lets the child practise reading aloud with speech recognition that does not punish accent.

### Three measurable learning outcomes

1. **LO1 – Identify letters by sound and shape.** On hearing a Marathi letter sound, the learner **identifies** the correct letter from 3–4 choices that include one visually similar distractor (घ/ध, भ/म, ब/व, प/ष, थ/य), with ≥ 80 % accuracy over 10 items. *(Games 1, 2, 3, 7)*
2. **LO2 – Distinguish matras in barakhadi.** On hearing a syllable, the learner **distinguishes** among barakhadi forms of the same consonant (e.g. कि / की / के / का) and **places** the correct matra on a consonant to build it, with ≥ 75 % accuracy over 8 items. *(Games 5, 6, matra tasks in Game 2)*
3. **LO3 – Associate and read aloud.** The learner **matches** a letter or syllable to a familiar picture-word (क–कमळ, मो–मोर, गा–गाय) with ≥ 4 / 5 correct, and **reads aloud** 3 of 5 target syllables/words so that the speech check accepts them (accent variation allowed). *(Games 4, 6, 8)*

### Context of use

NGO after-school centre (4–6 pm), 15–20 minute turns on a shared 8-inch Android tablet, Chrome browser, sometimes offline. Occasionally at home on a parent's phone.

## 3. Learner persona (L2 seed expanded)

**Arjun Prajapati (अर्जुन), age 8, Grade 3**, Zilla Parishad Marathi-medium school, Niphad, Nashik.

- **Background:** Family migrated from Uttar Pradesh; father loads onion sacks at the Lasalgaon APMC market, mother works in grape vineyards. First generation in the family to attend school (L2). Lives in a low-income workers' settlement at the edge of town. *(L2 card says "urban low-income settlement"; our specific scenario is a semi-urban labour settlement in Niphad. The L2 features we design for are identical: first-generation, NGO after-school centre, shared tablets.)*
- **Language:** Speaks Hindi (Awadhi-influenced) at home. Understands simple spoken Marathi from friends but cannot follow Marathi instructions in class. Has no ळ sound in his speech and says "कमल" for कमळ.
- **Prior knowledge:** Recognises about 8–10 Devanagari letters by shape (क, म, र, स, अ, आ). Knows the sound "ka/ma" but not the full barakhadi. Does not notice matras; reads का and क the same. Can count to 20, recognises pictures easily.
- **Device & time:** Shared Android tablet at the NGO centre, ~15 minutes per turn, 4 days a week. Shared device ⇒ no login, quick reset, no personal data.
- **Motivation:** Loves cartoons, superheroes and the NGO didi (tutor) at the centre; wants to read signboards and his sister's Marathi storybook. Gets quiet and stops trying when corrected harshly.
- **Strengths:** Strong listening, good visual memory for pictures, enjoys games and collecting stars.
- **Challenges:** Cannot read instructions (Hindi or Marathi), low confidence, short attention span, embarrassment over mistakes.
- **Learning preferences:** Listening over reading, tapping big pictures, repetition with variation, immediate praise.

### Two misconceptions (used throughout the app)

- **M1 – Look-alike letter confusion.** Arjun treats visually similar letters as the same letter because he attends to the overall shape and ignores the distinguishing stroke: he reads **ध as घ**, **म as भ**, **व as ब**, **ष as प**. Evidence in-app: choosing the look-alike distractor in Games 1/2/3/7.
- **M2 – "Matra doesn't change the sound / left matra comes first".** Arjun ignores the matra or mixes short and long matras: he reads **का as क**, and confuses **ि (short, written on the left) with ी (long, on the right)**, picking की when he hears कि, or believes the ि stroke is read *before* the consonant. Evidence in-app: wrong barakhadi choice in Games 2/5/6.

## 4. Learning content plan

- **स्वर (vowels):** अ आ इ ई उ ऊ ए ऐ ओ औ अं अः with picture words (अननस, आंबा, इंजिन, ईडलिंबू, उंदीर, ऊस, एडका, ओठ, औषध, अंगठी).
- **व्यंजन (consonants):** क–ह core set (34 incl. ळ) with familiar rural picture words (कमळ, गाय, घर, चिमणी, छत्री, झाड, ढग, दप्तर, धनुष्य, नळ, पतंग, बदक, भाकरी, मासा, मोर, ससा, हत्ती, कांदा …).
- **मात्रा:** ा ि ी ु ू े ै ो ौ ं ः, with the vowel each one stands for.
- **बाराखडी:** generated from data for every consonant (क का कि की कु कू के कै को कौ कं कः).
- **Look-alike sets:** घ/ध, भ/म, ब/व, प/ष, थ/य, ड/ङ, ट/ठ, ड/ढ, इ/ई, उ/ऊ.
- One structured dataset (`src/data/marathi.js`) drives every screen and game; adding letters/words means adding rows.

## 5. Screen plan (all zones unlocked from the start)

1. **Home / start** — mascot "अक्षरवीर" (original cartoon hero) + parrot sidekick "मिठू", big ▶ play, audio toggle.
2. **Journey map** — 7 illustrated zones, all open: स्वर पर्वत, व्यंजन जंगल, मात्रा मैदान, बाराखडी गाँव, शब्द खजाना, ध्वनि चुनौती, आवाज़ गुफा (speech).
3. **Letter explorer** — giant letter, 🔊, Hindi explanation, picture word, its barakhadi, practice button.
4. **Game screen** (Games 1, 2, 3, 7) — spoken prompt, 3–4 big options, feedback, progress.
5. **Match / place game** (Games 4, 6) — tap-to-select + tap-to-place (and native drag on desktop).
6. **Barakhadi explorer** (Game 5) — consonant picker × matra picker → syllable + audio + explanation.
7. **Speech practice** (Game 8) — mic, listening state, transcript, decision.
8. **Reward screen** — stars, confetti, hero animation, replay / map.
9. **Teacher / demo panel** (`#/teacher`, small 🔒 icon, long-press) — scenarios A/B/C, adaptation log, speech log, progress, reset.
10. **About** — identity, card, AI features, credits.

Footer `ET617 · 24B3929` on every screen.

## 6. Game plan

| # | Game (Hindi title) | Skill | Mechanic |
|---|---|---|---|
| 1 | सुनो और पहचानो | LO1 | hear sound → tap letter |
| 2 | सही अक्षर चुनो | LO1, LO2 | picture/sound prompt → choose letter or syllable, adaptive distractors |
| 3 | मिलती-जुलती आकृति खोजो | LO1 (M1) | find exact twin of target among look-alikes, distinguishing stroke highlighted on error |
| 4 | अक्षर और चित्र मिलाओ | LO3 | pair letters with pictures (tap–tap matching) |
| 5 | बाराखडी बनाओ | LO2 (M2) | pick consonant + matra, see/hear result; then "build the heard syllable" |
| 6 | खींचो और रखो | LO2, LO3 | drag (or tap-then-tap) matra/letter into slot of a picture word |
| 7 | अक्षर भूलभुलैया | LO1 | grid treasure path: hear sound, step only on that letter |
| 8 | मेरी आवाज़ | LO3, NLP | speak syllable/word, speech recognition + variation-aware judgement |

## 7. Adaptation (rule-based, transparent)

Per-skill learner model in localStorage: attempts, correct, streak, wrong-streak, hint count, confusion counts per letter pair.

- correct streak ≥ 3 → **LEVEL UP**: 4 options + look-alike distractors.
- 2 wrong in a row → **SIMPLIFY**: 2 options, picture hint shown.
- same look-alike confusion ≥ 2 times → **COMPARE**: side-by-side comparison card with the distinguishing stroke highlighted (targets M1).
- matra error ≥ 2 times → **MATRA REVIEW**: back to barakhadi explorer for that consonant (targets M2).
- hints ≥ 3 in a round → easier items (known letters only).
All decisions are logged with the rule that fired and shown in the teacher panel.

## 8. NLP plan (P2)

- **Speech recognition:** browser Web Speech API (`webkitSpeechRecognition`), `lang = 'mr-IN'` (fallback `hi-IN`), `maxAlternatives = 5`, interim results off. Runs in Chrome / Android Chrome / Edge. No API keys.
- **Judgement pipeline:** transcripts → Devanagari normalisation → (1) exact match → (2) match after *acceptable-variation rules* → (3) confidence check → (4) look-alike-error check cross-referenced with visual-task evidence → decision: `CORRECT`, `VARIATION_ACCEPTED`, `UNCERTAIN`, `POSSIBLE_ERROR`, `LIKELY_LEARNING_ERROR`, `TRY_AGAIN`.
- **Acceptable variation rules (documented, conventional):** ळ→ल (Hindi has no ळ; Hindi speakers say कमल for कमळ), ी↔ि and ू↔ु (vowel length is weakly contrasted in everyday speech), ण→न, श↔स, chandrabindu/anusvara.
- **Uncertainty:** low or missing confidence ⇒ never judged wrong; child is asked to repeat or tap the letter (visual evidence).
- **Fallback:** if unsupported / offline / mic denied ⇒ "बिना माइक वाला खेल" (self-check: listen, say aloud, tap 👍) clearly labelled **डेमो / बिना AI**; teacher panel can inject recorded sample transcripts, labelled "SIMULATED".
- **TTS:** `speechSynthesis` with mr-IN voice → hi-IN voice → none (visual captions + pulse animation).

## 9. C2 implementation

All learner-facing strings live in one Hindi string table (`src/data/strings.js`), short spoken-style Hindi ("सही अक्षर पर टैप करो!", "चलो, फिर कोशिश करते हैं!"). Every instruction is also spoken (hi-IN TTS) with a 🔊 repeat button. Marathi appears only as the learning content. Optional English toggle only in About/teacher area (not on child screens). Icons + pictures carry meaning so reading is not required.

## 10. P2 design challenge strategy

Evidence from two channels: **speech** (what the recogniser heard + confidence) and **visual** (what the child taps in recognition games). A speech mismatch alone never counts as a literacy error.
- **Variation example (Scenario C):** target कमळ; recogniser returns "कमल" → rule ळ→ल fires → `VARIATION_ACCEPTED`, praise + gentle model of ळ.
- **Error example (Scenario B):** target भ (भाकरी); child says "म…" *and* chose म for भ in visual games ≥ 2 times → `LIKELY_LEARNING_ERROR` → comparison card भ vs म, retry.
- **Uncertainty:** confidence < 0.45 or empty → `UNCERTAIN` → "मैं ठीक से सुन नहीं पाया" + tap-to-confirm.

## 11. Evaluation plan (summary — D8 in report)

Pre/post 10-item letter test and 8-item matra test built from the in-app games; logged accuracy, attempts, hints, response time, confusion pairs; success = LO thresholds above for ≥ 70 % of learners after 2 weeks, retention check after 1 more week. No names stored; learner selects an avatar only.

## 12. Technology choices

- React 18 + Vite (JavaScript), plain CSS design system, inline SVG + emoji pictures (no images > 50 KB).
- Web Speech API (SpeechSynthesis + SpeechRecognition), localStorage learner model.
- Hash routing (deep links for teacher demo), no backend, no API keys.
- Deployed on Vercel as a static site.

## 13. Iteration 2 (after review): voice + visuals, no reading
The child cannot read Hindi either, so C2 is met through **spoken** Hindi. A flying hero guide speaks every instruction, an animated demo hand shows tap/drag actions, child screens carry icons and Marathi content only, and every zone has a light animated themed scene (jungle, mountain, village, field, river, fair, treasure island, cave).

## 14. Iteration 3: coconut bonk and session high scores
Wrong answer → a coconut lands on the hero's head (bonk + sad face + wah-wah sound), followed straight away by a spoken hint. It is aimed at the mascot, never the child. Session high scores (📅🏆 today, 👑 all-time) are shown on the reward screen and the map, with a session table in the Teacher panel. All data is in localStorage only (`src/lib/model.js`).
