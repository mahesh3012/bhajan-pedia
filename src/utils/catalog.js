// Builds an in-memory catalog from the index Google Sheet, and the slug helpers
// that turn deities and bhajans into shareable URL segments. All routes and
// links are generated from this — nothing about the deities or bhajans is
// hardcoded, so adding a column or row in the sheet just works.

import { deityLabel, splitBhajan } from './text';

// --- slugs ---------------------------------------------------------------

export const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // drop latin diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Compact Devanagari -> Latin, used only as a slug fallback when a name has no
// roman transliteration (e.g. गोदम्मा -> "godammaa"). Not a full transliterator;
// it just needs to produce a stable, readable, URL-safe slug.
const VOWELS = {
  अ: 'a', आ: 'aa', इ: 'i', ई: 'ii', उ: 'u', ऊ: 'uu',
  ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au', ऋ: 'ri',
};
const MATRA = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
};
const SIGN = { 'ं': 'n', 'ँ': 'n', 'ः': 'h' };
const VIRAMA = '्';
const CONS = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'n',
  च: 'ch', छ: 'chh', ज: 'j', झ: 'jh', ञ: 'n',
  ट: 't', ठ: 'th', ड: 'd', ढ: 'dh', ण: 'n',
  त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm',
  य: 'y', र: 'r', ल: 'l', ळ: 'l', व: 'v',
  श: 'sh', ष: 'sh', स: 's', ह: 'h',
};

export const transliterate = (s) => {
  const chars = Array.from(s || '');
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (CONS[ch] != null) {
      out += CONS[ch];
      const next = chars[i + 1];
      if (next === VIRAMA) {
        i++; // conjunct: no inherent vowel
      } else if (MATRA[next] != null) {
        out += MATRA[next];
        i++;
      } else if (SIGN[next] != null) {
        out += 'a' + SIGN[next];
        i++;
      } else {
        out += 'a'; // inherent vowel
      }
    } else if (VOWELS[ch] != null) {
      out += VOWELS[ch];
    } else if (MATRA[ch] != null) {
      out += MATRA[ch];
    } else if (SIGN[ch] != null) {
      out += SIGN[ch];
    }
    // everything else (spaces, punctuation, digits) is dropped
  }
  return out;
};

const deitySlugBase = (label) => {
  let base = slugify(label.roman);
  if (!base) base = slugify(transliterate(label.deva));
  return base || 'deity';
};

// The leading integer of a bhajan URL segment is its key; the rest is cosmetic.
export const parseBhajanRef = (ref) => {
  const n = parseInt(String(ref ?? ''), 10);
  return Number.isNaN(n) ? null : n;
};

// The URL segment for a bhajan: "<n>-<slug>", or just "<n>" when it has no slug.
export const bhajanRefFor = (b) => (b.slug ? `${b.n}-${b.slug}` : `${b.n}`);

// --- catalog -------------------------------------------------------------

// data = the index sheet as a row array:
//   row 0 = deity column names, row 1 = per-deity sheet gids, rows 2+ = titles.
export const buildCatalog = (data) => {
  const empty = { deities: [], deityBySlug: {}, searchIndex: [] };
  if (!Array.isArray(data) || data.length < 2) return empty;

  const categories = data[0] || [];
  const gids = data[1] || [];
  const usedSlugs = new Set();
  const deities = [];

  for (let col = 0; col < categories.length; col++) {
    const rawCategory = categories[col];
    if (!rawCategory || String(rawCategory).trim() === '') continue;

    const label = deityLabel(rawCategory);

    let slug = deitySlugBase(label);
    if (usedSlugs.has(slug)) {
      let k = 2;
      while (usedSlugs.has(`${slug}-${k}`)) k++;
      slug = `${slug}-${k}`;
    }
    usedSlugs.add(slug);

    // n = 1-based position among the non-empty cells of this column — the value
    // the per-deity lyric sheets key on.
    const bhajans = [];
    for (let i = 2; i < data.length; i++) {
      const cell = data[i] ? data[i][col] : '';
      if (cell && String(cell).trim() !== '') {
        const parts = splitBhajan(cell);
        bhajans.push({
          n: bhajans.length + 1,
          slug: slugify(parts.roman),
          deva: parts.deva,
          roman: parts.roman,
          rawTitle: cell,
        });
      }
    }

    deities.push({
      slug,
      rawCategory,
      gid: gids[col] != null ? String(gids[col]) : '',
      deva: label.deva,
      roman: label.roman,
      epithet: label.epithet,
      bhajans,
    });
  }

  const deityBySlug = {};
  const searchIndex = [];
  for (const d of deities) {
    deityBySlug[d.slug] = d;
    for (const b of d.bhajans) {
      searchIndex.push({
        id: `${d.slug}-${b.n}`,
        deitySlug: d.slug,
        n: b.n,
        slug: b.slug,
        deva: b.deva,
        roman: b.roman,
        rawTitle: b.rawTitle,
      });
    }
  }

  return { deities, deityBySlug, searchIndex };
};
