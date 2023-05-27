wcwidth.js: a javascript porting of C's wcwidth()
=================================================

> _Stick to version `1.0.2` if need to support node.js <`16.15.1`._

`wcwidth.js` is a simple javascript porting of `wcwidth()` implemented in C
[by Markus Kuhn](http://www.cl.cam.ac.uk/~mgk25/ucs/wcwidth.c).

[`wcwidth()`](http://www.opengroup.org/onlinepubs/007904975/functions/wcwidth.html)
and its string version,
[`wcswidth()`](http://www.opengroup.org/onlinepubs/007904975/functions/wcswidth.html)
are defined by IEEE Std 1002.1-2001, a.k.a. POSIX.1-2001, and return the number
of columns used to represent a wide character and string on fixed-width output
devices like terminals. Markus's implementation assumes wide characters to be
encoded in [ISO 10646](http://en.wikipedia.org/wiki/Universal_Character_Set),
which is _almost_ true for JavaScript; _almost_ because JavaScript uses
[UCS-2](http://en.wikipedia.org/wiki/UTF-16) and has problems with surrogate
pairs. `wcwidth.js` converts surrogate pairs to Unicode code points to handle
them correctly.

Following the original implementation, this library defines the column width of
an ISO 10646 character as follows:

- the null character (`U+0000`) has a column width of `opts.null` (whose
  default value is 0);
- other
  [C0/C1 control characters](http://en.wikipedia.org/wiki/C0_and_C1_control_codes)
  and `DEL` will lead to a column width of `opts.control` (whose default value
  is 0);
- non-spacing and enclosing combining characters
  ([general category code](http://www.unicode.org/reports/tr44/#GC_Values_Table)
  `Mn` or `Me`) in the Unicode database) have a column width of 0;
- `SOFT HYPHEN` (`U+00AD`) has a column width of 1;
- other format characters (general category code `Cf` in the Unicode database)
  and `ZERO WIDTH SPACE` (`U+200B`) have a column width of 0;
- Hangul Jamo medial vowels and final consonants (`U+1160`-`U+11FF`) have a
  column width of 0;
- spacing characters in the East Asian Wide (`W`) or East Asian Full-width
  (`F`) category as defined in
  [Unicode Technical Report #11](http://www.unicode.org/reports/tr11/) have a
  column width of 2; and
- all remaining characters (including all printable
  [ISO 8859-1](http://en.wikipedia.org/wiki/ISO/IEC_8859-1) and
  [WGL4 characters](http://en.wikipedia.org/wiki/Windows_Glyph_List_4), Unicode
  control characters, etc.) have a column width of 1.

A surrogate high or low value which constitutes no pair is considered to have a
column width of 1 according to the behavior of widespread terminals.

See the
[documentation](https://github.com/mycoboco/wcwidth.js/blob/master/doc/index.md)
from the C implementation for details.

`wcwidth.js` is simple to use:

    const wcwidth = require('wcwidth.js');

    wcwidth('한글'); // 4
    wcwidth('\0'); // 0; NUL
    wcwidth('\t'); // 0; control characters

If you plan to replace `NUL` or control characters with, say, `???` before
printing, use `wcwidth.config()` that returns a closure to run `wcwidth` with
your configuration:

    const mywidth = wcwidth.config({
      nul: 3,
      control: 3,
    })

    mywidth('\0\f'); // 6
    mywidth('한\t글'); // 7

Setting these options to -1 gives a function that returns -1 for a string
containing an instance of `NUL` or control characters:

    const mywidth = wcwidth.config({
      nul: 0,
      control: -1,
    });

    mywidth('java\0script'); // 10
    mywidth('java\tscript'); // -1

This is useful when detecting if a string has non-printable characters.

Due to the risk of monkey-patching, no `String` getter is provided anymore.
Even if discouraged, you can still monkey-patch by yourself as follows:

    String.prototype.__defineGetter__(
      'wcwidth',
      function () { return wcswidth(this.valueOf()) },
    );
    '한글'.wcwidth; // 4

JavaScript has no character type, thus meaningless to have two versions of
`wcwidth` while POSIX does for C. `wcwidth` also accepts a code value obtained
by `charCodeAt()`:

    wcwidth('한'); // prints 2
    wcwidth('글'.charCodeAt(0)); // prints 2

`INSTALL.md` explains how to build and install the library. For the copyright
issues, see the accompanying `LICENSE.md` file.

If you have a question or suggestion, do not hesitate to contact me via email
(woong.jun at gmail.com) or web (http://code.woong.org/).
