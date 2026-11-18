// Single structured dataset for Mission Marathi: Aksharveer!
// Marathi = learning content. Hindi = instruction language (C2).
// To extend: add a row to VOWELS / CONSONANTS / WORDS. Barakhadi is generated from MATRAS.

// स्वर (vowels). `say` = text sent to TTS, `hi` = Hindi hint, `word` = picture word key.
export const VOWELS = [
  { l: 'अ', say: 'अ', hi: '"अ" — जैसे अननस', word: 'अननस' },
  { l: 'आ', say: 'आ', hi: '"आ" — लंबा अ, जैसे आंबा (आम)', word: 'आंबा' },
  { l: 'इ', say: 'इ', hi: '"इ" — छोटी इ, जैसे इंजिन', word: 'इंजिन' },
  { l: 'ई', say: 'ई', hi: '"ई" — बड़ी ई, जैसे ईडलिंबू', word: 'ईडलिंबू' },
  { l: 'उ', say: 'उ', hi: '"उ" — छोटा उ, जैसे उंदीर (चूहा)', word: 'उंदीर' },
  { l: 'ऊ', say: 'ऊ', hi: '"ऊ" — बड़ा ऊ, जैसे ऊस (गन्ना)', word: 'ऊस' },
  { l: 'ए', say: 'ए', hi: '"ए" — जैसे एडका (मेढ़ा)', word: 'एडका' },
  { l: 'ऐ', say: 'ऐ', hi: '"ऐ" — जैसे ऐरण', word: null },
  { l: 'ओ', say: 'ओ', hi: '"ओ" — जैसे ओठ (होंठ)', word: 'ओठ' },
  { l: 'औ', say: 'औ', hi: '"औ" — जैसे औषध (दवाई)', word: 'औषध' },
  { l: 'अं', say: 'अं', hi: '"अं" — नाक से बोलो, जैसे अंगठी', word: 'अंगठी' },
  { l: 'अः', say: 'अः', hi: '"अः" — आख़िर में हल्की साँस', word: null },
];

// व्यंजन (consonants). group = row of the traditional chart.
export const CONSONANTS = [
  { l: 'क', g: 'क-वर्ग', word: 'कमळ' }, { l: 'ख', g: 'क-वर्ग', word: 'खार' },
  { l: 'ग', g: 'क-वर्ग', word: 'गाय' }, { l: 'घ', g: 'क-वर्ग', word: 'घर' },
  { l: 'ङ', g: 'क-वर्ग', word: null },
  { l: 'च', g: 'च-वर्ग', word: 'चमचा' }, { l: 'छ', g: 'च-वर्ग', word: 'छत्री' },
  { l: 'ज', g: 'च-वर्ग', word: 'जहाज' }, { l: 'झ', g: 'च-वर्ग', word: 'झाड' },
  { l: 'ञ', g: 'च-वर्ग', word: null },
  { l: 'ट', g: 'ट-वर्ग', word: 'टरबूज' }, { l: 'ठ', g: 'ट-वर्ग', word: null },
  { l: 'ड', g: 'ट-वर्ग', word: 'डोळा' }, { l: 'ढ', g: 'ट-वर्ग', word: 'ढग' },
  { l: 'ण', g: 'ट-वर्ग', word: null },
  { l: 'त', g: 'त-वर्ग', word: 'तारा' }, { l: 'थ', g: 'त-वर्ग', word: 'थेंब' },
  { l: 'द', g: 'त-वर्ग', word: 'दप्तर' }, { l: 'ध', g: 'त-वर्ग', word: 'धनुष्य' },
  { l: 'न', g: 'त-वर्ग', word: 'नळ' },
  { l: 'प', g: 'प-वर्ग', word: 'पतंग' }, { l: 'फ', g: 'प-वर्ग', word: 'फूल' },
  { l: 'ब', g: 'प-वर्ग', word: 'बदक' }, { l: 'भ', g: 'प-वर्ग', word: 'भाकरी' },
  { l: 'म', g: 'प-वर्ग', word: 'मासा' },
  { l: 'य', g: 'अन्य', word: null }, { l: 'र', g: 'अन्य', word: 'रंग' },
  { l: 'ल', g: 'अन्य', word: 'लसूण' }, { l: 'व', g: 'अन्य', word: 'वटवाघूळ' },
  { l: 'श', g: 'अन्य', word: 'शहाळे' }, { l: 'ष', g: 'अन्य', word: null },
  { l: 'स', g: 'अन्य', word: 'ससा' }, { l: 'ह', g: 'अन्य', word: 'हत्ती' },
  { l: 'ळ', g: 'अन्य', word: null },
];

