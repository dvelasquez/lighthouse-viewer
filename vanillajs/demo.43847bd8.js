// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"yh9p":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"JgNJ":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"REa7":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"dskh":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"yh9p","ieee754":"JgNJ","isarray":"REa7","buffer":"dskh"}],"wvMH":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReport = V;
const e = {
  label: "pass",
  minScore: .9
},
      t = {
  label: "average",
  minScore: .5
},
      n = {
  label: "fail"
},
      r = {
  label: "error"
},
      o = ["com", "co", "gov", "edu", "ac", "org", "go", "gob", "or", "net", "in", "ne", "nic", "gouv", "web", "spb", "blog", "jus", "kiev", "mil", "wi", "qc", "ca", "bel", "on"];

class i {
  static i18n = null;

  static get PASS_THRESHOLD() {
    return .9;
  }

  static get MS_DISPLAY_VALUE() {
    return "%10d ms";
  }

  static prepareReportResult(e) {
    const t = JSON.parse(JSON.stringify(e));
    t.configSettings.locale || (t.configSettings.locale = "en"), t.configSettings.formFactor || (t.configSettings.formFactor = t.configSettings.emulatedFormFactor);

    for (const e of Object.values(t.audits)) if ("not_applicable" !== e.scoreDisplayMode && "not-applicable" !== e.scoreDisplayMode || (e.scoreDisplayMode = "notApplicable"), e.details && (void 0 !== e.details.type && "diagnostic" !== e.details.type || (e.details.type = "debugdata"), "filmstrip" === e.details.type)) for (const t of e.details.items) t.data.startsWith("data:image/jpeg;base64,") || (t.data = "data:image/jpeg;base64," + t.data);

    if ("object" != typeof t.categories) throw new Error("No categories provided.");
    const n = new Map(),
          [r] = t.lighthouseVersion.split(".").map(Number),
          o = t.categories.performance;

    if (r < 9 && o) {
      t.categoryGroups || (t.categoryGroups = {}), t.categoryGroups.hidden = {
        title: ""
      };

      for (const e of o.auditRefs) e.group ? ["load-opportunities", "diagnostics"].includes(e.group) && delete e.group : e.group = "hidden";
    }

    for (const e of Object.values(t.categories)) e.auditRefs.forEach(e => {
      e.relevantAudits && e.relevantAudits.forEach(t => {
        const r = n.get(t) || [];
        r.push(e), n.set(t, r);
      });
    }), e.auditRefs.forEach(e => {
      const r = t.audits[e.id];
      e.result = r, n.has(e.id) && (e.relevantMetrics = n.get(e.id)), t.stackPacks && t.stackPacks.forEach(t => {
        t.descriptions[e.id] && (e.stackPacks = e.stackPacks || [], e.stackPacks.push({
          title: t.title,
          iconDataURL: t.iconDataURL,
          description: t.descriptions[e.id]
        }));
      });
    });

    return t;
  }

  static showAsPassed(t) {
    switch (t.scoreDisplayMode) {
      case "manual":
      case "notApplicable":
        return !0;

      case "error":
      case "informative":
        return !1;

      case "numeric":
      case "binary":
      default:
        return Number(t.score) >= e.minScore;
    }
  }

  static calculateRating(o, i) {
    if ("manual" === i || "notApplicable" === i) return e.label;
    if ("error" === i) return r.label;
    if (null === o) return n.label;
    let a = n.label;
    return o >= e.minScore ? a = e.label : o >= t.minScore && (a = t.label), a;
  }

  static splitMarkdownCodeSpans(e) {
    const t = [],
          n = e.split(/`(.*?)`/g);

    for (let e = 0; e < n.length; e++) {
      const r = n[e];
      if (!r) continue;
      const o = e % 2 != 0;
      t.push({
        isCode: o,
        text: r
      });
    }

    return t;
  }

  static splitMarkdownLink(e) {
    const t = [],
          n = e.split(/\[([^\]]+?)\]\((https?:\/\/.*?)\)/g);

    for (; n.length;) {
      const [e, r, o] = n.splice(0, 3);
      e && t.push({
        isLink: !1,
        text: e
      }), r && o && t.push({
        isLink: !0,
        text: r,
        linkHref: o
      });
    }

    return t;
  }

  static getURLDisplayName(e, t) {
    const n = void 0 !== (t = t || {
      numPathParts: void 0,
      preserveQuery: void 0,
      preserveHost: void 0
    }).numPathParts ? t.numPathParts : 2,
          r = void 0 === t.preserveQuery || t.preserveQuery,
          o = t.preserveHost || !1;
    let i;
    if ("about:" === e.protocol || "data:" === e.protocol) i = e.href;else {
      i = e.pathname;
      const t = i.split("/").filter(e => e.length);
      n && t.length > n && (i = "…" + t.slice(-1 * n).join("/")), o && (i = `${e.host}/${i.replace(/^\//, "")}`), r && (i = `${i}${e.search}`);
    }

    if (i = i.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g, "$1…"), i = i.replace(/([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g, "$1…"), i = i.replace(/(\d{3})\d{6,}/g, "$1…"), i = i.replace(/\u2026+/g, "…"), i.length > 64 && i.includes("?") && (i = i.replace(/\?([^=]*)(=)?.*/, "?$1$2…"), i.length > 64 && (i = i.replace(/\?.*/, "?…"))), i.length > 64) {
      const e = i.lastIndexOf(".");
      i = e >= 0 ? i.slice(0, 63 - (i.length - e)) + "…" + i.slice(e) : i.slice(0, 63) + "…";
    }

    return i;
  }

  static parseURL(e) {
    const t = new URL(e);
    return {
      file: i.getURLDisplayName(t),
      hostname: t.hostname,
      origin: t.origin
    };
  }

  static createOrReturnURL(e) {
    return e instanceof URL ? e : new URL(e);
  }

  static getTld(e) {
    const t = e.split(".").slice(-2);
    return o.includes(t[0]) ? "." + t.join(".") : "." + t[t.length - 1];
  }

  static getRootDomain(e) {
    const t = i.createOrReturnURL(e).hostname,
          n = i.getTld(t).split(".");
    return t.split(".").slice(-n.length).join(".");
  }

  static getEmulationDescriptions(e) {
    let t, n, r;
    const o = e.throttling;

    switch (e.throttlingMethod) {
      case "provided":
        r = n = t = i.i18n.strings.throttlingProvided;
        break;

      case "devtools":
        {
          const {
            cpuSlowdownMultiplier: e,
            requestLatencyMs: a
          } = o;
          t = i.i18n.formatNumber(e) + "x slowdown (DevTools)", n = i.i18n.formatNumber(a) + " ms HTTP RTT, " + i.i18n.formatNumber(o.downloadThroughputKbps) + " Kbps down, " + i.i18n.formatNumber(o.uploadThroughputKbps) + " Kbps up (DevTools)";
          r = (() => 562.5 === a && o.downloadThroughputKbps === 1638.4 * .9 && 675 === o.uploadThroughputKbps)() ? i.i18n.strings.runtimeSlow4g : i.i18n.strings.runtimeCustom;
          break;
        }

      case "simulate":
        {
          const {
            cpuSlowdownMultiplier: e,
            rttMs: a,
            throughputKbps: l
          } = o;
          t = i.i18n.formatNumber(e) + "x slowdown (Simulated)", n = i.i18n.formatNumber(a) + " ms TCP RTT, " + i.i18n.formatNumber(l) + " Kbps throughput (Simulated)";
          r = (() => 150 === a && 1638.4 === l)() ? i.i18n.strings.runtimeSlow4g : i.i18n.strings.runtimeCustom;
          break;
        }

      default:
        r = t = n = i.i18n.strings.runtimeUnknown;
    }

    return {
      deviceEmulation: {
        mobile: i.i18n.strings.runtimeMobileEmulation,
        desktop: i.i18n.strings.runtimeDesktopEmulation
      }[e.formFactor] || i.i18n.strings.runtimeNoEmulation,
      cpuThrottling: t,
      networkThrottling: n,
      summary: r
    };
  }

  static filterRelevantLines(e, t, n) {
    if (0 === t.length) return e.slice(0, 2 * n + 1);
    const r = new Set();
    return (t = t.sort((e, t) => (e.lineNumber || 0) - (t.lineNumber || 0))).forEach(({
      lineNumber: e
    }) => {
      let t = e - n,
          o = e + n;

      for (; t < 1;) t++, o++;

      r.has(t - 3 - 1) && (t -= 3);

      for (let e = t; e <= o; e++) {
        const t = e;
        r.add(t);
      }
    }), e.filter(e => r.has(e.lineNumber));
  }

  static isPluginCategory(e) {
    return e.startsWith("lighthouse-plugin-");
  }

  static shouldDisplayAsFraction(e) {
    return "timespan" === e || "snapshot" === e;
  }

  static calculateCategoryFraction(e) {
    let t = 0,
        n = 0,
        r = 0,
        o = 0;

    for (const a of e.auditRefs) {
      const e = i.showAsPassed(a.result);
      "hidden" !== a.group && "manual" !== a.result.scoreDisplayMode && "notApplicable" !== a.result.scoreDisplayMode && ("informative" !== a.result.scoreDisplayMode ? (++t, o += a.weight, e && n++) : e || ++r);
    }

    return {
      numPassed: n,
      numPassableAudits: t,
      numInformative: r,
      totalWeight: o
    };
  }

}

i.reportJson = null, i.getUniqueSuffix = (() => {
  let e = 0;
  return function () {
    return e++;
  };
})();
i.UIStrings = {
  varianceDisclaimer: "Values are estimated and may vary. The [performance score is calculated](https://web.dev/performance-scoring/) directly from these metrics.",
  calculatorLink: "See calculator.",
  showRelevantAudits: "Show audits relevant to:",
  opportunityResourceColumnLabel: "Opportunity",
  opportunitySavingsColumnLabel: "Estimated Savings",
  errorMissingAuditInfo: "Report error: no audit information",
  errorLabel: "Error!",
  warningHeader: "Warnings: ",
  warningAuditsGroupTitle: "Passed audits but with warnings",
  passedAuditsGroupTitle: "Passed audits",
  notApplicableAuditsGroupTitle: "Not applicable",
  manualAuditsGroupTitle: "Additional items to manually check",
  toplevelWarningsMessage: "There were issues affecting this run of Lighthouse:",
  crcInitialNavigation: "Initial Navigation",
  crcLongestDurationLabel: "Maximum critical path latency:",
  snippetExpandButtonLabel: "Expand snippet",
  snippetCollapseButtonLabel: "Collapse snippet",
  lsPerformanceCategoryDescription: "[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.",
  labDataTitle: "Lab Data",
  thirdPartyResourcesLabel: "Show 3rd-party resources",
  viewTreemapLabel: "View Treemap",
  dropdownPrintSummary: "Print Summary",
  dropdownPrintExpanded: "Print Expanded",
  dropdownCopyJSON: "Copy JSON",
  dropdownSaveHTML: "Save as HTML",
  dropdownSaveJSON: "Save as JSON",
  dropdownViewer: "Open in Viewer",
  dropdownSaveGist: "Save as Gist",
  dropdownDarkTheme: "Toggle Dark Theme",
  runtimeSettingsDevice: "Device",
  runtimeSettingsNetworkThrottling: "Network throttling",
  runtimeSettingsCPUThrottling: "CPU throttling",
  runtimeSettingsUANetwork: "User agent (network)",
  runtimeSettingsBenchmark: "CPU/Memory Power",
  runtimeSettingsAxeVersion: "Axe version",
  footerIssue: "File an issue",
  runtimeNoEmulation: "No emulation",
  runtimeMobileEmulation: "Emulated Moto G4",
  runtimeDesktopEmulation: "Emulated Desktop",
  runtimeUnknown: "Unknown",
  runtimeSingleLoad: "Single page load",
  runtimeAnalysisWindow: "Initial page load",
  runtimeSingleLoadTooltip: "This data is taken from a single page load, as opposed to field data summarizing many sessions.",
  throttlingProvided: "Provided by environment",
  show: "Show",
  hide: "Hide",
  expandView: "Expand view",
  collapseView: "Collapse view",
  runtimeSlow4g: "Slow 4G throttling",
  runtimeCustom: "Custom throttling"
};

class a {
  constructor(e, t) {
    this._document = e, this._lighthouseChannel = "unknown", this._componentCache = new Map(), this.rootEl = t;
  }

  createElement(e, t) {
    const n = this._document.createElement(e);

    if (t) for (const e of t.split(/\s+/)) e && n.classList.add(e);
    return n;
  }

  createElementNS(e, t, n) {
    const r = this._document.createElementNS(e, t);

    if (n) for (const e of n.split(/\s+/)) e && r.classList.add(e);
    return r;
  }

  createFragment() {
    return this._document.createDocumentFragment();
  }

  createTextNode(e) {
    return this._document.createTextNode(e);
  }

  createChildOf(e, t, n) {
    const r = this.createElement(t, n);
    return e.appendChild(r), r;
  }

  createComponent(e) {
    let t = this._componentCache.get(e);

    if (t) {
      const e = t.cloneNode(!0);
      return this.findAll("style", e).forEach(e => e.remove()), e;
    }

    t = function (e, t) {
      switch (t) {
        case "3pFilter":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    .lh-3p-filter {\n      color: var(--color-gray-600);\n      float: right;\n      padding: 6px var(--stackpack-padding-horizontal);\n    }\n    .lh-3p-filter-label, .lh-3p-filter-input {\n      vertical-align: middle;\n      user-select: none;\n    }\n    .lh-3p-filter-input:disabled + .lh-3p-ui-string {\n      text-decoration: line-through;\n    }\n  "), t.append(n);
            const r = e.createElement("div", "lh-3p-filter"),
                  o = e.createElement("label", "lh-3p-filter-label"),
                  i = e.createElement("input", "lh-3p-filter-input");
            i.setAttribute("type", "checkbox"), i.setAttribute("checked", "");
            const a = e.createElement("span", "lh-3p-ui-string");
            a.append("Show 3rd party resources");
            const l = e.createElement("span", "lh-3p-filter-count");
            return o.append(" ", i, " ", a, " (", l, ") "), r.append(" ", o, " "), t.append(r), t;
          }(e);

        case "audit":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-audit"),
                  r = e.createElement("details", "lh-expandable-details"),
                  o = e.createElement("summary"),
                  i = e.createElement("div", "lh-audit__header lh-expandable-details__summary"),
                  a = e.createElement("span", "lh-audit__score-icon"),
                  l = e.createElement("span", "lh-audit__title-and-text"),
                  s = e.createElement("span", "lh-audit__title"),
                  c = e.createElement("span", "lh-audit__display-text");
            l.append(" ", s, " ", c, " ");
            const d = e.createElement("div", "lh-chevron-container");
            i.append(" ", a, " ", l, " ", d, " "), o.append(" ", i, " ");
            const p = e.createElement("div", "lh-audit__description"),
                  h = e.createElement("div", "lh-audit__stackpacks");
            return r.append(" ", o, " ", p, " ", h, " "), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "categoryHeader":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-category-header"),
                  r = e.createElement("div", "lh-score__gauge");
            r.setAttribute("role", "heading"), r.setAttribute("aria-level", "2");
            const o = e.createElement("div", "lh-category-header__description");
            return n.append(" ", r, " ", o, " "), t.append(n), t;
          }(e);

        case "chevron":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElementNS("http://www.w3.org/2000/svg", "svg", "lh-chevron");
            n.setAttribute("viewBox", "0 0 100 100");
            const r = e.createElementNS("http://www.w3.org/2000/svg", "g", "lh-chevron__lines"),
                  o = e.createElementNS("http://www.w3.org/2000/svg", "path", "lh-chevron__line lh-chevron__line-left");
            o.setAttribute("d", "M10 50h40");
            const i = e.createElementNS("http://www.w3.org/2000/svg", "path", "lh-chevron__line lh-chevron__line-right");
            return i.setAttribute("d", "M90 50H50"), r.append(" ", o, " ", i, " "), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "clump":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-audit-group"),
                  r = e.createElement("details", "lh-clump"),
                  o = e.createElement("summary"),
                  i = e.createElement("div", "lh-audit-group__summary"),
                  a = e.createElement("div", "lh-audit-group__header"),
                  l = e.createElement("span", "lh-audit-group__title"),
                  s = e.createElement("span", "lh-audit-group__itemcount");
            a.append(" ", l, " ", s, " ", " ", " ");
            const c = e.createElement("div", "lh-clump-toggle"),
                  d = e.createElement("span", "lh-clump-toggletext--show"),
                  p = e.createElement("span", "lh-clump-toggletext--hide");
            return c.append(" ", d, " ", p, " "), i.append(" ", a, " ", c, " "), o.append(" ", i, " "), r.append(" ", o, " "), n.append(" ", " ", r, " "), t.append(n), t;
          }(e);

        case "crc":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-crc-container"),
                  r = e.createElement("style");
            r.append('\n      .lh-crc .lh-tree-marker {\n        width: 12px;\n        height: 26px;\n        display: block;\n        float: left;\n        background-position: top left;\n      }\n      .lh-crc .lh-horiz-down {\n        background: url(\'data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><g fill="%23D8D8D8" fill-rule="evenodd"><path d="M16 12v2H-2v-2z"/><path d="M9 12v14H7V12z"/></g></svg>\');\n      }\n      .lh-crc .lh-right {\n        background: url(\'data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v2H0v-2z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>\');\n      }\n      .lh-crc .lh-up-right {\n        background: url(\'data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v14H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>\');\n      }\n      .lh-crc .lh-vert-right {\n        background: url(\'data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v27H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>\');\n      }\n      .lh-crc .lh-vert {\n        background: url(\'data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v26H7z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>\');\n      }\n      .lh-crc .lh-crc-tree {\n        font-size: 14px;\n        width: 100%;\n        overflow-x: auto;\n      }\n      .lh-crc .lh-crc-node {\n        height: 26px;\n        line-height: 26px;\n        white-space: nowrap;\n      }\n      .lh-crc .lh-crc-node__tree-value {\n        margin-left: 10px;\n      }\n      .lh-crc .lh-crc-node__tree-value div {\n        display: inline;\n      }\n      .lh-crc .lh-crc-node__chain-duration {\n        font-weight: 700;\n      }\n      .lh-crc .lh-crc-initial-nav {\n        color: #595959;\n        font-style: italic;\n      }\n      .lh-crc__summary-value {\n        margin-bottom: 10px;\n      }\n    ');
            const o = e.createElement("div"),
                  i = e.createElement("div", "lh-crc__summary-value"),
                  a = e.createElement("span", "lh-crc__longest_duration_label"),
                  l = e.createElement("b", "lh-crc__longest_duration");
            i.append(" ", a, " ", l, " "), o.append(" ", i, " ");
            const s = e.createElement("div", "lh-crc"),
                  c = e.createElement("div", "lh-crc-initial-nav");
            return s.append(" ", c, " ", " "), n.append(" ", r, " ", o, " ", s, " "), t.append(n), t;
          }(e);

        case "crcChain":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-crc-node"),
                  r = e.createElement("span", "lh-crc-node__tree-marker"),
                  o = e.createElement("span", "lh-crc-node__tree-value");
            return n.append(" ", r, " ", o, " "), t.append(n), t;
          }(e);

        case "elementScreenshot":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-element-screenshot"),
                  r = e.createElement("div", "lh-element-screenshot__content"),
                  o = e.createElement("div", "lh-element-screenshot__mask"),
                  i = e.createElementNS("http://www.w3.org/2000/svg", "svg");
            i.setAttribute("height", "0"), i.setAttribute("width", "0");
            const a = e.createElementNS("http://www.w3.org/2000/svg", "defs"),
                  l = e.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            l.setAttribute("clipPathUnits", "objectBoundingBox"), a.append(" ", l, " ", " "), i.append(" ", a, " "), o.append(" ", i, " ");
            const s = e.createElement("div", "lh-element-screenshot__image"),
                  c = e.createElement("div", "lh-element-screenshot__element-marker");
            return r.append(" ", o, " ", s, " ", c, " "), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "footer":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    .lh-footer {\n      padding: var(--footer-padding-vertical) calc(var(--default-padding) * 2);\n      max-width: var(--report-content-width);\n      margin: 0 auto;\n    }\n    .lh-footer .lh-generated {\n      text-align: center;\n    }\n  "), t.append(n);
            const r = e.createElement("footer", "lh-footer"),
                  o = e.createElement("ul", "lh-meta__items");
            o.append(" ");
            const i = e.createElement("div", "lh-generated"),
                  a = e.createElement("b");
            a.append("Lighthouse");
            const l = e.createElement("span", "lh-footer__version"),
                  s = e.createElement("a", "lh-footer__version_issue");
            return s.setAttribute("href", "https://github.com/GoogleChrome/Lighthouse/issues"), s.setAttribute("target", "_blank"), s.setAttribute("rel", "noopener"), s.append("File an issue"), i.append(" ", " Generated by ", a, " ", l, " | ", s, " "), r.append(" ", o, " ", i, " "), t.append(r), t;
          }(e);

        case "fraction":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("a", "lh-fraction__wrapper"),
                  r = e.createElement("div", "lh-fraction__content-wrapper"),
                  o = e.createElement("div", "lh-fraction__content"),
                  i = e.createElement("div", "lh-fraction__background");
            o.append(" ", i, " "), r.append(" ", o, " ");
            const a = e.createElement("div", "lh-fraction__label");
            return n.append(" ", r, " ", a, " "), t.append(n), t;
          }(e);

        case "gauge":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("a", "lh-gauge__wrapper"),
                  r = e.createElement("div", "lh-gauge__svg-wrapper"),
                  o = e.createElementNS("http://www.w3.org/2000/svg", "svg", "lh-gauge");
            o.setAttribute("viewBox", "0 0 120 120");
            const i = e.createElementNS("http://www.w3.org/2000/svg", "circle", "lh-gauge-base");
            i.setAttribute("r", "56"), i.setAttribute("cx", "60"), i.setAttribute("cy", "60"), i.setAttribute("stroke-width", "8");
            const a = e.createElementNS("http://www.w3.org/2000/svg", "circle", "lh-gauge-arc");
            a.setAttribute("r", "56"), a.setAttribute("cx", "60"), a.setAttribute("cy", "60"), a.setAttribute("stroke-width", "8"), o.append(" ", i, " ", a, " "), r.append(" ", o, " ");
            const l = e.createElement("div", "lh-gauge__percentage"),
                  s = e.createElement("div", "lh-gauge__label");
            return n.append(" ", " ", r, " ", l, " ", " ", s, " "), t.append(n), t;
          }(e);

        case "gaugePwa":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    .lh-gauge--pwa .lh-gauge--pwa__component {\n      display: none;\n    }\n    .lh-gauge--pwa__wrapper:not(.lh-badged--all) .lh-gauge--pwa__logo > path {\n      /* Gray logo unless everything is passing. */\n      fill: #B0B0B0;\n    }\n\n    .lh-gauge--pwa__disc {\n      fill: var(--color-gray-200);\n    }\n\n    .lh-gauge--pwa__logo--primary-color {\n      fill: #304FFE;\n    }\n\n    .lh-gauge--pwa__logo--secondary-color {\n      fill: #3D3D3D;\n    }\n    .lh-dark .lh-gauge--pwa__logo--secondary-color {\n      fill: #D8B6B6;\n    }\n\n    /* No passing groups. */\n    .lh-gauge--pwa__wrapper:not([class*='lh-badged--']) .lh-gauge--pwa__na-line {\n      display: inline;\n    }\n    /* Just optimized. Same n/a line as no passing groups. */\n    .lh-gauge--pwa__wrapper.lh-badged--pwa-optimized:not(.lh-badged--pwa-installable) .lh-gauge--pwa__na-line {\n      display: inline;\n    }\n\n    /* Just installable. */\n    .lh-gauge--pwa__wrapper.lh-badged--pwa-installable .lh-gauge--pwa__installable-badge {\n      display: inline;\n    }\n\n    /* All passing groups. */\n    .lh-gauge--pwa__wrapper.lh-badged--all .lh-gauge--pwa__check-circle {\n      display: inline;\n    }\n  "), t.append(n);
            const r = e.createElement("a", "lh-gauge__wrapper lh-gauge--pwa__wrapper"),
                  o = e.createElementNS("http://www.w3.org/2000/svg", "svg", "lh-gauge lh-gauge--pwa");
            o.setAttribute("viewBox", "0 0 60 60");
            const i = e.createElementNS("http://www.w3.org/2000/svg", "defs"),
                  a = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            a.setAttribute("id", "lh-gauge--pwa__check-circle__gradient"), a.setAttribute("x1", "50%"), a.setAttribute("y1", "0%"), a.setAttribute("x2", "50%"), a.setAttribute("y2", "100%");
            const l = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            l.setAttribute("stop-color", "#00C852"), l.setAttribute("offset", "0%");
            const s = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            s.setAttribute("stop-color", "#009688"), s.setAttribute("offset", "100%"), a.append(" ", l, " ", s, " ");
            const c = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            c.setAttribute("id", "lh-gauge--pwa__installable__shadow-gradient"), c.setAttribute("x1", "76.056%"), c.setAttribute("x2", "24.111%"), c.setAttribute("y1", "82.995%"), c.setAttribute("y2", "24.735%");
            const d = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            d.setAttribute("stop-color", "#A5D6A7"), d.setAttribute("offset", "0%");
            const p = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            p.setAttribute("stop-color", "#80CBC4"), p.setAttribute("offset", "100%"), c.append(" ", d, " ", p, " ");
            const h = e.createElementNS("http://www.w3.org/2000/svg", "g");
            h.setAttribute("id", "lh-gauge--pwa__installable-badge");
            const u = e.createElementNS("http://www.w3.org/2000/svg", "circle");
            u.setAttribute("fill", "#FFFFFF"), u.setAttribute("cx", "10"), u.setAttribute("cy", "10"), u.setAttribute("r", "10");
            const g = e.createElementNS("http://www.w3.org/2000/svg", "path");
            g.setAttribute("fill", "#009688"), g.setAttribute("d", "M10 4.167A5.835 5.835 0 0 0 4.167 10 5.835 5.835 0 0 0 10 15.833 5.835 5.835 0 0 0 15.833 10 5.835 5.835 0 0 0 10 4.167zm2.917 6.416h-2.334v2.334H9.417v-2.334H7.083V9.417h2.334V7.083h1.166v2.334h2.334v1.166z"), h.append(" ", u, " ", g, " "), i.append(" ", a, " ", c, " ", h, " ");
            const m = e.createElementNS("http://www.w3.org/2000/svg", "g");
            m.setAttribute("stroke", "none"), m.setAttribute("fill-rule", "nonzero");
            const f = e.createElementNS("http://www.w3.org/2000/svg", "circle", "lh-gauge--pwa__disc");
            f.setAttribute("cx", "30"), f.setAttribute("cy", "30"), f.setAttribute("r", "30");
            const v = e.createElementNS("http://www.w3.org/2000/svg", "g", "lh-gauge--pwa__logo"),
                  b = e.createElementNS("http://www.w3.org/2000/svg", "path", "lh-gauge--pwa__logo--secondary-color");
            b.setAttribute("d", "M35.66 19.39l.7-1.75h2L37.4 15 38.6 12l3.4 9h-2.51l-.58-1.61z");

            const _ = e.createElementNS("http://www.w3.org/2000/svg", "path", "lh-gauge--pwa__logo--primary-color");

            _.setAttribute("d", "M33.52 21l3.65-9h-2.42l-2.5 5.82L30.5 12h-1.86l-1.9 5.82-1.35-2.65-1.21 3.72L25.4 21h2.38l1.72-5.2 1.64 5.2z");

            const w = e.createElementNS("http://www.w3.org/2000/svg", "path", "lh-gauge--pwa__logo--secondary-color");
            w.setAttribute("fill-rule", "nonzero"), w.setAttribute("d", "M20.3 17.91h1.48c.45 0 .85-.05 1.2-.15l.39-1.18 1.07-3.3a2.64 2.64 0 0 0-.28-.37c-.55-.6-1.36-.91-2.42-.91H18v9h2.3V17.9zm1.96-3.84c.22.22.33.5.33.87 0 .36-.1.65-.29.87-.2.23-.59.35-1.15.35h-.86v-2.41h.87c.52 0 .89.1 1.1.32z"), v.append(" ", b, " ", _, " ", w, " ");
            const y = e.createElementNS("http://www.w3.org/2000/svg", "rect", "lh-gauge--pwa__component lh-gauge--pwa__na-line");
            y.setAttribute("fill", "#FFFFFF"), y.setAttribute("x", "20"), y.setAttribute("y", "32"), y.setAttribute("width", "20"), y.setAttribute("height", "4"), y.setAttribute("rx", "2");
            const x = e.createElementNS("http://www.w3.org/2000/svg", "g", "lh-gauge--pwa__component lh-gauge--pwa__installable-badge");
            x.setAttribute("transform", "translate(20, 29)");
            const k = e.createElementNS("http://www.w3.org/2000/svg", "path");
            k.setAttribute("fill", "url(#lh-gauge--pwa__installable__shadow-gradient)"), k.setAttribute("d", "M33.629 19.487c-4.272 5.453-10.391 9.39-17.415 10.869L3 17.142 17.142 3 33.63 19.487z");
            const E = e.createElementNS("http://www.w3.org/2000/svg", "use");
            E.setAttribute("href", "#lh-gauge--pwa__installable-badge"), x.append(" ", k, " ", E, " ");
            const A = e.createElementNS("http://www.w3.org/2000/svg", "g", "lh-gauge--pwa__component lh-gauge--pwa__check-circle");
            A.setAttribute("transform", "translate(18, 28)");
            const C = e.createElementNS("http://www.w3.org/2000/svg", "circle");
            C.setAttribute("fill", "#FFFFFF"), C.setAttribute("cx", "12"), C.setAttribute("cy", "12"), C.setAttribute("r", "12");
            const z = e.createElementNS("http://www.w3.org/2000/svg", "path");
            z.setAttribute("fill", "url(#lh-gauge--pwa__check-circle__gradient)"), z.setAttribute("d", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"), A.append(" ", C, " ", z, " "), m.append(" ", " ", f, " ", v, " ", " ", y, " ", " ", x, " ", " ", A, " "), o.append(" ", i, " ", m, " ");
            const S = e.createElement("div", "lh-gauge__label");
            return r.append(" ", o, " ", S, " "), t.append(r), t;
          }(e);

        case "heading":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    /* CSS Fireworks. Originally by Eddie Lin\n       https://codepen.io/paulirish/pen/yEVMbP\n    */\n    .lh-pyro {\n      display: none;\n      z-index: 1;\n      pointer-events: none;\n    }\n    .lh-score100 .lh-pyro {\n      display: block;\n    }\n    .lh-score100 .lh-lighthouse stop:first-child {\n      stop-color: hsla(200, 12%, 95%, 0);\n    }\n    .lh-score100 .lh-lighthouse stop:last-child {\n      stop-color: hsla(65, 81%, 76%, 1);\n    }\n\n    .lh-pyro > .lh-pyro-before, .lh-pyro > .lh-pyro-after {\n      position: absolute;\n      width: 5px;\n      height: 5px;\n      border-radius: 2.5px;\n      box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;\n      animation: 1s bang ease-out infinite backwards,  1s gravity ease-in infinite backwards,  5s position linear infinite backwards;\n      animation-delay: 1s, 1s, 1s;\n    }\n\n    .lh-pyro > .lh-pyro-after {\n      animation-delay: 2.25s, 2.25s, 2.25s;\n      animation-duration: 1.25s, 1.25s, 6.25s;\n    }\n    .lh-fireworks-paused .lh-pyro > div {\n      animation-play-state: paused;\n    }\n\n    @keyframes bang {\n      to {\n        box-shadow: -70px -115.67px #47ebbc, -28px -99.67px #eb47a4, 58px -31.67px #7eeb47, 13px -141.67px #eb47c5, -19px 6.33px #7347eb, -2px -74.67px #ebd247, 24px -151.67px #eb47e0, 57px -138.67px #b4eb47, -51px -104.67px #479eeb, 62px 8.33px #ebcf47, -93px 0.33px #d547eb, -16px -118.67px #47bfeb, 53px -84.67px #47eb83, 66px -57.67px #eb47bf, -93px -65.67px #91eb47, 30px -13.67px #86eb47, -2px -59.67px #83eb47, -44px 1.33px #eb47eb, 61px -58.67px #47eb73, 5px -22.67px #47e8eb, -66px -28.67px #ebe247, 42px -123.67px #eb5547, -75px 26.33px #7beb47, 15px -52.67px #a147eb, 36px -51.67px #eb8347, -38px -12.67px #eb5547, -46px -59.67px #47eb81, 78px -114.67px #eb47ba, 15px -156.67px #eb47bf, -36px 1.33px #eb4783, -72px -86.67px #eba147, 31px -46.67px #ebe247, -68px 29.33px #47e2eb, -55px 19.33px #ebe047, -56px 27.33px #4776eb, -13px -91.67px #eb5547, -47px -138.67px #47ebc7, -18px -96.67px #eb47ac, 11px -88.67px #4783eb, -67px -28.67px #47baeb, 53px 10.33px #ba47eb, 11px 19.33px #5247eb, -5px -11.67px #eb4791, -68px -4.67px #47eba7, 95px -37.67px #eb478b, -67px -162.67px #eb5d47, -54px -120.67px #eb6847, 49px -12.67px #ebe047, 88px 8.33px #47ebda, 97px 33.33px #eb8147, 6px -71.67px #ebbc47;\n      }\n    }\n    @keyframes gravity {\n      to {\n        transform: translateY(80px);\n        opacity: 0;\n      }\n    }\n    @keyframes position {\n      0%, 19.9% {\n        margin-top: 4%;\n        margin-left: 47%;\n      }\n      20%, 39.9% {\n        margin-top: 7%;\n        margin-left: 30%;\n      }\n      40%, 59.9% {\n        margin-top: 6%;\n        margin-left: 70%;\n      }\n      60%, 79.9% {\n        margin-top: 3%;\n        margin-left: 20%;\n      }\n      80%, 99.9% {\n        margin-top: 3%;\n        margin-left: 80%;\n      }\n    }\n  "), t.append(n);
            const r = e.createElement("div", "lh-header-container"),
                  o = e.createElement("div", "lh-scores-wrapper-placeholder");
            return r.append(" ", o, " "), t.append(r), t;
          }(e);

        case "metric":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-metric"),
                  r = e.createElement("div", "lh-metric__innerwrap"),
                  o = e.createElement("div", "lh-metric__icon"),
                  i = e.createElement("span", "lh-metric__title"),
                  a = e.createElement("div", "lh-metric__value"),
                  l = e.createElement("div", "lh-metric__description");
            return r.append(" ", o, " ", i, " ", a, " ", l, " "), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "opportunity":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-audit lh-audit--load-opportunity"),
                  r = e.createElement("details", "lh-expandable-details"),
                  o = e.createElement("summary"),
                  i = e.createElement("div", "lh-audit__header"),
                  a = e.createElement("div", "lh-load-opportunity__cols"),
                  l = e.createElement("div", "lh-load-opportunity__col lh-load-opportunity__col--one"),
                  s = e.createElement("span", "lh-audit__score-icon"),
                  c = e.createElement("div", "lh-audit__title");
            l.append(" ", s, " ", c, " ");
            const d = e.createElement("div", "lh-load-opportunity__col lh-load-opportunity__col--two"),
                  p = e.createElement("div", "lh-load-opportunity__sparkline"),
                  h = e.createElement("div", "lh-sparkline"),
                  u = e.createElement("div", "lh-sparkline__bar");
            h.append(u), p.append(" ", h, " ");
            const g = e.createElement("div", "lh-audit__display-text"),
                  m = e.createElement("div", "lh-chevron-container");
            d.append(" ", p, " ", g, " ", m, " "), a.append(" ", l, " ", d, " "), i.append(" ", a, " "), o.append(" ", i, " ");
            const f = e.createElement("div", "lh-audit__description"),
                  v = e.createElement("div", "lh-audit__stackpacks");
            return r.append(" ", o, " ", f, " ", v, " "), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "opportunityHeader":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-load-opportunity__header lh-load-opportunity__cols"),
                  r = e.createElement("div", "lh-load-opportunity__col lh-load-opportunity__col--one"),
                  o = e.createElement("div", "lh-load-opportunity__col lh-load-opportunity__col--two");
            return n.append(" ", r, " ", o, " "), t.append(n), t;
          }(e);

        case "scorescale":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-scorescale"),
                  r = e.createElement("span", "lh-scorescale-range lh-scorescale-range--fail");
            r.append("0–49");
            const o = e.createElement("span", "lh-scorescale-range lh-scorescale-range--average");
            o.append("50–89");
            const i = e.createElement("span", "lh-scorescale-range lh-scorescale-range--pass");
            return i.append("90–100"), n.append(" ", r, " ", o, " ", i, " "), t.append(n), t;
          }(e);

        case "scoresWrapper":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    .lh-scores-container {\n      display: flex;\n      flex-direction: column;\n      padding: var(--default-padding) 0;\n      position: relative;\n      width: 100%;\n    }\n\n    .lh-sticky-header {\n      --gauge-circle-size: var(--gauge-circle-size-sm);\n      --plugin-badge-size: 16px;\n      --plugin-icon-size: 75%;\n      --gauge-wrapper-width: 60px;\n      --gauge-percentage-font-size: 13px;\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: var(--topbar-height);\n      font-weight: 500;\n      display: none;\n      justify-content: center;\n      background-color: var(--sticky-header-background-color);\n      border-bottom: 1px solid var(--color-gray-200);\n      padding-top: var(--score-container-padding);\n      padding-bottom: 4px;\n      z-index: 1;\n      pointer-events: none;\n    }\n\n    .lh-devtools .lh-sticky-header {\n      /* The report within DevTools is placed in a container with overflow, which changes the placement of this header unless we change `position` to `sticky.` */\n      position: sticky;\n    }\n\n    .lh-sticky-header--visible {\n      display: grid;\n      grid-auto-flow: column;\n      pointer-events: auto;\n    }\n\n    /* Disable the gauge arc animation for the sticky header, so toggling display: none\n       does not play the animation. */\n    .lh-sticky-header .lh-gauge-arc {\n      animation: none;\n    }\n\n    .lh-sticky-header .lh-gauge__label {\n      display: none;\n    }\n\n    .lh-highlighter {\n      width: var(--gauge-wrapper-width);\n      height: 1px;\n      background-color: var(--highlighter-background-color);\n      /* Position at bottom of first gauge in sticky header. */\n      position: absolute;\n      grid-column: 1;\n      bottom: -1px;\n    }\n\n    .lh-gauge__wrapper:first-of-type {\n      contain: none;\n    }\n  "), t.append(n);
            const r = e.createElement("div", "lh-scores-wrapper"),
                  o = e.createElement("div", "lh-scores-container"),
                  i = e.createElement("div", "lh-pyro"),
                  a = e.createElement("div", "lh-before"),
                  l = e.createElement("div", "lh-after");
            return i.append(" ", a, " ", l, " "), o.append(" ", i, " "), r.append(" ", o, " "), t.append(r), t;
          }(e);

        case "snippet":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-snippet"),
                  r = e.createElement("style");
            return r.append('\n          :root {\n            --snippet-highlight-light: #fbf1f2;\n            --snippet-highlight-dark: #ffd6d8;\n          }\n\n         .lh-snippet__header {\n          position: relative;\n          overflow: hidden;\n          padding: 10px;\n          border-bottom: none;\n          color: var(--snippet-color);\n          background-color: var(--snippet-background-color);\n          border: 1px solid var(--report-border-color-secondary);\n        }\n        .lh-snippet__title {\n          font-weight: bold;\n          float: left;\n        }\n        .lh-snippet__node {\n          float: left;\n          margin-left: 4px;\n        }\n        .lh-snippet__toggle-expand {\n          padding: 1px 7px;\n          margin-top: -1px;\n          margin-right: -7px;\n          float: right;\n          background: transparent;\n          border: none;\n          cursor: pointer;\n          font-size: 14px;\n          color: #0c50c7;\n        }\n\n        .lh-snippet__snippet {\n          overflow: auto;\n          border: 1px solid var(--report-border-color-secondary);\n        }\n        /* Container needed so that all children grow to the width of the scroll container */\n        .lh-snippet__snippet-inner {\n          display: inline-block;\n          min-width: 100%;\n        }\n\n        .lh-snippet:not(.lh-snippet--expanded) .lh-snippet__show-if-expanded {\n          display: none;\n        }\n        .lh-snippet.lh-snippet--expanded .lh-snippet__show-if-collapsed {\n          display: none;\n        }\n\n        .lh-snippet__line {\n          background: white;\n          white-space: pre;\n          display: flex;\n        }\n        .lh-snippet__line:not(.lh-snippet__line--message):first-child {\n          padding-top: 4px;\n        }\n        .lh-snippet__line:not(.lh-snippet__line--message):last-child {\n          padding-bottom: 4px;\n        }\n        .lh-snippet__line--content-highlighted {\n          background: var(--snippet-highlight-dark);\n        }\n        .lh-snippet__line--message {\n          background: var(--snippet-highlight-light);\n        }\n        .lh-snippet__line--message .lh-snippet__line-number {\n          padding-top: 10px;\n          padding-bottom: 10px;\n        }\n        .lh-snippet__line--message code {\n          padding: 10px;\n          padding-left: 5px;\n          color: var(--color-fail);\n          font-family: var(--report-font-family);\n        }\n        .lh-snippet__line--message code {\n          white-space: normal;\n        }\n        .lh-snippet__line-icon {\n          padding-top: 10px;\n          display: none;\n        }\n        .lh-snippet__line--message .lh-snippet__line-icon {\n          display: block;\n        }\n        .lh-snippet__line-icon:before {\n          content: "";\n          display: inline-block;\n          vertical-align: middle;\n          margin-right: 4px;\n          width: var(--score-icon-size);\n          height: var(--score-icon-size);\n          background-image: var(--fail-icon-url);\n        }\n        .lh-snippet__line-number {\n          flex-shrink: 0;\n          width: 40px;\n          text-align: right;\n          font-family: monospace;\n          padding-right: 5px;\n          margin-right: 5px;\n          color: var(--color-gray-600);\n          user-select: none;\n        }\n    '), n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "snippetContent":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-snippet__snippet"),
                  r = e.createElement("div", "lh-snippet__snippet-inner");
            return n.append(" ", r, " "), t.append(n), t;
          }(e);

        case "snippetHeader":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-snippet__header"),
                  r = e.createElement("div", "lh-snippet__title"),
                  o = e.createElement("div", "lh-snippet__node"),
                  i = e.createElement("button", "lh-snippet__toggle-expand"),
                  a = e.createElement("span", "lh-snippet__btn-label-collapse lh-snippet__show-if-expanded"),
                  l = e.createElement("span", "lh-snippet__btn-label-expand lh-snippet__show-if-collapsed");
            return i.append(" ", a, " ", l, " "), n.append(" ", r, " ", o, " ", i, " "), t.append(n), t;
          }(e);

        case "snippetLine":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-snippet__line"),
                  r = e.createElement("div", "lh-snippet__line-number"),
                  o = e.createElement("div", "lh-snippet__line-icon"),
                  i = e.createElement("code");
            return n.append(" ", r, " ", o, " ", i, " "), t.append(n), t;
          }(e);

        case "styles":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            return n.append('/**\n * @license\n * Copyright 2017 The Lighthouse Authors. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS-IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/*\n  Naming convention:\n\n  If a variable is used for a specific component: --{component}-{property name}-{modifier}\n\n  Both {component} and {property name} should be kebab-case. If the target is the entire page,\n  use \'report\' for the component. The property name should not be abbreviated. Use the\n  property name the variable is intended for - if it\'s used for multiple, a common descriptor\n  is fine (ex: \'size\' for a variable applied to \'width\' and \'height\'). If a variable is shared\n  across multiple components, either create more variables or just drop the "{component}-"\n  part of the name. Append any modifiers at the end (ex: \'big\', \'dark\').\n\n  For colors: --color-{hue}-{intensity}\n\n  {intensity} is the Material Design tag - 700, A700, etc.\n*/\n.lh-vars {\n  /* Palette using Material Design Colors\n   * https://www.materialui.co/colors */\n  --color-amber-50: #FFF8E1;\n  --color-blue-200: #90CAF9;\n  --color-blue-900: #0D47A1;\n  --color-blue-A700: #2962FF;\n  --color-blue-primary: #06f;\n  --color-cyan-500: #00BCD4;\n  --color-gray-100: #F5F5F5;\n  --color-gray-300: #CFCFCF;\n  --color-gray-200: #E0E0E0;\n  --color-gray-400: #BDBDBD;\n  --color-gray-50: #FAFAFA;\n  --color-gray-500: #9E9E9E;\n  --color-gray-600: #757575;\n  --color-gray-700: #616161;\n  --color-gray-800: #424242;\n  --color-gray-900: #212121;\n  --color-gray: #000000;\n  --color-green-700: #080;\n  --color-green: #0c6;\n  --color-lime-400: #D3E156;\n  --color-orange-50: #FFF3E0;\n  --color-orange-700: #C33300;\n  --color-orange: #fa3;\n  --color-red-700: #c00;\n  --color-red: #f33;\n  --color-teal-600: #00897B;\n  --color-white: #FFFFFF;\n\n  /* Context-specific colors */\n  --color-average-secondary: var(--color-orange-700);\n  --color-average: var(--color-orange);\n  --color-fail-secondary: var(--color-red-700);\n  --color-fail: var(--color-red);\n  --color-hover: var(--color-gray-50);\n  --color-informative: var(--color-blue-900);\n  --color-pass-secondary: var(--color-green-700);\n  --color-pass: var(--color-green);\n  --color-not-applicable: var(--color-gray-600);\n\n  /* Component variables */\n  --audit-description-padding-left: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right));\n  --audit-explanation-line-height: 16px;\n  --audit-group-margin-bottom: calc(var(--default-padding) * 6);\n  --audit-group-padding-vertical: 8px;\n  --audit-margin-horizontal: 5px;\n  --audit-padding-vertical: 8px;\n  --category-padding: calc(var(--default-padding) * 6) calc(var(--default-padding) * 4) calc(var(--default-padding) * 4);\n  --chevron-line-stroke: var(--color-gray-600);\n  --chevron-size: 12px;\n  --default-padding: 8px;\n  --env-item-background-color: var(--color-gray-100);\n  --env-item-font-size: 28px;\n  --env-item-line-height: 36px;\n  --env-item-padding: 10px 0px;\n  --env-name-min-width: 220px;\n  --footer-padding-vertical: 16px;\n  --gauge-circle-size-big: 96px;\n  --gauge-circle-size: 48px;\n  --gauge-circle-size-sm: 32px;\n  --gauge-label-font-size-big: 18px;\n  --gauge-label-font-size: var(--report-font-size-secondary);\n  --gauge-label-line-height-big: 24px;\n  --gauge-label-line-height: var(--report-line-height-secondary);\n  --gauge-percentage-font-size-big: 38px;\n  --gauge-percentage-font-size: var(--report-font-size-secondary);\n  --gauge-wrapper-width: 120px;\n  --header-line-height: 24px;\n  --highlighter-background-color: var(--report-text-color);\n  --icon-square-size: calc(var(--score-icon-size) * 0.88);\n  --image-preview-size: 48px;\n  --link-color: var(--color-blue-primary);\n  --locale-selector-background-color: var(--color-white);\n  --metric-toggle-lines-fill: #7F7F7F;\n  --metric-value-font-size: calc(var(--report-font-size) * 1.8);\n  --metrics-toggle-background-color: var(--color-gray-200);\n  --plugin-badge-background-color: var(--color-white);\n  --plugin-badge-size-big: calc(var(--gauge-circle-size-big) / 2.7);\n  --plugin-badge-size: calc(var(--gauge-circle-size) / 2.7);\n  --plugin-icon-size: 65%;\n  --pwa-icon-margin: 0 var(--default-padding);\n  --pwa-icon-size: var(--topbar-logo-size);\n  --report-background-color: #fff;\n  --report-border-color-secondary: #ebebeb;\n  --report-font-family-monospace: \'Roboto Mono\', \'Menlo\', \'dejavu sans mono\', \'Consolas\', \'Lucida Console\', monospace;\n  --report-font-family: Roboto, Helvetica, Arial, sans-serif;\n  --report-font-size: 14px;\n  --report-font-size-secondary: 12px;\n  --report-icon-size: var(--score-icon-background-size);\n  --report-line-height: 24px;\n  --report-line-height-secondary: 20px;\n  --report-min-width: 360px;\n  --report-monospace-font-size: calc(var(--report-font-size) * 0.85);\n  --report-text-color-secondary: var(--color-gray-800);\n  --report-text-color: var(--color-gray-900);\n  --report-content-width: calc(60 * var(--report-font-size)); /* defaults to 840px */\n  --score-container-padding: 8px;\n  --score-icon-background-size: 24px;\n  --score-icon-margin-left: 6px;\n  --score-icon-margin-right: 14px;\n  --score-icon-margin: 0 var(--score-icon-margin-right) 0 var(--score-icon-margin-left);\n  --score-icon-size: 12px;\n  --score-icon-size-big: 16px;\n  --screenshot-overlay-background: rgba(0, 0, 0, 0.3);\n  --section-padding-vertical: calc(var(--default-padding) * 6);\n  --snippet-background-color: var(--color-gray-50);\n  --snippet-color: #0938C2;\n  --sparkline-height: 5px;\n  --stackpack-padding-horizontal: 10px;\n  --sticky-header-background-color: var(--report-background-color);\n  --table-higlight-background-color: hsla(210, 17%, 77%, 0.1);\n  --tools-icon-color: var(--color-gray-600);\n  --topbar-background-color: var(--color-white);\n  --topbar-height: 32px;\n  --topbar-logo-size: 24px;\n  --topbar-padding: 0 8px;\n  --toplevel-warning-background-color: hsla(30, 100%, 75%, 10%);\n  --toplevel-warning-message-text-color: var(--color-average-secondary);\n  --toplevel-warning-padding: 18px;\n  --toplevel-warning-text-color: var(--report-text-color);\n\n  /* SVGs */\n  --plugin-icon-url-dark: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>\');\n  --plugin-icon-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23757575"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>\');\n\n  --pass-icon-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>check</title><path fill="%23178239" d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/></svg>\');\n  --average-icon-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>info</title><path fill="%23E67700" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4V22h4v12zm0-16h-4v-4h4v4z"/></svg>\');\n  --fail-icon-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>warn</title><path fill="%23C7221F" d="M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z"/></svg>\');\n\n  --pwa-installable-gray-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="nonzero"><circle fill="%23DAE0E3" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>\');\n  --pwa-optimized-gray-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%23DAE0E3" width="24" height="24" rx="12"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/><path d="M5 5h14v14H5z"/></g></svg>\');\n\n  --pwa-installable-gray-url-dark: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="nonzero"><circle fill="%23424242" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>\');\n  --pwa-optimized-gray-url-dark: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%23424242" width="24" height="24" rx="12"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/><path d="M5 5h14v14H5z"/></g></svg>\');\n\n  --pwa-installable-color-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero" fill="none"><circle fill="%230CCE6B" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>\');\n  --pwa-optimized-color-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%230CCE6B" width="24" height="24" rx="12"/><path d="M5 5h14v14H5z"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/></g></svg>\');\n\n  --swap-locale-icon-url: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>\');\n}\n\n@media not print {\n  .lh-dark {\n    /* Pallete */\n    --color-gray-200: var(--color-gray-800);\n    --color-gray-300: #616161;\n    --color-gray-400: var(--color-gray-600);\n    --color-gray-700: var(--color-gray-400);\n    --color-gray-50: #757575;\n    --color-gray-600: var(--color-gray-500);\n    --color-green-700: var(--color-green);\n    --color-orange-700: var(--color-orange);\n    --color-red-700: var(--color-red);\n    --color-teal-600: var(--color-cyan-500);\n\n    /* Context-specific colors */\n    --color-hover: rgba(0, 0, 0, 0.2);\n    --color-informative: var(--color-blue-200);\n\n    /* Component variables */\n    --env-item-background-color: #393535;\n    --link-color: var(--color-blue-200);\n    --locale-selector-background-color: var(--color-gray-200);\n    --plugin-badge-background-color: var(--color-gray-800);\n    --report-background-color: var(--color-gray-900);\n    --report-border-color-secondary: var(--color-gray-200);\n    --report-text-color-secondary: var(--color-gray-400);\n    --report-text-color: var(--color-gray-100);\n    --snippet-color: var(--color-cyan-500);\n    --topbar-background-color: var(--color-gray);\n    --toplevel-warning-background-color: hsl(33deg 14% 18%);\n    --toplevel-warning-message-text-color: var(--color-orange-700);\n    --toplevel-warning-text-color: var(--color-gray-100);\n\n    /* SVGs */\n    --plugin-icon-url: var(--plugin-icon-url-dark);\n    --pwa-installable-gray-url: var(--pwa-installable-gray-url-dark);\n    --pwa-optimized-gray-url: var(--pwa-optimized-gray-url-dark);\n  }\n}\n\n@media only screen and (max-width: 480px) {\n  .lh-vars {\n    --audit-group-margin-bottom: 20px;\n    --category-padding: 12px;\n    --env-name-min-width: 120px;\n    --gauge-circle-size-big: 96px;\n    --gauge-circle-size: 72px;\n    --gauge-label-font-size-big: 22px;\n    --gauge-label-font-size: 14px;\n    --gauge-label-line-height-big: 26px;\n    --gauge-label-line-height: 20px;\n    --gauge-percentage-font-size-big: 34px;\n    --gauge-percentage-font-size: 26px;\n    --gauge-wrapper-width: 112px;\n    --header-padding: 16px 0 16px 0;\n    --image-preview-size: 24px;\n    --plugin-icon-size: 75%;\n    --pwa-icon-margin: 0 7px 0 -3px;\n    --report-font-size: 14px;\n    --report-line-height: 20px;\n    --score-icon-margin-left: 2px;\n    --score-icon-size: 10px;\n    --topbar-height: 28px;\n    --topbar-logo-size: 20px;\n  }\n\n  /* Not enough space to adequately show the relative savings bars. */\n  .lh-sparkline {\n    display: none;\n  }\n}\n\n.lh-vars.lh-devtools {\n  --audit-explanation-line-height: 14px;\n  --audit-group-margin-bottom: 20px;\n  --audit-group-padding-vertical: 12px;\n  --audit-padding-vertical: 4px;\n  --category-padding: 12px;\n  --default-padding: 12px;\n  --env-name-min-width: 120px;\n  --footer-padding-vertical: 8px;\n  --gauge-circle-size-big: 72px;\n  --gauge-circle-size: 64px;\n  --gauge-label-font-size-big: 22px;\n  --gauge-label-font-size: 14px;\n  --gauge-label-line-height-big: 26px;\n  --gauge-label-line-height: 20px;\n  --gauge-percentage-font-size-big: 34px;\n  --gauge-percentage-font-size: 26px;\n  --gauge-wrapper-width: 97px;\n  --header-line-height: 20px;\n  --header-padding: 16px 0 16px 0;\n  --screenshot-overlay-background: transparent;\n  --plugin-icon-size: 75%;\n  --pwa-icon-margin: 0 7px 0 -3px;\n  --report-font-family-monospace: \'Menlo\', \'dejavu sans mono\', \'Consolas\', \'Lucida Console\', monospace;\n  --report-font-family: \'.SFNSDisplay-Regular\', \'Helvetica Neue\', \'Lucida Grande\', sans-serif;\n  --report-font-size: 12px;\n  --report-line-height: 20px;\n  --score-icon-margin-left: 2px;\n  --score-icon-size: 10px;\n  --section-padding-vertical: 8px;\n}\n\n.lh-devtools.lh-root {\n  height: 100%;\n}\n.lh-devtools.lh-root img {\n  /* Override devtools default \'min-width: 0\' so svg without size in a flexbox isn\'t collapsed. */\n  min-width: auto;\n}\n.lh-devtools .lh-container {\n  overflow-y: scroll;\n  height: calc(100% - var(--topbar-height));\n}\n@media print {\n  .lh-devtools .lh-container {\n    overflow: unset;\n  }\n}\n.lh-devtools .lh-sticky-header {\n  /* This is normally the height of the topbar, but we want it to stick to the top of our scroll container .lh-container` */\n  top: 0;\n}\n\n@keyframes fadeIn {\n  0% { opacity: 0;}\n  100% { opacity: 0.6;}\n}\n\n.lh-root *, .lh-root *::before, .lh-root *::after {\n  box-sizing: border-box;\n}\n\n.lh-root {\n  font-family: var(--report-font-family);\n  font-size: var(--report-font-size);\n  margin: 0;\n  line-height: var(--report-line-height);\n  background: var(--report-background-color);\n  color: var(--report-text-color);\n}\n\n.lh-root :focus {\n    outline: -webkit-focus-ring-color auto 3px;\n}\n.lh-root summary:focus {\n    outline: none;\n    box-shadow: 0 0 0 1px hsl(217, 89%, 61%);\n}\n\n.lh-root [hidden] {\n  display: none !important;\n}\n\n.lh-root pre {\n  margin: 0;\n}\n\n.lh-root details > summary {\n  cursor: pointer;\n}\n\n.lh-hidden {\n  display: none !important;\n}\n\n.lh-container {\n  /*\n  Text wrapping in the report is so much FUN!\n  We have a `word-break: break-word;` globally here to prevent a few common scenarios, namely\n  long non-breakable text (usually URLs) found in:\n    1. The footer\n    2. .lh-node (outerHTML)\n    3. .lh-code\n\n  With that sorted, the next challenge is appropriate column sizing and text wrapping inside our\n  .lh-details tables. Even more fun.\n    * We don\'t want table headers ("Potential Savings (ms)") to wrap or their column values, but\n    we\'d be happy for the URL column to wrap if the URLs are particularly long.\n    * We want the narrow columns to remain narrow, providing the most column width for URL\n    * We don\'t want the table to extend past 100% width.\n    * Long URLs in the URL column can wrap. Util.getURLDisplayName maxes them out at 64 characters,\n      but they do not get any overflow:ellipsis treatment.\n  */\n  word-break: break-word;\n}\n\n.lh-audit-group a,\n.lh-category-header__description a,\n.lh-audit__description a,\n.lh-warnings a,\n.lh-footer a,\n.lh-table-column--link a {\n  color: var(--link-color);\n}\n\n.lh-audit__description, .lh-audit__stackpack {\n  --inner-audit-padding-right: var(--stackpack-padding-horizontal);\n  padding-left: var(--audit-description-padding-left);\n  padding-right: var(--inner-audit-padding-right);\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n\n.lh-details {\n  margin-top: var(--default-padding);\n  margin-bottom: var(--default-padding);\n  margin-left: var(--audit-description-padding-left);\n  /* whatever the .lh-details side margins are */\n  width: 100%;\n}\n\n.lh-audit__stackpack {\n  display: flex;\n  align-items: center;\n}\n\n.lh-audit__stackpack__img {\n  max-width: 30px;\n  margin-right: var(--default-padding)\n}\n\n/* Report header */\n\n.lh-report-icon {\n  display: flex;\n  align-items: center;\n  padding: 10px 12px;\n  cursor: pointer;\n}\n.lh-report-icon[disabled] {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.lh-report-icon::before {\n  content: "";\n  margin: 4px;\n  background-repeat: no-repeat;\n  width: var(--report-icon-size);\n  height: var(--report-icon-size);\n  opacity: 0.7;\n  display: inline-block;\n  vertical-align: middle;\n}\n.lh-report-icon:hover::before {\n  opacity: 1;\n}\n.lh-dark .lh-report-icon::before {\n  filter: invert(1);\n}\n.lh-report-icon--print::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/><path fill="none" d="M0 0h24v24H0z"/></svg>\');\n}\n.lh-report-icon--copy::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>\');\n}\n.lh-report-icon--open::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z"/></svg>\');\n}\n.lh-report-icon--download::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\');\n}\n.lh-report-icon--dark::before {\n  background-image:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 100 125"><path d="M50 23.587c-16.27 0-22.799 12.574-22.799 21.417 0 12.917 10.117 22.451 12.436 32.471h20.726c2.32-10.02 12.436-19.554 12.436-32.471 0-8.843-6.528-21.417-22.799-21.417zM39.637 87.161c0 3.001 1.18 4.181 4.181 4.181h.426l.41 1.231C45.278 94.449 46.042 95 48.019 95h3.963c1.978 0 2.74-.551 3.365-2.427l.409-1.231h.427c3.002 0 4.18-1.18 4.18-4.181V80.91H39.637v6.251zM50 18.265c1.26 0 2.072-.814 2.072-2.073v-9.12C52.072 5.813 51.26 5 50 5c-1.259 0-2.072.813-2.072 2.073v9.12c0 1.259.813 2.072 2.072 2.072zM68.313 23.727c.994.774 2.135.634 2.91-.357l5.614-7.187c.776-.992.636-2.135-.356-2.909-.992-.776-2.135-.636-2.91.357l-5.613 7.186c-.778.993-.636 2.135.355 2.91zM91.157 36.373c-.306-1.222-1.291-1.815-2.513-1.51l-8.85 2.207c-1.222.305-1.814 1.29-1.51 2.512.305 1.223 1.291 1.814 2.513 1.51l8.849-2.206c1.223-.305 1.816-1.291 1.511-2.513zM86.757 60.48l-8.331-3.709c-1.15-.512-2.225-.099-2.736 1.052-.512 1.151-.1 2.224 1.051 2.737l8.33 3.707c1.15.514 2.225.101 2.736-1.05.513-1.149.1-2.223-1.05-2.737zM28.779 23.37c.775.992 1.917 1.131 2.909.357.992-.776 1.132-1.917.357-2.91l-5.615-7.186c-.775-.992-1.917-1.132-2.909-.357s-1.131 1.917-.356 2.909l5.614 7.187zM21.715 39.583c.305-1.223-.288-2.208-1.51-2.513l-8.849-2.207c-1.222-.303-2.208.289-2.513 1.511-.303 1.222.288 2.207 1.511 2.512l8.848 2.206c1.222.304 2.208-.287 2.513-1.509zM21.575 56.771l-8.331 3.711c-1.151.511-1.563 1.586-1.05 2.735.511 1.151 1.586 1.563 2.736 1.052l8.331-3.711c1.151-.511 1.563-1.586 1.05-2.735-.512-1.15-1.585-1.562-2.736-1.052z"/></svg>\');\n}\n.lh-report-icon--treemap::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="black"><path d="M3 5v14h19V5H3zm2 2h15v4H5V7zm0 10v-4h4v4H5zm6 0v-4h9v4h-9z"/></svg>\');\n}\n.lh-report-icon--date::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11h2v2H7v-2zm14-5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1a2 2 0 012 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"/></svg>\');\n}\n.lh-report-icon--devices::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h18V4H4a2 2 0 00-2 2v11H0v3h14v-3H4V6zm19 2h-6a1 1 0 00-1 1v10c0 .6.5 1 1 1h6c.6 0 1-.5 1-1V9c0-.6-.5-1-1-1zm-1 9h-4v-7h4v7z"/></svg>\');\n}\n.lh-report-icon--world::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7 6h-3c-.3-1.3-.8-2.5-1.4-3.6A8 8 0 0 1 18.9 8zm-7-4a14 14 0 0 1 2 4h-4a14 14 0 0 1 2-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.3a16.5 16.5 0 0 0 0 4H4.3zm.8 2h3a14 14 0 0 0 1.3 3.6A8 8 0 0 1 5.1 16zm3-8H5a8 8 0 0 1 4.3-3.6L8 8zM12 20a14 14 0 0 1-2-4h4a14 14 0 0 1-2 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.6 14.6 0 0 1 0 4zm.3 5.6c.6-1.2 1-2.4 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.3a8.2 8.2 0 0 1 0 4h-3.3z"/></svg>\');\n}\n.lh-report-icon--stopwatch::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.1-6.6L20.5 6l-1.4-1.4L17.7 6A9 9 0 0 0 3 13a9 9 0 1 0 16-5.6zm-7 12.6a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></svg>\');\n}\n.lh-report-icon--networkspeed::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.9 5c-.2 0-.3 0-.4.2v.2L10.1 17a2 2 0 0 0-.2 1 2 2 0 0 0 4 .4l2.4-12.9c0-.3-.2-.5-.5-.5zM1 9l2 2c2.9-2.9 6.8-4 10.5-3.6l1.2-2.7C10 3.8 4.7 5.3 1 9zm20 2 2-2a15.4 15.4 0 0 0-5.6-3.6L17 8.2c1.5.7 2.9 1.6 4.1 2.8zm-4 4 2-2a9.9 9.9 0 0 0-2.7-1.9l-.5 3 1.2.9zM5 13l2 2a7.1 7.1 0 0 1 4-2l1.3-2.9C9.7 10.1 7 11 5 13z"/></svg>\');\n}\n.lh-report-icon--samples-one::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="7" cy="14" r="3"/><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>\');\n}\n.lh-report-icon--samples-many::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><circle cx="7" cy="14" r="3"/><circle cx="11" cy="6" r="3"/></svg>\');\n}\n.lh-report-icon--chrome::before {\n  background-image: url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 562 562"><path d="M256 25.6v25.6a204 204 0 0 1 144.8 60 204 204 0 0 1 60 144.8 204 204 0 0 1-60 144.8 204 204 0 0 1-144.8 60 204 204 0 0 1-144.8-60 204 204 0 0 1-60-144.8 204 204 0 0 1 60-144.8 204 204 0 0 1 144.8-60V0a256 256 0 1 0 0 512 256 256 0 0 0 0-512v25.6z"/><path d="M256 179.2v25.6a51.3 51.3 0 0 1 0 102.4 51.3 51.3 0 0 1 0-102.4v-51.2a102.3 102.3 0 1 0-.1 204.7 102.3 102.3 0 0 0 .1-204.7v25.6z"/><path d="M256 204.8h217.6a25.6 25.6 0 0 0 0-51.2H256a25.6 25.6 0 0 0 0 51.2m44.3 76.8L191.5 470.1a25.6 25.6 0 1 0 44.4 25.6l108.8-188.5a25.6 25.6 0 1 0-44.4-25.6m-88.6 0L102.9 93.2a25.7 25.7 0 0 0-35-9.4 25.7 25.7 0 0 0-9.4 35l108.8 188.5a25.7 25.7 0 0 0 35 9.4 25.9 25.9 0 0 0 9.4-35.1"/></svg>\');\n}\n\n\n\n.lh-buttons {\n  display: flex;\n  flex-wrap: wrap;\n  margin: var(--default-padding) 0;\n}\n.lh-button {\n  height: 32px;\n  border: 1px solid var(--report-border-color-secondary);\n  border-radius: 3px;\n  color: var(--link-color);\n  background-color: var(--report-background-color);\n  margin: 5px;\n}\n\n.lh-button:first-of-type {\n  margin-left: 0;\n}\n\n/* Node */\n.lh-node__snippet {\n  font-family: var(--report-font-family-monospace);\n  color: var(--snippet-color);\n  font-size: var(--report-monospace-font-size);\n  line-height: 20px;\n}\n\n/* Score */\n\n.lh-audit__score-icon {\n  width: var(--score-icon-size);\n  height: var(--score-icon-size);\n  margin: var(--score-icon-margin);\n}\n\n.lh-audit--pass .lh-audit__display-text {\n  color: var(--color-pass-secondary);\n}\n.lh-audit--pass .lh-audit__score-icon,\n.lh-scorescale-range--pass::before {\n  border-radius: 100%;\n  background: var(--color-pass);\n}\n\n.lh-audit--average .lh-audit__display-text {\n  color: var(--color-average-secondary);\n}\n.lh-audit--average .lh-audit__score-icon,\n.lh-scorescale-range--average::before {\n  background: var(--color-average);\n  width: var(--icon-square-size);\n  height: var(--icon-square-size);\n}\n\n.lh-audit--fail .lh-audit__display-text {\n  color: var(--color-fail-secondary);\n}\n.lh-audit--fail .lh-audit__score-icon,\n.lh-audit--error .lh-audit__score-icon,\n.lh-scorescale-range--fail::before {\n  border-left: calc(var(--score-icon-size) / 2) solid transparent;\n  border-right: calc(var(--score-icon-size) / 2) solid transparent;\n  border-bottom: var(--score-icon-size) solid var(--color-fail);\n}\n\n.lh-audit--manual .lh-audit__display-text,\n.lh-audit--notapplicable .lh-audit__display-text {\n  color: var(--color-gray-600);\n}\n.lh-audit--manual .lh-audit__score-icon,\n.lh-audit--notapplicable .lh-audit__score-icon {\n  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);\n  border-radius: 100%;\n  background: none;\n}\n\n.lh-audit--informative .lh-audit__display-text {\n  color: var(--color-gray-600);\n}\n\n.lh-audit--informative .lh-audit__score-icon {\n  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);\n  border-radius: 100%;\n}\n\n.lh-audit__description,\n.lh-audit__stackpack {\n  color: var(--report-text-color-secondary);\n}\n.lh-audit__adorn {\n  border: 1px solid slategray;\n  border-radius: 3px;\n  margin: 0 3px;\n  padding: 0 2px;\n  line-height: 1.1;\n  display: inline-block;\n  font-size: 90%;\n}\n\n.lh-category-header__description  {\n  text-align: center;\n  color: var(--color-gray-700);\n  margin: 0px auto;\n  max-width: 400px;\n}\n\n\n.lh-audit__display-text,\n.lh-load-opportunity__sparkline,\n.lh-chevron-container {\n  margin: 0 var(--audit-margin-horizontal);\n}\n.lh-chevron-container {\n  margin-right: 0;\n}\n\n.lh-audit__title-and-text {\n  flex: 1;\n}\n\n.lh-audit__title-and-text code {\n  color: var(--snippet-color);\n  font-size: var(--report-monospace-font-size);\n}\n\n/* Prepend display text with em dash separator. But not in Opportunities. */\n.lh-audit__display-text:not(:empty):before {\n  content: \'—\';\n  margin-right: var(--audit-margin-horizontal);\n}\n.lh-audit-group.lh-audit-group--load-opportunities .lh-audit__display-text:not(:empty):before {\n  display: none;\n}\n\n/* Expandable Details (Audit Groups, Audits) */\n.lh-audit__header {\n  display: flex;\n  align-items: center;\n  padding: var(--default-padding);\n}\n\n.lh-audit--load-opportunity .lh-audit__header {\n  display: block;\n}\n\n\n.lh-metricfilter {\n  display: grid;\n  justify-content: end;\n  align-items: center;\n  grid-auto-flow: column;\n  gap: 4px;\n  color: var(--color-gray-700);\n}\n\n.lh-metricfilter__radio {\n  position: absolute;\n  left: -9999px;\n}\n.lh-metricfilter input[type=\'radio\']:focus-visible + label {\n  outline: -webkit-focus-ring-color auto 1px;\n}\n\n.lh-metricfilter__label {\n  display: inline-flex;\n  padding: 0 4px;\n  height: 16px;\n  text-decoration: underline;\n  align-items: center;\n  cursor: pointer;\n  font-size: 90%;\n}\n\n.lh-metricfilter__label--active {\n  background: var(--color-blue-primary);\n  color: var(--color-white);\n  border-radius: 3px;\n  text-decoration: none;\n}\n/* Give the \'All\' choice a more muted display */\n.lh-metricfilter__label--active[for="metric-All"] {\n  background-color: var(--color-blue-200) !important;\n  color: black !important;\n}\n\n.lh-metricfilter__text {\n  margin-right: 8px;\n}\n\n/* If audits are filtered, hide the itemcount for Passed Audits… */\n.lh-category--filtered .lh-audit-group .lh-audit-group__itemcount {\n  display: none;\n}\n\n\n.lh-audit__header:hover {\n  background-color: var(--color-hover);\n}\n\n/* We want to hide the browser\'s default arrow marker on summary elements. Admittedly, it\'s complicated. */\n.lh-root details > summary {\n  /* Blink 89+ and Firefox will hide the arrow when display is changed from (new) default of `list-item` to block.  https://chromestatus.com/feature/6730096436051968*/\n  display: block;\n}\n/* Safari and Blink <=88 require using the -webkit-details-marker selector */\n.lh-root details > summary::-webkit-details-marker {\n  display: none;\n}\n\n/* Perf Metric */\n\n.lh-metrics-container {\n  display: grid;\n  grid-auto-rows: 1fr;\n  grid-template-columns: 1fr 1fr;\n  grid-column-gap: var(--report-line-height);\n}\n\n.lh-metric {\n  border-top: 1px solid var(--report-border-color-secondary);\n}\n\n.lh-metric:nth-last-child(-n+2) {\n  border-bottom: 1px solid var(--report-border-color-secondary);\n}\n\n\n.lh-metric__innerwrap {\n  display: grid;\n  /**\n   * Icon -- Metric Name\n   *      -- Metric Value\n   */\n  grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 1fr;\n  align-items: center;\n  padding: var(--default-padding);\n}\n\n.lh-metric__details {\n  order: -1;\n}\n\n.lh-metric__title {\n  flex: 1;\n}\n\n.lh-calclink {\n  padding-left: calc(1ex / 3);\n}\n\n.lh-metric__description {\n  display: none;\n  grid-column-start: 2;\n  grid-column-end: 4;\n  color: var(--report-text-color-secondary);\n}\n\n.lh-metric__value {\n  font-size: var(--metric-value-font-size);\n  margin: calc(var(--default-padding) / 2) 0;\n  white-space: nowrap; /* No wrapping between metric value and the icon */\n  grid-column-start: 2;\n}\n\n\n@media screen and (max-width: 535px) {\n  .lh-metrics-container {\n    display: block;\n  }\n\n  .lh-metric {\n    border-bottom: none !important;\n  }\n  .lh-metric:nth-last-child(1) {\n    border-bottom: 1px solid var(--report-border-color-secondary) !important;\n  }\n\n  /* Change the grid to 3 columns for narrow viewport. */\n  .lh-metric__innerwrap {\n  /**\n   * Icon -- Metric Name -- Metric Value\n   */\n    grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 2fr 1fr;\n  }\n  .lh-metric__value {\n    justify-self: end;\n    grid-column-start: unset;\n  }\n}\n\n/* No-JS toggle switch */\n/* Keep this selector sync\'d w/ `magicSelector` in report-ui-features-test.js */\n .lh-metrics-toggle__input:checked ~ .lh-metrics-container .lh-metric__description {\n  display: block;\n}\n\n/* TODO get rid of the SVGS and clean up these some more */\n.lh-metrics-toggle__input {\n  opacity: 0;\n  position: absolute;\n  right: 0;\n  top: 0px;\n}\n\n.lh-metrics-toggle__input + div > label > .lh-metrics-toggle__labeltext--hide,\n.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--show {\n  display: none;\n}\n.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--hide {\n  display: inline;\n}\n.lh-metrics-toggle__input:focus + div > label {\n  outline: -webkit-focus-ring-color auto 3px;\n}\n\n.lh-metrics-toggle__label {\n  cursor: pointer;\n  font-size: var(--report-font-size-secondary);\n  line-height: var(--report-line-height-secondary);\n  color: var(--color-gray-700);\n}\n\n/* Pushes the metric description toggle button to the right. */\n.lh-audit-group--metrics .lh-audit-group__header {\n  display: flex;\n  justify-content: space-between;\n}\n\n.lh-metric__icon,\n.lh-scorescale-range::before {\n  content: \'\';\n  width: var(--score-icon-size);\n  height: var(--score-icon-size);\n  display: inline-block;\n  margin: var(--score-icon-margin);\n}\n\n.lh-metric--pass .lh-metric__value {\n  color: var(--color-pass-secondary);\n}\n.lh-metric--pass .lh-metric__icon {\n  border-radius: 100%;\n  background: var(--color-pass);\n}\n\n.lh-metric--average .lh-metric__value {\n  color: var(--color-average-secondary);\n}\n.lh-metric--average .lh-metric__icon {\n  background: var(--color-average);\n  width: var(--icon-square-size);\n  height: var(--icon-square-size);\n}\n\n.lh-metric--fail .lh-metric__value {\n  color: var(--color-fail-secondary);\n}\n.lh-metric--fail .lh-metric__icon,\n.lh-metric--error .lh-metric__icon {\n  border-left: calc(var(--score-icon-size) / 2) solid transparent;\n  border-right: calc(var(--score-icon-size) / 2) solid transparent;\n  border-bottom: var(--score-icon-size) solid var(--color-fail);\n}\n\n.lh-metric--error .lh-metric__value,\n.lh-metric--error .lh-metric__description {\n  color: var(--color-fail-secondary);\n}\n\n/* Perf load opportunity */\n\n.lh-load-opportunity__cols {\n  display: flex;\n  align-items: flex-start;\n}\n\n.lh-load-opportunity__header .lh-load-opportunity__col {\n  color: var(--color-gray-600);\n  display: unset;\n  line-height: calc(2.3 * var(--report-font-size));\n}\n\n.lh-load-opportunity__col {\n  display: flex;\n}\n\n.lh-load-opportunity__col--one {\n  flex: 5;\n  align-items: center;\n  margin-right: 2px;\n}\n.lh-load-opportunity__col--two {\n  flex: 4;\n  text-align: right;\n}\n\n.lh-audit--load-opportunity .lh-audit__display-text {\n  text-align: right;\n  flex: 0 0 calc(3 * var(--report-font-size));\n}\n\n\n/* Sparkline */\n\n.lh-load-opportunity__sparkline {\n  flex: 1;\n  margin-top: calc((var(--report-line-height) - var(--sparkline-height)) / 2);\n}\n\n.lh-sparkline {\n  height: var(--sparkline-height);\n  width: 100%;\n}\n\n.lh-sparkline__bar {\n  height: 100%;\n  float: right;\n}\n\n.lh-audit--pass .lh-sparkline__bar {\n  background: var(--color-pass);\n}\n\n.lh-audit--average .lh-sparkline__bar {\n  background: var(--color-average);\n}\n\n.lh-audit--fail .lh-sparkline__bar {\n  background: var(--color-fail);\n}\n\n/* Filmstrip */\n\n.lh-filmstrip-container {\n  /* smaller gap between metrics and filmstrip */\n  margin: -8px auto 0 auto;\n}\n\n.lh-filmstrip {\n  display: grid;\n  justify-content: space-between;\n  padding-bottom: var(--default-padding);\n  width: 100%;\n  grid-template-columns: repeat(auto-fit, 60px);\n}\n\n.lh-filmstrip__frame {\n  text-align: right;\n  position: relative;\n}\n\n.lh-filmstrip__thumbnail {\n  border: 1px solid var(--report-border-color-secondary);\n  max-height: 100px;\n  max-width: 60px;\n}\n\n/* Audit */\n\n.lh-audit {\n  border-bottom: 1px solid var(--report-border-color-secondary);\n}\n\n/* Apply border-top to just the first audit. */\n.lh-audit {\n  border-top: 1px solid var(--report-border-color-secondary);\n}\n.lh-audit ~ .lh-audit {\n  border-top: none;\n}\n\n\n.lh-audit--error .lh-audit__display-text {\n  color: var(--color-fail);\n}\n\n/* Audit Group */\n\n.lh-audit-group {\n  margin-bottom: var(--audit-group-margin-bottom);\n  position: relative;\n}\n.lh-audit-group--metrics {\n  margin-bottom: calc(var(--audit-group-margin-bottom) / 2);\n}\n\n.lh-audit-group__header::before {\n  /* By default, groups don\'t get an icon */\n  content: none;\n  width: var(--pwa-icon-size);\n  height: var(--pwa-icon-size);\n  margin: var(--pwa-icon-margin);\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* Style the "over budget" columns red. */\n.lh-audit-group--budgets #performance-budget tbody tr td:nth-child(4),\n.lh-audit-group--budgets #performance-budget tbody tr td:nth-child(5),\n.lh-audit-group--budgets #timing-budget tbody tr td:nth-child(3) {\n  color: var(--color-red-700);\n}\n\n/* Align the "over budget request count" text to be close to the "over budget bytes" column. */\n.lh-audit-group--budgets .lh-table tbody tr td:nth-child(4){\n  text-align: right;\n}\n\n.lh-audit-group--budgets .lh-details--budget {\n  width: 100%;\n  margin: 0 0 var(--default-padding);\n}\n\n.lh-audit-group--pwa-installable .lh-audit-group__header::before {\n  content: \'\';\n  background-image: var(--pwa-installable-gray-url);\n}\n.lh-audit-group--pwa-optimized .lh-audit-group__header::before {\n  content: \'\';\n  background-image: var(--pwa-optimized-gray-url);\n}\n.lh-audit-group--pwa-installable.lh-badged .lh-audit-group__header::before {\n  background-image: var(--pwa-installable-color-url);\n}\n.lh-audit-group--pwa-optimized.lh-badged .lh-audit-group__header::before {\n  background-image: var(--pwa-optimized-color-url);\n}\n\n.lh-audit-group--metrics .lh-audit-group__summary {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.lh-audit-group__summary {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.lh-audit-group__header .lh-chevron {\n  margin-top: calc((var(--report-line-height) - 5px) / 2);\n}\n\n.lh-audit-group__header {\n  letter-spacing: 0.8px;\n  padding: var(--default-padding);\n  padding-left: 0;\n}\n\n.lh-audit-group__header, .lh-audit-group__summary {\n  font-size: var(--report-font-size-secondary);\n  line-height: var(--report-line-height-secondary);\n  color: var(--color-gray-700);\n}\n\n.lh-audit-group__title {\n  text-transform: uppercase;\n  font-weight: 500;\n}\n\n.lh-audit-group__itemcount {\n  color: var(--color-gray-600);\n}\n\n.lh-audit-group__footer {\n  color: var(--color-gray-600);\n  display: block;\n  margin-top: var(--default-padding);\n}\n\n.lh-details,\n.lh-category-header__description,\n.lh-load-opportunity__header,\n.lh-audit-group__footer {\n  font-size: var(--report-font-size-secondary);\n  line-height: var(--report-line-height-secondary);\n}\n\n.lh-audit-explanation {\n  margin: var(--audit-padding-vertical) 0 calc(var(--audit-padding-vertical) / 2) var(--audit-margin-horizontal);\n  line-height: var(--audit-explanation-line-height);\n  display: inline-block;\n}\n\n.lh-audit--fail .lh-audit-explanation {\n  color: var(--color-fail);\n}\n\n/* Report */\n.lh-list > div:not(:last-child) {\n  padding-bottom: 20px;\n}\n\n.lh-header-container {\n  display: block;\n  margin: 0 auto;\n  position: relative;\n  word-wrap: break-word;\n}\n\n.lh-report {\n  min-width: var(--report-min-width);\n}\n\n.lh-exception {\n  font-size: large;\n}\n\n.lh-code {\n  white-space: normal;\n  margin-top: 0;\n  font-size: var(--report-monospace-font-size);\n}\n\n.lh-warnings {\n  --item-margin: calc(var(--report-line-height) / 6);\n  color: var(--color-average-secondary);\n  margin: var(--audit-padding-vertical) 0;\n  padding: var(--default-padding)\n    var(--default-padding)\n    var(--default-padding)\n    calc(var(--audit-description-padding-left));\n  background-color: var(--toplevel-warning-background-color);\n}\n.lh-warnings span {\n  font-weight: bold;\n}\n\n.lh-warnings--toplevel {\n  --item-margin: calc(var(--header-line-height) / 4);\n  color: var(--toplevel-warning-text-color);\n  margin-left: auto;\n  margin-right: auto;\n  --content-width-minus-category-padding-sides: calc(var(--report-content-width) - calc(var(--default-padding) * 4) * 2);\n  max-width: var(--content-width-minus-category-padding-sides);\n  padding: var(--toplevel-warning-padding);\n  border-radius: 8px;\n}\n\n.lh-warnings__msg {\n  color: var(--toplevel-warning-message-text-color);\n  margin: 0;\n}\n\n.lh-warnings ul {\n  margin: 0;\n}\n.lh-warnings li {\n  margin: var(--item-margin) 0;\n}\n.lh-warnings li:last-of-type {\n  margin-bottom: 0;\n}\n\n.lh-scores-header {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n.lh-scores-header__solo {\n  padding: 0;\n  border: 0;\n}\n\n/* Gauge */\n\n.lh-gauge__wrapper--pass {\n  color: var(--color-pass-secondary);\n  fill: var(--color-pass);\n  stroke: var(--color-pass);\n}\n\n.lh-gauge__wrapper--average {\n  color: var(--color-average-secondary);\n  fill: var(--color-average);\n  stroke: var(--color-average);\n}\n\n.lh-gauge__wrapper--fail {\n  color: var(--color-fail-secondary);\n  fill: var(--color-fail);\n  stroke: var(--color-fail);\n}\n\n.lh-gauge__wrapper--not-applicable {\n  color: var(--color-not-applicable);\n  fill: var(--color-not-applicable);\n  stroke: var(--color-not-applicable);\n}\n\n.lh-fraction__wrapper .lh-fraction__content::before {\n  content: \'\';\n  height: var(--score-icon-size);\n  width: var(--score-icon-size);\n  margin: var(--score-icon-margin);\n  display: inline-block;\n}\n.lh-fraction__wrapper--pass .lh-fraction__content {\n  color: var(--color-pass-secondary);\n}\n.lh-fraction__wrapper--pass .lh-fraction__background {\n  background-color: var(--color-pass);\n}\n.lh-fraction__wrapper--pass .lh-fraction__content::before {\n  background-color: var(--color-pass);\n  border-radius: 50%;\n}\n.lh-fraction__wrapper--average .lh-fraction__content {\n  color: var(--color-average-secondary);\n}\n.lh-fraction__wrapper--average .lh-fraction__background,\n.lh-fraction__wrapper--average .lh-fraction__content::before {\n  background-color: var(--color-average);\n}\n.lh-fraction__wrapper--fail .lh-fraction__content {\n  color: var(--color-fail);\n}\n.lh-fraction__wrapper--fail .lh-fraction__background {\n  background-color: var(--color-fail);\n}\n.lh-fraction__wrapper--fail .lh-fraction__content::before {\n  border-left: calc(var(--score-icon-size) / 2) solid transparent;\n  border-right: calc(var(--score-icon-size) / 2) solid transparent;\n  border-bottom: var(--score-icon-size) solid var(--color-fail);\n}\n.lh-fraction__wrapper--null .lh-fraction__content {\n  color: var(--color-gray-700);\n}\n.lh-fraction__wrapper--null .lh-fraction__background {\n  background-color: var(--color-gray-700);\n}\n.lh-fraction__wrapper--null .lh-fraction__content::before {\n  border-radius: 50%;\n  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-700);\n}\n\n.lh-fraction__background {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  border-radius: calc(var(--gauge-circle-size) / 2);\n  opacity: 0.1;\n  z-index: -1;\n}\n\n.lh-fraction__content-wrapper {\n  height: var(--gauge-circle-size);\n  display: flex;\n  align-items: center;\n}\n\n.lh-fraction__content {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(0.3 * var(--gauge-circle-size));\n  line-height: calc(0.4 * var(--gauge-circle-size));\n  width: max-content;\n  min-width: calc(1.5 * var(--gauge-circle-size));\n  padding: calc(0.1 * var(--gauge-circle-size)) calc(0.2 * var(--gauge-circle-size));\n  --score-icon-size: calc(0.21 * var(--gauge-circle-size));\n  --score-icon-margin: 0 calc(0.15 * var(--gauge-circle-size)) 0 0;\n}\n\n.lh-gauge {\n  stroke-linecap: round;\n  width: var(--gauge-circle-size);\n  height: var(--gauge-circle-size);\n}\n\n.lh-category .lh-gauge {\n  --gauge-circle-size: var(--gauge-circle-size-big);\n}\n\n.lh-gauge-base {\n  opacity: 0.1;\n}\n\n.lh-gauge-arc {\n  fill: none;\n  transform-origin: 50% 50%;\n  animation: load-gauge var(--transition-length) ease forwards;\n  animation-delay: 250ms;\n}\n\n.lh-gauge__svg-wrapper {\n  position: relative;\n  height: var(--gauge-circle-size);\n}\n.lh-category .lh-gauge__svg-wrapper,\n.lh-category .lh-fraction__wrapper {\n  --gauge-circle-size: var(--gauge-circle-size-big);\n}\n\n/* The plugin badge overlay */\n.lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {\n  width: var(--plugin-badge-size);\n  height: var(--plugin-badge-size);\n  background-color: var(--plugin-badge-background-color);\n  background-image: var(--plugin-icon-url);\n  background-repeat: no-repeat;\n  background-size: var(--plugin-icon-size);\n  background-position: 58% 50%;\n  content: "";\n  position: absolute;\n  right: -6px;\n  bottom: 0px;\n  display: block;\n  z-index: 100;\n  box-shadow: 0 0 4px rgba(0,0,0,.2);\n  border-radius: 25%;\n}\n.lh-category .lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {\n  width: var(--plugin-badge-size-big);\n  height: var(--plugin-badge-size-big);\n}\n\n@keyframes load-gauge {\n  from { stroke-dasharray: 0 352; }\n}\n\n.lh-gauge__percentage {\n  width: 100%;\n  height: var(--gauge-circle-size);\n  position: absolute;\n  font-family: var(--report-font-family-monospace);\n  font-size: calc(var(--gauge-circle-size) * 0.34 + 1.3px);\n  line-height: 0;\n  text-align: center;\n  top: calc(var(--score-container-padding) + var(--gauge-circle-size) / 2);\n}\n\n.lh-category .lh-gauge__percentage {\n  --gauge-circle-size: var(--gauge-circle-size-big);\n  --gauge-percentage-font-size: var(--gauge-percentage-font-size-big);\n}\n\n.lh-gauge__wrapper,\n.lh-fraction__wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  text-decoration: none;\n  padding: var(--score-container-padding);\n\n  --transition-length: 1s;\n\n  /* Contain the layout style paint & layers during animation*/\n  contain: content;\n  will-change: opacity; /* Only using for layer promotion */\n}\n\n.lh-gauge__label,\n.lh-fraction__label {\n  font-size: var(--gauge-label-font-size);\n  font-weight: 500;\n  line-height: var(--gauge-label-line-height);\n  margin-top: 10px;\n  text-align: center;\n  color: var(--report-text-color);\n  word-break: keep-all;\n}\n\n/* TODO(#8185) use more BEM (.lh-gauge__label--big) instead of relying on descendant selector */\n.lh-category .lh-gauge__label,\n.lh-category .lh-fraction__label {\n  --gauge-label-font-size: var(--gauge-label-font-size-big);\n  --gauge-label-line-height: var(--gauge-label-line-height-big);\n  margin-top: 14px;\n}\n\n.lh-scores-header .lh-gauge__wrapper,\n.lh-scores-header .lh-fraction__wrapper,\n.lh-scores-header .lh-gauge--pwa__wrapper,\n.lh-sticky-header .lh-gauge__wrapper,\n.lh-sticky-header .lh-fraction__wrapper,\n.lh-sticky-header .lh-gauge--pwa__wrapper {\n  width: var(--gauge-wrapper-width);\n}\n\n.lh-scorescale {\n  display: inline-flex;\n\n  gap: calc(var(--default-padding) * 4);\n  margin: 16px auto 0 auto;\n  font-size: var(--report-font-size-secondary);\n  color: var(--color-gray-700);\n\n}\n\n.lh-scorescale-range {\n  display: flex;\n  align-items: center;\n  font-family: var(--report-font-family-monospace);\n  white-space: nowrap;\n}\n\n.lh-category-header__finalscreenshot .lh-scorescale {\n  border: 0;\n  display: flex;\n  justify-content: center;\n}\n\n.lh-category-header__finalscreenshot .lh-scorescale-range {\n  font-family: unset;\n  font-size: 12px;\n}\n\n.lh-scorescale-wrap {\n  display: contents;\n}\n\n/* Hide category score gauages if it\'s a single category report */\n.lh-header--solo-category .lh-scores-wrapper {\n  display: none;\n}\n\n\n.lh-categories {\n  width: 100%;\n  overflow: hidden;\n}\n\n.lh-category {\n  padding: var(--category-padding);\n  max-width: var(--report-content-width);\n  margin: 0 auto;\n\n  --sticky-header-height: calc(var(--gauge-circle-size-sm) + var(--score-container-padding) * 2);\n  --topbar-plus-sticky-header: calc(var(--topbar-height) + var(--sticky-header-height));\n  scroll-margin-top: var(--topbar-plus-sticky-header);\n\n  /* Faster recalc style & layout of the report. https://web.dev/content-visibility/ */\n  content-visibility: auto;\n  contain-intrinsic-size: 1000px;\n}\n\n.lh-category-wrapper {\n  border-bottom: 1px solid var(--color-gray-200);\n}\n\n.lh-category-wrapper:first-of-type {\n  border-top: 1px solid var(--color-gray-200);\n}\n\n.lh-category-header {\n  margin-bottom: var(--section-padding-vertical);\n}\n\n.lh-category-header .lh-score__gauge {\n  max-width: 400px;\n  width: auto;\n  margin: 0px auto;\n}\n\n.lh-category-header__finalscreenshot {\n  display: grid;\n  grid-template: none / 1fr 1px 1fr;\n  justify-items: center;\n  align-items: center;\n  gap: var(--report-line-height);\n  min-height: 288px;\n  margin-bottom: var(--default-padding);\n}\n\n.lh-final-ss-image {\n  /* constrain the size of the image to not be too large */\n  max-height: calc(var(--gauge-circle-size-big) * 2.8);\n  max-width: calc(var(--gauge-circle-size-big) * 3.5);\n  border: 1px solid var(--color-gray-200);\n  padding: 4px;\n  border-radius: 3px;\n  display: block;\n}\n\n.lh-category-headercol--separator {\n  background: var(--color-gray-200);\n  width: 1px;\n  height: var(--gauge-circle-size-big);\n}\n\n@media screen and (max-width: 780px) {\n  .lh-category-header__finalscreenshot {\n    grid-template: 1fr 1fr / none\n  }\n  .lh-category-headercol--separator {\n    display: none;\n  }\n}\n\n\n/* 964 fits the min-width of the filmstrip */\n@media screen and (max-width: 964px) {\n  .lh-report {\n    margin-left: 0;\n    width: 100%;\n  }\n}\n\n@media print {\n  body {\n    -webkit-print-color-adjust: exact; /* print background colors */\n  }\n  .lh-container {\n    display: block;\n  }\n  .lh-report {\n    margin-left: 0;\n    padding-top: 0;\n  }\n  .lh-categories {\n    margin-top: 0;\n  }\n}\n\n.lh-table {\n  border-collapse: collapse;\n  /* Can\'t assign padding to table, so shorten the width instead. */\n  width: calc(100% - var(--audit-description-padding-left) - var(--stackpack-padding-horizontal));\n  border: 1px solid var(--report-border-color-secondary);\n\n}\n\n.lh-table thead th {\n  font-weight: normal;\n  color: var(--color-gray-600);\n  /* See text-wrapping comment on .lh-container. */\n  word-break: normal;\n}\n\n.lh-row--even {\n  background-color: var(--table-higlight-background-color);\n}\n.lh-row--hidden {\n  display: none;\n}\n\n.lh-table th,\n.lh-table td {\n  padding: var(--default-padding);\n}\n\n.lh-table tr {\n  vertical-align: middle;\n}\n\n/* Looks unnecessary, but mostly for keeping the <th>s left-aligned */\n.lh-table-column--text,\n.lh-table-column--source-location,\n.lh-table-column--url,\n/* .lh-table-column--thumbnail, */\n/* .lh-table-column--empty,*/\n.lh-table-column--code,\n.lh-table-column--node {\n  text-align: left;\n}\n\n.lh-table-column--code {\n  min-width: 100px;\n}\n\n.lh-table-column--bytes,\n.lh-table-column--timespanMs,\n.lh-table-column--ms,\n.lh-table-column--numeric {\n  text-align: right;\n  word-break: normal;\n}\n\n\n\n.lh-table .lh-table-column--thumbnail {\n  width: var(--image-preview-size);\n}\n\n.lh-table-column--url {\n  min-width: 250px;\n}\n\n.lh-table-column--text {\n  min-width: 80px;\n}\n\n/* Keep columns narrow if they follow the URL column */\n/* 12% was determined to be a decent narrow width, but wide enough for column headings */\n.lh-table-column--url + th.lh-table-column--bytes,\n.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--bytes,\n.lh-table-column--url + .lh-table-column--ms,\n.lh-table-column--url + .lh-table-column--ms + th.lh-table-column--bytes,\n.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--timespanMs {\n  width: 12%;\n}\n\n.lh-text__url-host {\n  display: inline;\n}\n\n.lh-text__url-host {\n  margin-left: calc(var(--report-font-size) / 2);\n  opacity: 0.6;\n  font-size: 90%\n}\n\n.lh-thumbnail {\n  object-fit: cover;\n  width: var(--image-preview-size);\n  height: var(--image-preview-size);\n  display: block;\n}\n\n.lh-unknown pre {\n  overflow: scroll;\n  border: solid 1px var(--color-gray-200);\n}\n\n.lh-text__url > a {\n  color: inherit;\n  text-decoration: none;\n}\n\n.lh-text__url > a:hover {\n  text-decoration: underline dotted #999;\n}\n\n.lh-sub-item-row {\n  margin-left: 20px;\n  margin-bottom: 0;\n  color: var(--color-gray-700);\n}\n.lh-sub-item-row td {\n  padding-top: 4px;\n  padding-bottom: 4px;\n  padding-left: 20px;\n}\n\n/* Chevron\n   https://codepen.io/paulirish/pen/LmzEmK\n */\n.lh-chevron {\n  --chevron-angle: 42deg;\n  /* Edge doesn\'t support transform: rotate(calc(...)), so we define it here */\n  --chevron-angle-right: -42deg;\n  width: var(--chevron-size);\n  height: var(--chevron-size);\n  margin-top: calc((var(--report-line-height) - 12px) / 2);\n}\n\n.lh-chevron__lines {\n  transition: transform 0.4s;\n  transform: translateY(var(--report-line-height));\n}\n.lh-chevron__line {\n stroke: var(--chevron-line-stroke);\n stroke-width: var(--chevron-size);\n stroke-linecap: square;\n transform-origin: 50%;\n transform: rotate(var(--chevron-angle));\n transition: transform 300ms, stroke 300ms;\n}\n\n.lh-expandable-details .lh-chevron__line-right,\n.lh-expandable-details[open] .lh-chevron__line-left {\n transform: rotate(var(--chevron-angle-right));\n}\n\n.lh-expandable-details[open] .lh-chevron__line-right {\n  transform: rotate(var(--chevron-angle));\n}\n\n\n.lh-expandable-details[open]  .lh-chevron__lines {\n transform: translateY(calc(var(--chevron-size) * -1));\n}\n\n.lh-expandable-details[open] {\n  animation: 300ms openDetails forwards;\n  padding-bottom: var(--default-padding);\n}\n\n@keyframes openDetails {\n  from {\n    outline: 1px solid var(--report-background-color);\n  }\n  to {\n   outline: 1px solid;\n   box-shadow: 0 2px 4px rgba(0, 0, 0, .24);\n  }\n}\n\n@media screen and (max-width: 780px) {\n  /* no black outline if we\'re not confident the entire table can be displayed within bounds */\n  .lh-expandable-details[open] {\n    animation: none;\n  }\n}\n\n.lh-expandable-details[open] summary, details.lh-clump > summary {\n  border-bottom: 1px solid var(--report-border-color-secondary);\n}\ndetails.lh-clump[open] > summary {\n  border-bottom-width: 0;\n}\n\n\n\ndetails .lh-clump-toggletext--hide,\ndetails[open] .lh-clump-toggletext--show { display: none; }\ndetails[open] .lh-clump-toggletext--hide { display: block;}\n\n\n/* Tooltip */\n.lh-tooltip-boundary {\n  position: relative;\n}\n\n.lh-tooltip {\n  position: absolute;\n  display: none; /* Don\'t retain these layers when not needed */\n  opacity: 0;\n  background: #ffffff;\n  white-space: pre-line; /* Render newlines in the text */\n  min-width: 246px;\n  max-width: 275px;\n  padding: 15px;\n  border-radius: 5px;\n  text-align: initial;\n  line-height: 1.4;\n}\n/* shrink tooltips to not be cutoff on left edge of narrow viewports\n   45vw is chosen to be ~= width of the left column of metrics\n*/\n@media screen and (max-width: 535px) {\n  .lh-tooltip {\n    min-width: 45vw;\n    padding: 3vw;\n  }\n}\n\n.lh-tooltip-boundary:hover .lh-tooltip {\n  display: block;\n  animation: fadeInTooltip 250ms;\n  animation-fill-mode: forwards;\n  animation-delay: 850ms;\n  bottom: 100%;\n  z-index: 1;\n  will-change: opacity;\n  right: 0;\n  pointer-events: none;\n}\n\n.lh-tooltip::before {\n  content: "";\n  border: solid transparent;\n  border-bottom-color: #fff;\n  border-width: 10px;\n  position: absolute;\n  bottom: -20px;\n  right: 6px;\n  transform: rotate(180deg);\n  pointer-events: none;\n}\n\n@keyframes fadeInTooltip {\n  0% { opacity: 0; }\n  75% { opacity: 1; }\n  100% { opacity: 1;  filter: drop-shadow(1px 0px 1px #aaa) drop-shadow(0px 2px 4px hsla(206, 6%, 25%, 0.15)); pointer-events: auto; }\n}\n\n/* Element screenshot */\n.lh-element-screenshot {\n  position: relative;\n  overflow: hidden;\n  float: left;\n  margin-right: 20px;\n}\n.lh-element-screenshot__content {\n  overflow: hidden;\n}\n.lh-element-screenshot__image {\n  /* Set by ElementScreenshotRenderer.installFullPageScreenshotCssVariable */\n  background-image: var(--element-screenshot-url);\n  outline: 2px solid #777;\n  background-color: white;\n  background-repeat: no-repeat;\n}\n.lh-element-screenshot__mask {\n  position: absolute;\n  background: #555;\n  opacity: 0.8;\n}\n.lh-element-screenshot__element-marker {\n  position: absolute;\n  outline: 2px solid var(--color-lime-400);\n}\n.lh-element-screenshot__overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 2000; /* .lh-topbar is 1000 */\n  background: var(--screenshot-overlay-background);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: zoom-out;\n}\n\n.lh-element-screenshot__overlay .lh-element-screenshot {\n  margin-right: 0; /* clearing margin used in thumbnail case */\n  outline: 1px solid var(--color-gray-700);\n}\n\n.lh-screenshot-overlay--enabled .lh-element-screenshot {\n  cursor: zoom-out;\n}\n.lh-screenshot-overlay--enabled .lh-node .lh-element-screenshot {\n  cursor: zoom-in;\n}\n\n\n.lh-meta__items {\n  --meta-icon-size: calc(var(--report-icon-size) * 0.667);\n  padding: var(--default-padding);\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  background-color: var(--env-item-background-color);\n  border-radius: 3px;\n  margin: 0 0 var(--default-padding) 0;\n  font-size: 12px;\n  column-gap: var(--default-padding);\n  color: var(--color-gray-700);\n}\n\n.lh-meta__item {\n  display: block;\n  list-style-type: none;\n  position: relative;\n  padding: 0 0 0 calc(var(--meta-icon-size) + var(--default-padding) * 2);\n  cursor: unset; /* disable pointer cursor from report-icon */\n}\n\n.lh-meta__item.lh-tooltip-boundary {\n  text-decoration: dotted underline var(--color-gray-500);\n  cursor: help;\n}\n\n.lh-meta__item.lh-report-icon::before {\n  position: absolute;\n  left: var(--default-padding);\n  width: var(--meta-icon-size);\n  height: var(--meta-icon-size);\n}\n\n.lh-meta__item.lh-report-icon:hover::before {\n  opacity: 0.7;\n}\n\n.lh-meta__item .lh-tooltip {\n  color: var(--color-gray-800);\n}\n\n.lh-meta__item .lh-tooltip::before {\n  right: auto; /* Set the tooltip arrow to the leftside */\n  left: 6px;\n}\n\n/* Change the grid for narrow viewport. */\n@media screen and (max-width: 640px) {\n  .lh-meta__items {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media screen and (max-width: 535px) {\n  .lh-meta__items {\n    display: block;\n  }\n}\n\n\n/*# sourceURL=report-styles.css */\n'), t.append(n), t;
          }(e);

        case "topbar":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("style");
            n.append("\n    .lh-topbar {\n      position: sticky;\n      top: 0;\n      left: 0;\n      right: 0;\n      z-index: 1000;\n      display: flex;\n      align-items: center;\n      height: var(--topbar-height);\n      padding: var(--topbar-padding);\n      font-size: var(--report-font-size-secondary);\n      background-color: var(--topbar-background-color);\n      border-bottom: 1px solid var(--color-gray-200);\n    }\n\n    .lh-topbar__logo {\n      width: var(--topbar-logo-size);\n      height: var(--topbar-logo-size);\n      user-select: none;\n      flex: none;\n    }\n\n    .lh-topbar__url {\n      margin: var(--topbar-padding);\n      text-decoration: none;\n      color: var(--report-text-color);\n      text-overflow: ellipsis;\n      overflow: hidden;\n      white-space: nowrap;\n    }\n\n    .lh-tools {\n      display: flex;\n      align-items: center;\n      margin-left: auto;\n      will-change: transform;\n      min-width: var(--report-icon-size);\n    }\n    .lh-tools__button {\n      width: var(--report-icon-size);\n      min-width: 24px;\n      height: var(--report-icon-size);\n      cursor: pointer;\n      margin-right: 5px;\n      /* This is actually a button element, but we want to style it like a transparent div. */\n      display: flex;\n      background: none;\n      color: inherit;\n      border: none;\n      padding: 0;\n      font: inherit;\n      outline: inherit;\n    }\n    .lh-tools__button svg {\n      fill: var(--tools-icon-color);\n    }\n    .lh-dark .lh-tools__button svg {\n      filter: invert(1);\n    }\n    .lh-tools__button.lh-active + .lh-tools__dropdown {\n      opacity: 1;\n      clip: rect(-1px, 194px, 242px, -3px);\n      visibility: visible;\n    }\n    .lh-tools__dropdown {\n      position: absolute;\n      background-color: var(--report-background-color);\n      border: 1px solid var(--report-border-color);\n      border-radius: 3px;\n      padding: calc(var(--default-padding) / 2) 0;\n      cursor: pointer;\n      top: 36px;\n      right: 0;\n      box-shadow: 1px 1px 3px #ccc;\n      min-width: 125px;\n      clip: rect(0, 164px, 0, 0);\n      visibility: hidden;\n      opacity: 0;\n      transition: all 200ms cubic-bezier(0,0,0.2,1);\n    }\n    .lh-tools__dropdown a {\n      color: currentColor;\n      text-decoration: none;\n      white-space: nowrap;\n      padding: 0 6px;\n      line-height: 2;\n    }\n    .lh-tools__dropdown a:hover,\n    .lh-tools__dropdown a:focus {\n      background-color: var(--color-gray-200);\n      outline: none;\n    }\n    /* save-gist option hidden in report. */\n    .lh-tools__dropdown a[data-action='save-gist'] {\n      display: none;\n    }\n\n    .lh-locale-selector {\n      width: 100%;\n      color: var(--report-text-color);\n      background-color: var(--locale-selector-background-color);\n      padding: 2px;\n    }\n    .lh-tools-locale {\n      display: flex;\n      align-items: center;\n      flex-direction: row-reverse;\n    }\n    .lh-tools-locale__selector-wrapper {\n      transition: opacity 0.15s;\n      opacity: 0;\n      max-width: 200px;\n    }\n    .lh-button.lh-tool-locale__button {\n      height: var(--topbar-height);\n      color: var(--tools-icon-color);\n      padding: calc(var(--default-padding) / 2);\n    }\n    .lh-tool-locale__button.lh-active + .lh-tools-locale__selector-wrapper {\n      opacity: 1;\n      clip: rect(-1px, 194px, 242px, -3px);\n      visibility: visible;\n      margin: 0 4px;\n    }\n\n    @media screen and (max-width: 964px) {\n      .lh-tools__dropdown {\n        right: 0;\n        left: initial;\n      }\n    }\n    @media print {\n      .lh-topbar {\n        position: static;\n        margin-left: 0;\n      }\n\n      .lh-tools__dropdown {\n        display: none;\n      }\n    }\n  "), t.append(n);
            const r = e.createElement("div", "lh-topbar"),
                  o = e.createElementNS("http://www.w3.org/2000/svg", "svg", "lh-topbar__logo");
            o.setAttribute("viewBox", "0 0 24 24");
            const i = e.createElementNS("http://www.w3.org/2000/svg", "defs"),
                  a = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            a.setAttribute("x1", "57.456%"), a.setAttribute("y1", "13.086%"), a.setAttribute("x2", "18.259%"), a.setAttribute("y2", "72.322%"), a.setAttribute("id", "lh-topbar__logo--a");
            const l = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            l.setAttribute("stop-color", "#262626"), l.setAttribute("stop-opacity", ".1"), l.setAttribute("offset", "0%");
            const s = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            s.setAttribute("stop-color", "#262626"), s.setAttribute("stop-opacity", "0"), s.setAttribute("offset", "100%"), a.append(" ", l, " ", s, " ");
            const c = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            c.setAttribute("x1", "100%"), c.setAttribute("y1", "50%"), c.setAttribute("x2", "0%"), c.setAttribute("y2", "50%"), c.setAttribute("id", "lh-topbar__logo--b");
            const d = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            d.setAttribute("stop-color", "#262626"), d.setAttribute("stop-opacity", ".1"), d.setAttribute("offset", "0%");
            const p = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            p.setAttribute("stop-color", "#262626"), p.setAttribute("stop-opacity", "0"), p.setAttribute("offset", "100%"), c.append(" ", d, " ", p, " ");
            const h = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            h.setAttribute("x1", "58.764%"), h.setAttribute("y1", "65.756%"), h.setAttribute("x2", "36.939%"), h.setAttribute("y2", "50.14%"), h.setAttribute("id", "lh-topbar__logo--c");
            const u = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            u.setAttribute("stop-color", "#262626"), u.setAttribute("stop-opacity", ".1"), u.setAttribute("offset", "0%");
            const g = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            g.setAttribute("stop-color", "#262626"), g.setAttribute("stop-opacity", "0"), g.setAttribute("offset", "100%"), h.append(" ", u, " ", g, " ");
            const m = e.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            m.setAttribute("x1", "41.635%"), m.setAttribute("y1", "20.358%"), m.setAttribute("x2", "72.863%"), m.setAttribute("y2", "85.424%"), m.setAttribute("id", "lh-topbar__logo--d");
            const f = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            f.setAttribute("stop-color", "#FFF"), f.setAttribute("stop-opacity", ".1"), f.setAttribute("offset", "0%");
            const v = e.createElementNS("http://www.w3.org/2000/svg", "stop");
            v.setAttribute("stop-color", "#FFF"), v.setAttribute("stop-opacity", "0"), v.setAttribute("offset", "100%"), m.append(" ", f, " ", v, " "), i.append(" ", a, " ", c, " ", h, " ", m, " ");
            const b = e.createElementNS("http://www.w3.org/2000/svg", "g");
            b.setAttribute("fill", "none"), b.setAttribute("fill-rule", "evenodd");

            const _ = e.createElementNS("http://www.w3.org/2000/svg", "path");

            _.setAttribute("d", "M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z"), _.setAttribute("fill", "#F44B21");
            const w = e.createElementNS("http://www.w3.org/2000/svg", "path");
            w.setAttribute("fill", "#FFF"), w.setAttribute("d", "M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z");
            const y = e.createElementNS("http://www.w3.org/2000/svg", "path");
            y.setAttribute("d", "M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z"), y.setAttribute("fill", "url(#lh-topbar__logo--a)"), y.setAttribute("fill-rule", "nonzero"), y.setAttribute("transform", "translate(6 3)");
            const x = e.createElementNS("http://www.w3.org/2000/svg", "path");
            x.setAttribute("fill", "#FFF176"), x.setAttribute("fill-rule", "nonzero"), x.setAttribute("d", "M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z");
            const k = e.createElementNS("http://www.w3.org/2000/svg", "path");
            k.setAttribute("fill", "url(#lh-topbar__logo--b)"), k.setAttribute("fill-rule", "nonzero"), k.setAttribute("d", "M0 6.375h6v2.25H0z"), k.setAttribute("transform", "translate(6 3)");
            const E = e.createElementNS("http://www.w3.org/2000/svg", "path");
            E.setAttribute("fill", "url(#lh-topbar__logo--c)"), E.setAttribute("fill-rule", "nonzero"), E.setAttribute("d", "M6 6.375H1.875v-3.75L6 0z"), E.setAttribute("transform", "translate(6 3)");
            const A = e.createElementNS("http://www.w3.org/2000/svg", "path");
            A.setAttribute("fill", "url(#lh-topbar__logo--d)"), A.setAttribute("fill-rule", "nonzero"), A.setAttribute("d", "M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z"), A.setAttribute("transform", "translate(6 3)"), b.append(" ", _, " ", w, " ", y, " ", x, " ", k, " ", E, " ", A, " "), o.append(" ", i, " ", b, " ");
            const C = e.createElement("a", "lh-topbar__url");
            C.setAttribute("href", ""), C.setAttribute("target", "_blank"), C.setAttribute("rel", "noopener");
            const z = e.createElement("div", "lh-tools"),
                  S = e.createElement("div", "lh-tools-locale lh-hidden"),
                  L = e.createElement("button", "lh-button lh-tool-locale__button");
            L.setAttribute("id", "lh-button__swap-locales"), L.setAttribute("title", "Show Language Picker"), L.setAttribute("aria-label", "Toggle language picker"), L.setAttribute("aria-haspopup", "menu"), L.setAttribute("aria-expanded", "false"), L.setAttribute("aria-controls", "lh-tools-locale__selector-wrapper");
            const M = e.createElementNS("http://www.w3.org/2000/svg", "svg");
            M.setAttribute("width", "20px"), M.setAttribute("height", "20px"), M.setAttribute("viewBox", "0 0 24 24"), M.setAttribute("fill", "currentColor");
            const F = e.createElementNS("http://www.w3.org/2000/svg", "path");
            F.setAttribute("d", "M0 0h24v24H0V0z"), F.setAttribute("fill", "none");
            const N = e.createElementNS("http://www.w3.org/2000/svg", "path");
            N.setAttribute("d", "M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"), M.append(F, N), L.append(" ", M, " ");
            const T = e.createElement("div", "lh-tools-locale__selector-wrapper");
            T.setAttribute("id", "lh-tools-locale__selector-wrapper"), T.setAttribute("role", "menu"), T.setAttribute("aria-labelledby", "lh-button__swap-locales"), T.setAttribute("aria-hidden", "true"), T.append(" ", " "), S.append(" ", L, " ", T, " ");
            const D = e.createElement("button", "lh-tools__button");
            D.setAttribute("id", "lh-tools-button"), D.setAttribute("title", "Tools menu"), D.setAttribute("aria-label", "Toggle report tools menu"), D.setAttribute("aria-haspopup", "menu"), D.setAttribute("aria-expanded", "false"), D.setAttribute("aria-controls", "lh-tools-dropdown");
            const H = e.createElementNS("http://www.w3.org/2000/svg", "svg");
            H.setAttribute("width", "100%"), H.setAttribute("height", "100%"), H.setAttribute("viewBox", "0 0 24 24");
            const R = e.createElementNS("http://www.w3.org/2000/svg", "path");
            R.setAttribute("d", "M0 0h24v24H0z"), R.setAttribute("fill", "none");
            const P = e.createElementNS("http://www.w3.org/2000/svg", "path");
            P.setAttribute("d", "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"), H.append(" ", R, " ", P, " "), D.append(" ", H, " ");
            const U = e.createElement("div", "lh-tools__dropdown");
            U.setAttribute("id", "lh-tools-dropdown"), U.setAttribute("role", "menu"), U.setAttribute("aria-labelledby", "lh-tools-button");
            const B = e.createElement("a", "lh-report-icon lh-report-icon--print");
            B.setAttribute("role", "menuitem"), B.setAttribute("tabindex", "-1"), B.setAttribute("href", "#"), B.setAttribute("data-i18n", "dropdownPrintSummary"), B.setAttribute("data-action", "print-summary");
            const O = e.createElement("a", "lh-report-icon lh-report-icon--print");
            O.setAttribute("role", "menuitem"), O.setAttribute("tabindex", "-1"), O.setAttribute("href", "#"), O.setAttribute("data-i18n", "dropdownPrintExpanded"), O.setAttribute("data-action", "print-expanded");
            const I = e.createElement("a", "lh-report-icon lh-report-icon--copy");
            I.setAttribute("role", "menuitem"), I.setAttribute("tabindex", "-1"), I.setAttribute("href", "#"), I.setAttribute("data-i18n", "dropdownCopyJSON"), I.setAttribute("data-action", "copy");
            const V = e.createElement("a", "lh-report-icon lh-report-icon--download");
            V.setAttribute("role", "menuitem"), V.setAttribute("tabindex", "-1"), V.setAttribute("href", "#"), V.setAttribute("data-i18n", "dropdownSaveHTML"), V.setAttribute("data-action", "save-html");
            const $ = e.createElement("a", "lh-report-icon lh-report-icon--download");
            $.setAttribute("role", "menuitem"), $.setAttribute("tabindex", "-1"), $.setAttribute("href", "#"), $.setAttribute("data-i18n", "dropdownSaveJSON"), $.setAttribute("data-action", "save-json");
            const G = e.createElement("a", "lh-report-icon lh-report-icon--open");
            G.setAttribute("role", "menuitem"), G.setAttribute("tabindex", "-1"), G.setAttribute("href", "#"), G.setAttribute("data-i18n", "dropdownViewer"), G.setAttribute("data-action", "open-viewer");
            const j = e.createElement("a", "lh-report-icon lh-report-icon--open");
            j.setAttribute("role", "menuitem"), j.setAttribute("tabindex", "-1"), j.setAttribute("href", "#"), j.setAttribute("data-i18n", "dropdownSaveGist"), j.setAttribute("data-action", "save-gist");
            const q = e.createElement("a", "lh-report-icon lh-report-icon--dark");
            return q.setAttribute("role", "menuitem"), q.setAttribute("tabindex", "-1"), q.setAttribute("href", "#"), q.setAttribute("data-i18n", "dropdownDarkTheme"), q.setAttribute("data-action", "toggle-dark"), U.append(" ", B, " ", O, " ", I, " ", V, " ", $, " ", G, " ", j, " ", q, " "), z.append(" ", S, " ", D, " ", U, " "), r.append(" ", " ", o, " ", C, " ", z, " "), t.append(r), t;
          }(e);

        case "warningsToplevel":
          return function (e) {
            const t = e.createFragment(),
                  n = e.createElement("div", "lh-warnings lh-warnings--toplevel"),
                  r = e.createElement("p", "lh-warnings__msg"),
                  o = e.createElement("ul");
            return n.append(" ", r, " ", o, " "), t.append(n), t;
          }(e);
      }

      throw new Error("unexpected component: " + t);
    }(this, e), this._componentCache.set(e, t);
    return t.cloneNode(!0);
  }

  clearComponentCache() {
    this._componentCache.clear();
  }

  convertMarkdownLinkSnippets(e) {
    const t = this.createElement("span");

    for (const n of i.splitMarkdownLink(e)) {
      if (!n.isLink) {
        t.appendChild(this._document.createTextNode(n.text));
        continue;
      }

      const e = new URL(n.linkHref);
      ["https://developers.google.com", "https://web.dev"].includes(e.origin) && (e.searchParams.set("utm_source", "lighthouse"), e.searchParams.set("utm_medium", this._lighthouseChannel));
      const r = this.createElement("a");
      r.rel = "noopener", r.target = "_blank", r.textContent = n.text, this.safelySetHref(r, e.href), t.appendChild(r);
    }

    return t;
  }

  safelySetHref(e, t) {
    if ((t = t || "").startsWith("#")) return void (e.href = t);
    let n;

    try {
      n = new URL(t);
    } catch (e) {}

    n && ["https:", "http:"].includes(n.protocol) && (e.href = n.href);
  }

  safelySetBlobHref(e, t) {
    if ("text/html" !== t.type && "application/json" !== t.type) throw new Error("Unsupported blob type");
    const n = URL.createObjectURL(t);
    e.href = n;
  }

  convertMarkdownCodeSnippets(e) {
    const t = this.createElement("span");

    for (const n of i.splitMarkdownCodeSpans(e)) if (n.isCode) {
      const e = this.createElement("code");
      e.textContent = n.text, t.appendChild(e);
    } else t.appendChild(this._document.createTextNode(n.text));

    return t;
  }

  setLighthouseChannel(e) {
    this._lighthouseChannel = e;
  }

  document() {
    return this._document;
  }

  isDevTools() {
    return !!this._document.querySelector(".lh-devtools");
  }

  find(e, t) {
    const n = t.querySelector(e);
    if (null === n) throw new Error(`query ${e} not found`);
    return n;
  }

  findAll(e, t) {
    return Array.from(t.querySelectorAll(e));
  }

  fireEventOn(e, t = this._document, n) {
    const r = new CustomEvent(e, n ? {
      detail: n
    } : void 0);
    t.dispatchEvent(r);
  }

  saveFile(e, t) {
    const n = e.type.match("json") ? ".json" : ".html",
          r = this.createElement("a");
    r.download = `${t}${n}`, this.safelySetBlobHref(r, e), this._document.body.appendChild(r), r.click(), this._document.body.removeChild(r), setTimeout(() => URL.revokeObjectURL(r.href), 500);
  }

}

class l {
  constructor(e, t) {
    this.dom = e, this.detailsRenderer = t;
  }

  get _clumpTitles() {
    return {
      warning: i.i18n.strings.warningAuditsGroupTitle,
      manual: i.i18n.strings.manualAuditsGroupTitle,
      passed: i.i18n.strings.passedAuditsGroupTitle,
      notApplicable: i.i18n.strings.notApplicableAuditsGroupTitle
    };
  }

  renderAudit(e) {
    const t = this.dom.createComponent("audit");
    return this.populateAuditValues(e, t);
  }

  populateAuditValues(e, t) {
    const n = i.i18n.strings,
          r = this.dom.find(".lh-audit", t);
    r.id = e.result.id;
    const o = e.result.scoreDisplayMode;
    e.result.displayValue && (this.dom.find(".lh-audit__display-text", r).textContent = e.result.displayValue);
    const a = this.dom.find(".lh-audit__title", r);
    a.appendChild(this.dom.convertMarkdownCodeSnippets(e.result.title));
    const l = this.dom.find(".lh-audit__description", r);
    l.appendChild(this.dom.convertMarkdownLinkSnippets(e.result.description));

    for (const t of e.relevantMetrics || []) {
      const e = this.dom.createChildOf(l, "span", "lh-audit__adorn");
      e.title = "Relevant to " + t.result.title, e.textContent = t.acronym || t.id;
    }

    e.stackPacks && e.stackPacks.forEach(e => {
      const t = this.dom.createElement("div");
      t.classList.add("lh-audit__stackpack");
      const n = this.dom.createElement("img");
      n.classList.add("lh-audit__stackpack__img"), n.src = e.iconDataURL, n.alt = e.title, t.appendChild(n), t.appendChild(this.dom.convertMarkdownLinkSnippets(e.description)), this.dom.find(".lh-audit__stackpacks", r).appendChild(t);
    });
    const s = this.dom.find("details", r);

    if (e.result.details) {
      const t = this.detailsRenderer.render(e.result.details);
      t && (t.classList.add("lh-details"), s.appendChild(t));
    }

    if (this.dom.find(".lh-chevron-container", r).appendChild(this._createChevron()), this._setRatingClass(r, e.result.score, o), "error" === e.result.scoreDisplayMode) {
      r.classList.add("lh-audit--error");
      const t = this.dom.find(".lh-audit__display-text", r);
      t.textContent = n.errorLabel, t.classList.add("lh-tooltip-boundary");
      this.dom.createChildOf(t, "div", "lh-tooltip lh-tooltip--error").textContent = e.result.errorMessage || n.errorMissingAuditInfo;
    } else if (e.result.explanation) {
      this.dom.createChildOf(a, "div", "lh-audit-explanation").textContent = e.result.explanation;
    }

    const c = e.result.warnings;
    if (!c || 0 === c.length) return r;
    const d = this.dom.find("summary", s),
          p = this.dom.createChildOf(d, "div", "lh-warnings");
    if (this.dom.createChildOf(p, "span").textContent = n.warningHeader, 1 === c.length) p.appendChild(this.dom.createTextNode(c.join("")));else {
      const e = this.dom.createChildOf(p, "ul");

      for (const t of c) {
        this.dom.createChildOf(e, "li").textContent = t;
      }
    }
    return r;
  }

  injectFinalScreenshot(e, t, n) {
    const r = t["final-screenshot"];
    if (!r || "error" === r.scoreDisplayMode) return null;
    if (!r.details || "screenshot" !== r.details.type) return null;
    const o = this.dom.createElement("img", "lh-final-ss-image"),
          i = r.details.data;
    o.src = i, o.alt = r.title;
    const a = this.dom.find(".lh-category .lh-category-header", e),
          l = this.dom.createElement("div", "lh-category-headercol"),
          s = this.dom.createElement("div", "lh-category-headercol lh-category-headercol--separator"),
          c = this.dom.createElement("div", "lh-category-headercol");
    l.append(...a.childNodes), l.append(n), c.append(o), a.append(l, s, c), a.classList.add("lh-category-header__finalscreenshot");
  }

  _createChevron() {
    const e = this.dom.createComponent("chevron");
    return this.dom.find("svg.lh-chevron", e);
  }

  _setRatingClass(e, t, n) {
    const r = i.calculateRating(t, n);
    return e.classList.add("lh-audit--" + n.toLowerCase()), "informative" !== n && e.classList.add("lh-audit--" + r), e;
  }

  renderCategoryHeader(e, t, n) {
    const r = this.dom.createComponent("categoryHeader"),
          o = this.dom.find(".lh-score__gauge", r),
          i = this.renderCategoryScore(e, t, n);

    if (o.appendChild(i), e.description) {
      const t = this.dom.convertMarkdownLinkSnippets(e.description);
      this.dom.find(".lh-category-header__description", r).appendChild(t);
    }

    return r;
  }

  renderAuditGroup(e) {
    const t = this.dom.createElement("div", "lh-audit-group"),
          n = this.dom.createElement("div", "lh-audit-group__header");
    this.dom.createChildOf(n, "span", "lh-audit-group__title").textContent = e.title, t.appendChild(n);
    let r = null;
    return e.description && (r = this.dom.convertMarkdownLinkSnippets(e.description), r.classList.add("lh-audit-group__description", "lh-audit-group__footer"), t.appendChild(r)), [t, r];
  }

  _renderGroupedAudits(e, t) {
    const n = new Map(),
          r = "NotAGroup";
    n.set(r, []);

    for (const t of e) {
      const e = t.group || r,
            o = n.get(e) || [];
      o.push(t), n.set(e, o);
    }

    const o = [];

    for (const [e, i] of n) {
      if (e === r) {
        for (const e of i) o.push(this.renderAudit(e));

        continue;
      }

      const n = t[e],
            [a, l] = this.renderAuditGroup(n);

      for (const e of i) a.insertBefore(this.renderAudit(e), l);

      a.classList.add("lh-audit-group--" + e), o.push(a);
    }

    return o;
  }

  renderUnexpandableClump(e, t) {
    const n = this.dom.createElement("div");
    return this._renderGroupedAudits(e, t).forEach(e => n.appendChild(e)), n;
  }

  renderClump(e, {
    auditRefs: t,
    description: n
  }) {
    const r = this.dom.createComponent("clump"),
          o = this.dom.find(".lh-clump", r);
    "warning" === e && o.setAttribute("open", "");
    const a = this.dom.find(".lh-audit-group__header", o),
          l = this._clumpTitles[e];
    this.dom.find(".lh-audit-group__title", a).textContent = l;
    this.dom.find(".lh-audit-group__itemcount", o).textContent = `(${t.length})`;
    const s = t.map(this.renderAudit.bind(this));
    o.append(...s);
    const c = this.dom.find(".lh-audit-group", r);

    if (n) {
      const e = this.dom.convertMarkdownLinkSnippets(n);
      e.classList.add("lh-audit-group__description", "lh-audit-group__footer"), c.appendChild(e);
    }

    return this.dom.find(".lh-clump-toggletext--show", c).textContent = i.i18n.strings.show, this.dom.find(".lh-clump-toggletext--hide", c).textContent = i.i18n.strings.hide, o.classList.add("lh-clump--" + e.toLowerCase()), c;
  }

  renderCategoryScore(e, t, n) {
    return n && i.shouldDisplayAsFraction(n.gatherMode) ? this.renderCategoryFraction(e) : this.renderScoreGauge(e, t);
  }

  renderScoreGauge(e, t) {
    const n = this.dom.createComponent("gauge"),
          r = this.dom.find("a.lh-gauge__wrapper", n);
    i.isPluginCategory(e.id) && r.classList.add("lh-gauge__wrapper--plugin");
    const o = Number(e.score),
          a = this.dom.find(".lh-gauge", n),
          l = this.dom.find("circle.lh-gauge-arc", a);
    l && this._setGaugeArc(l, o);
    const s = Math.round(100 * o),
          c = this.dom.find("div.lh-gauge__percentage", n);
    return c.textContent = s.toString(), null === e.score && (c.textContent = "?", c.title = i.i18n.strings.errorLabel), 0 === e.auditRefs.length || this.hasApplicableAudits(e) ? r.classList.add("lh-gauge__wrapper--" + i.calculateRating(e.score)) : (r.classList.add("lh-gauge__wrapper--not-applicable"), c.textContent = "-", c.title = i.i18n.strings.notApplicableAuditsGroupTitle), this.dom.find(".lh-gauge__label", n).textContent = e.title, n;
  }

  renderCategoryFraction(e) {
    const t = this.dom.createComponent("fraction"),
          n = this.dom.find("a.lh-fraction__wrapper", t),
          {
      numPassed: r,
      numPassableAudits: o,
      totalWeight: a
    } = i.calculateCategoryFraction(e),
          l = r / o,
          s = this.dom.find(".lh-fraction__content", t),
          c = this.dom.createElement("span");
    c.textContent = `${r}/${o}`, s.appendChild(c);
    let d = i.calculateRating(l);
    return 0 === a && (d = "null"), n.classList.add("lh-fraction__wrapper--" + d), this.dom.find(".lh-fraction__label", t).textContent = e.title, t;
  }

  hasApplicableAudits(e) {
    return e.auditRefs.some(e => "notApplicable" !== e.result.scoreDisplayMode);
  }

  _setGaugeArc(e, t) {
    const n = 2 * Math.PI * Number(e.getAttribute("r")),
          r = Number(e.getAttribute("stroke-width")),
          o = .25 * r / n;
    e.style.transform = `rotate(${360 * o - 90}deg)`;
    let i = t * n - r / 2;
    0 === t && (e.style.opacity = "0"), 1 === t && (i = n), e.style.strokeDasharray = `${Math.max(i, 0)} ${n}`;
  }

  _auditHasWarning(e) {
    return Boolean(e.result.warnings && e.result.warnings.length);
  }

  _getClumpIdForAuditRef(e) {
    const t = e.result.scoreDisplayMode;
    return "manual" === t || "notApplicable" === t ? t : i.showAsPassed(e.result) ? this._auditHasWarning(e) ? "warning" : "passed" : "failed";
  }

  render(e, t = {}, n) {
    const r = this.dom.createElement("div", "lh-category");
    r.id = e.id, r.appendChild(this.renderCategoryHeader(e, t, n));
    const o = new Map();
    o.set("failed", []), o.set("warning", []), o.set("manual", []), o.set("passed", []), o.set("notApplicable", []);

    for (const t of e.auditRefs) {
      const e = this._getClumpIdForAuditRef(t),
            n = o.get(e);

      n.push(t), o.set(e, n);
    }

    for (const e of o.values()) e.sort((e, t) => t.weight - e.weight);

    for (const [n, i] of o) {
      if (0 === i.length) continue;

      if ("failed" === n) {
        const e = this.renderUnexpandableClump(i, t);
        e.classList.add("lh-clump--failed"), r.appendChild(e);
        continue;
      }

      const o = "manual" === n ? e.manualDescription : void 0,
            a = this.renderClump(n, {
        auditRefs: i,
        description: o
      });
      r.appendChild(a);
    }

    return r;
  }

}

class s {
  static initTree(e) {
    let t = 0;
    const n = Object.keys(e);

    if (n.length > 0) {
      t = e[n[0]].request.startTime;
    }

    return {
      tree: e,
      startTime: t,
      transferSize: 0
    };
  }

  static createSegment(e, t, n, r, o, i) {
    const a = e[t],
          l = Object.keys(e),
          s = l.indexOf(t) === l.length - 1,
          c = !!a.children && Object.keys(a.children).length > 0,
          d = Array.isArray(o) ? o.slice(0) : [];
    return void 0 !== i && d.push(!i), {
      node: a,
      isLastChild: s,
      hasChildren: c,
      startTime: n,
      transferSize: r + a.request.transferSize,
      treeMarkers: d
    };
  }

  static createChainNode(e, t, n) {
    const r = e.createComponent("crcChain");
    e.find(".lh-crc-node", r).setAttribute("title", t.node.request.url);
    const o = e.find(".lh-crc-node__tree-marker", r);
    t.treeMarkers.forEach(t => {
      t ? (o.appendChild(e.createElement("span", "lh-tree-marker lh-vert")), o.appendChild(e.createElement("span", "lh-tree-marker"))) : (o.appendChild(e.createElement("span", "lh-tree-marker")), o.appendChild(e.createElement("span", "lh-tree-marker")));
    }), t.isLastChild ? (o.appendChild(e.createElement("span", "lh-tree-marker lh-up-right")), o.appendChild(e.createElement("span", "lh-tree-marker lh-right"))) : (o.appendChild(e.createElement("span", "lh-tree-marker lh-vert-right")), o.appendChild(e.createElement("span", "lh-tree-marker lh-right"))), t.hasChildren ? o.appendChild(e.createElement("span", "lh-tree-marker lh-horiz-down")) : o.appendChild(e.createElement("span", "lh-tree-marker lh-right"));
    const a = t.node.request.url,
          l = n.renderTextURL(a),
          s = e.find(".lh-crc-node__tree-value", r);

    if (s.appendChild(l), !t.hasChildren) {
      const {
        startTime: n,
        endTime: r,
        transferSize: o
      } = t.node.request,
            a = e.createElement("span", "lh-crc-node__chain-duration");
      a.textContent = " - " + i.i18n.formatMilliseconds(1e3 * (r - n)) + ", ";
      const l = e.createElement("span", "lh-crc-node__chain-duration");
      l.textContent = i.i18n.formatBytesToKiB(o, .01), s.appendChild(a), s.appendChild(l);
    }

    return r;
  }

  static buildTree(e, t, n, r, o, i) {
    if (r.appendChild(c.createChainNode(e, n, i)), n.node.children) for (const a of Object.keys(n.node.children)) {
      const l = c.createSegment(n.node.children, a, n.startTime, n.transferSize, n.treeMarkers, n.isLastChild);
      c.buildTree(e, t, l, r, o, i);
    }
  }

  static render(e, t, n) {
    const r = e.createComponent("crc"),
          o = e.find(".lh-crc", r);
    e.find(".lh-crc-initial-nav", r).textContent = i.i18n.strings.crcInitialNavigation, e.find(".lh-crc__longest_duration_label", r).textContent = i.i18n.strings.crcLongestDurationLabel, e.find(".lh-crc__longest_duration", r).textContent = i.i18n.formatMilliseconds(t.longestChain.duration);
    const a = c.initTree(t.chains);

    for (const i of Object.keys(a.tree)) {
      const l = c.createSegment(a.tree, i, a.startTime, a.transferSize);
      c.buildTree(e, r, l, o, t, n);
    }

    return e.find(".lh-crc-container", r);
  }

}

const c = s,
      d = 0,
      p = 1,
      h = 2,
      u = 0,
      g = 1,
      m = 2,
      f = 3,
      v = {
  [u]: ["lh-snippet__line--content"],
  [g]: ["lh-snippet__line--content", "lh-snippet__line--content-highlighted"],
  [m]: ["lh-snippet__line--placeholder"],
  [f]: ["lh-snippet__line--message"]
};

function b(e, t) {
  return {
    line: e.find(e => e.lineNumber === t),
    previousLine: e.find(e => e.lineNumber === t - 1)
  };
}

function _(e, t) {
  return e.filter(e => e.lineNumber === t);
}

function w(e) {
  return i.filterRelevantLines(e.lines, e.lineMessages, 2);
}

class y {
  static renderHeader(e, t, n, r) {
    const o = w(t).length < t.lines.length,
          a = e.createComponent("snippetHeader");
    e.find(".lh-snippet__title", a).textContent = t.title;
    const {
      snippetCollapseButtonLabel: l,
      snippetExpandButtonLabel: s
    } = i.i18n.strings;
    e.find(".lh-snippet__btn-label-collapse", a).textContent = l, e.find(".lh-snippet__btn-label-expand", a).textContent = s;
    const c = e.find(".lh-snippet__toggle-expand", a);

    if (o ? c.addEventListener("click", () => r()) : c.remove(), t.node && e.isDevTools()) {
      e.find(".lh-snippet__node", a).appendChild(n.renderNode(t.node));
    }

    return a;
  }

  static renderSnippetLine(e, t, {
    content: n,
    lineNumber: r,
    truncated: o,
    contentType: i,
    visibility: a
  }) {
    const l = e.createComponent("snippetLine"),
          s = e.find(".lh-snippet__line", l),
          {
      classList: c
    } = s;
    v[i].forEach(e => c.add(e)), a === p ? c.add("lh-snippet__show-if-collapsed") : a === h && c.add("lh-snippet__show-if-expanded");
    const d = n + (o ? "…" : ""),
          u = e.find(".lh-snippet__line code", s);
    return i === f ? u.appendChild(e.convertMarkdownLinkSnippets(d)) : u.textContent = d, e.find(".lh-snippet__line-number", s).textContent = r.toString(), s;
  }

  static renderMessage(e, t, n) {
    return y.renderSnippetLine(e, t, {
      lineNumber: " ",
      content: n.message,
      contentType: f
    });
  }

  static renderOmittedLinesPlaceholder(e, t, n) {
    return y.renderSnippetLine(e, t, {
      lineNumber: "…",
      content: "",
      visibility: n,
      contentType: m
    });
  }

  static renderSnippetContent(e, t, n) {
    const r = e.createComponent("snippetContent"),
          o = e.find(".lh-snippet__snippet-inner", r);
    return n.generalMessages.forEach(n => o.append(y.renderMessage(e, t, n))), o.append(y.renderSnippetLines(e, t, n)), r;
  }

  static renderSnippetLines(e, t, n) {
    const {
      lineMessages: r,
      generalMessages: o,
      lineCount: i,
      lines: a
    } = n,
          l = w(n),
          s = o.length > 0 && 0 === r.length,
          c = e.createFragment();
    let m = !1;

    for (let n = 1; n <= i; n++) {
      const {
        line: o,
        previousLine: i
      } = b(a, n),
            {
        line: f,
        previousLine: v
      } = b(l, n),
            w = !!f;
      !!v && !w && (m = !0), w && m && (c.append(y.renderOmittedLinesPlaceholder(e, t, p)), m = !1);
      const x = !o && 1 === n;

      if (!o && !!i || x) {
        const r = !l.some(e => e.lineNumber > n) || 1 === n;
        c.append(y.renderOmittedLinesPlaceholder(e, t, r ? h : d)), m = !1;
      }

      if (!o) continue;

      const k = _(r, n),
            E = k.length > 0 || s,
            A = Object.assign({}, o, {
        contentType: E ? g : u,
        visibility: f ? d : h
      });

      c.append(y.renderSnippetLine(e, t, A)), k.forEach(n => {
        c.append(y.renderMessage(e, t, n));
      });
    }

    return c;
  }

  static render(e, t, n) {
    const r = e.createComponent("snippet"),
          o = e.find(".lh-snippet", r),
          i = y.renderHeader(e, t, n, () => o.classList.toggle("lh-snippet--expanded")),
          a = y.renderSnippetContent(e, r, t);
    return o.append(i, a), o;
  }

}

function x(e, t, n) {
  return e < t ? t : e > n ? n : e;
}

class k {
  static getScreenshotPositions(e, t, n) {
    const r = {
      x: (o = e).left + o.width / 2,
      y: o.top + o.height / 2
    };
    var o;
    const i = x(r.x - t.width / 2, 0, n.width - t.width),
          a = x(r.y - t.height / 2, 0, n.height - t.height);
    return {
      screenshot: {
        left: i,
        top: a
      },
      clip: {
        left: e.left - i,
        top: e.top - a
      }
    };
  }

  static renderClipPathInScreenshot(e, t, n, r, o) {
    const a = e.find("clipPath", t),
          l = "clip-" + i.getUniqueSuffix();
    a.id = l, t.style.clipPath = `url(#${l})`;
    const s = n.top / o.height,
          c = s + r.height / o.height,
          d = n.left / o.width,
          p = d + r.width / o.width,
          h = [`0,0             1,0            1,${s}          0,${s}`, `0,${c}     1,${c}    1,1               0,1`, `0,${s}        ${d},${s} ${d},${c} 0,${c}`, `${p},${s} 1,${s}       1,${c}       ${p},${c}`];

    for (const t of h) {
      const n = e.createElementNS("http://www.w3.org/2000/svg", "polygon");
      n.setAttribute("points", t), a.append(n);
    }
  }

  static installFullPageScreenshot(e, t) {
    e.style.setProperty("--element-screenshot-url", `url('${t.data}')`);
  }

  static installOverlayFeature(e) {
    const {
      dom: t,
      rootEl: n,
      overlayContainerEl: r,
      fullPageScreenshot: o
    } = e,
          i = "lh-screenshot-overlay--enabled";
    n.classList.contains(i) || (n.classList.add(i), n.addEventListener("click", e => {
      const n = e.target;
      if (!n) return;
      const i = n.closest(".lh-node > .lh-element-screenshot");
      if (!i) return;
      const a = t.createElement("div", "lh-element-screenshot__overlay");
      r.append(a);
      const l = {
        width: .95 * a.clientWidth,
        height: .8 * a.clientHeight
      },
            s = {
        width: Number(i.dataset.rectWidth),
        height: Number(i.dataset.rectHeight),
        left: Number(i.dataset.rectLeft),
        right: Number(i.dataset.rectLeft) + Number(i.dataset.rectWidth),
        top: Number(i.dataset.rectTop),
        bottom: Number(i.dataset.rectTop) + Number(i.dataset.rectHeight)
      },
            c = k.render(t, o.screenshot, s, l);
      c ? (a.appendChild(c), a.addEventListener("click", () => a.remove())) : a.remove();
    }));
  }

  static _computeZoomFactor(e, t) {
    const n = {
      x: t.width / e.width,
      y: t.height / e.height
    },
          r = .75 * Math.min(n.x, n.y);
    return Math.min(1, r);
  }

  static render(e, t, n, r) {
    if (!function (e, t) {
      return t.left <= e.width && 0 <= t.right && t.top <= e.height && 0 <= t.bottom;
    }(t, n)) return null;
    const o = e.createComponent("elementScreenshot"),
          i = e.find("div.lh-element-screenshot", o);
    i.dataset.rectWidth = n.width.toString(), i.dataset.rectHeight = n.height.toString(), i.dataset.rectLeft = n.left.toString(), i.dataset.rectTop = n.top.toString();

    const a = this._computeZoomFactor(n, r),
          l = {
      width: r.width / a,
      height: r.height / a
    };

    l.width = Math.min(t.width, l.width);
    const s = l.width * a,
          c = l.height * a,
          d = k.getScreenshotPositions(n, l, {
      width: t.width,
      height: t.height
    });
    e.find("div.lh-element-screenshot__content", i).style.top = `-${c}px`;
    const p = e.find("div.lh-element-screenshot__image", i);
    p.style.width = s + "px", p.style.height = c + "px", p.style.backgroundPositionY = -d.screenshot.top * a + "px", p.style.backgroundPositionX = -d.screenshot.left * a + "px", p.style.backgroundSize = `${t.width * a}px ${t.height * a}px`;
    const h = e.find("div.lh-element-screenshot__element-marker", i);
    h.style.width = n.width * a + "px", h.style.height = n.height * a + "px", h.style.left = d.clip.left * a + "px", h.style.top = d.clip.top * a + "px";
    const u = e.find("div.lh-element-screenshot__mask", i);
    return u.style.width = s + "px", u.style.height = c + "px", k.renderClipPathInScreenshot(e, u, d.clip, n, l), i;
  }

}

const E = ["http://", "https://", "data:"];

class A {
  constructor(e, t = {}) {
    this._dom = e, this._fullPageScreenshot = t.fullPageScreenshot;
  }

  render(e) {
    switch (e.type) {
      case "filmstrip":
        return this._renderFilmstrip(e);

      case "list":
        return this._renderList(e);

      case "table":
        return this._renderTable(e);

      case "criticalrequestchain":
        return s.render(this._dom, e, this);

      case "opportunity":
        return this._renderTable(e);

      case "screenshot":
      case "debugdata":
      case "full-page-screenshot":
      case "treemap-data":
        return null;

      default:
        return this._renderUnknown(e.type, e);
    }
  }

  _renderBytes(e) {
    const t = i.i18n.formatBytesToKiB(e.value, e.granularity),
          n = this._renderText(t);

    return n.title = i.i18n.formatBytes(e.value), n;
  }

  _renderMilliseconds(e) {
    let t = i.i18n.formatMilliseconds(e.value, e.granularity);
    return "duration" === e.displayUnit && (t = i.i18n.formatDuration(e.value)), this._renderText(t);
  }

  renderTextURL(e) {
    const t = e;
    let n, r, o;

    try {
      const e = i.parseURL(t);
      n = "/" === e.file ? e.origin : e.file, r = "/" === e.file || "" === e.hostname ? "" : `(${e.hostname})`, o = t;
    } catch (e) {
      n = t;
    }

    const a = this._dom.createElement("div", "lh-text__url");

    if (a.appendChild(this._renderLink({
      text: n,
      url: t
    })), r) {
      const e = this._renderText(r);

      e.classList.add("lh-text__url-host"), a.appendChild(e);
    }

    return o && (a.title = t, a.dataset.url = t), a;
  }

  _renderLink(e) {
    const t = this._dom.createElement("a");

    if (this._dom.safelySetHref(t, e.url), !t.href) {
      const t = this._renderText(e.text);

      return t.classList.add("lh-link"), t;
    }

    return t.rel = "noopener", t.target = "_blank", t.textContent = e.text, t.classList.add("lh-link"), t;
  }

  _renderText(e) {
    const t = this._dom.createElement("div", "lh-text");

    return t.textContent = e, t;
  }

  _renderNumeric(e) {
    const t = i.i18n.formatNumber(e.value, e.granularity),
          n = this._dom.createElement("div", "lh-numeric");

    return n.textContent = t, n;
  }

  _renderThumbnail(e) {
    const t = this._dom.createElement("img", "lh-thumbnail"),
          n = e;

    return t.src = n, t.title = n, t.alt = "", t;
  }

  _renderUnknown(e, t) {
    console.error("Unknown details type: " + e, t);

    const n = this._dom.createElement("details", "lh-unknown");

    return this._dom.createChildOf(n, "summary").textContent = `We don't know how to render audit details of type \`${e}\`. The Lighthouse version that collected this data is likely newer than the Lighthouse version of the report renderer. Expand for the raw JSON.`, this._dom.createChildOf(n, "pre").textContent = JSON.stringify(t, null, 2), n;
  }

  _renderTableValue(e, t) {
    if (null == e) return null;
    if ("object" == typeof e) switch (e.type) {
      case "code":
        return this._renderCode(e.value);

      case "link":
        return this._renderLink(e);

      case "node":
        return this.renderNode(e);

      case "numeric":
        return this._renderNumeric(e);

      case "source-location":
        return this.renderSourceLocation(e);

      case "url":
        return this.renderTextURL(e.value);

      default:
        return this._renderUnknown(e.type, e);
    }

    switch (t.valueType) {
      case "bytes":
        {
          const n = Number(e);
          return this._renderBytes({
            value: n,
            granularity: t.granularity
          });
        }

      case "code":
        {
          const t = String(e);
          return this._renderCode(t);
        }

      case "ms":
        {
          const n = {
            value: Number(e),
            granularity: t.granularity,
            displayUnit: t.displayUnit
          };
          return this._renderMilliseconds(n);
        }

      case "numeric":
        {
          const n = Number(e);
          return this._renderNumeric({
            value: n,
            granularity: t.granularity
          });
        }

      case "text":
        {
          const t = String(e);
          return this._renderText(t);
        }

      case "thumbnail":
        {
          const t = String(e);
          return this._renderThumbnail(t);
        }

      case "timespanMs":
        {
          const t = Number(e);
          return this._renderMilliseconds({
            value: t
          });
        }

      case "url":
        {
          const t = String(e);
          return E.some(e => t.startsWith(e)) ? this.renderTextURL(t) : this._renderCode(t);
        }

      default:
        return this._renderUnknown(t.valueType, e);
    }
  }

  _getCanonicalizedHeadingsFromTable(e) {
    return "opportunity" === e.type ? e.headings : e.headings.map(e => this._getCanonicalizedHeading(e));
  }

  _getCanonicalizedHeading(e) {
    let t;
    return e.subItemsHeading && (t = this._getCanonicalizedsubItemsHeading(e.subItemsHeading, e)), {
      key: e.key,
      valueType: e.itemType,
      subItemsHeading: t,
      label: e.text,
      displayUnit: e.displayUnit,
      granularity: e.granularity
    };
  }

  _getCanonicalizedsubItemsHeading(e, t) {
    return e.key || console.warn("key should not be null"), {
      key: e.key || "",
      valueType: e.itemType || t.itemType,
      granularity: e.granularity || t.granularity,
      displayUnit: e.displayUnit || t.displayUnit
    };
  }

  _getDerivedsubItemsHeading(e) {
    return e.subItemsHeading ? {
      key: e.subItemsHeading.key || "",
      valueType: e.subItemsHeading.valueType || e.valueType,
      granularity: e.subItemsHeading.granularity || e.granularity,
      displayUnit: e.subItemsHeading.displayUnit || e.displayUnit,
      label: ""
    } : null;
  }

  _renderTableRow(e, t) {
    const n = this._dom.createElement("tr");

    for (const r of t) {
      if (!r || !r.key) {
        this._dom.createChildOf(n, "td", "lh-table-column--empty");

        continue;
      }

      const t = e[r.key];
      let o;

      if (null != t && (o = this._renderTableValue(t, r)), o) {
        const e = "lh-table-column--" + r.valueType;

        this._dom.createChildOf(n, "td", e).appendChild(o);
      } else this._dom.createChildOf(n, "td", "lh-table-column--empty");
    }

    return n;
  }

  _renderTableRowsFromItem(e, t) {
    const n = this._dom.createFragment();

    if (n.append(this._renderTableRow(e, t)), !e.subItems) return n;
    const r = t.map(this._getDerivedsubItemsHeading);
    if (!r.some(Boolean)) return n;

    for (const t of e.subItems.items) {
      const e = this._renderTableRow(t, r);

      e.classList.add("lh-sub-item-row"), n.append(e);
    }

    return n;
  }

  _renderTable(e) {
    if (!e.items.length) return this._dom.createElement("span");

    const t = this._dom.createElement("table", "lh-table"),
          n = this._dom.createChildOf(t, "thead"),
          r = this._dom.createChildOf(n, "tr"),
          o = this._getCanonicalizedHeadingsFromTable(e);

    for (const e of o) {
      const t = "lh-table-column--" + (e.valueType || "text"),
            n = this._dom.createElement("div", "lh-text");

      n.textContent = e.label, this._dom.createChildOf(r, "th", t).appendChild(n);
    }

    const i = this._dom.createChildOf(t, "tbody");

    let a = !0;

    for (const t of e.items) {
      const e = this._renderTableRowsFromItem(t, o);

      for (const t of this._dom.findAll("tr", e)) t.classList.add(a ? "lh-row--even" : "lh-row--odd");

      a = !a, i.append(e);
    }

    return t;
  }

  _renderList(e) {
    const t = this._dom.createElement("div", "lh-list");

    return e.items.forEach(e => {
      const n = y.render(this._dom, e, this);
      t.appendChild(n);
    }), t;
  }

  renderNode(e) {
    const t = this._dom.createElement("span", "lh-node");

    if (e.nodeLabel) {
      const n = this._dom.createElement("div");

      n.textContent = e.nodeLabel, t.appendChild(n);
    }

    if (e.snippet) {
      const n = this._dom.createElement("div");

      n.classList.add("lh-node__snippet"), n.textContent = e.snippet, t.appendChild(n);
    }

    if (e.selector && (t.title = e.selector), e.path && t.setAttribute("data-path", e.path), e.selector && t.setAttribute("data-selector", e.selector), e.snippet && t.setAttribute("data-snippet", e.snippet), !this._fullPageScreenshot) return t;
    const n = e.lhId && this._fullPageScreenshot.nodes[e.lhId];
    if (!n || 0 === n.width || 0 === n.height) return t;
    const r = k.render(this._dom, this._fullPageScreenshot.screenshot, n, {
      width: 147,
      height: 100
    });
    return r && t.prepend(r), t;
  }

  renderSourceLocation(e) {
    if (!e.url) return null;
    const t = `${e.url}:${e.line + 1}:${e.column}`;
    let n, r;

    if (e.original) {
      n = `${e.original.file || "<unmapped>"}:${e.original.line + 1}:${e.original.column}`;
    }

    if ("network" === e.urlProvider && n) r = this._renderLink({
      url: e.url,
      text: n
    }), r.title = "maps to generated location " + t;else if ("network" !== e.urlProvider || n) {
      if ("comment" === e.urlProvider && n) r = this._renderText(n + " (from source map)"), r.title = t + " (from sourceURL)";else {
        if ("comment" !== e.urlProvider || n) return null;
        r = this._renderText(t + " (from sourceURL)");
      }
    } else r = this.renderTextURL(e.url), this._dom.find(".lh-link", r).textContent += `:${e.line + 1}:${e.column}`;
    return r.classList.add("lh-source-location"), r.setAttribute("data-source-url", e.url), r.setAttribute("data-source-line", String(e.line)), r.setAttribute("data-source-column", String(e.column)), r;
  }

  _renderFilmstrip(e) {
    const t = this._dom.createElement("div", "lh-filmstrip");

    for (const n of e.items) {
      const e = this._dom.createChildOf(t, "div", "lh-filmstrip__frame"),
            r = this._dom.createChildOf(e, "img", "lh-filmstrip__thumbnail");

      r.src = n.data, r.alt = "Screenshot";
    }

    return t;
  }

  _renderCode(e) {
    const t = this._dom.createElement("pre", "lh-code");

    return t.textContent = e, t;
  }

}

class C {
  constructor(e, t) {
    "en-XA" === e && (e = "de"), this._numberDateLocale = e, this._numberFormatter = new Intl.NumberFormat(e), this._percentFormatter = new Intl.NumberFormat(e, {
      style: "percent"
    }), this._strings = t;
  }

  get strings() {
    return this._strings;
  }

  formatNumber(e, t = .1) {
    const n = Math.round(e / t) * t;
    return this._numberFormatter.format(n);
  }

  formatPercent(e) {
    return this._percentFormatter.format(e);
  }

  formatBytesToKiB(e, t = .1) {
    return this._byteFormatterForGranularity(t).format(Math.round(e / 1024 / t) * t) + " KiB";
  }

  formatBytesToMiB(e, t = .1) {
    return this._byteFormatterForGranularity(t).format(Math.round(e / 1048576 / t) * t) + " MiB";
  }

  formatBytes(e, t = 1) {
    return this._byteFormatterForGranularity(t).format(Math.round(e / t) * t) + " bytes";
  }

  formatBytesWithBestUnit(e, t = .1) {
    return e >= 1048576 ? this.formatBytesToMiB(e, t) : e >= 1024 ? this.formatBytesToKiB(e, t) : this.formatNumber(e, t) + " B";
  }

  _byteFormatterForGranularity(e) {
    let t = 0;
    return e < 1 && (t = -Math.floor(Math.log10(e))), new Intl.NumberFormat(this._numberDateLocale, { ...this._numberFormatter.resolvedOptions(),
      maximumFractionDigits: t,
      minimumFractionDigits: t
    });
  }

  formatMilliseconds(e, t = 10) {
    const n = Math.round(e / t) * t;
    return 0 === n ? this._numberFormatter.format(0) + " ms" : this._numberFormatter.format(n) + " ms";
  }

  formatSeconds(e, t = .1) {
    const n = Math.round(e / 1e3 / t) * t;
    return this._numberFormatter.format(n) + " s";
  }

  formatDateTime(e) {
    const t = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short"
    };
    let n;

    try {
      n = new Intl.DateTimeFormat(this._numberDateLocale, t);
    } catch (e) {
      t.timeZone = "UTC", n = new Intl.DateTimeFormat(this._numberDateLocale, t);
    }

    return n.format(new Date(e));
  }

  formatDuration(e) {
    let t = e / 1e3;
    if (0 === Math.round(t)) return "None";
    const n = [],
          r = {
      d: 86400,
      h: 3600,
      m: 60,
      s: 1
    };
    return Object.keys(r).forEach(e => {
      const o = r[e],
            i = Math.floor(t / o);
      i > 0 && (t -= i * o, n.push(`${i} ${e}`));
    }), n.join(" ");
  }

}

class z extends l {
  _renderMetric(e) {
    const t = this.dom.createComponent("metric"),
          n = this.dom.find(".lh-metric", t);
    n.id = e.result.id;
    const r = i.calculateRating(e.result.score, e.result.scoreDisplayMode);
    n.classList.add("lh-metric--" + r);
    this.dom.find(".lh-metric__title", t).textContent = e.result.title;
    const o = this.dom.find(".lh-metric__value", t);
    o.textContent = e.result.displayValue || "";
    const a = this.dom.find(".lh-metric__description", t);

    if (a.appendChild(this.dom.convertMarkdownLinkSnippets(e.result.description)), "error" === e.result.scoreDisplayMode) {
      a.textContent = "", o.textContent = "Error!";
      this.dom.createChildOf(a, "span").textContent = e.result.errorMessage || "Report error: no metric information";
    }

    return n;
  }

  _renderOpportunity(e, t) {
    const n = this.dom.createComponent("opportunity"),
          r = this.populateAuditValues(e, n);
    if (r.id = e.result.id, !e.result.details || "error" === e.result.scoreDisplayMode) return r;
    const o = e.result.details;
    if ("opportunity" !== o.type) return r;
    const a = this.dom.find("span.lh-audit__display-text, div.lh-audit__display-text", r),
          l = o.overallSavingsMs / t * 100 + "%";

    if (this.dom.find("div.lh-sparkline__bar", r).style.width = l, a.textContent = i.i18n.formatSeconds(o.overallSavingsMs, .01), e.result.displayValue) {
      const t = e.result.displayValue;
      this.dom.find("div.lh-load-opportunity__sparkline", r).title = t, a.title = t;
    }

    return r;
  }

  _getWastedMs(e) {
    if (e.result.details && "opportunity" === e.result.details.type) {
      const t = e.result.details;
      if ("number" != typeof t.overallSavingsMs) throw new Error("non-opportunity details passed to _getWastedMs");
      return t.overallSavingsMs;
    }

    return Number.MIN_VALUE;
  }

  _getScoringCalculatorHref(e) {
    const t = e.filter(e => "metrics" === e.group),
          n = e.find(e => "first-cpu-idle" === e.id),
          r = e.find(e => "first-meaningful-paint" === e.id);
    n && t.push(n), r && t.push(r);
    const o = [...t.map(e => {
      let t;
      var n;
      return "number" == typeof e.result.numericValue ? (t = "cumulative-layout-shift" === e.id ? (n = e.result.numericValue, Math.round(100 * n) / 100) : Math.round(e.result.numericValue), t = t.toString()) : t = "null", [e.acronym || e.id, t];
    })];
    i.reportJson && (o.push(["device", i.reportJson.configSettings.formFactor]), o.push(["version", i.reportJson.lighthouseVersion]));
    const a = new URLSearchParams(o),
          l = new URL("https://googlechrome.github.io/lighthouse/scorecalc/");
    return l.hash = a.toString(), l.href;
  }

  _classifyPerformanceAudit(e) {
    return e.group ? null : e.result.details && "opportunity" === e.result.details.type ? "load-opportunity" : "diagnostic";
  }

  render(e, t, n) {
    const r = i.i18n.strings,
          o = this.dom.createElement("div", "lh-category");
    o.id = e.id, o.appendChild(this.renderCategoryHeader(e, t, n));
    const a = e.auditRefs.filter(e => "metrics" === e.group);

    if (a.length) {
      const [n, l] = this.renderAuditGroup(t.metrics),
            s = this.dom.createElement("input", "lh-metrics-toggle__input"),
            c = "lh-metrics-toggle" + i.getUniqueSuffix();
      s.setAttribute("aria-label", "Toggle the display of metric descriptions"), s.type = "checkbox", s.id = c, n.prepend(s);
      const d = this.dom.find(".lh-audit-group__header", n),
            p = this.dom.createChildOf(d, "label", "lh-metrics-toggle__label");
      p.htmlFor = c;
      const h = this.dom.createChildOf(p, "span", "lh-metrics-toggle__labeltext--show"),
            u = this.dom.createChildOf(p, "span", "lh-metrics-toggle__labeltext--hide");
      h.textContent = i.i18n.strings.expandView, u.textContent = i.i18n.strings.collapseView;
      const g = this.dom.createElement("div", "lh-metrics-container");
      n.insertBefore(g, l), a.forEach(e => {
        g.appendChild(this._renderMetric(e));
      });
      const m = this.dom.find(".lh-category-header__description", o),
            f = this.dom.createChildOf(m, "div", "lh-metrics__disclaimer"),
            v = this.dom.convertMarkdownLinkSnippets(r.varianceDisclaimer);
      f.appendChild(v);
      const b = this.dom.createChildOf(f, "a", "lh-calclink");
      b.target = "_blank", b.textContent = r.calculatorLink, this.dom.safelySetHref(b, this._getScoringCalculatorHref(e.auditRefs)), n.classList.add("lh-audit-group--metrics"), o.appendChild(n);
    }

    const l = this.dom.createChildOf(o, "div", "lh-filmstrip-container"),
          s = e.auditRefs.find(e => "screenshot-thumbnails" === e.id),
          c = s && s.result;

    if (c && c.details) {
      l.id = c.id;
      const e = this.detailsRenderer.render(c.details);
      e && l.appendChild(e);
    }

    const d = e.auditRefs.filter(e => "load-opportunity" === this._classifyPerformanceAudit(e)).filter(e => !i.showAsPassed(e.result)).sort((e, t) => this._getWastedMs(t) - this._getWastedMs(e)),
          p = a.filter(e => !!e.relevantAudits);

    if (p.length && this.renderMetricAuditFilter(p, o), d.length) {
      const e = 2e3,
            n = d.map(e => this._getWastedMs(e)),
            i = Math.max(...n),
            a = Math.max(1e3 * Math.ceil(i / 1e3), e),
            [l, s] = this.renderAuditGroup(t["load-opportunities"]),
            c = this.dom.createComponent("opportunityHeader");
      this.dom.find(".lh-load-opportunity__col--one", c).textContent = r.opportunityResourceColumnLabel, this.dom.find(".lh-load-opportunity__col--two", c).textContent = r.opportunitySavingsColumnLabel;
      const p = this.dom.find(".lh-load-opportunity__header", c);
      l.insertBefore(p, s), d.forEach(e => l.insertBefore(this._renderOpportunity(e, a), s)), l.classList.add("lh-audit-group--load-opportunities"), o.appendChild(l);
    }

    const h = e.auditRefs.filter(e => "diagnostic" === this._classifyPerformanceAudit(e)).filter(e => !i.showAsPassed(e.result)).sort((e, t) => ("informative" === e.result.scoreDisplayMode ? 100 : Number(e.result.score)) - ("informative" === t.result.scoreDisplayMode ? 100 : Number(t.result.score)));

    if (h.length) {
      const [e, n] = this.renderAuditGroup(t.diagnostics);
      h.forEach(t => e.insertBefore(this.renderAudit(t), n)), e.classList.add("lh-audit-group--diagnostics"), o.appendChild(e);
    }

    const u = e.auditRefs.filter(e => this._classifyPerformanceAudit(e) && i.showAsPassed(e.result));
    if (!u.length) return o;
    const g = {
      auditRefs: u,
      groupDefinitions: t
    },
          m = this.renderClump("passed", g);
    o.appendChild(m);
    const f = [];

    if (["performance-budget", "timing-budget"].forEach(t => {
      const n = e.auditRefs.find(e => e.id === t);

      if (n && n.result.details) {
        const e = this.detailsRenderer.render(n.result.details);
        e && (e.id = t, e.classList.add("lh-details", "lh-details--budget", "lh-audit"), f.push(e));
      }
    }), f.length > 0) {
      const [e, n] = this.renderAuditGroup(t.budgets);
      f.forEach(t => e.insertBefore(t, n)), e.classList.add("lh-audit-group--budgets"), o.appendChild(e);
    }

    return o;
  }

  renderMetricAuditFilter(e, t) {
    const n = this.dom.createElement("div", "lh-metricfilter");
    this.dom.createChildOf(n, "span", "lh-metricfilter__text").textContent = i.i18n.strings.showRelevantAudits;
    const r = [{
      acronym: "All"
    }, ...e],
          o = i.getUniqueSuffix();

    for (const e of r) {
      const r = `metric-${e.acronym}-${o}`,
            i = this.dom.createChildOf(n, "input", "lh-metricfilter__radio");
      i.type = "radio", i.name = "metricsfilter-" + o, i.id = r;
      const a = this.dom.createChildOf(n, "label", "lh-metricfilter__label");
      a.htmlFor = r, a.title = e.result && e.result.title, a.textContent = e.acronym || e.id, "All" === e.acronym && (i.checked = !0, a.classList.add("lh-metricfilter__label--active")), t.append(n), i.addEventListener("input", n => {
        for (const e of t.querySelectorAll("label.lh-metricfilter__label")) e.classList.toggle("lh-metricfilter__label--active", e.htmlFor === r);

        t.classList.toggle("lh-category--filtered", "All" !== e.acronym);

        for (const n of t.querySelectorAll("div.lh-audit")) "All" !== e.acronym ? (n.hidden = !0, e.relevantAudits && e.relevantAudits.includes(n.id) && (n.hidden = !1)) : n.hidden = !1;

        const o = t.querySelectorAll("div.lh-audit-group, details.lh-audit-group");

        for (const e of o) {
          e.hidden = !1;
          const t = Array.from(e.querySelectorAll("div.lh-audit")),
                n = !!t.length && t.every(e => e.hidden);
          e.hidden = n;
        }
      });
    }
  }

}

class S extends l {
  render(e, t = {}) {
    const n = this.dom.createElement("div", "lh-category");
    n.id = e.id, n.appendChild(this.renderCategoryHeader(e, t));

    const r = e.auditRefs,
          o = r.filter(e => "manual" !== e.result.scoreDisplayMode),
          i = this._renderAudits(o, t);

    n.appendChild(i);
    const a = r.filter(e => "manual" === e.result.scoreDisplayMode),
          l = this.renderClump("manual", {
      auditRefs: a,
      description: e.manualDescription
    });
    return n.appendChild(l), n;
  }

  renderCategoryScore(e, t) {
    if (null === e.score) return super.renderScoreGauge(e, t);
    const n = this.dom.createComponent("gaugePwa"),
          r = this.dom.find("a.lh-gauge--pwa__wrapper", n),
          o = n.querySelector("svg");
    if (!o) throw new Error("no SVG element found in PWA score gauge template");

    S._makeSvgReferencesUnique(o);

    const i = this._getGroupIds(e.auditRefs),
          a = this._getPassingGroupIds(e.auditRefs);

    if (a.size === i.size) r.classList.add("lh-badged--all");else for (const e of a) r.classList.add("lh-badged--" + e);
    return this.dom.find(".lh-gauge__label", n).textContent = e.title, r.title = this._getGaugeTooltip(e.auditRefs, t), n;
  }

  _getGroupIds(e) {
    const t = e.map(e => e.group).filter(e => !!e);
    return new Set(t);
  }

  _getPassingGroupIds(e) {
    const t = this._getGroupIds(e);

    for (const n of e) !i.showAsPassed(n.result) && n.group && t.delete(n.group);

    return t;
  }

  _getGaugeTooltip(e, t) {
    const n = this._getGroupIds(e),
          r = [];

    for (const o of n) {
      const n = e.filter(e => e.group === o),
            a = n.length,
            l = n.filter(e => i.showAsPassed(e.result)).length,
            s = t[o].title;
      r.push(`${s}: ${l}/${a}`);
    }

    return r.join(", ");
  }

  _renderAudits(e, t) {
    const n = this.renderUnexpandableClump(e, t),
          r = this._getPassingGroupIds(e);

    for (const e of r) {
      this.dom.find(".lh-audit-group--" + e, n).classList.add("lh-badged");
    }

    return n;
  }

  static _makeSvgReferencesUnique(e) {
    const t = e.querySelector("defs");
    if (!t) return;
    const n = i.getUniqueSuffix(),
          r = t.querySelectorAll("[id]");

    for (const t of r) {
      const r = t.id,
            o = `${r}-${n}`;
      t.id = o;
      const i = e.querySelectorAll(`use[href="#${r}"]`);

      for (const e of i) e.setAttribute("href", "#" + o);

      const a = e.querySelectorAll(`[fill="url(#${r})"]`);

      for (const e of a) e.setAttribute("fill", `url(#${o})`);
    }
  }

}

class L {
  constructor(e) {
    this._dom = e, this._opts = {};
  }

  renderReport(e, t, n) {
    if (!this._dom.rootEl && t) {
      console.warn("Please adopt the new report API in renderer/api.js.");
      const e = t.closest(".lh-root");
      e ? this._dom.rootEl = e : (t.classList.add("lh-root", "lh-vars"), this._dom.rootEl = t);
    } else this._dom.rootEl && t && (this._dom.rootEl = t);

    n && (this._opts = n), this._dom.setLighthouseChannel(e.configSettings.channel || "unknown");
    const r = i.prepareReportResult(e);
    return this._dom.rootEl.textContent = "", this._dom.rootEl.appendChild(this._renderReport(r)), this._dom.rootEl;
  }

  _renderReportTopbar(e) {
    const t = this._dom.createComponent("topbar"),
          n = this._dom.find("a.lh-topbar__url", t);

    return n.textContent = e.finalUrl, n.title = e.finalUrl, this._dom.safelySetHref(n, e.finalUrl), t;
  }

  _renderReportHeader() {
    const e = this._dom.createComponent("heading"),
          t = this._dom.createComponent("scoresWrapper");

    return this._dom.find(".lh-scores-wrapper-placeholder", e).replaceWith(t), e;
  }

  _renderReportFooter(e) {
    const t = this._dom.createComponent("footer");

    return this._renderMetaBlock(e, t), this._dom.find(".lh-footer__version_issue", t).textContent = i.i18n.strings.footerIssue, this._dom.find(".lh-footer__version", t).textContent = e.lighthouseVersion, t;
  }

  _renderMetaBlock(e, t) {
    const n = i.getEmulationDescriptions(e.configSettings || {}),
          r = e.userAgent.match(/(\w*Chrome\/[\d.]+)/),
          o = Array.isArray(r) ? r[1].replace("/", " ").replace("Chrome", "Chromium") : "Chromium",
          a = e.configSettings.channel,
          l = e.environment.benchmarkIndex.toFixed(0),
          s = e.environment.credits?.["axe-core"],
          c = [["date", "Captured at " + i.i18n.formatDateTime(e.fetchTime)], ["devices", `${n.deviceEmulation} with Lighthouse ${e.lighthouseVersion}`, `${i.i18n.strings.runtimeSettingsBenchmark}: ${l}\n${i.i18n.strings.runtimeSettingsCPUThrottling}: ${n.cpuThrottling}` + (s ? `\n${i.i18n.strings.runtimeSettingsAxeVersion}: ${s}` : "")], ["samples-one", i.i18n.strings.runtimeSingleLoad, i.i18n.strings.runtimeSingleLoadTooltip], ["stopwatch", i.i18n.strings.runtimeAnalysisWindow], ["networkspeed", "" + n.summary, `${i.i18n.strings.runtimeSettingsNetworkThrottling}: ${n.networkThrottling}`], ["chrome", "Using " + o + (a ? " with " + a : ""), `${i.i18n.strings.runtimeSettingsUANetwork}: "${e.environment.networkUserAgent}"`]],
          d = this._dom.find(".lh-meta__items", t);

    for (const [e, t, n] of c) {
      const r = this._dom.createChildOf(d, "li", "lh-meta__item");

      if (r.textContent = t, n) {
        r.classList.add("lh-tooltip-boundary");
        this._dom.createChildOf(r, "div", "lh-tooltip").textContent = n;
      }

      r.classList.add("lh-report-icon", "lh-report-icon--" + e);
    }
  }

  _renderReportWarnings(e) {
    if (!e.runWarnings || 0 === e.runWarnings.length) return this._dom.createElement("div");

    const t = this._dom.createComponent("warningsToplevel");

    this._dom.find(".lh-warnings__msg", t).textContent = i.i18n.strings.toplevelWarningsMessage;

    const n = this._dom.find("ul", t);

    for (const t of e.runWarnings) {
      n.appendChild(this._dom.createElement("li")).appendChild(this._dom.convertMarkdownLinkSnippets(t));
    }

    return t;
  }

  _renderScoreGauges(e, t, n) {
    const r = [],
          o = [],
          a = [];

    for (const l of Object.values(e.categories)) {
      const s = n[l.id] || t,
            c = s.renderCategoryScore(l, e.categoryGroups || {}, {
        gatherMode: e.gatherMode
      }),
            d = this._dom.find("a.lh-gauge__wrapper, a.lh-fraction__wrapper", c);

      d && (this._dom.safelySetHref(d, "#" + l.id), d.addEventListener("click", e => {
        if (!d.matches('[href^="#"]')) return;
        const t = d.getAttribute("href"),
              n = this._dom.rootEl;
        if (!t || !n) return;

        const r = this._dom.find(t, n);

        e.preventDefault(), r.scrollIntoView();
      })), i.isPluginCategory(l.id) ? a.push(c) : s.renderCategoryScore === t.renderCategoryScore ? r.push(c) : o.push(c);
    }

    return [...r, ...o, ...a];
  }

  _renderReport(e) {
    const t = new C(e.configSettings.locale, { ...i.UIStrings,
      ...e.i18n.rendererFormattedStrings
    });
    i.i18n = t, i.reportJson = e;

    const n = e.audits["full-page-screenshot"] && e.audits["full-page-screenshot"].details && "full-page-screenshot" === e.audits["full-page-screenshot"].details.type ? e.audits["full-page-screenshot"].details : void 0,
          r = new A(this._dom, {
      fullPageScreenshot: n
    }),
          o = new l(this._dom, r),
          a = {
      performance: new z(this._dom, r),
      pwa: new S(this._dom, r)
    },
          s = this._dom.createElement("div");

    s.appendChild(this._renderReportHeader());

    const c = this._dom.createElement("div", "lh-container"),
          d = this._dom.createElement("div", "lh-report");

    let p;
    d.appendChild(this._renderReportWarnings(e));
    1 === Object.keys(e.categories).length ? s.classList.add("lh-header--solo-category") : p = this._dom.createElement("div", "lh-scores-header");

    const h = this._dom.createElement("div");

    if (h.classList.add("lh-scorescale-wrap"), h.append(this._dom.createComponent("scorescale")), p) {
      const t = this._dom.find(".lh-scores-container", s);

      p.append(...this._renderScoreGauges(e, o, a)), t.appendChild(p), t.appendChild(h);

      const n = this._dom.createElement("div", "lh-sticky-header");

      n.append(...this._renderScoreGauges(e, o, a)), c.appendChild(n);
    }

    const u = d.appendChild(this._dom.createElement("div", "lh-categories")),
          g = {
      gatherMode: e.gatherMode
    };

    for (const t of Object.values(e.categories)) {
      const n = a[t.id] || o;
      n.dom.createChildOf(u, "div", "lh-category-wrapper").appendChild(n.render(t, e.categoryGroups, g));
    }

    o.injectFinalScreenshot(u, e.audits, h);

    const m = this._dom.createFragment();

    return m.append(this._dom.createComponent("styles")), this._opts.omitTopbar || m.appendChild(this._renderReportTopbar(e)), m.appendChild(c), c.appendChild(s), c.appendChild(d), d.appendChild(this._renderReportFooter(e)), n && k.installFullPageScreenshot(this._dom.rootEl, n.screenshot), m;
  }

}

function M(e, t) {
  const n = e.rootEl;
  void 0 === t ? n.classList.toggle("lh-dark") : n.classList.toggle("lh-dark", t);
}

const F = "undefined" != typeof btoa ? btoa : e => Buffer.from(e).toString("base64"),
      N = "undefined" != typeof atob ? atob : e => Buffer.from(e, "base64").toString();
const T = {
  toBase64: async function (e, t) {
    let n = new TextEncoder().encode(e);
    if (t.gzip) if ("undefined" != typeof CompressionStream) {
      const e = new CompressionStream("gzip"),
            t = e.writable.getWriter();
      t.write(n), t.close();
      const r = await new Response(e.readable).arrayBuffer();
      n = new Uint8Array(r);
    } else {
      n = window.pako.gzip(e);
    }
    let r = "";

    for (let e = 0; e < n.length; e += 5e3) r += String.fromCharCode(...n.subarray(e, e + 5e3));

    return F(r);
  },
  fromBase64: function (e, t) {
    const n = N(e),
          r = Uint8Array.from(n, e => e.charCodeAt(0));

    if (t.gzip) {
      return window.pako.ungzip(r, {
        to: "string"
      });
    }

    return new TextDecoder().decode(r);
  }
};

function D() {
  const e = window.location.host.endsWith(".vercel.app"),
        t = new URLSearchParams(window.location.search).has("dev");
  return e ? `https://${window.location.host}/gh-pages` : t ? "http://localhost:8000" : "https://googlechrome.github.io/lighthouse";
}

function H(e) {
  const t = e.generatedTime,
        n = e.fetchTime || t;
  return `${e.lighthouseVersion}-${e.requestedUrl}-${n}`;
}

async function R(e, t, n) {
  const r = new URL(t),
        o = Boolean(window.CompressionStream);
  r.hash = await T.toBase64(JSON.stringify(e), {
    gzip: o
  }), o && r.searchParams.set("gzip", "1"), window.open(r.toString(), n);
}

async function P(e) {
  const t = "viewer-" + H(e);
  !function (e, t, n) {
    const r = new URL(t).origin;
    window.addEventListener("message", function t(n) {
      n.origin === r && o && n.data.opened && (o.postMessage(e, r), window.removeEventListener("message", t));
    });
    const o = window.open(t, n);
  }({
    lhr: e
  }, D() + "/viewer/", t);
}

class U {
  constructor(e) {
    this._dom = e, this._toggleEl, this._menuEl, this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this), this.onToggleClick = this.onToggleClick.bind(this), this.onToggleKeydown = this.onToggleKeydown.bind(this), this.onMenuFocusOut = this.onMenuFocusOut.bind(this), this.onMenuKeydown = this.onMenuKeydown.bind(this), this._getNextMenuItem = this._getNextMenuItem.bind(this), this._getNextSelectableNode = this._getNextSelectableNode.bind(this), this._getPreviousMenuItem = this._getPreviousMenuItem.bind(this);
  }

  setup(e) {
    this._toggleEl = this._dom.find(".lh-topbar button.lh-tools__button", this._dom.rootEl), this._toggleEl.addEventListener("click", this.onToggleClick), this._toggleEl.addEventListener("keydown", this.onToggleKeydown), this._menuEl = this._dom.find(".lh-topbar div.lh-tools__dropdown", this._dom.rootEl), this._menuEl.addEventListener("keydown", this.onMenuKeydown), this._menuEl.addEventListener("click", e);
  }

  close() {
    this._toggleEl.classList.remove("lh-active"), this._toggleEl.setAttribute("aria-expanded", "false"), this._menuEl.contains(this._dom.document().activeElement) && this._toggleEl.focus(), this._menuEl.removeEventListener("focusout", this.onMenuFocusOut), this._dom.document().removeEventListener("keydown", this.onDocumentKeyDown);
  }

  open(e) {
    this._toggleEl.classList.contains("lh-active") ? e.focus() : this._menuEl.addEventListener("transitionend", () => {
      e.focus();
    }, {
      once: !0
    }), this._toggleEl.classList.add("lh-active"), this._toggleEl.setAttribute("aria-expanded", "true"), this._menuEl.addEventListener("focusout", this.onMenuFocusOut), this._dom.document().addEventListener("keydown", this.onDocumentKeyDown);
  }

  onToggleClick(e) {
    e.preventDefault(), e.stopImmediatePropagation(), this._toggleEl.classList.contains("lh-active") ? this.close() : this.open(this._getNextMenuItem());
  }

  onToggleKeydown(e) {
    switch (e.code) {
      case "ArrowUp":
        e.preventDefault(), this.open(this._getPreviousMenuItem());
        break;

      case "ArrowDown":
      case "Enter":
      case " ":
        e.preventDefault(), this.open(this._getNextMenuItem());
    }
  }

  onMenuKeydown(e) {
    const t = e.target;

    switch (e.code) {
      case "ArrowUp":
        e.preventDefault(), this._getPreviousMenuItem(t).focus();
        break;

      case "ArrowDown":
        e.preventDefault(), this._getNextMenuItem(t).focus();
        break;

      case "Home":
        e.preventDefault(), this._getNextMenuItem().focus();
        break;

      case "End":
        e.preventDefault(), this._getPreviousMenuItem().focus();
    }
  }

  onDocumentKeyDown(e) {
    27 === e.keyCode && this.close();
  }

  onMenuFocusOut(e) {
    const t = e.relatedTarget;
    this._menuEl.contains(t) || this.close();
  }

  _getNextSelectableNode(e, t) {
    const n = e.filter(e => e instanceof HTMLElement && !e.hasAttribute("disabled") && "none" !== window.getComputedStyle(e).display);
    let r = t ? n.indexOf(t) + 1 : 0;
    return r >= n.length && (r = 0), n[r];
  }

  _getNextMenuItem(e) {
    const t = Array.from(this._menuEl.childNodes);
    return this._getNextSelectableNode(t, e);
  }

  _getPreviousMenuItem(e) {
    const t = Array.from(this._menuEl.childNodes).reverse();
    return this._getNextSelectableNode(t, e);
  }

}

class B {
  constructor(e, t) {
    this.lhr, this._reportUIFeatures = e, this._dom = t, this._dropDownMenu = new U(this._dom), this._copyAttempt = !1, this.topbarEl, this.categoriesEl, this.stickyHeaderEl, this.highlightEl, this.onDropDownMenuClick = this.onDropDownMenuClick.bind(this), this.onKeyUp = this.onKeyUp.bind(this), this.onCopy = this.onCopy.bind(this), this.collapseAllDetails = this.collapseAllDetails.bind(this);
  }

  enable(e) {
    this.lhr = e, this._dom.rootEl.addEventListener("keyup", this.onKeyUp), this._dom.document().addEventListener("copy", this.onCopy), this._dropDownMenu.setup(this.onDropDownMenuClick), this._setUpCollapseDetailsAfterPrinting();
    this._dom.find(".lh-topbar__logo", this._dom.rootEl).addEventListener("click", () => M(this._dom)), this._setupStickyHeader();
  }

  onDropDownMenuClick(e) {
    e.preventDefault();
    const t = e.target;

    if (t && t.hasAttribute("data-action")) {
      switch (t.getAttribute("data-action")) {
        case "copy":
          this.onCopyButtonClick();
          break;

        case "print-summary":
          this.collapseAllDetails(), this._print();
          break;

        case "print-expanded":
          this.expandAllDetails(), this._print();
          break;

        case "save-json":
          {
            const e = JSON.stringify(this.lhr, null, 2);

            this._reportUIFeatures._saveFile(new Blob([e], {
              type: "application/json"
            }));

            break;
          }

        case "save-html":
          {
            const t = this._reportUIFeatures.getReportHtml();

            try {
              this._reportUIFeatures._saveFile(new Blob([t], {
                type: "text/html"
              }));
            } catch (e) {
              this._dom.fireEventOn("lh-log", this._dom.document(), {
                cmd: "error",
                msg: "Could not export as HTML. " + e.message
              });
            }

            break;
          }

        case "open-viewer":
          this._dom.isDevTools() ? async function (e) {
            const t = "viewer-" + H(e),
                  n = D() + "/viewer/";
            await R({
              lhr: e
            }, n, t);
          }(this.lhr) : P(this.lhr);
          break;

        case "save-gist":
          this._reportUIFeatures.saveAsGist();

          break;

        case "toggle-dark":
          M(this._dom);
      }

      this._dropDownMenu.close();
    }
  }

  onCopy(e) {
    this._copyAttempt && e.clipboardData && (e.preventDefault(), e.clipboardData.setData("text/plain", JSON.stringify(this.lhr, null, 2)), this._dom.fireEventOn("lh-log", this._dom.document(), {
      cmd: "log",
      msg: "Report JSON copied to clipboard"
    })), this._copyAttempt = !1;
  }

  onCopyButtonClick() {
    this._dom.fireEventOn("lh-analytics", this._dom.document(), {
      cmd: "send",
      fields: {
        hitType: "event",
        eventCategory: "report",
        eventAction: "copy"
      }
    });

    try {
      this._dom.document().queryCommandSupported("copy") && (this._copyAttempt = !0, this._dom.document().execCommand("copy") || (this._copyAttempt = !1, this._dom.fireEventOn("lh-log", this._dom.document(), {
        cmd: "warn",
        msg: "Your browser does not support copy to clipboard."
      })));
    } catch (e) {
      this._copyAttempt = !1, this._dom.fireEventOn("lh-log", this._dom.document(), {
        cmd: "log",
        msg: e.message
      });
    }
  }

  onKeyUp(e) {
    (e.ctrlKey || e.metaKey) && 80 === e.keyCode && this._dropDownMenu.close();
  }

  expandAllDetails() {
    this._dom.findAll(".lh-categories details", this._dom.rootEl).map(e => e.open = !0);
  }

  collapseAllDetails() {
    this._dom.findAll(".lh-categories details", this._dom.rootEl).map(e => e.open = !1);
  }

  _print() {
    self.print();
  }

  resetUIState() {
    this._dropDownMenu.close();
  }

  _getScrollParent(e) {
    const {
      overflowY: t
    } = window.getComputedStyle(e);
    return "visible" !== t && "hidden" !== t ? e : e.parentElement ? this._getScrollParent(e.parentElement) : document;
  }

  _setUpCollapseDetailsAfterPrinting() {
    "onbeforeprint" in self ? self.addEventListener("afterprint", this.collapseAllDetails) : self.matchMedia("print").addListener(e => {
      e.matches ? this.expandAllDetails() : this.collapseAllDetails();
    });
  }

  _setupStickyHeader() {
    this.topbarEl = this._dom.find("div.lh-topbar", this._dom.rootEl), this.categoriesEl = this._dom.find("div.lh-categories", this._dom.rootEl), window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      try {
        this.stickyHeaderEl = this._dom.find("div.lh-sticky-header", this._dom.rootEl);
      } catch {
        return;
      }

      this.highlightEl = this._dom.createChildOf(this.stickyHeaderEl, "div", "lh-highlighter");

      const e = this._getScrollParent(this._dom.find(".lh-container", this._dom.rootEl));

      e.addEventListener("scroll", () => this._updateStickyHeader());
      const t = e instanceof window.Document ? document.documentElement : e;
      new window.ResizeObserver(() => this._updateStickyHeader()).observe(t);
    }));
  }

  _updateStickyHeader() {
    if (!this.stickyHeaderEl) return;
    const e = this.topbarEl.getBoundingClientRect().bottom >= this.categoriesEl.getBoundingClientRect().top,
          t = Array.from(this._dom.rootEl.querySelectorAll(".lh-category")).filter(e => e.getBoundingClientRect().top - window.innerHeight / 2 < 0),
          n = t.length > 0 ? t.length - 1 : 0,
          r = this.stickyHeaderEl.querySelectorAll(".lh-gauge__wrapper"),
          o = r[n],
          i = r[0].getBoundingClientRect().left,
          a = o.getBoundingClientRect().left - i;
    this.highlightEl.style.transform = `translate(${a}px)`, this.stickyHeaderEl.classList.toggle("lh-sticky-header--visible", e);
  }

}

function O(e) {
  return function (e, t) {
    const n = t ? new Date(t) : new Date(),
          r = n.toLocaleTimeString("en-US", {
      hour12: !1
    }),
          o = n.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).split("/");
    return o.unshift(o.pop()), `${e}_${o.join("-")}_${r}`.replace(/[/?<>\\:*|"]/g, "-");
  }(new URL(e.finalUrl).hostname, e.fetchTime);
}

class I {
  constructor(e, t = {}) {
    this.json, this._dom = e, this._opts = t, this._topbar = t.omitTopbar ? null : new B(this, e), this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  initFeatures(e) {
    this.json = e, this._topbar && (this._topbar.enable(e), this._topbar.resetUIState()), this._setupMediaQueryListeners(), this._setupThirdPartyFilter(), this._setupElementScreenshotOverlay(this._dom.rootEl);
    let t = !1;
    !(this._dom.isDevTools() || this._opts.disableAutoDarkModeAndFireworks) && window.matchMedia("(prefers-color-scheme: dark)").matches && (t = !0);
    ["performance", "accessibility", "best-practices", "seo"].every(t => {
      const n = e.categories[t];
      return n && 1 === n.score;
    }) && (t = !0, this._enableFireworks()), t && M(this._dom, !0);

    if (e.categories.performance && e.categories.performance.auditRefs.some(t => Boolean("metrics" === t.group && e.audits[t.id].errorMessage))) {
      this._dom.find("input.lh-metrics-toggle__input", this._dom.rootEl).checked = !0;
    }

    this.json.audits["script-treemap-data"] && this.json.audits["script-treemap-data"].details && this.addButton({
      text: i.i18n.strings.viewTreemapLabel,
      icon: "treemap",
      onClick: () => function (e) {
        if (!e.audits["script-treemap-data"].details) throw new Error("no script treemap data found");
        R({
          lhr: {
            requestedUrl: e.requestedUrl,
            finalUrl: e.finalUrl,
            audits: {
              "script-treemap-data": e.audits["script-treemap-data"]
            },
            configSettings: {
              locale: e.configSettings.locale
            }
          }
        }, D() + "/treemap/", "treemap-" + H(e));
      }(this.json)
    });

    for (const e of this._dom.findAll("[data-i18n]", this._dom.rootEl)) {
      const t = e.getAttribute("data-i18n");
      e.textContent = i.i18n.strings[t];
    }
  }

  addButton(e) {
    const t = this._dom.rootEl.querySelector(".lh-audit-group--metrics");

    if (!t) return;
    let n = t.querySelector(".lh-buttons");
    n || (n = this._dom.createChildOf(t, "div", "lh-buttons"));
    const r = ["lh-button"];
    e.icon && (r.push("lh-report-icon"), r.push("lh-report-icon--" + e.icon));

    const o = this._dom.createChildOf(n, "button", r.join(" "));

    return o.textContent = e.text, o.addEventListener("click", e.onClick), o;
  }

  getReportHtml() {
    return this._topbar && this._topbar.resetUIState(), "<!doctype html><body>" + this._dom.rootEl.outerHTML;
  }

  saveAsGist() {
    throw new Error("Cannot save as gist from base report");
  }

  _enableFireworks() {
    const e = this._dom.find(".lh-scores-container", this._dom.rootEl);

    e.classList.add("lh-score100"), e.addEventListener("click", t => {
      e.classList.toggle("lh-fireworks-paused");
    });
  }

  _setupMediaQueryListeners() {
    const e = self.matchMedia("(max-width: 500px)");
    e.addListener(this.onMediaQueryChange), this.onMediaQueryChange(e);
  }

  _resetUIState() {
    this._topbar && this._topbar.resetUIState();
  }

  onMediaQueryChange(e) {
    this._dom.rootEl.classList.toggle("lh-narrow", e.matches);
  }

  _setupThirdPartyFilter() {
    const e = ["uses-rel-preconnect", "third-party-facades"],
          t = ["legacy-javascript"];
    Array.from(this._dom.rootEl.querySelectorAll("table.lh-table")).filter(e => e.querySelector("td.lh-table-column--url, td.lh-table-column--source-location")).filter(t => {
      const n = t.closest(".lh-audit");
      if (!n) throw new Error(".lh-table not within audit");
      return !e.includes(n.id);
    }).forEach(e => {
      const n = function (e) {
        return Array.from(e.tBodies[0].rows);
      }(e),
            r = this._getThirdPartyRows(n, this.json.finalUrl),
            o = this._dom.createComponent("3pFilter"),
            a = this._dom.find("input", o);

      a.addEventListener("change", e => {
        const t = e.target instanceof HTMLInputElement && !e.target.checked;
        let o = !0,
            i = n[0];

        for (; i;) {
          const e = t && r.includes(i);

          do {
            i.classList.toggle("lh-row--hidden", e), i.classList.toggle("lh-row--even", !e && o), i.classList.toggle("lh-row--odd", !e && !o), i = i.nextElementSibling;
          } while (i && i.classList.contains("lh-sub-item-row"));

          e || (o = !o);
        }
      }), this._dom.find(".lh-3p-filter-count", o).textContent = "" + r.length, this._dom.find(".lh-3p-ui-string", o).textContent = i.i18n.strings.thirdPartyResourcesLabel;
      const l = r.length === n.length,
            s = !r.length;
      if ((l || s) && (this._dom.find("div.lh-3p-filter", o).hidden = !0), !e.parentNode) return;
      e.parentNode.insertBefore(o, e);
      const c = e.closest(".lh-audit");
      if (!c) throw new Error(".lh-table not within audit");
      t.includes(c.id) && !l && a.click();
    });
  }

  _setupElementScreenshotOverlay(e) {
    const t = this.json.audits["full-page-screenshot"] && this.json.audits["full-page-screenshot"].details && "full-page-screenshot" === this.json.audits["full-page-screenshot"].details.type && this.json.audits["full-page-screenshot"].details;
    t && k.installOverlayFeature({
      dom: this._dom,
      rootEl: e,
      overlayContainerEl: e,
      fullPageScreenshot: t
    });
  }

  _getThirdPartyRows(e, t) {
    const n = [],
          r = i.getRootDomain(t);

    for (const t of e) {
      if (t.classList.contains("lh-sub-item-row")) continue;
      const e = t.querySelector("div.lh-text__url");
      if (!e) continue;
      const o = e.dataset.url;
      if (!o) continue;
      i.getRootDomain(o) !== r && n.push(t);
    }

    return n;
  }

  _saveFile(e) {
    const t = O(this.json);

    this._dom.saveFile(e, t);
  }

}

function V(e, t = {}) {
  const n = document.createElement("article");
  n.classList.add("lh-root", "lh-vars");
  const r = new a(n.ownerDocument, n);
  new L(r).renderReport(e, n, t);
  return new I(r, t).initFeatures(e), n;
}
},{"buffer":"dskh"}],"Tjyl":[function(require,module,exports) {
module.exports = {
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4534.0 Safari/537.36",
  "environment": {
    "networkUserAgent": "Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "hostUserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4534.0 Safari/537.36",
    "benchmarkIndex": 2330.5,
    "credits": {
      "axe-core": "4.2.1"
    }
  },
  "lighthouseVersion": "8.0.0",
  "fetchTime": "2021-06-07T05:45:43.992Z",
  "requestedUrl": "https://d13z.dev/",
  "finalUrl": "https://d13z.dev/",
  "runWarnings": [],
  "audits": {
    "is-on-https": {
      "id": "is-on-https",
      "title": "Uses HTTPS",
      "description": "All sites should be protected with HTTPS, even ones that don't handle sensitive data. This includes avoiding [mixed content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content), where some resources are loaded over HTTP despite the initial request being served over HTTPS. HTTPS prevents intruders from tampering with or passively listening in on the communications between your app and your users, and is a prerequisite for HTTP/2 and many new web platform APIs. [Learn more](https://web.dev/is-on-https/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "redirects-http": {
      "id": "redirects-http",
      "title": "Redirects HTTP traffic to HTTPS",
      "description": "If you've already set up HTTPS, make sure that you redirect all HTTP traffic to HTTPS in order to enable secure web features for all your users. [Learn more](https://web.dev/redirects-http/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "service-worker": {
      "id": "service-worker",
      "title": "Registers a service worker that controls page and `start_url`",
      "description": "The service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. [Learn more](https://web.dev/service-worker/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "debugdata",
        "scriptUrl": "https://d13z.dev/sw.js",
        "scopeUrl": "https://d13z.dev/"
      }
    },
    "viewport": {
      "id": "viewport",
      "title": "Has a `<meta name=\"viewport\">` tag with `width` or `initial-scale`",
      "description": "Add a `<meta name=\"viewport\">` tag to optimize your app for mobile screens. [Learn more](https://web.dev/viewport/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "warnings": []
    },
    "first-contentful-paint": {
      "id": "first-contentful-paint",
      "title": "First Contentful Paint",
      "description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more](https://web.dev/first-contentful-paint/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 1043.0879999999997,
      "numericUnit": "millisecond",
      "displayValue": "1.0 s"
    },
    "largest-contentful-paint": {
      "id": "largest-contentful-paint",
      "title": "Largest Contentful Paint",
      "description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more](https://web.dev/lighthouse-largest-contentful-paint/)",
      "score": 0.84,
      "scoreDisplayMode": "numeric",
      "numericValue": 2760.3799999999997,
      "numericUnit": "millisecond",
      "displayValue": "2.8 s"
    },
    "first-meaningful-paint": {
      "id": "first-meaningful-paint",
      "title": "First Meaningful Paint",
      "description": "First Meaningful Paint measures when the primary content of a page is visible. [Learn more](https://web.dev/first-meaningful-paint/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 1054.5879999999997,
      "numericUnit": "millisecond",
      "displayValue": "1.1 s"
    },
    "speed-index": {
      "id": "speed-index",
      "title": "Speed Index",
      "description": "Speed Index shows how quickly the contents of a page are visibly populated. [Learn more](https://web.dev/speed-index/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 1370.6637618633004,
      "numericUnit": "millisecond",
      "displayValue": "1.4 s"
    },
    "screenshot-thumbnails": {
      "id": "screenshot-thumbnails",
      "title": "Screenshot Thumbnails",
      "description": "This is what the load of your site looked like.",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "filmstrip",
        "scale": 3000,
        "items": [{
          "timing": 300,
          "timestamp": 731090966,
          "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIANUAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z"
        }, {
          "timing": 600,
          "timestamp": 731390966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 900,
          "timestamp": 731690966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 1200,
          "timestamp": 731990966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 1500,
          "timestamp": 732290966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 1800,
          "timestamp": 732590966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 2100,
          "timestamp": 732890966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 2400,
          "timestamp": 733190966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 2700,
          "timestamp": 733490966,
          "data": "data:image/jpeg;base64,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"
        }, {
          "timing": 3000,
          "timestamp": 733790966,
          "data": "data:image/jpeg;base64,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"
        }]
      }
    },
    "final-screenshot": {
      "id": "final-screenshot",
      "title": "Final Screenshot",
      "description": "The last screenshot captured of the pageload.",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "screenshot",
        "timing": 1053,
        "timestamp": 731844282,
        "data": "data:image/jpeg;base64,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"
      }
    },
    "total-blocking-time": {
      "id": "total-blocking-time",
      "title": "Total Blocking Time",
      "description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more](https://web.dev/lighthouse-total-blocking-time/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0.5,
      "numericUnit": "millisecond",
      "displayValue": "0 ms"
    },
    "max-potential-fid": {
      "id": "max-potential-fid",
      "title": "Max Potential First Input Delay",
      "description": "The maximum potential First Input Delay that your users could experience is the duration of the longest task. [Learn more](https://web.dev/lighthouse-max-potential-fid/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 51,
      "numericUnit": "millisecond",
      "displayValue": "50 ms"
    },
    "cumulative-layout-shift": {
      "id": "cumulative-layout-shift",
      "title": "Cumulative Layout Shift",
      "description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more](https://web.dev/cls/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "unitless",
      "displayValue": "0",
      "details": {
        "type": "debugdata",
        "items": [{
          "cumulativeLayoutShiftMainFrame": 0,
          "totalCumulativeLayoutShift": 0
        }]
      }
    },
    "errors-in-console": {
      "id": "errors-in-console",
      "title": "No browser errors logged to the console",
      "description": "Errors logged to the console indicate unresolved problems. They can come from network request failures and other browser concerns. [Learn more](https://web.dev/errors-in-console/)",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "server-response-time": {
      "id": "server-response-time",
      "title": "Initial server response time was short",
      "description": "Keep the server response time for the main document short because all other requests depend on it. [Learn more](https://web.dev/time-to-first-byte/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "numericValue": 43.60500000000002,
      "numericUnit": "millisecond",
      "displayValue": "Root document took 40 ms",
      "details": {
        "type": "opportunity",
        "headings": [{
          "key": "url",
          "valueType": "url",
          "label": "URL"
        }, {
          "key": "responseTime",
          "valueType": "timespanMs",
          "label": "Time Spent"
        }],
        "items": [{
          "url": "https://d13z.dev/",
          "responseTime": 43.60500000000002
        }],
        "overallSavingsMs": -56.39499999999998
      }
    },
    "interactive": {
      "id": "interactive",
      "title": "Time to Interactive",
      "description": "Time to interactive is the amount of time it takes for the page to become fully interactive. [Learn more](https://web.dev/interactive/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 1103.0879999999997,
      "numericUnit": "millisecond",
      "displayValue": "1.1 s"
    },
    "user-timings": {
      "id": "user-timings",
      "title": "User Timing marks and measures",
      "description": "Consider instrumenting your app with the User Timing API to measure your app's real-world performance during key user experiences. [Learn more](https://web.dev/user-timings/).",
      "score": null,
      "scoreDisplayMode": "notApplicable",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "critical-request-chains": {
      "id": "critical-request-chains",
      "title": "Avoid chaining critical requests",
      "description": "The Critical Request Chains below show you what resources are loaded with a high priority. Consider reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load. [Learn more](https://web.dev/critical-request-chains/).",
      "score": null,
      "scoreDisplayMode": "notApplicable",
      "displayValue": "",
      "details": {
        "type": "criticalrequestchain",
        "chains": {
          "2DEE1FA0B9B9664571DB99F6D89E5EE1": {
            "request": {
              "url": "https://d13z.dev/",
              "startTime": 730.792816,
              "endTime": 731.150502,
              "responseReceivedTime": 731.110592,
              "transferSize": 8974
            }
          }
        },
        "longestChain": {
          "duration": 357.6859999999442,
          "length": 1,
          "transferSize": 8974
        }
      }
    },
    "redirects": {
      "id": "redirects",
      "title": "Avoid multiple page redirects",
      "description": "Redirects introduce additional delays before the page can be loaded. [Learn more](https://web.dev/redirects/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "installable-manifest": {
      "id": "installable-manifest",
      "title": "Web app manifest and service worker meet the installability requirements",
      "description": "Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more](https://web.dev/installable-manifest/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "warnings": [],
      "details": {
        "type": "table",
        "headings": [],
        "items": [],
        "debugData": {
          "type": "debugdata",
          "manifestUrl": "https://d13z.dev/manifest.webmanifest"
        }
      }
    },
    "apple-touch-icon": {
      "id": "apple-touch-icon",
      "title": "Provides a valid `apple-touch-icon`",
      "description": "For ideal appearance on iOS when users add a progressive web app to the home screen, define an `apple-touch-icon`. It must point to a non-transparent 192px (or 180px) square PNG. [Learn More](https://web.dev/apple-touch-icon/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "warnings": []
    },
    "splash-screen": {
      "id": "splash-screen",
      "title": "Configured for a custom splash screen",
      "description": "A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more](https://web.dev/splash-screen/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "debugdata",
        "items": [{
          "failures": [],
          "isParseFailure": false,
          "hasStartUrl": true,
          "hasIconsAtLeast144px": true,
          "hasIconsAtLeast512px": true,
          "fetchesIcon": true,
          "hasPWADisplayValue": true,
          "hasBackgroundColor": true,
          "hasThemeColor": true,
          "hasShortName": true,
          "shortNameLength": false,
          "hasName": true,
          "hasMaskableIcon": false
        }]
      }
    },
    "themed-omnibox": {
      "id": "themed-omnibox",
      "title": "Sets a theme color for the address bar.",
      "description": "The browser address bar can be themed to match your site. [Learn more](https://web.dev/themed-omnibox/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "debugdata",
        "items": [{
          "failures": [],
          "themeColor": "#F7A046",
          "isParseFailure": false,
          "hasStartUrl": true,
          "hasIconsAtLeast144px": true,
          "hasIconsAtLeast512px": true,
          "fetchesIcon": true,
          "hasPWADisplayValue": true,
          "hasBackgroundColor": true,
          "hasThemeColor": true,
          "hasShortName": true,
          "shortNameLength": false,
          "hasName": true,
          "hasMaskableIcon": false
        }]
      }
    },
    "maskable-icon": {
      "id": "maskable-icon",
      "title": "Manifest doesn't have a maskable icon",
      "description": "A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device. [Learn more](https://web.dev/maskable-icon-audit/).",
      "score": 0,
      "scoreDisplayMode": "binary"
    },
    "content-width": {
      "id": "content-width",
      "title": "Content is sized correctly for the viewport",
      "description": "If the width of your app's content doesn't match the width of the viewport, your app might not be optimized for mobile screens. [Learn more](https://web.dev/content-width/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "image-aspect-ratio": {
      "id": "image-aspect-ratio",
      "title": "Displays images with correct aspect ratio",
      "description": "Image display dimensions should match natural aspect ratio. [Learn more](https://web.dev/image-aspect-ratio/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "image-size-responsive": {
      "id": "image-size-responsive",
      "title": "Serves images with appropriate resolution",
      "description": "Image natural dimensions should be proportional to the display size and the pixel ratio to maximize image clarity. [Learn more](https://web.dev/serve-responsive-images/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "preload-fonts": {
      "id": "preload-fonts",
      "title": "Fonts with `font-display: optional` are preloaded",
      "description": "Preload `optional` fonts so first-time visitors may use them. [Learn more](https://web.dev/preload-optional-fonts/)",
      "score": null,
      "scoreDisplayMode": "notApplicable",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "deprecations": {
      "id": "deprecations",
      "title": "Avoids deprecated APIs",
      "description": "Deprecated APIs will eventually be removed from the browser. [Learn more](https://web.dev/deprecations/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "mainthread-work-breakdown": {
      "id": "mainthread-work-breakdown",
      "title": "Minimizes main-thread work",
      "description": "Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. [Learn more](https://web.dev/mainthread-work-breakdown/)",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 861.5840000000003,
      "numericUnit": "millisecond",
      "displayValue": "0.9 s",
      "details": {
        "type": "table",
        "headings": [{
          "key": "groupLabel",
          "itemType": "text",
          "text": "Category"
        }, {
          "key": "duration",
          "itemType": "ms",
          "granularity": 1,
          "text": "Time Spent"
        }],
        "items": [{
          "group": "styleLayout",
          "groupLabel": "Style & Layout",
          "duration": 295.5439999999999
        }, {
          "group": "scriptEvaluation",
          "groupLabel": "Script Evaluation",
          "duration": 282.61600000000055
        }, {
          "group": "other",
          "groupLabel": "Other",
          "duration": 228.2799999999999
        }, {
          "group": "scriptParseCompile",
          "groupLabel": "Script Parsing & Compilation",
          "duration": 29.667999999999992
        }, {
          "group": "parseHTML",
          "groupLabel": "Parse HTML & CSS",
          "duration": 15.223999999999984
        }, {
          "group": "paintCompositeRender",
          "groupLabel": "Rendering",
          "duration": 10.251999999999981
        }]
      }
    },
    "bootup-time": {
      "id": "bootup-time",
      "title": "JavaScript execution time",
      "description": "Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. [Learn more](https://web.dev/bootup-time/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 222.0519999999999,
      "numericUnit": "millisecond",
      "displayValue": "0.2 s",
      "details": {
        "type": "table",
        "headings": [{
          "key": "url",
          "itemType": "url",
          "text": "URL"
        }, {
          "key": "total",
          "granularity": 1,
          "itemType": "ms",
          "text": "Total CPU Time"
        }, {
          "key": "scripting",
          "granularity": 1,
          "itemType": "ms",
          "text": "Script Evaluation"
        }, {
          "key": "scriptParseCompile",
          "granularity": 1,
          "itemType": "ms",
          "text": "Script Parse"
        }],
        "items": [{
          "url": "https://d13z.dev/",
          "total": 382.01999999999987,
          "scripting": 12.25999999999998,
          "scriptParseCompile": 2.6160000000000005
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "total": 217.5079999999999,
          "scripting": 197.01999999999992,
          "scriptParseCompile": 3.3240000000000003
        }, {
          "url": "Unattributable",
          "total": 150.9000000000001,
          "scripting": 6.335999999999999,
          "scriptParseCompile": 0.496
        }],
        "summary": {
          "wastedMs": 222.0519999999999
        }
      }
    },
    "uses-rel-preload": {
      "id": "uses-rel-preload",
      "title": "Preload key requests",
      "description": "Consider using `<link rel=preload>` to prioritize fetching resources that are currently requested later in page load. [Learn more](https://web.dev/uses-rel-preload/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": ["A preload `<link>` was found for \"https://d13z.dev/page-data/index/page-data.json\" but was not used by the browser. Check that you are using the `crossorigin` attribute properly.", "A preload `<link>` was found for \"https://d13z.dev/page-data/sq/d/251939775.json\" but was not used by the browser. Check that you are using the `crossorigin` attribute properly.", "A preload `<link>` was found for \"https://d13z.dev/page-data/sq/d/3942705351.json\" but was not used by the browser. Check that you are using the `crossorigin` attribute properly.", "A preload `<link>` was found for \"https://d13z.dev/page-data/sq/d/401334301.json\" but was not used by the browser. Check that you are using the `crossorigin` attribute properly.", "A preload `<link>` was found for \"https://d13z.dev/page-data/app-data.json\" but was not used by the browser. Check that you are using the `crossorigin` attribute properly."],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "uses-rel-preconnect": {
      "id": "uses-rel-preconnect",
      "title": "Preconnect to required origins",
      "description": "Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn more](https://web.dev/uses-rel-preconnect/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": [],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "font-display": {
      "id": "font-display",
      "title": "All text remains visible during webfont loads",
      "description": "Leverage the font-display CSS feature to ensure text is user-visible while webfonts are loading. [Learn more](https://web.dev/font-display/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "warnings": [],
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "diagnostics": {
      "id": "diagnostics",
      "title": "Diagnostics",
      "description": "Collection of useful page vitals.",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "debugdata",
        "items": [{
          "numRequests": 65,
          "numScripts": 10,
          "numStylesheets": 0,
          "numFonts": 0,
          "numTasks": 782,
          "numTasksOver10ms": 4,
          "numTasksOver25ms": 1,
          "numTasksOver50ms": 1,
          "numTasksOver100ms": 0,
          "numTasksOver500ms": 0,
          "rtt": 11.945,
          "throughput": 3239825.880733389,
          "maxRtt": 43.563,
          "maxServerLatency": 49.233999999999995,
          "totalByteWeight": 316597,
          "totalTaskTime": 215.39599999999973,
          "mainDocumentTransferSize": 8974
        }]
      }
    },
    "network-requests": {
      "id": "network-requests",
      "title": "Network Requests",
      "description": "Lists the network requests that were made during page load.",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "table",
        "headings": [{
          "key": "url",
          "itemType": "url",
          "text": "URL"
        }, {
          "key": "protocol",
          "itemType": "text",
          "text": "Protocol"
        }, {
          "key": "startTime",
          "itemType": "ms",
          "granularity": 1,
          "text": "Start Time"
        }, {
          "key": "endTime",
          "itemType": "ms",
          "granularity": 1,
          "text": "End Time"
        }, {
          "key": "transferSize",
          "itemType": "bytes",
          "displayUnit": "kb",
          "granularity": 1,
          "text": "Transfer Size"
        }, {
          "key": "resourceSize",
          "itemType": "bytes",
          "displayUnit": "kb",
          "granularity": 1,
          "text": "Resource Size"
        }, {
          "key": "statusCode",
          "itemType": "text",
          "text": "Status Code"
        }, {
          "key": "mimeType",
          "itemType": "text",
          "text": "MIME Type"
        }, {
          "key": "resourceType",
          "itemType": "text",
          "text": "Resource Type"
        }],
        "items": [{
          "url": "https://d13z.dev/",
          "protocol": "h2",
          "startTime": 0,
          "endTime": 357.6859999999442,
          "finished": true,
          "transferSize": 8974,
          "resourceSize": 29879,
          "statusCode": 200,
          "mimeType": "text/html",
          "resourceType": "Document"
        }, {
          "url": "https://d13z.dev/webpack-runtime-6ea73f4604adc4ed6f98.js",
          "protocol": "h2",
          "startTime": 323.34500000001754,
          "endTime": 847.6729999999861,
          "finished": true,
          "transferSize": 2005,
          "resourceSize": 5056,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/styles-89fd2ae28bdf06750a71.js",
          "protocol": "h2",
          "startTime": 323.50799999994706,
          "endTime": 534.9840000000086,
          "finished": true,
          "transferSize": 223,
          "resourceSize": 117,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/framework-a4620de0399b10c30110.js",
          "protocol": "h2",
          "startTime": 323.7369999999373,
          "endTime": 845.3670000000102,
          "finished": true,
          "transferSize": 38841,
          "resourceSize": 128788,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "protocol": "h2",
          "startTime": 323.94399999998313,
          "endTime": 886.1269999999877,
          "finished": true,
          "transferSize": 50622,
          "resourceSize": 182080,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "protocol": "h2",
          "startTime": 324.03999999996813,
          "endTime": 935.1570000000038,
          "finished": true,
          "transferSize": 21360,
          "resourceSize": 71956,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "protocol": "h2",
          "startTime": 324.20700000000124,
          "endTime": 851.8809999999348,
          "finished": true,
          "transferSize": 12088,
          "resourceSize": 34073,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js",
          "protocol": "h2",
          "startTime": 324.2890000000216,
          "endTime": 899.0219999999454,
          "finished": true,
          "transferSize": 18447,
          "resourceSize": 59392,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/component---src-templates-index-template-js-4d46f19f2f19e46c23ae.js",
          "protocol": "h2",
          "startTime": 324.41900000003443,
          "endTime": 574.214999999981,
          "finished": true,
          "transferSize": 2483,
          "resourceSize": 8407,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/page-data/app-data.json",
          "protocol": "h2",
          "startTime": 324.5809999999665,
          "endTime": 736.994999999979,
          "finished": true,
          "transferSize": 156,
          "resourceSize": 50,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/index/page-data.json",
          "protocol": "h2",
          "startTime": 324.7559999999794,
          "endTime": 736.8629999999712,
          "finished": true,
          "transferSize": 704,
          "resourceSize": 1372,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/251939775.json",
          "protocol": "h2",
          "startTime": 332.00799999997344,
          "endTime": 765.5839999999898,
          "finished": true,
          "transferSize": 589,
          "resourceSize": 482,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/3942705351.json",
          "protocol": "h2",
          "startTime": 332.1449999999686,
          "endTime": 702.7550000000247,
          "finished": true,
          "transferSize": 858,
          "resourceSize": 738,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/401334301.json",
          "protocol": "h2",
          "startTime": 332.3609999999917,
          "endTime": 847.7550000000065,
          "finished": true,
          "transferSize": 271,
          "resourceSize": 164,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://www.googletagmanager.com/gtag/js?id=UA-160638961-1",
          "protocol": "h2",
          "startTime": 335.39699999994355,
          "endTime": 457.94599999999264,
          "finished": true,
          "transferSize": 36449,
          "resourceSize": 90691,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://d13z.dev/media/photo.jpg",
          "protocol": "h2",
          "startTime": 335.6149999999616,
          "endTime": 846.4239999999563,
          "finished": true,
          "transferSize": 30824,
          "resourceSize": 30687,
          "statusCode": 200,
          "mimeType": "image/jpeg",
          "resourceType": "Image"
        }, {
          "url": "https://www.google-analytics.com/analytics.js",
          "protocol": "h2",
          "startTime": 470.94800000002124,
          "endTime": 494.6459999999888,
          "finished": true,
          "transferSize": 19970,
          "resourceSize": 49153,
          "statusCode": 200,
          "mimeType": "text/javascript",
          "resourceType": "Script"
        }, {
          "url": "https://www.google-analytics.com/collect?v=1&t=event&tid=UA-160638961-1&cid=0.13953371379774215.0.2224749656578353&ec=Performance&ea=FCP&el=1623044746073-3437025731802&ev=519&dl=https%3A%2F%2Fd13z.dev%2F&dp=%2F&ni=true&z=1623044746076",
          "protocol": "h2",
          "startTime": 948.5260000000153,
          "endTime": 985.5469999999968,
          "finished": true,
          "transferSize": 236,
          "resourceSize": 35,
          "statusCode": 200,
          "mimeType": "image/gif",
          "resourceType": "Ping"
        }, {
          "url": "https://www.google-analytics.com/collect?v=1&t=event&tid=UA-160638961-1&cid=0.13953371379774215.0.2224749656578353&ec=Performance&ea=TTFB&el=1623044746073-3075480596193&ev=43&dl=https%3A%2F%2Fd13z.dev%2F&dp=%2F&ni=true&z=1623044746082",
          "protocol": "h2",
          "startTime": 954.5570000000225,
          "endTime": 990.6730000000152,
          "finished": true,
          "transferSize": 100,
          "resourceSize": 35,
          "statusCode": 200,
          "mimeType": "image/gif",
          "resourceType": "Ping"
        }, {
          "url": "https://d13z.dev/manifest.webmanifest",
          "protocol": "h2",
          "startTime": 955.5480000000216,
          "endTime": 1615.0949999999966,
          "finished": true,
          "transferSize": 583,
          "resourceSize": 1045,
          "statusCode": 200,
          "mimeType": "application/octet-stream",
          "resourceType": "Manifest"
        }, {
          "url": "https://d13z.dev/favicon-32x32.png?v=d9a5c3f8aefa0b524df411159e2d27d7",
          "protocol": "h2",
          "startTime": 955.8969999999363,
          "endTime": 998.8889999999628,
          "finished": true,
          "transferSize": 3137,
          "resourceSize": 2995,
          "statusCode": 200,
          "mimeType": "image/png",
          "resourceType": "Other"
        }, {
          "url": "https://www.google-analytics.com/collect?v=1&t=event&tid=UA-160638961-1&cid=0.13953371379774215.0.2224749656578353&ec=Performance&ea=LCP&el=1623044746073-7383593808988&ev=519&dl=https%3A%2F%2Fd13z.dev%2F&dp=%2F&ni=true&z=1623044746097",
          "protocol": "h2",
          "startTime": 969.5409999999356,
          "endTime": 1005.427999999938,
          "finished": true,
          "transferSize": 100,
          "resourceSize": 35,
          "statusCode": 200,
          "mimeType": "image/gif",
          "resourceType": "Ping"
        }, {
          "url": "https://d13z.dev/page-data/posts/When-can-I-consider-myself-a-good-software-developer/page-data.json",
          "protocol": "h2",
          "startTime": 971.302000000037,
          "endTime": 1463.0079999999452,
          "finished": true,
          "transferSize": 2108,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/growth/page-data.json",
          "protocol": "h2",
          "startTime": 971.6049999999541,
          "endTime": 1383.9020000000346,
          "finished": true,
          "transferSize": 868,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/debugging-development-performance-nextjs/page-data.json",
          "protocol": "h2",
          "startTime": 971.8970000000127,
          "endTime": 1382.5859999999466,
          "finished": true,
          "transferSize": 4671,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/debug/page-data.json",
          "protocol": "h2",
          "startTime": 972.3579999999856,
          "endTime": 1423.5089999999673,
          "finished": true,
          "transferSize": 853,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/hello-world/page-data.json",
          "protocol": "h2",
          "startTime": 972.9129999999486,
          "endTime": 1413.9659999999594,
          "finished": true,
          "transferSize": 838,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/unclassified/page-data.json",
          "protocol": "h2",
          "startTime": 973.0769999999893,
          "endTime": 1372.3949999999832,
          "finished": true,
          "transferSize": 897,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://www.google-analytics.com/j/collect?v=1&_v=j90&a=1867357816&t=pageview&_s=1&dl=https%3A%2F%2Fd13z.dev%2F&dp=%2F&ul=en-gb&de=UTF-8&dt=Danilo%20Velasquez%20Blog&sd=24-bit&sr=360x640&vp=360x640&je=0&_u=aEBAAUABAAAAAC~&jid=323716367&gjid=1429170633&cid=1095271360.1623044746&tid=UA-160638961-1&_gid=311347706.1623044746&_r=1&gtm=2ou621&z=558927756",
          "protocol": "h3-29",
          "startTime": 988.9540000000352,
          "endTime": 1025.180999999975,
          "finished": true,
          "transferSize": 22,
          "resourceSize": 2,
          "statusCode": 200,
          "mimeType": "text/plain",
          "resourceType": "XHR"
        }, {
          "url": "https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j90&tid=UA-160638961-1&cid=1095271360.1623044746&jid=323716367&gjid=1429170633&_gid=311347706.1623044746&_u=aEBAAUAAAAAAAC~&z=1162306566",
          "protocol": "h2",
          "startTime": 1026.098999999931,
          "endTime": 1119.1310000000385,
          "finished": true,
          "transferSize": 441,
          "resourceSize": 4,
          "statusCode": 200,
          "mimeType": "text/plain",
          "resourceType": "XHR"
        }, {
          "url": "https://www.google.com/ads/ga-audiences?t=sr&aip=1&_r=4&slf_rd=1&v=1&_v=j90&tid=UA-160638961-1&cid=1095271360.1623044746&jid=323716367&_u=aEBAAUAAAAAAAC~&z=1345158272",
          "protocol": "h2",
          "startTime": 1423.5860000000002,
          "endTime": 1519.8289999999588,
          "finished": true,
          "transferSize": 505,
          "resourceSize": 42,
          "statusCode": 200,
          "mimeType": "image/gif",
          "resourceType": "Image"
        }, {
          "url": "https://www.google.es/ads/ga-audiences?t=sr&aip=1&_r=4&slf_rd=1&v=1&_v=j90&tid=UA-160638961-1&cid=1095271360.1623044746&jid=323716367&_u=aEBAAUAAAAAAAC~&z=1345158272",
          "protocol": "h2",
          "startTime": 1423.626000000013,
          "endTime": 1515.985999999998,
          "finished": true,
          "transferSize": 505,
          "resourceSize": 42,
          "statusCode": 200,
          "mimeType": "image/gif",
          "resourceType": "Image"
        }, {
          "url": "https://d13z.dev/page-data/category/unclassified/page-data.json",
          "protocol": "h2",
          "startTime": 1373.5880000000407,
          "endTime": 1373.9950000000363,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 765,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/component---src-templates-category-template-js-e57c579897967ef72e84.js",
          "protocol": "h2",
          "startTime": 1463.1009999999378,
          "endTime": 1667.2969999999623,
          "finished": true,
          "transferSize": 2484,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/debugging-development-performance-nextjs/page-data.json",
          "protocol": "h2",
          "startTime": 1383.1480000000056,
          "endTime": 1383.6440000000039,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 20781,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/component---src-templates-post-template-js-ecd999959d0171abed8a.js",
          "protocol": "h2",
          "startTime": 1463.1640000000061,
          "endTime": 1676.9639999999981,
          "finished": true,
          "transferSize": 2563,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/growth/page-data.json",
          "protocol": "h2",
          "startTime": 1384.9069999999983,
          "endTime": 1385.3199999999788,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 761,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/page-data/posts/hello-world/page-data.json",
          "protocol": "h2",
          "startTime": 1415.2649999999767,
          "endTime": 1415.6050000000278,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 731,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/page-data/category/debug/page-data.json",
          "protocol": "h2",
          "startTime": 1424.1759999999886,
          "endTime": 1424.8929999999973,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 747,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/page-data/posts/When-can-I-consider-myself-a-good-software-developer/page-data.json",
          "protocol": "h2",
          "startTime": 1464.0049999999292,
          "endTime": 1464.4919999999502,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 5331,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "XHR"
        }, {
          "url": "https://d13z.dev/icons/icon-144x144.png?v=d9a5c3f8aefa0b524df411159e2d27d7",
          "protocol": "h2",
          "startTime": 1615.9440000000131,
          "endTime": 2182.63300000001,
          "finished": true,
          "transferSize": 50822,
          "resourceSize": 50678,
          "statusCode": 200,
          "mimeType": "image/png",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/styles.16bedd2ad65a5cb8e16d.css",
          "protocol": "h2",
          "startTime": 2697.373999999968,
          "endTime": 2707.226999999989,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 12649,
          "statusCode": 200,
          "mimeType": "text/css",
          "resourceType": "Other"
        }, {
          "url": "https://www.google-analytics.com/analytics.js",
          "protocol": "h2",
          "startTime": 2697.518999999943,
          "endTime": 2709.7870000000057,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 49153,
          "statusCode": 200,
          "mimeType": "text/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://www.googletagmanager.com/gtag/js?id=UA-160638961-1",
          "protocol": "h2",
          "startTime": 2700.0020000000404,
          "endTime": 2701.9679999999653,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 0,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "protocol": "h2",
          "startTime": 2697.9109999999764,
          "endTime": 2712.052999999969,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 71956,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/component---src-templates-index-template-js-4d46f19f2f19e46c23ae.js",
          "protocol": "h2",
          "startTime": 2698.11100000004,
          "endTime": 2791.721999999936,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 8407,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js",
          "protocol": "h2",
          "startTime": 2698.338000000035,
          "endTime": 2792.524999999955,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 59392,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "protocol": "h2",
          "startTime": 2698.5690000000204,
          "endTime": 2792.8610000000162,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 34073,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/styles-89fd2ae28bdf06750a71.js",
          "protocol": "h2",
          "startTime": 2698.778999999945,
          "endTime": 2712.073000000032,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 117,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/framework-a4620de0399b10c30110.js",
          "protocol": "h2",
          "startTime": 2699.0180000000237,
          "endTime": 2712.3359999999366,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 128788,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "protocol": "h2",
          "startTime": 2699.2870000000266,
          "endTime": 2712.4189999999544,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 182080,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/webpack-runtime-6ea73f4604adc4ed6f98.js",
          "protocol": "h2",
          "startTime": 2699.4979999999487,
          "endTime": 2712.44200000001,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 5056,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/index/page-data.json",
          "protocol": "h2",
          "startTime": 2699.726999999939,
          "endTime": 2745.849000000021,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 1372,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/251939775.json",
          "protocol": "h2",
          "startTime": 2699.9479999999494,
          "endTime": 2789.4880000000057,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 482,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/3942705351.json",
          "protocol": "h2",
          "startTime": 2700.2290000000357,
          "endTime": 2789.6160000000236,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 738,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/sq/d/401334301.json",
          "protocol": "h2",
          "startTime": 2700.5189999999857,
          "endTime": 2790.7450000000154,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 164,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/app-data.json",
          "protocol": "h2",
          "startTime": 2700.9030000000394,
          "endTime": 2789.8500000000013,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 50,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/component---src-templates-category-template-js-e57c579897967ef72e84.js",
          "protocol": "h2",
          "startTime": 2701.2339999999995,
          "endTime": 2793.692999999962,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 8420,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/debug/page-data.json",
          "protocol": "h2",
          "startTime": 2701.449000000025,
          "endTime": 2789.7329999999556,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 747,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/growth/page-data.json",
          "protocol": "h2",
          "startTime": 2701.734999999985,
          "endTime": 2790.2729999999565,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 761,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/category/unclassified/page-data.json",
          "protocol": "h2",
          "startTime": 2702.1089999999504,
          "endTime": 2789.944999999989,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 765,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/component---src-templates-post-template-js-ecd999959d0171abed8a.js",
          "protocol": "h2",
          "startTime": 2702.4299999999357,
          "endTime": 2793.882999999937,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 6778,
          "statusCode": 200,
          "mimeType": "application/javascript",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/hello-world/page-data.json",
          "protocol": "h2",
          "startTime": 2702.590999999984,
          "endTime": 2830.340999999976,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 731,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/debugging-development-performance-nextjs/page-data.json",
          "protocol": "h2",
          "startTime": 2702.872999999954,
          "endTime": 2925.7199999999557,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 20781,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }, {
          "url": "https://d13z.dev/page-data/posts/When-can-I-consider-myself-a-good-software-developer/page-data.json",
          "protocol": "h2",
          "startTime": 2703.139999999962,
          "endTime": 2925.9160000000293,
          "finished": true,
          "transferSize": 0,
          "resourceSize": 5331,
          "statusCode": 200,
          "mimeType": "application/json",
          "resourceType": "Other"
        }]
      }
    },
    "network-rtt": {
      "id": "network-rtt",
      "title": "Network Round Trip Times",
      "description": "Network round trip times (RTT) have a large impact on performance. If the RTT to an origin is high, it's an indication that servers closer to the user could improve performance. [Learn more](https://hpbn.co/primer-on-latency-and-bandwidth/).",
      "score": null,
      "scoreDisplayMode": "informative",
      "numericValue": 43.563,
      "numericUnit": "millisecond",
      "displayValue": "40 ms",
      "details": {
        "type": "table",
        "headings": [{
          "key": "origin",
          "itemType": "text",
          "text": "URL"
        }, {
          "key": "rtt",
          "itemType": "ms",
          "granularity": 1,
          "text": "Time Spent"
        }],
        "items": [{
          "origin": "https://d13z.dev",
          "rtt": 43.563
        }, {
          "origin": "https://stats.g.doubleclick.net",
          "rtt": 27.721
        }, {
          "origin": "https://www.google.es",
          "rtt": 12.486
        }, {
          "origin": "https://www.googletagmanager.com",
          "rtt": 12.032999999999998
        }, {
          "origin": "https://www.google-analytics.com",
          "rtt": 11.945
        }, {
          "origin": "https://www.google.com",
          "rtt": 11.945
        }]
      }
    },
    "network-server-latency": {
      "id": "network-server-latency",
      "title": "Server Backend Latencies",
      "description": "Server latencies can impact web performance. If the server latency of an origin is high, it's an indication the server is overloaded or has poor backend performance. [Learn more](https://hpbn.co/primer-on-web-performance/#analyzing-the-resource-waterfall).",
      "score": null,
      "scoreDisplayMode": "informative",
      "numericValue": 49.233999999999995,
      "numericUnit": "millisecond",
      "displayValue": "50 ms",
      "details": {
        "type": "table",
        "headings": [{
          "key": "origin",
          "itemType": "text",
          "text": "URL"
        }, {
          "key": "serverResponseTime",
          "itemType": "ms",
          "granularity": 1,
          "text": "Time Spent"
        }],
        "items": [{
          "origin": "https://d13z.dev",
          "serverResponseTime": 49.233999999999995
        }, {
          "origin": "https://www.google.com",
          "serverResponseTime": 31.330000000000005
        }, {
          "origin": "https://www.google.es",
          "serverResponseTime": 26.874999999999996
        }, {
          "origin": "https://www.google-analytics.com",
          "serverResponseTime": 22.939999999999998
        }, {
          "origin": "https://stats.g.doubleclick.net",
          "serverResponseTime": 1.336000000000002
        }, {
          "origin": "https://www.googletagmanager.com",
          "serverResponseTime": 0
        }]
      }
    },
    "main-thread-tasks": {
      "id": "main-thread-tasks",
      "title": "Tasks",
      "description": "Lists the toplevel main thread tasks that executed during page load.",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "table",
        "headings": [{
          "key": "startTime",
          "itemType": "ms",
          "granularity": 1,
          "text": "Start Time"
        }, {
          "key": "duration",
          "itemType": "ms",
          "granularity": 1,
          "text": "End Time"
        }],
        "items": [{
          "duration": 5.604,
          "startTime": 324.502
        }, {
          "duration": 68.131,
          "startTime": 356.267
        }, {
          "duration": 11.388,
          "startTime": 439.709
        }, {
          "duration": 7.695,
          "startTime": 500.268
        }, {
          "duration": 11.62,
          "startTime": 940.398
        }, {
          "duration": 12.64,
          "startTime": 960.738
        }, {
          "duration": 7.322,
          "startTime": 2700.836
        }]
      }
    },
    "metrics": {
      "id": "metrics",
      "title": "Metrics",
      "description": "Collects all available metrics.",
      "score": null,
      "scoreDisplayMode": "informative",
      "numericValue": 1103,
      "numericUnit": "millisecond",
      "details": {
        "type": "debugdata",
        "items": [{
          "firstContentfulPaint": 1043,
          "firstMeaningfulPaint": 1055,
          "largestContentfulPaint": 2760,
          "interactive": 1103,
          "speedIndex": 1371,
          "totalBlockingTime": 1,
          "maxPotentialFID": 51,
          "cumulativeLayoutShift": 0,
          "cumulativeLayoutShiftMainFrame": 0,
          "totalCumulativeLayoutShift": 0,
          "observedTimeOrigin": 0,
          "observedTimeOriginTs": 730790966,
          "observedNavigationStart": 0,
          "observedNavigationStartTs": 730790966,
          "observedFirstPaint": 520,
          "observedFirstPaintTs": 731310952,
          "observedFirstContentfulPaint": 520,
          "observedFirstContentfulPaintTs": 731310952,
          "observedFirstContentfulPaintAllFrames": 520,
          "observedFirstContentfulPaintAllFramesTs": 731310952,
          "observedFirstMeaningfulPaint": 520,
          "observedFirstMeaningfulPaintTs": 731310952,
          "observedLargestContentfulPaint": 520,
          "observedLargestContentfulPaintTs": 731310952,
          "observedLargestContentfulPaintAllFrames": 520,
          "observedLargestContentfulPaintAllFramesTs": 731310952,
          "observedTraceEnd": 4519,
          "observedTraceEndTs": 735309918,
          "observedLoad": 956,
          "observedLoadTs": 731746605,
          "observedDomContentLoaded": 423,
          "observedDomContentLoadedTs": 731214170,
          "observedCumulativeLayoutShift": 0,
          "observedCumulativeLayoutShiftMainFrame": 0,
          "observedTotalCumulativeLayoutShift": 0,
          "observedFirstVisualChange": 436,
          "observedFirstVisualChangeTs": 731226966,
          "observedLastVisualChange": 986,
          "observedLastVisualChangeTs": 731776966,
          "observedSpeedIndex": 669,
          "observedSpeedIndexTs": 731460132
        }, {
          "lcpInvalidated": false
        }]
      }
    },
    "performance-budget": {
      "id": "performance-budget",
      "title": "Performance budget",
      "description": "Keep the quantity and size of network requests under the targets set by the provided performance budget. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/budgets).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "timing-budget": {
      "id": "timing-budget",
      "title": "Timing budget",
      "description": "Set a timing budget to help you keep an eye on the performance of your site. Performant sites load fast and respond to user input events quickly. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/budgets).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "resource-summary": {
      "id": "resource-summary",
      "title": "Keep request counts low and transfer sizes small",
      "description": "To set budgets for the quantity and size of page resources, add a budget.json file. [Learn more](https://web.dev/use-lighthouse-for-performance-budgets/).",
      "score": null,
      "scoreDisplayMode": "informative",
      "displayValue": "65 requests • 309 KiB",
      "details": {
        "type": "table",
        "headings": [{
          "key": "label",
          "itemType": "text",
          "text": "Resource Type"
        }, {
          "key": "requestCount",
          "itemType": "numeric",
          "text": "Requests"
        }, {
          "key": "transferSize",
          "itemType": "bytes",
          "text": "Transfer Size"
        }],
        "items": [{
          "resourceType": "total",
          "label": "Total",
          "requestCount": 65,
          "transferSize": 316597
        }, {
          "resourceType": "script",
          "label": "Script",
          "requestCount": 10,
          "transferSize": 202488
        }, {
          "resourceType": "other",
          "label": "Other",
          "requestCount": 51,
          "transferSize": 73301
        }, {
          "resourceType": "image",
          "label": "Image",
          "requestCount": 3,
          "transferSize": 31834
        }, {
          "resourceType": "document",
          "label": "Document",
          "requestCount": 1,
          "transferSize": 8974
        }, {
          "resourceType": "stylesheet",
          "label": "Stylesheet",
          "requestCount": 0,
          "transferSize": 0
        }, {
          "resourceType": "media",
          "label": "Media",
          "requestCount": 0,
          "transferSize": 0
        }, {
          "resourceType": "font",
          "label": "Font",
          "requestCount": 0,
          "transferSize": 0
        }, {
          "resourceType": "third-party",
          "label": "Third-party",
          "requestCount": 11,
          "transferSize": 58328
        }]
      }
    },
    "third-party-summary": {
      "id": "third-party-summary",
      "title": "Minimize third-party usage",
      "description": "Third-party code can significantly impact load performance. Limit the number of redundant third-party providers and try to load third-party code after your page has primarily finished loading. [Learn more](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "displayValue": "Third-party code blocked the main thread for 0 ms",
      "details": {
        "type": "table",
        "headings": [{
          "key": "entity",
          "itemType": "link",
          "text": "Third-Party",
          "subItemsHeading": {
            "key": "url",
            "itemType": "url"
          }
        }, {
          "key": "transferSize",
          "granularity": 1,
          "itemType": "bytes",
          "text": "Transfer Size",
          "subItemsHeading": {
            "key": "transferSize"
          }
        }, {
          "key": "blockingTime",
          "granularity": 1,
          "itemType": "ms",
          "text": "Main-Thread Blocking Time",
          "subItemsHeading": {
            "key": "blockingTime"
          }
        }],
        "items": [{
          "mainThreadTime": 41.61599999999999,
          "blockingTime": 0,
          "transferSize": 36449,
          "entity": {
            "type": "link",
            "text": "Google Tag Manager",
            "url": "https://marketingplatform.google.com/about/tag-manager/"
          },
          "subItems": {
            "type": "subitems",
            "items": [{
              "url": "https://www.googletagmanager.com/gtag/js?id=UA-160638961-1",
              "mainThreadTime": 41.61599999999999,
              "blockingTime": 0,
              "transferSize": 36449
            }]
          }
        }, {
          "mainThreadTime": 36.776,
          "blockingTime": 0,
          "transferSize": 20428,
          "entity": {
            "type": "link",
            "text": "Google Analytics",
            "url": "https://www.google.com/analytics/analytics/"
          },
          "subItems": {
            "type": "subitems",
            "items": [{
              "url": "https://www.google-analytics.com/analytics.js",
              "mainThreadTime": 36.776,
              "blockingTime": 0,
              "transferSize": 19970
            }]
          }
        }, {
          "mainThreadTime": 0,
          "blockingTime": 0,
          "transferSize": 505,
          "entity": {
            "type": "link",
            "text": "Other Google APIs/SDKs",
            "url": "https://developers.google.com/apis-explorer/#p/"
          },
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "mainThreadTime": 0,
          "blockingTime": 0,
          "transferSize": 441,
          "entity": {
            "type": "link",
            "text": "Google/Doubleclick Ads",
            "url": "https://www.doubleclickbygoogle.com/"
          },
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }],
        "summary": {
          "wastedBytes": 57823,
          "wastedMs": 0
        }
      }
    },
    "third-party-facades": {
      "id": "third-party-facades",
      "title": "Lazy load third-party resources with facades",
      "description": "Some third-party embeds can be lazy loaded. Consider replacing them with a facade until they are required. [Learn more](https://web.dev/third-party-facades/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "largest-contentful-paint-element": {
      "id": "largest-contentful-paint-element",
      "title": "Largest Contentful Paint element",
      "description": "This is the largest contentful element painted within the viewport. [Learn More](https://web.dev/lighthouse-largest-contentful-paint/)",
      "score": null,
      "scoreDisplayMode": "informative",
      "displayValue": "1 element found",
      "details": {
        "type": "table",
        "headings": [{
          "key": "node",
          "itemType": "node",
          "text": "Element"
        }],
        "items": [{
          "node": {
            "type": "node",
            "lhId": "page-1-H2",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,H2",
            "selector": "div.Page-module--page__body--Ic6i6 > div > div.Feed-module--feed__item--2D5rE > h2.Feed-module--feed__item-title--3nigr",
            "boundingRect": {
              "top": 52,
              "bottom": 167,
              "left": 20,
              "right": 340,
              "width": 320,
              "height": 115
            },
            "snippet": "<h2 class=\"Feed-module--feed__item-title--3nigr\">",
            "nodeLabel": "Debugging development performance in a NextJS application"
          }
        }]
      }
    },
    "layout-shift-elements": {
      "id": "layout-shift-elements",
      "title": "Avoid large layout shifts",
      "description": "These DOM elements contribute most to the CLS of the page.",
      "score": null,
      "scoreDisplayMode": "notApplicable",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "long-tasks": {
      "id": "long-tasks",
      "title": "Avoid long main-thread tasks",
      "description": "Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. [Learn more](https://web.dev/long-tasks-devtools/)",
      "score": null,
      "scoreDisplayMode": "informative",
      "displayValue": "2 long tasks found",
      "details": {
        "type": "table",
        "headings": [{
          "key": "url",
          "itemType": "url",
          "text": "URL"
        }, {
          "key": "startTime",
          "itemType": "ms",
          "granularity": 1,
          "text": "Start Time"
        }, {
          "key": "duration",
          "itemType": "ms",
          "granularity": 1,
          "text": "Duration"
        }],
        "items": [{
          "url": "https://d13z.dev/",
          "duration": 135.9999999999999,
          "startTime": 907.0879999999999
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "duration": 51,
          "startTime": 1112.0879999999997
        }]
      }
    },
    "no-unload-listeners": {
      "id": "no-unload-listeners",
      "title": "Avoids `unload` event listeners",
      "description": "The `unload` event does not fire reliably and listening for it can prevent browser optimizations like the Back-Forward Cache. Consider using the `pagehide` or `visibilitychange` events instead. [Learn more](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#the-unload-event)",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "non-composited-animations": {
      "id": "non-composited-animations",
      "title": "Avoid non-composited animations",
      "description": "Animations which are not composited can be janky and increase CLS. [Learn more](https://web.dev/non-composited-animations)",
      "score": null,
      "scoreDisplayMode": "notApplicable",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "unsized-images": {
      "id": "unsized-images",
      "title": "Image elements have explicit `width` and `height`",
      "description": "Set an explicit width and height on image elements to reduce layout shifts and improve CLS. [Learn more](https://web.dev/optimize-cls/#images-without-dimensions)",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "valid-source-maps": {
      "id": "valid-source-maps",
      "title": "Page has valid source maps",
      "description": "Source maps translate minified code to the original source code. This helps developers debug in production. In addition, Lighthouse is able to provide further insights. Consider deploying source maps to take advantage of these benefits. [Learn more](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [{
          "key": "scriptUrl",
          "itemType": "url",
          "subItemsHeading": {
            "key": "error"
          },
          "text": "URL"
        }, {
          "key": "sourceMapUrl",
          "itemType": "url",
          "text": "Map URL"
        }],
        "items": [{
          "scriptUrl": "https://d13z.dev/webpack-runtime-6ea73f4604adc4ed6f98.js",
          "sourceMapUrl": "https://d13z.dev/webpack-runtime-6ea73f4604adc4ed6f98.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/styles-89fd2ae28bdf06750a71.js",
          "sourceMapUrl": "https://d13z.dev/styles-89fd2ae28bdf06750a71.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/framework-a4620de0399b10c30110.js",
          "sourceMapUrl": "https://d13z.dev/framework-a4620de0399b10c30110.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/component---src-templates-index-template-js-4d46f19f2f19e46c23ae.js",
          "sourceMapUrl": "https://d13z.dev/component---src-templates-index-template-js-4d46f19f2f19e46c23ae.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "sourceMapUrl": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "sourceMapUrl": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js",
          "sourceMapUrl": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }, {
          "scriptUrl": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "sourceMapUrl": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js.map",
          "subItems": {
            "type": "subitems",
            "items": []
          }
        }]
      }
    },
    "preload-lcp-image": {
      "id": "preload-lcp-image",
      "title": "Preload Largest Contentful Paint image",
      "description": "Preload the image used by the LCP element in order to improve your LCP time. [Learn more](https://web.dev/optimize-lcp/#preload-important-resources).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "csp-xss": {
      "id": "csp-xss",
      "title": "Ensure CSP is effective against XSS attacks",
      "description": "A strong Content Security Policy (CSP) significantly reduces the risk of cross-site scripting (XSS) attacks. [Learn more](https://web.dev/strict-csp/)",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "table",
        "headings": [{
          "key": "description",
          "itemType": "text",
          "subItemsHeading": {
            "key": "description"
          },
          "text": "Description"
        }, {
          "key": "directive",
          "itemType": "code",
          "subItemsHeading": {
            "key": "directive"
          },
          "text": "Directive"
        }, {
          "key": "severity",
          "itemType": "text",
          "subItemsHeading": {
            "key": "severity"
          },
          "text": "Severity"
        }],
        "items": [{
          "severity": "High",
          "description": "No CSP found in enforcement mode"
        }]
      }
    },
    "full-page-screenshot": {
      "id": "full-page-screenshot",
      "title": "Full-page screenshot",
      "description": "A full-height screenshot of the final rendered page",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "full-page-screenshot",
        "screenshot": {
          "data": "data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==",
          "width": 450,
          "height": 1847
        },
        "nodes": {
          "page-0-IMG": {
            "top": 25,
            "bottom": 100,
            "left": 20,
            "right": 95,
            "width": 75,
            "height": 75
          },
          "page-1-H2": {
            "top": 518,
            "bottom": 634,
            "left": 20,
            "right": 430,
            "width": 410,
            "height": 115
          },
          "5-0-A": {
            "top": 82,
            "bottom": 104,
            "left": 20,
            "right": 95,
            "width": 75,
            "height": 22
          },
          "5-1-A": {
            "top": 122,
            "bottom": 146,
            "left": 20,
            "right": 159,
            "width": 139,
            "height": 24
          },
          "5-2-A": {
            "top": 243,
            "bottom": 266,
            "left": 20,
            "right": 72,
            "width": 52,
            "height": 23
          },
          "5-3-A": {
            "top": 279,
            "bottom": 300,
            "left": 20,
            "right": 90,
            "width": 70,
            "height": 22
          },
          "5-4-A": {
            "top": 343,
            "bottom": 359,
            "left": 28,
            "right": 51,
            "width": 22,
            "height": 16
          },
          "5-5-A": {
            "top": 343,
            "bottom": 359,
            "left": 73,
            "right": 96,
            "width": 22,
            "height": 16
          },
          "5-6-A": {
            "top": 343,
            "bottom": 359,
            "left": 118,
            "right": 141,
            "width": 22,
            "height": 16
          },
          "5-7-A": {
            "top": 388,
            "bottom": 404,
            "left": 28,
            "right": 51,
            "width": 22,
            "height": 16
          },
          "5-8-A": {
            "top": 388,
            "bottom": 404,
            "left": 73,
            "right": 96,
            "width": 22,
            "height": 16
          },
          "5-9-A": {
            "top": 496,
            "bottom": 514,
            "left": 102,
            "right": 148,
            "width": 45,
            "height": 18
          },
          "5-10-A": {
            "top": 520,
            "bottom": 632,
            "left": 20,
            "right": 326,
            "width": 306,
            "height": 112
          },
          "5-11-A": {
            "top": 722,
            "bottom": 744,
            "left": 20,
            "right": 55,
            "width": 35,
            "height": 22
          },
          "5-12-A": {
            "top": 782,
            "bottom": 801,
            "left": 115,
            "right": 176,
            "width": 61,
            "height": 18
          },
          "5-13-A": {
            "top": 806,
            "bottom": 880,
            "left": 20,
            "right": 377,
            "width": 357,
            "height": 74
          },
          "5-14-A": {
            "top": 970,
            "bottom": 992,
            "left": 20,
            "right": 55,
            "width": 35,
            "height": 22
          },
          "5-15-A": {
            "top": 1030,
            "bottom": 1049,
            "left": 115,
            "right": 208,
            "width": 94,
            "height": 18
          },
          "5-16-A": {
            "top": 1054,
            "bottom": 1090,
            "left": 20,
            "right": 167,
            "width": 147,
            "height": 35
          },
          "5-17-A": {
            "top": 1205,
            "bottom": 1227,
            "left": 20,
            "right": 55,
            "width": 35,
            "height": 22
          },
          "5-18-A": {
            "top": 1276,
            "bottom": 1311,
            "left": 20,
            "right": 114,
            "width": 94,
            "height": 34
          },
          "5-19-A": {
            "top": 1276,
            "bottom": 1311,
            "left": 333,
            "right": 430,
            "width": 97,
            "height": 34
          },
          "5-20-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-21-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-22-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-23-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-24-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-25-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-26-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-27-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-28-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-29-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-30-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-31-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-32-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-33-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-34-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-35-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-36-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-37-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-38-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-39-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-40-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-41-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-42-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-43-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-44-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-45-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-46-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-47-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-48-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-49-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-50-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-51-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-52-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-53-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-54-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-55-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-56-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-57-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-58-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-59-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-60-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-61-LINK": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-62-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-63-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-64-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-65-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-66-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-67-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-68-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-69-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-70-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-71-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-72-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-73-META": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-74-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-75-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-76-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-77-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-78-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-79-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-80-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-81-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-82-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-83-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-84-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-85-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-86-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-87-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-88-SCRIPT": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-89-title": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "width": 0,
            "height": 0
          },
          "5-90-BODY": {
            "top": 0,
            "bottom": 1414,
            "left": 0,
            "right": 450,
            "width": 450,
            "height": 1414
          },
          "5-91-P": {
            "top": 164,
            "bottom": 215,
            "left": 20,
            "right": 430,
            "width": 410,
            "height": 51
          },
          "5-92-DIV": {
            "top": 445,
            "bottom": 467,
            "left": 20,
            "right": 430,
            "width": 410,
            "height": 22
          }
        }
      }
    },
    "script-treemap-data": {
      "id": "script-treemap-data",
      "title": "Script Treemap Data",
      "description": "Used for treemap app",
      "score": null,
      "scoreDisplayMode": "informative",
      "details": {
        "type": "treemap-data",
        "nodes": [{
          "name": "https://d13z.dev/",
          "resourceBytes": 2302
        }, {
          "name": "https://www.google-analytics.com/analytics.js",
          "resourceBytes": 49153,
          "unusedBytes": 16578
        }, {
          "name": "https://www.googletagmanager.com/gtag/js?id=UA-160638961-1",
          "resourceBytes": 90691,
          "unusedBytes": 44321
        }, {
          "name": "https://d13z.dev/polyfill-8ac9cd77b56094f58252.js",
          "resourceBytes": 49
        }, {
          "name": "https://d13z.dev/webpack-runtime-6ea73f4604adc4ed6f98.js",
          "resourceBytes": 5056,
          "unusedBytes": 1854,
          "children": [{
            "name": "webpack:/webpack/bootstrap",
            "resourceBytes": 4973,
            "unusedBytes": 1854
          }, {
            "name": "(unmapped)",
            "resourceBytes": 83
          }]
        }, {
          "name": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "resourceBytes": 182037,
          "unusedBytes": 181897,
          "children": [{
            "name": "webpack:/./node_modules/netlify-identity-widget/build/netlify-identity.js",
            "resourceBytes": 181902,
            "unusedBytes": 181897
          }, {
            "name": "(unmapped)",
            "resourceBytes": 135
          }]
        }, {
          "name": "https://d13z.dev/framework-a4620de0399b10c30110.js",
          "resourceBytes": 128788,
          "unusedBytes": 57088,
          "children": [{
            "name": "webpack:/./node_modules",
            "resourceBytes": 128374,
            "unusedBytes": 57088,
            "children": [{
              "name": "prop-types",
              "resourceBytes": 707,
              "unusedBytes": 295,
              "children": [{
                "name": "factoryWithThrowingShims.js",
                "resourceBytes": 626,
                "unusedBytes": 295
              }, {
                "name": "index.js",
                "resourceBytes": 23
              }, {
                "name": "lib/ReactPropTypesSecret.js",
                "resourceBytes": 58
              }]
            }, {
              "name": "react-dom",
              "resourceBytes": 121479,
              "children": [{
                "name": "node_modules/scheduler",
                "resourceBytes": 4599,
                "children": [{
                  "name": "index.js",
                  "resourceBytes": 21
                }, {
                  "name": "cjs/scheduler.production.min.js",
                  "resourceBytes": 4578,
                  "unusedBytes": 1195
                }],
                "unusedBytes": 1195
              }, {
                "name": "index.js",
                "resourceBytes": 229
              }, {
                "name": "cjs/react-dom.production.min.js",
                "resourceBytes": 116651,
                "unusedBytes": 54277
              }],
              "unusedBytes": 55472
            }, {
              "name": "react",
              "resourceBytes": 6188,
              "children": [{
                "name": "index.js",
                "resourceBytes": 21
              }, {
                "name": "cjs/react.production.min.js",
                "resourceBytes": 6167,
                "unusedBytes": 1321
              }],
              "unusedBytes": 1321
            }]
          }, {
            "name": "(unmapped)",
            "resourceBytes": 414
          }]
        }, {
          "name": "https://d13z.dev/styles-89fd2ae28bdf06750a71.js",
          "resourceBytes": 117,
          "unusedBytes": 0
        }, {
          "name": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "resourceBytes": 34069,
          "children": [{
            "name": "webpack:",
            "resourceBytes": 33245,
            "children": [{
              "name": ".",
              "resourceBytes": 33110,
              "children": [{
                "name": "src",
                "resourceBytes": 18124,
                "children": [{
                  "name": "utils",
                  "resourceBytes": 1283,
                  "children": [{
                    "name": "get-icon.js",
                    "resourceBytes": 557
                  }, {
                    "name": "get-contact-href.js",
                    "resourceBytes": 726
                  }]
                }, {
                  "name": "components/Layout",
                  "resourceBytes": 792,
                  "children": [{
                    "name": "Layout.module.scss",
                    "resourceBytes": 51
                  }, {
                    "name": "Layout.js",
                    "resourceBytes": 741
                  }]
                }, {
                  "name": "constants",
                  "resourceBytes": 15804,
                  "children": [{
                    "name": "icons.js",
                    "resourceBytes": 15761
                  }, {
                    "name": "pagination.js",
                    "resourceBytes": 43
                  }]
                }, {
                  "name": "hooks",
                  "resourceBytes": 245,
                  "children": [{
                    "name": "use-site-metadata.js",
                    "resourceBytes": 78
                  }, {
                    "name": "use-categories-list.js",
                    "resourceBytes": 83,
                    "unusedBytes": 80
                  }, {
                    "name": "use-tags-list.js",
                    "resourceBytes": 84,
                    "unusedBytes": 80
                  }],
                  "unusedBytes": 160
                }],
                "unusedBytes": 160
              }, {
                "name": "node_modules",
                "resourceBytes": 14986,
                "unusedBytes": 4957,
                "children": [{
                  "name": "react-side-effect/lib/index.js",
                  "resourceBytes": 1573,
                  "unusedBytes": 243
                }, {
                  "name": "react-fast-compare/index.js",
                  "resourceBytes": 1610,
                  "unusedBytes": 1459
                }, {
                  "name": "react-helmet/es/Helmet.js",
                  "resourceBytes": 11803,
                  "unusedBytes": 3255
                }]
              }],
              "unusedBytes": 5117
            }, {
              "name": "(webpack)/buildin/global.js",
              "resourceBytes": 135
            }],
            "unusedBytes": 5117
          }, {
            "name": "(unmapped)",
            "resourceBytes": 824,
            "unusedBytes": 40
          }],
          "unusedBytes": 5157
        }, {
          "name": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js",
          "resourceBytes": 59392,
          "unusedBytes": 36292,
          "children": [{
            "name": "webpack:",
            "resourceBytes": 59174,
            "unusedBytes": 36292,
            "children": [{
              "name": "(webpack)/buildin/module.js",
              "resourceBytes": 288,
              "unusedBytes": 56
            }, {
              "name": "./node_modules/moment/moment.js",
              "resourceBytes": 58886,
              "unusedBytes": 36236
            }]
          }, {
            "name": "(unmapped)",
            "resourceBytes": 218
          }]
        }, {
          "name": "https://d13z.dev/component---src-templates-index-template-js-4d46f19f2f19e46c23ae.js",
          "resourceBytes": 8407,
          "children": [{
            "name": "webpack:/.",
            "resourceBytes": 7326,
            "children": [{
              "name": "src",
              "resourceBytes": 6872,
              "children": [{
                "name": "components",
                "resourceBytes": 6245,
                "children": [{
                  "name": "Sidebar",
                  "resourceBytes": 2801,
                  "children": [{
                    "name": "Author",
                    "resourceBytes": 827,
                    "children": [{
                      "name": "Author.js",
                      "resourceBytes": 588
                    }, {
                      "name": "Author.module.scss",
                      "resourceBytes": 239
                    }]
                  }, {
                    "name": "Contacts",
                    "resourceBytes": 708,
                    "children": [{
                      "name": "Contacts.js",
                      "resourceBytes": 449
                    }, {
                      "name": "Contacts.module.scss",
                      "resourceBytes": 259
                    }]
                  }, {
                    "name": "Copyright",
                    "resourceBytes": 153,
                    "children": [{
                      "name": "Copyright.js",
                      "resourceBytes": 93
                    }, {
                      "name": "Copyright.module.scss",
                      "resourceBytes": 60
                    }]
                  }, {
                    "name": "Menu",
                    "resourceBytes": 660,
                    "children": [{
                      "name": "Menu.js",
                      "resourceBytes": 367
                    }, {
                      "name": "Menu.module.scss",
                      "resourceBytes": 293
                    }]
                  }, {
                    "name": "Sidebar.js",
                    "resourceBytes": 344
                  }, {
                    "name": "Sidebar.module.scss",
                    "resourceBytes": 109
                  }]
                }, {
                  "name": "Icon",
                  "resourceBytes": 224,
                  "children": [{
                    "name": "Icon.js",
                    "resourceBytes": 179
                  }, {
                    "name": "Icon.module.scss",
                    "resourceBytes": 45
                  }]
                }, {
                  "name": "Feed",
                  "resourceBytes": 1598,
                  "children": [{
                    "name": "Feed.module.scss",
                    "resourceBytes": 539
                  }, {
                    "name": "Feed.js",
                    "resourceBytes": 1059
                  }]
                }, {
                  "name": "Page",
                  "resourceBytes": 530,
                  "children": [{
                    "name": "Page.module.scss",
                    "resourceBytes": 181
                  }, {
                    "name": "Page.js",
                    "resourceBytes": 349
                  }]
                }, {
                  "name": "Pagination",
                  "resourceBytes": 1092,
                  "children": [{
                    "name": "Pagination.module.scss",
                    "resourceBytes": 519
                  }, {
                    "name": "Pagination.js",
                    "resourceBytes": 573
                  }]
                }]
              }, {
                "name": "templates/index-template.js",
                "resourceBytes": 627,
                "unusedBytes": 20
              }],
              "unusedBytes": 20
            }, {
              "name": "node_modules/classnames/bind.js",
              "resourceBytes": 454,
              "unusedBytes": 20
            }],
            "unusedBytes": 40
          }, {
            "name": "(unmapped)",
            "resourceBytes": 1081
          }],
          "unusedBytes": 40
        }, {
          "name": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "resourceBytes": 71956,
          "unusedBytes": 23670,
          "children": [{
            "name": "webpack:/.",
            "resourceBytes": 68945,
            "unusedBytes": 23630,
            "children": [{
              "name": "node_modules",
              "resourceBytes": 46160,
              "unusedBytes": 17826,
              "children": [{
                "name": "gatsby-link",
                "resourceBytes": 4434,
                "unusedBytes": 1098,
                "children": [{
                  "name": "index.js",
                  "resourceBytes": 4194,
                  "unusedBytes": 1098
                }, {
                  "name": "parse-path.js",
                  "resourceBytes": 240
                }]
              }, {
                "name": "gatsby-react-router-scroll",
                "resourceBytes": 4027,
                "children": [{
                  "name": "session-storage.js",
                  "resourceBytes": 730
                }, {
                  "name": "use-scroll-restoration.js",
                  "resourceBytes": 350,
                  "unusedBytes": 269
                }, {
                  "name": "index.js",
                  "resourceBytes": 243
                }, {
                  "name": "scroll-handler.js",
                  "resourceBytes": 1739,
                  "unusedBytes": 514
                }, {
                  "name": "scroll-container.js",
                  "resourceBytes": 965,
                  "unusedBytes": 536
                }],
                "unusedBytes": 1319
              }, {
                "name": "gatsby-plugin-netlify-cms/gatsby-browser.js",
                "resourceBytes": 572,
                "unusedBytes": 171
              }, {
                "name": "@babel/runtime",
                "resourceBytes": 2701,
                "children": [{
                  "name": "helpers",
                  "resourceBytes": 2680,
                  "children": [{
                    "name": "interopRequireWildcard.js",
                    "resourceBytes": 552
                  }, {
                    "name": "objectWithoutPropertiesLoose.js",
                    "resourceBytes": 144
                  }, {
                    "name": "assertThisInitialized.js",
                    "resourceBytes": 133
                  }, {
                    "name": "interopRequireDefault.js",
                    "resourceBytes": 61
                  }, {
                    "name": "inheritsLoose.js",
                    "resourceBytes": 105
                  }, {
                    "name": "typeof.js",
                    "resourceBytes": 264,
                    "unusedBytes": 112
                  }, {
                    "name": "esm",
                    "resourceBytes": 863,
                    "children": [{
                      "name": "inheritsLoose.js",
                      "resourceBytes": 130
                    }, {
                      "name": "arrayLikeToArray.js",
                      "resourceBytes": 106
                    }, {
                      "name": "toConsumableArray.js",
                      "resourceBytes": 39
                    }, {
                      "name": "arrayWithoutHoles.js",
                      "resourceBytes": 44
                    }, {
                      "name": "iterableToArray.js",
                      "resourceBytes": 93,
                      "unusedBytes": 93
                    }, {
                      "name": "unsupportedIterableToArray.js",
                      "resourceBytes": 284,
                      "unusedBytes": 284
                    }, {
                      "name": "nonIterableSpread.js",
                      "resourceBytes": 167,
                      "unusedBytes": 167
                    }],
                    "unusedBytes": 544
                  }, {
                    "name": "extends.js",
                    "resourceBytes": 231,
                    "unusedBytes": 146
                  }, {
                    "name": "asyncToGenerator.js",
                    "resourceBytes": 327,
                    "unusedBytes": 37
                  }],
                  "unusedBytes": 839
                }, {
                  "name": "regenerator/index.js",
                  "resourceBytes": 21
                }],
                "unusedBytes": 839
              }, {
                "name": "gatsby-plugin-google-gtag/gatsby-browser.js",
                "resourceBytes": 439,
                "unusedBytes": 38
              }, {
                "name": "mitt/dist/mitt.es.js",
                "resourceBytes": 266,
                "unusedBytes": 131
              }, {
                "name": "@reach/router/es",
                "resourceBytes": 15028,
                "unusedBytes": 6526,
                "children": [{
                  "name": "lib",
                  "resourceBytes": 4715,
                  "unusedBytes": 2364,
                  "children": [{
                    "name": "history.js",
                    "resourceBytes": 2253,
                    "unusedBytes": 1465
                  }, {
                    "name": "utils.js",
                    "resourceBytes": 2462,
                    "unusedBytes": 899
                  }]
                }, {
                  "name": "index.js",
                  "resourceBytes": 10313,
                  "unusedBytes": 4162
                }]
              }, {
                "name": "gatsby-plugin-manifest",
                "resourceBytes": 277,
                "unusedBytes": 192,
                "children": [{
                  "name": "get-manifest-pathname.js",
                  "resourceBytes": 237,
                  "unusedBytes": 192
                }, {
                  "name": "gatsby-browser.js",
                  "resourceBytes": 40
                }]
              }, {
                "name": "gatsby-plugin-catch-links",
                "resourceBytes": 2473,
                "unusedBytes": 1587,
                "children": [{
                  "name": "gatsby-browser.js",
                  "resourceBytes": 151,
                  "unusedBytes": 30
                }, {
                  "name": "catch-links.js",
                  "resourceBytes": 2322,
                  "unusedBytes": 1557
                }]
              }, {
                "name": "@mikaelkristiansson/domready/ready.js",
                "resourceBytes": 435,
                "unusedBytes": 80
              }, {
                "name": "invariant/browser.js",
                "resourceBytes": 347,
                "unusedBytes": 335
              }, {
                "name": "gatsby-plugin-web-vitals",
                "resourceBytes": 1794,
                "unusedBytes": 145,
                "children": [{
                  "name": "web-vitals.js",
                  "resourceBytes": 1432,
                  "unusedBytes": 145
                }, {
                  "name": "gatsby-browser.js",
                  "resourceBytes": 362
                }]
              }, {
                "name": "shallow-compare/es/index.js",
                "resourceBytes": 155,
                "unusedBytes": 151
              }, {
                "name": "gatsby-plugin-offline/gatsby-browser.js",
                "resourceBytes": 1411
              }, {
                "name": "gatsby-remark-autolink-headers/gatsby-browser.js",
                "resourceBytes": 722,
                "unusedBytes": 76
              }, {
                "name": "regenerator-runtime/runtime.js",
                "resourceBytes": 6490,
                "unusedBytes": 3700
              }, {
                "name": "gatsby-remark-images",
                "resourceBytes": 1049,
                "children": [{
                  "name": "constants.js",
                  "resourceBytes": 364
                }, {
                  "name": "gatsby-browser.js",
                  "resourceBytes": 685,
                  "unusedBytes": 461
                }],
                "unusedBytes": 461
              }, {
                "name": "escape-string-regexp/index.js",
                "resourceBytes": 142,
                "unusedBytes": 102
              }, {
                "name": "web-vitals/dist/web-vitals.es5.min.js",
                "resourceBytes": 3398,
                "unusedBytes": 875
              }]
            }, {
              "name": ".cache",
              "resourceBytes": 22764,
              "children": [{
                "name": "normalize-page-path.js",
                "resourceBytes": 90
              }, {
                "name": "find-path.js",
                "resourceBytes": 790,
                "unusedBytes": 130
              }, {
                "name": "emitter.js",
                "resourceBytes": 12
              }, {
                "name": "polyfills/object-assign.js",
                "resourceBytes": 25
              }, {
                "name": "react-lifecycles-compat.js",
                "resourceBytes": 34
              }, {
                "name": "page-renderer.js",
                "resourceBytes": 588,
                "unusedBytes": 45
              }, {
                "name": "api-runner-browser-plugins.js",
                "resourceBytes": 953
              }, {
                "name": "register-service-worker.js",
                "resourceBytes": 1213,
                "unusedBytes": 73
              }, {
                "name": "_this_is_virtual_fs_path_/$virtual/async-requires.js",
                "resourceBytes": 1215,
                "unusedBytes": 655
              }, {
                "name": "route-announcer-props.js",
                "resourceBytes": 203
              }, {
                "name": "navigation.js",
                "resourceBytes": 2944,
                "unusedBytes": 2015
              }, {
                "name": "ensure-resources.js",
                "resourceBytes": 1128,
                "unusedBytes": 639
              }, {
                "name": "production-app.js",
                "resourceBytes": 2496,
                "unusedBytes": 37
              }, {
                "name": "gatsby-browser-entry.js",
                "resourceBytes": 2325,
                "unusedBytes": 1106
              }, {
                "name": "strip-prefix.js",
                "resourceBytes": 131
              }, {
                "name": "prefetch.js",
                "resourceBytes": 883,
                "unusedBytes": 162
              }, {
                "name": "loader.js",
                "resourceBytes": 6727,
                "unusedBytes": 788
              }, {
                "name": "public-page-renderer.js",
                "resourceBytes": 45
              }, {
                "name": "create-react-context.js",
                "resourceBytes": 59
              }, {
                "name": "public-page-renderer-prod.js",
                "resourceBytes": 222,
                "unusedBytes": 154
              }, {
                "name": "api-runner-browser.js",
                "resourceBytes": 681
              }],
              "unusedBytes": 5804
            }, {
              "name": "gatsby-browser.js",
              "resourceBytes": 21
            }]
          }, {
            "name": "(unmapped)",
            "resourceBytes": 3011,
            "unusedBytes": 40
          }]
        }]
      }
    },
    "pwa-cross-browser": {
      "id": "pwa-cross-browser",
      "title": "Site works cross-browser",
      "description": "To reach the most number of users, sites should work across every major browser. [Learn more](https://web.dev/pwa-cross-browser/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "pwa-page-transitions": {
      "id": "pwa-page-transitions",
      "title": "Page transitions don't feel like they block on the network",
      "description": "Transitions should feel snappy as you tap around, even on a slow network. This experience is key to a user's perception of performance. [Learn more](https://web.dev/pwa-page-transitions/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "pwa-each-page-has-url": {
      "id": "pwa-each-page-has-url",
      "title": "Each page has a URL",
      "description": "Ensure individual pages are deep linkable via URL and that URLs are unique for the purpose of shareability on social media. [Learn more](https://web.dev/pwa-each-page-has-url/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "accesskeys": {
      "id": "accesskeys",
      "title": "`[accesskey]` values are unique",
      "description": "Access keys let users quickly focus a part of the page. For proper navigation, each access key must be unique. [Learn more](https://web.dev/accesskeys/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-allowed-attr": {
      "id": "aria-allowed-attr",
      "title": "`[aria-*]` attributes match their roles",
      "description": "Each ARIA `role` supports a specific subset of `aria-*` attributes. Mismatching these invalidates the `aria-*` attributes. [Learn more](https://web.dev/aria-allowed-attr/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "aria-command-name": {
      "id": "aria-command-name",
      "title": "`button`, `link`, and `menuitem` elements have accessible names",
      "description": "When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-hidden-body": {
      "id": "aria-hidden-body",
      "title": "`[aria-hidden=\"true\"]` is not present on the document `<body>`",
      "description": "Assistive technologies, like screen readers, work inconsistently when `aria-hidden=\"true\"` is set on the document `<body>`. [Learn more](https://web.dev/aria-hidden-body/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "aria-hidden-focus": {
      "id": "aria-hidden-focus",
      "title": "`[aria-hidden=\"true\"]` elements do not contain focusable descendents",
      "description": "Focusable descendents within an `[aria-hidden=\"true\"]` element prevent those interactive elements from being available to users of assistive technologies like screen readers. [Learn more](https://web.dev/aria-hidden-focus/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-input-field-name": {
      "id": "aria-input-field-name",
      "title": "ARIA input fields have accessible names",
      "description": "When an input field doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-meter-name": {
      "id": "aria-meter-name",
      "title": "ARIA `meter` elements have accessible names",
      "description": "When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-progressbar-name": {
      "id": "aria-progressbar-name",
      "title": "ARIA `progressbar` elements have accessible names",
      "description": "When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-required-attr": {
      "id": "aria-required-attr",
      "title": "`[role]`s have all required `[aria-*]` attributes",
      "description": "Some ARIA roles have required attributes that describe the state of the element to screen readers. [Learn more](https://web.dev/aria-required-attr/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-required-children": {
      "id": "aria-required-children",
      "title": "Elements with an ARIA `[role]` that require children to contain a specific `[role]` have all required children.",
      "description": "Some ARIA parent roles must contain specific child roles to perform their intended accessibility functions. [Learn more](https://web.dev/aria-required-children/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-required-parent": {
      "id": "aria-required-parent",
      "title": "`[role]`s are contained by their required parent element",
      "description": "Some ARIA child roles must be contained by specific parent roles to properly perform their intended accessibility functions. [Learn more](https://web.dev/aria-required-parent/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-roles": {
      "id": "aria-roles",
      "title": "`[role]` values are valid",
      "description": "ARIA roles must have valid values in order to perform their intended accessibility functions. [Learn more](https://web.dev/aria-roles/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-toggle-field-name": {
      "id": "aria-toggle-field-name",
      "title": "ARIA toggle fields have accessible names",
      "description": "When a toggle field doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-tooltip-name": {
      "id": "aria-tooltip-name",
      "title": "ARIA `tooltip` elements have accessible names",
      "description": "When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-treeitem-name": {
      "id": "aria-treeitem-name",
      "title": "ARIA `treeitem` elements have accessible names",
      "description": "When an element doesn't have an accessible name, screen readers announce it with a generic name, making it unusable for users who rely on screen readers. [Learn more](https://web.dev/aria-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "aria-valid-attr-value": {
      "id": "aria-valid-attr-value",
      "title": "`[aria-*]` attributes have valid values",
      "description": "Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid values. [Learn more](https://web.dev/aria-valid-attr-value/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "aria-valid-attr": {
      "id": "aria-valid-attr",
      "title": "`[aria-*]` attributes are valid and not misspelled",
      "description": "Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid names. [Learn more](https://web.dev/aria-valid-attr/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "button-name": {
      "id": "button-name",
      "title": "Buttons have an accessible name",
      "description": "When a button doesn't have an accessible name, screen readers announce it as \"button\", making it unusable for users who rely on screen readers. [Learn more](https://web.dev/button-name/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "bypass": {
      "id": "bypass",
      "title": "The page contains a heading, skip link, or landmark region",
      "description": "Adding ways to bypass repetitive content lets keyboard users navigate the page more efficiently. [Learn more](https://web.dev/bypass/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "color-contrast": {
      "id": "color-contrast",
      "title": "Background and foreground colors do not have a sufficient contrast ratio.",
      "description": "Low-contrast text is difficult or impossible for many users to read. [Learn more](https://web.dev/color-contrast/).",
      "score": 0,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [{
          "key": "node",
          "itemType": "node",
          "text": "Failing Elements"
        }],
        "items": [{
          "node": {
            "type": "node",
            "lhId": "5-91-P",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,P",
            "selector": "div.Sidebar-module--sidebar--X4z2p > div.Sidebar-module--sidebar__inner--Jdc5s > div > p.Author-module--author__subtitle--cAaEB",
            "boundingRect": {
              "top": 164,
              "bottom": 241,
              "left": 20,
              "right": 340,
              "width": 320,
              "height": 77
            },
            "snippet": "<p class=\"Author-module--author__subtitle--cAaEB\">",
            "nodeLabel": "My personal thoughts about software development and performance on the software…",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 3.54 (foreground color: #888888, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-92-DIV",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,3,DIV",
            "selector": "div.Layout-module--layout--3Pyz6 > div.Sidebar-module--sidebar--X4z2p > div.Sidebar-module--sidebar__inner--Jdc5s > div.Copyright-module--copyright--1ariN",
            "boundingRect": {
              "top": 470,
              "bottom": 493,
              "left": 20,
              "right": 340,
              "width": 320,
              "height": 22
            },
            "snippet": "<div class=\"Copyright-module--copyright--1ariN\">",
            "nodeLabel": "© All rights reserved.",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.02 (foreground color: #b6b6b6, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-9-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": 522,
              "bottom": 540,
              "left": 102,
              "right": 148,
              "width": 45,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/debug/\">",
            "nodeLabel": "DEBUG",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.08 (foreground color: #f7a046, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-11-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,3,A",
            "selector": "div.Page-module--page__body--Ic6i6 > div > div.Feed-module--feed__item--2D5rE > a.Feed-module--feed__item-readmore--1u6bI",
            "boundingRect": {
              "top": 748,
              "bottom": 769,
              "left": 20,
              "right": 55,
              "width": 35,
              "height": 22
            },
            "snippet": "<a class=\"Feed-module--feed__item-readmore--1u6bI\" href=\"/posts/debugging-development-performance-nextjs\">",
            "nodeLabel": "Read",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.96 (foreground color: #5d93ff, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-12-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": 808,
              "bottom": 826,
              "left": 115,
              "right": 176,
              "width": 61,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/growth/\">",
            "nodeLabel": "GROWTH",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.08 (foreground color: #f7a046, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-14-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,3,A",
            "selector": "div.Page-module--page__body--Ic6i6 > div > div.Feed-module--feed__item--2D5rE > a.Feed-module--feed__item-readmore--1u6bI",
            "boundingRect": {
              "top": 1034,
              "bottom": 1056,
              "left": 20,
              "right": 55,
              "width": 35,
              "height": 22
            },
            "snippet": "<a class=\"Feed-module--feed__item-readmore--1u6bI\" href=\"/posts/When-can-I-consider-myself-a-good-software-developer\">",
            "nodeLabel": "Read",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.96 (foreground color: #5d93ff, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-15-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": 1094,
              "bottom": 1113,
              "left": 115,
              "right": 208,
              "width": 94,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/unclassified/\">",
            "nodeLabel": "UNCLASSIFIED",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.08 (foreground color: #f7a046, background color: #ffffff, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-17-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,3,A",
            "selector": "div.Page-module--page__body--Ic6i6 > div > div.Feed-module--feed__item--2D5rE > a.Feed-module--feed__item-readmore--1u6bI",
            "boundingRect": {
              "top": 1269,
              "bottom": 1291,
              "left": 20,
              "right": 55,
              "width": 35,
              "height": 22
            },
            "snippet": "<a class=\"Feed-module--feed__item-readmore--1u6bI\" href=\"/posts/hello-world\">",
            "nodeLabel": "Read",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 2.96 (foreground color: #5d93ff, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-18-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,A",
            "selector": "div.Page-module--page__body--Ic6i6 > div.Pagination-module--pagination--2H3nO > div.Pagination-module--pagination__prev--bet5s > a.Pagination-module--pagination__prev-link--1Nzs6",
            "boundingRect": {
              "top": 1340,
              "bottom": 1375,
              "left": 20,
              "right": 114,
              "width": 94,
              "height": 34
            },
            "snippet": "<a aria-current=\"page\" rel=\"prev\" class=\"Pagination-module--pagination__prev-link--1Nzs6 Pagination-module--paginat…\" href=\"/\">",
            "nodeLabel": "← PREV",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 1.91 (foreground color: #bbbbbb, background color: #ffffff, font size: 19.5pt (26px), font weight: bold). Expected contrast ratio of 3:1"
          }
        }, {
          "node": {
            "type": "node",
            "lhId": "5-19-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,A",
            "selector": "div.Page-module--page__body--Ic6i6 > div.Pagination-module--pagination--2H3nO > div.Pagination-module--pagination__next--3hFiN > a.Pagination-module--pagination__next-link--3FUtA",
            "boundingRect": {
              "top": 1340,
              "bottom": 1375,
              "left": 243,
              "right": 340,
              "width": 97,
              "height": 34
            },
            "snippet": "<a aria-current=\"page\" rel=\"next\" class=\"Pagination-module--pagination__next-link--3FUtA Pagination-module--paginat…\" href=\"/\">",
            "nodeLabel": "→ NEXT",
            "explanation": "Fix any of the following:\n  Element has insufficient color contrast of 1.91 (foreground color: #bbbbbb, background color: #ffffff, font size: 19.5pt (26px), font weight: bold). Expected contrast ratio of 3:1"
          }
        }],
        "debugData": {
          "type": "debugdata",
          "impact": "serious",
          "tags": ["cat.color", "wcag2aa", "wcag143"]
        }
      }
    },
    "definition-list": {
      "id": "definition-list",
      "title": "`<dl>`'s contain only properly-ordered `<dt>` and `<dd>` groups, `<script>`, `<template>` or `<div>` elements.",
      "description": "When definition lists are not properly marked up, screen readers may produce confusing or inaccurate output. [Learn more](https://web.dev/definition-list/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "dlitem": {
      "id": "dlitem",
      "title": "Definition list items are wrapped in `<dl>` elements",
      "description": "Definition list items (`<dt>` and `<dd>`) must be wrapped in a parent `<dl>` element to ensure that screen readers can properly announce them. [Learn more](https://web.dev/dlitem/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "document-title": {
      "id": "document-title",
      "title": "Document has a `<title>` element",
      "description": "The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more](https://web.dev/document-title/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "duplicate-id-active": {
      "id": "duplicate-id-active",
      "title": "`[id]` attributes on active, focusable elements are unique",
      "description": "All focusable elements must have a unique `id` to ensure that they're visible to assistive technologies. [Learn more](https://web.dev/duplicate-id-active/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "duplicate-id-aria": {
      "id": "duplicate-id-aria",
      "title": "ARIA IDs are unique",
      "description": "The value of an ARIA ID must be unique to prevent other instances from being overlooked by assistive technologies. [Learn more](https://web.dev/duplicate-id-aria/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "form-field-multiple-labels": {
      "id": "form-field-multiple-labels",
      "title": "No form fields have multiple labels",
      "description": "Form fields with multiple labels can be confusingly announced by assistive technologies like screen readers which use either the first, the last, or all of the labels. [Learn more](https://web.dev/form-field-multiple-labels/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "frame-title": {
      "id": "frame-title",
      "title": "`<frame>` or `<iframe>` elements have a title",
      "description": "Screen reader users rely on frame titles to describe the contents of frames. [Learn more](https://web.dev/frame-title/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "heading-order": {
      "id": "heading-order",
      "title": "Heading elements appear in a sequentially-descending order",
      "description": "Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more](https://web.dev/heading-order/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "html-has-lang": {
      "id": "html-has-lang",
      "title": "`<html>` element has a `[lang]` attribute",
      "description": "If a page doesn't specify a lang attribute, a screen reader assumes that the page is in the default language that the user chose when setting up the screen reader. If the page isn't actually in the default language, then the screen reader might not announce the page's text correctly. [Learn more](https://web.dev/html-has-lang/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "html-lang-valid": {
      "id": "html-lang-valid",
      "title": "`<html>` element has a valid value for its `[lang]` attribute",
      "description": "Specifying a valid [BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question) helps screen readers announce text properly. [Learn more](https://web.dev/html-lang-valid/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "image-alt": {
      "id": "image-alt",
      "title": "Image elements have `[alt]` attributes",
      "description": "Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute. [Learn more](https://web.dev/image-alt/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "input-image-alt": {
      "id": "input-image-alt",
      "title": "`<input type=\"image\">` elements have `[alt]` text",
      "description": "When an image is being used as an `<input>` button, providing alternative text can help screen reader users understand the purpose of the button. [Learn more](https://web.dev/input-image-alt/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "label": {
      "id": "label",
      "title": "Form elements have associated labels",
      "description": "Labels ensure that form controls are announced properly by assistive technologies, like screen readers. [Learn more](https://web.dev/label/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "link-name": {
      "id": "link-name",
      "title": "Links have a discernible name",
      "description": "Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users. [Learn more](https://web.dev/link-name/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "list": {
      "id": "list",
      "title": "Lists contain only `<li>` elements and script supporting elements (`<script>` and `<template>`).",
      "description": "Screen readers have a specific way of announcing lists. Ensuring proper list structure aids screen reader output. [Learn more](https://web.dev/list/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "listitem": {
      "id": "listitem",
      "title": "List items (`<li>`) are contained within `<ul>` or `<ol>` parent elements",
      "description": "Screen readers require list items (`<li>`) to be contained within a parent `<ul>` or `<ol>` to be announced properly. [Learn more](https://web.dev/listitem/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "meta-refresh": {
      "id": "meta-refresh",
      "title": "The document does not use `<meta http-equiv=\"refresh\">`",
      "description": "Users do not expect a page to refresh automatically, and doing so will move focus back to the top of the page. This may create a frustrating or confusing experience. [Learn more](https://web.dev/meta-refresh/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "meta-viewport": {
      "id": "meta-viewport",
      "title": "`[user-scalable=\"no\"]` is not used in the `<meta name=\"viewport\">` element and the `[maximum-scale]` attribute is not less than 5.",
      "description": "Disabling zooming is problematic for users with low vision who rely on screen magnification to properly see the contents of a web page. [Learn more](https://web.dev/meta-viewport/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "object-alt": {
      "id": "object-alt",
      "title": "`<object>` elements have `[alt]` text",
      "description": "Screen readers cannot translate non-text content. Adding alt text to `<object>` elements helps screen readers convey meaning to users. [Learn more](https://web.dev/object-alt/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "tabindex": {
      "id": "tabindex",
      "title": "No element has a `[tabindex]` value greater than 0",
      "description": "A value greater than 0 implies an explicit navigation ordering. Although technically valid, this often creates frustrating experiences for users who rely on assistive technologies. [Learn more](https://web.dev/tabindex/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "td-headers-attr": {
      "id": "td-headers-attr",
      "title": "Cells in a `<table>` element that use the `[headers]` attribute refer to table cells within the same table.",
      "description": "Screen readers have features to make navigating tables easier. Ensuring `<td>` cells using the `[headers]` attribute only refer to other cells in the same table may improve the experience for screen reader users. [Learn more](https://web.dev/td-headers-attr/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "th-has-data-cells": {
      "id": "th-has-data-cells",
      "title": "`<th>` elements and elements with `[role=\"columnheader\"/\"rowheader\"]` have data cells they describe.",
      "description": "Screen readers have features to make navigating tables easier. Ensuring table headers always refer to some set of cells may improve the experience for screen reader users. [Learn more](https://web.dev/th-has-data-cells/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "valid-lang": {
      "id": "valid-lang",
      "title": "`[lang]` attributes have a valid value",
      "description": "Specifying a valid [BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question) on elements helps ensure that text is pronounced correctly by a screen reader. [Learn more](https://web.dev/valid-lang/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "video-caption": {
      "id": "video-caption",
      "title": "`<video>` elements contain a `<track>` element with `[kind=\"captions\"]`",
      "description": "When a video provides a caption it is easier for deaf and hearing impaired users to access its information. [Learn more](https://web.dev/video-caption/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "custom-controls-labels": {
      "id": "custom-controls-labels",
      "title": "Custom controls have associated labels",
      "description": "Custom interactive controls have associated labels, provided by aria-label or aria-labelledby. [Learn more](https://web.dev/custom-controls-labels/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "custom-controls-roles": {
      "id": "custom-controls-roles",
      "title": "Custom controls have ARIA roles",
      "description": "Custom interactive controls have appropriate ARIA roles. [Learn more](https://web.dev/custom-control-roles/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "focus-traps": {
      "id": "focus-traps",
      "title": "User focus is not accidentally trapped in a region",
      "description": "A user can tab into and out of any control or region without accidentally trapping their focus. [Learn more](https://web.dev/focus-traps/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "focusable-controls": {
      "id": "focusable-controls",
      "title": "Interactive controls are keyboard focusable",
      "description": "Custom interactive controls are keyboard focusable and display a focus indicator. [Learn more](https://web.dev/focusable-controls/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "interactive-element-affordance": {
      "id": "interactive-element-affordance",
      "title": "Interactive elements indicate their purpose and state",
      "description": "Interactive elements, such as links and buttons, should indicate their state and be distinguishable from non-interactive elements. [Learn more](https://web.dev/interactive-element-affordance/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "logical-tab-order": {
      "id": "logical-tab-order",
      "title": "The page has a logical tab order",
      "description": "Tabbing through the page follows the visual layout. Users cannot focus elements that are offscreen. [Learn more](https://web.dev/logical-tab-order/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "managed-focus": {
      "id": "managed-focus",
      "title": "The user's focus is directed to new content added to the page",
      "description": "If new content, such as a dialog, is added to the page, the user's focus is directed to it. [Learn more](https://web.dev/managed-focus/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "offscreen-content-hidden": {
      "id": "offscreen-content-hidden",
      "title": "Offscreen content is hidden from assistive technology",
      "description": "Offscreen content is hidden with display: none or aria-hidden=true. [Learn more](https://web.dev/offscreen-content-hidden/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "use-landmarks": {
      "id": "use-landmarks",
      "title": "HTML5 landmark elements are used to improve navigation",
      "description": "Landmark elements (<main>, <nav>, etc.) are used to improve the keyboard navigation of the page for assistive technology. [Learn more](https://web.dev/use-landmarks/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "visual-order-follows-dom": {
      "id": "visual-order-follows-dom",
      "title": "Visual order on the page follows DOM order",
      "description": "DOM order matches the visual order, improving navigation for assistive technology. [Learn more](https://web.dev/visual-order-follows-dom/).",
      "score": null,
      "scoreDisplayMode": "manual"
    },
    "uses-long-cache-ttl": {
      "id": "uses-long-cache-ttl",
      "title": "Uses efficient cache policy on static assets",
      "description": "A long cache lifetime can speed up repeat visits to your page. [Learn more](https://web.dev/uses-long-cache-ttl/).",
      "score": 0.97,
      "scoreDisplayMode": "numeric",
      "numericValue": 14977.5,
      "numericUnit": "byte",
      "displayValue": "1 resource found",
      "details": {
        "type": "table",
        "headings": [{
          "key": "url",
          "itemType": "url",
          "text": "URL"
        }, {
          "key": "cacheLifetimeMs",
          "itemType": "ms",
          "text": "Cache TTL",
          "displayUnit": "duration"
        }, {
          "key": "totalBytes",
          "itemType": "bytes",
          "text": "Transfer Size",
          "displayUnit": "kb",
          "granularity": 1
        }],
        "items": [{
          "url": "https://www.google-analytics.com/analytics.js",
          "debugData": {
            "type": "debugdata",
            "public": true,
            "max-age": 7200
          },
          "cacheLifetimeMs": 7200000,
          "cacheHitProbability": 0.25,
          "totalBytes": 19970,
          "wastedBytes": 14977.5
        }],
        "summary": {
          "wastedBytes": 14977.5
        }
      }
    },
    "total-byte-weight": {
      "id": "total-byte-weight",
      "title": "Avoids enormous network payloads",
      "description": "Large network payloads cost users real money and are highly correlated with long load times. [Learn more](https://web.dev/total-byte-weight/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 316597,
      "numericUnit": "byte",
      "displayValue": "Total size was 309 KiB",
      "details": {
        "type": "table",
        "headings": [{
          "key": "url",
          "itemType": "url",
          "text": "URL"
        }, {
          "key": "totalBytes",
          "itemType": "bytes",
          "text": "Transfer Size"
        }],
        "items": [{
          "url": "https://d13z.dev/icons/icon-144x144.png?v=d9a5c3f8aefa0b524df411159e2d27d7",
          "totalBytes": 50822
        }, {
          "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "totalBytes": 50622
        }, {
          "url": "https://d13z.dev/framework-a4620de0399b10c30110.js",
          "totalBytes": 38841
        }, {
          "url": "https://www.googletagmanager.com/gtag/js?id=UA-160638961-1",
          "totalBytes": 36449
        }, {
          "url": "https://d13z.dev/media/photo.jpg",
          "totalBytes": 30824
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "totalBytes": 21360
        }, {
          "url": "https://www.google-analytics.com/analytics.js",
          "totalBytes": 19970
        }, {
          "url": "https://d13z.dev/643651a62fb35a9bb4f20061cb1f214a352d7976-12cd6796cf0ce7e3f3f5.js",
          "totalBytes": 18447
        }, {
          "url": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "totalBytes": 12088
        }, {
          "url": "https://d13z.dev/",
          "totalBytes": 8974
        }]
      }
    },
    "offscreen-images": {
      "id": "offscreen-images",
      "title": "Defer offscreen images",
      "description": "Consider lazy-loading offscreen and hidden images after all critical resources have finished loading to lower time to interactive. [Learn more](https://web.dev/offscreen-images/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": [],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "render-blocking-resources": {
      "id": "render-blocking-resources",
      "title": "Eliminate render-blocking resources",
      "description": "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn more](https://web.dev/render-blocking-resources/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "unminified-css": {
      "id": "unminified-css",
      "title": "Minify CSS",
      "description": "Minifying CSS files can reduce network payload sizes. [Learn more](https://web.dev/unminified-css/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "unminified-javascript": {
      "id": "unminified-javascript",
      "title": "Minify JavaScript",
      "description": "Minifying JavaScript files can reduce payload sizes and script parse time. [Learn more](https://web.dev/unminified-javascript/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": [],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "unused-css-rules": {
      "id": "unused-css-rules",
      "title": "Reduce unused CSS",
      "description": "Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content to decrease bytes consumed by network activity. [Learn more](https://web.dev/unused-css-rules/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "unused-javascript": {
      "id": "unused-javascript",
      "title": "Reduce unused JavaScript",
      "description": "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn more](https://web.dev/unused-javascript/).",
      "score": 0.84,
      "scoreDisplayMode": "numeric",
      "numericValue": 190,
      "numericUnit": "millisecond",
      "displayValue": "Potential savings of 49 KiB",
      "details": {
        "type": "opportunity",
        "headings": [{
          "key": "url",
          "valueType": "url",
          "subItemsHeading": {
            "key": "source",
            "valueType": "code"
          },
          "label": "URL"
        }, {
          "key": "totalBytes",
          "valueType": "bytes",
          "subItemsHeading": {
            "key": "sourceBytes"
          },
          "label": "Transfer Size"
        }, {
          "key": "wastedBytes",
          "valueType": "bytes",
          "subItemsHeading": {
            "key": "sourceWastedBytes"
          },
          "label": "Potential Savings"
        }],
        "items": [{
          "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "totalBytes": 50622,
          "wastedBytes": 50588,
          "wastedPercent": 99.93188198003703,
          "subItems": {
            "type": "subitems",
            "items": [{
              "source": "…",
              "sourceBytes": 50584,
              "sourceWastedBytes": 50583
            }]
          }
        }],
        "overallSavingsMs": 190,
        "overallSavingsBytes": 50588
      }
    },
    "modern-image-formats": {
      "id": "modern-image-formats",
      "title": "Serve images in next-gen formats",
      "description": "Image formats like JPEG 2000, JPEG XR, and WebP often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. [Learn more](https://web.dev/uses-webp-images/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": [],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "uses-optimized-images": {
      "id": "uses-optimized-images",
      "title": "Efficiently encode images",
      "description": "Optimized images load faster and consume less cellular data. [Learn more](https://web.dev/uses-optimized-images/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "warnings": [],
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "uses-text-compression": {
      "id": "uses-text-compression",
      "title": "Enable text compression",
      "description": "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes. [Learn more](https://web.dev/uses-text-compression/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "uses-responsive-images": {
      "id": "uses-responsive-images",
      "title": "Properly size images",
      "description": "Serve images that are appropriately-sized to save cellular data and improve load time. [Learn more](https://web.dev/uses-responsive-images/).",
      "score": 0.85,
      "scoreDisplayMode": "numeric",
      "numericValue": 180,
      "numericUnit": "millisecond",
      "displayValue": "Potential savings of 24 KiB",
      "details": {
        "type": "opportunity",
        "headings": [{
          "key": "url",
          "valueType": "thumbnail",
          "label": ""
        }, {
          "key": "url",
          "valueType": "url",
          "label": "URL"
        }, {
          "key": "totalBytes",
          "valueType": "bytes",
          "label": "Resource Size"
        }, {
          "key": "wastedBytes",
          "valueType": "bytes",
          "label": "Potential Savings"
        }],
        "items": [{
          "url": "https://d13z.dev/media/photo.jpg",
          "totalBytes": 30687,
          "wastedBytes": 25066,
          "wastedPercent": 81.68253208667262
        }],
        "overallSavingsMs": 180,
        "overallSavingsBytes": 25066
      }
    },
    "efficient-animated-content": {
      "id": "efficient-animated-content",
      "title": "Use video formats for animated content",
      "description": "Large GIFs are inefficient for delivering animated content. Consider using MPEG4/WebM videos for animations and PNG/WebP for static images instead of GIF to save network bytes. [Learn more](https://web.dev/efficient-animated-content/)",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "duplicated-javascript": {
      "id": "duplicated-javascript",
      "title": "Remove duplicate modules in JavaScript bundles",
      "description": "Remove large, duplicate JavaScript modules from bundles to reduce unnecessary bytes consumed by network activity. ",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 0
      }
    },
    "legacy-javascript": {
      "id": "legacy-javascript",
      "title": "Avoid serving legacy JavaScript to modern browsers",
      "description": "Polyfills and transforms enable legacy browsers to use new JavaScript features. However, many aren't necessary for modern browsers. For your bundled JavaScript, adopt a modern script deployment strategy using module/nomodule feature detection to reduce the amount of code shipped to modern browsers, while retaining support for legacy browsers. [Learn More](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "displayValue": "Potential savings of 0 KiB",
      "details": {
        "type": "opportunity",
        "headings": [{
          "key": "url",
          "valueType": "url",
          "subItemsHeading": {
            "key": "location",
            "valueType": "source-location"
          },
          "label": "URL"
        }, {
          "key": null,
          "valueType": "code",
          "subItemsHeading": {
            "key": "signal"
          },
          "label": ""
        }, {
          "key": "wastedBytes",
          "valueType": "bytes",
          "label": "Potential Savings"
        }],
        "items": [{
          "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
          "wastedBytes": 117,
          "subItems": {
            "type": "subitems",
            "items": [{
              "signal": "@babel/plugin-transform-classes",
              "location": {
                "type": "source-location",
                "url": "https://d13z.dev/532a2f07-36c395669df4dc0275d8.js",
                "line": 0,
                "column": 69429,
                "original": {
                  "file": "webpack:///./node_modules/netlify-identity-widget/build/netlify-identity.js",
                  "line": 2887,
                  "column": 49
                },
                "urlProvider": "network"
              }
            }]
          },
          "totalBytes": 0
        }, {
          "url": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
          "wastedBytes": 59,
          "subItems": {
            "type": "subitems",
            "items": [{
              "signal": "@babel/plugin-transform-classes",
              "location": {
                "type": "source-location",
                "url": "https://d13z.dev/cd95ea5cbd2c605f26db819f07999610c9ff4310-f9c25b30e3b79bee154c.js",
                "line": 0,
                "column": 23143,
                "original": {
                  "file": "webpack:///./node_modules/react-helmet/es/Helmet.js",
                  "line": 70,
                  "column": 24
                },
                "urlProvider": "network"
              }
            }]
          },
          "totalBytes": 0
        }, {
          "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
          "wastedBytes": 50,
          "subItems": {
            "type": "subitems",
            "items": [{
              "signal": "@babel/plugin-transform-classes",
              "location": {
                "type": "source-location",
                "url": "https://d13z.dev/app-a148ef82b0ce5f51ec63.js",
                "line": 0,
                "column": 34239,
                "original": {
                  "file": "webpack:///./node_modules/@reach/router/es/index.js",
                  "line": 4,
                  "column": 112
                },
                "urlProvider": "network"
              }
            }]
          },
          "totalBytes": 0
        }],
        "overallSavingsMs": 0,
        "overallSavingsBytes": 226
      }
    },
    "appcache-manifest": {
      "id": "appcache-manifest",
      "title": "Avoids Application Cache",
      "description": "Application Cache is deprecated. [Learn more](https://web.dev/appcache-manifest/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "doctype": {
      "id": "doctype",
      "title": "Page has the HTML doctype",
      "description": "Specifying a doctype prevents the browser from switching to quirks-mode. [Learn more](https://web.dev/doctype/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "charset": {
      "id": "charset",
      "title": "Properly defines charset",
      "description": "A character encoding declaration is required. It can be done with a `<meta>` tag in the first 1024 bytes of the HTML or in the Content-Type HTTP response header. [Learn more](https://web.dev/charset/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "dom-size": {
      "id": "dom-size",
      "title": "Avoids an excessive DOM size",
      "description": "A large DOM will increase memory usage, cause longer [style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations), and produce costly [layout reflows](https://developers.google.com/speed/articles/reflow). [Learn more](https://web.dev/dom-size/).",
      "score": 1,
      "scoreDisplayMode": "numeric",
      "numericValue": 96,
      "numericUnit": "element",
      "displayValue": "96 elements",
      "details": {
        "type": "table",
        "headings": [{
          "key": "statistic",
          "itemType": "text",
          "text": "Statistic"
        }, {
          "key": "node",
          "itemType": "node",
          "text": "Element"
        }, {
          "key": "value",
          "itemType": "numeric",
          "text": "Value"
        }],
        "items": [{
          "statistic": "Total DOM Elements",
          "value": 96
        }, {
          "node": {
            "type": "node",
            "lhId": "5-89-title",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,UL,0,LI,0,A,0,svg,0,title",
            "selector": "li.Contacts-module--contacts__list-item--16p9q > a.Contacts-module--contacts__list-item-link--2MIDn > svg.Icon-module--icon--Gpyvw > title",
            "boundingRect": {
              "top": 0,
              "bottom": 0,
              "left": 0,
              "right": 0,
              "width": 0,
              "height": 0
            },
            "snippet": "<title>",
            "nodeLabel": "title"
          },
          "statistic": "Maximum DOM Depth",
          "value": 12
        }, {
          "node": {
            "type": "node",
            "lhId": "5-90-BODY",
            "path": "1,HTML,1,BODY",
            "selector": "body",
            "boundingRect": {
              "top": -492,
              "bottom": 986,
              "left": 0,
              "right": 360,
              "width": 360,
              "height": 1478
            },
            "snippet": "<body>",
            "nodeLabel": "body"
          },
          "statistic": "Maximum Child Elements",
          "value": 12
        }]
      }
    },
    "external-anchors-use-rel-noopener": {
      "id": "external-anchors-use-rel-noopener",
      "title": "Links to cross-origin destinations are safe",
      "description": "Add `rel=\"noopener\"` or `rel=\"noreferrer\"` to any external links to improve performance and prevent security vulnerabilities. [Learn more](https://web.dev/external-anchors-use-rel-noopener/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "warnings": [],
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "geolocation-on-start": {
      "id": "geolocation-on-start",
      "title": "Avoids requesting the geolocation permission on page load",
      "description": "Users are mistrustful of or confused by sites that request their location without context. Consider tying the request to a user action instead. [Learn more](https://web.dev/geolocation-on-start/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "inspector-issues": {
      "id": "inspector-issues",
      "title": "No issues in the `Issues` panel in Chrome Devtools",
      "description": "Issues logged to the `Issues` panel in Chrome Devtools indicate unresolved problems. They can come from network request failures, insufficient security controls, and other browser concerns. Open up the Issues panel in Chrome DevTools for more details on each issue.",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "no-document-write": {
      "id": "no-document-write",
      "title": "Avoids `document.write()`",
      "description": "For users on slow connections, external scripts dynamically injected via `document.write()` can delay page load by tens of seconds. [Learn more](https://web.dev/no-document-write/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "no-vulnerable-libraries": {
      "id": "no-vulnerable-libraries",
      "title": "Avoids front-end JavaScript libraries with known security vulnerabilities",
      "description": "Some third-party scripts may contain known security vulnerabilities that are easily identified and exploited by attackers. [Learn more](https://web.dev/no-vulnerable-libraries/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": [],
        "summary": {}
      }
    },
    "js-libraries": {
      "id": "js-libraries",
      "title": "Detected JavaScript libraries",
      "description": "All front-end JavaScript libraries detected on the page. [Learn more](https://web.dev/js-libraries/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [{
          "key": "name",
          "itemType": "text",
          "text": "Name"
        }, {
          "key": "version",
          "itemType": "text",
          "text": "Version"
        }],
        "items": [{
          "name": "React",
          "npm": "react"
        }, {
          "name": "Gatsby",
          "npm": "gatsby"
        }, {
          "name": "Workbox",
          "npm": "workbox-sw"
        }],
        "summary": {},
        "debugData": {
          "type": "debugdata",
          "stacks": [{
            "id": "react"
          }, {
            "id": "react-fast"
          }, {
            "id": "gatsby"
          }, {
            "id": "workbox"
          }]
        }
      }
    },
    "notification-on-start": {
      "id": "notification-on-start",
      "title": "Avoids requesting the notification permission on page load",
      "description": "Users are mistrustful of or confused by sites that request to send notifications without context. Consider tying the request to user gestures instead. [Learn more](https://web.dev/notification-on-start/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "password-inputs-can-be-pasted-into": {
      "id": "password-inputs-can-be-pasted-into",
      "title": "Allows users to paste into password fields",
      "description": "Preventing password pasting undermines good security policy. [Learn more](https://web.dev/password-inputs-can-be-pasted-into/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "uses-http2": {
      "id": "uses-http2",
      "title": "Use HTTP/2",
      "description": "HTTP/2 offers many benefits over HTTP/1.1, including binary headers and multiplexing. [Learn more](https://web.dev/uses-http2/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "numericValue": 0,
      "numericUnit": "millisecond",
      "details": {
        "type": "opportunity",
        "headings": [],
        "items": [],
        "overallSavingsMs": 0
      }
    },
    "uses-passive-event-listeners": {
      "id": "uses-passive-event-listeners",
      "title": "Uses passive listeners to improve scrolling performance",
      "description": "Consider marking your touch and wheel event listeners as `passive` to improve your page's scroll performance. [Learn more](https://web.dev/uses-passive-event-listeners/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "meta-description": {
      "id": "meta-description",
      "title": "Document has a meta description",
      "description": "Meta descriptions may be included in search results to concisely summarize page content. [Learn more](https://web.dev/meta-description/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "http-status-code": {
      "id": "http-status-code",
      "title": "Page has successful HTTP status code",
      "description": "Pages with unsuccessful HTTP status codes may not be indexed properly. [Learn more](https://web.dev/http-status-code/).",
      "score": 1,
      "scoreDisplayMode": "binary"
    },
    "font-size": {
      "id": "font-size",
      "title": "Document uses legible font sizes",
      "description": "Font sizes less than 12px are too small to be legible and require mobile visitors to “pinch to zoom” in order to read. Strive to have >60% of page text ≥12px. [Learn more](https://web.dev/font-size/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "displayValue": "100% legible text",
      "details": {
        "type": "table",
        "headings": [{
          "key": "source",
          "itemType": "source-location",
          "text": "Source"
        }, {
          "key": "selector",
          "itemType": "code",
          "text": "Selector"
        }, {
          "key": "coverage",
          "itemType": "text",
          "text": "% of Page Text"
        }, {
          "key": "fontSize",
          "itemType": "text",
          "text": "Font Size"
        }],
        "items": [{
          "source": {
            "type": "code",
            "value": "Legible text"
          },
          "selector": "",
          "coverage": "100.00%",
          "fontSize": "≥ 12px"
        }]
      }
    },
    "link-text": {
      "id": "link-text",
      "title": "Links have descriptive text",
      "description": "Descriptive link text helps search engines understand your content. [Learn more](https://web.dev/link-text/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": [],
        "summary": {}
      }
    },
    "crawlable-anchors": {
      "id": "crawlable-anchors",
      "title": "Links are crawlable",
      "description": "Search engines may use `href` attributes on links to crawl websites. Ensure that the `href` attribute of anchor elements links to an appropriate destination, so more pages of the site can be discovered. [Learn More](https://support.google.com/webmasters/answer/9112205)",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "is-crawlable": {
      "id": "is-crawlable",
      "title": "Page isn’t blocked from indexing",
      "description": "Search engines are unable to include your pages in search results if they don't have permission to crawl them. [Learn more](https://web.dev/is-crawable/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "robots-txt": {
      "id": "robots-txt",
      "title": "robots.txt is valid",
      "description": "If your robots.txt file is malformed, crawlers may not be able to understand how you want your website to be crawled or indexed. [Learn more](https://web.dev/robots-txt/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "tap-targets": {
      "id": "tap-targets",
      "title": "Tap targets are not sized appropriately",
      "description": "Interactive elements like buttons and links should be large enough (48x48px), and have enough space around them, to be easy enough to tap without overlapping onto other elements. [Learn more](https://web.dev/tap-targets/).",
      "score": 0.73,
      "scoreDisplayMode": "binary",
      "displayValue": "82% appropriately sized tap targets",
      "details": {
        "type": "table",
        "headings": [{
          "key": "tapTarget",
          "itemType": "node",
          "text": "Tap Target"
        }, {
          "key": "size",
          "itemType": "text",
          "text": "Size"
        }, {
          "key": "overlappingTarget",
          "itemType": "node",
          "text": "Overlapping Target"
        }],
        "items": [{
          "tapTarget": {
            "type": "node",
            "lhId": "5-9-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": -316,
              "bottom": -298,
              "left": 102,
              "right": 148,
              "width": 45,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/debug/\">",
            "nodeLabel": "DEBUG"
          },
          "overlappingTarget": {
            "type": "node",
            "lhId": "5-10-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,H2,0,A",
            "selector": "div > div.Feed-module--feed__item--2D5rE > h2.Feed-module--feed__item-title--3nigr > a.Feed-module--feed__item-title-link--iFMRs",
            "boundingRect": {
              "top": -292,
              "bottom": -180,
              "left": 20,
              "right": 326,
              "width": 306,
              "height": 112
            },
            "snippet": "<a class=\"Feed-module--feed__item-title-link--iFMRs\" href=\"/posts/debugging-development-performance-nextjs\">",
            "nodeLabel": "Debugging development performance in a NextJS application"
          },
          "tapTargetScore": 834.4383111572824,
          "overlappingTargetScore": 441.59912109375,
          "overlapScoreRatio": 0.529217217365411,
          "size": "45x18",
          "width": 45,
          "height": 18
        }, {
          "tapTarget": {
            "type": "node",
            "lhId": "5-12-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": -30,
              "bottom": -11,
              "left": 115,
              "right": 176,
              "width": 61,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/growth/\">",
            "nodeLabel": "GROWTH"
          },
          "overlappingTarget": {
            "type": "node",
            "lhId": "5-13-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,1,H2,0,A",
            "selector": "div > div.Feed-module--feed__item--2D5rE > h2.Feed-module--feed__item-title--3nigr > a.Feed-module--feed__item-title-link--iFMRs",
            "boundingRect": {
              "top": -6,
              "bottom": 106,
              "left": 20,
              "right": 307,
              "width": 287,
              "height": 112
            },
            "snippet": "<a class=\"Feed-module--feed__item-title-link--iFMRs\" href=\"/posts/When-can-I-consider-myself-a-good-software-developer\">",
            "nodeLabel": "When can I consider myself a good software developer"
          },
          "tapTargetScore": 883.201171875,
          "overlappingTargetScore": 441.6005859375,
          "overlapScoreRatio": 0.5,
          "size": "60x18",
          "width": 60,
          "height": 18
        }, {
          "tapTarget": {
            "type": "node",
            "lhId": "5-15-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,2,SPAN,0,A",
            "selector": "div.Feed-module--feed__item--2D5rE > div > span > a.Feed-module--feed__item-meta-category-link--23f8F",
            "boundingRect": {
              "top": 257,
              "bottom": 275,
              "left": 115,
              "right": 208,
              "width": 94,
              "height": 18
            },
            "snippet": "<a class=\"Feed-module--feed__item-meta-category-link--23f8F\" href=\"/category/unclassified/\">",
            "nodeLabel": "UNCLASSIFIED"
          },
          "overlappingTarget": {
            "type": "node",
            "lhId": "5-16-A",
            "path": "1,HTML,1,BODY,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,1,H2,0,A",
            "selector": "div > div.Feed-module--feed__item--2D5rE > h2.Feed-module--feed__item-title--3nigr > a.Feed-module--feed__item-title-link--iFMRs",
            "boundingRect": {
              "top": 281,
              "bottom": 316,
              "left": 20,
              "right": 167,
              "width": 147,
              "height": 35
            },
            "snippet": "<a class=\"Feed-module--feed__item-title-link--iFMRs\" href=\"/posts/hello-world\">",
            "nodeLabel": "Hello World"
          },
          "tapTargetScore": 883.201171875,
          "overlappingTargetScore": 267.3178336333949,
          "overlapScoreRatio": 0.3026692469914754,
          "size": "93x18",
          "width": 93,
          "height": 18
        }]
      }
    },
    "hreflang": {
      "id": "hreflang",
      "title": "Document has a valid `hreflang`",
      "description": "hreflang links tell search engines what version of a page they should list in search results for a given language or region. [Learn more](https://web.dev/hreflang/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "plugins": {
      "id": "plugins",
      "title": "Document avoids plugins",
      "description": "Search engines can't index plugin content, and many devices restrict plugins or don't support them. [Learn more](https://web.dev/plugins/).",
      "score": 1,
      "scoreDisplayMode": "binary",
      "details": {
        "type": "table",
        "headings": [],
        "items": []
      }
    },
    "canonical": {
      "id": "canonical",
      "title": "Document has a valid `rel=canonical`",
      "description": "Canonical links suggest which URL to show in search results. [Learn more](https://web.dev/canonical/).",
      "score": null,
      "scoreDisplayMode": "notApplicable"
    },
    "structured-data": {
      "id": "structured-data",
      "title": "Structured data is valid",
      "description": "Run the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/) and the [Structured Data Linter](http://linter.structured-data.org/) to validate structured data. [Learn more](https://web.dev/structured-data/).",
      "score": null,
      "scoreDisplayMode": "manual"
    }
  },
  "configSettings": {
    "output": ["json"],
    "maxWaitForFcp": 30000,
    "maxWaitForLoad": 45000,
    "formFactor": "mobile",
    "throttling": {
      "rttMs": 150,
      "throughputKbps": 1638.4,
      "requestLatencyMs": 562.5,
      "downloadThroughputKbps": 1474.5600000000002,
      "uploadThroughputKbps": 675,
      "cpuSlowdownMultiplier": 4
    },
    "throttlingMethod": "simulate",
    "screenEmulation": {
      "mobile": true,
      "width": 360,
      "height": 640,
      "deviceScaleFactor": 2.625,
      "disabled": false
    },
    "emulatedUserAgent": "Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "auditMode": false,
    "gatherMode": false,
    "disableStorageReset": false,
    "channel": "cli",
    "budgets": null,
    "locale": "en-US",
    "blockedUrlPatterns": null,
    "additionalTraceCategories": null,
    "extraHeaders": null,
    "precomputedLanternData": null,
    "onlyAudits": null,
    "onlyCategories": null,
    "skipAudits": null
  },
  "categories": {
    "performance": {
      "title": "Performance",
      "auditRefs": [{
        "id": "first-contentful-paint",
        "weight": 10,
        "group": "metrics",
        "acronym": "FCP",
        "relevantAudits": ["server-response-time", "render-blocking-resources", "redirects", "critical-request-chains", "uses-text-compression", "uses-rel-preconnect", "uses-rel-preload", "font-display", "unminified-javascript", "unminified-css", "unused-css-rules"]
      }, {
        "id": "speed-index",
        "weight": 10,
        "group": "metrics",
        "acronym": "SI"
      }, {
        "id": "largest-contentful-paint",
        "weight": 25,
        "group": "metrics",
        "acronym": "LCP",
        "relevantAudits": ["server-response-time", "render-blocking-resources", "redirects", "critical-request-chains", "uses-text-compression", "uses-rel-preconnect", "uses-rel-preload", "font-display", "unminified-javascript", "unminified-css", "unused-css-rules", "largest-contentful-paint-element", "preload-lcp-image", "unused-javascript", "efficient-animated-content", "total-byte-weight"]
      }, {
        "id": "interactive",
        "weight": 10,
        "group": "metrics",
        "acronym": "TTI"
      }, {
        "id": "total-blocking-time",
        "weight": 30,
        "group": "metrics",
        "acronym": "TBT",
        "relevantAudits": ["long-tasks", "third-party-summary", "third-party-facades", "bootup-time", "mainthread-work-breakdown", "dom-size", "duplicated-javascript", "legacy-javascript"]
      }, {
        "id": "cumulative-layout-shift",
        "weight": 15,
        "group": "metrics",
        "acronym": "CLS",
        "relevantAudits": ["layout-shift-elements", "non-composited-animations", "unsized-images"]
      }, {
        "id": "max-potential-fid",
        "weight": 0
      }, {
        "id": "first-meaningful-paint",
        "weight": 0,
        "acronym": "FMP"
      }, {
        "id": "render-blocking-resources",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-responsive-images",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "offscreen-images",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "unminified-css",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "unminified-javascript",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "unused-css-rules",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "unused-javascript",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-optimized-images",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "modern-image-formats",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-text-compression",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-rel-preconnect",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "server-response-time",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "redirects",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-rel-preload",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "uses-http2",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "efficient-animated-content",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "duplicated-javascript",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "legacy-javascript",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "preload-lcp-image",
        "weight": 0,
        "group": "load-opportunities"
      }, {
        "id": "total-byte-weight",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "uses-long-cache-ttl",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "dom-size",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "critical-request-chains",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "user-timings",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "bootup-time",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "mainthread-work-breakdown",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "font-display",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "performance-budget",
        "weight": 0,
        "group": "budgets"
      }, {
        "id": "timing-budget",
        "weight": 0,
        "group": "budgets"
      }, {
        "id": "resource-summary",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "third-party-summary",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "third-party-facades",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "largest-contentful-paint-element",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "layout-shift-elements",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "uses-passive-event-listeners",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "no-document-write",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "long-tasks",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "non-composited-animations",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "unsized-images",
        "weight": 0,
        "group": "diagnostics"
      }, {
        "id": "network-requests",
        "weight": 0
      }, {
        "id": "network-rtt",
        "weight": 0
      }, {
        "id": "network-server-latency",
        "weight": 0
      }, {
        "id": "main-thread-tasks",
        "weight": 0
      }, {
        "id": "diagnostics",
        "weight": 0
      }, {
        "id": "metrics",
        "weight": 0
      }, {
        "id": "screenshot-thumbnails",
        "weight": 0
      }, {
        "id": "final-screenshot",
        "weight": 0
      }, {
        "id": "script-treemap-data",
        "weight": 0
      }],
      "id": "performance",
      "score": 0.96
    },
    "accessibility": {
      "title": "Accessibility",
      "description": "These checks highlight opportunities to [improve the accessibility of your web app](https://developers.google.com/web/fundamentals/accessibility). Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged.",
      "manualDescription": "These items address areas which an automated testing tool cannot cover. Learn more in our guide on [conducting an accessibility review](https://developers.google.com/web/fundamentals/accessibility/how-to-review).",
      "auditRefs": [{
        "id": "accesskeys",
        "weight": 0,
        "group": "a11y-navigation"
      }, {
        "id": "aria-allowed-attr",
        "weight": 10,
        "group": "a11y-aria"
      }, {
        "id": "aria-command-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-hidden-body",
        "weight": 10,
        "group": "a11y-aria"
      }, {
        "id": "aria-hidden-focus",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-input-field-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-meter-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-progressbar-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-required-attr",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-required-children",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-required-parent",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-roles",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-toggle-field-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-tooltip-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-treeitem-name",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "aria-valid-attr-value",
        "weight": 10,
        "group": "a11y-aria"
      }, {
        "id": "aria-valid-attr",
        "weight": 10,
        "group": "a11y-aria"
      }, {
        "id": "button-name",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "bypass",
        "weight": 3,
        "group": "a11y-navigation"
      }, {
        "id": "color-contrast",
        "weight": 3,
        "group": "a11y-color-contrast"
      }, {
        "id": "definition-list",
        "weight": 0,
        "group": "a11y-tables-lists"
      }, {
        "id": "dlitem",
        "weight": 0,
        "group": "a11y-tables-lists"
      }, {
        "id": "document-title",
        "weight": 3,
        "group": "a11y-names-labels"
      }, {
        "id": "duplicate-id-active",
        "weight": 3,
        "group": "a11y-navigation"
      }, {
        "id": "duplicate-id-aria",
        "weight": 0,
        "group": "a11y-aria"
      }, {
        "id": "form-field-multiple-labels",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "frame-title",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "heading-order",
        "weight": 2,
        "group": "a11y-navigation"
      }, {
        "id": "html-has-lang",
        "weight": 3,
        "group": "a11y-language"
      }, {
        "id": "html-lang-valid",
        "weight": 3,
        "group": "a11y-language"
      }, {
        "id": "image-alt",
        "weight": 10,
        "group": "a11y-names-labels"
      }, {
        "id": "input-image-alt",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "label",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "link-name",
        "weight": 3,
        "group": "a11y-names-labels"
      }, {
        "id": "list",
        "weight": 3,
        "group": "a11y-tables-lists"
      }, {
        "id": "listitem",
        "weight": 3,
        "group": "a11y-tables-lists"
      }, {
        "id": "meta-refresh",
        "weight": 0,
        "group": "a11y-best-practices"
      }, {
        "id": "meta-viewport",
        "weight": 10,
        "group": "a11y-best-practices"
      }, {
        "id": "object-alt",
        "weight": 0,
        "group": "a11y-names-labels"
      }, {
        "id": "tabindex",
        "weight": 3,
        "group": "a11y-navigation"
      }, {
        "id": "td-headers-attr",
        "weight": 0,
        "group": "a11y-tables-lists"
      }, {
        "id": "th-has-data-cells",
        "weight": 0,
        "group": "a11y-tables-lists"
      }, {
        "id": "valid-lang",
        "weight": 0,
        "group": "a11y-language"
      }, {
        "id": "video-caption",
        "weight": 0,
        "group": "a11y-audio-video"
      }, {
        "id": "logical-tab-order",
        "weight": 0
      }, {
        "id": "focusable-controls",
        "weight": 0
      }, {
        "id": "interactive-element-affordance",
        "weight": 0
      }, {
        "id": "managed-focus",
        "weight": 0
      }, {
        "id": "focus-traps",
        "weight": 0
      }, {
        "id": "custom-controls-labels",
        "weight": 0
      }, {
        "id": "custom-controls-roles",
        "weight": 0
      }, {
        "id": "visual-order-follows-dom",
        "weight": 0
      }, {
        "id": "offscreen-content-hidden",
        "weight": 0
      }, {
        "id": "use-landmarks",
        "weight": 0
      }],
      "id": "accessibility",
      "score": 0.97
    },
    "best-practices": {
      "title": "Best Practices",
      "auditRefs": [{
        "id": "is-on-https",
        "weight": 1,
        "group": "best-practices-trust-safety"
      }, {
        "id": "external-anchors-use-rel-noopener",
        "weight": 1,
        "group": "best-practices-trust-safety"
      }, {
        "id": "geolocation-on-start",
        "weight": 1,
        "group": "best-practices-trust-safety"
      }, {
        "id": "notification-on-start",
        "weight": 1,
        "group": "best-practices-trust-safety"
      }, {
        "id": "no-vulnerable-libraries",
        "weight": 1,
        "group": "best-practices-trust-safety"
      }, {
        "id": "csp-xss",
        "weight": 0,
        "group": "best-practices-trust-safety"
      }, {
        "id": "password-inputs-can-be-pasted-into",
        "weight": 1,
        "group": "best-practices-ux"
      }, {
        "id": "image-aspect-ratio",
        "weight": 1,
        "group": "best-practices-ux"
      }, {
        "id": "image-size-responsive",
        "weight": 1,
        "group": "best-practices-ux"
      }, {
        "id": "preload-fonts",
        "weight": 0,
        "group": "best-practices-ux"
      }, {
        "id": "doctype",
        "weight": 1,
        "group": "best-practices-browser-compat"
      }, {
        "id": "charset",
        "weight": 1,
        "group": "best-practices-browser-compat"
      }, {
        "id": "no-unload-listeners",
        "weight": 1,
        "group": "best-practices-general"
      }, {
        "id": "appcache-manifest",
        "weight": 1,
        "group": "best-practices-general"
      }, {
        "id": "js-libraries",
        "weight": 0,
        "group": "best-practices-general"
      }, {
        "id": "deprecations",
        "weight": 1,
        "group": "best-practices-general"
      }, {
        "id": "errors-in-console",
        "weight": 1,
        "group": "best-practices-general"
      }, {
        "id": "valid-source-maps",
        "weight": 0,
        "group": "best-practices-general"
      }, {
        "id": "inspector-issues",
        "weight": 1,
        "group": "best-practices-general"
      }],
      "id": "best-practices",
      "score": 1
    },
    "seo": {
      "title": "SEO",
      "description": "These checks ensure that your page is optimized for search engine results ranking. There are additional factors Lighthouse does not check that may affect your search ranking. [Learn more](https://support.google.com/webmasters/answer/35769).",
      "manualDescription": "Run these additional validators on your site to check additional SEO best practices.",
      "auditRefs": [{
        "id": "viewport",
        "weight": 1,
        "group": "seo-mobile"
      }, {
        "id": "document-title",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "meta-description",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "http-status-code",
        "weight": 1,
        "group": "seo-crawl"
      }, {
        "id": "link-text",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "crawlable-anchors",
        "weight": 1,
        "group": "seo-crawl"
      }, {
        "id": "is-crawlable",
        "weight": 1,
        "group": "seo-crawl"
      }, {
        "id": "robots-txt",
        "weight": 0,
        "group": "seo-crawl"
      }, {
        "id": "image-alt",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "hreflang",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "canonical",
        "weight": 0,
        "group": "seo-content"
      }, {
        "id": "font-size",
        "weight": 1,
        "group": "seo-mobile"
      }, {
        "id": "plugins",
        "weight": 1,
        "group": "seo-content"
      }, {
        "id": "tap-targets",
        "weight": 1,
        "group": "seo-mobile"
      }, {
        "id": "structured-data",
        "weight": 0
      }],
      "id": "seo",
      "score": 0.98
    },
    "pwa": {
      "title": "Progressive Web App",
      "description": "These checks validate the aspects of a Progressive Web App. [Learn more](https://developers.google.com/web/progressive-web-apps/checklist).",
      "manualDescription": "These checks are required by the baseline [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist) but are not automatically checked by Lighthouse. They do not affect your score but it's important that you verify them manually.",
      "auditRefs": [{
        "id": "installable-manifest",
        "weight": 2,
        "group": "pwa-installable"
      }, {
        "id": "service-worker",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "redirects-http",
        "weight": 2,
        "group": "pwa-optimized"
      }, {
        "id": "splash-screen",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "themed-omnibox",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "content-width",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "viewport",
        "weight": 2,
        "group": "pwa-optimized"
      }, {
        "id": "apple-touch-icon",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "maskable-icon",
        "weight": 1,
        "group": "pwa-optimized"
      }, {
        "id": "pwa-cross-browser",
        "weight": 0
      }, {
        "id": "pwa-page-transitions",
        "weight": 0
      }, {
        "id": "pwa-each-page-has-url",
        "weight": 0
      }],
      "id": "pwa",
      "score": 0.92
    }
  },
  "categoryGroups": {
    "metrics": {
      "title": "Metrics"
    },
    "load-opportunities": {
      "title": "Opportunities",
      "description": "These suggestions can help your page load faster. They don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
    },
    "budgets": {
      "title": "Budgets",
      "description": "Performance budgets set standards for the performance of your site."
    },
    "diagnostics": {
      "title": "Diagnostics",
      "description": "More information about the performance of your application. These numbers don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
    },
    "pwa-installable": {
      "title": "Installable"
    },
    "pwa-optimized": {
      "title": "PWA Optimized"
    },
    "a11y-best-practices": {
      "title": "Best practices",
      "description": "These items highlight common accessibility best practices."
    },
    "a11y-color-contrast": {
      "title": "Contrast",
      "description": "These are opportunities to improve the legibility of your content."
    },
    "a11y-names-labels": {
      "title": "Names and labels",
      "description": "These are opportunities to improve the semantics of the controls in your application. This may enhance the experience for users of assistive technology, like a screen reader."
    },
    "a11y-navigation": {
      "title": "Navigation",
      "description": "These are opportunities to improve keyboard navigation in your application."
    },
    "a11y-aria": {
      "title": "ARIA",
      "description": "These are opportunities to improve the usage of ARIA in your application which may enhance the experience for users of assistive technology, like a screen reader."
    },
    "a11y-language": {
      "title": "Internationalization and localization",
      "description": "These are opportunities to improve the interpretation of your content by users in different locales."
    },
    "a11y-audio-video": {
      "title": "Audio and video",
      "description": "These are opportunities to provide alternative content for audio and video. This may improve the experience for users with hearing or vision impairments."
    },
    "a11y-tables-lists": {
      "title": "Tables and lists",
      "description": "These are opportunities to improve the experience of reading tabular or list data using assistive technology, like a screen reader."
    },
    "seo-mobile": {
      "title": "Mobile Friendly",
      "description": "Make sure your pages are mobile friendly so users don’t have to pinch or zoom in order to read the content pages. [Learn more](https://developers.google.com/search/mobile-sites/)."
    },
    "seo-content": {
      "title": "Content Best Practices",
      "description": "Format your HTML in a way that enables crawlers to better understand your app’s content."
    },
    "seo-crawl": {
      "title": "Crawling and Indexing",
      "description": "To appear in search results, crawlers need access to your app."
    },
    "best-practices-trust-safety": {
      "title": "Trust and Safety"
    },
    "best-practices-ux": {
      "title": "User Experience"
    },
    "best-practices-browser-compat": {
      "title": "Browser Compatibility"
    },
    "best-practices-general": {
      "title": "General"
    }
  },
  "timing": {
    "entries": [{
      "startTime": 787.38,
      "name": "lh:init:config",
      "duration": 444.62,
      "entryType": "measure"
    }, {
      "startTime": 788.83,
      "name": "lh:config:requireGatherers",
      "duration": 30.53,
      "entryType": "measure"
    }, {
      "startTime": 819.51,
      "name": "lh:config:requireAudits",
      "duration": 354.23,
      "entryType": "measure"
    }, {
      "startTime": 1232.39,
      "name": "lh:runner:run",
      "duration": 9696.03,
      "entryType": "measure"
    }, {
      "startTime": 1233.13,
      "name": "lh:init:connect",
      "duration": 27.72,
      "entryType": "measure"
    }, {
      "startTime": 1260.95,
      "name": "lh:gather:loadBlank",
      "duration": 17.31,
      "entryType": "measure"
    }, {
      "startTime": 1278.39,
      "name": "lh:gather:getVersion",
      "duration": 0.48,
      "entryType": "measure"
    }, {
      "startTime": 1278.97,
      "name": "lh:gather:getBenchmarkIndex",
      "duration": 1006.86,
      "entryType": "measure"
    }, {
      "startTime": 2285.96,
      "name": "lh:gather:setupDriver",
      "duration": 9.41,
      "entryType": "measure"
    }, {
      "startTime": 2295.72,
      "name": "lh:gather:runPass-defaultPass",
      "duration": 6912.57,
      "entryType": "measure"
    }, {
      "startTime": 2296.03,
      "name": "lh:gather:loadBlank",
      "duration": 7.18,
      "entryType": "measure"
    }, {
      "startTime": 2320.34,
      "name": "lh:storage:clearBrowserCaches",
      "duration": 43.41,
      "entryType": "measure"
    }, {
      "startTime": 2363.89,
      "name": "lh:gather:prepareNetworkForNavigation",
      "duration": 1.13,
      "entryType": "measure"
    }, {
      "startTime": 2365.18,
      "name": "lh:gather:beforePass",
      "duration": 6,
      "entryType": "measure"
    }, {
      "startTime": 2365.21,
      "name": "lh:gather:beforePass:CSSUsage",
      "duration": 0.08,
      "entryType": "measure"
    }, {
      "startTime": 2365.3,
      "name": "lh:gather:beforePass:JsUsage",
      "duration": 2.91,
      "entryType": "measure"
    }, {
      "startTime": 2368.24,
      "name": "lh:gather:beforePass:ViewportDimensions",
      "duration": 0.03,
      "entryType": "measure"
    }, {
      "startTime": 2368.28,
      "name": "lh:gather:beforePass:ConsoleMessages",
      "duration": 1.17,
      "entryType": "measure"
    }, {
      "startTime": 2369.47,
      "name": "lh:gather:beforePass:AnchorElements",
      "duration": 0.03,
      "entryType": "measure"
    }, {
      "startTime": 2369.51,
      "name": "lh:gather:beforePass:ImageElements",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.52,
      "name": "lh:gather:beforePass:LinkElements",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.54,
      "name": "lh:gather:beforePass:MetaElements",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.56,
      "name": "lh:gather:beforePass:ScriptElements",
      "duration": 0.03,
      "entryType": "measure"
    }, {
      "startTime": 2369.6,
      "name": "lh:gather:beforePass:IFrameElements",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.61,
      "name": "lh:gather:beforePass:FormElements",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.63,
      "name": "lh:gather:beforePass:MainDocumentContent",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.64,
      "name": "lh:gather:beforePass:GlobalListeners",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.65,
      "name": "lh:gather:beforePass:AppCacheManifest",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.67,
      "name": "lh:gather:beforePass:Doctype",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.68,
      "name": "lh:gather:beforePass:DOMStats",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.69,
      "name": "lh:gather:beforePass:OptimizedImages",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.7,
      "name": "lh:gather:beforePass:PasswordInputsWithPreventedPaste",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.71,
      "name": "lh:gather:beforePass:ResponseCompression",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2369.73,
      "name": "lh:gather:beforePass:TagsBlockingFirstPaint",
      "duration": 0.43,
      "entryType": "measure"
    }, {
      "startTime": 2370.16,
      "name": "lh:gather:beforePass:FontSize",
      "duration": 0.02,
      "entryType": "measure"
    }, {
      "startTime": 2370.19,
      "name": "lh:gather:beforePass:EmbeddedContent",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2370.2,
      "name": "lh:gather:beforePass:RobotsTxt",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2370.21,
      "name": "lh:gather:beforePass:TapTargets",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2370.22,
      "name": "lh:gather:beforePass:Accessibility",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2370.23,
      "name": "lh:gather:beforePass:TraceElements",
      "duration": 0.42,
      "entryType": "measure"
    }, {
      "startTime": 2370.67,
      "name": "lh:gather:beforePass:InspectorIssues",
      "duration": 0.41,
      "entryType": "measure"
    }, {
      "startTime": 2371.08,
      "name": "lh:gather:beforePass:SourceMaps",
      "duration": 0.08,
      "entryType": "measure"
    }, {
      "startTime": 2371.17,
      "name": "lh:gather:beforePass:FullPageScreenshot",
      "duration": 0.01,
      "entryType": "measure"
    }, {
      "startTime": 2371.24,
      "name": "lh:gather:beginRecording",
      "duration": 39.22,
      "entryType": "measure"
    }, {
      "startTime": 2410.64,
      "name": "lh:gather:loadPage-defaultPass",
      "duration": 4513.58,
      "entryType": "measure"
    }, {
      "startTime": 6924.33,
      "name": "lh:gather:pass",
      "duration": 6.47,
      "entryType": "measure"
    }, {
      "startTime": 6930.9,
      "name": "lh:gather:getTrace",
      "duration": 255.74,
      "entryType": "measure"
    }, {
      "startTime": 7186.66,
      "name": "lh:gather:getDevtoolsLog",
      "duration": 2.72,
      "entryType": "measure"
    }, {
      "startTime": 7187.17,
      "name": "lh:computed:NetworkRecords",
      "duration": 2.21,
      "entryType": "measure"
    }, {
      "startTime": 7190.32,
      "name": "lh:gather:afterPass",
      "duration": 2017.79,
      "entryType": "measure"
    }, {
      "startTime": 7193.32,
      "name": "lh:gather:afterPass:CSSUsage",
      "duration": 59.76,
      "entryType": "measure"
    }, {
      "startTime": 7253.1,
      "name": "lh:gather:afterPass:JsUsage",
      "duration": 12.57,
      "entryType": "measure"
    }, {
      "startTime": 7265.69,
      "name": "lh:gather:afterPass:ViewportDimensions",
      "duration": 1.92,
      "entryType": "measure"
    }, {
      "startTime": 7267.64,
      "name": "lh:gather:afterPass:ConsoleMessages",
      "duration": 1.61,
      "entryType": "measure"
    }, {
      "startTime": 7269.26,
      "name": "lh:gather:afterPass:AnchorElements",
      "duration": 17.03,
      "entryType": "measure"
    }, {
      "startTime": 7286.32,
      "name": "lh:gather:afterPass:ImageElements",
      "duration": 11.36,
      "entryType": "measure"
    }, {
      "startTime": 7297.7,
      "name": "lh:gather:afterPass:LinkElements",
      "duration": 7.73,
      "entryType": "measure"
    }, {
      "startTime": 7305.45,
      "name": "lh:gather:afterPass:MetaElements",
      "duration": 3.51,
      "entryType": "measure"
    }, {
      "startTime": 7308.97,
      "name": "lh:gather:afterPass:ScriptElements",
      "duration": 13.77,
      "entryType": "measure"
    }, {
      "startTime": 7322.75,
      "name": "lh:gather:afterPass:IFrameElements",
      "duration": 2.25,
      "entryType": "measure"
    }, {
      "startTime": 7325.01,
      "name": "lh:gather:afterPass:FormElements",
      "duration": 2.51,
      "entryType": "measure"
    }, {
      "startTime": 7327.52,
      "name": "lh:gather:afterPass:MainDocumentContent",
      "duration": 1.58,
      "entryType": "measure"
    }, {
      "startTime": 7329.11,
      "name": "lh:gather:afterPass:GlobalListeners",
      "duration": 1.94,
      "entryType": "measure"
    }, {
      "startTime": 7331.06,
      "name": "lh:gather:afterPass:AppCacheManifest",
      "duration": 1.51,
      "entryType": "measure"
    }, {
      "startTime": 7332.59,
      "name": "lh:gather:afterPass:Doctype",
      "duration": 2.81,
      "entryType": "measure"
    }, {
      "startTime": 7335.41,
      "name": "lh:gather:afterPass:DOMStats",
      "duration": 4.6,
      "entryType": "measure"
    }, {
      "startTime": 7340.03,
      "name": "lh:gather:afterPass:OptimizedImages",
      "duration": 28.9,
      "entryType": "measure"
    }, {
      "startTime": 7368.95,
      "name": "lh:gather:afterPass:PasswordInputsWithPreventedPaste",
      "duration": 2.12,
      "entryType": "measure"
    }, {
      "startTime": 7371.08,
      "name": "lh:gather:afterPass:ResponseCompression",
      "duration": 3.29,
      "entryType": "measure"
    }, {
      "startTime": 7374.38,
      "name": "lh:gather:afterPass:TagsBlockingFirstPaint",
      "duration": 2.15,
      "entryType": "measure"
    }, {
      "startTime": 7376.55,
      "name": "lh:gather:afterPass:FontSize",
      "duration": 8.57,
      "entryType": "measure"
    }, {
      "startTime": 7385.14,
      "name": "lh:gather:afterPass:EmbeddedContent",
      "duration": 2.51,
      "entryType": "measure"
    }, {
      "startTime": 7387.66,
      "name": "lh:gather:afterPass:RobotsTxt",
      "duration": 46.88,
      "entryType": "measure"
    }, {
      "startTime": 7387.93,
      "name": "lh:gather:getVersion",
      "duration": 0.31,
      "entryType": "measure"
    }, {
      "startTime": 7388.8,
      "name": "lh:gather:getVersion",
      "duration": 0.21,
      "entryType": "measure"
    }, {
      "startTime": 7434.56,
      "name": "lh:gather:afterPass:TapTargets",
      "duration": 7.61,
      "entryType": "measure"
    }, {
      "startTime": 7442.18,
      "name": "lh:gather:afterPass:Accessibility",
      "duration": 139.6,
      "entryType": "measure"
    }, {
      "startTime": 7581.79,
      "name": "lh:gather:afterPass:TraceElements",
      "duration": 40.45,
      "entryType": "measure"
    }, {
      "startTime": 7622.27,
      "name": "lh:gather:afterPass:InspectorIssues",
      "duration": 1.58,
      "entryType": "measure"
    }, {
      "startTime": 7623.86,
      "name": "lh:gather:afterPass:SourceMaps",
      "duration": 1463.76,
      "entryType": "measure"
    }, {
      "startTime": 7624.74,
      "name": "lh:gather:getVersion",
      "duration": 0.18,
      "entryType": "measure"
    }, {
      "startTime": 9087.63,
      "name": "lh:gather:afterPass:FullPageScreenshot",
      "duration": 120.46,
      "entryType": "measure"
    }, {
      "startTime": 9208.47,
      "name": "lh:gather:populateBaseArtifacts",
      "duration": 59.47,
      "entryType": "measure"
    }, {
      "startTime": 9208.75,
      "name": "lh:gather:getWebAppManifest",
      "duration": 2.49,
      "entryType": "measure"
    }, {
      "startTime": 9211.29,
      "name": "lh:gather:getInstallabilityErrors",
      "duration": 0.36,
      "entryType": "measure"
    }, {
      "startTime": 9211.76,
      "name": "lh:gather:collectStacks",
      "duration": 56.04,
      "entryType": "measure"
    }, {
      "startTime": 9268.51,
      "name": "lh:gather:runPass-offlinePass",
      "duration": 94.19,
      "entryType": "measure"
    }, {
      "startTime": 9268.7,
      "name": "lh:gather:loadBlank",
      "duration": 18.07,
      "entryType": "measure"
    }, {
      "startTime": 9286.8,
      "name": "lh:gather:prepareNetworkForNavigation",
      "duration": 1.9,
      "entryType": "measure"
    }, {
      "startTime": 9288.71,
      "name": "lh:gather:beforePass",
      "duration": 1.25,
      "entryType": "measure"
    }, {
      "startTime": 9288.72,
      "name": "lh:gather:beforePass:ServiceWorker",
      "duration": 1.23,
      "entryType": "measure"
    }, {
      "startTime": 9289.97,
      "name": "lh:gather:beginRecording",
      "duration": 0.14,
      "entryType": "measure"
    }, {
      "startTime": 9290.12,
      "name": "lh:gather:loadPage-offlinePass",
      "duration": 45.76,
      "entryType": "measure"
    }, {
      "startTime": 9335.91,
      "name": "lh:gather:pass",
      "duration": 0.33,
      "entryType": "measure"
    }, {
      "startTime": 9336.28,
      "name": "lh:gather:getDevtoolsLog",
      "duration": 1.92,
      "entryType": "measure"
    }, {
      "startTime": 9337.48,
      "name": "lh:computed:NetworkRecords",
      "duration": 0.7,
      "entryType": "measure"
    }, {
      "startTime": 9340.48,
      "name": "lh:gather:afterPass",
      "duration": 22.19,
      "entryType": "measure"
    }, {
      "startTime": 9361.62,
      "name": "lh:gather:afterPass:ServiceWorker",
      "duration": 1.04,
      "entryType": "measure"
    }, {
      "startTime": 9362.74,
      "name": "lh:gather:runPass-redirectPass",
      "duration": 96.65,
      "entryType": "measure"
    }, {
      "startTime": 9362.93,
      "name": "lh:gather:loadBlank",
      "duration": 11.84,
      "entryType": "measure"
    }, {
      "startTime": 9374.79,
      "name": "lh:gather:prepareNetworkForNavigation",
      "duration": 1.16,
      "entryType": "measure"
    }, {
      "startTime": 9375.96,
      "name": "lh:gather:beforePass",
      "duration": 0.14,
      "entryType": "measure"
    }, {
      "startTime": 9375.97,
      "name": "lh:gather:beforePass:HTTPRedirect",
      "duration": 0.13,
      "entryType": "measure"
    }, {
      "startTime": 9376.11,
      "name": "lh:gather:beginRecording",
      "duration": 0.15,
      "entryType": "measure"
    }, {
      "startTime": 9376.27,
      "name": "lh:gather:loadPage-redirectPass",
      "duration": 55.47,
      "entryType": "measure"
    }, {
      "startTime": 9431.76,
      "name": "lh:gather:pass",
      "duration": 0.18,
      "entryType": "measure"
    }, {
      "startTime": 9431.95,
      "name": "lh:gather:getDevtoolsLog",
      "duration": 1.74,
      "entryType": "measure"
    }, {
      "startTime": 9432.87,
      "name": "lh:computed:NetworkRecords",
      "duration": 0.8,
      "entryType": "measure"
    }, {
      "startTime": 9434.87,
      "name": "lh:gather:afterPass",
      "duration": 24.51,
      "entryType": "measure"
    }, {
      "startTime": 9452.26,
      "name": "lh:gather:afterPass:HTTPRedirect",
      "duration": 7.11,
      "entryType": "measure"
    }, {
      "startTime": 9459.58,
      "name": "lh:gather:disconnect",
      "duration": 26.55,
      "entryType": "measure"
    }, {
      "startTime": 9486.37,
      "name": "lh:runner:auditing",
      "duration": 1441.3,
      "entryType": "measure"
    }, {
      "startTime": 9489.05,
      "name": "lh:audit:is-on-https",
      "duration": 3.51,
      "entryType": "measure"
    }, {
      "startTime": 9493.32,
      "name": "lh:audit:redirects-http",
      "duration": 3.51,
      "entryType": "measure"
    }, {
      "startTime": 9497.74,
      "name": "lh:audit:service-worker",
      "duration": 4.87,
      "entryType": "measure"
    }, {
      "startTime": 9503.12,
      "name": "lh:audit:viewport",
      "duration": 3.67,
      "entryType": "measure"
    }, {
      "startTime": 9504.71,
      "name": "lh:computed:ViewportMeta",
      "duration": 0.8,
      "entryType": "measure"
    }, {
      "startTime": 9507.16,
      "name": "lh:audit:first-contentful-paint",
      "duration": 45.14,
      "entryType": "measure"
    }, {
      "startTime": 9509.18,
      "name": "lh:computed:FirstContentfulPaint",
      "duration": 37.85,
      "entryType": "measure"
    }, {
      "startTime": 9509.28,
      "name": "lh:computed:TraceOfTab",
      "duration": 27.17,
      "entryType": "measure"
    }, {
      "startTime": 9536.6,
      "name": "lh:computed:LanternFirstContentfulPaint",
      "duration": 10.41,
      "entryType": "measure"
    }, {
      "startTime": 9536.76,
      "name": "lh:computed:PageDependencyGraph",
      "duration": 5.39,
      "entryType": "measure"
    }, {
      "startTime": 9542.17,
      "name": "lh:computed:LoadSimulator",
      "duration": 1.5,
      "entryType": "measure"
    }, {
      "startTime": 9542.25,
      "name": "lh:computed:NetworkAnalysis",
      "duration": 1.22,
      "entryType": "measure"
    }, {
      "startTime": 9552.63,
      "name": "lh:audit:largest-contentful-paint",
      "duration": 3.68,
      "entryType": "measure"
    }, {
      "startTime": 9553.26,
      "name": "lh:computed:LargestContentfulPaint",
      "duration": 2.05,
      "entryType": "measure"
    }, {
      "startTime": 9553.31,
      "name": "lh:computed:LanternLargestContentfulPaint",
      "duration": 2,
      "entryType": "measure"
    }, {
      "startTime": 9556.69,
      "name": "lh:audit:first-meaningful-paint",
      "duration": 4.63,
      "entryType": "measure"
    }, {
      "startTime": 9557.24,
      "name": "lh:computed:FirstMeaningfulPaint",
      "duration": 3.01,
      "entryType": "measure"
    }, {
      "startTime": 9557.29,
      "name": "lh:computed:LanternFirstMeaningfulPaint",
      "duration": 2.95,
      "entryType": "measure"
    }, {
      "startTime": 9561.6,
      "name": "lh:audit:speed-index",
      "duration": 272.51,
      "entryType": "measure"
    }, {
      "startTime": 9562.09,
      "name": "lh:computed:SpeedIndex",
      "duration": 271.35,
      "entryType": "measure"
    }, {
      "startTime": 9562.13,
      "name": "lh:computed:LanternSpeedIndex",
      "duration": 271.3,
      "entryType": "measure"
    }, {
      "startTime": 9562.17,
      "name": "lh:computed:Speedline",
      "duration": 258.89,
      "entryType": "measure"
    }, {
      "startTime": 9834.14,
      "name": "lh:audit:screenshot-thumbnails",
      "duration": 193.9,
      "entryType": "measure"
    }, {
      "startTime": 10028.08,
      "name": "lh:audit:final-screenshot",
      "duration": 1.42,
      "entryType": "measure"
    }, {
      "startTime": 10028.46,
      "name": "lh:computed:Screenshots",
      "duration": 1,
      "entryType": "measure"
    }, {
      "startTime": 10030.35,
      "name": "lh:audit:total-blocking-time",
      "duration": 23.11,
      "entryType": "measure"
    }, {
      "startTime": 10031.24,
      "name": "lh:computed:TotalBlockingTime",
      "duration": 13.94,
      "entryType": "measure"
    }, {
      "startTime": 10031.29,
      "name": "lh:computed:LanternTotalBlockingTime",
      "duration": 13.89,
      "entryType": "measure"
    }, {
      "startTime": 10031.37,
      "name": "lh:computed:LanternInteractive",
      "duration": 5.54,
      "entryType": "measure"
    }, {
      "startTime": 10054.31,
      "name": "lh:audit:max-potential-fid",
      "duration": 17.52,
      "entryType": "measure"
    }, {
      "startTime": 10055.59,
      "name": "lh:computed:MaxPotentialFID",
      "duration": 7.17,
      "entryType": "measure"
    }, {
      "startTime": 10055.71,
      "name": "lh:computed:LanternMaxPotentialFID",
      "duration": 7.04,
      "entryType": "measure"
    }, {
      "startTime": 10072.58,
      "name": "lh:audit:cumulative-layout-shift",
      "duration": 2.65,
      "entryType": "measure"
    }, {
      "startTime": 10073.43,
      "name": "lh:computed:CumulativeLayoutShift",
      "duration": 0.27,
      "entryType": "measure"
    }, {
      "startTime": 10075.85,
      "name": "lh:audit:errors-in-console",
      "duration": 2.7,
      "entryType": "measure"
    }, {
      "startTime": 10079.12,
      "name": "lh:audit:server-response-time",
      "duration": 2.09,
      "entryType": "measure"
    }, {
      "startTime": 10079.86,
      "name": "lh:computed:MainResource",
      "duration": 0.14,
      "entryType": "measure"
    }, {
      "startTime": 10081.56,
      "name": "lh:audit:interactive",
      "duration": 1.36,
      "entryType": "measure"
    }, {
      "startTime": 10082.13,
      "name": "lh:computed:Interactive",
      "duration": 0.06,
      "entryType": "measure"
    }, {
      "startTime": 10083.32,
      "name": "lh:audit:user-timings",
      "duration": 4.31,
      "entryType": "measure"
    }, {
      "startTime": 10083.9,
      "name": "lh:computed:UserTimings",
      "duration": 1,
      "entryType": "measure"
    }, {
      "startTime": 10088.17,
      "name": "lh:audit:critical-request-chains",
      "duration": 2.42,
      "entryType": "measure"
    }, {
      "startTime": 10088.86,
      "name": "lh:computed:CriticalRequestChains",
      "duration": 0.5,
      "entryType": "measure"
    }, {
      "startTime": 10090.92,
      "name": "lh:audit:redirects",
      "duration": 4.68,
      "entryType": "measure"
    }, {
      "startTime": 10096.33,
      "name": "lh:audit:installable-manifest",
      "duration": 4.54,
      "entryType": "measure"
    }, {
      "startTime": 10098.26,
      "name": "lh:computed:ManifestValues",
      "duration": 0.99,
      "entryType": "measure"
    }, {
      "startTime": 10101.4,
      "name": "lh:audit:apple-touch-icon",
      "duration": 1.81,
      "entryType": "measure"
    }, {
      "startTime": 10104.58,
      "name": "lh:audit:splash-screen",
      "duration": 1.74,
      "entryType": "measure"
    }, {
      "startTime": 10105.22,
      "name": "lh:computed:ManifestValues",
      "duration": 0.09,
      "entryType": "measure"
    }, {
      "startTime": 10106.77,
      "name": "lh:audit:themed-omnibox",
      "duration": 1.78,
      "entryType": "measure"
    }, {
      "startTime": 10107.6,
      "name": "lh:computed:ManifestValues",
      "duration": 0.11,
      "entryType": "measure"
    }, {
      "startTime": 10109.24,
      "name": "lh:audit:maskable-icon",
      "duration": 1.63,
      "entryType": "measure"
    }, {
      "startTime": 10111.33,
      "name": "lh:audit:content-width",
      "duration": 1.91,
      "entryType": "measure"
    }, {
      "startTime": 10113.55,
      "name": "lh:audit:image-aspect-ratio",
      "duration": 1.31,
      "entryType": "measure"
    }, {
      "startTime": 10115.23,
      "name": "lh:audit:image-size-responsive",
      "duration": 1.52,
      "entryType": "measure"
    }, {
      "startTime": 10117.07,
      "name": "lh:audit:preload-fonts",
      "duration": 1.46,
      "entryType": "measure"
    }, {
      "startTime": 10118.83,
      "name": "lh:audit:deprecations",
      "duration": 1.05,
      "entryType": "measure"
    }, {
      "startTime": 10120.26,
      "name": "lh:audit:mainthread-work-breakdown",
      "duration": 18.31,
      "entryType": "measure"
    }, {
      "startTime": 10120.86,
      "name": "lh:computed:MainThreadTasks",
      "duration": 16.25,
      "entryType": "measure"
    }, {
      "startTime": 10138.91,
      "name": "lh:audit:bootup-time",
      "duration": 3.16,
      "entryType": "measure"
    }, {
      "startTime": 10142.34,
      "name": "lh:audit:uses-rel-preload",
      "duration": 2.53,
      "entryType": "measure"
    }, {
      "startTime": 10143.13,
      "name": "lh:computed:LoadSimulator",
      "duration": 0.07,
      "entryType": "measure"
    }, {
      "startTime": 10145.16,
      "name": "lh:audit:uses-rel-preconnect",
      "duration": 1.78,
      "entryType": "measure"
    }, {
      "startTime": 10147.3,
      "name": "lh:audit:font-display",
      "duration": 1.35,
      "entryType": "measure"
    }, {
      "startTime": 10148.67,
      "name": "lh:audit:diagnostics",
      "duration": 0.67,
      "entryType": "measure"
    }, {
      "startTime": 10149.35,
      "name": "lh:audit:network-requests",
      "duration": 1.83,
      "entryType": "measure"
    }, {
      "startTime": 10151.54,
      "name": "lh:audit:network-rtt",
      "duration": 1.38,
      "entryType": "measure"
    }, {
      "startTime": 10153.24,
      "name": "lh:audit:network-server-latency",
      "duration": 1.24,
      "entryType": "measure"
    }, {
      "startTime": 10154.5,
      "name": "lh:audit:main-thread-tasks",
      "duration": 0.31,
      "entryType": "measure"
    }, {
      "startTime": 10154.82,
      "name": "lh:audit:metrics",
      "duration": 1.33,
      "entryType": "measure"
    }, {
      "startTime": 10155.01,
      "name": "lh:computed:TimingSummary",
      "duration": 1.04,
      "entryType": "measure"
    }, {
      "startTime": 10155.28,
      "name": "lh:computed:FirstContentfulPaintAllFrames",
      "duration": 0.07,
      "entryType": "measure"
    }, {
      "startTime": 10155.37,
      "name": "lh:computed:LargestContentfulPaintAllFrames",
      "duration": 0.13,
      "entryType": "measure"
    }, {
      "startTime": 10156.44,
      "name": "lh:audit:performance-budget",
      "duration": 2.03,
      "entryType": "measure"
    }, {
      "startTime": 10156.93,
      "name": "lh:computed:ResourceSummary",
      "duration": 0.85,
      "entryType": "measure"
    }, {
      "startTime": 10158.78,
      "name": "lh:audit:timing-budget",
      "duration": 2.7,
      "entryType": "measure"
    }, {
      "startTime": 10161.79,
      "name": "lh:audit:resource-summary",
      "duration": 3.29,
      "entryType": "measure"
    }, {
      "startTime": 10165.51,
      "name": "lh:audit:third-party-summary",
      "duration": 4.16,
      "entryType": "measure"
    }, {
      "startTime": 10170.04,
      "name": "lh:audit:third-party-facades",
      "duration": 2.48,
      "entryType": "measure"
    }, {
      "startTime": 10172.79,
      "name": "lh:audit:largest-contentful-paint-element",
      "duration": 1.39,
      "entryType": "measure"
    }, {
      "startTime": 10174.39,
      "name": "lh:audit:layout-shift-elements",
      "duration": 0.75,
      "entryType": "measure"
    }, {
      "startTime": 10175.42,
      "name": "lh:audit:long-tasks",
      "duration": 3.45,
      "entryType": "measure"
    }, {
      "startTime": 10179.4,
      "name": "lh:audit:no-unload-listeners",
      "duration": 1.72,
      "entryType": "measure"
    }, {
      "startTime": 10181.42,
      "name": "lh:audit:non-composited-animations",
      "duration": 1.51,
      "entryType": "measure"
    }, {
      "startTime": 10183.48,
      "name": "lh:audit:unsized-images",
      "duration": 2.54,
      "entryType": "measure"
    }, {
      "startTime": 10186.53,
      "name": "lh:audit:valid-source-maps",
      "duration": 3.03,
      "entryType": "measure"
    }, {
      "startTime": 10189.9,
      "name": "lh:audit:preload-lcp-image",
      "duration": 2.87,
      "entryType": "measure"
    }, {
      "startTime": 10190.56,
      "name": "lh:computed:LanternLargestContentfulPaint",
      "duration": 1.32,
      "entryType": "measure"
    }, {
      "startTime": 10190.58,
      "name": "lh:computed:LanternFirstContentfulPaint",
      "duration": 0.64,
      "entryType": "measure"
    }, {
      "startTime": 10193.16,
      "name": "lh:audit:csp-xss",
      "duration": 2.11,
      "entryType": "measure"
    }, {
      "startTime": 10195.3,
      "name": "lh:audit:full-page-screenshot",
      "duration": 0.21,
      "entryType": "measure"
    }, {
      "startTime": 10195.53,
      "name": "lh:audit:script-treemap-data",
      "duration": 175.37,
      "entryType": "measure"
    }, {
      "startTime": 10195.91,
      "name": "lh:computed:JSBundles",
      "duration": 98.06,
      "entryType": "measure"
    }, {
      "startTime": 10294,
      "name": "lh:computed:ModuleDuplication",
      "duration": 0.71,
      "entryType": "measure"
    }, {
      "startTime": 10294.74,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 4.37,
      "entryType": "measure"
    }, {
      "startTime": 10299.2,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 4.04,
      "entryType": "measure"
    }, {
      "startTime": 10303.28,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 7.52,
      "entryType": "measure"
    }, {
      "startTime": 10311.19,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 20.04,
      "entryType": "measure"
    }, {
      "startTime": 10331.36,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 11.76,
      "entryType": "measure"
    }, {
      "startTime": 10343.32,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 0.05,
      "entryType": "measure"
    }, {
      "startTime": 10343.4,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 13.27,
      "entryType": "measure"
    }, {
      "startTime": 10356.85,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 11.93,
      "entryType": "measure"
    }, {
      "startTime": 10368.87,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 0.14,
      "entryType": "measure"
    }, {
      "startTime": 10369.19,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 1.38,
      "entryType": "measure"
    }, {
      "startTime": 10371.25,
      "name": "lh:audit:pwa-cross-browser",
      "duration": 0.98,
      "entryType": "measure"
    }, {
      "startTime": 10372.57,
      "name": "lh:audit:pwa-page-transitions",
      "duration": 0.96,
      "entryType": "measure"
    }, {
      "startTime": 10373.83,
      "name": "lh:audit:pwa-each-page-has-url",
      "duration": 0.85,
      "entryType": "measure"
    }, {
      "startTime": 10375.03,
      "name": "lh:audit:accesskeys",
      "duration": 1.29,
      "entryType": "measure"
    }, {
      "startTime": 10376.7,
      "name": "lh:audit:aria-allowed-attr",
      "duration": 7.1,
      "entryType": "measure"
    }, {
      "startTime": 10384.25,
      "name": "lh:audit:aria-command-name",
      "duration": 2.22,
      "entryType": "measure"
    }, {
      "startTime": 10387.07,
      "name": "lh:audit:aria-hidden-body",
      "duration": 4.88,
      "entryType": "measure"
    }, {
      "startTime": 10392.38,
      "name": "lh:audit:aria-hidden-focus",
      "duration": 1.72,
      "entryType": "measure"
    }, {
      "startTime": 10395.52,
      "name": "lh:audit:aria-input-field-name",
      "duration": 1.71,
      "entryType": "measure"
    }, {
      "startTime": 10398,
      "name": "lh:audit:aria-meter-name",
      "duration": 1.7,
      "entryType": "measure"
    }, {
      "startTime": 10400.09,
      "name": "lh:audit:aria-progressbar-name",
      "duration": 2.53,
      "entryType": "measure"
    }, {
      "startTime": 10402.99,
      "name": "lh:audit:aria-required-attr",
      "duration": 2.4,
      "entryType": "measure"
    }, {
      "startTime": 10406.13,
      "name": "lh:audit:aria-required-children",
      "duration": 2.61,
      "entryType": "measure"
    }, {
      "startTime": 10409.12,
      "name": "lh:audit:aria-required-parent",
      "duration": 3.99,
      "entryType": "measure"
    }, {
      "startTime": 10413.42,
      "name": "lh:audit:aria-roles",
      "duration": 1.89,
      "entryType": "measure"
    }, {
      "startTime": 10415.68,
      "name": "lh:audit:aria-toggle-field-name",
      "duration": 3.14,
      "entryType": "measure"
    }, {
      "startTime": 10419.19,
      "name": "lh:audit:aria-tooltip-name",
      "duration": 3.89,
      "entryType": "measure"
    }, {
      "startTime": 10423.51,
      "name": "lh:audit:aria-treeitem-name",
      "duration": 3.14,
      "entryType": "measure"
    }, {
      "startTime": 10427.01,
      "name": "lh:audit:aria-valid-attr-value",
      "duration": 5.01,
      "entryType": "measure"
    }, {
      "startTime": 10432.35,
      "name": "lh:audit:aria-valid-attr",
      "duration": 3.98,
      "entryType": "measure"
    }, {
      "startTime": 10436.7,
      "name": "lh:audit:button-name",
      "duration": 2.48,
      "entryType": "measure"
    }, {
      "startTime": 10440.5,
      "name": "lh:audit:bypass",
      "duration": 5.53,
      "entryType": "measure"
    }, {
      "startTime": 10446.42,
      "name": "lh:audit:color-contrast",
      "duration": 5.07,
      "entryType": "measure"
    }, {
      "startTime": 10451.93,
      "name": "lh:audit:definition-list",
      "duration": 3.3,
      "entryType": "measure"
    }, {
      "startTime": 10455.58,
      "name": "lh:audit:dlitem",
      "duration": 3.52,
      "entryType": "measure"
    }, {
      "startTime": 10459.45,
      "name": "lh:audit:document-title",
      "duration": 4.43,
      "entryType": "measure"
    }, {
      "startTime": 10464.22,
      "name": "lh:audit:duplicate-id-active",
      "duration": 4.87,
      "entryType": "measure"
    }, {
      "startTime": 10469.39,
      "name": "lh:audit:duplicate-id-aria",
      "duration": 2.28,
      "entryType": "measure"
    }, {
      "startTime": 10472.01,
      "name": "lh:audit:form-field-multiple-labels",
      "duration": 3.02,
      "entryType": "measure"
    }, {
      "startTime": 10475.45,
      "name": "lh:audit:frame-title",
      "duration": 2.57,
      "entryType": "measure"
    }, {
      "startTime": 10478.41,
      "name": "lh:audit:heading-order",
      "duration": 5.53,
      "entryType": "measure"
    }, {
      "startTime": 10484.41,
      "name": "lh:audit:html-has-lang",
      "duration": 6.3,
      "entryType": "measure"
    }, {
      "startTime": 10491.1,
      "name": "lh:audit:html-lang-valid",
      "duration": 5.7,
      "entryType": "measure"
    }, {
      "startTime": 10497.12,
      "name": "lh:audit:image-alt",
      "duration": 4.2,
      "entryType": "measure"
    }, {
      "startTime": 10501.69,
      "name": "lh:audit:input-image-alt",
      "duration": 3.92,
      "entryType": "measure"
    }, {
      "startTime": 10506.19,
      "name": "lh:audit:label",
      "duration": 3.16,
      "entryType": "measure"
    }, {
      "startTime": 10509.74,
      "name": "lh:audit:link-name",
      "duration": 4.65,
      "entryType": "measure"
    }, {
      "startTime": 10514.81,
      "name": "lh:audit:list",
      "duration": 5.71,
      "entryType": "measure"
    }, {
      "startTime": 10521,
      "name": "lh:audit:listitem",
      "duration": 5.24,
      "entryType": "measure"
    }, {
      "startTime": 10526.75,
      "name": "lh:audit:meta-refresh",
      "duration": 3.68,
      "entryType": "measure"
    }, {
      "startTime": 10530.92,
      "name": "lh:audit:meta-viewport",
      "duration": 7.05,
      "entryType": "measure"
    }, {
      "startTime": 10538.36,
      "name": "lh:audit:object-alt",
      "duration": 3.5,
      "entryType": "measure"
    }, {
      "startTime": 10542.26,
      "name": "lh:audit:tabindex",
      "duration": 5.5,
      "entryType": "measure"
    }, {
      "startTime": 10548.28,
      "name": "lh:audit:td-headers-attr",
      "duration": 7.31,
      "entryType": "measure"
    }, {
      "startTime": 10556.08,
      "name": "lh:audit:th-has-data-cells",
      "duration": 5.83,
      "entryType": "measure"
    }, {
      "startTime": 10562.28,
      "name": "lh:audit:valid-lang",
      "duration": 4.1,
      "entryType": "measure"
    }, {
      "startTime": 10566.75,
      "name": "lh:audit:video-caption",
      "duration": 5.18,
      "entryType": "measure"
    }, {
      "startTime": 10571.97,
      "name": "lh:audit:custom-controls-labels",
      "duration": 0.26,
      "entryType": "measure"
    }, {
      "startTime": 10572.26,
      "name": "lh:audit:custom-controls-roles",
      "duration": 0.18,
      "entryType": "measure"
    }, {
      "startTime": 10572.45,
      "name": "lh:audit:focus-traps",
      "duration": 0.34,
      "entryType": "measure"
    }, {
      "startTime": 10572.8,
      "name": "lh:audit:focusable-controls",
      "duration": 0.2,
      "entryType": "measure"
    }, {
      "startTime": 10573.02,
      "name": "lh:audit:interactive-element-affordance",
      "duration": 0.21,
      "entryType": "measure"
    }, {
      "startTime": 10573.25,
      "name": "lh:audit:logical-tab-order",
      "duration": 0.17,
      "entryType": "measure"
    }, {
      "startTime": 10573.43,
      "name": "lh:audit:managed-focus",
      "duration": 0.19,
      "entryType": "measure"
    }, {
      "startTime": 10573.63,
      "name": "lh:audit:offscreen-content-hidden",
      "duration": 0.18,
      "entryType": "measure"
    }, {
      "startTime": 10573.82,
      "name": "lh:audit:use-landmarks",
      "duration": 0.21,
      "entryType": "measure"
    }, {
      "startTime": 10574.04,
      "name": "lh:audit:visual-order-follows-dom",
      "duration": 0.18,
      "entryType": "measure"
    }, {
      "startTime": 10574.57,
      "name": "lh:audit:uses-long-cache-ttl",
      "duration": 2.24,
      "entryType": "measure"
    }, {
      "startTime": 10577.1,
      "name": "lh:audit:total-byte-weight",
      "duration": 1.4,
      "entryType": "measure"
    }, {
      "startTime": 10578.8,
      "name": "lh:audit:offscreen-images",
      "duration": 4.23,
      "entryType": "measure"
    }, {
      "startTime": 10583.31,
      "name": "lh:audit:render-blocking-resources",
      "duration": 2.74,
      "entryType": "measure"
    }, {
      "startTime": 10584.17,
      "name": "lh:computed:UnusedCSS",
      "duration": 0.68,
      "entryType": "measure"
    }, {
      "startTime": 10584.88,
      "name": "lh:computed:FirstContentfulPaint",
      "duration": 0.56,
      "entryType": "measure"
    }, {
      "startTime": 10584.92,
      "name": "lh:computed:LanternFirstContentfulPaint",
      "duration": 0.51,
      "entryType": "measure"
    }, {
      "startTime": 10586.24,
      "name": "lh:audit:unminified-css",
      "duration": 7.82,
      "entryType": "measure"
    }, {
      "startTime": 10594.28,
      "name": "lh:audit:unminified-javascript",
      "duration": 45.23,
      "entryType": "measure"
    }, {
      "startTime": 10639.8,
      "name": "lh:audit:unused-css-rules",
      "duration": 4.83,
      "entryType": "measure"
    }, {
      "startTime": 10644.89,
      "name": "lh:audit:unused-javascript",
      "duration": 159.51,
      "entryType": "measure"
    }, {
      "startTime": 10645.53,
      "name": "lh:computed:JSBundles",
      "duration": 46.18,
      "entryType": "measure"
    }, {
      "startTime": 10691.87,
      "name": "lh:computed:UnusedJavascriptSummary",
      "duration": 0.08,
      "entryType": "measure"
    }, {
      "startTime": 10804.71,
      "name": "lh:audit:modern-image-formats",
      "duration": 3.18,
      "entryType": "measure"
    }, {
      "startTime": 10808.09,
      "name": "lh:audit:uses-optimized-images",
      "duration": 4.51,
      "entryType": "measure"
    }, {
      "startTime": 10812.85,
      "name": "lh:audit:uses-text-compression",
      "duration": 2.72,
      "entryType": "measure"
    }, {
      "startTime": 10815.79,
      "name": "lh:audit:uses-responsive-images",
      "duration": 3.44,
      "entryType": "measure"
    }, {
      "startTime": 10819.62,
      "name": "lh:audit:efficient-animated-content",
      "duration": 3.22,
      "entryType": "measure"
    }, {
      "startTime": 10823.09,
      "name": "lh:audit:duplicated-javascript",
      "duration": 24.21,
      "entryType": "measure"
    }, {
      "startTime": 10823.75,
      "name": "lh:computed:ModuleDuplication",
      "duration": 20.5,
      "entryType": "measure"
    }, {
      "startTime": 10823.77,
      "name": "lh:computed:JSBundles",
      "duration": 20.28,
      "entryType": "measure"
    }, {
      "startTime": 10847.77,
      "name": "lh:audit:legacy-javascript",
      "duration": 32.09,
      "entryType": "measure"
    }, {
      "startTime": 10880.1,
      "name": "lh:audit:appcache-manifest",
      "duration": 0.93,
      "entryType": "measure"
    }, {
      "startTime": 10881.33,
      "name": "lh:audit:doctype",
      "duration": 0.91,
      "entryType": "measure"
    }, {
      "startTime": 10882.62,
      "name": "lh:audit:charset",
      "duration": 1.56,
      "entryType": "measure"
    }, {
      "startTime": 10884.55,
      "name": "lh:audit:dom-size",
      "duration": 2.05,
      "entryType": "measure"
    }, {
      "startTime": 10886.93,
      "name": "lh:audit:external-anchors-use-rel-noopener",
      "duration": 1.38,
      "entryType": "measure"
    }, {
      "startTime": 10888.68,
      "name": "lh:audit:geolocation-on-start",
      "duration": 1.19,
      "entryType": "measure"
    }, {
      "startTime": 10890.29,
      "name": "lh:audit:inspector-issues",
      "duration": 3.05,
      "entryType": "measure"
    }, {
      "startTime": 10894.13,
      "name": "lh:audit:no-document-write",
      "duration": 1.09,
      "entryType": "measure"
    }, {
      "startTime": 10895.58,
      "name": "lh:audit:no-vulnerable-libraries",
      "duration": 3.39,
      "entryType": "measure"
    }, {
      "startTime": 10899.17,
      "name": "lh:audit:js-libraries",
      "duration": 1.14,
      "entryType": "measure"
    }, {
      "startTime": 10900.71,
      "name": "lh:audit:notification-on-start",
      "duration": 1.2,
      "entryType": "measure"
    }, {
      "startTime": 10902.2,
      "name": "lh:audit:password-inputs-can-be-pasted-into",
      "duration": 0.93,
      "entryType": "measure"
    }, {
      "startTime": 10903.33,
      "name": "lh:audit:uses-http2",
      "duration": 2.9,
      "entryType": "measure"
    }, {
      "startTime": 10906.59,
      "name": "lh:audit:uses-passive-event-listeners",
      "duration": 1.1,
      "entryType": "measure"
    }, {
      "startTime": 10908,
      "name": "lh:audit:meta-description",
      "duration": 0.94,
      "entryType": "measure"
    }, {
      "startTime": 10909.22,
      "name": "lh:audit:http-status-code",
      "duration": 0.94,
      "entryType": "measure"
    }, {
      "startTime": 10911.14,
      "name": "lh:audit:font-size",
      "duration": 1.59,
      "entryType": "measure"
    }, {
      "startTime": 10913,
      "name": "lh:audit:link-text",
      "duration": 1.14,
      "entryType": "measure"
    }, {
      "startTime": 10914.51,
      "name": "lh:audit:crawlable-anchors",
      "duration": 1.61,
      "entryType": "measure"
    }, {
      "startTime": 10916.49,
      "name": "lh:audit:is-crawlable",
      "duration": 1.51,
      "entryType": "measure"
    }, {
      "startTime": 10918.3,
      "name": "lh:audit:robots-txt",
      "duration": 0.96,
      "entryType": "measure"
    }, {
      "startTime": 10919.61,
      "name": "lh:audit:tap-targets",
      "duration": 2.88,
      "entryType": "measure"
    }, {
      "startTime": 10922.85,
      "name": "lh:audit:hreflang",
      "duration": 1.17,
      "entryType": "measure"
    }, {
      "startTime": 10924.31,
      "name": "lh:audit:plugins",
      "duration": 0.95,
      "entryType": "measure"
    }, {
      "startTime": 10925.54,
      "name": "lh:audit:canonical",
      "duration": 1.03,
      "entryType": "measure"
    }, {
      "startTime": 10926.88,
      "name": "lh:audit:structured-data",
      "duration": 0.78,
      "entryType": "measure"
    }, {
      "startTime": 10927.68,
      "name": "lh:runner:generate",
      "duration": 0.73,
      "entryType": "measure"
    }],
    "total": 9696.03
  },
  "i18n": {
    "rendererFormattedStrings": {
      "calculatorLink": "See calculator.",
      "crcInitialNavigation": "Initial Navigation",
      "crcLongestDurationLabel": "Maximum critical path latency:",
      "dropdownCopyJSON": "Copy JSON",
      "dropdownDarkTheme": "Toggle Dark Theme",
      "dropdownPrintExpanded": "Print Expanded",
      "dropdownPrintSummary": "Print Summary",
      "dropdownSaveGist": "Save as Gist",
      "dropdownSaveHTML": "Save as HTML",
      "dropdownSaveJSON": "Save as JSON",
      "dropdownViewer": "Open in Viewer",
      "errorLabel": "Error!",
      "errorMissingAuditInfo": "Report error: no audit information",
      "footerIssue": "File an issue",
      "labDataTitle": "Lab Data",
      "lsPerformanceCategoryDescription": "[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.",
      "manualAuditsGroupTitle": "Additional items to manually check",
      "notApplicableAuditsGroupTitle": "Not applicable",
      "opportunityResourceColumnLabel": "Opportunity",
      "opportunitySavingsColumnLabel": "Estimated Savings",
      "passedAuditsGroupTitle": "Passed audits",
      "runtimeDesktopEmulation": "Emulated Desktop",
      "runtimeMobileEmulation": "Emulated Moto G4",
      "runtimeNoEmulation": "No emulation",
      "runtimeSettingsAxeVersion": "Axe version",
      "runtimeSettingsBenchmark": "CPU/Memory Power",
      "runtimeSettingsChannel": "Channel",
      "runtimeSettingsCPUThrottling": "CPU throttling",
      "runtimeSettingsDevice": "Device",
      "runtimeSettingsFetchTime": "Fetch Time",
      "runtimeSettingsNetworkThrottling": "Network throttling",
      "runtimeSettingsTitle": "Runtime Settings",
      "runtimeSettingsUA": "User agent (host)",
      "runtimeSettingsUANetwork": "User agent (network)",
      "runtimeSettingsUrl": "URL",
      "runtimeUnknown": "Unknown",
      "showRelevantAudits": "Show audits relevant to:",
      "snippetCollapseButtonLabel": "Collapse snippet",
      "snippetExpandButtonLabel": "Expand snippet",
      "thirdPartyResourcesLabel": "Show 3rd-party resources",
      "throttlingProvided": "Provided by environment",
      "toplevelWarningsMessage": "There were issues affecting this run of Lighthouse:",
      "varianceDisclaimer": "Values are estimated and may vary. The [performance score is calculated](https://web.dev/performance-scoring/) directly from these metrics.",
      "viewTreemapLabel": "View Treemap",
      "warningAuditsGroupTitle": "Passed audits but with warnings",
      "warningHeader": "Warnings: "
    },
    "icuMessagePaths": {
      "lighthouse-core/audits/is-on-https.js | title": ["audits[is-on-https].title"],
      "lighthouse-core/audits/is-on-https.js | description": ["audits[is-on-https].description"],
      "lighthouse-core/audits/redirects-http.js | title": ["audits[redirects-http].title"],
      "lighthouse-core/audits/redirects-http.js | description": ["audits[redirects-http].description"],
      "lighthouse-core/audits/service-worker.js | title": ["audits[service-worker].title"],
      "lighthouse-core/audits/service-worker.js | description": ["audits[service-worker].description"],
      "lighthouse-core/audits/viewport.js | title": ["audits.viewport.title"],
      "lighthouse-core/audits/viewport.js | description": ["audits.viewport.description"],
      "lighthouse-core/lib/i18n/i18n.js | firstContentfulPaintMetric": ["audits[first-contentful-paint].title"],
      "lighthouse-core/audits/metrics/first-contentful-paint.js | description": ["audits[first-contentful-paint].description"],
      "lighthouse-core/lib/i18n/i18n.js | seconds": [{
        "values": {
          "timeInMs": 1043.0879999999997
        },
        "path": "audits[first-contentful-paint].displayValue"
      }, {
        "values": {
          "timeInMs": 2760.3799999999997
        },
        "path": "audits[largest-contentful-paint].displayValue"
      }, {
        "values": {
          "timeInMs": 1054.5879999999997
        },
        "path": "audits[first-meaningful-paint].displayValue"
      }, {
        "values": {
          "timeInMs": 1370.6637618633004
        },
        "path": "audits[speed-index].displayValue"
      }, {
        "values": {
          "timeInMs": 1103.0879999999997
        },
        "path": "audits.interactive.displayValue"
      }, {
        "values": {
          "timeInMs": 861.5840000000003
        },
        "path": "audits[mainthread-work-breakdown].displayValue"
      }, {
        "values": {
          "timeInMs": 222.0519999999999
        },
        "path": "audits[bootup-time].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | largestContentfulPaintMetric": ["audits[largest-contentful-paint].title"],
      "lighthouse-core/audits/metrics/largest-contentful-paint.js | description": ["audits[largest-contentful-paint].description"],
      "lighthouse-core/lib/i18n/i18n.js | firstMeaningfulPaintMetric": ["audits[first-meaningful-paint].title"],
      "lighthouse-core/audits/metrics/first-meaningful-paint.js | description": ["audits[first-meaningful-paint].description"],
      "lighthouse-core/lib/i18n/i18n.js | speedIndexMetric": ["audits[speed-index].title"],
      "lighthouse-core/audits/metrics/speed-index.js | description": ["audits[speed-index].description"],
      "lighthouse-core/lib/i18n/i18n.js | totalBlockingTimeMetric": ["audits[total-blocking-time].title"],
      "lighthouse-core/audits/metrics/total-blocking-time.js | description": ["audits[total-blocking-time].description"],
      "lighthouse-core/lib/i18n/i18n.js | ms": [{
        "values": {
          "timeInMs": 0.5
        },
        "path": "audits[total-blocking-time].displayValue"
      }, {
        "values": {
          "timeInMs": 51
        },
        "path": "audits[max-potential-fid].displayValue"
      }, {
        "values": {
          "timeInMs": 43.563
        },
        "path": "audits[network-rtt].displayValue"
      }, {
        "values": {
          "timeInMs": 49.233999999999995
        },
        "path": "audits[network-server-latency].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | maxPotentialFIDMetric": ["audits[max-potential-fid].title"],
      "lighthouse-core/audits/metrics/max-potential-fid.js | description": ["audits[max-potential-fid].description"],
      "lighthouse-core/lib/i18n/i18n.js | cumulativeLayoutShiftMetric": ["audits[cumulative-layout-shift].title"],
      "lighthouse-core/audits/metrics/cumulative-layout-shift.js | description": ["audits[cumulative-layout-shift].description"],
      "lighthouse-core/audits/errors-in-console.js | title": ["audits[errors-in-console].title"],
      "lighthouse-core/audits/errors-in-console.js | description": ["audits[errors-in-console].description"],
      "lighthouse-core/audits/server-response-time.js | title": ["audits[server-response-time].title"],
      "lighthouse-core/audits/server-response-time.js | description": ["audits[server-response-time].description"],
      "lighthouse-core/audits/server-response-time.js | displayValue": [{
        "values": {
          "timeInMs": 43.60500000000002
        },
        "path": "audits[server-response-time].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnURL": ["audits[server-response-time].details.headings[0].label", "audits[bootup-time].details.headings[0].text", "audits[network-rtt].details.headings[0].text", "audits[network-server-latency].details.headings[0].text", "audits[long-tasks].details.headings[0].text", "audits[valid-source-maps].details.headings[0].text", "audits[uses-long-cache-ttl].details.headings[0].text", "audits[total-byte-weight].details.headings[0].text", "audits[unused-javascript].details.headings[0].label", "audits[uses-responsive-images].details.headings[1].label", "audits[legacy-javascript].details.headings[0].label"],
      "lighthouse-core/lib/i18n/i18n.js | columnTimeSpent": ["audits[server-response-time].details.headings[1].label", "audits[mainthread-work-breakdown].details.headings[1].text", "audits[network-rtt].details.headings[1].text", "audits[network-server-latency].details.headings[1].text"],
      "lighthouse-core/lib/i18n/i18n.js | interactiveMetric": ["audits.interactive.title"],
      "lighthouse-core/audits/metrics/interactive.js | description": ["audits.interactive.description"],
      "lighthouse-core/audits/user-timings.js | title": ["audits[user-timings].title"],
      "lighthouse-core/audits/user-timings.js | description": ["audits[user-timings].description"],
      "lighthouse-core/audits/critical-request-chains.js | title": ["audits[critical-request-chains].title"],
      "lighthouse-core/audits/critical-request-chains.js | description": ["audits[critical-request-chains].description"],
      "lighthouse-core/audits/redirects.js | title": ["audits.redirects.title"],
      "lighthouse-core/audits/redirects.js | description": ["audits.redirects.description"],
      "lighthouse-core/audits/installable-manifest.js | title": ["audits[installable-manifest].title"],
      "lighthouse-core/audits/installable-manifest.js | description": ["audits[installable-manifest].description"],
      "lighthouse-core/audits/apple-touch-icon.js | title": ["audits[apple-touch-icon].title"],
      "lighthouse-core/audits/apple-touch-icon.js | description": ["audits[apple-touch-icon].description"],
      "lighthouse-core/audits/splash-screen.js | title": ["audits[splash-screen].title"],
      "lighthouse-core/audits/splash-screen.js | description": ["audits[splash-screen].description"],
      "lighthouse-core/audits/themed-omnibox.js | title": ["audits[themed-omnibox].title"],
      "lighthouse-core/audits/themed-omnibox.js | description": ["audits[themed-omnibox].description"],
      "lighthouse-core/audits/maskable-icon.js | failureTitle": ["audits[maskable-icon].title"],
      "lighthouse-core/audits/maskable-icon.js | description": ["audits[maskable-icon].description"],
      "lighthouse-core/audits/content-width.js | title": ["audits[content-width].title"],
      "lighthouse-core/audits/content-width.js | description": ["audits[content-width].description"],
      "lighthouse-core/audits/image-aspect-ratio.js | title": ["audits[image-aspect-ratio].title"],
      "lighthouse-core/audits/image-aspect-ratio.js | description": ["audits[image-aspect-ratio].description"],
      "lighthouse-core/audits/image-size-responsive.js | title": ["audits[image-size-responsive].title"],
      "lighthouse-core/audits/image-size-responsive.js | description": ["audits[image-size-responsive].description"],
      "lighthouse-core/audits/preload-fonts.js | title": ["audits[preload-fonts].title"],
      "lighthouse-core/audits/preload-fonts.js | description": ["audits[preload-fonts].description"],
      "lighthouse-core/audits/deprecations.js | title": ["audits.deprecations.title"],
      "lighthouse-core/audits/deprecations.js | description": ["audits.deprecations.description"],
      "lighthouse-core/audits/mainthread-work-breakdown.js | title": ["audits[mainthread-work-breakdown].title"],
      "lighthouse-core/audits/mainthread-work-breakdown.js | description": ["audits[mainthread-work-breakdown].description"],
      "lighthouse-core/audits/mainthread-work-breakdown.js | columnCategory": ["audits[mainthread-work-breakdown].details.headings[0].text"],
      "lighthouse-core/audits/bootup-time.js | title": ["audits[bootup-time].title"],
      "lighthouse-core/audits/bootup-time.js | description": ["audits[bootup-time].description"],
      "lighthouse-core/audits/bootup-time.js | columnTotal": ["audits[bootup-time].details.headings[1].text"],
      "lighthouse-core/audits/bootup-time.js | columnScriptEval": ["audits[bootup-time].details.headings[2].text"],
      "lighthouse-core/audits/bootup-time.js | columnScriptParse": ["audits[bootup-time].details.headings[3].text"],
      "lighthouse-core/audits/uses-rel-preload.js | title": ["audits[uses-rel-preload].title"],
      "lighthouse-core/audits/uses-rel-preload.js | description": ["audits[uses-rel-preload].description"],
      "lighthouse-core/audits/uses-rel-preload.js | crossoriginWarning": [{
        "values": {
          "preloadURL": "https://d13z.dev/page-data/index/page-data.json"
        },
        "path": "audits[uses-rel-preload].warnings[0]"
      }, {
        "values": {
          "preloadURL": "https://d13z.dev/page-data/sq/d/251939775.json"
        },
        "path": "audits[uses-rel-preload].warnings[1]"
      }, {
        "values": {
          "preloadURL": "https://d13z.dev/page-data/sq/d/3942705351.json"
        },
        "path": "audits[uses-rel-preload].warnings[2]"
      }, {
        "values": {
          "preloadURL": "https://d13z.dev/page-data/sq/d/401334301.json"
        },
        "path": "audits[uses-rel-preload].warnings[3]"
      }, {
        "values": {
          "preloadURL": "https://d13z.dev/page-data/app-data.json"
        },
        "path": "audits[uses-rel-preload].warnings[4]"
      }],
      "lighthouse-core/audits/uses-rel-preconnect.js | title": ["audits[uses-rel-preconnect].title"],
      "lighthouse-core/audits/uses-rel-preconnect.js | description": ["audits[uses-rel-preconnect].description"],
      "lighthouse-core/audits/font-display.js | title": ["audits[font-display].title"],
      "lighthouse-core/audits/font-display.js | description": ["audits[font-display].description"],
      "lighthouse-core/audits/network-rtt.js | title": ["audits[network-rtt].title"],
      "lighthouse-core/audits/network-rtt.js | description": ["audits[network-rtt].description"],
      "lighthouse-core/audits/network-server-latency.js | title": ["audits[network-server-latency].title"],
      "lighthouse-core/audits/network-server-latency.js | description": ["audits[network-server-latency].description"],
      "lighthouse-core/audits/performance-budget.js | title": ["audits[performance-budget].title"],
      "lighthouse-core/audits/performance-budget.js | description": ["audits[performance-budget].description"],
      "lighthouse-core/audits/timing-budget.js | title": ["audits[timing-budget].title"],
      "lighthouse-core/audits/timing-budget.js | description": ["audits[timing-budget].description"],
      "lighthouse-core/audits/resource-summary.js | title": ["audits[resource-summary].title"],
      "lighthouse-core/audits/resource-summary.js | description": ["audits[resource-summary].description"],
      "lighthouse-core/audits/resource-summary.js | displayValue": [{
        "values": {
          "requestCount": 65,
          "byteCount": 316597
        },
        "path": "audits[resource-summary].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnResourceType": ["audits[resource-summary].details.headings[0].text"],
      "lighthouse-core/lib/i18n/i18n.js | columnRequests": ["audits[resource-summary].details.headings[1].text"],
      "lighthouse-core/lib/i18n/i18n.js | columnTransferSize": ["audits[resource-summary].details.headings[2].text", "audits[third-party-summary].details.headings[1].text", "audits[uses-long-cache-ttl].details.headings[2].text", "audits[total-byte-weight].details.headings[1].text", "audits[unused-javascript].details.headings[1].label"],
      "lighthouse-core/lib/i18n/i18n.js | totalResourceType": ["audits[resource-summary].details.items[0].label"],
      "lighthouse-core/lib/i18n/i18n.js | scriptResourceType": ["audits[resource-summary].details.items[1].label"],
      "lighthouse-core/lib/i18n/i18n.js | otherResourceType": ["audits[resource-summary].details.items[2].label"],
      "lighthouse-core/lib/i18n/i18n.js | imageResourceType": ["audits[resource-summary].details.items[3].label"],
      "lighthouse-core/lib/i18n/i18n.js | documentResourceType": ["audits[resource-summary].details.items[4].label"],
      "lighthouse-core/lib/i18n/i18n.js | stylesheetResourceType": ["audits[resource-summary].details.items[5].label"],
      "lighthouse-core/lib/i18n/i18n.js | mediaResourceType": ["audits[resource-summary].details.items[6].label"],
      "lighthouse-core/lib/i18n/i18n.js | fontResourceType": ["audits[resource-summary].details.items[7].label"],
      "lighthouse-core/lib/i18n/i18n.js | thirdPartyResourceType": ["audits[resource-summary].details.items[8].label"],
      "lighthouse-core/audits/third-party-summary.js | title": ["audits[third-party-summary].title"],
      "lighthouse-core/audits/third-party-summary.js | description": ["audits[third-party-summary].description"],
      "lighthouse-core/audits/third-party-summary.js | displayValue": [{
        "values": {
          "timeInMs": 0
        },
        "path": "audits[third-party-summary].displayValue"
      }],
      "lighthouse-core/audits/third-party-summary.js | columnThirdParty": ["audits[third-party-summary].details.headings[0].text"],
      "lighthouse-core/lib/i18n/i18n.js | columnBlockingTime": ["audits[third-party-summary].details.headings[2].text"],
      "lighthouse-core/audits/third-party-facades.js | title": ["audits[third-party-facades].title"],
      "lighthouse-core/audits/third-party-facades.js | description": ["audits[third-party-facades].description"],
      "lighthouse-core/audits/largest-contentful-paint-element.js | title": ["audits[largest-contentful-paint-element].title"],
      "lighthouse-core/audits/largest-contentful-paint-element.js | description": ["audits[largest-contentful-paint-element].description"],
      "lighthouse-core/lib/i18n/i18n.js | displayValueElementsFound": [{
        "values": {
          "nodeCount": 1
        },
        "path": "audits[largest-contentful-paint-element].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnElement": ["audits[largest-contentful-paint-element].details.headings[0].text", "audits[dom-size].details.headings[1].text"],
      "lighthouse-core/audits/layout-shift-elements.js | title": ["audits[layout-shift-elements].title"],
      "lighthouse-core/audits/layout-shift-elements.js | description": ["audits[layout-shift-elements].description"],
      "lighthouse-core/audits/long-tasks.js | title": ["audits[long-tasks].title"],
      "lighthouse-core/audits/long-tasks.js | description": ["audits[long-tasks].description"],
      "lighthouse-core/audits/long-tasks.js | displayValue": [{
        "values": {
          "itemCount": 2
        },
        "path": "audits[long-tasks].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnStartTime": ["audits[long-tasks].details.headings[1].text"],
      "lighthouse-core/lib/i18n/i18n.js | columnDuration": ["audits[long-tasks].details.headings[2].text"],
      "lighthouse-core/audits/no-unload-listeners.js | title": ["audits[no-unload-listeners].title"],
      "lighthouse-core/audits/no-unload-listeners.js | description": ["audits[no-unload-listeners].description"],
      "lighthouse-core/audits/non-composited-animations.js | title": ["audits[non-composited-animations].title"],
      "lighthouse-core/audits/non-composited-animations.js | description": ["audits[non-composited-animations].description"],
      "lighthouse-core/audits/unsized-images.js | title": ["audits[unsized-images].title"],
      "lighthouse-core/audits/unsized-images.js | description": ["audits[unsized-images].description"],
      "lighthouse-core/audits/valid-source-maps.js | title": ["audits[valid-source-maps].title"],
      "lighthouse-core/audits/valid-source-maps.js | description": ["audits[valid-source-maps].description"],
      "lighthouse-core/audits/valid-source-maps.js | columnMapURL": ["audits[valid-source-maps].details.headings[1].text"],
      "lighthouse-core/audits/preload-lcp-image.js | title": ["audits[preload-lcp-image].title"],
      "lighthouse-core/audits/preload-lcp-image.js | description": ["audits[preload-lcp-image].description"],
      "lighthouse-core/audits/csp-xss.js | title": ["audits[csp-xss].title"],
      "lighthouse-core/audits/csp-xss.js | description": ["audits[csp-xss].description"],
      "lighthouse-core/lib/i18n/i18n.js | columnDescription": ["audits[csp-xss].details.headings[0].text"],
      "lighthouse-core/audits/csp-xss.js | columnDirective": ["audits[csp-xss].details.headings[1].text"],
      "lighthouse-core/audits/csp-xss.js | columnSeverity": ["audits[csp-xss].details.headings[2].text"],
      "lighthouse-core/lib/i18n/i18n.js | itemSeverityHigh": ["audits[csp-xss].details.items[0].severity"],
      "lighthouse-core/audits/csp-xss.js | noCsp": ["audits[csp-xss].details.items[0].description"],
      "lighthouse-core/audits/manual/pwa-cross-browser.js | title": ["audits[pwa-cross-browser].title"],
      "lighthouse-core/audits/manual/pwa-cross-browser.js | description": ["audits[pwa-cross-browser].description"],
      "lighthouse-core/audits/manual/pwa-page-transitions.js | title": ["audits[pwa-page-transitions].title"],
      "lighthouse-core/audits/manual/pwa-page-transitions.js | description": ["audits[pwa-page-transitions].description"],
      "lighthouse-core/audits/manual/pwa-each-page-has-url.js | title": ["audits[pwa-each-page-has-url].title"],
      "lighthouse-core/audits/manual/pwa-each-page-has-url.js | description": ["audits[pwa-each-page-has-url].description"],
      "lighthouse-core/audits/accessibility/accesskeys.js | title": ["audits.accesskeys.title"],
      "lighthouse-core/audits/accessibility/accesskeys.js | description": ["audits.accesskeys.description"],
      "lighthouse-core/audits/accessibility/aria-allowed-attr.js | title": ["audits[aria-allowed-attr].title"],
      "lighthouse-core/audits/accessibility/aria-allowed-attr.js | description": ["audits[aria-allowed-attr].description"],
      "lighthouse-core/audits/accessibility/aria-command-name.js | title": ["audits[aria-command-name].title"],
      "lighthouse-core/audits/accessibility/aria-command-name.js | description": ["audits[aria-command-name].description"],
      "lighthouse-core/audits/accessibility/aria-hidden-body.js | title": ["audits[aria-hidden-body].title"],
      "lighthouse-core/audits/accessibility/aria-hidden-body.js | description": ["audits[aria-hidden-body].description"],
      "lighthouse-core/audits/accessibility/aria-hidden-focus.js | title": ["audits[aria-hidden-focus].title"],
      "lighthouse-core/audits/accessibility/aria-hidden-focus.js | description": ["audits[aria-hidden-focus].description"],
      "lighthouse-core/audits/accessibility/aria-input-field-name.js | title": ["audits[aria-input-field-name].title"],
      "lighthouse-core/audits/accessibility/aria-input-field-name.js | description": ["audits[aria-input-field-name].description"],
      "lighthouse-core/audits/accessibility/aria-meter-name.js | title": ["audits[aria-meter-name].title"],
      "lighthouse-core/audits/accessibility/aria-meter-name.js | description": ["audits[aria-meter-name].description"],
      "lighthouse-core/audits/accessibility/aria-progressbar-name.js | title": ["audits[aria-progressbar-name].title"],
      "lighthouse-core/audits/accessibility/aria-progressbar-name.js | description": ["audits[aria-progressbar-name].description"],
      "lighthouse-core/audits/accessibility/aria-required-attr.js | title": ["audits[aria-required-attr].title"],
      "lighthouse-core/audits/accessibility/aria-required-attr.js | description": ["audits[aria-required-attr].description"],
      "lighthouse-core/audits/accessibility/aria-required-children.js | title": ["audits[aria-required-children].title"],
      "lighthouse-core/audits/accessibility/aria-required-children.js | description": ["audits[aria-required-children].description"],
      "lighthouse-core/audits/accessibility/aria-required-parent.js | title": ["audits[aria-required-parent].title"],
      "lighthouse-core/audits/accessibility/aria-required-parent.js | description": ["audits[aria-required-parent].description"],
      "lighthouse-core/audits/accessibility/aria-roles.js | title": ["audits[aria-roles].title"],
      "lighthouse-core/audits/accessibility/aria-roles.js | description": ["audits[aria-roles].description"],
      "lighthouse-core/audits/accessibility/aria-toggle-field-name.js | title": ["audits[aria-toggle-field-name].title"],
      "lighthouse-core/audits/accessibility/aria-toggle-field-name.js | description": ["audits[aria-toggle-field-name].description"],
      "lighthouse-core/audits/accessibility/aria-tooltip-name.js | title": ["audits[aria-tooltip-name].title"],
      "lighthouse-core/audits/accessibility/aria-tooltip-name.js | description": ["audits[aria-tooltip-name].description"],
      "lighthouse-core/audits/accessibility/aria-treeitem-name.js | title": ["audits[aria-treeitem-name].title"],
      "lighthouse-core/audits/accessibility/aria-treeitem-name.js | description": ["audits[aria-treeitem-name].description"],
      "lighthouse-core/audits/accessibility/aria-valid-attr-value.js | title": ["audits[aria-valid-attr-value].title"],
      "lighthouse-core/audits/accessibility/aria-valid-attr-value.js | description": ["audits[aria-valid-attr-value].description"],
      "lighthouse-core/audits/accessibility/aria-valid-attr.js | title": ["audits[aria-valid-attr].title"],
      "lighthouse-core/audits/accessibility/aria-valid-attr.js | description": ["audits[aria-valid-attr].description"],
      "lighthouse-core/audits/accessibility/button-name.js | title": ["audits[button-name].title"],
      "lighthouse-core/audits/accessibility/button-name.js | description": ["audits[button-name].description"],
      "lighthouse-core/audits/accessibility/bypass.js | title": ["audits.bypass.title"],
      "lighthouse-core/audits/accessibility/bypass.js | description": ["audits.bypass.description"],
      "lighthouse-core/audits/accessibility/color-contrast.js | failureTitle": ["audits[color-contrast].title"],
      "lighthouse-core/audits/accessibility/color-contrast.js | description": ["audits[color-contrast].description"],
      "lighthouse-core/lib/i18n/i18n.js | columnFailingElem": ["audits[color-contrast].details.headings[0].text"],
      "lighthouse-core/audits/accessibility/definition-list.js | title": ["audits[definition-list].title"],
      "lighthouse-core/audits/accessibility/definition-list.js | description": ["audits[definition-list].description"],
      "lighthouse-core/audits/accessibility/dlitem.js | title": ["audits.dlitem.title"],
      "lighthouse-core/audits/accessibility/dlitem.js | description": ["audits.dlitem.description"],
      "lighthouse-core/audits/accessibility/document-title.js | title": ["audits[document-title].title"],
      "lighthouse-core/audits/accessibility/document-title.js | description": ["audits[document-title].description"],
      "lighthouse-core/audits/accessibility/duplicate-id-active.js | title": ["audits[duplicate-id-active].title"],
      "lighthouse-core/audits/accessibility/duplicate-id-active.js | description": ["audits[duplicate-id-active].description"],
      "lighthouse-core/audits/accessibility/duplicate-id-aria.js | title": ["audits[duplicate-id-aria].title"],
      "lighthouse-core/audits/accessibility/duplicate-id-aria.js | description": ["audits[duplicate-id-aria].description"],
      "lighthouse-core/audits/accessibility/form-field-multiple-labels.js | title": ["audits[form-field-multiple-labels].title"],
      "lighthouse-core/audits/accessibility/form-field-multiple-labels.js | description": ["audits[form-field-multiple-labels].description"],
      "lighthouse-core/audits/accessibility/frame-title.js | title": ["audits[frame-title].title"],
      "lighthouse-core/audits/accessibility/frame-title.js | description": ["audits[frame-title].description"],
      "lighthouse-core/audits/accessibility/heading-order.js | title": ["audits[heading-order].title"],
      "lighthouse-core/audits/accessibility/heading-order.js | description": ["audits[heading-order].description"],
      "lighthouse-core/audits/accessibility/html-has-lang.js | title": ["audits[html-has-lang].title"],
      "lighthouse-core/audits/accessibility/html-has-lang.js | description": ["audits[html-has-lang].description"],
      "lighthouse-core/audits/accessibility/html-lang-valid.js | title": ["audits[html-lang-valid].title"],
      "lighthouse-core/audits/accessibility/html-lang-valid.js | description": ["audits[html-lang-valid].description"],
      "lighthouse-core/audits/accessibility/image-alt.js | title": ["audits[image-alt].title"],
      "lighthouse-core/audits/accessibility/image-alt.js | description": ["audits[image-alt].description"],
      "lighthouse-core/audits/accessibility/input-image-alt.js | title": ["audits[input-image-alt].title"],
      "lighthouse-core/audits/accessibility/input-image-alt.js | description": ["audits[input-image-alt].description"],
      "lighthouse-core/audits/accessibility/label.js | title": ["audits.label.title"],
      "lighthouse-core/audits/accessibility/label.js | description": ["audits.label.description"],
      "lighthouse-core/audits/accessibility/link-name.js | title": ["audits[link-name].title"],
      "lighthouse-core/audits/accessibility/link-name.js | description": ["audits[link-name].description"],
      "lighthouse-core/audits/accessibility/list.js | title": ["audits.list.title"],
      "lighthouse-core/audits/accessibility/list.js | description": ["audits.list.description"],
      "lighthouse-core/audits/accessibility/listitem.js | title": ["audits.listitem.title"],
      "lighthouse-core/audits/accessibility/listitem.js | description": ["audits.listitem.description"],
      "lighthouse-core/audits/accessibility/meta-refresh.js | title": ["audits[meta-refresh].title"],
      "lighthouse-core/audits/accessibility/meta-refresh.js | description": ["audits[meta-refresh].description"],
      "lighthouse-core/audits/accessibility/meta-viewport.js | title": ["audits[meta-viewport].title"],
      "lighthouse-core/audits/accessibility/meta-viewport.js | description": ["audits[meta-viewport].description"],
      "lighthouse-core/audits/accessibility/object-alt.js | title": ["audits[object-alt].title"],
      "lighthouse-core/audits/accessibility/object-alt.js | description": ["audits[object-alt].description"],
      "lighthouse-core/audits/accessibility/tabindex.js | title": ["audits.tabindex.title"],
      "lighthouse-core/audits/accessibility/tabindex.js | description": ["audits.tabindex.description"],
      "lighthouse-core/audits/accessibility/td-headers-attr.js | title": ["audits[td-headers-attr].title"],
      "lighthouse-core/audits/accessibility/td-headers-attr.js | description": ["audits[td-headers-attr].description"],
      "lighthouse-core/audits/accessibility/th-has-data-cells.js | title": ["audits[th-has-data-cells].title"],
      "lighthouse-core/audits/accessibility/th-has-data-cells.js | description": ["audits[th-has-data-cells].description"],
      "lighthouse-core/audits/accessibility/valid-lang.js | title": ["audits[valid-lang].title"],
      "lighthouse-core/audits/accessibility/valid-lang.js | description": ["audits[valid-lang].description"],
      "lighthouse-core/audits/accessibility/video-caption.js | title": ["audits[video-caption].title"],
      "lighthouse-core/audits/accessibility/video-caption.js | description": ["audits[video-caption].description"],
      "lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js | title": ["audits[uses-long-cache-ttl].title"],
      "lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js | description": ["audits[uses-long-cache-ttl].description"],
      "lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js | displayValue": [{
        "values": {
          "itemCount": 1
        },
        "path": "audits[uses-long-cache-ttl].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnCacheTTL": ["audits[uses-long-cache-ttl].details.headings[1].text"],
      "lighthouse-core/audits/byte-efficiency/total-byte-weight.js | title": ["audits[total-byte-weight].title"],
      "lighthouse-core/audits/byte-efficiency/total-byte-weight.js | description": ["audits[total-byte-weight].description"],
      "lighthouse-core/audits/byte-efficiency/total-byte-weight.js | displayValue": [{
        "values": {
          "totalBytes": 316597
        },
        "path": "audits[total-byte-weight].displayValue"
      }],
      "lighthouse-core/audits/byte-efficiency/offscreen-images.js | title": ["audits[offscreen-images].title"],
      "lighthouse-core/audits/byte-efficiency/offscreen-images.js | description": ["audits[offscreen-images].description"],
      "lighthouse-core/audits/byte-efficiency/render-blocking-resources.js | title": ["audits[render-blocking-resources].title"],
      "lighthouse-core/audits/byte-efficiency/render-blocking-resources.js | description": ["audits[render-blocking-resources].description"],
      "lighthouse-core/audits/byte-efficiency/unminified-css.js | title": ["audits[unminified-css].title"],
      "lighthouse-core/audits/byte-efficiency/unminified-css.js | description": ["audits[unminified-css].description"],
      "lighthouse-core/audits/byte-efficiency/unminified-javascript.js | title": ["audits[unminified-javascript].title"],
      "lighthouse-core/audits/byte-efficiency/unminified-javascript.js | description": ["audits[unminified-javascript].description"],
      "lighthouse-core/audits/byte-efficiency/unused-css-rules.js | title": ["audits[unused-css-rules].title"],
      "lighthouse-core/audits/byte-efficiency/unused-css-rules.js | description": ["audits[unused-css-rules].description"],
      "lighthouse-core/audits/byte-efficiency/unused-javascript.js | title": ["audits[unused-javascript].title"],
      "lighthouse-core/audits/byte-efficiency/unused-javascript.js | description": ["audits[unused-javascript].description"],
      "lighthouse-core/lib/i18n/i18n.js | displayValueByteSavings": [{
        "values": {
          "wastedBytes": 50588
        },
        "path": "audits[unused-javascript].displayValue"
      }, {
        "values": {
          "wastedBytes": 25066
        },
        "path": "audits[uses-responsive-images].displayValue"
      }, {
        "values": {
          "wastedBytes": 226
        },
        "path": "audits[legacy-javascript].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnWastedBytes": ["audits[unused-javascript].details.headings[2].label", "audits[uses-responsive-images].details.headings[3].label", "audits[legacy-javascript].details.headings[2].label"],
      "lighthouse-core/audits/byte-efficiency/modern-image-formats.js | title": ["audits[modern-image-formats].title"],
      "lighthouse-core/audits/byte-efficiency/modern-image-formats.js | description": ["audits[modern-image-formats].description"],
      "lighthouse-core/audits/byte-efficiency/uses-optimized-images.js | title": ["audits[uses-optimized-images].title"],
      "lighthouse-core/audits/byte-efficiency/uses-optimized-images.js | description": ["audits[uses-optimized-images].description"],
      "lighthouse-core/audits/byte-efficiency/uses-text-compression.js | title": ["audits[uses-text-compression].title"],
      "lighthouse-core/audits/byte-efficiency/uses-text-compression.js | description": ["audits[uses-text-compression].description"],
      "lighthouse-core/audits/byte-efficiency/uses-responsive-images.js | title": ["audits[uses-responsive-images].title"],
      "lighthouse-core/audits/byte-efficiency/uses-responsive-images.js | description": ["audits[uses-responsive-images].description"],
      "lighthouse-core/lib/i18n/i18n.js | columnResourceSize": ["audits[uses-responsive-images].details.headings[2].label"],
      "lighthouse-core/audits/byte-efficiency/efficient-animated-content.js | title": ["audits[efficient-animated-content].title"],
      "lighthouse-core/audits/byte-efficiency/efficient-animated-content.js | description": ["audits[efficient-animated-content].description"],
      "lighthouse-core/audits/byte-efficiency/duplicated-javascript.js | title": ["audits[duplicated-javascript].title"],
      "lighthouse-core/audits/byte-efficiency/duplicated-javascript.js | description": ["audits[duplicated-javascript].description"],
      "lighthouse-core/audits/byte-efficiency/legacy-javascript.js | title": ["audits[legacy-javascript].title"],
      "lighthouse-core/audits/byte-efficiency/legacy-javascript.js | description": ["audits[legacy-javascript].description"],
      "lighthouse-core/audits/dobetterweb/appcache-manifest.js | title": ["audits[appcache-manifest].title"],
      "lighthouse-core/audits/dobetterweb/appcache-manifest.js | description": ["audits[appcache-manifest].description"],
      "lighthouse-core/audits/dobetterweb/doctype.js | title": ["audits.doctype.title"],
      "lighthouse-core/audits/dobetterweb/doctype.js | description": ["audits.doctype.description"],
      "lighthouse-core/audits/dobetterweb/charset.js | title": ["audits.charset.title"],
      "lighthouse-core/audits/dobetterweb/charset.js | description": ["audits.charset.description"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | title": ["audits[dom-size].title"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | description": ["audits[dom-size].description"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | displayValue": [{
        "values": {
          "itemCount": 96
        },
        "path": "audits[dom-size].displayValue"
      }],
      "lighthouse-core/audits/dobetterweb/dom-size.js | columnStatistic": ["audits[dom-size].details.headings[0].text"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | columnValue": ["audits[dom-size].details.headings[2].text"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | statisticDOMElements": ["audits[dom-size].details.items[0].statistic"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | statisticDOMDepth": ["audits[dom-size].details.items[1].statistic"],
      "lighthouse-core/audits/dobetterweb/dom-size.js | statisticDOMWidth": ["audits[dom-size].details.items[2].statistic"],
      "lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js | title": ["audits[external-anchors-use-rel-noopener].title"],
      "lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js | description": ["audits[external-anchors-use-rel-noopener].description"],
      "lighthouse-core/audits/dobetterweb/geolocation-on-start.js | title": ["audits[geolocation-on-start].title"],
      "lighthouse-core/audits/dobetterweb/geolocation-on-start.js | description": ["audits[geolocation-on-start].description"],
      "lighthouse-core/audits/dobetterweb/inspector-issues.js | title": ["audits[inspector-issues].title"],
      "lighthouse-core/audits/dobetterweb/inspector-issues.js | description": ["audits[inspector-issues].description"],
      "lighthouse-core/audits/dobetterweb/no-document-write.js | title": ["audits[no-document-write].title"],
      "lighthouse-core/audits/dobetterweb/no-document-write.js | description": ["audits[no-document-write].description"],
      "lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js | title": ["audits[no-vulnerable-libraries].title"],
      "lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js | description": ["audits[no-vulnerable-libraries].description"],
      "lighthouse-core/audits/dobetterweb/js-libraries.js | title": ["audits[js-libraries].title"],
      "lighthouse-core/audits/dobetterweb/js-libraries.js | description": ["audits[js-libraries].description"],
      "lighthouse-core/lib/i18n/i18n.js | columnName": ["audits[js-libraries].details.headings[0].text"],
      "lighthouse-core/audits/dobetterweb/js-libraries.js | columnVersion": ["audits[js-libraries].details.headings[1].text"],
      "lighthouse-core/audits/dobetterweb/notification-on-start.js | title": ["audits[notification-on-start].title"],
      "lighthouse-core/audits/dobetterweb/notification-on-start.js | description": ["audits[notification-on-start].description"],
      "lighthouse-core/audits/dobetterweb/password-inputs-can-be-pasted-into.js | title": ["audits[password-inputs-can-be-pasted-into].title"],
      "lighthouse-core/audits/dobetterweb/password-inputs-can-be-pasted-into.js | description": ["audits[password-inputs-can-be-pasted-into].description"],
      "lighthouse-core/audits/dobetterweb/uses-http2.js | title": ["audits[uses-http2].title"],
      "lighthouse-core/audits/dobetterweb/uses-http2.js | description": ["audits[uses-http2].description"],
      "lighthouse-core/audits/dobetterweb/uses-passive-event-listeners.js | title": ["audits[uses-passive-event-listeners].title"],
      "lighthouse-core/audits/dobetterweb/uses-passive-event-listeners.js | description": ["audits[uses-passive-event-listeners].description"],
      "lighthouse-core/audits/seo/meta-description.js | title": ["audits[meta-description].title"],
      "lighthouse-core/audits/seo/meta-description.js | description": ["audits[meta-description].description"],
      "lighthouse-core/audits/seo/http-status-code.js | title": ["audits[http-status-code].title"],
      "lighthouse-core/audits/seo/http-status-code.js | description": ["audits[http-status-code].description"],
      "lighthouse-core/audits/seo/font-size.js | title": ["audits[font-size].title"],
      "lighthouse-core/audits/seo/font-size.js | description": ["audits[font-size].description"],
      "lighthouse-core/audits/seo/font-size.js | displayValue": [{
        "values": {
          "decimalProportion": 1
        },
        "path": "audits[font-size].displayValue"
      }],
      "lighthouse-core/lib/i18n/i18n.js | columnSource": ["audits[font-size].details.headings[0].text"],
      "lighthouse-core/audits/seo/font-size.js | columnSelector": ["audits[font-size].details.headings[1].text"],
      "lighthouse-core/audits/seo/font-size.js | columnPercentPageText": ["audits[font-size].details.headings[2].text"],
      "lighthouse-core/audits/seo/font-size.js | columnFontSize": ["audits[font-size].details.headings[3].text"],
      "lighthouse-core/audits/seo/font-size.js | legibleText": ["audits[font-size].details.items[0].source.value"],
      "lighthouse-core/audits/seo/link-text.js | title": ["audits[link-text].title"],
      "lighthouse-core/audits/seo/link-text.js | description": ["audits[link-text].description"],
      "lighthouse-core/audits/seo/crawlable-anchors.js | title": ["audits[crawlable-anchors].title"],
      "lighthouse-core/audits/seo/crawlable-anchors.js | description": ["audits[crawlable-anchors].description"],
      "lighthouse-core/audits/seo/is-crawlable.js | title": ["audits[is-crawlable].title"],
      "lighthouse-core/audits/seo/is-crawlable.js | description": ["audits[is-crawlable].description"],
      "lighthouse-core/audits/seo/robots-txt.js | title": ["audits[robots-txt].title"],
      "lighthouse-core/audits/seo/robots-txt.js | description": ["audits[robots-txt].description"],
      "lighthouse-core/audits/seo/tap-targets.js | failureTitle": ["audits[tap-targets].title"],
      "lighthouse-core/audits/seo/tap-targets.js | description": ["audits[tap-targets].description"],
      "lighthouse-core/audits/seo/tap-targets.js | displayValue": [{
        "values": {
          "decimalProportion": 0.8235294117647058
        },
        "path": "audits[tap-targets].displayValue"
      }],
      "lighthouse-core/audits/seo/tap-targets.js | tapTargetHeader": ["audits[tap-targets].details.headings[0].text"],
      "lighthouse-core/lib/i18n/i18n.js | columnSize": ["audits[tap-targets].details.headings[1].text"],
      "lighthouse-core/audits/seo/tap-targets.js | overlappingTargetHeader": ["audits[tap-targets].details.headings[2].text"],
      "lighthouse-core/audits/seo/hreflang.js | title": ["audits.hreflang.title"],
      "lighthouse-core/audits/seo/hreflang.js | description": ["audits.hreflang.description"],
      "lighthouse-core/audits/seo/plugins.js | title": ["audits.plugins.title"],
      "lighthouse-core/audits/seo/plugins.js | description": ["audits.plugins.description"],
      "lighthouse-core/audits/seo/canonical.js | title": ["audits.canonical.title"],
      "lighthouse-core/audits/seo/canonical.js | description": ["audits.canonical.description"],
      "lighthouse-core/audits/seo/manual/structured-data.js | title": ["audits[structured-data].title"],
      "lighthouse-core/audits/seo/manual/structured-data.js | description": ["audits[structured-data].description"],
      "lighthouse-core/config/default-config.js | performanceCategoryTitle": ["categories.performance.title"],
      "lighthouse-core/config/default-config.js | a11yCategoryTitle": ["categories.accessibility.title"],
      "lighthouse-core/config/default-config.js | a11yCategoryDescription": ["categories.accessibility.description"],
      "lighthouse-core/config/default-config.js | a11yCategoryManualDescription": ["categories.accessibility.manualDescription"],
      "lighthouse-core/config/default-config.js | bestPracticesCategoryTitle": ["categories[best-practices].title"],
      "lighthouse-core/config/default-config.js | seoCategoryTitle": ["categories.seo.title"],
      "lighthouse-core/config/default-config.js | seoCategoryDescription": ["categories.seo.description"],
      "lighthouse-core/config/default-config.js | seoCategoryManualDescription": ["categories.seo.manualDescription"],
      "lighthouse-core/config/default-config.js | pwaCategoryTitle": ["categories.pwa.title"],
      "lighthouse-core/config/default-config.js | pwaCategoryDescription": ["categories.pwa.description"],
      "lighthouse-core/config/default-config.js | pwaCategoryManualDescription": ["categories.pwa.manualDescription"],
      "lighthouse-core/config/default-config.js | metricGroupTitle": ["categoryGroups.metrics.title"],
      "lighthouse-core/config/default-config.js | loadOpportunitiesGroupTitle": ["categoryGroups[load-opportunities].title"],
      "lighthouse-core/config/default-config.js | loadOpportunitiesGroupDescription": ["categoryGroups[load-opportunities].description"],
      "lighthouse-core/config/default-config.js | budgetsGroupTitle": ["categoryGroups.budgets.title"],
      "lighthouse-core/config/default-config.js | budgetsGroupDescription": ["categoryGroups.budgets.description"],
      "lighthouse-core/config/default-config.js | diagnosticsGroupTitle": ["categoryGroups.diagnostics.title"],
      "lighthouse-core/config/default-config.js | diagnosticsGroupDescription": ["categoryGroups.diagnostics.description"],
      "lighthouse-core/config/default-config.js | pwaInstallableGroupTitle": ["categoryGroups[pwa-installable].title"],
      "lighthouse-core/config/default-config.js | pwaOptimizedGroupTitle": ["categoryGroups[pwa-optimized].title"],
      "lighthouse-core/config/default-config.js | a11yBestPracticesGroupTitle": ["categoryGroups[a11y-best-practices].title"],
      "lighthouse-core/config/default-config.js | a11yBestPracticesGroupDescription": ["categoryGroups[a11y-best-practices].description"],
      "lighthouse-core/config/default-config.js | a11yColorContrastGroupTitle": ["categoryGroups[a11y-color-contrast].title"],
      "lighthouse-core/config/default-config.js | a11yColorContrastGroupDescription": ["categoryGroups[a11y-color-contrast].description"],
      "lighthouse-core/config/default-config.js | a11yNamesLabelsGroupTitle": ["categoryGroups[a11y-names-labels].title"],
      "lighthouse-core/config/default-config.js | a11yNamesLabelsGroupDescription": ["categoryGroups[a11y-names-labels].description"],
      "lighthouse-core/config/default-config.js | a11yNavigationGroupTitle": ["categoryGroups[a11y-navigation].title"],
      "lighthouse-core/config/default-config.js | a11yNavigationGroupDescription": ["categoryGroups[a11y-navigation].description"],
      "lighthouse-core/config/default-config.js | a11yAriaGroupTitle": ["categoryGroups[a11y-aria].title"],
      "lighthouse-core/config/default-config.js | a11yAriaGroupDescription": ["categoryGroups[a11y-aria].description"],
      "lighthouse-core/config/default-config.js | a11yLanguageGroupTitle": ["categoryGroups[a11y-language].title"],
      "lighthouse-core/config/default-config.js | a11yLanguageGroupDescription": ["categoryGroups[a11y-language].description"],
      "lighthouse-core/config/default-config.js | a11yAudioVideoGroupTitle": ["categoryGroups[a11y-audio-video].title"],
      "lighthouse-core/config/default-config.js | a11yAudioVideoGroupDescription": ["categoryGroups[a11y-audio-video].description"],
      "lighthouse-core/config/default-config.js | a11yTablesListsVideoGroupTitle": ["categoryGroups[a11y-tables-lists].title"],
      "lighthouse-core/config/default-config.js | a11yTablesListsVideoGroupDescription": ["categoryGroups[a11y-tables-lists].description"],
      "lighthouse-core/config/default-config.js | seoMobileGroupTitle": ["categoryGroups[seo-mobile].title"],
      "lighthouse-core/config/default-config.js | seoMobileGroupDescription": ["categoryGroups[seo-mobile].description"],
      "lighthouse-core/config/default-config.js | seoContentGroupTitle": ["categoryGroups[seo-content].title"],
      "lighthouse-core/config/default-config.js | seoContentGroupDescription": ["categoryGroups[seo-content].description"],
      "lighthouse-core/config/default-config.js | seoCrawlingGroupTitle": ["categoryGroups[seo-crawl].title"],
      "lighthouse-core/config/default-config.js | seoCrawlingGroupDescription": ["categoryGroups[seo-crawl].description"],
      "lighthouse-core/config/default-config.js | bestPracticesTrustSafetyGroupTitle": ["categoryGroups[best-practices-trust-safety].title"],
      "lighthouse-core/config/default-config.js | bestPracticesUXGroupTitle": ["categoryGroups[best-practices-ux].title"],
      "lighthouse-core/config/default-config.js | bestPracticesBrowserCompatGroupTitle": ["categoryGroups[best-practices-browser-compat].title"],
      "lighthouse-core/config/default-config.js | bestPracticesGeneralGroupTitle": ["categoryGroups[best-practices-general].title"],
      "node_modules/lighthouse-stack-packs/packs/react.js | unminified-css": ["stackPacks[0].descriptions[unminified-css]"],
      "node_modules/lighthouse-stack-packs/packs/react.js | unminified-javascript": ["stackPacks[0].descriptions[unminified-javascript]"],
      "node_modules/lighthouse-stack-packs/packs/react.js | unused-javascript": ["stackPacks[0].descriptions[unused-javascript]"],
      "node_modules/lighthouse-stack-packs/packs/react.js | server-response-time": ["stackPacks[0].descriptions[server-response-time]"],
      "node_modules/lighthouse-stack-packs/packs/react.js | redirects": ["stackPacks[0].descriptions.redirects"],
      "node_modules/lighthouse-stack-packs/packs/react.js | user-timings": ["stackPacks[0].descriptions[user-timings]"],
      "node_modules/lighthouse-stack-packs/packs/react.js | dom-size": ["stackPacks[0].descriptions[dom-size]"]
    }
  },
  "stackPacks": [{
    "id": "react",
    "title": "React",
    "iconDataURL": "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 841.9 595.3\"%3E %3Cg fill=\"%2361DAFB\"%3E%3Cpath d=\"M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z\"/%3E %3Ccircle cx=\"420.9\" cy=\"296.5\" r=\"45.7\"/%3E %3Cpath d=\"M520.5 78.1z\"/%3E%3C/g%3E%3C/svg%3E",
    "descriptions": {
      "unminified-css": "If your build system minifies CSS files automatically, ensure that you are deploying the production build of your application. You can check this with the React Developer Tools extension. [Learn more](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build).",
      "unminified-javascript": "If your build system minifies JS files automatically, ensure that you are deploying the production build of your application. You can check this with the React Developer Tools extension. [Learn more](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build).",
      "unused-javascript": "If you are not server-side rendering, [split your JavaScript bundles](https://web.dev/code-splitting-suspense/) with `React.lazy()`. Otherwise, code-split using a third-party library such as [loadable-components](https://www.smooth-code.com/open-source/loadable-components/docs/getting-started/).",
      "server-response-time": "If you are server-side rendering any React components, consider using `renderToNodeStream()` or `renderToStaticNodeStream()` to allow the client to receive and hydrate different parts of the markup instead of all at once. [Learn more](https://reactjs.org/docs/react-dom-server.html#rendertonodestream).",
      "redirects": "If you are using React Router, minimize usage of the `<Redirect>` component for [route navigations](https://reacttraining.com/react-router/web/api/Redirect).",
      "user-timings": "Use the React DevTools Profiler, which makes use of the Profiler API, to measure the rendering performance of your components. [Learn more.](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)",
      "dom-size": "Consider using a \"windowing\" library like `react-window` to minimize the number of DOM nodes created if you are rendering many repeated elements on the page. [Learn more](https://web.dev/virtualize-long-lists-react-window/). Also, minimize unnecessary re-renders using [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action), [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent), or [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) and [skip effects](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) only until certain dependencies have changed if you are using the `Effect` hook to improve runtime performance."
    }
  }]
};
},{}],"QCba":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
}); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

var __1 = require("..");

var report_v8_0_0_json_1 = __importDefault(require("./report-v8.0.0.json")); // import reportJson7 from './report-v7.5.0.json';
// import reportJson6 from './report.json';


var generateReport = function (lighthouseReport) {
  var renderedReport = (0, __1.renderReport)(lighthouseReport);
  return renderedReport;
};

var mountViewer = function (report) {
  var renderedReport = generateReport(report);
  var container = document.getElementById('lighthouse-viewer-element');
  container.innerHTML = null;
  container.appendChild(renderedReport);
};

mountViewer(report_v8_0_0_json_1.default); // let index = 0;
// const reports = [reportJson, reportJson7, reportJson6];
// setInterval(() => {
//   mountViewer(reports[index]);
//   index = (index + 1) % reports.length;
// }, 5000);
},{"..":"wvMH","./report-v8.0.0.json":"Tjyl"}]},{},["QCba"], null)