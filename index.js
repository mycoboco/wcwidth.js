/*
 *  wcwidth.js: a javascript porting of Markus Kuhn's wcwidth()
 */

const combining = require('./combining');

const DEFAULTS = {
  nul: 0,
  control: 0,
};

function bisearch(ucs) {
  let min = 0;
  let max = combining.length - 1;
  let mid;

  if (ucs < combining[0][0] || ucs > combining[max][1]) return false;

  while (max >= min) {
    mid = Math.floor((min + max) / 2);
    if (ucs > combining[mid][1]) min = mid + 1;
    else if (ucs < combining[mid][0]) max = mid - 1;
    else return true;
  }

  return false;
}

function wcwidth(ucs, opts) {
  // test for 8-bit control characters
  if (ucs === 0) return opts.nul;
  if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0)) return opts.control;

  // binary search in table of non-spacing characters
  if (bisearch(ucs)) return 0;

  // if we arrive here, ucs is not a combining or C0/C1 control character
  return 1 +
    (
      ucs >= 0x1100 && (
        ucs <= 0x115f || // Hangul Jamo init. consonants
        ucs == 0x2329 || ucs == 0x232a ||
        (ucs >= 0x2e80 && ucs <= 0xa4cf && ucs != 0x303f) || // CJK ... Yi
        (ucs >= 0xac00 && ucs <= 0xd7a3) || // Hangul Syllables
        (ucs >= 0xf900 && ucs <= 0xfaff) || // CJK Compatibility Ideographs
        (ucs >= 0xfe10 && ucs <= 0xfe19) || // Vertical forms
        (ucs >= 0xfe30 && ucs <= 0xfe6f) || // CJK Compatibility Forms
        (ucs >= 0xff00 && ucs <= 0xff60) || // Fullwidth Forms
        (ucs >= 0xffe0 && ucs <= 0xffe6) ||
        (ucs >= 0x20000 && ucs <= 0x2fffd) ||
        (ucs >= 0x30000 && ucs <= 0x3fffd)
      )
    );
}

function wcswidth(str, opts) {
  let h;
  let l;
  let s = 0;
  let n;

  if (typeof str !== 'string') return wcwidth(str, opts);

  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i);
    if (h >= 0xd800 && h <= 0xdbff) {
      l = str.charCodeAt(++i);
      if (l >= 0xdc00 && l <= 0xdfff) {
        h = (h - 0xd800) * 0x400 + (l - 0xdc00) + 0x10000;
      } else {
        i--;
      }
    }
    n = wcwidth(h, opts);
    if (n < 0) return -1;
    s += n;
  }

  return s;
}

module.exports = (str) => wcswidth(str, DEFAULTS);

module.exports.config = (opts = {}) => {
  opts = {
    ...DEFAULTS,
    ...opts,
  };

  return (str) => wcswidth(str, opts);
};

// end of wcwidth.js
