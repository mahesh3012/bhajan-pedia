// Text helpers for bhajan-pedia.
// Bhajan titles arrive as "देवनागरी (Roman)"; deity categories as "Ganesh (G1)".
// These helpers split script from transliteration and give deities a Devanagari
// name + epithet — WITHOUT changing the underlying strings the app uses as keys.

const DEVANAGARI = /[ऀ-ॿ]/;

const DEITY_DEVA = {
  Ganesh: 'गणेश',
  Shiva: 'शिव',
  Rama: 'राम',
  Krishna: 'कृष्ण',
  Sharada: 'शारदा',
  Parvati: 'पार्वती',
  Lakshmi: 'लक्ष्मी',
  Hanuman: 'हनुमान',
  General: 'सर्व',
  Mandali: 'मण्डली',
};

const EPITHET = {
  Ganesh: 'विघ्नहर्ता',
  Shiva: 'महादेव',
  Rama: 'मर्यादा पुरुषोत्तम',
  Krishna: 'गिरिधर गोपाल',
  Sharada: 'वीणावादिनी',
  Parvati: 'आदिशक्ति',
  Lakshmi: 'श्री महालक्ष्मी',
  Hanuman: 'संकटमोचन',
  General: 'सर्वदेव',
  Mandali: 'सत्संग',
};

export const hasDevanagari = (s) => DEVANAGARI.test(s || '');

// Strip the trailing sheet code, e.g. "Ganesh Bhajan (G2)" -> "Ganesh Bhajan".
const stripCode = (raw) => (raw || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

// Turn a raw category into { deva, roman, epithet } for display only.
export const deityLabel = (category) => {
  const base = stripCode(category);
  if (!base) return { deva: '', roman: '', epithet: '' };

  const isBhajan = /\bBhajan\b/i.test(base);
  const key = base.replace(/\s*Bhajan\s*$/i, '').trim();

  if (hasDevanagari(base)) {
    return { deva: base, roman: '', epithet: EPITHET[key] || '' };
  }

  const deva = DEITY_DEVA[key]
    ? DEITY_DEVA[key] + (isBhajan ? ' भजन' : '')
    : base;

  return { deva, roman: base, epithet: EPITHET[key] || '' };
};

// Split a bhajan title into its Devanagari line and roman transliteration.
export const splitBhajan = (title) => {
  const t = (title || '').trim();
  const m = t.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);

  if (m) {
    const outside = m[1].trim();
    const inside = m[2].trim();
    if (hasDevanagari(outside)) return { deva: outside, roman: inside };
    if (hasDevanagari(inside)) return { deva: inside, roman: outside };
    return { deva: outside, roman: inside };
  }

  return { deva: t, roman: '' };
};