// मात्रा. v = vowel it stands for, side = where it sits (for Hindi explanation).
export const MATRAS = [
  { m: '', v: 'अ', name: 'बिना मात्रा', side: 'none', hi: 'कोई मात्रा नहीं — "अ" की आवाज़ अपने-आप' },
  { m: 'ा', v: 'आ', name: 'काना', side: 'right', hi: 'दाईं तरफ़ खड़ी लकीर — आवाज़ लंबी "आ"' },
  { m: 'ि', v: 'इ', name: 'पहिली वेलांटी', side: 'left', hi: 'बाईं तरफ़ लिखते हैं, पर बोलते बाद में — छोटी "इ"' },
  { m: 'ी', v: 'ई', name: 'दुसरी वेलांटी', side: 'right', hi: 'दाईं तरफ़ — बड़ी "ई"' },
  { m: 'ु', v: 'उ', name: 'पहिला उकार', side: 'below', hi: 'नीचे छोटा हुक — छोटा "उ"' },
  { m: 'ू', v: 'ऊ', name: 'दुसरा उकार', side: 'below', hi: 'नीचे उल्टा हुक — बड़ा "ऊ"' },
  { m: 'े', v: 'ए', name: 'एक मात्रा', side: 'top', hi: 'ऊपर एक तिरछी लकीर — "ए"' },
  { m: 'ै', v: 'ऐ', name: 'दोन मात्रा', side: 'top', hi: 'ऊपर दो लकीरें — "ऐ"' },
  { m: 'ो', v: 'ओ', name: 'काना + एक मात्रा', side: 'right-top', hi: 'काना और ऊपर एक लकीर — "ओ"' },
  { m: 'ौ', v: 'औ', name: 'काना + दोन मात्रा', side: 'right-top', hi: 'काना और ऊपर दो लकीरें — "औ"' },
  { m: 'ं', v: 'अं', name: 'अनुस्वार', side: 'top', hi: 'ऊपर बिंदी — नाक से "अं"' },
  { m: 'ः', v: 'अः', name: 'विसर्ग', side: 'right', hi: 'दाईं तरफ़ दो बिंदियाँ — "अः"' },
];

export const barakhadi = (c) => MATRAS.map((x) => c + x.m);

// Picture words. first = first syllable (letter + matra), c = consonant/vowel it teaches.
// Culturally chosen for rural Nashik: onion (Lasalgaon), sugarcane, bhakri, bullock-farm animals.
export const WORDS = {
  'अननस': { e: '🍍', hi: 'अनानास', first: 'अ' },
  'आंबा': { e: '🥭', hi: 'आम', first: 'आं' },
  'इंजिन': { e: '🚂', hi: 'इंजन', first: 'इं' },
  'ईडलिंबू': { e: '🍋', hi: 'बड़ा नींबू', first: 'ई' },
  'उंदीर': { e: '🐁', hi: 'चूहा', first: 'उं' },
  'ऊस': { e: '🎋', hi: 'गन्ना', first: 'ऊ' },
  'एडका': { e: '🐏', hi: 'मेढ़ा', first: 'ए' },
  'ओठ': { e: '👄', hi: 'होंठ', first: 'ओ' },
  'औषध': { e: '💊', hi: 'दवाई', first: 'औ' },
  'अंगठी': { e: '💍', hi: 'अंगूठी', first: 'अं' },
  'कमळ': { e: '🪷', hi: 'कमल', first: 'क' },
  'कान': { e: '👂', hi: 'कान', first: 'का' },
  'कांदा': { e: '🧅', hi: 'प्याज़', first: 'कां' },
  'किल्ला': { e: '🏰', hi: 'किला', first: 'कि' },
  'कुत्रा': { e: '🐕', hi: 'कुत्ता', first: 'कु' },
  'केळे': { e: '🍌', hi: 'केला', first: 'के' },
  'कोंबडा': { e: '🐓', hi: 'मुर्गा', first: 'कों' },
  'खार': { e: '🐿️', hi: 'गिलहरी', first: 'खा' },
  'गाय': { e: '🐄', hi: 'गाय', first: 'गा' },
  'गुलाब': { e: '🌹', hi: 'गुलाब', first: 'गु' },
  'घर': { e: '🏠', hi: 'घर', first: 'घ' },
  'घड्याळ': { e: '⏰', hi: 'घड़ी', first: 'घ' },
  'चमचा': { e: '🥄', hi: 'चम्मच', first: 'च' },
  'चिमणी': { e: '🐦', hi: 'चिड़िया', first: 'चि' },
  'छत्री': { e: '☂️', hi: 'छाता', first: 'छ' },
  'जहाज': { e: '🚢', hi: 'जहाज़', first: 'ज' },
  'झाड': { e: '🌳', hi: 'पेड़', first: 'झा' },
  'टरबूज': { e: '🍉', hi: 'तरबूज़', first: 'ट' },
  'टोपी': { e: '🧢', hi: 'टोपी', first: 'टो' },
  'डोळा': { e: '👁️', hi: 'आँख', first: 'डो' },
  'ढग': { e: '☁️', hi: 'बादल', first: 'ढ' },
  'तारा': { e: '⭐', hi: 'तारा', first: 'ता' },
  'थेंब': { e: '💧', hi: 'बूँद', first: 'थें' },
  'दप्तर': { e: '🎒', hi: 'बस्ता', first: 'द' },
  'धनुष्य': { e: '🏹', hi: 'धनुष', first: 'ध' },
  'नळ': { e: '🚰', hi: 'नल', first: 'न' },
  'नाक': { e: '👃', hi: 'नाक', first: 'ना' },
  'पतंग': { e: '🪁', hi: 'पतंग', first: 'प' },
  'पान': { e: '🍃', hi: 'पत्ता', first: 'पा' },
  'पुस्तक': { e: '📚', hi: 'किताब', first: 'पु' },
  'फूल': { e: '🌺', hi: 'फूल', first: 'फू' },
  'बदक': { e: '🦆', hi: 'बत्तख़', first: 'ब' },
  'भाकरी': { e: '🫓', hi: 'भाकरी (रोटी)', first: 'भा' },
  'मासा': { e: '🐟', hi: 'मछली', first: 'मा' },
  'मोर': { e: '🦚', hi: 'मोर', first: 'मो' },
  'मेंढी': { e: '🐑', hi: 'भेड़', first: 'में' },
  'रंग': { e: '🎨', hi: 'रंग', first: 'रं' },
  'लसूण': { e: '🧄', hi: 'लहसुन', first: 'ल' },
  'वटवाघूळ': { e: '🦇', hi: 'चमगादड़', first: 'व' },
  'शहाळे': { e: '🥥', hi: 'कच्चा नारियल', first: 'श' },
  'ससा': { e: '🐇', hi: 'खरगोश', first: 'स' },
  'साप': { e: '🐍', hi: 'साँप', first: 'सा' },
  'हत्ती': { e: '🐘', hi: 'हाथी', first: 'ह' },
};

