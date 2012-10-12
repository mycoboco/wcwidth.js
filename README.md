  wcwidth.js: A JavaScript Porting of Markus Kuhn's wcwidth() Implementation
  ==========================================================================

  wcwidth.js is a simple JavaScript porting of wcwidth() implemented in C by
  Markus Kuhn (the original implementation can be found on
  http://www.cl.cam.ac.uk/~mgk25/ucs/wcwidth.c). wcwidth() and its string
  version, wcswidth() are defined by IEEE Std 1002.1-2001, a.k.a. POSIX.1-2001,
  and return the number of columns used to represent the given wide character
  and string. Markus's implementation assumes the wide character given to those
  functions to be encoded in ISO 10646, which is almost true for JavaScript's
  characters.

  For convenience, wcwidth.js sets the getter of the property named 'wcwidth'
  for the String type. You don't need to invoke a function to get the width of
  strings, but inspecting the wcwidth property is enough. The following code
  snippet shows how to use wcwidth.js:

    var wcwidth = require('wcwidth')({
        nul:     0,
        control: -1
    });    // equivalent to var wcwidth = require('wcwidth')();

    console.log("한글".wcwidth);    // prints 4
    console.log("\0".wcwidth);      // prints 0
    console.log("\t".wcwidth);      // prints -1

  The argument '{ nul: 0, control: -1 }' (which are the default values, in fact)
  tells wcwidth.js to return 0 for the NUL character and -1 for non-printable
  control characters. Setting a negative value to 'nul' or 'control' makes the
  wcwidth property set to -1 for any string that contains NUL or control
  characters respectively. If you plan to replace each control character with,
  say, '???' when printing, you can 'require' wcwidth.js as follows:

    var wcwidth = require('wcwidth')({
        control: 3
    });    // leaving nul as 0

    console.log("\t".wcwidth);    // prints 3
    console.log("\0".wcwidth);    // prints 0

  wcwidth.js also provides a methods. Since JavaScript has no character type, it
  is meaningless to have two versions while POSIX does for C. The method also
  accepts a code value that can be obtained by the charCodeAt() method.

    console.log(wcwidth('한'));                 // prints 2
    console.log(wcwidth('글'.charCodeAt(0));    // prints 2
    console.log(wcwidth('한글'));               // prints 4

  For the copyright issues, see the accompanying LICENSE file.

  If you have a question or suggestion, do not hesitate to contact me via email
  <woong.jun@gmail.com> or web <http://code.woong.org/>.