// Base consonant of a word (for grouping in the letter explorer).
export const wordsFor = (letter) =>
  Object.entries(WORDS)
    .filter(([w]) => w.startsWith(letter))
    .map(([w, d]) => ({ w, ...d }));

// Look-alike sets — the M1 misconception. `diff` = the distinguishing feature, in Hindi.
export const LOOKALIKES = [
  { a: 'घ', b: 'ध', diff: 'घ के ऊपर लकीर पूरी जुड़ी है; ध में बाईं गाँठ के ऊपर लकीर टूटी होती है' },
  { a: 'भ', b: 'म', diff: 'भ में बाईं तरफ़ एक छोटी पूँछ (मोड़) है; म में नहीं' },
  { a: 'ब', b: 'व', diff: 'ब के बीच में तिरछी लकीर है; व में बीच खाली है' },
  { a: 'प', b: 'ष', diff: 'ष के बीच में एक तिरछी लकीर कटती है; प में नहीं' },
  { a: 'थ', b: 'य', diff: 'थ में बाईं तरफ़ एक छोटी गाँठ है; य में नहीं' },
  { a: 'ड', b: 'ङ', diff: 'ङ के दाईं तरफ़ एक बिंदी है' },
  { a: 'ट', b: 'ठ', diff: 'ट नीचे खुला हुक है; ठ नीचे बंद गोल है' },
  { a: 'ड', b: 'ढ', diff: 'ढ के नीचे एक छोटी गोल पूँछ है' },
  { a: 'इ', b: 'ई', diff: 'ई के ऊपर एक और घुमावदार लकीर है' },
  { a: 'उ', b: 'ऊ', diff: 'ऊ में दाईं तरफ़ एक और पूँछ है' },
];

export const lookalikeOf = (l) =>
  LOOKALIKES.filter((p) => p.a === l || p.b === l).map((p) => (p.a === l ? p.b : p.a));

export const pairInfo = (x, y) =>
  LOOKALIKES.find((p) => (p.a === x && p.b === y) || (p.a === y && p.b === x));

// Core consonants used for barakhadi practice (most common, have picture words).
export const BARAKHADI_CORE = ['क', 'ग', 'म', 'प', 'स', 'न', 'च', 'ट', 'ब', 'भ'];
// Matras used in early practice (skip ः for beginners).
export const EARLY_MATRAS = MATRAS.slice(0, 11);

export const ALL_LETTERS = [...VOWELS.map((v) => v.l), ...CONSONANTS.map((c) => c.l)];
