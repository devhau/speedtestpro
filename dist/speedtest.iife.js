var speedtest = (function (exports, require$$1, stream, require$$1$1, require$$3, require$$4, require$$0$1, require$$6, require$$4$1, require$$1$2, require$$0$2, zlib, EventEmitter) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
  var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);
  var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);
  var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
  var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
  var require$$6__default = /*#__PURE__*/_interopDefaultLegacy(require$$6);
  var require$$4__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$4$1);
  var require$$1__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$1$2);
  var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
  var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
  var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // utils is a library of generic helper functions non-specific to axios

  const {toString} = Object.prototype;
  const {getPrototypeOf} = Object;

  const kindOf = (cache => thing => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null));

  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type
  };

  const typeOfTest = type => thing => typeof thing === type;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   *
   * @returns {boolean} True if value is an Array, otherwise false
   */
  const {isArray} = Array;

  /**
   * Determine if a value is undefined
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  const isUndefined = typeOfTest('undefined');

  /**
   * Determine if a value is a Buffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer$1(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  const isArrayBuffer = kindOfTest('ArrayBuffer');


  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    let result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a String, otherwise false
   */
  const isString$1 = typeOfTest('string');

  /**
   * Determine if a value is a Function
   *
   * @param {*} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  const isFunction$1 = typeOfTest('function');

  /**
   * Determine if a value is a Number
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Number, otherwise false
   */
  const isNumber = typeOfTest('number');

  /**
   * Determine if a value is an Object
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an Object, otherwise false
   */
  const isObject = (thing) => thing !== null && typeof thing === 'object';

  /**
   * Determine if a value is a Boolean
   *
   * @param {*} thing The value to test
   * @returns {boolean} True if value is a Boolean, otherwise false
   */
  const isBoolean = thing => thing === true || thing === false;

  /**
   * Determine if a value is a plain Object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a plain Object, otherwise false
   */
  const isPlainObject = (val) => {
    if (kindOf(val) !== 'object') {
      return false;
    }

    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };

  /**
   * Determine if a value is a Date
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Date, otherwise false
   */
  const isDate = kindOfTest('Date');

  /**
   * Determine if a value is a File
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFile = kindOfTest('File');

  /**
   * Determine if a value is a Blob
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  const isBlob = kindOfTest('Blob');

  /**
   * Determine if a value is a FileList
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFileList = kindOfTest('FileList');

  /**
   * Determine if a value is a Stream
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);

  /**
   * Determine if a value is a FormData
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  const isFormData = (thing) => {
    let kind;
    return thing && (
      (typeof FormData === 'function' && thing instanceof FormData) || (
        isFunction$1(thing.append) && (
          (kind = kindOf(thing)) === 'formdata' ||
          // detect form-data instance
          (kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]')
        )
      )
    )
  };

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  const isURLSearchParams = kindOfTest('URLSearchParams');

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   *
   * @returns {String} The String freed of excess whitespace
   */
  const trim = (str) => str.trim ?
    str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   *
   * @param {Boolean} [allOwnKeys = false]
   * @returns {any}
   */
  function forEach(obj, fn, {allOwnKeys = false} = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    let i;
    let l;

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;

      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }

  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }

  const _global = (() => {
    /*eslint no-undef:0*/
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
  })();

  const isContextDefined = (context) => !isUndefined(context) && context !== _global;

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   *
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    const {caseless} = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };

    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   *
   * @param {Boolean} [allOwnKeys]
   * @returns {Object} The resulting value of object a
   */
  const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, {allOwnKeys});
    return a;
  };

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   *
   * @returns {string} content value without BOM
   */
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  };

  /**
   * Inherit the prototype methods from one constructor into another
   * @param {function} constructor
   * @param {function} superConstructor
   * @param {object} [props]
   * @param {object} [descriptors]
   *
   * @returns {void}
   */
  const inherits = (constructor, superConstructor, props, descriptors) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, 'super', {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };

  /**
   * Resolve object with deep prototype chain to a flat object
   * @param {Object} sourceObj source object
   * @param {Object} [destObj]
   * @param {Function|Boolean} [filter]
   * @param {Function} [propFilter]
   *
   * @returns {Object}
   */
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};

    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;

    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

    return destObj;
  };

  /**
   * Determines whether a string ends with the characters of a specified string
   *
   * @param {String} str
   * @param {String} searchString
   * @param {Number} [position= 0]
   *
   * @returns {boolean}
   */
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === undefined || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };


  /**
   * Returns new array from array like object or null if failed
   *
   * @param {*} [thing]
   *
   * @returns {?Array}
   */
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };

  /**
   * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
   * thing passed in is an instance of Uint8Array
   *
   * @param {TypedArray}
   *
   * @returns {Array}
   */
  // eslint-disable-next-line func-names
  const isTypedArray = (TypedArray => {
    // eslint-disable-next-line func-names
    return thing => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

  /**
   * For each entry in the object, call the function with the key and value.
   *
   * @param {Object<any, any>} obj - The object to iterate over.
   * @param {Function} fn - The function to call for each entry.
   *
   * @returns {void}
   */
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];

    const iterator = generator.call(obj);

    let result;

    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };

  /**
   * It takes a regular expression and a string, and returns an array of all the matches
   *
   * @param {string} regExp - The regular expression to match against.
   * @param {string} str - The string to search.
   *
   * @returns {Array<boolean>}
   */
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];

    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }

    return arr;
  };

  /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
  const isHTMLForm = kindOfTest('HTMLFormElement');

  const toCamelCase = str => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };

  /* Creating a function that will check if an object has a property. */
  const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

  /**
   * Determine if a value is a RegExp object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a RegExp object, otherwise false
   */
  const isRegExp = kindOfTest('RegExp');

  const reduceDescriptors = (obj, reducer) => {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};

    forEach(descriptors, (descriptor, name) => {
      if (reducer(descriptor, name, obj) !== false) {
        reducedDescriptors[name] = descriptor;
      }
    });

    Object.defineProperties(obj, reducedDescriptors);
  };

  /**
   * Makes all methods read-only
   * @param {Object} obj
   */

  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      // skip restricted props in strict mode
      if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
        return false;
      }

      const value = obj[name];

      if (!isFunction$1(value)) return;

      descriptor.enumerable = false;

      if ('writable' in descriptor) {
        descriptor.writable = false;
        return;
      }

      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error('Can not rewrite read-only method \'' + name + '\'');
        };
      }
    });
  };

  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};

    const define = (arr) => {
      arr.forEach(value => {
        obj[value] = true;
      });
    };

    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

    return obj;
  };

  const noop$1 = () => {};

  const toFiniteNumber = (value, defaultValue) => {
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
  };

  const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

  const DIGIT = '0123456789';

  const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };

  const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = '';
    const {length} = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length|0];
    }

    return str;
  };

  /**
   * If the thing is a FormData object, return true, otherwise return false.
   *
   * @param {unknown} thing - The thing to check.
   *
   * @returns {boolean}
   */
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
  }

  const toJSONObject = (obj) => {
    const stack = new Array(10);

    const visit = (source, i) => {

      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }

        if(!('toJSON' in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};

          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });

          stack[i] = undefined;

          return target;
        }
      }

      return source;
    };

    return visit(obj, 0);
  };

  const isAsyncFn = kindOfTest('AsyncFunction');

  const isThenable = (thing) =>
    thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);

  var utils = {
    isArray,
    isArrayBuffer,
    isBuffer: isBuffer$1,
    isFormData,
    isArrayBufferView,
    isString: isString$1,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop: noop$1,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  function AxiosError(message, code, config, request, response) {
    Error.call(this);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }

    this.message = message;
    this.name = 'AxiosError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }

  utils.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils.toJSONObject(this.config),
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });

  const prototype$1 = AxiosError.prototype;
  const descriptors = {};

  [
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED',
    'ERR_NOT_SUPPORT',
    'ERR_INVALID_URL'
  // eslint-disable-next-line func-names
  ].forEach(code => {
    descriptors[code] = {value: code};
  });

  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

  // eslint-disable-next-line func-names
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);

    utils.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, prop => {
      return prop !== 'isAxiosError';
    });

    AxiosError.call(axiosError, error.message, code, config, request, response);

    axiosError.cause = error;

    axiosError.name = error.name;

    customProps && Object.assign(axiosError, customProps);

    return axiosError;
  };

  var Stream$2 = stream__default["default"].Stream;
  var util$2 = require$$1__default["default"];

  var delayed_stream = DelayedStream$1;
  function DelayedStream$1() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;

    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
  }
  util$2.inherits(DelayedStream$1, Stream$2);

  DelayedStream$1.create = function(source, options) {
    var delayedStream = new this();

    options = options || {};
    for (var option in options) {
      delayedStream[option] = options[option];
    }

    delayedStream.source = source;

    var realEmit = source.emit;
    source.emit = function() {
      delayedStream._handleEmit(arguments);
      return realEmit.apply(source, arguments);
    };

    source.on('error', function() {});
    if (delayedStream.pauseStream) {
      source.pause();
    }

    return delayedStream;
  };

  Object.defineProperty(DelayedStream$1.prototype, 'readable', {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.source.readable;
    }
  });

  DelayedStream$1.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
  };

  DelayedStream$1.prototype.resume = function() {
    if (!this._released) {
      this.release();
    }

    this.source.resume();
  };

  DelayedStream$1.prototype.pause = function() {
    this.source.pause();
  };

  DelayedStream$1.prototype.release = function() {
    this._released = true;

    this._bufferedEvents.forEach(function(args) {
      this.emit.apply(this, args);
    }.bind(this));
    this._bufferedEvents = [];
  };

  DelayedStream$1.prototype.pipe = function() {
    var r = Stream$2.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
  };

  DelayedStream$1.prototype._handleEmit = function(args) {
    if (this._released) {
      this.emit.apply(this, args);
      return;
    }

    if (args[0] === 'data') {
      this.dataSize += args[1].length;
      this._checkIfMaxDataSizeExceeded();
    }

    this._bufferedEvents.push(args);
  };

  DelayedStream$1.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
      return;
    }

    if (this.dataSize <= this.maxDataSize) {
      return;
    }

    this._maxDataSizeExceeded = true;
    var message =
      'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this.emit('error', new Error(message));
  };

  var util$1 = require$$1__default["default"];
  var Stream$1 = stream__default["default"].Stream;
  var DelayedStream = delayed_stream;

  var combined_stream = CombinedStream$1;
  function CombinedStream$1() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;

    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
  }
  util$1.inherits(CombinedStream$1, Stream$1);

  CombinedStream$1.create = function(options) {
    var combinedStream = new this();

    options = options || {};
    for (var option in options) {
      combinedStream[option] = options[option];
    }

    return combinedStream;
  };

  CombinedStream$1.isStreamLike = function(stream) {
    return (typeof stream !== 'function')
      && (typeof stream !== 'string')
      && (typeof stream !== 'boolean')
      && (typeof stream !== 'number')
      && (!Buffer.isBuffer(stream));
  };

  CombinedStream$1.prototype.append = function(stream) {
    var isStreamLike = CombinedStream$1.isStreamLike(stream);

    if (isStreamLike) {
      if (!(stream instanceof DelayedStream)) {
        var newStream = DelayedStream.create(stream, {
          maxDataSize: Infinity,
          pauseStream: this.pauseStreams,
        });
        stream.on('data', this._checkDataSize.bind(this));
        stream = newStream;
      }

      this._handleErrors(stream);

      if (this.pauseStreams) {
        stream.pause();
      }
    }

    this._streams.push(stream);
    return this;
  };

  CombinedStream$1.prototype.pipe = function(dest, options) {
    Stream$1.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
  };

  CombinedStream$1.prototype._getNext = function() {
    this._currentStream = null;

    if (this._insideLoop) {
      this._pendingNext = true;
      return; // defer call
    }

    this._insideLoop = true;
    try {
      do {
        this._pendingNext = false;
        this._realGetNext();
      } while (this._pendingNext);
    } finally {
      this._insideLoop = false;
    }
  };

  CombinedStream$1.prototype._realGetNext = function() {
    var stream = this._streams.shift();


    if (typeof stream == 'undefined') {
      this.end();
      return;
    }

    if (typeof stream !== 'function') {
      this._pipeNext(stream);
      return;
    }

    var getStream = stream;
    getStream(function(stream) {
      var isStreamLike = CombinedStream$1.isStreamLike(stream);
      if (isStreamLike) {
        stream.on('data', this._checkDataSize.bind(this));
        this._handleErrors(stream);
      }

      this._pipeNext(stream);
    }.bind(this));
  };

  CombinedStream$1.prototype._pipeNext = function(stream) {
    this._currentStream = stream;

    var isStreamLike = CombinedStream$1.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('end', this._getNext.bind(this));
      stream.pipe(this, {end: false});
      return;
    }

    var value = stream;
    this.write(value);
    this._getNext();
  };

  CombinedStream$1.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on('error', function(err) {
      self._emitError(err);
    });
  };

  CombinedStream$1.prototype.write = function(data) {
    this.emit('data', data);
  };

  CombinedStream$1.prototype.pause = function() {
    if (!this.pauseStreams) {
      return;
    }

    if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
    this.emit('pause');
  };

  CombinedStream$1.prototype.resume = function() {
    if (!this._released) {
      this._released = true;
      this.writable = true;
      this._getNext();
    }

    if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
    this.emit('resume');
  };

  CombinedStream$1.prototype.end = function() {
    this._reset();
    this.emit('end');
  };

  CombinedStream$1.prototype.destroy = function() {
    this._reset();
    this.emit('close');
  };

  CombinedStream$1.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
  };

  CombinedStream$1.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
      return;
    }

    var message =
      'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this._emitError(new Error(message));
  };

  CombinedStream$1.prototype._updateDataSize = function() {
    this.dataSize = 0;

    var self = this;
    this._streams.forEach(function(stream) {
      if (!stream.dataSize) {
        return;
      }

      self.dataSize += stream.dataSize;
    });

    if (this._currentStream && this._currentStream.dataSize) {
      this.dataSize += this._currentStream.dataSize;
    }
  };

  CombinedStream$1.prototype._emitError = function(err) {
    this._reset();
    this.emit('error', err);
  };

  var mimeTypes = {};

  var mimeDbExports = {};
  var mimeDb = {
    get exports(){ return mimeDbExports; },
    set exports(v){ mimeDbExports = v; },
  };

  var require$$0 = {
  	"application/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"application/3gpdash-qoe-report+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/3gpp-ims+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/3gpphal+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/3gpphalforms+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/a2l": {
  	source: "iana"
  },
  	"application/ace+cbor": {
  	source: "iana"
  },
  	"application/activemessage": {
  	source: "iana"
  },
  	"application/activity+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-costmap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-costmapfilter+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-directory+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointcost+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointcostparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointprop+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointpropparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-error+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-networkmap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-networkmapfilter+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-updatestreamcontrol+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-updatestreamparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/aml": {
  	source: "iana"
  },
  	"application/andrew-inset": {
  	source: "iana",
  	extensions: [
  		"ez"
  	]
  },
  	"application/applefile": {
  	source: "iana"
  },
  	"application/applixware": {
  	source: "apache",
  	extensions: [
  		"aw"
  	]
  },
  	"application/at+jwt": {
  	source: "iana"
  },
  	"application/atf": {
  	source: "iana"
  },
  	"application/atfx": {
  	source: "iana"
  },
  	"application/atom+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atom"
  	]
  },
  	"application/atomcat+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomcat"
  	]
  },
  	"application/atomdeleted+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomdeleted"
  	]
  },
  	"application/atomicmail": {
  	source: "iana"
  },
  	"application/atomsvc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomsvc"
  	]
  },
  	"application/atsc-dwd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dwd"
  	]
  },
  	"application/atsc-dynamic-event-message": {
  	source: "iana"
  },
  	"application/atsc-held+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"held"
  	]
  },
  	"application/atsc-rdt+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/atsc-rsat+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rsat"
  	]
  },
  	"application/atxml": {
  	source: "iana"
  },
  	"application/auth-policy+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/bacnet-xdd+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/batch-smtp": {
  	source: "iana"
  },
  	"application/bdoc": {
  	compressible: false,
  	extensions: [
  		"bdoc"
  	]
  },
  	"application/beep+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/calendar+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/calendar+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xcs"
  	]
  },
  	"application/call-completion": {
  	source: "iana"
  },
  	"application/cals-1840": {
  	source: "iana"
  },
  	"application/captive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/cbor": {
  	source: "iana"
  },
  	"application/cbor-seq": {
  	source: "iana"
  },
  	"application/cccex": {
  	source: "iana"
  },
  	"application/ccmp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ccxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ccxml"
  	]
  },
  	"application/cdfx+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cdfx"
  	]
  },
  	"application/cdmi-capability": {
  	source: "iana",
  	extensions: [
  		"cdmia"
  	]
  },
  	"application/cdmi-container": {
  	source: "iana",
  	extensions: [
  		"cdmic"
  	]
  },
  	"application/cdmi-domain": {
  	source: "iana",
  	extensions: [
  		"cdmid"
  	]
  },
  	"application/cdmi-object": {
  	source: "iana",
  	extensions: [
  		"cdmio"
  	]
  },
  	"application/cdmi-queue": {
  	source: "iana",
  	extensions: [
  		"cdmiq"
  	]
  },
  	"application/cdni": {
  	source: "iana"
  },
  	"application/cea": {
  	source: "iana"
  },
  	"application/cea-2018+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cellml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cfw": {
  	source: "iana"
  },
  	"application/city+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/clr": {
  	source: "iana"
  },
  	"application/clue+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/clue_info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cms": {
  	source: "iana"
  },
  	"application/cnrp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/coap-group+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/coap-payload": {
  	source: "iana"
  },
  	"application/commonground": {
  	source: "iana"
  },
  	"application/conference-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cose": {
  	source: "iana"
  },
  	"application/cose-key": {
  	source: "iana"
  },
  	"application/cose-key-set": {
  	source: "iana"
  },
  	"application/cpl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cpl"
  	]
  },
  	"application/csrattrs": {
  	source: "iana"
  },
  	"application/csta+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cstadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/csvm+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/cu-seeme": {
  	source: "apache",
  	extensions: [
  		"cu"
  	]
  },
  	"application/cwt": {
  	source: "iana"
  },
  	"application/cybercash": {
  	source: "iana"
  },
  	"application/dart": {
  	compressible: true
  },
  	"application/dash+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpd"
  	]
  },
  	"application/dash-patch+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpp"
  	]
  },
  	"application/dashdelta": {
  	source: "iana"
  },
  	"application/davmount+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"davmount"
  	]
  },
  	"application/dca-rft": {
  	source: "iana"
  },
  	"application/dcd": {
  	source: "iana"
  },
  	"application/dec-dx": {
  	source: "iana"
  },
  	"application/dialog-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dicom": {
  	source: "iana"
  },
  	"application/dicom+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/dicom+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dii": {
  	source: "iana"
  },
  	"application/dit": {
  	source: "iana"
  },
  	"application/dns": {
  	source: "iana"
  },
  	"application/dns+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/dns-message": {
  	source: "iana"
  },
  	"application/docbook+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"dbk"
  	]
  },
  	"application/dots+cbor": {
  	source: "iana"
  },
  	"application/dskpp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dssc+der": {
  	source: "iana",
  	extensions: [
  		"dssc"
  	]
  },
  	"application/dssc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdssc"
  	]
  },
  	"application/dvcs": {
  	source: "iana"
  },
  	"application/ecmascript": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"es",
  		"ecma"
  	]
  },
  	"application/edi-consent": {
  	source: "iana"
  },
  	"application/edi-x12": {
  	source: "iana",
  	compressible: false
  },
  	"application/edifact": {
  	source: "iana",
  	compressible: false
  },
  	"application/efi": {
  	source: "iana"
  },
  	"application/elm+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/elm+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.cap+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/emergencycalldata.comment+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.deviceinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.ecall.msd": {
  	source: "iana"
  },
  	"application/emergencycalldata.providerinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.serviceinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.subscriberinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.veds+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emma+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"emma"
  	]
  },
  	"application/emotionml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"emotionml"
  	]
  },
  	"application/encaprtp": {
  	source: "iana"
  },
  	"application/epp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/epub+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"epub"
  	]
  },
  	"application/eshop": {
  	source: "iana"
  },
  	"application/exi": {
  	source: "iana",
  	extensions: [
  		"exi"
  	]
  },
  	"application/expect-ct-report+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/express": {
  	source: "iana",
  	extensions: [
  		"exp"
  	]
  },
  	"application/fastinfoset": {
  	source: "iana"
  },
  	"application/fastsoap": {
  	source: "iana"
  },
  	"application/fdt+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"fdt"
  	]
  },
  	"application/fhir+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/fhir+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/fido.trusted-apps+json": {
  	compressible: true
  },
  	"application/fits": {
  	source: "iana"
  },
  	"application/flexfec": {
  	source: "iana"
  },
  	"application/font-sfnt": {
  	source: "iana"
  },
  	"application/font-tdpfr": {
  	source: "iana",
  	extensions: [
  		"pfr"
  	]
  },
  	"application/font-woff": {
  	source: "iana",
  	compressible: false
  },
  	"application/framework-attributes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/geo+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"geojson"
  	]
  },
  	"application/geo+json-seq": {
  	source: "iana"
  },
  	"application/geopackage+sqlite3": {
  	source: "iana"
  },
  	"application/geoxacml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/gltf-buffer": {
  	source: "iana"
  },
  	"application/gml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"gml"
  	]
  },
  	"application/gpx+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"gpx"
  	]
  },
  	"application/gxf": {
  	source: "apache",
  	extensions: [
  		"gxf"
  	]
  },
  	"application/gzip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"gz"
  	]
  },
  	"application/h224": {
  	source: "iana"
  },
  	"application/held+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/hjson": {
  	extensions: [
  		"hjson"
  	]
  },
  	"application/http": {
  	source: "iana"
  },
  	"application/hyperstudio": {
  	source: "iana",
  	extensions: [
  		"stk"
  	]
  },
  	"application/ibe-key-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ibe-pkg-reply+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ibe-pp-data": {
  	source: "iana"
  },
  	"application/iges": {
  	source: "iana"
  },
  	"application/im-iscomposing+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/index": {
  	source: "iana"
  },
  	"application/index.cmd": {
  	source: "iana"
  },
  	"application/index.obj": {
  	source: "iana"
  },
  	"application/index.response": {
  	source: "iana"
  },
  	"application/index.vnd": {
  	source: "iana"
  },
  	"application/inkml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ink",
  		"inkml"
  	]
  },
  	"application/iotp": {
  	source: "iana"
  },
  	"application/ipfix": {
  	source: "iana",
  	extensions: [
  		"ipfix"
  	]
  },
  	"application/ipp": {
  	source: "iana"
  },
  	"application/isup": {
  	source: "iana"
  },
  	"application/its+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"its"
  	]
  },
  	"application/java-archive": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"jar",
  		"war",
  		"ear"
  	]
  },
  	"application/java-serialized-object": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"ser"
  	]
  },
  	"application/java-vm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"class"
  	]
  },
  	"application/javascript": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"js",
  		"mjs"
  	]
  },
  	"application/jf2feed+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jose": {
  	source: "iana"
  },
  	"application/jose+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jrd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jscalendar+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"json",
  		"map"
  	]
  },
  	"application/json-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/json-seq": {
  	source: "iana"
  },
  	"application/json5": {
  	extensions: [
  		"json5"
  	]
  },
  	"application/jsonml+json": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"jsonml"
  	]
  },
  	"application/jwk+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jwk-set+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jwt": {
  	source: "iana"
  },
  	"application/kpml-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/kpml-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ld+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"jsonld"
  	]
  },
  	"application/lgr+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lgr"
  	]
  },
  	"application/link-format": {
  	source: "iana"
  },
  	"application/load-control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/lost+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lostxml"
  	]
  },
  	"application/lostsync+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/lpf+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/lxf": {
  	source: "iana"
  },
  	"application/mac-binhex40": {
  	source: "iana",
  	extensions: [
  		"hqx"
  	]
  },
  	"application/mac-compactpro": {
  	source: "apache",
  	extensions: [
  		"cpt"
  	]
  },
  	"application/macwriteii": {
  	source: "iana"
  },
  	"application/mads+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mads"
  	]
  },
  	"application/manifest+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"webmanifest"
  	]
  },
  	"application/marc": {
  	source: "iana",
  	extensions: [
  		"mrc"
  	]
  },
  	"application/marcxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mrcx"
  	]
  },
  	"application/mathematica": {
  	source: "iana",
  	extensions: [
  		"ma",
  		"nb",
  		"mb"
  	]
  },
  	"application/mathml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mathml"
  	]
  },
  	"application/mathml-content+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mathml-presentation+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-associated-procedure-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-deregister+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-envelope+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-msk+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-msk-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-protection-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-reception-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-register+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-register-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-schedule+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-user-service-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbox": {
  	source: "iana",
  	extensions: [
  		"mbox"
  	]
  },
  	"application/media-policy-dataset+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpf"
  	]
  },
  	"application/media_control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mediaservercontrol+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mscml"
  	]
  },
  	"application/merge-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/metalink+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"metalink"
  	]
  },
  	"application/metalink4+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"meta4"
  	]
  },
  	"application/mets+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mets"
  	]
  },
  	"application/mf4": {
  	source: "iana"
  },
  	"application/mikey": {
  	source: "iana"
  },
  	"application/mipc": {
  	source: "iana"
  },
  	"application/missing-blocks+cbor-seq": {
  	source: "iana"
  },
  	"application/mmt-aei+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"maei"
  	]
  },
  	"application/mmt-usd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"musd"
  	]
  },
  	"application/mods+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mods"
  	]
  },
  	"application/moss-keys": {
  	source: "iana"
  },
  	"application/moss-signature": {
  	source: "iana"
  },
  	"application/mosskey-data": {
  	source: "iana"
  },
  	"application/mosskey-request": {
  	source: "iana"
  },
  	"application/mp21": {
  	source: "iana",
  	extensions: [
  		"m21",
  		"mp21"
  	]
  },
  	"application/mp4": {
  	source: "iana",
  	extensions: [
  		"mp4s",
  		"m4p"
  	]
  },
  	"application/mpeg4-generic": {
  	source: "iana"
  },
  	"application/mpeg4-iod": {
  	source: "iana"
  },
  	"application/mpeg4-iod-xmt": {
  	source: "iana"
  },
  	"application/mrb-consumer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mrb-publish+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/msc-ivr+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/msc-mixer+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/msword": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"doc",
  		"dot"
  	]
  },
  	"application/mud+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/multipart-core": {
  	source: "iana"
  },
  	"application/mxf": {
  	source: "iana",
  	extensions: [
  		"mxf"
  	]
  },
  	"application/n-quads": {
  	source: "iana",
  	extensions: [
  		"nq"
  	]
  },
  	"application/n-triples": {
  	source: "iana",
  	extensions: [
  		"nt"
  	]
  },
  	"application/nasdata": {
  	source: "iana"
  },
  	"application/news-checkgroups": {
  	source: "iana",
  	charset: "US-ASCII"
  },
  	"application/news-groupinfo": {
  	source: "iana",
  	charset: "US-ASCII"
  },
  	"application/news-transmission": {
  	source: "iana"
  },
  	"application/nlsml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/node": {
  	source: "iana",
  	extensions: [
  		"cjs"
  	]
  },
  	"application/nss": {
  	source: "iana"
  },
  	"application/oauth-authz-req+jwt": {
  	source: "iana"
  },
  	"application/oblivious-dns-message": {
  	source: "iana"
  },
  	"application/ocsp-request": {
  	source: "iana"
  },
  	"application/ocsp-response": {
  	source: "iana"
  },
  	"application/octet-stream": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"bin",
  		"dms",
  		"lrf",
  		"mar",
  		"so",
  		"dist",
  		"distz",
  		"pkg",
  		"bpk",
  		"dump",
  		"elc",
  		"deploy",
  		"exe",
  		"dll",
  		"deb",
  		"dmg",
  		"iso",
  		"img",
  		"msi",
  		"msp",
  		"msm",
  		"buffer"
  	]
  },
  	"application/oda": {
  	source: "iana",
  	extensions: [
  		"oda"
  	]
  },
  	"application/odm+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/odx": {
  	source: "iana"
  },
  	"application/oebps-package+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"opf"
  	]
  },
  	"application/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ogx"
  	]
  },
  	"application/omdoc+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"omdoc"
  	]
  },
  	"application/onenote": {
  	source: "apache",
  	extensions: [
  		"onetoc",
  		"onetoc2",
  		"onetmp",
  		"onepkg"
  	]
  },
  	"application/opc-nodeset+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/oscore": {
  	source: "iana"
  },
  	"application/oxps": {
  	source: "iana",
  	extensions: [
  		"oxps"
  	]
  },
  	"application/p21": {
  	source: "iana"
  },
  	"application/p21+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/p2p-overlay+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"relo"
  	]
  },
  	"application/parityfec": {
  	source: "iana"
  },
  	"application/passport": {
  	source: "iana"
  },
  	"application/patch-ops-error+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xer"
  	]
  },
  	"application/pdf": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pdf"
  	]
  },
  	"application/pdx": {
  	source: "iana"
  },
  	"application/pem-certificate-chain": {
  	source: "iana"
  },
  	"application/pgp-encrypted": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pgp"
  	]
  },
  	"application/pgp-keys": {
  	source: "iana",
  	extensions: [
  		"asc"
  	]
  },
  	"application/pgp-signature": {
  	source: "iana",
  	extensions: [
  		"asc",
  		"sig"
  	]
  },
  	"application/pics-rules": {
  	source: "apache",
  	extensions: [
  		"prf"
  	]
  },
  	"application/pidf+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/pidf-diff+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/pkcs10": {
  	source: "iana",
  	extensions: [
  		"p10"
  	]
  },
  	"application/pkcs12": {
  	source: "iana"
  },
  	"application/pkcs7-mime": {
  	source: "iana",
  	extensions: [
  		"p7m",
  		"p7c"
  	]
  },
  	"application/pkcs7-signature": {
  	source: "iana",
  	extensions: [
  		"p7s"
  	]
  },
  	"application/pkcs8": {
  	source: "iana",
  	extensions: [
  		"p8"
  	]
  },
  	"application/pkcs8-encrypted": {
  	source: "iana"
  },
  	"application/pkix-attr-cert": {
  	source: "iana",
  	extensions: [
  		"ac"
  	]
  },
  	"application/pkix-cert": {
  	source: "iana",
  	extensions: [
  		"cer"
  	]
  },
  	"application/pkix-crl": {
  	source: "iana",
  	extensions: [
  		"crl"
  	]
  },
  	"application/pkix-pkipath": {
  	source: "iana",
  	extensions: [
  		"pkipath"
  	]
  },
  	"application/pkixcmp": {
  	source: "iana",
  	extensions: [
  		"pki"
  	]
  },
  	"application/pls+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"pls"
  	]
  },
  	"application/poc-settings+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/postscript": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ai",
  		"eps",
  		"ps"
  	]
  },
  	"application/ppsp-tracker+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/problem+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/problem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/provenance+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"provx"
  	]
  },
  	"application/prs.alvestrand.titrax-sheet": {
  	source: "iana"
  },
  	"application/prs.cww": {
  	source: "iana",
  	extensions: [
  		"cww"
  	]
  },
  	"application/prs.cyn": {
  	source: "iana",
  	charset: "7-BIT"
  },
  	"application/prs.hpub+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/prs.nprend": {
  	source: "iana"
  },
  	"application/prs.plucker": {
  	source: "iana"
  },
  	"application/prs.rdf-xml-crypt": {
  	source: "iana"
  },
  	"application/prs.xsf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/pskc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"pskcxml"
  	]
  },
  	"application/pvd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/qsig": {
  	source: "iana"
  },
  	"application/raml+yaml": {
  	compressible: true,
  	extensions: [
  		"raml"
  	]
  },
  	"application/raptorfec": {
  	source: "iana"
  },
  	"application/rdap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/rdf+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rdf",
  		"owl"
  	]
  },
  	"application/reginfo+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rif"
  	]
  },
  	"application/relax-ng-compact-syntax": {
  	source: "iana",
  	extensions: [
  		"rnc"
  	]
  },
  	"application/remote-printing": {
  	source: "iana"
  },
  	"application/reputon+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/resource-lists+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rl"
  	]
  },
  	"application/resource-lists-diff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rld"
  	]
  },
  	"application/rfc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/riscos": {
  	source: "iana"
  },
  	"application/rlmi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/rls-services+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rs"
  	]
  },
  	"application/route-apd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rapd"
  	]
  },
  	"application/route-s-tsid+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sls"
  	]
  },
  	"application/route-usd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rusd"
  	]
  },
  	"application/rpki-ghostbusters": {
  	source: "iana",
  	extensions: [
  		"gbr"
  	]
  },
  	"application/rpki-manifest": {
  	source: "iana",
  	extensions: [
  		"mft"
  	]
  },
  	"application/rpki-publication": {
  	source: "iana"
  },
  	"application/rpki-roa": {
  	source: "iana",
  	extensions: [
  		"roa"
  	]
  },
  	"application/rpki-updown": {
  	source: "iana"
  },
  	"application/rsd+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"rsd"
  	]
  },
  	"application/rss+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"rss"
  	]
  },
  	"application/rtf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtf"
  	]
  },
  	"application/rtploopback": {
  	source: "iana"
  },
  	"application/rtx": {
  	source: "iana"
  },
  	"application/samlassertion+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/samlmetadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sarif+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sarif-external-properties+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sbe": {
  	source: "iana"
  },
  	"application/sbml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sbml"
  	]
  },
  	"application/scaip+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/scim+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/scvp-cv-request": {
  	source: "iana",
  	extensions: [
  		"scq"
  	]
  },
  	"application/scvp-cv-response": {
  	source: "iana",
  	extensions: [
  		"scs"
  	]
  },
  	"application/scvp-vp-request": {
  	source: "iana",
  	extensions: [
  		"spq"
  	]
  },
  	"application/scvp-vp-response": {
  	source: "iana",
  	extensions: [
  		"spp"
  	]
  },
  	"application/sdp": {
  	source: "iana",
  	extensions: [
  		"sdp"
  	]
  },
  	"application/secevent+jwt": {
  	source: "iana"
  },
  	"application/senml+cbor": {
  	source: "iana"
  },
  	"application/senml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/senml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"senmlx"
  	]
  },
  	"application/senml-etch+cbor": {
  	source: "iana"
  },
  	"application/senml-etch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/senml-exi": {
  	source: "iana"
  },
  	"application/sensml+cbor": {
  	source: "iana"
  },
  	"application/sensml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sensml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sensmlx"
  	]
  },
  	"application/sensml-exi": {
  	source: "iana"
  },
  	"application/sep+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sep-exi": {
  	source: "iana"
  },
  	"application/session-info": {
  	source: "iana"
  },
  	"application/set-payment": {
  	source: "iana"
  },
  	"application/set-payment-initiation": {
  	source: "iana",
  	extensions: [
  		"setpay"
  	]
  },
  	"application/set-registration": {
  	source: "iana"
  },
  	"application/set-registration-initiation": {
  	source: "iana",
  	extensions: [
  		"setreg"
  	]
  },
  	"application/sgml": {
  	source: "iana"
  },
  	"application/sgml-open-catalog": {
  	source: "iana"
  },
  	"application/shf+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"shf"
  	]
  },
  	"application/sieve": {
  	source: "iana",
  	extensions: [
  		"siv",
  		"sieve"
  	]
  },
  	"application/simple-filter+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/simple-message-summary": {
  	source: "iana"
  },
  	"application/simplesymbolcontainer": {
  	source: "iana"
  },
  	"application/sipc": {
  	source: "iana"
  },
  	"application/slate": {
  	source: "iana"
  },
  	"application/smil": {
  	source: "iana"
  },
  	"application/smil+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"smi",
  		"smil"
  	]
  },
  	"application/smpte336m": {
  	source: "iana"
  },
  	"application/soap+fastinfoset": {
  	source: "iana"
  },
  	"application/soap+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sparql-query": {
  	source: "iana",
  	extensions: [
  		"rq"
  	]
  },
  	"application/sparql-results+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"srx"
  	]
  },
  	"application/spdx+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/spirits-event+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sql": {
  	source: "iana"
  },
  	"application/srgs": {
  	source: "iana",
  	extensions: [
  		"gram"
  	]
  },
  	"application/srgs+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"grxml"
  	]
  },
  	"application/sru+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sru"
  	]
  },
  	"application/ssdl+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ssdl"
  	]
  },
  	"application/ssml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ssml"
  	]
  },
  	"application/stix+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/swid+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"swidtag"
  	]
  },
  	"application/tamp-apex-update": {
  	source: "iana"
  },
  	"application/tamp-apex-update-confirm": {
  	source: "iana"
  },
  	"application/tamp-community-update": {
  	source: "iana"
  },
  	"application/tamp-community-update-confirm": {
  	source: "iana"
  },
  	"application/tamp-error": {
  	source: "iana"
  },
  	"application/tamp-sequence-adjust": {
  	source: "iana"
  },
  	"application/tamp-sequence-adjust-confirm": {
  	source: "iana"
  },
  	"application/tamp-status-query": {
  	source: "iana"
  },
  	"application/tamp-status-response": {
  	source: "iana"
  },
  	"application/tamp-update": {
  	source: "iana"
  },
  	"application/tamp-update-confirm": {
  	source: "iana"
  },
  	"application/tar": {
  	compressible: true
  },
  	"application/taxii+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/td+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/tei+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tei",
  		"teicorpus"
  	]
  },
  	"application/tetra_isi": {
  	source: "iana"
  },
  	"application/thraud+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tfi"
  	]
  },
  	"application/timestamp-query": {
  	source: "iana"
  },
  	"application/timestamp-reply": {
  	source: "iana"
  },
  	"application/timestamped-data": {
  	source: "iana",
  	extensions: [
  		"tsd"
  	]
  },
  	"application/tlsrpt+gzip": {
  	source: "iana"
  },
  	"application/tlsrpt+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/tnauthlist": {
  	source: "iana"
  },
  	"application/token-introspection+jwt": {
  	source: "iana"
  },
  	"application/toml": {
  	compressible: true,
  	extensions: [
  		"toml"
  	]
  },
  	"application/trickle-ice-sdpfrag": {
  	source: "iana"
  },
  	"application/trig": {
  	source: "iana",
  	extensions: [
  		"trig"
  	]
  },
  	"application/ttml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ttml"
  	]
  },
  	"application/tve-trigger": {
  	source: "iana"
  },
  	"application/tzif": {
  	source: "iana"
  },
  	"application/tzif-leap": {
  	source: "iana"
  },
  	"application/ubjson": {
  	compressible: false,
  	extensions: [
  		"ubj"
  	]
  },
  	"application/ulpfec": {
  	source: "iana"
  },
  	"application/urc-grpsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/urc-ressheet+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rsheet"
  	]
  },
  	"application/urc-targetdesc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"td"
  	]
  },
  	"application/urc-uisocketdesc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vcard+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vcard+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vemmi": {
  	source: "iana"
  },
  	"application/vividence.scriptfile": {
  	source: "apache"
  },
  	"application/vnd.1000minds.decision-model+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"1km"
  	]
  },
  	"application/vnd.3gpp-prose+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp-prose-pc3ch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp-v2x-local-service-information": {
  	source: "iana"
  },
  	"application/vnd.3gpp.5gnas": {
  	source: "iana"
  },
  	"application/vnd.3gpp.access-transfer-events+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.bsf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.gmop+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.gtpc": {
  	source: "iana"
  },
  	"application/vnd.3gpp.interworking-data": {
  	source: "iana"
  },
  	"application/vnd.3gpp.lpp": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mc-signalling-ear": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-payload": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-signalling": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-floor-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-location-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-signed+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-ue-init-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-location-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-transmission-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mid-call+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.ngap": {
  	source: "iana"
  },
  	"application/vnd.3gpp.pfcp": {
  	source: "iana"
  },
  	"application/vnd.3gpp.pic-bw-large": {
  	source: "iana",
  	extensions: [
  		"plb"
  	]
  },
  	"application/vnd.3gpp.pic-bw-small": {
  	source: "iana",
  	extensions: [
  		"psb"
  	]
  },
  	"application/vnd.3gpp.pic-bw-var": {
  	source: "iana",
  	extensions: [
  		"pvb"
  	]
  },
  	"application/vnd.3gpp.s1ap": {
  	source: "iana"
  },
  	"application/vnd.3gpp.sms": {
  	source: "iana"
  },
  	"application/vnd.3gpp.sms+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.srvcc-ext+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.srvcc-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.state-and-event-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.ussd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp2.bcmcsinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp2.sms": {
  	source: "iana"
  },
  	"application/vnd.3gpp2.tcap": {
  	source: "iana",
  	extensions: [
  		"tcap"
  	]
  },
  	"application/vnd.3lightssoftware.imagescal": {
  	source: "iana"
  },
  	"application/vnd.3m.post-it-notes": {
  	source: "iana",
  	extensions: [
  		"pwn"
  	]
  },
  	"application/vnd.accpac.simply.aso": {
  	source: "iana",
  	extensions: [
  		"aso"
  	]
  },
  	"application/vnd.accpac.simply.imp": {
  	source: "iana",
  	extensions: [
  		"imp"
  	]
  },
  	"application/vnd.acucobol": {
  	source: "iana",
  	extensions: [
  		"acu"
  	]
  },
  	"application/vnd.acucorp": {
  	source: "iana",
  	extensions: [
  		"atc",
  		"acutc"
  	]
  },
  	"application/vnd.adobe.air-application-installer-package+zip": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"air"
  	]
  },
  	"application/vnd.adobe.flash.movie": {
  	source: "iana"
  },
  	"application/vnd.adobe.formscentral.fcdt": {
  	source: "iana",
  	extensions: [
  		"fcdt"
  	]
  },
  	"application/vnd.adobe.fxp": {
  	source: "iana",
  	extensions: [
  		"fxp",
  		"fxpl"
  	]
  },
  	"application/vnd.adobe.partial-upload": {
  	source: "iana"
  },
  	"application/vnd.adobe.xdp+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdp"
  	]
  },
  	"application/vnd.adobe.xfdf": {
  	source: "iana",
  	extensions: [
  		"xfdf"
  	]
  },
  	"application/vnd.aether.imp": {
  	source: "iana"
  },
  	"application/vnd.afpc.afplinedata": {
  	source: "iana"
  },
  	"application/vnd.afpc.afplinedata-pagedef": {
  	source: "iana"
  },
  	"application/vnd.afpc.cmoca-cmresource": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-charset": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-codedfont": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-codepage": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-cmtable": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-formdef": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-mediummap": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-objectcontainer": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-overlay": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-pagesegment": {
  	source: "iana"
  },
  	"application/vnd.age": {
  	source: "iana",
  	extensions: [
  		"age"
  	]
  },
  	"application/vnd.ah-barcode": {
  	source: "iana"
  },
  	"application/vnd.ahead.space": {
  	source: "iana",
  	extensions: [
  		"ahead"
  	]
  },
  	"application/vnd.airzip.filesecure.azf": {
  	source: "iana",
  	extensions: [
  		"azf"
  	]
  },
  	"application/vnd.airzip.filesecure.azs": {
  	source: "iana",
  	extensions: [
  		"azs"
  	]
  },
  	"application/vnd.amadeus+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.amazon.ebook": {
  	source: "apache",
  	extensions: [
  		"azw"
  	]
  },
  	"application/vnd.amazon.mobi8-ebook": {
  	source: "iana"
  },
  	"application/vnd.americandynamics.acc": {
  	source: "iana",
  	extensions: [
  		"acc"
  	]
  },
  	"application/vnd.amiga.ami": {
  	source: "iana",
  	extensions: [
  		"ami"
  	]
  },
  	"application/vnd.amundsen.maze+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.android.ota": {
  	source: "iana"
  },
  	"application/vnd.android.package-archive": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"apk"
  	]
  },
  	"application/vnd.anki": {
  	source: "iana"
  },
  	"application/vnd.anser-web-certificate-issue-initiation": {
  	source: "iana",
  	extensions: [
  		"cii"
  	]
  },
  	"application/vnd.anser-web-funds-transfer-initiation": {
  	source: "apache",
  	extensions: [
  		"fti"
  	]
  },
  	"application/vnd.antix.game-component": {
  	source: "iana",
  	extensions: [
  		"atx"
  	]
  },
  	"application/vnd.apache.arrow.file": {
  	source: "iana"
  },
  	"application/vnd.apache.arrow.stream": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.binary": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.compact": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.json": {
  	source: "iana"
  },
  	"application/vnd.api+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.aplextor.warrp+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.apothekende.reservation+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.apple.installer+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpkg"
  	]
  },
  	"application/vnd.apple.keynote": {
  	source: "iana",
  	extensions: [
  		"key"
  	]
  },
  	"application/vnd.apple.mpegurl": {
  	source: "iana",
  	extensions: [
  		"m3u8"
  	]
  },
  	"application/vnd.apple.numbers": {
  	source: "iana",
  	extensions: [
  		"numbers"
  	]
  },
  	"application/vnd.apple.pages": {
  	source: "iana",
  	extensions: [
  		"pages"
  	]
  },
  	"application/vnd.apple.pkpass": {
  	compressible: false,
  	extensions: [
  		"pkpass"
  	]
  },
  	"application/vnd.arastra.swi": {
  	source: "iana"
  },
  	"application/vnd.aristanetworks.swi": {
  	source: "iana",
  	extensions: [
  		"swi"
  	]
  },
  	"application/vnd.artisan+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.artsquare": {
  	source: "iana"
  },
  	"application/vnd.astraea-software.iota": {
  	source: "iana",
  	extensions: [
  		"iota"
  	]
  },
  	"application/vnd.audiograph": {
  	source: "iana",
  	extensions: [
  		"aep"
  	]
  },
  	"application/vnd.autopackage": {
  	source: "iana"
  },
  	"application/vnd.avalon+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.avistar+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.balsamiq.bmml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"bmml"
  	]
  },
  	"application/vnd.balsamiq.bmpr": {
  	source: "iana"
  },
  	"application/vnd.banana-accounting": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.error": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.msg": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.msg+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.bekitzur-stech+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.bint.med-content": {
  	source: "iana"
  },
  	"application/vnd.biopax.rdf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.blink-idb-value-wrapper": {
  	source: "iana"
  },
  	"application/vnd.blueice.multipass": {
  	source: "iana",
  	extensions: [
  		"mpm"
  	]
  },
  	"application/vnd.bluetooth.ep.oob": {
  	source: "iana"
  },
  	"application/vnd.bluetooth.le.oob": {
  	source: "iana"
  },
  	"application/vnd.bmi": {
  	source: "iana",
  	extensions: [
  		"bmi"
  	]
  },
  	"application/vnd.bpf": {
  	source: "iana"
  },
  	"application/vnd.bpf3": {
  	source: "iana"
  },
  	"application/vnd.businessobjects": {
  	source: "iana",
  	extensions: [
  		"rep"
  	]
  },
  	"application/vnd.byu.uapi+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cab-jscript": {
  	source: "iana"
  },
  	"application/vnd.canon-cpdl": {
  	source: "iana"
  },
  	"application/vnd.canon-lips": {
  	source: "iana"
  },
  	"application/vnd.capasystems-pg+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cendio.thinlinc.clientconf": {
  	source: "iana"
  },
  	"application/vnd.century-systems.tcp_stream": {
  	source: "iana"
  },
  	"application/vnd.chemdraw+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cdxml"
  	]
  },
  	"application/vnd.chess-pgn": {
  	source: "iana"
  },
  	"application/vnd.chipnuts.karaoke-mmd": {
  	source: "iana",
  	extensions: [
  		"mmd"
  	]
  },
  	"application/vnd.ciedi": {
  	source: "iana"
  },
  	"application/vnd.cinderella": {
  	source: "iana",
  	extensions: [
  		"cdy"
  	]
  },
  	"application/vnd.cirpack.isdn-ext": {
  	source: "iana"
  },
  	"application/vnd.citationstyles.style+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"csl"
  	]
  },
  	"application/vnd.claymore": {
  	source: "iana",
  	extensions: [
  		"cla"
  	]
  },
  	"application/vnd.cloanto.rp9": {
  	source: "iana",
  	extensions: [
  		"rp9"
  	]
  },
  	"application/vnd.clonk.c4group": {
  	source: "iana",
  	extensions: [
  		"c4g",
  		"c4d",
  		"c4f",
  		"c4p",
  		"c4u"
  	]
  },
  	"application/vnd.cluetrust.cartomobile-config": {
  	source: "iana",
  	extensions: [
  		"c11amc"
  	]
  },
  	"application/vnd.cluetrust.cartomobile-config-pkg": {
  	source: "iana",
  	extensions: [
  		"c11amz"
  	]
  },
  	"application/vnd.coffeescript": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.document": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.document-template": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.presentation": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.presentation-template": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.spreadsheet": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.spreadsheet-template": {
  	source: "iana"
  },
  	"application/vnd.collection+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.collection.doc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.collection.next+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.comicbook+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.comicbook-rar": {
  	source: "iana"
  },
  	"application/vnd.commerce-battelle": {
  	source: "iana"
  },
  	"application/vnd.commonspace": {
  	source: "iana",
  	extensions: [
  		"csp"
  	]
  },
  	"application/vnd.contact.cmsg": {
  	source: "iana",
  	extensions: [
  		"cdbcmsg"
  	]
  },
  	"application/vnd.coreos.ignition+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cosmocaller": {
  	source: "iana",
  	extensions: [
  		"cmc"
  	]
  },
  	"application/vnd.crick.clicker": {
  	source: "iana",
  	extensions: [
  		"clkx"
  	]
  },
  	"application/vnd.crick.clicker.keyboard": {
  	source: "iana",
  	extensions: [
  		"clkk"
  	]
  },
  	"application/vnd.crick.clicker.palette": {
  	source: "iana",
  	extensions: [
  		"clkp"
  	]
  },
  	"application/vnd.crick.clicker.template": {
  	source: "iana",
  	extensions: [
  		"clkt"
  	]
  },
  	"application/vnd.crick.clicker.wordbank": {
  	source: "iana",
  	extensions: [
  		"clkw"
  	]
  },
  	"application/vnd.criticaltools.wbs+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wbs"
  	]
  },
  	"application/vnd.cryptii.pipe+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.crypto-shade-file": {
  	source: "iana"
  },
  	"application/vnd.cryptomator.encrypted": {
  	source: "iana"
  },
  	"application/vnd.cryptomator.vault": {
  	source: "iana"
  },
  	"application/vnd.ctc-posml": {
  	source: "iana",
  	extensions: [
  		"pml"
  	]
  },
  	"application/vnd.ctct.ws+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cups-pdf": {
  	source: "iana"
  },
  	"application/vnd.cups-postscript": {
  	source: "iana"
  },
  	"application/vnd.cups-ppd": {
  	source: "iana",
  	extensions: [
  		"ppd"
  	]
  },
  	"application/vnd.cups-raster": {
  	source: "iana"
  },
  	"application/vnd.cups-raw": {
  	source: "iana"
  },
  	"application/vnd.curl": {
  	source: "iana"
  },
  	"application/vnd.curl.car": {
  	source: "apache",
  	extensions: [
  		"car"
  	]
  },
  	"application/vnd.curl.pcurl": {
  	source: "apache",
  	extensions: [
  		"pcurl"
  	]
  },
  	"application/vnd.cyan.dean.root+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cybank": {
  	source: "iana"
  },
  	"application/vnd.cyclonedx+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cyclonedx+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.d2l.coursepackage1p0+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.d3m-dataset": {
  	source: "iana"
  },
  	"application/vnd.d3m-problem": {
  	source: "iana"
  },
  	"application/vnd.dart": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dart"
  	]
  },
  	"application/vnd.data-vision.rdz": {
  	source: "iana",
  	extensions: [
  		"rdz"
  	]
  },
  	"application/vnd.datapackage+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dataresource+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dbf": {
  	source: "iana",
  	extensions: [
  		"dbf"
  	]
  },
  	"application/vnd.debian.binary-package": {
  	source: "iana"
  },
  	"application/vnd.dece.data": {
  	source: "iana",
  	extensions: [
  		"uvf",
  		"uvvf",
  		"uvd",
  		"uvvd"
  	]
  },
  	"application/vnd.dece.ttml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uvt",
  		"uvvt"
  	]
  },
  	"application/vnd.dece.unspecified": {
  	source: "iana",
  	extensions: [
  		"uvx",
  		"uvvx"
  	]
  },
  	"application/vnd.dece.zip": {
  	source: "iana",
  	extensions: [
  		"uvz",
  		"uvvz"
  	]
  },
  	"application/vnd.denovo.fcselayout-link": {
  	source: "iana",
  	extensions: [
  		"fe_launch"
  	]
  },
  	"application/vnd.desmume.movie": {
  	source: "iana"
  },
  	"application/vnd.dir-bi.plate-dl-nosuffix": {
  	source: "iana"
  },
  	"application/vnd.dm.delegation+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dna": {
  	source: "iana",
  	extensions: [
  		"dna"
  	]
  },
  	"application/vnd.document+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dolby.mlp": {
  	source: "apache",
  	extensions: [
  		"mlp"
  	]
  },
  	"application/vnd.dolby.mobile.1": {
  	source: "iana"
  },
  	"application/vnd.dolby.mobile.2": {
  	source: "iana"
  },
  	"application/vnd.doremir.scorecloud-binary-document": {
  	source: "iana"
  },
  	"application/vnd.dpgraph": {
  	source: "iana",
  	extensions: [
  		"dpg"
  	]
  },
  	"application/vnd.dreamfactory": {
  	source: "iana",
  	extensions: [
  		"dfac"
  	]
  },
  	"application/vnd.drive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ds-keypoint": {
  	source: "apache",
  	extensions: [
  		"kpxx"
  	]
  },
  	"application/vnd.dtg.local": {
  	source: "iana"
  },
  	"application/vnd.dtg.local.flash": {
  	source: "iana"
  },
  	"application/vnd.dtg.local.html": {
  	source: "iana"
  },
  	"application/vnd.dvb.ait": {
  	source: "iana",
  	extensions: [
  		"ait"
  	]
  },
  	"application/vnd.dvb.dvbisl+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.dvbj": {
  	source: "iana"
  },
  	"application/vnd.dvb.esgcontainer": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcdftnotifaccess": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgaccess": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgaccess2": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgpdd": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcroaming": {
  	source: "iana"
  },
  	"application/vnd.dvb.iptv.alfec-base": {
  	source: "iana"
  },
  	"application/vnd.dvb.iptv.alfec-enhancement": {
  	source: "iana"
  },
  	"application/vnd.dvb.notif-aggregate-root+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-container+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-generic+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-msglist+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-registration-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-registration-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-init+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.pfr": {
  	source: "iana"
  },
  	"application/vnd.dvb.service": {
  	source: "iana",
  	extensions: [
  		"svc"
  	]
  },
  	"application/vnd.dxr": {
  	source: "iana"
  },
  	"application/vnd.dynageo": {
  	source: "iana",
  	extensions: [
  		"geo"
  	]
  },
  	"application/vnd.dzr": {
  	source: "iana"
  },
  	"application/vnd.easykaraoke.cdgdownload": {
  	source: "iana"
  },
  	"application/vnd.ecdis-update": {
  	source: "iana"
  },
  	"application/vnd.ecip.rlp": {
  	source: "iana"
  },
  	"application/vnd.eclipse.ditto+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ecowin.chart": {
  	source: "iana",
  	extensions: [
  		"mag"
  	]
  },
  	"application/vnd.ecowin.filerequest": {
  	source: "iana"
  },
  	"application/vnd.ecowin.fileupdate": {
  	source: "iana"
  },
  	"application/vnd.ecowin.series": {
  	source: "iana"
  },
  	"application/vnd.ecowin.seriesrequest": {
  	source: "iana"
  },
  	"application/vnd.ecowin.seriesupdate": {
  	source: "iana"
  },
  	"application/vnd.efi.img": {
  	source: "iana"
  },
  	"application/vnd.efi.iso": {
  	source: "iana"
  },
  	"application/vnd.emclient.accessrequest+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.enliven": {
  	source: "iana",
  	extensions: [
  		"nml"
  	]
  },
  	"application/vnd.enphase.envoy": {
  	source: "iana"
  },
  	"application/vnd.eprints.data+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.epson.esf": {
  	source: "iana",
  	extensions: [
  		"esf"
  	]
  },
  	"application/vnd.epson.msf": {
  	source: "iana",
  	extensions: [
  		"msf"
  	]
  },
  	"application/vnd.epson.quickanime": {
  	source: "iana",
  	extensions: [
  		"qam"
  	]
  },
  	"application/vnd.epson.salt": {
  	source: "iana",
  	extensions: [
  		"slt"
  	]
  },
  	"application/vnd.epson.ssf": {
  	source: "iana",
  	extensions: [
  		"ssf"
  	]
  },
  	"application/vnd.ericsson.quickcall": {
  	source: "iana"
  },
  	"application/vnd.espass-espass+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.eszigno3+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"es3",
  		"et3"
  	]
  },
  	"application/vnd.etsi.aoc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.asic-e+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.etsi.asic-s+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.etsi.cug+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvcommand+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvdiscovery+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-bc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-cod+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-npvr+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvservice+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsync+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvueprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.mcid+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.mheg5": {
  	source: "iana"
  },
  	"application/vnd.etsi.overload-control-policy-dataset+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.pstn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.sci+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.simservs+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.timestamp-token": {
  	source: "iana"
  },
  	"application/vnd.etsi.tsl+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.tsl.der": {
  	source: "iana"
  },
  	"application/vnd.eu.kasparian.car+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.eudora.data": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.profile": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.settings": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.theme": {
  	source: "iana"
  },
  	"application/vnd.exstream-empower+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.exstream-package": {
  	source: "iana"
  },
  	"application/vnd.ezpix-album": {
  	source: "iana",
  	extensions: [
  		"ez2"
  	]
  },
  	"application/vnd.ezpix-package": {
  	source: "iana",
  	extensions: [
  		"ez3"
  	]
  },
  	"application/vnd.f-secure.mobile": {
  	source: "iana"
  },
  	"application/vnd.familysearch.gedcom+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.fastcopy-disk-image": {
  	source: "iana"
  },
  	"application/vnd.fdf": {
  	source: "iana",
  	extensions: [
  		"fdf"
  	]
  },
  	"application/vnd.fdsn.mseed": {
  	source: "iana",
  	extensions: [
  		"mseed"
  	]
  },
  	"application/vnd.fdsn.seed": {
  	source: "iana",
  	extensions: [
  		"seed",
  		"dataless"
  	]
  },
  	"application/vnd.ffsns": {
  	source: "iana"
  },
  	"application/vnd.ficlab.flb+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.filmit.zfc": {
  	source: "iana"
  },
  	"application/vnd.fints": {
  	source: "iana"
  },
  	"application/vnd.firemonkeys.cloudcell": {
  	source: "iana"
  },
  	"application/vnd.flographit": {
  	source: "iana",
  	extensions: [
  		"gph"
  	]
  },
  	"application/vnd.fluxtime.clip": {
  	source: "iana",
  	extensions: [
  		"ftc"
  	]
  },
  	"application/vnd.font-fontforge-sfd": {
  	source: "iana"
  },
  	"application/vnd.framemaker": {
  	source: "iana",
  	extensions: [
  		"fm",
  		"frame",
  		"maker",
  		"book"
  	]
  },
  	"application/vnd.frogans.fnc": {
  	source: "iana",
  	extensions: [
  		"fnc"
  	]
  },
  	"application/vnd.frogans.ltf": {
  	source: "iana",
  	extensions: [
  		"ltf"
  	]
  },
  	"application/vnd.fsc.weblaunch": {
  	source: "iana",
  	extensions: [
  		"fsc"
  	]
  },
  	"application/vnd.fujifilm.fb.docuworks": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.docuworks.binder": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.docuworks.container": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.jfi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.fujitsu.oasys": {
  	source: "iana",
  	extensions: [
  		"oas"
  	]
  },
  	"application/vnd.fujitsu.oasys2": {
  	source: "iana",
  	extensions: [
  		"oa2"
  	]
  },
  	"application/vnd.fujitsu.oasys3": {
  	source: "iana",
  	extensions: [
  		"oa3"
  	]
  },
  	"application/vnd.fujitsu.oasysgp": {
  	source: "iana",
  	extensions: [
  		"fg5"
  	]
  },
  	"application/vnd.fujitsu.oasysprs": {
  	source: "iana",
  	extensions: [
  		"bh2"
  	]
  },
  	"application/vnd.fujixerox.art-ex": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.art4": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.ddd": {
  	source: "iana",
  	extensions: [
  		"ddd"
  	]
  },
  	"application/vnd.fujixerox.docuworks": {
  	source: "iana",
  	extensions: [
  		"xdw"
  	]
  },
  	"application/vnd.fujixerox.docuworks.binder": {
  	source: "iana",
  	extensions: [
  		"xbd"
  	]
  },
  	"application/vnd.fujixerox.docuworks.container": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.hbpl": {
  	source: "iana"
  },
  	"application/vnd.fut-misnet": {
  	source: "iana"
  },
  	"application/vnd.futoin+cbor": {
  	source: "iana"
  },
  	"application/vnd.futoin+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.fuzzysheet": {
  	source: "iana",
  	extensions: [
  		"fzs"
  	]
  },
  	"application/vnd.genomatix.tuxedo": {
  	source: "iana",
  	extensions: [
  		"txd"
  	]
  },
  	"application/vnd.gentics.grd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geo+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geocube+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geogebra.file": {
  	source: "iana",
  	extensions: [
  		"ggb"
  	]
  },
  	"application/vnd.geogebra.slides": {
  	source: "iana"
  },
  	"application/vnd.geogebra.tool": {
  	source: "iana",
  	extensions: [
  		"ggt"
  	]
  },
  	"application/vnd.geometry-explorer": {
  	source: "iana",
  	extensions: [
  		"gex",
  		"gre"
  	]
  },
  	"application/vnd.geonext": {
  	source: "iana",
  	extensions: [
  		"gxt"
  	]
  },
  	"application/vnd.geoplan": {
  	source: "iana",
  	extensions: [
  		"g2w"
  	]
  },
  	"application/vnd.geospace": {
  	source: "iana",
  	extensions: [
  		"g3w"
  	]
  },
  	"application/vnd.gerber": {
  	source: "iana"
  },
  	"application/vnd.globalplatform.card-content-mgt": {
  	source: "iana"
  },
  	"application/vnd.globalplatform.card-content-mgt-response": {
  	source: "iana"
  },
  	"application/vnd.gmx": {
  	source: "iana",
  	extensions: [
  		"gmx"
  	]
  },
  	"application/vnd.google-apps.document": {
  	compressible: false,
  	extensions: [
  		"gdoc"
  	]
  },
  	"application/vnd.google-apps.presentation": {
  	compressible: false,
  	extensions: [
  		"gslides"
  	]
  },
  	"application/vnd.google-apps.spreadsheet": {
  	compressible: false,
  	extensions: [
  		"gsheet"
  	]
  },
  	"application/vnd.google-earth.kml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"kml"
  	]
  },
  	"application/vnd.google-earth.kmz": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"kmz"
  	]
  },
  	"application/vnd.gov.sk.e-form+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.gov.sk.e-form+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.gov.sk.xmldatacontainer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.grafeq": {
  	source: "iana",
  	extensions: [
  		"gqf",
  		"gqs"
  	]
  },
  	"application/vnd.gridmp": {
  	source: "iana"
  },
  	"application/vnd.groove-account": {
  	source: "iana",
  	extensions: [
  		"gac"
  	]
  },
  	"application/vnd.groove-help": {
  	source: "iana",
  	extensions: [
  		"ghf"
  	]
  },
  	"application/vnd.groove-identity-message": {
  	source: "iana",
  	extensions: [
  		"gim"
  	]
  },
  	"application/vnd.groove-injector": {
  	source: "iana",
  	extensions: [
  		"grv"
  	]
  },
  	"application/vnd.groove-tool-message": {
  	source: "iana",
  	extensions: [
  		"gtm"
  	]
  },
  	"application/vnd.groove-tool-template": {
  	source: "iana",
  	extensions: [
  		"tpl"
  	]
  },
  	"application/vnd.groove-vcard": {
  	source: "iana",
  	extensions: [
  		"vcg"
  	]
  },
  	"application/vnd.hal+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hal+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"hal"
  	]
  },
  	"application/vnd.handheld-entertainment+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"zmm"
  	]
  },
  	"application/vnd.hbci": {
  	source: "iana",
  	extensions: [
  		"hbci"
  	]
  },
  	"application/vnd.hc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hcl-bireports": {
  	source: "iana"
  },
  	"application/vnd.hdt": {
  	source: "iana"
  },
  	"application/vnd.heroku+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hhe.lesson-player": {
  	source: "iana",
  	extensions: [
  		"les"
  	]
  },
  	"application/vnd.hl7cda+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.hl7v2+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.hp-hpgl": {
  	source: "iana",
  	extensions: [
  		"hpgl"
  	]
  },
  	"application/vnd.hp-hpid": {
  	source: "iana",
  	extensions: [
  		"hpid"
  	]
  },
  	"application/vnd.hp-hps": {
  	source: "iana",
  	extensions: [
  		"hps"
  	]
  },
  	"application/vnd.hp-jlyt": {
  	source: "iana",
  	extensions: [
  		"jlt"
  	]
  },
  	"application/vnd.hp-pcl": {
  	source: "iana",
  	extensions: [
  		"pcl"
  	]
  },
  	"application/vnd.hp-pclxl": {
  	source: "iana",
  	extensions: [
  		"pclxl"
  	]
  },
  	"application/vnd.httphone": {
  	source: "iana"
  },
  	"application/vnd.hydrostatix.sof-data": {
  	source: "iana",
  	extensions: [
  		"sfd-hdstx"
  	]
  },
  	"application/vnd.hyper+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hyper-item+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hyperdrive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hzn-3d-crossword": {
  	source: "iana"
  },
  	"application/vnd.ibm.afplinedata": {
  	source: "iana"
  },
  	"application/vnd.ibm.electronic-media": {
  	source: "iana"
  },
  	"application/vnd.ibm.minipay": {
  	source: "iana",
  	extensions: [
  		"mpy"
  	]
  },
  	"application/vnd.ibm.modcap": {
  	source: "iana",
  	extensions: [
  		"afp",
  		"listafp",
  		"list3820"
  	]
  },
  	"application/vnd.ibm.rights-management": {
  	source: "iana",
  	extensions: [
  		"irm"
  	]
  },
  	"application/vnd.ibm.secure-container": {
  	source: "iana",
  	extensions: [
  		"sc"
  	]
  },
  	"application/vnd.iccprofile": {
  	source: "iana",
  	extensions: [
  		"icc",
  		"icm"
  	]
  },
  	"application/vnd.ieee.1905": {
  	source: "iana"
  },
  	"application/vnd.igloader": {
  	source: "iana",
  	extensions: [
  		"igl"
  	]
  },
  	"application/vnd.imagemeter.folder+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.imagemeter.image+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.immervision-ivp": {
  	source: "iana",
  	extensions: [
  		"ivp"
  	]
  },
  	"application/vnd.immervision-ivu": {
  	source: "iana",
  	extensions: [
  		"ivu"
  	]
  },
  	"application/vnd.ims.imsccv1p1": {
  	source: "iana"
  },
  	"application/vnd.ims.imsccv1p2": {
  	source: "iana"
  },
  	"application/vnd.ims.imsccv1p3": {
  	source: "iana"
  },
  	"application/vnd.ims.lis.v2.result+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolproxy+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolproxy.id+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolsettings+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.informedcontrol.rms+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.informix-visionary": {
  	source: "iana"
  },
  	"application/vnd.infotech.project": {
  	source: "iana"
  },
  	"application/vnd.infotech.project+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.innopath.wamp.notification": {
  	source: "iana"
  },
  	"application/vnd.insors.igm": {
  	source: "iana",
  	extensions: [
  		"igm"
  	]
  },
  	"application/vnd.intercon.formnet": {
  	source: "iana",
  	extensions: [
  		"xpw",
  		"xpx"
  	]
  },
  	"application/vnd.intergeo": {
  	source: "iana",
  	extensions: [
  		"i2g"
  	]
  },
  	"application/vnd.intertrust.digibox": {
  	source: "iana"
  },
  	"application/vnd.intertrust.nncp": {
  	source: "iana"
  },
  	"application/vnd.intu.qbo": {
  	source: "iana",
  	extensions: [
  		"qbo"
  	]
  },
  	"application/vnd.intu.qfx": {
  	source: "iana",
  	extensions: [
  		"qfx"
  	]
  },
  	"application/vnd.iptc.g2.catalogitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.conceptitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.knowledgeitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.newsitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.newsmessage+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.packageitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.planningitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ipunplugged.rcprofile": {
  	source: "iana",
  	extensions: [
  		"rcprofile"
  	]
  },
  	"application/vnd.irepository.package+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"irp"
  	]
  },
  	"application/vnd.is-xpr": {
  	source: "iana",
  	extensions: [
  		"xpr"
  	]
  },
  	"application/vnd.isac.fcs": {
  	source: "iana",
  	extensions: [
  		"fcs"
  	]
  },
  	"application/vnd.iso11783-10+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.jam": {
  	source: "iana",
  	extensions: [
  		"jam"
  	]
  },
  	"application/vnd.japannet-directory-service": {
  	source: "iana"
  },
  	"application/vnd.japannet-jpnstore-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-payment-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-registration": {
  	source: "iana"
  },
  	"application/vnd.japannet-registration-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-setstore-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-verification": {
  	source: "iana"
  },
  	"application/vnd.japannet-verification-wakeup": {
  	source: "iana"
  },
  	"application/vnd.jcp.javame.midlet-rms": {
  	source: "iana",
  	extensions: [
  		"rms"
  	]
  },
  	"application/vnd.jisp": {
  	source: "iana",
  	extensions: [
  		"jisp"
  	]
  },
  	"application/vnd.joost.joda-archive": {
  	source: "iana",
  	extensions: [
  		"joda"
  	]
  },
  	"application/vnd.jsk.isdn-ngn": {
  	source: "iana"
  },
  	"application/vnd.kahootz": {
  	source: "iana",
  	extensions: [
  		"ktz",
  		"ktr"
  	]
  },
  	"application/vnd.kde.karbon": {
  	source: "iana",
  	extensions: [
  		"karbon"
  	]
  },
  	"application/vnd.kde.kchart": {
  	source: "iana",
  	extensions: [
  		"chrt"
  	]
  },
  	"application/vnd.kde.kformula": {
  	source: "iana",
  	extensions: [
  		"kfo"
  	]
  },
  	"application/vnd.kde.kivio": {
  	source: "iana",
  	extensions: [
  		"flw"
  	]
  },
  	"application/vnd.kde.kontour": {
  	source: "iana",
  	extensions: [
  		"kon"
  	]
  },
  	"application/vnd.kde.kpresenter": {
  	source: "iana",
  	extensions: [
  		"kpr",
  		"kpt"
  	]
  },
  	"application/vnd.kde.kspread": {
  	source: "iana",
  	extensions: [
  		"ksp"
  	]
  },
  	"application/vnd.kde.kword": {
  	source: "iana",
  	extensions: [
  		"kwd",
  		"kwt"
  	]
  },
  	"application/vnd.kenameaapp": {
  	source: "iana",
  	extensions: [
  		"htke"
  	]
  },
  	"application/vnd.kidspiration": {
  	source: "iana",
  	extensions: [
  		"kia"
  	]
  },
  	"application/vnd.kinar": {
  	source: "iana",
  	extensions: [
  		"kne",
  		"knp"
  	]
  },
  	"application/vnd.koan": {
  	source: "iana",
  	extensions: [
  		"skp",
  		"skd",
  		"skt",
  		"skm"
  	]
  },
  	"application/vnd.kodak-descriptor": {
  	source: "iana",
  	extensions: [
  		"sse"
  	]
  },
  	"application/vnd.las": {
  	source: "iana"
  },
  	"application/vnd.las.las+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.las.las+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lasxml"
  	]
  },
  	"application/vnd.laszip": {
  	source: "iana"
  },
  	"application/vnd.leap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.liberty-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.llamagraphics.life-balance.desktop": {
  	source: "iana",
  	extensions: [
  		"lbd"
  	]
  },
  	"application/vnd.llamagraphics.life-balance.exchange+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lbe"
  	]
  },
  	"application/vnd.logipipe.circuit+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.loom": {
  	source: "iana"
  },
  	"application/vnd.lotus-1-2-3": {
  	source: "iana",
  	extensions: [
  		"123"
  	]
  },
  	"application/vnd.lotus-approach": {
  	source: "iana",
  	extensions: [
  		"apr"
  	]
  },
  	"application/vnd.lotus-freelance": {
  	source: "iana",
  	extensions: [
  		"pre"
  	]
  },
  	"application/vnd.lotus-notes": {
  	source: "iana",
  	extensions: [
  		"nsf"
  	]
  },
  	"application/vnd.lotus-organizer": {
  	source: "iana",
  	extensions: [
  		"org"
  	]
  },
  	"application/vnd.lotus-screencam": {
  	source: "iana",
  	extensions: [
  		"scm"
  	]
  },
  	"application/vnd.lotus-wordpro": {
  	source: "iana",
  	extensions: [
  		"lwp"
  	]
  },
  	"application/vnd.macports.portpkg": {
  	source: "iana",
  	extensions: [
  		"portpkg"
  	]
  },
  	"application/vnd.mapbox-vector-tile": {
  	source: "iana",
  	extensions: [
  		"mvt"
  	]
  },
  	"application/vnd.marlin.drm.actiontoken+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.conftoken+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.license+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.mdcf": {
  	source: "iana"
  },
  	"application/vnd.mason+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.maxar.archive.3tz+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.maxmind.maxmind-db": {
  	source: "iana"
  },
  	"application/vnd.mcd": {
  	source: "iana",
  	extensions: [
  		"mcd"
  	]
  },
  	"application/vnd.medcalcdata": {
  	source: "iana",
  	extensions: [
  		"mc1"
  	]
  },
  	"application/vnd.mediastation.cdkey": {
  	source: "iana",
  	extensions: [
  		"cdkey"
  	]
  },
  	"application/vnd.meridian-slingshot": {
  	source: "iana"
  },
  	"application/vnd.mfer": {
  	source: "iana",
  	extensions: [
  		"mwf"
  	]
  },
  	"application/vnd.mfmp": {
  	source: "iana",
  	extensions: [
  		"mfm"
  	]
  },
  	"application/vnd.micro+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.micrografx.flo": {
  	source: "iana",
  	extensions: [
  		"flo"
  	]
  },
  	"application/vnd.micrografx.igx": {
  	source: "iana",
  	extensions: [
  		"igx"
  	]
  },
  	"application/vnd.microsoft.portable-executable": {
  	source: "iana"
  },
  	"application/vnd.microsoft.windows.thumbnail-cache": {
  	source: "iana"
  },
  	"application/vnd.miele+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.mif": {
  	source: "iana",
  	extensions: [
  		"mif"
  	]
  },
  	"application/vnd.minisoft-hp3000-save": {
  	source: "iana"
  },
  	"application/vnd.mitsubishi.misty-guard.trustweb": {
  	source: "iana"
  },
  	"application/vnd.mobius.daf": {
  	source: "iana",
  	extensions: [
  		"daf"
  	]
  },
  	"application/vnd.mobius.dis": {
  	source: "iana",
  	extensions: [
  		"dis"
  	]
  },
  	"application/vnd.mobius.mbk": {
  	source: "iana",
  	extensions: [
  		"mbk"
  	]
  },
  	"application/vnd.mobius.mqy": {
  	source: "iana",
  	extensions: [
  		"mqy"
  	]
  },
  	"application/vnd.mobius.msl": {
  	source: "iana",
  	extensions: [
  		"msl"
  	]
  },
  	"application/vnd.mobius.plc": {
  	source: "iana",
  	extensions: [
  		"plc"
  	]
  },
  	"application/vnd.mobius.txf": {
  	source: "iana",
  	extensions: [
  		"txf"
  	]
  },
  	"application/vnd.mophun.application": {
  	source: "iana",
  	extensions: [
  		"mpn"
  	]
  },
  	"application/vnd.mophun.certificate": {
  	source: "iana",
  	extensions: [
  		"mpc"
  	]
  },
  	"application/vnd.motorola.flexsuite": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.adsi": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.fis": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.gotap": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.kmr": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.ttc": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.wem": {
  	source: "iana"
  },
  	"application/vnd.motorola.iprm": {
  	source: "iana"
  },
  	"application/vnd.mozilla.xul+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xul"
  	]
  },
  	"application/vnd.ms-3mfdocument": {
  	source: "iana"
  },
  	"application/vnd.ms-artgalry": {
  	source: "iana",
  	extensions: [
  		"cil"
  	]
  },
  	"application/vnd.ms-asf": {
  	source: "iana"
  },
  	"application/vnd.ms-cab-compressed": {
  	source: "iana",
  	extensions: [
  		"cab"
  	]
  },
  	"application/vnd.ms-color.iccprofile": {
  	source: "apache"
  },
  	"application/vnd.ms-excel": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xls",
  		"xlm",
  		"xla",
  		"xlc",
  		"xlt",
  		"xlw"
  	]
  },
  	"application/vnd.ms-excel.addin.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlam"
  	]
  },
  	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlsb"
  	]
  },
  	"application/vnd.ms-excel.sheet.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlsm"
  	]
  },
  	"application/vnd.ms-excel.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xltm"
  	]
  },
  	"application/vnd.ms-fontobject": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"eot"
  	]
  },
  	"application/vnd.ms-htmlhelp": {
  	source: "iana",
  	extensions: [
  		"chm"
  	]
  },
  	"application/vnd.ms-ims": {
  	source: "iana",
  	extensions: [
  		"ims"
  	]
  },
  	"application/vnd.ms-lrm": {
  	source: "iana",
  	extensions: [
  		"lrm"
  	]
  },
  	"application/vnd.ms-office.activex+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-officetheme": {
  	source: "iana",
  	extensions: [
  		"thmx"
  	]
  },
  	"application/vnd.ms-opentype": {
  	source: "apache",
  	compressible: true
  },
  	"application/vnd.ms-outlook": {
  	compressible: false,
  	extensions: [
  		"msg"
  	]
  },
  	"application/vnd.ms-package.obfuscated-opentype": {
  	source: "apache"
  },
  	"application/vnd.ms-pki.seccat": {
  	source: "apache",
  	extensions: [
  		"cat"
  	]
  },
  	"application/vnd.ms-pki.stl": {
  	source: "apache",
  	extensions: [
  		"stl"
  	]
  },
  	"application/vnd.ms-playready.initiator+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-powerpoint": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ppt",
  		"pps",
  		"pot"
  	]
  },
  	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"ppam"
  	]
  },
  	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"pptm"
  	]
  },
  	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"sldm"
  	]
  },
  	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"ppsm"
  	]
  },
  	"application/vnd.ms-powerpoint.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"potm"
  	]
  },
  	"application/vnd.ms-printdevicecapabilities+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-printing.printticket+xml": {
  	source: "apache",
  	compressible: true
  },
  	"application/vnd.ms-printschematicket+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-project": {
  	source: "iana",
  	extensions: [
  		"mpp",
  		"mpt"
  	]
  },
  	"application/vnd.ms-tnef": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.devicepairing": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.nwprinting.oob": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.printerpairing": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.wsd.oob": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.lic-chlg-req": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.lic-resp": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.meter-chlg-req": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.meter-resp": {
  	source: "iana"
  },
  	"application/vnd.ms-word.document.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"docm"
  	]
  },
  	"application/vnd.ms-word.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"dotm"
  	]
  },
  	"application/vnd.ms-works": {
  	source: "iana",
  	extensions: [
  		"wps",
  		"wks",
  		"wcm",
  		"wdb"
  	]
  },
  	"application/vnd.ms-wpl": {
  	source: "iana",
  	extensions: [
  		"wpl"
  	]
  },
  	"application/vnd.ms-xpsdocument": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xps"
  	]
  },
  	"application/vnd.msa-disk-image": {
  	source: "iana"
  },
  	"application/vnd.mseq": {
  	source: "iana",
  	extensions: [
  		"mseq"
  	]
  },
  	"application/vnd.msign": {
  	source: "iana"
  },
  	"application/vnd.multiad.creator": {
  	source: "iana"
  },
  	"application/vnd.multiad.creator.cif": {
  	source: "iana"
  },
  	"application/vnd.music-niff": {
  	source: "iana"
  },
  	"application/vnd.musician": {
  	source: "iana",
  	extensions: [
  		"mus"
  	]
  },
  	"application/vnd.muvee.style": {
  	source: "iana",
  	extensions: [
  		"msty"
  	]
  },
  	"application/vnd.mynfc": {
  	source: "iana",
  	extensions: [
  		"taglet"
  	]
  },
  	"application/vnd.nacamar.ybrid+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ncd.control": {
  	source: "iana"
  },
  	"application/vnd.ncd.reference": {
  	source: "iana"
  },
  	"application/vnd.nearst.inv+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nebumind.line": {
  	source: "iana"
  },
  	"application/vnd.nervana": {
  	source: "iana"
  },
  	"application/vnd.netfpx": {
  	source: "iana"
  },
  	"application/vnd.neurolanguage.nlu": {
  	source: "iana",
  	extensions: [
  		"nlu"
  	]
  },
  	"application/vnd.nimn": {
  	source: "iana"
  },
  	"application/vnd.nintendo.nitro.rom": {
  	source: "iana"
  },
  	"application/vnd.nintendo.snes.rom": {
  	source: "iana"
  },
  	"application/vnd.nitf": {
  	source: "iana",
  	extensions: [
  		"ntf",
  		"nitf"
  	]
  },
  	"application/vnd.noblenet-directory": {
  	source: "iana",
  	extensions: [
  		"nnd"
  	]
  },
  	"application/vnd.noblenet-sealer": {
  	source: "iana",
  	extensions: [
  		"nns"
  	]
  },
  	"application/vnd.noblenet-web": {
  	source: "iana",
  	extensions: [
  		"nnw"
  	]
  },
  	"application/vnd.nokia.catalogs": {
  	source: "iana"
  },
  	"application/vnd.nokia.conml+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.conml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.iptv.config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.isds-radio-presets": {
  	source: "iana"
  },
  	"application/vnd.nokia.landmark+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.landmark+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.landmarkcollection+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.n-gage.ac+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ac"
  	]
  },
  	"application/vnd.nokia.n-gage.data": {
  	source: "iana",
  	extensions: [
  		"ngdat"
  	]
  },
  	"application/vnd.nokia.n-gage.symbian.install": {
  	source: "iana",
  	extensions: [
  		"n-gage"
  	]
  },
  	"application/vnd.nokia.ncd": {
  	source: "iana"
  },
  	"application/vnd.nokia.pcd+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.pcd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.radio-preset": {
  	source: "iana",
  	extensions: [
  		"rpst"
  	]
  },
  	"application/vnd.nokia.radio-presets": {
  	source: "iana",
  	extensions: [
  		"rpss"
  	]
  },
  	"application/vnd.novadigm.edm": {
  	source: "iana",
  	extensions: [
  		"edm"
  	]
  },
  	"application/vnd.novadigm.edx": {
  	source: "iana",
  	extensions: [
  		"edx"
  	]
  },
  	"application/vnd.novadigm.ext": {
  	source: "iana",
  	extensions: [
  		"ext"
  	]
  },
  	"application/vnd.ntt-local.content-share": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.file-transfer": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.ogw_remote-access": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.sip-ta_remote": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.sip-ta_tcp_stream": {
  	source: "iana"
  },
  	"application/vnd.oasis.opendocument.chart": {
  	source: "iana",
  	extensions: [
  		"odc"
  	]
  },
  	"application/vnd.oasis.opendocument.chart-template": {
  	source: "iana",
  	extensions: [
  		"otc"
  	]
  },
  	"application/vnd.oasis.opendocument.database": {
  	source: "iana",
  	extensions: [
  		"odb"
  	]
  },
  	"application/vnd.oasis.opendocument.formula": {
  	source: "iana",
  	extensions: [
  		"odf"
  	]
  },
  	"application/vnd.oasis.opendocument.formula-template": {
  	source: "iana",
  	extensions: [
  		"odft"
  	]
  },
  	"application/vnd.oasis.opendocument.graphics": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odg"
  	]
  },
  	"application/vnd.oasis.opendocument.graphics-template": {
  	source: "iana",
  	extensions: [
  		"otg"
  	]
  },
  	"application/vnd.oasis.opendocument.image": {
  	source: "iana",
  	extensions: [
  		"odi"
  	]
  },
  	"application/vnd.oasis.opendocument.image-template": {
  	source: "iana",
  	extensions: [
  		"oti"
  	]
  },
  	"application/vnd.oasis.opendocument.presentation": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odp"
  	]
  },
  	"application/vnd.oasis.opendocument.presentation-template": {
  	source: "iana",
  	extensions: [
  		"otp"
  	]
  },
  	"application/vnd.oasis.opendocument.spreadsheet": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ods"
  	]
  },
  	"application/vnd.oasis.opendocument.spreadsheet-template": {
  	source: "iana",
  	extensions: [
  		"ots"
  	]
  },
  	"application/vnd.oasis.opendocument.text": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odt"
  	]
  },
  	"application/vnd.oasis.opendocument.text-master": {
  	source: "iana",
  	extensions: [
  		"odm"
  	]
  },
  	"application/vnd.oasis.opendocument.text-template": {
  	source: "iana",
  	extensions: [
  		"ott"
  	]
  },
  	"application/vnd.oasis.opendocument.text-web": {
  	source: "iana",
  	extensions: [
  		"oth"
  	]
  },
  	"application/vnd.obn": {
  	source: "iana"
  },
  	"application/vnd.ocf+cbor": {
  	source: "iana"
  },
  	"application/vnd.oci.image.manifest.v1+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oftn.l10n+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.contentaccessdownload+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.contentaccessstreaming+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.cspg-hexbinary": {
  	source: "iana"
  },
  	"application/vnd.oipf.dae.svg+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.dae.xhtml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.mippvcontrolmessage+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.pae.gem": {
  	source: "iana"
  },
  	"application/vnd.oipf.spdiscovery+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.spdlist+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.ueprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.userprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.olpc-sugar": {
  	source: "iana",
  	extensions: [
  		"xo"
  	]
  },
  	"application/vnd.oma-scws-config": {
  	source: "iana"
  },
  	"application/vnd.oma-scws-http-request": {
  	source: "iana"
  },
  	"application/vnd.oma-scws-http-response": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.drm-trigger+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.imd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.ltkm": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.notification+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.provisioningtrigger": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.sgboot": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.sgdd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.sgdu": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.simple-symbol-container": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.smartcard-trigger+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.sprov+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.stkm": {
  	source: "iana"
  },
  	"application/vnd.oma.cab-address-book+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-feature-handler+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-pcc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-subs-invite+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-user-prefs+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.dcd": {
  	source: "iana"
  },
  	"application/vnd.oma.dcdc": {
  	source: "iana"
  },
  	"application/vnd.oma.dd2+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dd2"
  	]
  },
  	"application/vnd.oma.drm.risd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.group-usage-list+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.lwm2m+cbor": {
  	source: "iana"
  },
  	"application/vnd.oma.lwm2m+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.lwm2m+tlv": {
  	source: "iana"
  },
  	"application/vnd.oma.pal+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.detailed-progress-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.final-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.groups+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.invocation-descriptor+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.optimized-progress-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.push": {
  	source: "iana"
  },
  	"application/vnd.oma.scidm.messages+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.xcap-directory+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.omads-email+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omads-file+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omads-folder+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omaloc-supl-init": {
  	source: "iana"
  },
  	"application/vnd.onepager": {
  	source: "iana"
  },
  	"application/vnd.onepagertamp": {
  	source: "iana"
  },
  	"application/vnd.onepagertamx": {
  	source: "iana"
  },
  	"application/vnd.onepagertat": {
  	source: "iana"
  },
  	"application/vnd.onepagertatp": {
  	source: "iana"
  },
  	"application/vnd.onepagertatx": {
  	source: "iana"
  },
  	"application/vnd.openblox.game+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"obgx"
  	]
  },
  	"application/vnd.openblox.game-binary": {
  	source: "iana"
  },
  	"application/vnd.openeye.oeb": {
  	source: "iana"
  },
  	"application/vnd.openofficeorg.extension": {
  	source: "apache",
  	extensions: [
  		"oxt"
  	]
  },
  	"application/vnd.openstreetmap.data+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"osm"
  	]
  },
  	"application/vnd.opentimestamps.ots": {
  	source: "iana"
  },
  	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawing+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pptx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
  	source: "iana",
  	extensions: [
  		"sldx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
  	source: "iana",
  	extensions: [
  		"ppsx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.template": {
  	source: "iana",
  	extensions: [
  		"potx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xlsx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
  	source: "iana",
  	extensions: [
  		"xltx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.theme+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.vmldrawing": {
  	source: "iana"
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"docx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
  	source: "iana",
  	extensions: [
  		"dotx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.core-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.relationships+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oracle.resource+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.orange.indata": {
  	source: "iana"
  },
  	"application/vnd.osa.netdeploy": {
  	source: "iana"
  },
  	"application/vnd.osgeo.mapguide.package": {
  	source: "iana",
  	extensions: [
  		"mgp"
  	]
  },
  	"application/vnd.osgi.bundle": {
  	source: "iana"
  },
  	"application/vnd.osgi.dp": {
  	source: "iana",
  	extensions: [
  		"dp"
  	]
  },
  	"application/vnd.osgi.subsystem": {
  	source: "iana",
  	extensions: [
  		"esa"
  	]
  },
  	"application/vnd.otps.ct-kip+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oxli.countgraph": {
  	source: "iana"
  },
  	"application/vnd.pagerduty+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.palm": {
  	source: "iana",
  	extensions: [
  		"pdb",
  		"pqa",
  		"oprc"
  	]
  },
  	"application/vnd.panoply": {
  	source: "iana"
  },
  	"application/vnd.paos.xml": {
  	source: "iana"
  },
  	"application/vnd.patentdive": {
  	source: "iana"
  },
  	"application/vnd.patientecommsdoc": {
  	source: "iana"
  },
  	"application/vnd.pawaafile": {
  	source: "iana",
  	extensions: [
  		"paw"
  	]
  },
  	"application/vnd.pcos": {
  	source: "iana"
  },
  	"application/vnd.pg.format": {
  	source: "iana",
  	extensions: [
  		"str"
  	]
  },
  	"application/vnd.pg.osasli": {
  	source: "iana",
  	extensions: [
  		"ei6"
  	]
  },
  	"application/vnd.piaccess.application-licence": {
  	source: "iana"
  },
  	"application/vnd.picsel": {
  	source: "iana",
  	extensions: [
  		"efif"
  	]
  },
  	"application/vnd.pmi.widget": {
  	source: "iana",
  	extensions: [
  		"wg"
  	]
  },
  	"application/vnd.poc.group-advertisement+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.pocketlearn": {
  	source: "iana",
  	extensions: [
  		"plf"
  	]
  },
  	"application/vnd.powerbuilder6": {
  	source: "iana",
  	extensions: [
  		"pbd"
  	]
  },
  	"application/vnd.powerbuilder6-s": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder7": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder7-s": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder75": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder75-s": {
  	source: "iana"
  },
  	"application/vnd.preminet": {
  	source: "iana"
  },
  	"application/vnd.previewsystems.box": {
  	source: "iana",
  	extensions: [
  		"box"
  	]
  },
  	"application/vnd.proteus.magazine": {
  	source: "iana",
  	extensions: [
  		"mgz"
  	]
  },
  	"application/vnd.psfs": {
  	source: "iana"
  },
  	"application/vnd.publishare-delta-tree": {
  	source: "iana",
  	extensions: [
  		"qps"
  	]
  },
  	"application/vnd.pvi.ptid1": {
  	source: "iana",
  	extensions: [
  		"ptid"
  	]
  },
  	"application/vnd.pwg-multiplexed": {
  	source: "iana"
  },
  	"application/vnd.pwg-xhtml-print+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.qualcomm.brew-app-res": {
  	source: "iana"
  },
  	"application/vnd.quarantainenet": {
  	source: "iana"
  },
  	"application/vnd.quark.quarkxpress": {
  	source: "iana",
  	extensions: [
  		"qxd",
  		"qxt",
  		"qwd",
  		"qwt",
  		"qxl",
  		"qxb"
  	]
  },
  	"application/vnd.quobject-quoxdocument": {
  	source: "iana"
  },
  	"application/vnd.radisys.moml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-conf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-conn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-dialog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-stream+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-conf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-base+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-group+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-speech+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-transform+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.rainstor.data": {
  	source: "iana"
  },
  	"application/vnd.rapid": {
  	source: "iana"
  },
  	"application/vnd.rar": {
  	source: "iana",
  	extensions: [
  		"rar"
  	]
  },
  	"application/vnd.realvnc.bed": {
  	source: "iana",
  	extensions: [
  		"bed"
  	]
  },
  	"application/vnd.recordare.musicxml": {
  	source: "iana",
  	extensions: [
  		"mxl"
  	]
  },
  	"application/vnd.recordare.musicxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"musicxml"
  	]
  },
  	"application/vnd.renlearn.rlprint": {
  	source: "iana"
  },
  	"application/vnd.resilient.logic": {
  	source: "iana"
  },
  	"application/vnd.restful+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.rig.cryptonote": {
  	source: "iana",
  	extensions: [
  		"cryptonote"
  	]
  },
  	"application/vnd.rim.cod": {
  	source: "apache",
  	extensions: [
  		"cod"
  	]
  },
  	"application/vnd.rn-realmedia": {
  	source: "apache",
  	extensions: [
  		"rm"
  	]
  },
  	"application/vnd.rn-realmedia-vbr": {
  	source: "apache",
  	extensions: [
  		"rmvb"
  	]
  },
  	"application/vnd.route66.link66+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"link66"
  	]
  },
  	"application/vnd.rs-274x": {
  	source: "iana"
  },
  	"application/vnd.ruckus.download": {
  	source: "iana"
  },
  	"application/vnd.s3sms": {
  	source: "iana"
  },
  	"application/vnd.sailingtracker.track": {
  	source: "iana",
  	extensions: [
  		"st"
  	]
  },
  	"application/vnd.sar": {
  	source: "iana"
  },
  	"application/vnd.sbm.cid": {
  	source: "iana"
  },
  	"application/vnd.sbm.mid2": {
  	source: "iana"
  },
  	"application/vnd.scribus": {
  	source: "iana"
  },
  	"application/vnd.sealed.3df": {
  	source: "iana"
  },
  	"application/vnd.sealed.csf": {
  	source: "iana"
  },
  	"application/vnd.sealed.doc": {
  	source: "iana"
  },
  	"application/vnd.sealed.eml": {
  	source: "iana"
  },
  	"application/vnd.sealed.mht": {
  	source: "iana"
  },
  	"application/vnd.sealed.net": {
  	source: "iana"
  },
  	"application/vnd.sealed.ppt": {
  	source: "iana"
  },
  	"application/vnd.sealed.tiff": {
  	source: "iana"
  },
  	"application/vnd.sealed.xls": {
  	source: "iana"
  },
  	"application/vnd.sealedmedia.softseal.html": {
  	source: "iana"
  },
  	"application/vnd.sealedmedia.softseal.pdf": {
  	source: "iana"
  },
  	"application/vnd.seemail": {
  	source: "iana",
  	extensions: [
  		"see"
  	]
  },
  	"application/vnd.seis+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.sema": {
  	source: "iana",
  	extensions: [
  		"sema"
  	]
  },
  	"application/vnd.semd": {
  	source: "iana",
  	extensions: [
  		"semd"
  	]
  },
  	"application/vnd.semf": {
  	source: "iana",
  	extensions: [
  		"semf"
  	]
  },
  	"application/vnd.shade-save-file": {
  	source: "iana"
  },
  	"application/vnd.shana.informed.formdata": {
  	source: "iana",
  	extensions: [
  		"ifm"
  	]
  },
  	"application/vnd.shana.informed.formtemplate": {
  	source: "iana",
  	extensions: [
  		"itp"
  	]
  },
  	"application/vnd.shana.informed.interchange": {
  	source: "iana",
  	extensions: [
  		"iif"
  	]
  },
  	"application/vnd.shana.informed.package": {
  	source: "iana",
  	extensions: [
  		"ipk"
  	]
  },
  	"application/vnd.shootproof+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.shopkick+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.shp": {
  	source: "iana"
  },
  	"application/vnd.shx": {
  	source: "iana"
  },
  	"application/vnd.sigrok.session": {
  	source: "iana"
  },
  	"application/vnd.simtech-mindmapper": {
  	source: "iana",
  	extensions: [
  		"twd",
  		"twds"
  	]
  },
  	"application/vnd.siren+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.smaf": {
  	source: "iana",
  	extensions: [
  		"mmf"
  	]
  },
  	"application/vnd.smart.notebook": {
  	source: "iana"
  },
  	"application/vnd.smart.teacher": {
  	source: "iana",
  	extensions: [
  		"teacher"
  	]
  },
  	"application/vnd.snesdev-page-table": {
  	source: "iana"
  },
  	"application/vnd.software602.filler.form+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"fo"
  	]
  },
  	"application/vnd.software602.filler.form-xml-zip": {
  	source: "iana"
  },
  	"application/vnd.solent.sdkm+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sdkm",
  		"sdkd"
  	]
  },
  	"application/vnd.spotfire.dxp": {
  	source: "iana",
  	extensions: [
  		"dxp"
  	]
  },
  	"application/vnd.spotfire.sfs": {
  	source: "iana",
  	extensions: [
  		"sfs"
  	]
  },
  	"application/vnd.sqlite3": {
  	source: "iana"
  },
  	"application/vnd.sss-cod": {
  	source: "iana"
  },
  	"application/vnd.sss-dtf": {
  	source: "iana"
  },
  	"application/vnd.sss-ntf": {
  	source: "iana"
  },
  	"application/vnd.stardivision.calc": {
  	source: "apache",
  	extensions: [
  		"sdc"
  	]
  },
  	"application/vnd.stardivision.draw": {
  	source: "apache",
  	extensions: [
  		"sda"
  	]
  },
  	"application/vnd.stardivision.impress": {
  	source: "apache",
  	extensions: [
  		"sdd"
  	]
  },
  	"application/vnd.stardivision.math": {
  	source: "apache",
  	extensions: [
  		"smf"
  	]
  },
  	"application/vnd.stardivision.writer": {
  	source: "apache",
  	extensions: [
  		"sdw",
  		"vor"
  	]
  },
  	"application/vnd.stardivision.writer-global": {
  	source: "apache",
  	extensions: [
  		"sgl"
  	]
  },
  	"application/vnd.stepmania.package": {
  	source: "iana",
  	extensions: [
  		"smzip"
  	]
  },
  	"application/vnd.stepmania.stepchart": {
  	source: "iana",
  	extensions: [
  		"sm"
  	]
  },
  	"application/vnd.street-stream": {
  	source: "iana"
  },
  	"application/vnd.sun.wadl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wadl"
  	]
  },
  	"application/vnd.sun.xml.calc": {
  	source: "apache",
  	extensions: [
  		"sxc"
  	]
  },
  	"application/vnd.sun.xml.calc.template": {
  	source: "apache",
  	extensions: [
  		"stc"
  	]
  },
  	"application/vnd.sun.xml.draw": {
  	source: "apache",
  	extensions: [
  		"sxd"
  	]
  },
  	"application/vnd.sun.xml.draw.template": {
  	source: "apache",
  	extensions: [
  		"std"
  	]
  },
  	"application/vnd.sun.xml.impress": {
  	source: "apache",
  	extensions: [
  		"sxi"
  	]
  },
  	"application/vnd.sun.xml.impress.template": {
  	source: "apache",
  	extensions: [
  		"sti"
  	]
  },
  	"application/vnd.sun.xml.math": {
  	source: "apache",
  	extensions: [
  		"sxm"
  	]
  },
  	"application/vnd.sun.xml.writer": {
  	source: "apache",
  	extensions: [
  		"sxw"
  	]
  },
  	"application/vnd.sun.xml.writer.global": {
  	source: "apache",
  	extensions: [
  		"sxg"
  	]
  },
  	"application/vnd.sun.xml.writer.template": {
  	source: "apache",
  	extensions: [
  		"stw"
  	]
  },
  	"application/vnd.sus-calendar": {
  	source: "iana",
  	extensions: [
  		"sus",
  		"susp"
  	]
  },
  	"application/vnd.svd": {
  	source: "iana",
  	extensions: [
  		"svd"
  	]
  },
  	"application/vnd.swiftview-ics": {
  	source: "iana"
  },
  	"application/vnd.sycle+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.syft+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.symbian.install": {
  	source: "apache",
  	extensions: [
  		"sis",
  		"sisx"
  	]
  },
  	"application/vnd.syncml+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"xsm"
  	]
  },
  	"application/vnd.syncml.dm+wbxml": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"bdm"
  	]
  },
  	"application/vnd.syncml.dm+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"xdm"
  	]
  },
  	"application/vnd.syncml.dm.notification": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmddf+wbxml": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmddf+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"ddf"
  	]
  },
  	"application/vnd.syncml.dmtnds+wbxml": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmtnds+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.syncml.ds.notification": {
  	source: "iana"
  },
  	"application/vnd.tableschema+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tao.intent-module-archive": {
  	source: "iana",
  	extensions: [
  		"tao"
  	]
  },
  	"application/vnd.tcpdump.pcap": {
  	source: "iana",
  	extensions: [
  		"pcap",
  		"cap",
  		"dmp"
  	]
  },
  	"application/vnd.think-cell.ppttc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tmd.mediaflex.api+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tml": {
  	source: "iana"
  },
  	"application/vnd.tmobile-livetv": {
  	source: "iana",
  	extensions: [
  		"tmo"
  	]
  },
  	"application/vnd.tri.onesource": {
  	source: "iana"
  },
  	"application/vnd.trid.tpt": {
  	source: "iana",
  	extensions: [
  		"tpt"
  	]
  },
  	"application/vnd.triscape.mxs": {
  	source: "iana",
  	extensions: [
  		"mxs"
  	]
  },
  	"application/vnd.trueapp": {
  	source: "iana",
  	extensions: [
  		"tra"
  	]
  },
  	"application/vnd.truedoc": {
  	source: "iana"
  },
  	"application/vnd.ubisoft.webplayer": {
  	source: "iana"
  },
  	"application/vnd.ufdl": {
  	source: "iana",
  	extensions: [
  		"ufd",
  		"ufdl"
  	]
  },
  	"application/vnd.uiq.theme": {
  	source: "iana",
  	extensions: [
  		"utz"
  	]
  },
  	"application/vnd.umajin": {
  	source: "iana",
  	extensions: [
  		"umj"
  	]
  },
  	"application/vnd.unity": {
  	source: "iana",
  	extensions: [
  		"unityweb"
  	]
  },
  	"application/vnd.uoml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uoml"
  	]
  },
  	"application/vnd.uplanet.alert": {
  	source: "iana"
  },
  	"application/vnd.uplanet.alert-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.bearer-choice": {
  	source: "iana"
  },
  	"application/vnd.uplanet.bearer-choice-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.cacheop": {
  	source: "iana"
  },
  	"application/vnd.uplanet.cacheop-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.channel": {
  	source: "iana"
  },
  	"application/vnd.uplanet.channel-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.list": {
  	source: "iana"
  },
  	"application/vnd.uplanet.list-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.listcmd": {
  	source: "iana"
  },
  	"application/vnd.uplanet.listcmd-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.signal": {
  	source: "iana"
  },
  	"application/vnd.uri-map": {
  	source: "iana"
  },
  	"application/vnd.valve.source.material": {
  	source: "iana"
  },
  	"application/vnd.vcx": {
  	source: "iana",
  	extensions: [
  		"vcx"
  	]
  },
  	"application/vnd.vd-study": {
  	source: "iana"
  },
  	"application/vnd.vectorworks": {
  	source: "iana"
  },
  	"application/vnd.vel+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.verimatrix.vcas": {
  	source: "iana"
  },
  	"application/vnd.veritone.aion+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.veryant.thin": {
  	source: "iana"
  },
  	"application/vnd.ves.encrypted": {
  	source: "iana"
  },
  	"application/vnd.vidsoft.vidconference": {
  	source: "iana"
  },
  	"application/vnd.visio": {
  	source: "iana",
  	extensions: [
  		"vsd",
  		"vst",
  		"vss",
  		"vsw"
  	]
  },
  	"application/vnd.visionary": {
  	source: "iana",
  	extensions: [
  		"vis"
  	]
  },
  	"application/vnd.vividence.scriptfile": {
  	source: "iana"
  },
  	"application/vnd.vsf": {
  	source: "iana",
  	extensions: [
  		"vsf"
  	]
  },
  	"application/vnd.wap.sic": {
  	source: "iana"
  },
  	"application/vnd.wap.slc": {
  	source: "iana"
  },
  	"application/vnd.wap.wbxml": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"wbxml"
  	]
  },
  	"application/vnd.wap.wmlc": {
  	source: "iana",
  	extensions: [
  		"wmlc"
  	]
  },
  	"application/vnd.wap.wmlscriptc": {
  	source: "iana",
  	extensions: [
  		"wmlsc"
  	]
  },
  	"application/vnd.webturbo": {
  	source: "iana",
  	extensions: [
  		"wtb"
  	]
  },
  	"application/vnd.wfa.dpp": {
  	source: "iana"
  },
  	"application/vnd.wfa.p2p": {
  	source: "iana"
  },
  	"application/vnd.wfa.wsc": {
  	source: "iana"
  },
  	"application/vnd.windows.devicepairing": {
  	source: "iana"
  },
  	"application/vnd.wmc": {
  	source: "iana"
  },
  	"application/vnd.wmf.bootstrap": {
  	source: "iana"
  },
  	"application/vnd.wolfram.mathematica": {
  	source: "iana"
  },
  	"application/vnd.wolfram.mathematica.package": {
  	source: "iana"
  },
  	"application/vnd.wolfram.player": {
  	source: "iana",
  	extensions: [
  		"nbp"
  	]
  },
  	"application/vnd.wordperfect": {
  	source: "iana",
  	extensions: [
  		"wpd"
  	]
  },
  	"application/vnd.wqd": {
  	source: "iana",
  	extensions: [
  		"wqd"
  	]
  },
  	"application/vnd.wrq-hp3000-labelled": {
  	source: "iana"
  },
  	"application/vnd.wt.stf": {
  	source: "iana",
  	extensions: [
  		"stf"
  	]
  },
  	"application/vnd.wv.csp+wbxml": {
  	source: "iana"
  },
  	"application/vnd.wv.csp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.wv.ssp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xacml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xara": {
  	source: "iana",
  	extensions: [
  		"xar"
  	]
  },
  	"application/vnd.xfdl": {
  	source: "iana",
  	extensions: [
  		"xfdl"
  	]
  },
  	"application/vnd.xfdl.webform": {
  	source: "iana"
  },
  	"application/vnd.xmi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xmpie.cpkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.dpkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.plan": {
  	source: "iana"
  },
  	"application/vnd.xmpie.ppkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.xlim": {
  	source: "iana"
  },
  	"application/vnd.yamaha.hv-dic": {
  	source: "iana",
  	extensions: [
  		"hvd"
  	]
  },
  	"application/vnd.yamaha.hv-script": {
  	source: "iana",
  	extensions: [
  		"hvs"
  	]
  },
  	"application/vnd.yamaha.hv-voice": {
  	source: "iana",
  	extensions: [
  		"hvp"
  	]
  },
  	"application/vnd.yamaha.openscoreformat": {
  	source: "iana",
  	extensions: [
  		"osf"
  	]
  },
  	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"osfpvg"
  	]
  },
  	"application/vnd.yamaha.remote-setup": {
  	source: "iana"
  },
  	"application/vnd.yamaha.smaf-audio": {
  	source: "iana",
  	extensions: [
  		"saf"
  	]
  },
  	"application/vnd.yamaha.smaf-phrase": {
  	source: "iana",
  	extensions: [
  		"spf"
  	]
  },
  	"application/vnd.yamaha.through-ngn": {
  	source: "iana"
  },
  	"application/vnd.yamaha.tunnel-udpencap": {
  	source: "iana"
  },
  	"application/vnd.yaoweme": {
  	source: "iana"
  },
  	"application/vnd.yellowriver-custom-menu": {
  	source: "iana",
  	extensions: [
  		"cmp"
  	]
  },
  	"application/vnd.youtube.yt": {
  	source: "iana"
  },
  	"application/vnd.zul": {
  	source: "iana",
  	extensions: [
  		"zir",
  		"zirz"
  	]
  },
  	"application/vnd.zzazz.deck+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"zaz"
  	]
  },
  	"application/voicexml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"vxml"
  	]
  },
  	"application/voucher-cms+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vq-rtcpxr": {
  	source: "iana"
  },
  	"application/wasm": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wasm"
  	]
  },
  	"application/watcherinfo+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wif"
  	]
  },
  	"application/webpush-options+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/whoispp-query": {
  	source: "iana"
  },
  	"application/whoispp-response": {
  	source: "iana"
  },
  	"application/widget": {
  	source: "iana",
  	extensions: [
  		"wgt"
  	]
  },
  	"application/winhlp": {
  	source: "apache",
  	extensions: [
  		"hlp"
  	]
  },
  	"application/wita": {
  	source: "iana"
  },
  	"application/wordperfect5.1": {
  	source: "iana"
  },
  	"application/wsdl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wsdl"
  	]
  },
  	"application/wspolicy+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wspolicy"
  	]
  },
  	"application/x-7z-compressed": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"7z"
  	]
  },
  	"application/x-abiword": {
  	source: "apache",
  	extensions: [
  		"abw"
  	]
  },
  	"application/x-ace-compressed": {
  	source: "apache",
  	extensions: [
  		"ace"
  	]
  },
  	"application/x-amf": {
  	source: "apache"
  },
  	"application/x-apple-diskimage": {
  	source: "apache",
  	extensions: [
  		"dmg"
  	]
  },
  	"application/x-arj": {
  	compressible: false,
  	extensions: [
  		"arj"
  	]
  },
  	"application/x-authorware-bin": {
  	source: "apache",
  	extensions: [
  		"aab",
  		"x32",
  		"u32",
  		"vox"
  	]
  },
  	"application/x-authorware-map": {
  	source: "apache",
  	extensions: [
  		"aam"
  	]
  },
  	"application/x-authorware-seg": {
  	source: "apache",
  	extensions: [
  		"aas"
  	]
  },
  	"application/x-bcpio": {
  	source: "apache",
  	extensions: [
  		"bcpio"
  	]
  },
  	"application/x-bdoc": {
  	compressible: false,
  	extensions: [
  		"bdoc"
  	]
  },
  	"application/x-bittorrent": {
  	source: "apache",
  	extensions: [
  		"torrent"
  	]
  },
  	"application/x-blorb": {
  	source: "apache",
  	extensions: [
  		"blb",
  		"blorb"
  	]
  },
  	"application/x-bzip": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"bz"
  	]
  },
  	"application/x-bzip2": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"bz2",
  		"boz"
  	]
  },
  	"application/x-cbr": {
  	source: "apache",
  	extensions: [
  		"cbr",
  		"cba",
  		"cbt",
  		"cbz",
  		"cb7"
  	]
  },
  	"application/x-cdlink": {
  	source: "apache",
  	extensions: [
  		"vcd"
  	]
  },
  	"application/x-cfs-compressed": {
  	source: "apache",
  	extensions: [
  		"cfs"
  	]
  },
  	"application/x-chat": {
  	source: "apache",
  	extensions: [
  		"chat"
  	]
  },
  	"application/x-chess-pgn": {
  	source: "apache",
  	extensions: [
  		"pgn"
  	]
  },
  	"application/x-chrome-extension": {
  	extensions: [
  		"crx"
  	]
  },
  	"application/x-cocoa": {
  	source: "nginx",
  	extensions: [
  		"cco"
  	]
  },
  	"application/x-compress": {
  	source: "apache"
  },
  	"application/x-conference": {
  	source: "apache",
  	extensions: [
  		"nsc"
  	]
  },
  	"application/x-cpio": {
  	source: "apache",
  	extensions: [
  		"cpio"
  	]
  },
  	"application/x-csh": {
  	source: "apache",
  	extensions: [
  		"csh"
  	]
  },
  	"application/x-deb": {
  	compressible: false
  },
  	"application/x-debian-package": {
  	source: "apache",
  	extensions: [
  		"deb",
  		"udeb"
  	]
  },
  	"application/x-dgc-compressed": {
  	source: "apache",
  	extensions: [
  		"dgc"
  	]
  },
  	"application/x-director": {
  	source: "apache",
  	extensions: [
  		"dir",
  		"dcr",
  		"dxr",
  		"cst",
  		"cct",
  		"cxt",
  		"w3d",
  		"fgd",
  		"swa"
  	]
  },
  	"application/x-doom": {
  	source: "apache",
  	extensions: [
  		"wad"
  	]
  },
  	"application/x-dtbncx+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ncx"
  	]
  },
  	"application/x-dtbook+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"dtb"
  	]
  },
  	"application/x-dtbresource+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"res"
  	]
  },
  	"application/x-dvi": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"dvi"
  	]
  },
  	"application/x-envoy": {
  	source: "apache",
  	extensions: [
  		"evy"
  	]
  },
  	"application/x-eva": {
  	source: "apache",
  	extensions: [
  		"eva"
  	]
  },
  	"application/x-font-bdf": {
  	source: "apache",
  	extensions: [
  		"bdf"
  	]
  },
  	"application/x-font-dos": {
  	source: "apache"
  },
  	"application/x-font-framemaker": {
  	source: "apache"
  },
  	"application/x-font-ghostscript": {
  	source: "apache",
  	extensions: [
  		"gsf"
  	]
  },
  	"application/x-font-libgrx": {
  	source: "apache"
  },
  	"application/x-font-linux-psf": {
  	source: "apache",
  	extensions: [
  		"psf"
  	]
  },
  	"application/x-font-pcf": {
  	source: "apache",
  	extensions: [
  		"pcf"
  	]
  },
  	"application/x-font-snf": {
  	source: "apache",
  	extensions: [
  		"snf"
  	]
  },
  	"application/x-font-speedo": {
  	source: "apache"
  },
  	"application/x-font-sunos-news": {
  	source: "apache"
  },
  	"application/x-font-type1": {
  	source: "apache",
  	extensions: [
  		"pfa",
  		"pfb",
  		"pfm",
  		"afm"
  	]
  },
  	"application/x-font-vfont": {
  	source: "apache"
  },
  	"application/x-freearc": {
  	source: "apache",
  	extensions: [
  		"arc"
  	]
  },
  	"application/x-futuresplash": {
  	source: "apache",
  	extensions: [
  		"spl"
  	]
  },
  	"application/x-gca-compressed": {
  	source: "apache",
  	extensions: [
  		"gca"
  	]
  },
  	"application/x-glulx": {
  	source: "apache",
  	extensions: [
  		"ulx"
  	]
  },
  	"application/x-gnumeric": {
  	source: "apache",
  	extensions: [
  		"gnumeric"
  	]
  },
  	"application/x-gramps-xml": {
  	source: "apache",
  	extensions: [
  		"gramps"
  	]
  },
  	"application/x-gtar": {
  	source: "apache",
  	extensions: [
  		"gtar"
  	]
  },
  	"application/x-gzip": {
  	source: "apache"
  },
  	"application/x-hdf": {
  	source: "apache",
  	extensions: [
  		"hdf"
  	]
  },
  	"application/x-httpd-php": {
  	compressible: true,
  	extensions: [
  		"php"
  	]
  },
  	"application/x-install-instructions": {
  	source: "apache",
  	extensions: [
  		"install"
  	]
  },
  	"application/x-iso9660-image": {
  	source: "apache",
  	extensions: [
  		"iso"
  	]
  },
  	"application/x-iwork-keynote-sffkey": {
  	extensions: [
  		"key"
  	]
  },
  	"application/x-iwork-numbers-sffnumbers": {
  	extensions: [
  		"numbers"
  	]
  },
  	"application/x-iwork-pages-sffpages": {
  	extensions: [
  		"pages"
  	]
  },
  	"application/x-java-archive-diff": {
  	source: "nginx",
  	extensions: [
  		"jardiff"
  	]
  },
  	"application/x-java-jnlp-file": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"jnlp"
  	]
  },
  	"application/x-javascript": {
  	compressible: true
  },
  	"application/x-keepass2": {
  	extensions: [
  		"kdbx"
  	]
  },
  	"application/x-latex": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"latex"
  	]
  },
  	"application/x-lua-bytecode": {
  	extensions: [
  		"luac"
  	]
  },
  	"application/x-lzh-compressed": {
  	source: "apache",
  	extensions: [
  		"lzh",
  		"lha"
  	]
  },
  	"application/x-makeself": {
  	source: "nginx",
  	extensions: [
  		"run"
  	]
  },
  	"application/x-mie": {
  	source: "apache",
  	extensions: [
  		"mie"
  	]
  },
  	"application/x-mobipocket-ebook": {
  	source: "apache",
  	extensions: [
  		"prc",
  		"mobi"
  	]
  },
  	"application/x-mpegurl": {
  	compressible: false
  },
  	"application/x-ms-application": {
  	source: "apache",
  	extensions: [
  		"application"
  	]
  },
  	"application/x-ms-shortcut": {
  	source: "apache",
  	extensions: [
  		"lnk"
  	]
  },
  	"application/x-ms-wmd": {
  	source: "apache",
  	extensions: [
  		"wmd"
  	]
  },
  	"application/x-ms-wmz": {
  	source: "apache",
  	extensions: [
  		"wmz"
  	]
  },
  	"application/x-ms-xbap": {
  	source: "apache",
  	extensions: [
  		"xbap"
  	]
  },
  	"application/x-msaccess": {
  	source: "apache",
  	extensions: [
  		"mdb"
  	]
  },
  	"application/x-msbinder": {
  	source: "apache",
  	extensions: [
  		"obd"
  	]
  },
  	"application/x-mscardfile": {
  	source: "apache",
  	extensions: [
  		"crd"
  	]
  },
  	"application/x-msclip": {
  	source: "apache",
  	extensions: [
  		"clp"
  	]
  },
  	"application/x-msdos-program": {
  	extensions: [
  		"exe"
  	]
  },
  	"application/x-msdownload": {
  	source: "apache",
  	extensions: [
  		"exe",
  		"dll",
  		"com",
  		"bat",
  		"msi"
  	]
  },
  	"application/x-msmediaview": {
  	source: "apache",
  	extensions: [
  		"mvb",
  		"m13",
  		"m14"
  	]
  },
  	"application/x-msmetafile": {
  	source: "apache",
  	extensions: [
  		"wmf",
  		"wmz",
  		"emf",
  		"emz"
  	]
  },
  	"application/x-msmoney": {
  	source: "apache",
  	extensions: [
  		"mny"
  	]
  },
  	"application/x-mspublisher": {
  	source: "apache",
  	extensions: [
  		"pub"
  	]
  },
  	"application/x-msschedule": {
  	source: "apache",
  	extensions: [
  		"scd"
  	]
  },
  	"application/x-msterminal": {
  	source: "apache",
  	extensions: [
  		"trm"
  	]
  },
  	"application/x-mswrite": {
  	source: "apache",
  	extensions: [
  		"wri"
  	]
  },
  	"application/x-netcdf": {
  	source: "apache",
  	extensions: [
  		"nc",
  		"cdf"
  	]
  },
  	"application/x-ns-proxy-autoconfig": {
  	compressible: true,
  	extensions: [
  		"pac"
  	]
  },
  	"application/x-nzb": {
  	source: "apache",
  	extensions: [
  		"nzb"
  	]
  },
  	"application/x-perl": {
  	source: "nginx",
  	extensions: [
  		"pl",
  		"pm"
  	]
  },
  	"application/x-pilot": {
  	source: "nginx",
  	extensions: [
  		"prc",
  		"pdb"
  	]
  },
  	"application/x-pkcs12": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"p12",
  		"pfx"
  	]
  },
  	"application/x-pkcs7-certificates": {
  	source: "apache",
  	extensions: [
  		"p7b",
  		"spc"
  	]
  },
  	"application/x-pkcs7-certreqresp": {
  	source: "apache",
  	extensions: [
  		"p7r"
  	]
  },
  	"application/x-pki-message": {
  	source: "iana"
  },
  	"application/x-rar-compressed": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"rar"
  	]
  },
  	"application/x-redhat-package-manager": {
  	source: "nginx",
  	extensions: [
  		"rpm"
  	]
  },
  	"application/x-research-info-systems": {
  	source: "apache",
  	extensions: [
  		"ris"
  	]
  },
  	"application/x-sea": {
  	source: "nginx",
  	extensions: [
  		"sea"
  	]
  },
  	"application/x-sh": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"sh"
  	]
  },
  	"application/x-shar": {
  	source: "apache",
  	extensions: [
  		"shar"
  	]
  },
  	"application/x-shockwave-flash": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"swf"
  	]
  },
  	"application/x-silverlight-app": {
  	source: "apache",
  	extensions: [
  		"xap"
  	]
  },
  	"application/x-sql": {
  	source: "apache",
  	extensions: [
  		"sql"
  	]
  },
  	"application/x-stuffit": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"sit"
  	]
  },
  	"application/x-stuffitx": {
  	source: "apache",
  	extensions: [
  		"sitx"
  	]
  },
  	"application/x-subrip": {
  	source: "apache",
  	extensions: [
  		"srt"
  	]
  },
  	"application/x-sv4cpio": {
  	source: "apache",
  	extensions: [
  		"sv4cpio"
  	]
  },
  	"application/x-sv4crc": {
  	source: "apache",
  	extensions: [
  		"sv4crc"
  	]
  },
  	"application/x-t3vm-image": {
  	source: "apache",
  	extensions: [
  		"t3"
  	]
  },
  	"application/x-tads": {
  	source: "apache",
  	extensions: [
  		"gam"
  	]
  },
  	"application/x-tar": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"tar"
  	]
  },
  	"application/x-tcl": {
  	source: "apache",
  	extensions: [
  		"tcl",
  		"tk"
  	]
  },
  	"application/x-tex": {
  	source: "apache",
  	extensions: [
  		"tex"
  	]
  },
  	"application/x-tex-tfm": {
  	source: "apache",
  	extensions: [
  		"tfm"
  	]
  },
  	"application/x-texinfo": {
  	source: "apache",
  	extensions: [
  		"texinfo",
  		"texi"
  	]
  },
  	"application/x-tgif": {
  	source: "apache",
  	extensions: [
  		"obj"
  	]
  },
  	"application/x-ustar": {
  	source: "apache",
  	extensions: [
  		"ustar"
  	]
  },
  	"application/x-virtualbox-hdd": {
  	compressible: true,
  	extensions: [
  		"hdd"
  	]
  },
  	"application/x-virtualbox-ova": {
  	compressible: true,
  	extensions: [
  		"ova"
  	]
  },
  	"application/x-virtualbox-ovf": {
  	compressible: true,
  	extensions: [
  		"ovf"
  	]
  },
  	"application/x-virtualbox-vbox": {
  	compressible: true,
  	extensions: [
  		"vbox"
  	]
  },
  	"application/x-virtualbox-vbox-extpack": {
  	compressible: false,
  	extensions: [
  		"vbox-extpack"
  	]
  },
  	"application/x-virtualbox-vdi": {
  	compressible: true,
  	extensions: [
  		"vdi"
  	]
  },
  	"application/x-virtualbox-vhd": {
  	compressible: true,
  	extensions: [
  		"vhd"
  	]
  },
  	"application/x-virtualbox-vmdk": {
  	compressible: true,
  	extensions: [
  		"vmdk"
  	]
  },
  	"application/x-wais-source": {
  	source: "apache",
  	extensions: [
  		"src"
  	]
  },
  	"application/x-web-app-manifest+json": {
  	compressible: true,
  	extensions: [
  		"webapp"
  	]
  },
  	"application/x-www-form-urlencoded": {
  	source: "iana",
  	compressible: true
  },
  	"application/x-x509-ca-cert": {
  	source: "iana",
  	extensions: [
  		"der",
  		"crt",
  		"pem"
  	]
  },
  	"application/x-x509-ca-ra-cert": {
  	source: "iana"
  },
  	"application/x-x509-next-ca-cert": {
  	source: "iana"
  },
  	"application/x-xfig": {
  	source: "apache",
  	extensions: [
  		"fig"
  	]
  },
  	"application/x-xliff+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xlf"
  	]
  },
  	"application/x-xpinstall": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"xpi"
  	]
  },
  	"application/x-xz": {
  	source: "apache",
  	extensions: [
  		"xz"
  	]
  },
  	"application/x-zmachine": {
  	source: "apache",
  	extensions: [
  		"z1",
  		"z2",
  		"z3",
  		"z4",
  		"z5",
  		"z6",
  		"z7",
  		"z8"
  	]
  },
  	"application/x400-bp": {
  	source: "iana"
  },
  	"application/xacml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xaml+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xaml"
  	]
  },
  	"application/xcap-att+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xav"
  	]
  },
  	"application/xcap-caps+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xca"
  	]
  },
  	"application/xcap-diff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdf"
  	]
  },
  	"application/xcap-el+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xel"
  	]
  },
  	"application/xcap-error+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xcap-ns+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xns"
  	]
  },
  	"application/xcon-conference-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xcon-conference-info-diff+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xenc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xenc"
  	]
  },
  	"application/xhtml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xhtml",
  		"xht"
  	]
  },
  	"application/xhtml-voice+xml": {
  	source: "apache",
  	compressible: true
  },
  	"application/xliff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xlf"
  	]
  },
  	"application/xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xml",
  		"xsl",
  		"xsd",
  		"rng"
  	]
  },
  	"application/xml-dtd": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dtd"
  	]
  },
  	"application/xml-external-parsed-entity": {
  	source: "iana"
  },
  	"application/xml-patch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xmpp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xop+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xop"
  	]
  },
  	"application/xproc+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xpl"
  	]
  },
  	"application/xslt+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xsl",
  		"xslt"
  	]
  },
  	"application/xspf+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xspf"
  	]
  },
  	"application/xv+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mxml",
  		"xhvml",
  		"xvml",
  		"xvm"
  	]
  },
  	"application/yang": {
  	source: "iana",
  	extensions: [
  		"yang"
  	]
  },
  	"application/yang-data+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-data+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-patch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/yin+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"yin"
  	]
  },
  	"application/zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"zip"
  	]
  },
  	"application/zlib": {
  	source: "iana"
  },
  	"application/zstd": {
  	source: "iana"
  },
  	"audio/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"audio/32kadpcm": {
  	source: "iana"
  },
  	"audio/3gpp": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"3gpp"
  	]
  },
  	"audio/3gpp2": {
  	source: "iana"
  },
  	"audio/aac": {
  	source: "iana"
  },
  	"audio/ac3": {
  	source: "iana"
  },
  	"audio/adpcm": {
  	source: "apache",
  	extensions: [
  		"adp"
  	]
  },
  	"audio/amr": {
  	source: "iana",
  	extensions: [
  		"amr"
  	]
  },
  	"audio/amr-wb": {
  	source: "iana"
  },
  	"audio/amr-wb+": {
  	source: "iana"
  },
  	"audio/aptx": {
  	source: "iana"
  },
  	"audio/asc": {
  	source: "iana"
  },
  	"audio/atrac-advanced-lossless": {
  	source: "iana"
  },
  	"audio/atrac-x": {
  	source: "iana"
  },
  	"audio/atrac3": {
  	source: "iana"
  },
  	"audio/basic": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"au",
  		"snd"
  	]
  },
  	"audio/bv16": {
  	source: "iana"
  },
  	"audio/bv32": {
  	source: "iana"
  },
  	"audio/clearmode": {
  	source: "iana"
  },
  	"audio/cn": {
  	source: "iana"
  },
  	"audio/dat12": {
  	source: "iana"
  },
  	"audio/dls": {
  	source: "iana"
  },
  	"audio/dsr-es201108": {
  	source: "iana"
  },
  	"audio/dsr-es202050": {
  	source: "iana"
  },
  	"audio/dsr-es202211": {
  	source: "iana"
  },
  	"audio/dsr-es202212": {
  	source: "iana"
  },
  	"audio/dv": {
  	source: "iana"
  },
  	"audio/dvi4": {
  	source: "iana"
  },
  	"audio/eac3": {
  	source: "iana"
  },
  	"audio/encaprtp": {
  	source: "iana"
  },
  	"audio/evrc": {
  	source: "iana"
  },
  	"audio/evrc-qcp": {
  	source: "iana"
  },
  	"audio/evrc0": {
  	source: "iana"
  },
  	"audio/evrc1": {
  	source: "iana"
  },
  	"audio/evrcb": {
  	source: "iana"
  },
  	"audio/evrcb0": {
  	source: "iana"
  },
  	"audio/evrcb1": {
  	source: "iana"
  },
  	"audio/evrcnw": {
  	source: "iana"
  },
  	"audio/evrcnw0": {
  	source: "iana"
  },
  	"audio/evrcnw1": {
  	source: "iana"
  },
  	"audio/evrcwb": {
  	source: "iana"
  },
  	"audio/evrcwb0": {
  	source: "iana"
  },
  	"audio/evrcwb1": {
  	source: "iana"
  },
  	"audio/evs": {
  	source: "iana"
  },
  	"audio/flexfec": {
  	source: "iana"
  },
  	"audio/fwdred": {
  	source: "iana"
  },
  	"audio/g711-0": {
  	source: "iana"
  },
  	"audio/g719": {
  	source: "iana"
  },
  	"audio/g722": {
  	source: "iana"
  },
  	"audio/g7221": {
  	source: "iana"
  },
  	"audio/g723": {
  	source: "iana"
  },
  	"audio/g726-16": {
  	source: "iana"
  },
  	"audio/g726-24": {
  	source: "iana"
  },
  	"audio/g726-32": {
  	source: "iana"
  },
  	"audio/g726-40": {
  	source: "iana"
  },
  	"audio/g728": {
  	source: "iana"
  },
  	"audio/g729": {
  	source: "iana"
  },
  	"audio/g7291": {
  	source: "iana"
  },
  	"audio/g729d": {
  	source: "iana"
  },
  	"audio/g729e": {
  	source: "iana"
  },
  	"audio/gsm": {
  	source: "iana"
  },
  	"audio/gsm-efr": {
  	source: "iana"
  },
  	"audio/gsm-hr-08": {
  	source: "iana"
  },
  	"audio/ilbc": {
  	source: "iana"
  },
  	"audio/ip-mr_v2.5": {
  	source: "iana"
  },
  	"audio/isac": {
  	source: "apache"
  },
  	"audio/l16": {
  	source: "iana"
  },
  	"audio/l20": {
  	source: "iana"
  },
  	"audio/l24": {
  	source: "iana",
  	compressible: false
  },
  	"audio/l8": {
  	source: "iana"
  },
  	"audio/lpc": {
  	source: "iana"
  },
  	"audio/melp": {
  	source: "iana"
  },
  	"audio/melp1200": {
  	source: "iana"
  },
  	"audio/melp2400": {
  	source: "iana"
  },
  	"audio/melp600": {
  	source: "iana"
  },
  	"audio/mhas": {
  	source: "iana"
  },
  	"audio/midi": {
  	source: "apache",
  	extensions: [
  		"mid",
  		"midi",
  		"kar",
  		"rmi"
  	]
  },
  	"audio/mobile-xmf": {
  	source: "iana",
  	extensions: [
  		"mxmf"
  	]
  },
  	"audio/mp3": {
  	compressible: false,
  	extensions: [
  		"mp3"
  	]
  },
  	"audio/mp4": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"m4a",
  		"mp4a"
  	]
  },
  	"audio/mp4a-latm": {
  	source: "iana"
  },
  	"audio/mpa": {
  	source: "iana"
  },
  	"audio/mpa-robust": {
  	source: "iana"
  },
  	"audio/mpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mpga",
  		"mp2",
  		"mp2a",
  		"mp3",
  		"m2a",
  		"m3a"
  	]
  },
  	"audio/mpeg4-generic": {
  	source: "iana"
  },
  	"audio/musepack": {
  	source: "apache"
  },
  	"audio/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"oga",
  		"ogg",
  		"spx",
  		"opus"
  	]
  },
  	"audio/opus": {
  	source: "iana"
  },
  	"audio/parityfec": {
  	source: "iana"
  },
  	"audio/pcma": {
  	source: "iana"
  },
  	"audio/pcma-wb": {
  	source: "iana"
  },
  	"audio/pcmu": {
  	source: "iana"
  },
  	"audio/pcmu-wb": {
  	source: "iana"
  },
  	"audio/prs.sid": {
  	source: "iana"
  },
  	"audio/qcelp": {
  	source: "iana"
  },
  	"audio/raptorfec": {
  	source: "iana"
  },
  	"audio/red": {
  	source: "iana"
  },
  	"audio/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"audio/rtp-midi": {
  	source: "iana"
  },
  	"audio/rtploopback": {
  	source: "iana"
  },
  	"audio/rtx": {
  	source: "iana"
  },
  	"audio/s3m": {
  	source: "apache",
  	extensions: [
  		"s3m"
  	]
  },
  	"audio/scip": {
  	source: "iana"
  },
  	"audio/silk": {
  	source: "apache",
  	extensions: [
  		"sil"
  	]
  },
  	"audio/smv": {
  	source: "iana"
  },
  	"audio/smv-qcp": {
  	source: "iana"
  },
  	"audio/smv0": {
  	source: "iana"
  },
  	"audio/sofa": {
  	source: "iana"
  },
  	"audio/sp-midi": {
  	source: "iana"
  },
  	"audio/speex": {
  	source: "iana"
  },
  	"audio/t140c": {
  	source: "iana"
  },
  	"audio/t38": {
  	source: "iana"
  },
  	"audio/telephone-event": {
  	source: "iana"
  },
  	"audio/tetra_acelp": {
  	source: "iana"
  },
  	"audio/tetra_acelp_bb": {
  	source: "iana"
  },
  	"audio/tone": {
  	source: "iana"
  },
  	"audio/tsvcis": {
  	source: "iana"
  },
  	"audio/uemclip": {
  	source: "iana"
  },
  	"audio/ulpfec": {
  	source: "iana"
  },
  	"audio/usac": {
  	source: "iana"
  },
  	"audio/vdvi": {
  	source: "iana"
  },
  	"audio/vmr-wb": {
  	source: "iana"
  },
  	"audio/vnd.3gpp.iufp": {
  	source: "iana"
  },
  	"audio/vnd.4sb": {
  	source: "iana"
  },
  	"audio/vnd.audiokoz": {
  	source: "iana"
  },
  	"audio/vnd.celp": {
  	source: "iana"
  },
  	"audio/vnd.cisco.nse": {
  	source: "iana"
  },
  	"audio/vnd.cmles.radio-events": {
  	source: "iana"
  },
  	"audio/vnd.cns.anp1": {
  	source: "iana"
  },
  	"audio/vnd.cns.inf1": {
  	source: "iana"
  },
  	"audio/vnd.dece.audio": {
  	source: "iana",
  	extensions: [
  		"uva",
  		"uvva"
  	]
  },
  	"audio/vnd.digital-winds": {
  	source: "iana",
  	extensions: [
  		"eol"
  	]
  },
  	"audio/vnd.dlna.adts": {
  	source: "iana"
  },
  	"audio/vnd.dolby.heaac.1": {
  	source: "iana"
  },
  	"audio/vnd.dolby.heaac.2": {
  	source: "iana"
  },
  	"audio/vnd.dolby.mlp": {
  	source: "iana"
  },
  	"audio/vnd.dolby.mps": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2x": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2z": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pulse.1": {
  	source: "iana"
  },
  	"audio/vnd.dra": {
  	source: "iana",
  	extensions: [
  		"dra"
  	]
  },
  	"audio/vnd.dts": {
  	source: "iana",
  	extensions: [
  		"dts"
  	]
  },
  	"audio/vnd.dts.hd": {
  	source: "iana",
  	extensions: [
  		"dtshd"
  	]
  },
  	"audio/vnd.dts.uhd": {
  	source: "iana"
  },
  	"audio/vnd.dvb.file": {
  	source: "iana"
  },
  	"audio/vnd.everad.plj": {
  	source: "iana"
  },
  	"audio/vnd.hns.audio": {
  	source: "iana"
  },
  	"audio/vnd.lucent.voice": {
  	source: "iana",
  	extensions: [
  		"lvp"
  	]
  },
  	"audio/vnd.ms-playready.media.pya": {
  	source: "iana",
  	extensions: [
  		"pya"
  	]
  },
  	"audio/vnd.nokia.mobile-xmf": {
  	source: "iana"
  },
  	"audio/vnd.nortel.vbk": {
  	source: "iana"
  },
  	"audio/vnd.nuera.ecelp4800": {
  	source: "iana",
  	extensions: [
  		"ecelp4800"
  	]
  },
  	"audio/vnd.nuera.ecelp7470": {
  	source: "iana",
  	extensions: [
  		"ecelp7470"
  	]
  },
  	"audio/vnd.nuera.ecelp9600": {
  	source: "iana",
  	extensions: [
  		"ecelp9600"
  	]
  },
  	"audio/vnd.octel.sbc": {
  	source: "iana"
  },
  	"audio/vnd.presonus.multitrack": {
  	source: "iana"
  },
  	"audio/vnd.qcelp": {
  	source: "iana"
  },
  	"audio/vnd.rhetorex.32kadpcm": {
  	source: "iana"
  },
  	"audio/vnd.rip": {
  	source: "iana",
  	extensions: [
  		"rip"
  	]
  },
  	"audio/vnd.rn-realaudio": {
  	compressible: false
  },
  	"audio/vnd.sealedmedia.softseal.mpeg": {
  	source: "iana"
  },
  	"audio/vnd.vmx.cvsd": {
  	source: "iana"
  },
  	"audio/vnd.wave": {
  	compressible: false
  },
  	"audio/vorbis": {
  	source: "iana",
  	compressible: false
  },
  	"audio/vorbis-config": {
  	source: "iana"
  },
  	"audio/wav": {
  	compressible: false,
  	extensions: [
  		"wav"
  	]
  },
  	"audio/wave": {
  	compressible: false,
  	extensions: [
  		"wav"
  	]
  },
  	"audio/webm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"weba"
  	]
  },
  	"audio/x-aac": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"aac"
  	]
  },
  	"audio/x-aiff": {
  	source: "apache",
  	extensions: [
  		"aif",
  		"aiff",
  		"aifc"
  	]
  },
  	"audio/x-caf": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"caf"
  	]
  },
  	"audio/x-flac": {
  	source: "apache",
  	extensions: [
  		"flac"
  	]
  },
  	"audio/x-m4a": {
  	source: "nginx",
  	extensions: [
  		"m4a"
  	]
  },
  	"audio/x-matroska": {
  	source: "apache",
  	extensions: [
  		"mka"
  	]
  },
  	"audio/x-mpegurl": {
  	source: "apache",
  	extensions: [
  		"m3u"
  	]
  },
  	"audio/x-ms-wax": {
  	source: "apache",
  	extensions: [
  		"wax"
  	]
  },
  	"audio/x-ms-wma": {
  	source: "apache",
  	extensions: [
  		"wma"
  	]
  },
  	"audio/x-pn-realaudio": {
  	source: "apache",
  	extensions: [
  		"ram",
  		"ra"
  	]
  },
  	"audio/x-pn-realaudio-plugin": {
  	source: "apache",
  	extensions: [
  		"rmp"
  	]
  },
  	"audio/x-realaudio": {
  	source: "nginx",
  	extensions: [
  		"ra"
  	]
  },
  	"audio/x-tta": {
  	source: "apache"
  },
  	"audio/x-wav": {
  	source: "apache",
  	extensions: [
  		"wav"
  	]
  },
  	"audio/xm": {
  	source: "apache",
  	extensions: [
  		"xm"
  	]
  },
  	"chemical/x-cdx": {
  	source: "apache",
  	extensions: [
  		"cdx"
  	]
  },
  	"chemical/x-cif": {
  	source: "apache",
  	extensions: [
  		"cif"
  	]
  },
  	"chemical/x-cmdf": {
  	source: "apache",
  	extensions: [
  		"cmdf"
  	]
  },
  	"chemical/x-cml": {
  	source: "apache",
  	extensions: [
  		"cml"
  	]
  },
  	"chemical/x-csml": {
  	source: "apache",
  	extensions: [
  		"csml"
  	]
  },
  	"chemical/x-pdb": {
  	source: "apache"
  },
  	"chemical/x-xyz": {
  	source: "apache",
  	extensions: [
  		"xyz"
  	]
  },
  	"font/collection": {
  	source: "iana",
  	extensions: [
  		"ttc"
  	]
  },
  	"font/otf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"otf"
  	]
  },
  	"font/sfnt": {
  	source: "iana"
  },
  	"font/ttf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ttf"
  	]
  },
  	"font/woff": {
  	source: "iana",
  	extensions: [
  		"woff"
  	]
  },
  	"font/woff2": {
  	source: "iana",
  	extensions: [
  		"woff2"
  	]
  },
  	"image/aces": {
  	source: "iana",
  	extensions: [
  		"exr"
  	]
  },
  	"image/apng": {
  	compressible: false,
  	extensions: [
  		"apng"
  	]
  },
  	"image/avci": {
  	source: "iana",
  	extensions: [
  		"avci"
  	]
  },
  	"image/avcs": {
  	source: "iana",
  	extensions: [
  		"avcs"
  	]
  },
  	"image/avif": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"avif"
  	]
  },
  	"image/bmp": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"bmp"
  	]
  },
  	"image/cgm": {
  	source: "iana",
  	extensions: [
  		"cgm"
  	]
  },
  	"image/dicom-rle": {
  	source: "iana",
  	extensions: [
  		"drle"
  	]
  },
  	"image/emf": {
  	source: "iana",
  	extensions: [
  		"emf"
  	]
  },
  	"image/fits": {
  	source: "iana",
  	extensions: [
  		"fits"
  	]
  },
  	"image/g3fax": {
  	source: "iana",
  	extensions: [
  		"g3"
  	]
  },
  	"image/gif": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"gif"
  	]
  },
  	"image/heic": {
  	source: "iana",
  	extensions: [
  		"heic"
  	]
  },
  	"image/heic-sequence": {
  	source: "iana",
  	extensions: [
  		"heics"
  	]
  },
  	"image/heif": {
  	source: "iana",
  	extensions: [
  		"heif"
  	]
  },
  	"image/heif-sequence": {
  	source: "iana",
  	extensions: [
  		"heifs"
  	]
  },
  	"image/hej2k": {
  	source: "iana",
  	extensions: [
  		"hej2"
  	]
  },
  	"image/hsj2": {
  	source: "iana",
  	extensions: [
  		"hsj2"
  	]
  },
  	"image/ief": {
  	source: "iana",
  	extensions: [
  		"ief"
  	]
  },
  	"image/jls": {
  	source: "iana",
  	extensions: [
  		"jls"
  	]
  },
  	"image/jp2": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jp2",
  		"jpg2"
  	]
  },
  	"image/jpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpeg",
  		"jpg",
  		"jpe"
  	]
  },
  	"image/jph": {
  	source: "iana",
  	extensions: [
  		"jph"
  	]
  },
  	"image/jphc": {
  	source: "iana",
  	extensions: [
  		"jhc"
  	]
  },
  	"image/jpm": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpm"
  	]
  },
  	"image/jpx": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpx",
  		"jpf"
  	]
  },
  	"image/jxr": {
  	source: "iana",
  	extensions: [
  		"jxr"
  	]
  },
  	"image/jxra": {
  	source: "iana",
  	extensions: [
  		"jxra"
  	]
  },
  	"image/jxrs": {
  	source: "iana",
  	extensions: [
  		"jxrs"
  	]
  },
  	"image/jxs": {
  	source: "iana",
  	extensions: [
  		"jxs"
  	]
  },
  	"image/jxsc": {
  	source: "iana",
  	extensions: [
  		"jxsc"
  	]
  },
  	"image/jxsi": {
  	source: "iana",
  	extensions: [
  		"jxsi"
  	]
  },
  	"image/jxss": {
  	source: "iana",
  	extensions: [
  		"jxss"
  	]
  },
  	"image/ktx": {
  	source: "iana",
  	extensions: [
  		"ktx"
  	]
  },
  	"image/ktx2": {
  	source: "iana",
  	extensions: [
  		"ktx2"
  	]
  },
  	"image/naplps": {
  	source: "iana"
  },
  	"image/pjpeg": {
  	compressible: false
  },
  	"image/png": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"png"
  	]
  },
  	"image/prs.btif": {
  	source: "iana",
  	extensions: [
  		"btif"
  	]
  },
  	"image/prs.pti": {
  	source: "iana",
  	extensions: [
  		"pti"
  	]
  },
  	"image/pwg-raster": {
  	source: "iana"
  },
  	"image/sgi": {
  	source: "apache",
  	extensions: [
  		"sgi"
  	]
  },
  	"image/svg+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"svg",
  		"svgz"
  	]
  },
  	"image/t38": {
  	source: "iana",
  	extensions: [
  		"t38"
  	]
  },
  	"image/tiff": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"tif",
  		"tiff"
  	]
  },
  	"image/tiff-fx": {
  	source: "iana",
  	extensions: [
  		"tfx"
  	]
  },
  	"image/vnd.adobe.photoshop": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"psd"
  	]
  },
  	"image/vnd.airzip.accelerator.azv": {
  	source: "iana",
  	extensions: [
  		"azv"
  	]
  },
  	"image/vnd.cns.inf2": {
  	source: "iana"
  },
  	"image/vnd.dece.graphic": {
  	source: "iana",
  	extensions: [
  		"uvi",
  		"uvvi",
  		"uvg",
  		"uvvg"
  	]
  },
  	"image/vnd.djvu": {
  	source: "iana",
  	extensions: [
  		"djvu",
  		"djv"
  	]
  },
  	"image/vnd.dvb.subtitle": {
  	source: "iana",
  	extensions: [
  		"sub"
  	]
  },
  	"image/vnd.dwg": {
  	source: "iana",
  	extensions: [
  		"dwg"
  	]
  },
  	"image/vnd.dxf": {
  	source: "iana",
  	extensions: [
  		"dxf"
  	]
  },
  	"image/vnd.fastbidsheet": {
  	source: "iana",
  	extensions: [
  		"fbs"
  	]
  },
  	"image/vnd.fpx": {
  	source: "iana",
  	extensions: [
  		"fpx"
  	]
  },
  	"image/vnd.fst": {
  	source: "iana",
  	extensions: [
  		"fst"
  	]
  },
  	"image/vnd.fujixerox.edmics-mmr": {
  	source: "iana",
  	extensions: [
  		"mmr"
  	]
  },
  	"image/vnd.fujixerox.edmics-rlc": {
  	source: "iana",
  	extensions: [
  		"rlc"
  	]
  },
  	"image/vnd.globalgraphics.pgb": {
  	source: "iana"
  },
  	"image/vnd.microsoft.icon": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ico"
  	]
  },
  	"image/vnd.mix": {
  	source: "iana"
  },
  	"image/vnd.mozilla.apng": {
  	source: "iana"
  },
  	"image/vnd.ms-dds": {
  	compressible: true,
  	extensions: [
  		"dds"
  	]
  },
  	"image/vnd.ms-modi": {
  	source: "iana",
  	extensions: [
  		"mdi"
  	]
  },
  	"image/vnd.ms-photo": {
  	source: "apache",
  	extensions: [
  		"wdp"
  	]
  },
  	"image/vnd.net-fpx": {
  	source: "iana",
  	extensions: [
  		"npx"
  	]
  },
  	"image/vnd.pco.b16": {
  	source: "iana",
  	extensions: [
  		"b16"
  	]
  },
  	"image/vnd.radiance": {
  	source: "iana"
  },
  	"image/vnd.sealed.png": {
  	source: "iana"
  },
  	"image/vnd.sealedmedia.softseal.gif": {
  	source: "iana"
  },
  	"image/vnd.sealedmedia.softseal.jpg": {
  	source: "iana"
  },
  	"image/vnd.svf": {
  	source: "iana"
  },
  	"image/vnd.tencent.tap": {
  	source: "iana",
  	extensions: [
  		"tap"
  	]
  },
  	"image/vnd.valve.source.texture": {
  	source: "iana",
  	extensions: [
  		"vtf"
  	]
  },
  	"image/vnd.wap.wbmp": {
  	source: "iana",
  	extensions: [
  		"wbmp"
  	]
  },
  	"image/vnd.xiff": {
  	source: "iana",
  	extensions: [
  		"xif"
  	]
  },
  	"image/vnd.zbrush.pcx": {
  	source: "iana",
  	extensions: [
  		"pcx"
  	]
  },
  	"image/webp": {
  	source: "apache",
  	extensions: [
  		"webp"
  	]
  },
  	"image/wmf": {
  	source: "iana",
  	extensions: [
  		"wmf"
  	]
  },
  	"image/x-3ds": {
  	source: "apache",
  	extensions: [
  		"3ds"
  	]
  },
  	"image/x-cmu-raster": {
  	source: "apache",
  	extensions: [
  		"ras"
  	]
  },
  	"image/x-cmx": {
  	source: "apache",
  	extensions: [
  		"cmx"
  	]
  },
  	"image/x-freehand": {
  	source: "apache",
  	extensions: [
  		"fh",
  		"fhc",
  		"fh4",
  		"fh5",
  		"fh7"
  	]
  },
  	"image/x-icon": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ico"
  	]
  },
  	"image/x-jng": {
  	source: "nginx",
  	extensions: [
  		"jng"
  	]
  },
  	"image/x-mrsid-image": {
  	source: "apache",
  	extensions: [
  		"sid"
  	]
  },
  	"image/x-ms-bmp": {
  	source: "nginx",
  	compressible: true,
  	extensions: [
  		"bmp"
  	]
  },
  	"image/x-pcx": {
  	source: "apache",
  	extensions: [
  		"pcx"
  	]
  },
  	"image/x-pict": {
  	source: "apache",
  	extensions: [
  		"pic",
  		"pct"
  	]
  },
  	"image/x-portable-anymap": {
  	source: "apache",
  	extensions: [
  		"pnm"
  	]
  },
  	"image/x-portable-bitmap": {
  	source: "apache",
  	extensions: [
  		"pbm"
  	]
  },
  	"image/x-portable-graymap": {
  	source: "apache",
  	extensions: [
  		"pgm"
  	]
  },
  	"image/x-portable-pixmap": {
  	source: "apache",
  	extensions: [
  		"ppm"
  	]
  },
  	"image/x-rgb": {
  	source: "apache",
  	extensions: [
  		"rgb"
  	]
  },
  	"image/x-tga": {
  	source: "apache",
  	extensions: [
  		"tga"
  	]
  },
  	"image/x-xbitmap": {
  	source: "apache",
  	extensions: [
  		"xbm"
  	]
  },
  	"image/x-xcf": {
  	compressible: false
  },
  	"image/x-xpixmap": {
  	source: "apache",
  	extensions: [
  		"xpm"
  	]
  },
  	"image/x-xwindowdump": {
  	source: "apache",
  	extensions: [
  		"xwd"
  	]
  },
  	"message/cpim": {
  	source: "iana"
  },
  	"message/delivery-status": {
  	source: "iana"
  },
  	"message/disposition-notification": {
  	source: "iana",
  	extensions: [
  		"disposition-notification"
  	]
  },
  	"message/external-body": {
  	source: "iana"
  },
  	"message/feedback-report": {
  	source: "iana"
  },
  	"message/global": {
  	source: "iana",
  	extensions: [
  		"u8msg"
  	]
  },
  	"message/global-delivery-status": {
  	source: "iana",
  	extensions: [
  		"u8dsn"
  	]
  },
  	"message/global-disposition-notification": {
  	source: "iana",
  	extensions: [
  		"u8mdn"
  	]
  },
  	"message/global-headers": {
  	source: "iana",
  	extensions: [
  		"u8hdr"
  	]
  },
  	"message/http": {
  	source: "iana",
  	compressible: false
  },
  	"message/imdn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"message/news": {
  	source: "iana"
  },
  	"message/partial": {
  	source: "iana",
  	compressible: false
  },
  	"message/rfc822": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"eml",
  		"mime"
  	]
  },
  	"message/s-http": {
  	source: "iana"
  },
  	"message/sip": {
  	source: "iana"
  },
  	"message/sipfrag": {
  	source: "iana"
  },
  	"message/tracking-status": {
  	source: "iana"
  },
  	"message/vnd.si.simp": {
  	source: "iana"
  },
  	"message/vnd.wfa.wsc": {
  	source: "iana",
  	extensions: [
  		"wsc"
  	]
  },
  	"model/3mf": {
  	source: "iana",
  	extensions: [
  		"3mf"
  	]
  },
  	"model/e57": {
  	source: "iana"
  },
  	"model/gltf+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"gltf"
  	]
  },
  	"model/gltf-binary": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"glb"
  	]
  },
  	"model/iges": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"igs",
  		"iges"
  	]
  },
  	"model/mesh": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"msh",
  		"mesh",
  		"silo"
  	]
  },
  	"model/mtl": {
  	source: "iana",
  	extensions: [
  		"mtl"
  	]
  },
  	"model/obj": {
  	source: "iana",
  	extensions: [
  		"obj"
  	]
  },
  	"model/step": {
  	source: "iana"
  },
  	"model/step+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"stpx"
  	]
  },
  	"model/step+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"stpz"
  	]
  },
  	"model/step-xml+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"stpxz"
  	]
  },
  	"model/stl": {
  	source: "iana",
  	extensions: [
  		"stl"
  	]
  },
  	"model/vnd.collada+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dae"
  	]
  },
  	"model/vnd.dwf": {
  	source: "iana",
  	extensions: [
  		"dwf"
  	]
  },
  	"model/vnd.flatland.3dml": {
  	source: "iana"
  },
  	"model/vnd.gdl": {
  	source: "iana",
  	extensions: [
  		"gdl"
  	]
  },
  	"model/vnd.gs-gdl": {
  	source: "apache"
  },
  	"model/vnd.gs.gdl": {
  	source: "iana"
  },
  	"model/vnd.gtw": {
  	source: "iana",
  	extensions: [
  		"gtw"
  	]
  },
  	"model/vnd.moml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"model/vnd.mts": {
  	source: "iana",
  	extensions: [
  		"mts"
  	]
  },
  	"model/vnd.opengex": {
  	source: "iana",
  	extensions: [
  		"ogex"
  	]
  },
  	"model/vnd.parasolid.transmit.binary": {
  	source: "iana",
  	extensions: [
  		"x_b"
  	]
  },
  	"model/vnd.parasolid.transmit.text": {
  	source: "iana",
  	extensions: [
  		"x_t"
  	]
  },
  	"model/vnd.pytha.pyox": {
  	source: "iana"
  },
  	"model/vnd.rosette.annotated-data-model": {
  	source: "iana"
  },
  	"model/vnd.sap.vds": {
  	source: "iana",
  	extensions: [
  		"vds"
  	]
  },
  	"model/vnd.usdz+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"usdz"
  	]
  },
  	"model/vnd.valve.source.compiled-map": {
  	source: "iana",
  	extensions: [
  		"bsp"
  	]
  },
  	"model/vnd.vtu": {
  	source: "iana",
  	extensions: [
  		"vtu"
  	]
  },
  	"model/vrml": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"wrl",
  		"vrml"
  	]
  },
  	"model/x3d+binary": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"x3db",
  		"x3dbz"
  	]
  },
  	"model/x3d+fastinfoset": {
  	source: "iana",
  	extensions: [
  		"x3db"
  	]
  },
  	"model/x3d+vrml": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"x3dv",
  		"x3dvz"
  	]
  },
  	"model/x3d+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"x3d",
  		"x3dz"
  	]
  },
  	"model/x3d-vrml": {
  	source: "iana",
  	extensions: [
  		"x3dv"
  	]
  },
  	"multipart/alternative": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/appledouble": {
  	source: "iana"
  },
  	"multipart/byteranges": {
  	source: "iana"
  },
  	"multipart/digest": {
  	source: "iana"
  },
  	"multipart/encrypted": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/form-data": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/header-set": {
  	source: "iana"
  },
  	"multipart/mixed": {
  	source: "iana"
  },
  	"multipart/multilingual": {
  	source: "iana"
  },
  	"multipart/parallel": {
  	source: "iana"
  },
  	"multipart/related": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/report": {
  	source: "iana"
  },
  	"multipart/signed": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/vnd.bint.med-plus": {
  	source: "iana"
  },
  	"multipart/voice-message": {
  	source: "iana"
  },
  	"multipart/x-mixed-replace": {
  	source: "iana"
  },
  	"text/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"text/cache-manifest": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"appcache",
  		"manifest"
  	]
  },
  	"text/calendar": {
  	source: "iana",
  	extensions: [
  		"ics",
  		"ifb"
  	]
  },
  	"text/calender": {
  	compressible: true
  },
  	"text/cmd": {
  	compressible: true
  },
  	"text/coffeescript": {
  	extensions: [
  		"coffee",
  		"litcoffee"
  	]
  },
  	"text/cql": {
  	source: "iana"
  },
  	"text/cql-expression": {
  	source: "iana"
  },
  	"text/cql-identifier": {
  	source: "iana"
  },
  	"text/css": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"css"
  	]
  },
  	"text/csv": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"csv"
  	]
  },
  	"text/csv-schema": {
  	source: "iana"
  },
  	"text/directory": {
  	source: "iana"
  },
  	"text/dns": {
  	source: "iana"
  },
  	"text/ecmascript": {
  	source: "iana"
  },
  	"text/encaprtp": {
  	source: "iana"
  },
  	"text/enriched": {
  	source: "iana"
  },
  	"text/fhirpath": {
  	source: "iana"
  },
  	"text/flexfec": {
  	source: "iana"
  },
  	"text/fwdred": {
  	source: "iana"
  },
  	"text/gff3": {
  	source: "iana"
  },
  	"text/grammar-ref-list": {
  	source: "iana"
  },
  	"text/html": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"html",
  		"htm",
  		"shtml"
  	]
  },
  	"text/jade": {
  	extensions: [
  		"jade"
  	]
  },
  	"text/javascript": {
  	source: "iana",
  	compressible: true
  },
  	"text/jcr-cnd": {
  	source: "iana"
  },
  	"text/jsx": {
  	compressible: true,
  	extensions: [
  		"jsx"
  	]
  },
  	"text/less": {
  	compressible: true,
  	extensions: [
  		"less"
  	]
  },
  	"text/markdown": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"markdown",
  		"md"
  	]
  },
  	"text/mathml": {
  	source: "nginx",
  	extensions: [
  		"mml"
  	]
  },
  	"text/mdx": {
  	compressible: true,
  	extensions: [
  		"mdx"
  	]
  },
  	"text/mizar": {
  	source: "iana"
  },
  	"text/n3": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"n3"
  	]
  },
  	"text/parameters": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/parityfec": {
  	source: "iana"
  },
  	"text/plain": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"txt",
  		"text",
  		"conf",
  		"def",
  		"list",
  		"log",
  		"in",
  		"ini"
  	]
  },
  	"text/provenance-notation": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/prs.fallenstein.rst": {
  	source: "iana"
  },
  	"text/prs.lines.tag": {
  	source: "iana",
  	extensions: [
  		"dsc"
  	]
  },
  	"text/prs.prop.logic": {
  	source: "iana"
  },
  	"text/raptorfec": {
  	source: "iana"
  },
  	"text/red": {
  	source: "iana"
  },
  	"text/rfc822-headers": {
  	source: "iana"
  },
  	"text/richtext": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtx"
  	]
  },
  	"text/rtf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtf"
  	]
  },
  	"text/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"text/rtploopback": {
  	source: "iana"
  },
  	"text/rtx": {
  	source: "iana"
  },
  	"text/sgml": {
  	source: "iana",
  	extensions: [
  		"sgml",
  		"sgm"
  	]
  },
  	"text/shaclc": {
  	source: "iana"
  },
  	"text/shex": {
  	source: "iana",
  	extensions: [
  		"shex"
  	]
  },
  	"text/slim": {
  	extensions: [
  		"slim",
  		"slm"
  	]
  },
  	"text/spdx": {
  	source: "iana",
  	extensions: [
  		"spdx"
  	]
  },
  	"text/strings": {
  	source: "iana"
  },
  	"text/stylus": {
  	extensions: [
  		"stylus",
  		"styl"
  	]
  },
  	"text/t140": {
  	source: "iana"
  },
  	"text/tab-separated-values": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tsv"
  	]
  },
  	"text/troff": {
  	source: "iana",
  	extensions: [
  		"t",
  		"tr",
  		"roff",
  		"man",
  		"me",
  		"ms"
  	]
  },
  	"text/turtle": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"ttl"
  	]
  },
  	"text/ulpfec": {
  	source: "iana"
  },
  	"text/uri-list": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uri",
  		"uris",
  		"urls"
  	]
  },
  	"text/vcard": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"vcard"
  	]
  },
  	"text/vnd.a": {
  	source: "iana"
  },
  	"text/vnd.abc": {
  	source: "iana"
  },
  	"text/vnd.ascii-art": {
  	source: "iana"
  },
  	"text/vnd.curl": {
  	source: "iana",
  	extensions: [
  		"curl"
  	]
  },
  	"text/vnd.curl.dcurl": {
  	source: "apache",
  	extensions: [
  		"dcurl"
  	]
  },
  	"text/vnd.curl.mcurl": {
  	source: "apache",
  	extensions: [
  		"mcurl"
  	]
  },
  	"text/vnd.curl.scurl": {
  	source: "apache",
  	extensions: [
  		"scurl"
  	]
  },
  	"text/vnd.debian.copyright": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.dmclientscript": {
  	source: "iana"
  },
  	"text/vnd.dvb.subtitle": {
  	source: "iana",
  	extensions: [
  		"sub"
  	]
  },
  	"text/vnd.esmertec.theme-descriptor": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.familysearch.gedcom": {
  	source: "iana",
  	extensions: [
  		"ged"
  	]
  },
  	"text/vnd.ficlab.flt": {
  	source: "iana"
  },
  	"text/vnd.fly": {
  	source: "iana",
  	extensions: [
  		"fly"
  	]
  },
  	"text/vnd.fmi.flexstor": {
  	source: "iana",
  	extensions: [
  		"flx"
  	]
  },
  	"text/vnd.gml": {
  	source: "iana"
  },
  	"text/vnd.graphviz": {
  	source: "iana",
  	extensions: [
  		"gv"
  	]
  },
  	"text/vnd.hans": {
  	source: "iana"
  },
  	"text/vnd.hgl": {
  	source: "iana"
  },
  	"text/vnd.in3d.3dml": {
  	source: "iana",
  	extensions: [
  		"3dml"
  	]
  },
  	"text/vnd.in3d.spot": {
  	source: "iana",
  	extensions: [
  		"spot"
  	]
  },
  	"text/vnd.iptc.newsml": {
  	source: "iana"
  },
  	"text/vnd.iptc.nitf": {
  	source: "iana"
  },
  	"text/vnd.latex-z": {
  	source: "iana"
  },
  	"text/vnd.motorola.reflex": {
  	source: "iana"
  },
  	"text/vnd.ms-mediapackage": {
  	source: "iana"
  },
  	"text/vnd.net2phone.commcenter.command": {
  	source: "iana"
  },
  	"text/vnd.radisys.msml-basic-layout": {
  	source: "iana"
  },
  	"text/vnd.senx.warpscript": {
  	source: "iana"
  },
  	"text/vnd.si.uricatalogue": {
  	source: "iana"
  },
  	"text/vnd.sosi": {
  	source: "iana"
  },
  	"text/vnd.sun.j2me.app-descriptor": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"jad"
  	]
  },
  	"text/vnd.trolltech.linguist": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.wap.si": {
  	source: "iana"
  },
  	"text/vnd.wap.sl": {
  	source: "iana"
  },
  	"text/vnd.wap.wml": {
  	source: "iana",
  	extensions: [
  		"wml"
  	]
  },
  	"text/vnd.wap.wmlscript": {
  	source: "iana",
  	extensions: [
  		"wmls"
  	]
  },
  	"text/vtt": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"vtt"
  	]
  },
  	"text/x-asm": {
  	source: "apache",
  	extensions: [
  		"s",
  		"asm"
  	]
  },
  	"text/x-c": {
  	source: "apache",
  	extensions: [
  		"c",
  		"cc",
  		"cxx",
  		"cpp",
  		"h",
  		"hh",
  		"dic"
  	]
  },
  	"text/x-component": {
  	source: "nginx",
  	extensions: [
  		"htc"
  	]
  },
  	"text/x-fortran": {
  	source: "apache",
  	extensions: [
  		"f",
  		"for",
  		"f77",
  		"f90"
  	]
  },
  	"text/x-gwt-rpc": {
  	compressible: true
  },
  	"text/x-handlebars-template": {
  	extensions: [
  		"hbs"
  	]
  },
  	"text/x-java-source": {
  	source: "apache",
  	extensions: [
  		"java"
  	]
  },
  	"text/x-jquery-tmpl": {
  	compressible: true
  },
  	"text/x-lua": {
  	extensions: [
  		"lua"
  	]
  },
  	"text/x-markdown": {
  	compressible: true,
  	extensions: [
  		"mkd"
  	]
  },
  	"text/x-nfo": {
  	source: "apache",
  	extensions: [
  		"nfo"
  	]
  },
  	"text/x-opml": {
  	source: "apache",
  	extensions: [
  		"opml"
  	]
  },
  	"text/x-org": {
  	compressible: true,
  	extensions: [
  		"org"
  	]
  },
  	"text/x-pascal": {
  	source: "apache",
  	extensions: [
  		"p",
  		"pas"
  	]
  },
  	"text/x-processing": {
  	compressible: true,
  	extensions: [
  		"pde"
  	]
  },
  	"text/x-sass": {
  	extensions: [
  		"sass"
  	]
  },
  	"text/x-scss": {
  	extensions: [
  		"scss"
  	]
  },
  	"text/x-setext": {
  	source: "apache",
  	extensions: [
  		"etx"
  	]
  },
  	"text/x-sfv": {
  	source: "apache",
  	extensions: [
  		"sfv"
  	]
  },
  	"text/x-suse-ymp": {
  	compressible: true,
  	extensions: [
  		"ymp"
  	]
  },
  	"text/x-uuencode": {
  	source: "apache",
  	extensions: [
  		"uu"
  	]
  },
  	"text/x-vcalendar": {
  	source: "apache",
  	extensions: [
  		"vcs"
  	]
  },
  	"text/x-vcard": {
  	source: "apache",
  	extensions: [
  		"vcf"
  	]
  },
  	"text/xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xml"
  	]
  },
  	"text/xml-external-parsed-entity": {
  	source: "iana"
  },
  	"text/yaml": {
  	compressible: true,
  	extensions: [
  		"yaml",
  		"yml"
  	]
  },
  	"video/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"video/3gpp": {
  	source: "iana",
  	extensions: [
  		"3gp",
  		"3gpp"
  	]
  },
  	"video/3gpp-tt": {
  	source: "iana"
  },
  	"video/3gpp2": {
  	source: "iana",
  	extensions: [
  		"3g2"
  	]
  },
  	"video/av1": {
  	source: "iana"
  },
  	"video/bmpeg": {
  	source: "iana"
  },
  	"video/bt656": {
  	source: "iana"
  },
  	"video/celb": {
  	source: "iana"
  },
  	"video/dv": {
  	source: "iana"
  },
  	"video/encaprtp": {
  	source: "iana"
  },
  	"video/ffv1": {
  	source: "iana"
  },
  	"video/flexfec": {
  	source: "iana"
  },
  	"video/h261": {
  	source: "iana",
  	extensions: [
  		"h261"
  	]
  },
  	"video/h263": {
  	source: "iana",
  	extensions: [
  		"h263"
  	]
  },
  	"video/h263-1998": {
  	source: "iana"
  },
  	"video/h263-2000": {
  	source: "iana"
  },
  	"video/h264": {
  	source: "iana",
  	extensions: [
  		"h264"
  	]
  },
  	"video/h264-rcdo": {
  	source: "iana"
  },
  	"video/h264-svc": {
  	source: "iana"
  },
  	"video/h265": {
  	source: "iana"
  },
  	"video/iso.segment": {
  	source: "iana",
  	extensions: [
  		"m4s"
  	]
  },
  	"video/jpeg": {
  	source: "iana",
  	extensions: [
  		"jpgv"
  	]
  },
  	"video/jpeg2000": {
  	source: "iana"
  },
  	"video/jpm": {
  	source: "apache",
  	extensions: [
  		"jpm",
  		"jpgm"
  	]
  },
  	"video/jxsv": {
  	source: "iana"
  },
  	"video/mj2": {
  	source: "iana",
  	extensions: [
  		"mj2",
  		"mjp2"
  	]
  },
  	"video/mp1s": {
  	source: "iana"
  },
  	"video/mp2p": {
  	source: "iana"
  },
  	"video/mp2t": {
  	source: "iana",
  	extensions: [
  		"ts"
  	]
  },
  	"video/mp4": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mp4",
  		"mp4v",
  		"mpg4"
  	]
  },
  	"video/mp4v-es": {
  	source: "iana"
  },
  	"video/mpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mpeg",
  		"mpg",
  		"mpe",
  		"m1v",
  		"m2v"
  	]
  },
  	"video/mpeg4-generic": {
  	source: "iana"
  },
  	"video/mpv": {
  	source: "iana"
  },
  	"video/nv": {
  	source: "iana"
  },
  	"video/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ogv"
  	]
  },
  	"video/parityfec": {
  	source: "iana"
  },
  	"video/pointer": {
  	source: "iana"
  },
  	"video/quicktime": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"qt",
  		"mov"
  	]
  },
  	"video/raptorfec": {
  	source: "iana"
  },
  	"video/raw": {
  	source: "iana"
  },
  	"video/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"video/rtploopback": {
  	source: "iana"
  },
  	"video/rtx": {
  	source: "iana"
  },
  	"video/scip": {
  	source: "iana"
  },
  	"video/smpte291": {
  	source: "iana"
  },
  	"video/smpte292m": {
  	source: "iana"
  },
  	"video/ulpfec": {
  	source: "iana"
  },
  	"video/vc1": {
  	source: "iana"
  },
  	"video/vc2": {
  	source: "iana"
  },
  	"video/vnd.cctv": {
  	source: "iana"
  },
  	"video/vnd.dece.hd": {
  	source: "iana",
  	extensions: [
  		"uvh",
  		"uvvh"
  	]
  },
  	"video/vnd.dece.mobile": {
  	source: "iana",
  	extensions: [
  		"uvm",
  		"uvvm"
  	]
  },
  	"video/vnd.dece.mp4": {
  	source: "iana"
  },
  	"video/vnd.dece.pd": {
  	source: "iana",
  	extensions: [
  		"uvp",
  		"uvvp"
  	]
  },
  	"video/vnd.dece.sd": {
  	source: "iana",
  	extensions: [
  		"uvs",
  		"uvvs"
  	]
  },
  	"video/vnd.dece.video": {
  	source: "iana",
  	extensions: [
  		"uvv",
  		"uvvv"
  	]
  },
  	"video/vnd.directv.mpeg": {
  	source: "iana"
  },
  	"video/vnd.directv.mpeg-tts": {
  	source: "iana"
  },
  	"video/vnd.dlna.mpeg-tts": {
  	source: "iana"
  },
  	"video/vnd.dvb.file": {
  	source: "iana",
  	extensions: [
  		"dvb"
  	]
  },
  	"video/vnd.fvt": {
  	source: "iana",
  	extensions: [
  		"fvt"
  	]
  },
  	"video/vnd.hns.video": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.1dparityfec-1010": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.1dparityfec-2005": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.2dparityfec-1010": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.2dparityfec-2005": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.ttsavc": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.ttsmpeg2": {
  	source: "iana"
  },
  	"video/vnd.motorola.video": {
  	source: "iana"
  },
  	"video/vnd.motorola.videop": {
  	source: "iana"
  },
  	"video/vnd.mpegurl": {
  	source: "iana",
  	extensions: [
  		"mxu",
  		"m4u"
  	]
  },
  	"video/vnd.ms-playready.media.pyv": {
  	source: "iana",
  	extensions: [
  		"pyv"
  	]
  },
  	"video/vnd.nokia.interleaved-multimedia": {
  	source: "iana"
  },
  	"video/vnd.nokia.mp4vr": {
  	source: "iana"
  },
  	"video/vnd.nokia.videovoip": {
  	source: "iana"
  },
  	"video/vnd.objectvideo": {
  	source: "iana"
  },
  	"video/vnd.radgamettools.bink": {
  	source: "iana"
  },
  	"video/vnd.radgamettools.smacker": {
  	source: "iana"
  },
  	"video/vnd.sealed.mpeg1": {
  	source: "iana"
  },
  	"video/vnd.sealed.mpeg4": {
  	source: "iana"
  },
  	"video/vnd.sealed.swf": {
  	source: "iana"
  },
  	"video/vnd.sealedmedia.softseal.mov": {
  	source: "iana"
  },
  	"video/vnd.uvvu.mp4": {
  	source: "iana",
  	extensions: [
  		"uvu",
  		"uvvu"
  	]
  },
  	"video/vnd.vivo": {
  	source: "iana",
  	extensions: [
  		"viv"
  	]
  },
  	"video/vnd.youtube.yt": {
  	source: "iana"
  },
  	"video/vp8": {
  	source: "iana"
  },
  	"video/vp9": {
  	source: "iana"
  },
  	"video/webm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"webm"
  	]
  },
  	"video/x-f4v": {
  	source: "apache",
  	extensions: [
  		"f4v"
  	]
  },
  	"video/x-fli": {
  	source: "apache",
  	extensions: [
  		"fli"
  	]
  },
  	"video/x-flv": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"flv"
  	]
  },
  	"video/x-m4v": {
  	source: "apache",
  	extensions: [
  		"m4v"
  	]
  },
  	"video/x-matroska": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"mkv",
  		"mk3d",
  		"mks"
  	]
  },
  	"video/x-mng": {
  	source: "apache",
  	extensions: [
  		"mng"
  	]
  },
  	"video/x-ms-asf": {
  	source: "apache",
  	extensions: [
  		"asf",
  		"asx"
  	]
  },
  	"video/x-ms-vob": {
  	source: "apache",
  	extensions: [
  		"vob"
  	]
  },
  	"video/x-ms-wm": {
  	source: "apache",
  	extensions: [
  		"wm"
  	]
  },
  	"video/x-ms-wmv": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"wmv"
  	]
  },
  	"video/x-ms-wmx": {
  	source: "apache",
  	extensions: [
  		"wmx"
  	]
  },
  	"video/x-ms-wvx": {
  	source: "apache",
  	extensions: [
  		"wvx"
  	]
  },
  	"video/x-msvideo": {
  	source: "apache",
  	extensions: [
  		"avi"
  	]
  },
  	"video/x-sgi-movie": {
  	source: "apache",
  	extensions: [
  		"movie"
  	]
  },
  	"video/x-smv": {
  	source: "apache",
  	extensions: [
  		"smv"
  	]
  },
  	"x-conference/x-cooltalk": {
  	source: "apache",
  	extensions: [
  		"ice"
  	]
  },
  	"x-shader/x-fragment": {
  	compressible: true
  },
  	"x-shader/x-vertex": {
  	compressible: true
  }
  };

  /*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   */

  (function (module) {
  	/**
  	 * Module exports.
  	 */

  	module.exports = require$$0;
  } (mimeDb));

  /*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   */

  (function (exports) {

  	/**
  	 * Module dependencies.
  	 * @private
  	 */

  	var db = mimeDbExports;
  	var extname = require$$1__default$1["default"].extname;

  	/**
  	 * Module variables.
  	 * @private
  	 */

  	var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
  	var TEXT_TYPE_REGEXP = /^text\//i;

  	/**
  	 * Module exports.
  	 * @public
  	 */

  	exports.charset = charset;
  	exports.charsets = { lookup: charset };
  	exports.contentType = contentType;
  	exports.extension = extension;
  	exports.extensions = Object.create(null);
  	exports.lookup = lookup;
  	exports.types = Object.create(null);

  	// Populate the extensions/types maps
  	populateMaps(exports.extensions, exports.types);

  	/**
  	 * Get the default charset for a MIME type.
  	 *
  	 * @param {string} type
  	 * @return {boolean|string}
  	 */

  	function charset (type) {
  	  if (!type || typeof type !== 'string') {
  	    return false
  	  }

  	  // TODO: use media-typer
  	  var match = EXTRACT_TYPE_REGEXP.exec(type);
  	  var mime = match && db[match[1].toLowerCase()];

  	  if (mime && mime.charset) {
  	    return mime.charset
  	  }

  	  // default text/* to utf-8
  	  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
  	    return 'UTF-8'
  	  }

  	  return false
  	}

  	/**
  	 * Create a full Content-Type header given a MIME type or extension.
  	 *
  	 * @param {string} str
  	 * @return {boolean|string}
  	 */

  	function contentType (str) {
  	  // TODO: should this even be in this module?
  	  if (!str || typeof str !== 'string') {
  	    return false
  	  }

  	  var mime = str.indexOf('/') === -1
  	    ? exports.lookup(str)
  	    : str;

  	  if (!mime) {
  	    return false
  	  }

  	  // TODO: use content-type or other module
  	  if (mime.indexOf('charset') === -1) {
  	    var charset = exports.charset(mime);
  	    if (charset) mime += '; charset=' + charset.toLowerCase();
  	  }

  	  return mime
  	}

  	/**
  	 * Get the default extension for a MIME type.
  	 *
  	 * @param {string} type
  	 * @return {boolean|string}
  	 */

  	function extension (type) {
  	  if (!type || typeof type !== 'string') {
  	    return false
  	  }

  	  // TODO: use media-typer
  	  var match = EXTRACT_TYPE_REGEXP.exec(type);

  	  // get extensions
  	  var exts = match && exports.extensions[match[1].toLowerCase()];

  	  if (!exts || !exts.length) {
  	    return false
  	  }

  	  return exts[0]
  	}

  	/**
  	 * Lookup the MIME type for a file path/extension.
  	 *
  	 * @param {string} path
  	 * @return {boolean|string}
  	 */

  	function lookup (path) {
  	  if (!path || typeof path !== 'string') {
  	    return false
  	  }

  	  // get the extension ("ext" or ".ext" or full path)
  	  var extension = extname('x.' + path)
  	    .toLowerCase()
  	    .substr(1);

  	  if (!extension) {
  	    return false
  	  }

  	  return exports.types[extension] || false
  	}

  	/**
  	 * Populate the extensions and types maps.
  	 * @private
  	 */

  	function populateMaps (extensions, types) {
  	  // source preference (least -> most)
  	  var preference = ['nginx', 'apache', undefined, 'iana'];

  	  Object.keys(db).forEach(function forEachMimeType (type) {
  	    var mime = db[type];
  	    var exts = mime.extensions;

  	    if (!exts || !exts.length) {
  	      return
  	    }

  	    // mime -> extensions
  	    extensions[type] = exts;

  	    // extension -> mime
  	    for (var i = 0; i < exts.length; i++) {
  	      var extension = exts[i];

  	      if (types[extension]) {
  	        var from = preference.indexOf(db[types[extension]].source);
  	        var to = preference.indexOf(mime.source);

  	        if (types[extension] !== 'application/octet-stream' &&
  	          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
  	          // skip the remapping
  	          continue
  	        }
  	      }

  	      // set the extension -> mime
  	      types[extension] = type;
  	    }
  	  });
  	}
  } (mimeTypes));

  var defer_1 = defer$1;

  /**
   * Runs provided function on next iteration of the event loop
   *
   * @param {function} fn - function to run
   */
  function defer$1(fn)
  {
    var nextTick = typeof setImmediate == 'function'
      ? setImmediate
      : (
        typeof process == 'object' && typeof process.nextTick == 'function'
        ? process.nextTick
        : null
      );

    if (nextTick)
    {
      nextTick(fn);
    }
    else
    {
      setTimeout(fn, 0);
    }
  }

  var defer = defer_1;

  // API
  var async_1 = async$2;

  /**
   * Runs provided callback asynchronously
   * even if callback itself is not
   *
   * @param   {function} callback - callback to invoke
   * @returns {function} - augmented callback
   */
  function async$2(callback)
  {
    var isAsync = false;

    // check if async happened
    defer(function() { isAsync = true; });

    return function async_callback(err, result)
    {
      if (isAsync)
      {
        callback(err, result);
      }
      else
      {
        defer(function nextTick_callback()
        {
          callback(err, result);
        });
      }
    };
  }

  // API
  var abort_1 = abort$2;

  /**
   * Aborts leftover active jobs
   *
   * @param {object} state - current state object
   */
  function abort$2(state)
  {
    Object.keys(state.jobs).forEach(clean.bind(state));

    // reset leftover jobs
    state.jobs = {};
  }

  /**
   * Cleans up leftover job by invoking abort function for the provided job id
   *
   * @this  state
   * @param {string|number} key - job id to abort
   */
  function clean(key)
  {
    if (typeof this.jobs[key] == 'function')
    {
      this.jobs[key]();
    }
  }

  var async$1 = async_1
    , abort$1 = abort_1
    ;

  // API
  var iterate_1 = iterate$2;

  /**
   * Iterates over each job object
   *
   * @param {array|object} list - array or object (named list) to iterate over
   * @param {function} iterator - iterator to run
   * @param {object} state - current job status
   * @param {function} callback - invoked when all elements processed
   */
  function iterate$2(list, iterator, state, callback)
  {
    // store current index
    var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

    state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
    {
      // don't repeat yourself
      // skip secondary callbacks
      if (!(key in state.jobs))
      {
        return;
      }

      // clean up jobs
      delete state.jobs[key];

      if (error)
      {
        // don't process rest of the results
        // stop still active jobs
        // and reset the list
        abort$1(state);
      }
      else
      {
        state.results[key] = output;
      }

      // return salvaged results
      callback(error, state.results);
    });
  }

  /**
   * Runs iterator over provided job element
   *
   * @param   {function} iterator - iterator to invoke
   * @param   {string|number} key - key/index of the element in the list of jobs
   * @param   {mixed} item - job description
   * @param   {function} callback - invoked after iterator is done with the job
   * @returns {function|mixed} - job abort function or something else
   */
  function runJob(iterator, key, item, callback)
  {
    var aborter;

    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2)
    {
      aborter = iterator(item, async$1(callback));
    }
    // otherwise go with full three arguments
    else
    {
      aborter = iterator(item, key, async$1(callback));
    }

    return aborter;
  }

  // API
  var state_1 = state;

  /**
   * Creates initial state object
   * for iteration over list
   *
   * @param   {array|object} list - list to iterate over
   * @param   {function|null} sortMethod - function to use for keys sort,
   *                                     or `null` to keep them as is
   * @returns {object} - initial state object
   */
  function state(list, sortMethod)
  {
    var isNamedList = !Array.isArray(list)
      , initState =
      {
        index    : 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs     : {},
        results  : isNamedList ? {} : [],
        size     : isNamedList ? Object.keys(list).length : list.length
      }
      ;

    if (sortMethod)
    {
      // sort array keys based on it's values
      // sort object's keys just on own merit
      initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
      {
        return sortMethod(list[a], list[b]);
      });
    }

    return initState;
  }

  var abort = abort_1
    , async = async_1
    ;

  // API
  var terminator_1 = terminator$2;

  /**
   * Terminates jobs in the attached state context
   *
   * @this  AsyncKitState#
   * @param {function} callback - final callback to invoke after termination
   */
  function terminator$2(callback)
  {
    if (!Object.keys(this.jobs).length)
    {
      return;
    }

    // fast forward iteration index
    this.index = this.size;

    // abort jobs
    abort(this);

    // send back results we have so far
    async(callback)(null, this.results);
  }

  var iterate$1    = iterate_1
    , initState$1  = state_1
    , terminator$1 = terminator_1
    ;

  // Public API
  var parallel_1 = parallel;

  /**
   * Runs iterator over provided array elements in parallel
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function parallel(list, iterator, callback)
  {
    var state = initState$1(list);

    while (state.index < (state['keyedList'] || list).length)
    {
      iterate$1(list, iterator, state, function(error, result)
      {
        if (error)
        {
          callback(error, result);
          return;
        }

        // looks like it's the last one
        if (Object.keys(state.jobs).length === 0)
        {
          callback(null, state.results);
          return;
        }
      });

      state.index++;
    }

    return terminator$1.bind(state, callback);
  }

  var serialOrderedExports = {};
  var serialOrdered$2 = {
    get exports(){ return serialOrderedExports; },
    set exports(v){ serialOrderedExports = v; },
  };

  var iterate    = iterate_1
    , initState  = state_1
    , terminator = terminator_1
    ;

  // Public API
  serialOrdered$2.exports = serialOrdered$1;
  // sorting helpers
  serialOrderedExports.ascending  = ascending;
  serialOrderedExports.descending = descending;

  /**
   * Runs iterator over provided sorted array elements in series
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} sortMethod - custom sort function
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function serialOrdered$1(list, iterator, sortMethod, callback)
  {
    var state = initState(list, sortMethod);

    iterate(list, iterator, state, function iteratorHandler(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      state.index++;

      // are we there yet?
      if (state.index < (state['keyedList'] || list).length)
      {
        iterate(list, iterator, state, iteratorHandler);
        return;
      }

      // done here
      callback(null, state.results);
    });

    return terminator.bind(state, callback);
  }

  /*
   * -- Sort methods
   */

  /**
   * sort helper to sort array elements in ascending order
   *
   * @param   {mixed} a - an item to compare
   * @param   {mixed} b - an item to compare
   * @returns {number} - comparison result
   */
  function ascending(a, b)
  {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /**
   * sort helper to sort array elements in descending order
   *
   * @param   {mixed} a - an item to compare
   * @param   {mixed} b - an item to compare
   * @returns {number} - comparison result
   */
  function descending(a, b)
  {
    return -1 * ascending(a, b);
  }

  var serialOrdered = serialOrderedExports;

  // Public API
  var serial_1 = serial;

  /**
   * Runs iterator over provided array elements in series
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function serial(list, iterator, callback)
  {
    return serialOrdered(list, iterator, null, callback);
  }

  var asynckit$1 =
  {
    parallel      : parallel_1,
    serial        : serial_1,
    serialOrdered : serialOrderedExports
  };

  // populates missing values
  var populate$1 = function(dst, src) {

    Object.keys(src).forEach(function(prop)
    {
      dst[prop] = dst[prop] || src[prop];
    });

    return dst;
  };

  var CombinedStream = combined_stream;
  var util = require$$1__default["default"];
  var path = require$$1__default$1["default"];
  var http$1 = require$$3__default["default"];
  var https$1 = require$$4__default["default"];
  var parseUrl$1 = require$$0__default["default"].parse;
  var fs = require$$6__default["default"];
  var Stream = stream__default["default"].Stream;
  var mime = mimeTypes;
  var asynckit = asynckit$1;
  var populate = populate$1;

  // Public API
  var form_data = FormData$1;

  // make it a Stream
  util.inherits(FormData$1, CombinedStream);

  /**
   * Create readable "multipart/form-data" streams.
   * Can be used to submit forms
   * and file uploads to other web applications.
   *
   * @constructor
   * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
   */
  function FormData$1(options) {
    if (!(this instanceof FormData$1)) {
      return new FormData$1(options);
    }

    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];

    CombinedStream.call(this);

    options = options || {};
    for (var option in options) {
      this[option] = options[option];
    }
  }

  FormData$1.LINE_BREAK = '\r\n';
  FormData$1.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

  FormData$1.prototype.append = function(field, value, options) {

    options = options || {};

    // allow filename as single option
    if (typeof options == 'string') {
      options = {filename: options};
    }

    var append = CombinedStream.prototype.append.bind(this);

    // all that streamy business can't handle numbers
    if (typeof value == 'number') {
      value = '' + value;
    }

    // https://github.com/felixge/node-form-data/issues/38
    if (util.isArray(value)) {
      // Please convert your array into string
      // the way web server expects it
      this._error(new Error('Arrays are not supported.'));
      return;
    }

    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();

    append(header);
    append(value);
    append(footer);

    // pass along options.knownLength
    this._trackLength(header, value, options);
  };

  FormData$1.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;

    // used w/ getLengthSync(), when length is known.
    // e.g. for streaming directly from a remote server,
    // w/ a known file a size, and not wanting to wait for
    // incoming file to finish to get its size.
    if (options.knownLength != null) {
      valueLength += +options.knownLength;
    } else if (Buffer.isBuffer(value)) {
      valueLength = value.length;
    } else if (typeof value === 'string') {
      valueLength = Buffer.byteLength(value);
    }

    this._valueLength += valueLength;

    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength +=
      Buffer.byteLength(header) +
      FormData$1.LINE_BREAK.length;

    // empty or either doesn't have path or not an http response or not a stream
    if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
      return;
    }

    // no need to bother with the length
    if (!options.knownLength) {
      this._valuesToMeasure.push(value);
    }
  };

  FormData$1.prototype._lengthRetriever = function(value, callback) {

    if (value.hasOwnProperty('fd')) {

      // take read range into a account
      // `end` = Infinity –> read file till the end
      //
      // TODO: Looks like there is bug in Node fs.createReadStream
      // it doesn't respect `end` options without `start` options
      // Fix it when node fixes it.
      // https://github.com/joyent/node/issues/7819
      if (value.end != undefined && value.end != Infinity && value.start != undefined) {

        // when end specified
        // no need to calculate range
        // inclusive, starts with 0
        callback(null, value.end + 1 - (value.start ? value.start : 0));

      // not that fast snoopy
      } else {
        // still need to fetch file size from fs
        fs.stat(value.path, function(err, stat) {

          var fileSize;

          if (err) {
            callback(err);
            return;
          }

          // update final size based on the range options
          fileSize = stat.size - (value.start ? value.start : 0);
          callback(null, fileSize);
        });
      }

    // or http response
    } else if (value.hasOwnProperty('httpVersion')) {
      callback(null, +value.headers['content-length']);

    // or request stream http://github.com/mikeal/request
    } else if (value.hasOwnProperty('httpModule')) {
      // wait till response come back
      value.on('response', function(response) {
        value.pause();
        callback(null, +response.headers['content-length']);
      });
      value.resume();

    // something else
    } else {
      callback('Unknown stream');
    }
  };

  FormData$1.prototype._multiPartHeader = function(field, value, options) {
    // custom header specified (as string)?
    // it becomes responsible for boundary
    // (e.g. to handle extra CRLFs on .NET servers)
    if (typeof options.header == 'string') {
      return options.header;
    }

    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);

    var contents = '';
    var headers  = {
      // add custom disposition as third element or keep it two elements if not
      'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
      // if no content type. allow it to be empty array
      'Content-Type': [].concat(contentType || [])
    };

    // allow custom headers.
    if (typeof options.header == 'object') {
      populate(headers, options.header);
    }

    var header;
    for (var prop in headers) {
      if (!headers.hasOwnProperty(prop)) continue;
      header = headers[prop];

      // skip nullish headers.
      if (header == null) {
        continue;
      }

      // convert all headers to arrays.
      if (!Array.isArray(header)) {
        header = [header];
      }

      // add non-empty headers.
      if (header.length) {
        contents += prop + ': ' + header.join('; ') + FormData$1.LINE_BREAK;
      }
    }

    return '--' + this.getBoundary() + FormData$1.LINE_BREAK + contents + FormData$1.LINE_BREAK;
  };

  FormData$1.prototype._getContentDisposition = function(value, options) {

    var filename
      , contentDisposition
      ;

    if (typeof options.filepath === 'string') {
      // custom filepath for relative paths
      filename = path.normalize(options.filepath).replace(/\\/g, '/');
    } else if (options.filename || value.name || value.path) {
      // custom filename take precedence
      // formidable and the browser add a name property
      // fs- and request- streams have path property
      filename = path.basename(options.filename || value.name || value.path);
    } else if (value.readable && value.hasOwnProperty('httpVersion')) {
      // or try http response
      filename = path.basename(value.client._httpMessage.path || '');
    }

    if (filename) {
      contentDisposition = 'filename="' + filename + '"';
    }

    return contentDisposition;
  };

  FormData$1.prototype._getContentType = function(value, options) {

    // use custom content-type above all
    var contentType = options.contentType;

    // or try `name` from formidable, browser
    if (!contentType && value.name) {
      contentType = mime.lookup(value.name);
    }

    // or try `path` from fs-, request- streams
    if (!contentType && value.path) {
      contentType = mime.lookup(value.path);
    }

    // or if it's http-reponse
    if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
      contentType = value.headers['content-type'];
    }

    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
      contentType = mime.lookup(options.filepath || options.filename);
    }

    // fallback to the default content type if `value` is not simple value
    if (!contentType && typeof value == 'object') {
      contentType = FormData$1.DEFAULT_CONTENT_TYPE;
    }

    return contentType;
  };

  FormData$1.prototype._multiPartFooter = function() {
    return function(next) {
      var footer = FormData$1.LINE_BREAK;

      var lastPart = (this._streams.length === 0);
      if (lastPart) {
        footer += this._lastBoundary();
      }

      next(footer);
    }.bind(this);
  };

  FormData$1.prototype._lastBoundary = function() {
    return '--' + this.getBoundary() + '--' + FormData$1.LINE_BREAK;
  };

  FormData$1.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
      'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
    };

    for (header in userHeaders) {
      if (userHeaders.hasOwnProperty(header)) {
        formHeaders[header.toLowerCase()] = userHeaders[header];
      }
    }

    return formHeaders;
  };

  FormData$1.prototype.setBoundary = function(boundary) {
    this._boundary = boundary;
  };

  FormData$1.prototype.getBoundary = function() {
    if (!this._boundary) {
      this._generateBoundary();
    }

    return this._boundary;
  };

  FormData$1.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc( 0 );
    var boundary = this.getBoundary();

    // Create the form content. Add Line breaks to the end of data.
    for (var i = 0, len = this._streams.length; i < len; i++) {
      if (typeof this._streams[i] !== 'function') {

        // Add content to the buffer.
        if(Buffer.isBuffer(this._streams[i])) {
          dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
        }else {
          dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
        }

        // Add break after content.
        if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
          dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData$1.LINE_BREAK)] );
        }
      }
    }

    // Add the footer and return the Buffer object.
    return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
  };

  FormData$1.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    var boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this._boundary = boundary;
  };

  // Note: getLengthSync DOESN'T calculate streams length
  // As workaround one can calculate file size manually
  // and add it as knownLength option
  FormData$1.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;

    // Don't get confused, there are 3 "internal" streams for each keyval pair
    // so it basically checks if there is any value added to the form
    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }

    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
      // Some async length retrievers are present
      // therefore synchronous length calculation is false.
      // Please use getLength(callback) to get proper length
      this._error(new Error('Cannot calculate proper length in synchronous way.'));
    }

    return knownLength;
  };

  // Public API to check if length of added values is known
  // https://github.com/form-data/form-data/issues/196
  // https://github.com/form-data/form-data/issues/262
  FormData$1.prototype.hasKnownLength = function() {
    var hasKnownLength = true;

    if (this._valuesToMeasure.length) {
      hasKnownLength = false;
    }

    return hasKnownLength;
  };

  FormData$1.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;

    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }

    if (!this._valuesToMeasure.length) {
      process.nextTick(cb.bind(this, null, knownLength));
      return;
    }

    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
      if (err) {
        cb(err);
        return;
      }

      values.forEach(function(length) {
        knownLength += length;
      });

      cb(null, knownLength);
    });
  };

  FormData$1.prototype.submit = function(params, cb) {
    var request
      , options
      , defaults = {method: 'post'}
      ;

    // parse provided url if it's string
    // or treat it as options object
    if (typeof params == 'string') {

      params = parseUrl$1(params);
      options = populate({
        port: params.port,
        path: params.pathname,
        host: params.hostname,
        protocol: params.protocol
      }, defaults);

    // use custom params
    } else {

      options = populate(params, defaults);
      // if no port provided use default one
      if (!options.port) {
        options.port = options.protocol == 'https:' ? 443 : 80;
      }
    }

    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);

    // https if specified, fallback to http in any other case
    if (options.protocol == 'https:') {
      request = https$1.request(options);
    } else {
      request = http$1.request(options);
    }

    // get content length and fire away
    this.getLength(function(err, length) {
      if (err && err !== 'Unknown stream') {
        this._error(err);
        return;
      }

      // add content length
      if (length) {
        request.setHeader('Content-Length', length);
      }

      this.pipe(request);
      if (cb) {
        var onResponse;

        var callback = function (error, responce) {
          request.removeListener('error', callback);
          request.removeListener('response', onResponse);

          return cb.call(this, error, responce);
        };

        onResponse = callback.bind(this, null);

        request.on('error', callback);
        request.on('response', onResponse);
      }
    }.bind(this));

    return request;
  };

  FormData$1.prototype._error = function(err) {
    if (!this.error) {
      this.error = err;
      this.pause();
      this.emit('error', err);
    }
  };

  FormData$1.prototype.toString = function () {
    return '[object FormData]';
  };

  /**
   * Determines if the given thing is a array or js object.
   *
   * @param {string} thing - The object or array to be visited.
   *
   * @returns {boolean}
   */
  function isVisitable(thing) {
    return utils.isPlainObject(thing) || utils.isArray(thing);
  }

  /**
   * It removes the brackets from the end of a string
   *
   * @param {string} key - The key of the parameter.
   *
   * @returns {string} the key without the brackets.
   */
  function removeBrackets(key) {
    return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
  }

  /**
   * It takes a path, a key, and a boolean, and returns a string
   *
   * @param {string} path - The path to the current key.
   * @param {string} key - The key of the current object being iterated over.
   * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
   *
   * @returns {string} The path to the current key.
   */
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      // eslint-disable-next-line no-param-reassign
      token = removeBrackets(token);
      return !dots && i ? '[' + token + ']' : token;
    }).join(dots ? '.' : '');
  }

  /**
   * If the array is an array and none of its elements are visitable, then it's a flat array.
   *
   * @param {Array<any>} arr - The array to check
   *
   * @returns {boolean}
   */
  function isFlatArray(arr) {
    return utils.isArray(arr) && !arr.some(isVisitable);
  }

  const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });

  /**
   * Convert a data object to FormData
   *
   * @param {Object} obj
   * @param {?Object} [formData]
   * @param {?Object} [options]
   * @param {Function} [options.visitor]
   * @param {Boolean} [options.metaTokens = true]
   * @param {Boolean} [options.dots = false]
   * @param {?Boolean} [options.indexes = false]
   *
   * @returns {Object}
   **/

  /**
   * It converts an object into a FormData object
   *
   * @param {Object<any, any>} obj - The object to convert to form data.
   * @param {string} formData - The FormData object to append to.
   * @param {Object<string, any>} options
   *
   * @returns
   */
  function toFormData(obj, formData, options) {
    if (!utils.isObject(obj)) {
      throw new TypeError('target must be an object');
    }

    // eslint-disable-next-line no-param-reassign
    formData = formData || new (form_data || FormData)();

    // eslint-disable-next-line no-param-reassign
    options = utils.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      return !utils.isUndefined(source[option]);
    });

    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
    const useBlob = _Blob && utils.isSpecCompliantForm(formData);

    if (!utils.isFunction(visitor)) {
      throw new TypeError('visitor must be a function');
    }

    function convertValue(value) {
      if (value === null) return '';

      if (utils.isDate(value)) {
        return value.toISOString();
      }

      if (!useBlob && utils.isBlob(value)) {
        throw new AxiosError('Blob is not supported. Use a Buffer instead.');
      }

      if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
        return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
      }

      return value;
    }

    /**
     * Default visitor.
     *
     * @param {*} value
     * @param {String|Number} key
     * @param {Array<String|Number>} path
     * @this {FormData}
     *
     * @returns {boolean} return true to visit the each prop of the value recursively
     */
    function defaultVisitor(value, key, path) {
      let arr = value;

      if (value && !path && typeof value === 'object') {
        if (utils.endsWith(key, '{}')) {
          // eslint-disable-next-line no-param-reassign
          key = metaTokens ? key : key.slice(0, -2);
          // eslint-disable-next-line no-param-reassign
          value = JSON.stringify(value);
        } else if (
          (utils.isArray(value) && isFlatArray(value)) ||
          ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
          )) {
          // eslint-disable-next-line no-param-reassign
          key = removeBrackets(key);

          arr.forEach(function each(el, index) {
            !(utils.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
              convertValue(el)
            );
          });
          return false;
        }
      }

      if (isVisitable(value)) {
        return true;
      }

      formData.append(renderKey(path, key, dots), convertValue(value));

      return false;
    }

    const stack = [];

    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });

    function build(value, path) {
      if (utils.isUndefined(value)) return;

      if (stack.indexOf(value) !== -1) {
        throw Error('Circular reference detected in ' + path.join('.'));
      }

      stack.push(value);

      utils.forEach(value, function each(el, key) {
        const result = !(utils.isUndefined(el) || el === null) && visitor.call(
          formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
        );

        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });

      stack.pop();
    }

    if (!utils.isObject(obj)) {
      throw new TypeError('data must be an object');
    }

    build(obj);

    return formData;
  }

  /**
   * It encodes a string by replacing all characters that are not in the unreserved set with
   * their percent-encoded equivalents
   *
   * @param {string} str - The string to encode.
   *
   * @returns {string} The encoded string.
   */
  function encode$1(str) {
    const charMap = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }

  /**
   * It takes a params object and converts it to a FormData object
   *
   * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
   * @param {Object<string, any>} options - The options object passed to the Axios constructor.
   *
   * @returns {void}
   */
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];

    params && toFormData(params, this, options);
  }

  const prototype = AxiosURLSearchParams.prototype;

  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };

  prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;

    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '').join('&');
  };

  /**
   * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
   * URI encoded counterparts
   *
   * @param {string} val The value to be encoded.
   *
   * @returns {string} The encoded value.
   */
  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @param {?object} options
   *
   * @returns {string} The formatted url
   */
  function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }
    
    const _encode = options && options.encode || encode;

    const serializeFn = options && options.serialize;

    let serializedParams;

    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils.isURLSearchParams(params) ?
        params.toString() :
        new AxiosURLSearchParams(params, options).toString(_encode);
    }

    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");

      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  }

  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }

    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }

  var transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  var URLSearchParams = require$$0__default["default"].URLSearchParams;

  var platform = {
    isNode: true,
    classes: {
      URLSearchParams,
      FormData: form_data,
      Blob: typeof Blob !== 'undefined' && Blob || null
    },
    protocols: [ 'http', 'https', 'file', 'data' ]
  };

  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (utils.isBuffer(value)) {
          this.append(key, value.toString('base64'));
          return false;
        }

        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }

  /**
   * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
   *
   * @param {string} name - The name of the property to get.
   *
   * @returns An array of strings.
   */
  function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
      return match[0] === '[]' ? '' : match[1] || match[0];
    });
  }

  /**
   * Convert an array to an object.
   *
   * @param {Array<any>} arr - The array to convert to an object.
   *
   * @returns An object with the same keys and values as the array.
   */
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }

  /**
   * It takes a FormData object and returns a JavaScript object
   *
   * @param {string} formData The FormData object to convert to JSON.
   *
   * @returns {Object<string, any> | null} The converted object.
   */
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils.isArray(target) ? target.length : name;

      if (isLast) {
        if (utils.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }

        return !isNumericKey;
      }

      if (!target[name] || !utils.isObject(target[name])) {
        target[name] = [];
      }

      const result = buildPath(path, value, target[name], index);

      if (result && utils.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }

      return !isNumericKey;
    }

    if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
      const obj = {};

      utils.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });

      return obj;
    }

    return null;
  }

  const DEFAULT_CONTENT_TYPE = {
    'Content-Type': undefined
  };

  /**
   * It takes a string, tries to parse it, and if it fails, it returns the stringified version
   * of the input
   *
   * @param {any} rawValue - The value to be stringified.
   * @param {Function} parser - A function that parses a string into a JavaScript object.
   * @param {Function} encoder - A function that takes a value and returns a string.
   *
   * @returns {string} A stringified version of the rawValue.
   */
  function stringifySafely(rawValue, parser, encoder) {
    if (utils.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  const defaults = {

    transitional: transitionalDefaults,

    adapter: ['xhr', 'http'],

    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || '';
      const hasJSONContentType = contentType.indexOf('application/json') > -1;
      const isObjectPayload = utils.isObject(data);

      if (isObjectPayload && utils.isHTMLForm(data)) {
        data = new FormData(data);
      }

      const isFormData = utils.isFormData(data);

      if (isFormData) {
        if (!hasJSONContentType) {
          return data;
        }
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }

      if (utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
        return data.toString();
      }

      let isFileList;

      if (isObjectPayload) {
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }

        if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
          const _FormData = this.env && this.env.FormData;

          return toFormData(
            isFileList ? {'files[]': data} : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }

      if (isObjectPayload || hasJSONContentType ) {
        headers.setContentType('application/json', false);
        return stringifySafely(data);
      }

      return data;
    }],

    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === 'json';

      if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;

        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },

    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  // RawAxiosHeaders whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  const ignoreDuplicateOf = utils.toObjectSet([
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ]);

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} rawHeaders Headers needing to be parsed
   *
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = rawHeaders => {
    const parsed = {};
    let key;
    let val;
    let i;

    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();

      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }

      if (key === 'set-cookie') {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

    return parsed;
  };

  const $internals = Symbol('internals');

  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }

  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }

    return utils.isArray(value) ? value.map(normalizeValue) : String(value);
  }

  function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;

    while ((match = tokensRE.exec(str))) {
      tokens[match[1]] = match[2];
    }

    return tokens;
  }

  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils.isFunction(filter)) {
      return filter.call(this, value, header);
    }

    if (isHeaderNameFilter) {
      value = header;
    }

    if (!utils.isString(value)) return;

    if (utils.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }

    if (utils.isRegExp(filter)) {
      return filter.test(value);
    }
  }

  function formatHeader(header) {
    return header.trim()
      .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
  }

  function buildAccessors(obj, header) {
    const accessorName = utils.toCamelCase(' ' + header);

    ['get', 'set', 'has'].forEach(methodName => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }

  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }

    set(header, valueOrRewrite, rewrite) {
      const self = this;

      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);

        if (!lHeader) {
          throw new Error('header name must be a non-empty string');
        }

        const key = utils.findKey(self, lHeader);

        if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
          self[key || _header] = normalizeValue(_value);
        }
      }

      const setHeaders = (headers, _rewrite) =>
        utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

      if (utils.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }

      return this;
    }

    get(header, parser) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils.findKey(this, header);

        if (key) {
          const value = this[key];

          if (!parser) {
            return value;
          }

          if (parser === true) {
            return parseTokens(value);
          }

          if (utils.isFunction(parser)) {
            return parser.call(this, value, key);
          }

          if (utils.isRegExp(parser)) {
            return parser.exec(value);
          }

          throw new TypeError('parser must be boolean|regexp|function');
        }
      }
    }

    has(header, matcher) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils.findKey(this, header);

        return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }

      return false;
    }

    delete(header, matcher) {
      const self = this;
      let deleted = false;

      function deleteHeader(_header) {
        _header = normalizeHeader(_header);

        if (_header) {
          const key = utils.findKey(self, _header);

          if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
            delete self[key];

            deleted = true;
          }
        }
      }

      if (utils.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }

      return deleted;
    }

    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;

      while (i--) {
        const key = keys[i];
        if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }

      return deleted;
    }

    normalize(format) {
      const self = this;
      const headers = {};

      utils.forEach(this, (value, header) => {
        const key = utils.findKey(headers, header);

        if (key) {
          self[key] = normalizeValue(value);
          delete self[header];
          return;
        }

        const normalized = format ? formatHeader(header) : String(header).trim();

        if (normalized !== header) {
          delete self[header];
        }

        self[normalized] = normalizeValue(value);

        headers[normalized] = true;
      });

      return this;
    }

    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }

    toJSON(asStrings) {
      const obj = Object.create(null);

      utils.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
      });

      return obj;
    }

    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }

    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
    }

    get [Symbol.toStringTag]() {
      return 'AxiosHeaders';
    }

    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }

    static concat(first, ...targets) {
      const computed = new this(first);

      targets.forEach((target) => computed.set(target));

      return computed;
    }

    static accessor(header) {
      const internals = this[$internals] = (this[$internals] = {
        accessors: {}
      });

      const accessors = internals.accessors;
      const prototype = this.prototype;

      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);

        if (!accessors[lHeader]) {
          buildAccessors(prototype, _header);
          accessors[lHeader] = true;
        }
      }

      utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

      return this;
    }
  }

  AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

  utils.freezeMethods(AxiosHeaders.prototype);
  utils.freezeMethods(AxiosHeaders);

  /**
   * Transform the data for a request or a response
   *
   * @param {Array|Function} fns A single function or Array of functions
   * @param {?Object} response The response object
   *
   * @returns {*} The resulting transformed data
   */
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders.from(context.headers);
    let data = context.data;

    utils.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });

    headers.normalize();

    return data;
  }

  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
  }

  utils.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   *
   * @returns {object} The response.
   */
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError(
        'Request failed with status code ' + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   *
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   *
   * @returns {string} The combined URL
   */
  function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  }

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   *
   * @returns {string} The combined full path
   */
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  var parseUrl = require$$0__default["default"].parse;

  var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443,
  };

  var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length &&
      this.indexOf(s, this.length - s.length) !== -1;
  };

  /**
   * @param {string|object} url - The URL, or the result from url.parse.
   * @return {string} The URL of the proxy that should handle the request to the
   *  given URL. If no proxy is set, this will be an empty string.
   */
  function getProxyForUrl(url) {
    var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
      return '';  // Don't proxy URLs without a valid scheme or host.
    }

    proto = proto.split(':', 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, '');
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
      return '';  // Don't proxy URLs that match NO_PROXY.
    }

    var proxy =
      getEnv('npm_config_' + proto + '_proxy') ||
      getEnv(proto + '_proxy') ||
      getEnv('npm_config_proxy') ||
      getEnv('all_proxy');
    if (proxy && proxy.indexOf('://') === -1) {
      // Missing scheme in proxy, default to the requested URL's scheme.
      proxy = proto + '://' + proxy;
    }
    return proxy;
  }

  /**
   * Determines whether a given URL should be proxied.
   *
   * @param {string} hostname - The host name of the URL.
   * @param {number} port - The effective port of the URL.
   * @returns {boolean} Whether the given URL should be proxied.
   * @private
   */
  function shouldProxy(hostname, port) {
    var NO_PROXY =
      (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
    if (!NO_PROXY) {
      return true;  // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === '*') {
      return false;  // Never proxy if wildcard is set.
    }

    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
      if (!proxy) {
        return true;  // Skip zero-length hosts.
      }
      var parsedProxy = proxy.match(/^(.+):(\d+)$/);
      var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
      var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
      if (parsedProxyPort && parsedProxyPort !== port) {
        return true;  // Skip if ports don't match.
      }

      if (!/^[.*]/.test(parsedProxyHostname)) {
        // No wildcards, so stop proxying if there is an exact match.
        return hostname !== parsedProxyHostname;
      }

      if (parsedProxyHostname.charAt(0) === '*') {
        // Remove leading wildcard.
        parsedProxyHostname = parsedProxyHostname.slice(1);
      }
      // Stop proxying if the hostname ends with the no_proxy host.
      return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
  }

  /**
   * Get the value for an environment variable.
   *
   * @param {string} key - The name of the environment variable.
   * @return {string} The value of the environment variable.
   * @private
   */
  function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
  }

  var getProxyForUrl_1 = getProxyForUrl;

  var followRedirectsExports = {};
  var followRedirects = {
    get exports(){ return followRedirectsExports; },
    set exports(v){ followRedirectsExports = v; },
  };

  var srcExports = {};
  var src = {
    get exports(){ return srcExports; },
    set exports(v){ srcExports = v; },
  };

  var browserExports = {};
  var browser = {
    get exports(){ return browserExports; },
    set exports(v){ browserExports = v; },
  };

  /**
   * Helpers.
   */

  var ms;
  var hasRequiredMs;

  function requireMs () {
  	if (hasRequiredMs) return ms;
  	hasRequiredMs = 1;
  	var s = 1000;
  	var m = s * 60;
  	var h = m * 60;
  	var d = h * 24;
  	var w = d * 7;
  	var y = d * 365.25;

  	/**
  	 * Parse or format the given `val`.
  	 *
  	 * Options:
  	 *
  	 *  - `long` verbose formatting [false]
  	 *
  	 * @param {String|Number} val
  	 * @param {Object} [options]
  	 * @throws {Error} throw an error if val is not a non-empty string or a number
  	 * @return {String|Number}
  	 * @api public
  	 */

  	ms = function(val, options) {
  	  options = options || {};
  	  var type = typeof val;
  	  if (type === 'string' && val.length > 0) {
  	    return parse(val);
  	  } else if (type === 'number' && isFinite(val)) {
  	    return options.long ? fmtLong(val) : fmtShort(val);
  	  }
  	  throw new Error(
  	    'val is not a non-empty string or a valid number. val=' +
  	      JSON.stringify(val)
  	  );
  	};

  	/**
  	 * Parse the given `str` and return milliseconds.
  	 *
  	 * @param {String} str
  	 * @return {Number}
  	 * @api private
  	 */

  	function parse(str) {
  	  str = String(str);
  	  if (str.length > 100) {
  	    return;
  	  }
  	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
  	    str
  	  );
  	  if (!match) {
  	    return;
  	  }
  	  var n = parseFloat(match[1]);
  	  var type = (match[2] || 'ms').toLowerCase();
  	  switch (type) {
  	    case 'years':
  	    case 'year':
  	    case 'yrs':
  	    case 'yr':
  	    case 'y':
  	      return n * y;
  	    case 'weeks':
  	    case 'week':
  	    case 'w':
  	      return n * w;
  	    case 'days':
  	    case 'day':
  	    case 'd':
  	      return n * d;
  	    case 'hours':
  	    case 'hour':
  	    case 'hrs':
  	    case 'hr':
  	    case 'h':
  	      return n * h;
  	    case 'minutes':
  	    case 'minute':
  	    case 'mins':
  	    case 'min':
  	    case 'm':
  	      return n * m;
  	    case 'seconds':
  	    case 'second':
  	    case 'secs':
  	    case 'sec':
  	    case 's':
  	      return n * s;
  	    case 'milliseconds':
  	    case 'millisecond':
  	    case 'msecs':
  	    case 'msec':
  	    case 'ms':
  	      return n;
  	    default:
  	      return undefined;
  	  }
  	}

  	/**
  	 * Short format for `ms`.
  	 *
  	 * @param {Number} ms
  	 * @return {String}
  	 * @api private
  	 */

  	function fmtShort(ms) {
  	  var msAbs = Math.abs(ms);
  	  if (msAbs >= d) {
  	    return Math.round(ms / d) + 'd';
  	  }
  	  if (msAbs >= h) {
  	    return Math.round(ms / h) + 'h';
  	  }
  	  if (msAbs >= m) {
  	    return Math.round(ms / m) + 'm';
  	  }
  	  if (msAbs >= s) {
  	    return Math.round(ms / s) + 's';
  	  }
  	  return ms + 'ms';
  	}

  	/**
  	 * Long format for `ms`.
  	 *
  	 * @param {Number} ms
  	 * @return {String}
  	 * @api private
  	 */

  	function fmtLong(ms) {
  	  var msAbs = Math.abs(ms);
  	  if (msAbs >= d) {
  	    return plural(ms, msAbs, d, 'day');
  	  }
  	  if (msAbs >= h) {
  	    return plural(ms, msAbs, h, 'hour');
  	  }
  	  if (msAbs >= m) {
  	    return plural(ms, msAbs, m, 'minute');
  	  }
  	  if (msAbs >= s) {
  	    return plural(ms, msAbs, s, 'second');
  	  }
  	  return ms + ' ms';
  	}

  	/**
  	 * Pluralization helper.
  	 */

  	function plural(ms, msAbs, n, name) {
  	  var isPlural = msAbs >= n * 1.5;
  	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  	}
  	return ms;
  }

  var common;
  var hasRequiredCommon;

  function requireCommon () {
  	if (hasRequiredCommon) return common;
  	hasRequiredCommon = 1;
  	/**
  	 * This is the common logic for both the Node.js and web browser
  	 * implementations of `debug()`.
  	 */

  	function setup(env) {
  		createDebug.debug = createDebug;
  		createDebug.default = createDebug;
  		createDebug.coerce = coerce;
  		createDebug.disable = disable;
  		createDebug.enable = enable;
  		createDebug.enabled = enabled;
  		createDebug.humanize = requireMs();
  		createDebug.destroy = destroy;

  		Object.keys(env).forEach(key => {
  			createDebug[key] = env[key];
  		});

  		/**
  		* The currently active debug mode names, and names to skip.
  		*/

  		createDebug.names = [];
  		createDebug.skips = [];

  		/**
  		* Map of special "%n" handling functions, for the debug "format" argument.
  		*
  		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  		*/
  		createDebug.formatters = {};

  		/**
  		* Selects a color for a debug namespace
  		* @param {String} namespace The namespace string for the debug instance to be colored
  		* @return {Number|String} An ANSI color code for the given namespace
  		* @api private
  		*/
  		function selectColor(namespace) {
  			let hash = 0;

  			for (let i = 0; i < namespace.length; i++) {
  				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
  				hash |= 0; // Convert to 32bit integer
  			}

  			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  		}
  		createDebug.selectColor = selectColor;

  		/**
  		* Create a debugger with the given `namespace`.
  		*
  		* @param {String} namespace
  		* @return {Function}
  		* @api public
  		*/
  		function createDebug(namespace) {
  			let prevTime;
  			let enableOverride = null;
  			let namespacesCache;
  			let enabledCache;

  			function debug(...args) {
  				// Disabled?
  				if (!debug.enabled) {
  					return;
  				}

  				const self = debug;

  				// Set `diff` timestamp
  				const curr = Number(new Date());
  				const ms = curr - (prevTime || curr);
  				self.diff = ms;
  				self.prev = prevTime;
  				self.curr = curr;
  				prevTime = curr;

  				args[0] = createDebug.coerce(args[0]);

  				if (typeof args[0] !== 'string') {
  					// Anything else let's inspect with %O
  					args.unshift('%O');
  				}

  				// Apply any `formatters` transformations
  				let index = 0;
  				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
  					// If we encounter an escaped % then don't increase the array index
  					if (match === '%%') {
  						return '%';
  					}
  					index++;
  					const formatter = createDebug.formatters[format];
  					if (typeof formatter === 'function') {
  						const val = args[index];
  						match = formatter.call(self, val);

  						// Now we need to remove `args[index]` since it's inlined in the `format`
  						args.splice(index, 1);
  						index--;
  					}
  					return match;
  				});

  				// Apply env-specific formatting (colors, etc.)
  				createDebug.formatArgs.call(self, args);

  				const logFn = self.log || createDebug.log;
  				logFn.apply(self, args);
  			}

  			debug.namespace = namespace;
  			debug.useColors = createDebug.useColors();
  			debug.color = createDebug.selectColor(namespace);
  			debug.extend = extend;
  			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

  			Object.defineProperty(debug, 'enabled', {
  				enumerable: true,
  				configurable: false,
  				get: () => {
  					if (enableOverride !== null) {
  						return enableOverride;
  					}
  					if (namespacesCache !== createDebug.namespaces) {
  						namespacesCache = createDebug.namespaces;
  						enabledCache = createDebug.enabled(namespace);
  					}

  					return enabledCache;
  				},
  				set: v => {
  					enableOverride = v;
  				}
  			});

  			// Env-specific initialization logic for debug instances
  			if (typeof createDebug.init === 'function') {
  				createDebug.init(debug);
  			}

  			return debug;
  		}

  		function extend(namespace, delimiter) {
  			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  			newDebug.log = this.log;
  			return newDebug;
  		}

  		/**
  		* Enables a debug mode by namespaces. This can include modes
  		* separated by a colon and wildcards.
  		*
  		* @param {String} namespaces
  		* @api public
  		*/
  		function enable(namespaces) {
  			createDebug.save(namespaces);
  			createDebug.namespaces = namespaces;

  			createDebug.names = [];
  			createDebug.skips = [];

  			let i;
  			const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  			const len = split.length;

  			for (i = 0; i < len; i++) {
  				if (!split[i]) {
  					// ignore empty strings
  					continue;
  				}

  				namespaces = split[i].replace(/\*/g, '.*?');

  				if (namespaces[0] === '-') {
  					createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
  				} else {
  					createDebug.names.push(new RegExp('^' + namespaces + '$'));
  				}
  			}
  		}

  		/**
  		* Disable debug output.
  		*
  		* @return {String} namespaces
  		* @api public
  		*/
  		function disable() {
  			const namespaces = [
  				...createDebug.names.map(toNamespace),
  				...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
  			].join(',');
  			createDebug.enable('');
  			return namespaces;
  		}

  		/**
  		* Returns true if the given mode name is enabled, false otherwise.
  		*
  		* @param {String} name
  		* @return {Boolean}
  		* @api public
  		*/
  		function enabled(name) {
  			if (name[name.length - 1] === '*') {
  				return true;
  			}

  			let i;
  			let len;

  			for (i = 0, len = createDebug.skips.length; i < len; i++) {
  				if (createDebug.skips[i].test(name)) {
  					return false;
  				}
  			}

  			for (i = 0, len = createDebug.names.length; i < len; i++) {
  				if (createDebug.names[i].test(name)) {
  					return true;
  				}
  			}

  			return false;
  		}

  		/**
  		* Convert regexp to namespace
  		*
  		* @param {RegExp} regxep
  		* @return {String} namespace
  		* @api private
  		*/
  		function toNamespace(regexp) {
  			return regexp.toString()
  				.substring(2, regexp.toString().length - 2)
  				.replace(/\.\*\?$/, '*');
  		}

  		/**
  		* Coerce `val`.
  		*
  		* @param {Mixed} val
  		* @return {Mixed}
  		* @api private
  		*/
  		function coerce(val) {
  			if (val instanceof Error) {
  				return val.stack || val.message;
  			}
  			return val;
  		}

  		/**
  		* XXX DO NOT USE. This is a temporary stub function.
  		* XXX It WILL be removed in the next major release.
  		*/
  		function destroy() {
  			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  		}

  		createDebug.enable(createDebug.load());

  		return createDebug;
  	}

  	common = setup;
  	return common;
  }

  /* eslint-env browser */

  var hasRequiredBrowser;

  function requireBrowser () {
  	if (hasRequiredBrowser) return browserExports;
  	hasRequiredBrowser = 1;
  	(function (module, exports) {
  		/**
  		 * This is the web browser implementation of `debug()`.
  		 */

  		exports.formatArgs = formatArgs;
  		exports.save = save;
  		exports.load = load;
  		exports.useColors = useColors;
  		exports.storage = localstorage();
  		exports.destroy = (() => {
  			let warned = false;

  			return () => {
  				if (!warned) {
  					warned = true;
  					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  				}
  			};
  		})();

  		/**
  		 * Colors.
  		 */

  		exports.colors = [
  			'#0000CC',
  			'#0000FF',
  			'#0033CC',
  			'#0033FF',
  			'#0066CC',
  			'#0066FF',
  			'#0099CC',
  			'#0099FF',
  			'#00CC00',
  			'#00CC33',
  			'#00CC66',
  			'#00CC99',
  			'#00CCCC',
  			'#00CCFF',
  			'#3300CC',
  			'#3300FF',
  			'#3333CC',
  			'#3333FF',
  			'#3366CC',
  			'#3366FF',
  			'#3399CC',
  			'#3399FF',
  			'#33CC00',
  			'#33CC33',
  			'#33CC66',
  			'#33CC99',
  			'#33CCCC',
  			'#33CCFF',
  			'#6600CC',
  			'#6600FF',
  			'#6633CC',
  			'#6633FF',
  			'#66CC00',
  			'#66CC33',
  			'#9900CC',
  			'#9900FF',
  			'#9933CC',
  			'#9933FF',
  			'#99CC00',
  			'#99CC33',
  			'#CC0000',
  			'#CC0033',
  			'#CC0066',
  			'#CC0099',
  			'#CC00CC',
  			'#CC00FF',
  			'#CC3300',
  			'#CC3333',
  			'#CC3366',
  			'#CC3399',
  			'#CC33CC',
  			'#CC33FF',
  			'#CC6600',
  			'#CC6633',
  			'#CC9900',
  			'#CC9933',
  			'#CCCC00',
  			'#CCCC33',
  			'#FF0000',
  			'#FF0033',
  			'#FF0066',
  			'#FF0099',
  			'#FF00CC',
  			'#FF00FF',
  			'#FF3300',
  			'#FF3333',
  			'#FF3366',
  			'#FF3399',
  			'#FF33CC',
  			'#FF33FF',
  			'#FF6600',
  			'#FF6633',
  			'#FF9900',
  			'#FF9933',
  			'#FFCC00',
  			'#FFCC33'
  		];

  		/**
  		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
  		 * and the Firebug extension (any Firefox version) are known
  		 * to support "%c" CSS customizations.
  		 *
  		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
  		 */

  		// eslint-disable-next-line complexity
  		function useColors() {
  			// NB: In an Electron preload script, document will be defined but not fully
  			// initialized. Since we know we're in Chrome, we'll just detect this case
  			// explicitly
  			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
  				return true;
  			}

  			// Internet Explorer and Edge do not support colors.
  			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
  				return false;
  			}

  			// Is webkit? http://stackoverflow.com/a/16459606/376773
  			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
  				// Is firebug? http://stackoverflow.com/a/398120/376773
  				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
  				// Is firefox >= v31?
  				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
  				// Double check webkit in userAgent just in case we are in a worker
  				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  		}

  		/**
  		 * Colorize log arguments if enabled.
  		 *
  		 * @api public
  		 */

  		function formatArgs(args) {
  			args[0] = (this.useColors ? '%c' : '') +
  				this.namespace +
  				(this.useColors ? ' %c' : ' ') +
  				args[0] +
  				(this.useColors ? '%c ' : ' ') +
  				'+' + module.exports.humanize(this.diff);

  			if (!this.useColors) {
  				return;
  			}

  			const c = 'color: ' + this.color;
  			args.splice(1, 0, c, 'color: inherit');

  			// The final "%c" is somewhat tricky, because there could be other
  			// arguments passed either before or after the %c, so we need to
  			// figure out the correct index to insert the CSS into
  			let index = 0;
  			let lastC = 0;
  			args[0].replace(/%[a-zA-Z%]/g, match => {
  				if (match === '%%') {
  					return;
  				}
  				index++;
  				if (match === '%c') {
  					// We only are interested in the *last* %c
  					// (the user may have provided their own)
  					lastC = index;
  				}
  			});

  			args.splice(lastC, 0, c);
  		}

  		/**
  		 * Invokes `console.debug()` when available.
  		 * No-op when `console.debug` is not a "function".
  		 * If `console.debug` is not available, falls back
  		 * to `console.log`.
  		 *
  		 * @api public
  		 */
  		exports.log = console.debug || console.log || (() => {});

  		/**
  		 * Save `namespaces`.
  		 *
  		 * @param {String} namespaces
  		 * @api private
  		 */
  		function save(namespaces) {
  			try {
  				if (namespaces) {
  					exports.storage.setItem('debug', namespaces);
  				} else {
  					exports.storage.removeItem('debug');
  				}
  			} catch (error) {
  				// Swallow
  				// XXX (@Qix-) should we be logging these?
  			}
  		}

  		/**
  		 * Load `namespaces`.
  		 *
  		 * @return {String} returns the previously persisted debug modes
  		 * @api private
  		 */
  		function load() {
  			let r;
  			try {
  				r = exports.storage.getItem('debug');
  			} catch (error) {
  				// Swallow
  				// XXX (@Qix-) should we be logging these?
  			}

  			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  			if (!r && typeof process !== 'undefined' && 'env' in process) {
  				r = process.env.DEBUG;
  			}

  			return r;
  		}

  		/**
  		 * Localstorage attempts to return the localstorage.
  		 *
  		 * This is necessary because safari throws
  		 * when a user disables cookies/localstorage
  		 * and you attempt to access it.
  		 *
  		 * @return {LocalStorage}
  		 * @api private
  		 */

  		function localstorage() {
  			try {
  				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
  				// The Browser also has localStorage in the global context.
  				return localStorage;
  			} catch (error) {
  				// Swallow
  				// XXX (@Qix-) should we be logging these?
  			}
  		}

  		module.exports = requireCommon()(exports);

  		const {formatters} = module.exports;

  		/**
  		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
  		 */

  		formatters.j = function (v) {
  			try {
  				return JSON.stringify(v);
  			} catch (error) {
  				return '[UnexpectedJSONParseError]: ' + error.message;
  			}
  		};
  } (browser, browserExports));
  	return browserExports;
  }

  var nodeExports = {};
  var node = {
    get exports(){ return nodeExports; },
    set exports(v){ nodeExports = v; },
  };

  var hasFlag;
  var hasRequiredHasFlag;

  function requireHasFlag () {
  	if (hasRequiredHasFlag) return hasFlag;
  	hasRequiredHasFlag = 1;

  	hasFlag = (flag, argv = process.argv) => {
  		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
  		const position = argv.indexOf(prefix + flag);
  		const terminatorPosition = argv.indexOf('--');
  		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  	};
  	return hasFlag;
  }

  var supportsColor_1;
  var hasRequiredSupportsColor;

  function requireSupportsColor () {
  	if (hasRequiredSupportsColor) return supportsColor_1;
  	hasRequiredSupportsColor = 1;
  	const os = require$$0__default$1["default"];
  	const tty = require$$1__default$2["default"];
  	const hasFlag = requireHasFlag();

  	const {env} = process;

  	let forceColor;
  	if (hasFlag('no-color') ||
  		hasFlag('no-colors') ||
  		hasFlag('color=false') ||
  		hasFlag('color=never')) {
  		forceColor = 0;
  	} else if (hasFlag('color') ||
  		hasFlag('colors') ||
  		hasFlag('color=true') ||
  		hasFlag('color=always')) {
  		forceColor = 1;
  	}

  	if ('FORCE_COLOR' in env) {
  		if (env.FORCE_COLOR === 'true') {
  			forceColor = 1;
  		} else if (env.FORCE_COLOR === 'false') {
  			forceColor = 0;
  		} else {
  			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
  		}
  	}

  	function translateLevel(level) {
  		if (level === 0) {
  			return false;
  		}

  		return {
  			level,
  			hasBasic: true,
  			has256: level >= 2,
  			has16m: level >= 3
  		};
  	}

  	function supportsColor(haveStream, streamIsTTY) {
  		if (forceColor === 0) {
  			return 0;
  		}

  		if (hasFlag('color=16m') ||
  			hasFlag('color=full') ||
  			hasFlag('color=truecolor')) {
  			return 3;
  		}

  		if (hasFlag('color=256')) {
  			return 2;
  		}

  		if (haveStream && !streamIsTTY && forceColor === undefined) {
  			return 0;
  		}

  		const min = forceColor || 0;

  		if (env.TERM === 'dumb') {
  			return min;
  		}

  		if (process.platform === 'win32') {
  			// Windows 10 build 10586 is the first Windows release that supports 256 colors.
  			// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
  			const osRelease = os.release().split('.');
  			if (
  				Number(osRelease[0]) >= 10 &&
  				Number(osRelease[2]) >= 10586
  			) {
  				return Number(osRelease[2]) >= 14931 ? 3 : 2;
  			}

  			return 1;
  		}

  		if ('CI' in env) {
  			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
  				return 1;
  			}

  			return min;
  		}

  		if ('TEAMCITY_VERSION' in env) {
  			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  		}

  		if (env.COLORTERM === 'truecolor') {
  			return 3;
  		}

  		if ('TERM_PROGRAM' in env) {
  			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

  			switch (env.TERM_PROGRAM) {
  				case 'iTerm.app':
  					return version >= 3 ? 3 : 2;
  				case 'Apple_Terminal':
  					return 2;
  				// No default
  			}
  		}

  		if (/-256(color)?$/i.test(env.TERM)) {
  			return 2;
  		}

  		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
  			return 1;
  		}

  		if ('COLORTERM' in env) {
  			return 1;
  		}

  		return min;
  	}

  	function getSupportLevel(stream) {
  		const level = supportsColor(stream, stream && stream.isTTY);
  		return translateLevel(level);
  	}

  	supportsColor_1 = {
  		supportsColor: getSupportLevel,
  		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
  		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  	};
  	return supportsColor_1;
  }

  /**
   * Module dependencies.
   */

  var hasRequiredNode;

  function requireNode () {
  	if (hasRequiredNode) return nodeExports;
  	hasRequiredNode = 1;
  	(function (module, exports) {
  		const tty = require$$1__default$2["default"];
  		const util = require$$1__default["default"];

  		/**
  		 * This is the Node.js implementation of `debug()`.
  		 */

  		exports.init = init;
  		exports.log = log;
  		exports.formatArgs = formatArgs;
  		exports.save = save;
  		exports.load = load;
  		exports.useColors = useColors;
  		exports.destroy = util.deprecate(
  			() => {},
  			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
  		);

  		/**
  		 * Colors.
  		 */

  		exports.colors = [6, 2, 3, 4, 5, 1];

  		try {
  			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
  			// eslint-disable-next-line import/no-extraneous-dependencies
  			const supportsColor = requireSupportsColor();

  			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
  				exports.colors = [
  					20,
  					21,
  					26,
  					27,
  					32,
  					33,
  					38,
  					39,
  					40,
  					41,
  					42,
  					43,
  					44,
  					45,
  					56,
  					57,
  					62,
  					63,
  					68,
  					69,
  					74,
  					75,
  					76,
  					77,
  					78,
  					79,
  					80,
  					81,
  					92,
  					93,
  					98,
  					99,
  					112,
  					113,
  					128,
  					129,
  					134,
  					135,
  					148,
  					149,
  					160,
  					161,
  					162,
  					163,
  					164,
  					165,
  					166,
  					167,
  					168,
  					169,
  					170,
  					171,
  					172,
  					173,
  					178,
  					179,
  					184,
  					185,
  					196,
  					197,
  					198,
  					199,
  					200,
  					201,
  					202,
  					203,
  					204,
  					205,
  					206,
  					207,
  					208,
  					209,
  					214,
  					215,
  					220,
  					221
  				];
  			}
  		} catch (error) {
  			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
  		}

  		/**
  		 * Build up the default `inspectOpts` object from the environment variables.
  		 *
  		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
  		 */

  		exports.inspectOpts = Object.keys(process.env).filter(key => {
  			return /^debug_/i.test(key);
  		}).reduce((obj, key) => {
  			// Camel-case
  			const prop = key
  				.substring(6)
  				.toLowerCase()
  				.replace(/_([a-z])/g, (_, k) => {
  					return k.toUpperCase();
  				});

  			// Coerce string value into JS value
  			let val = process.env[key];
  			if (/^(yes|on|true|enabled)$/i.test(val)) {
  				val = true;
  			} else if (/^(no|off|false|disabled)$/i.test(val)) {
  				val = false;
  			} else if (val === 'null') {
  				val = null;
  			} else {
  				val = Number(val);
  			}

  			obj[prop] = val;
  			return obj;
  		}, {});

  		/**
  		 * Is stdout a TTY? Colored output is enabled when `true`.
  		 */

  		function useColors() {
  			return 'colors' in exports.inspectOpts ?
  				Boolean(exports.inspectOpts.colors) :
  				tty.isatty(process.stderr.fd);
  		}

  		/**
  		 * Adds ANSI color escape codes if enabled.
  		 *
  		 * @api public
  		 */

  		function formatArgs(args) {
  			const {namespace: name, useColors} = this;

  			if (useColors) {
  				const c = this.color;
  				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
  				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

  				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
  				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
  			} else {
  				args[0] = getDate() + name + ' ' + args[0];
  			}
  		}

  		function getDate() {
  			if (exports.inspectOpts.hideDate) {
  				return '';
  			}
  			return new Date().toISOString() + ' ';
  		}

  		/**
  		 * Invokes `util.format()` with the specified arguments and writes to stderr.
  		 */

  		function log(...args) {
  			return process.stderr.write(util.format(...args) + '\n');
  		}

  		/**
  		 * Save `namespaces`.
  		 *
  		 * @param {String} namespaces
  		 * @api private
  		 */
  		function save(namespaces) {
  			if (namespaces) {
  				process.env.DEBUG = namespaces;
  			} else {
  				// If you set a process.env field to null or undefined, it gets cast to the
  				// string 'null' or 'undefined'. Just delete instead.
  				delete process.env.DEBUG;
  			}
  		}

  		/**
  		 * Load `namespaces`.
  		 *
  		 * @return {String} returns the previously persisted debug modes
  		 * @api private
  		 */

  		function load() {
  			return process.env.DEBUG;
  		}

  		/**
  		 * Init logic for `debug` instances.
  		 *
  		 * Create a new `inspectOpts` object in case `useColors` is set
  		 * differently for a particular `debug` instance.
  		 */

  		function init(debug) {
  			debug.inspectOpts = {};

  			const keys = Object.keys(exports.inspectOpts);
  			for (let i = 0; i < keys.length; i++) {
  				debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  			}
  		}

  		module.exports = requireCommon()(exports);

  		const {formatters} = module.exports;

  		/**
  		 * Map %o to `util.inspect()`, all on a single line.
  		 */

  		formatters.o = function (v) {
  			this.inspectOpts.colors = this.useColors;
  			return util.inspect(v, this.inspectOpts)
  				.split('\n')
  				.map(str => str.trim())
  				.join(' ');
  		};

  		/**
  		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
  		 */

  		formatters.O = function (v) {
  			this.inspectOpts.colors = this.useColors;
  			return util.inspect(v, this.inspectOpts);
  		};
  } (node, nodeExports));
  	return nodeExports;
  }

  /**
   * Detect Electron renderer / nwjs process, which is node, but we should
   * treat as a browser.
   */

  var hasRequiredSrc;

  function requireSrc () {
  	if (hasRequiredSrc) return srcExports;
  	hasRequiredSrc = 1;
  	(function (module) {
  		if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  			module.exports = requireBrowser();
  		} else {
  			module.exports = requireNode();
  		}
  } (src));
  	return srcExports;
  }

  var debug$1;

  var debug_1 = function () {
    if (!debug$1) {
      try {
        /* eslint global-require: off */
        debug$1 = requireSrc()("follow-redirects");
      }
      catch (error) { /* */ }
      if (typeof debug$1 !== "function") {
        debug$1 = function () { /* */ };
      }
    }
    debug$1.apply(null, arguments);
  };

  var url = require$$0__default["default"];
  var URL$1 = url.URL;
  var http = require$$3__default["default"];
  var https = require$$4__default["default"];
  var Writable = stream__default["default"].Writable;
  var assert = require$$4__default$1["default"];
  var debug = debug_1;

  // Create handlers that pass events from native requests
  var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
  var eventHandlers = Object.create(null);
  events.forEach(function (event) {
    eventHandlers[event] = function (arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });

  var InvalidUrlError = createErrorType(
    "ERR_INVALID_URL",
    "Invalid URL",
    TypeError
  );
  // Error types with codes
  var RedirectionError = createErrorType(
    "ERR_FR_REDIRECTION_FAILURE",
    "Redirected request failed"
  );
  var TooManyRedirectsError = createErrorType(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded"
  );
  var MaxBodyLengthExceededError = createErrorType(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  );
  var WriteAfterEndError = createErrorType(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  );

  // An HTTP(S) request that can be redirected
  function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];

    // Attach a callback if passed
    if (responseCallback) {
      this.on("response", responseCallback);
    }

    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function (response) {
      self._processResponse(response);
    };

    // Perform the first request
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);

  RedirectableRequest.prototype.abort = function () {
    abortRequest(this._currentRequest);
    this.emit("abort");
  };

  // Writes buffered data to the current native request
  RedirectableRequest.prototype.write = function (data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
      throw new WriteAfterEndError();
    }

    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }

    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({ data: data, encoding: encoding });
      this._currentRequest.write(data, encoding, callback);
    }
    // Error when we exceed the maximum body length
    else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };

  // Ends the current native request
  RedirectableRequest.prototype.end = function (data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
      callback = data;
      data = encoding = null;
    }
    else if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }

    // Write data if needed and end
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    }
    else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function () {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };

  // Sets a header value on the current native request
  RedirectableRequest.prototype.setHeader = function (name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };

  // Clears a header value on the current native request
  RedirectableRequest.prototype.removeHeader = function (name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };

  // Global timeout for all underlying requests
  RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
    var self = this;

    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
      socket.setTimeout(msecs);
      socket.removeListener("timeout", socket.destroy);
      socket.addListener("timeout", socket.destroy);
    }

    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function () {
        self.emit("timeout");
        clearTimer();
      }, msecs);
      destroyOnTimeout(socket);
    }

    // Stops a timeout from triggering
    function clearTimer() {
      // Clear the timeout
      if (self._timeout) {
        clearTimeout(self._timeout);
        self._timeout = null;
      }

      // Clean up all attached listeners
      self.removeListener("abort", clearTimer);
      self.removeListener("error", clearTimer);
      self.removeListener("response", clearTimer);
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!self.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }

    // Attach callback if passed
    if (callback) {
      this.on("timeout", callback);
    }

    // Start the timer if or when the socket is opened
    if (this.socket) {
      startTimer(this.socket);
    }
    else {
      this._currentRequest.once("socket", startTimer);
    }

    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);

    return this;
  };

  // Proxy all other public ClientRequest methods
  [
    "flushHeaders", "getHeader",
    "setNoDelay", "setSocketKeepAlive",
  ].forEach(function (method) {
    RedirectableRequest.prototype[method] = function (a, b) {
      return this._currentRequest[method](a, b);
    };
  });

  // Proxy all public ClientRequest properties
  ["aborted", "connection", "socket"].forEach(function (property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function () { return this._currentRequest[property]; },
    });
  });

  RedirectableRequest.prototype._sanitizeOptions = function (options) {
    // Ensure headers are always present
    if (!options.headers) {
      options.headers = {};
    }

    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
      // Use hostname if set, because it has precedence
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }

    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      }
      else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };


  // Executes the next native request (initial or redirect)
  RedirectableRequest.prototype._performRequest = function () {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new TypeError("Unsupported protocol " + protocol));
      return;
    }

    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
      var scheme = protocol.slice(0, -1);
      this._options.agent = this._options.agents[scheme];
    }

    // Create the native request and set up its event handlers
    var request = this._currentRequest =
          nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events) {
      request.on(event, eventHandlers[event]);
    }

    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ?
      url.format(this._options) :
      // When making a request to a proxy, […]
      // a client MUST send the target URI in absolute-form […].
      this._options.path;

    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
      // Write the request entity and end
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        // Only write if this request has not been redirected yet
        /* istanbul ignore else */
        if (request === self._currentRequest) {
          // Report any write errors
          /* istanbul ignore if */
          if (error) {
            self.emit("error", error);
          }
          // Write the next buffer if there are still left
          else if (i < buffers.length) {
            var buffer = buffers[i++];
            /* istanbul ignore else */
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          }
          // End the request if `end` has been called on us
          else if (self._ended) {
            request.end();
          }
        }
      }());
    }
  };

  // Processes a response from the current native request
  RedirectableRequest.prototype._processResponse = function (response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode: statusCode,
      });
    }

    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.

    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false ||
        statusCode < 300 || statusCode >= 400) {
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);

      // Clean up
      this._requestBodyBuffers = [];
      return;
    }

    // The response is a redirect, so abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
      requestHeaders = Object.assign({
        // The Host header was set by nativeProtocol.request
        Host: response.req.getHeader("host"),
      }, this._options.headers);
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = url.parse(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
      url.format(Object.assign(currentUrlParts, { host: currentHost }));

    // Determine the URL of the redirection
    var redirectUrl;
    try {
      redirectUrl = url.resolve(currentUrl, location);
    }
    catch (cause) {
      this.emit("error", new RedirectionError({ cause: cause }));
      return;
    }

    // Create the redirected request
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrlParts.protocol !== currentUrlParts.protocol &&
       redirectUrlParts.protocol !== "https:" ||
       redirectUrlParts.host !== currentHost &&
       !isSubdomain(redirectUrlParts.host, currentHost)) {
      removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
      var responseDetails = {
        headers: response.headers,
        statusCode: statusCode,
      };
      var requestDetails = {
        url: currentUrl,
        method: method,
        headers: requestHeaders,
      };
      try {
        beforeRedirect(this._options, responseDetails, requestDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      this.emit("error", new RedirectionError({ cause: cause }));
    }
  };

  // Wraps the key/value object of protocols with redirect functionality
  function wrap(protocols) {
    // Default settings
    var exports = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024,
    };

    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function (scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

      // Executes a request, following redirects
      function request(input, options, callback) {
        // Parse parameters
        if (isString(input)) {
          var parsed;
          try {
            parsed = urlToOptions(new URL$1(input));
          }
          catch (err) {
            /* istanbul ignore next */
            parsed = url.parse(input);
          }
          if (!isString(parsed.protocol)) {
            throw new InvalidUrlError({ input });
          }
          input = parsed;
        }
        else if (URL$1 && (input instanceof URL$1)) {
          input = urlToOptions(input);
        }
        else {
          callback = options;
          options = input;
          input = { protocol: protocol };
        }
        if (isFunction(options)) {
          callback = options;
          options = null;
        }

        // Set defaults
        options = Object.assign({
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, input, options);
        options.nativeProtocols = nativeProtocols;
        if (!isString(options.host) && !isString(options.hostname)) {
          options.hostname = "::1";
        }

        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      }

      // Executes a GET request, following redirects
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }

      // Expose the properties on the wrapped protocol
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: true, enumerable: true, writable: true },
        get: { value: get, configurable: true, enumerable: true, writable: true },
      });
    });
    return exports;
  }

  /* istanbul ignore next */
  function noop() { /* empty */ }

  // from https://github.com/nodejs/node/blob/master/lib/internal/url.js
  function urlToOptions(urlObject) {
    var options = {
      protocol: urlObject.protocol,
      hostname: urlObject.hostname.startsWith("[") ?
        /* istanbul ignore next */
        urlObject.hostname.slice(1, -1) :
        urlObject.hostname,
      hash: urlObject.hash,
      search: urlObject.search,
      pathname: urlObject.pathname,
      path: urlObject.pathname + urlObject.search,
      href: urlObject.href,
    };
    if (urlObject.port !== "") {
      options.port = Number(urlObject.port);
    }
    return options;
  }

  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return (lastValue === null || typeof lastValue === "undefined") ?
      undefined : String(lastValue).trim();
  }

  function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
      Error.captureStackTrace(this, this.constructor);
      Object.assign(this, properties || {});
      this.code = code;
      this.message = this.cause ? message + ": " + this.cause.message : message;
    }

    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    return CustomError;
  }

  function abortRequest(request) {
    for (var event of events) {
      request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.abort();
  }

  function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
  }

  function isString(value) {
    return typeof value === "string" || value instanceof String;
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isBuffer(value) {
    return typeof value === "object" && ("length" in value);
  }

  // Exports
  followRedirects.exports = wrap({ http: http, https: https });
  followRedirectsExports.wrap = wrap;

  const VERSION = "1.4.0";

  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
  }

  const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

  /**
   * Parse data uri to a Buffer or Blob
   *
   * @param {String} uri
   * @param {?Boolean} asBlob
   * @param {?Object} options
   * @param {?Function} options.Blob
   *
   * @returns {Buffer|Blob}
   */
  function fromDataURI(uri, asBlob, options) {
    const _Blob = options && options.Blob || platform.classes.Blob;
    const protocol = parseProtocol(uri);

    if (asBlob === undefined && _Blob) {
      asBlob = true;
    }

    if (protocol === 'data') {
      uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

      const match = DATA_URL_PATTERN.exec(uri);

      if (!match) {
        throw new AxiosError('Invalid URL', AxiosError.ERR_INVALID_URL);
      }

      const mime = match[1];
      const isBase64 = match[2];
      const body = match[3];
      const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

      if (asBlob) {
        if (!_Blob) {
          throw new AxiosError('Blob is not supported', AxiosError.ERR_NOT_SUPPORT);
        }

        return new _Blob([buffer], {type: mime});
      }

      return buffer;
    }

    throw new AxiosError('Unsupported protocol ' + protocol, AxiosError.ERR_NOT_SUPPORT);
  }

  /**
   * Throttle decorator
   * @param {Function} fn
   * @param {Number} freq
   * @return {Function}
   */
  function throttle(fn, freq) {
    let timestamp = 0;
    const threshold = 1000 / freq;
    let timer = null;
    return function throttled(force, args) {
      const now = Date.now();
      if (force || now - timestamp > threshold) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timestamp = now;
        return fn.apply(null, args);
      }
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          timestamp = Date.now();
          return fn.apply(null, args);
        }, threshold - (now - timestamp));
      }
    };
  }

  /**
   * Calculate data maxRate
   * @param {Number} [samplesCount= 10]
   * @param {Number} [min= 1000]
   * @returns {Function}
   */
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;

    min = min !== undefined ? min : 1000;

    return function push(chunkLength) {
      const now = Date.now();

      const startedAt = timestamps[tail];

      if (!firstSampleTS) {
        firstSampleTS = now;
      }

      bytes[head] = chunkLength;
      timestamps[head] = now;

      let i = tail;
      let bytesCount = 0;

      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }

      head = (head + 1) % samplesCount;

      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }

      if (now - firstSampleTS < min) {
        return;
      }

      const passed = startedAt && now - startedAt;

      return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
  }

  const kInternals = Symbol('internals');

  class AxiosTransformStream extends stream__default["default"].Transform{
    constructor(options) {
      options = utils.toFlatObject(options, {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15
      }, null, (prop, source) => {
        return !utils.isUndefined(source[prop]);
      });

      super({
        readableHighWaterMark: options.chunkSize
      });

      const self = this;

      const internals = this[kInternals] = {
        length: options.length,
        timeWindow: options.timeWindow,
        ticksRate: options.ticksRate,
        chunkSize: options.chunkSize,
        maxRate: options.maxRate,
        minChunkSize: options.minChunkSize,
        bytesSeen: 0,
        isCaptured: false,
        notifiedBytesLoaded: 0,
        ts: Date.now(),
        bytes: 0,
        onReadCallback: null
      };

      const _speedometer = speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);

      this.on('newListener', event => {
        if (event === 'progress') {
          if (!internals.isCaptured) {
            internals.isCaptured = true;
          }
        }
      });

      let bytesNotified = 0;

      internals.updateProgress = throttle(function throttledHandler() {
        const totalBytes = internals.length;
        const bytesTransferred = internals.bytesSeen;
        const progressBytes = bytesTransferred - bytesNotified;
        if (!progressBytes || self.destroyed) return;

        const rate = _speedometer(progressBytes);

        bytesNotified = bytesTransferred;

        process.nextTick(() => {
          self.emit('progress', {
            'loaded': bytesTransferred,
            'total': totalBytes,
            'progress': totalBytes ? (bytesTransferred / totalBytes) : undefined,
            'bytes': progressBytes,
            'rate': rate ? rate : undefined,
            'estimated': rate && totalBytes && bytesTransferred <= totalBytes ?
              (totalBytes - bytesTransferred) / rate : undefined
          });
        });
      }, internals.ticksRate);

      const onFinish = () => {
        internals.updateProgress(true);
      };

      this.once('end', onFinish);
      this.once('error', onFinish);
    }

    _read(size) {
      const internals = this[kInternals];

      if (internals.onReadCallback) {
        internals.onReadCallback();
      }

      return super._read(size);
    }

    _transform(chunk, encoding, callback) {
      const self = this;
      const internals = this[kInternals];
      const maxRate = internals.maxRate;

      const readableHighWaterMark = this.readableHighWaterMark;

      const timeWindow = internals.timeWindow;

      const divider = 1000 / timeWindow;
      const bytesThreshold = (maxRate / divider);
      const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

      function pushChunk(_chunk, _callback) {
        const bytes = Buffer.byteLength(_chunk);
        internals.bytesSeen += bytes;
        internals.bytes += bytes;

        if (internals.isCaptured) {
          internals.updateProgress();
        }

        if (self.push(_chunk)) {
          process.nextTick(_callback);
        } else {
          internals.onReadCallback = () => {
            internals.onReadCallback = null;
            process.nextTick(_callback);
          };
        }
      }

      const transformChunk = (_chunk, _callback) => {
        const chunkSize = Buffer.byteLength(_chunk);
        let chunkRemainder = null;
        let maxChunkSize = readableHighWaterMark;
        let bytesLeft;
        let passed = 0;

        if (maxRate) {
          const now = Date.now();

          if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
            internals.ts = now;
            bytesLeft = bytesThreshold - internals.bytes;
            internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
            passed = 0;
          }

          bytesLeft = bytesThreshold - internals.bytes;
        }

        if (maxRate) {
          if (bytesLeft <= 0) {
            // next time window
            return setTimeout(() => {
              _callback(null, _chunk);
            }, timeWindow - passed);
          }

          if (bytesLeft < maxChunkSize) {
            maxChunkSize = bytesLeft;
          }
        }

        if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
          chunkRemainder = _chunk.subarray(maxChunkSize);
          _chunk = _chunk.subarray(0, maxChunkSize);
        }

        pushChunk(_chunk, chunkRemainder ? () => {
          process.nextTick(_callback, null, chunkRemainder);
        } : _callback);
      };

      transformChunk(chunk, function transformNextChunk(err, _chunk) {
        if (err) {
          return callback(err);
        }

        if (_chunk) {
          transformChunk(_chunk, transformNextChunk);
        } else {
          callback(null);
        }
      });
    }

    setLength(length) {
      this[kInternals].length = +length;
      return this;
    }
  }

  const {asyncIterator} = Symbol;

  const readBlob = async function* (blob) {
    if (blob.stream) {
      yield* blob.stream();
    } else if (blob.arrayBuffer) {
      yield await blob.arrayBuffer();
    } else if (blob[asyncIterator]) {
      yield* blob[asyncIterator]();
    } else {
      yield blob;
    }
  };

  const BOUNDARY_ALPHABET = utils.ALPHABET.ALPHA_DIGIT + '-_';

  const textEncoder = new require$$1.TextEncoder();

  const CRLF = '\r\n';
  const CRLF_BYTES = textEncoder.encode(CRLF);
  const CRLF_BYTES_COUNT = 2;

  class FormDataPart {
    constructor(name, value) {
      const {escapeName} = this.constructor;
      const isStringValue = utils.isString(value);

      let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

      if (isStringValue) {
        value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
      } else {
        headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
      }

      this.headers = textEncoder.encode(headers + CRLF);

      this.contentLength = isStringValue ? value.byteLength : value.size;

      this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

      this.name = name;
      this.value = value;
    }

    async *encode(){
      yield this.headers;

      const {value} = this;

      if(utils.isTypedArray(value)) {
        yield value;
      } else {
        yield* readBlob(value);
      }

      yield CRLF_BYTES;
    }

    static escapeName(name) {
        return String(name).replace(/[\r\n"]/g, (match) => ({
          '\r' : '%0D',
          '\n' : '%0A',
          '"' : '%22',
        }[match]));
    }
  }

  const formDataToStream = (form, headersHandler, options) => {
    const {
      tag = 'form-data-boundary',
      size = 25,
      boundary = tag + '-' + utils.generateString(size, BOUNDARY_ALPHABET)
    } = options || {};

    if(!utils.isFormData(form)) {
      throw TypeError('FormData instance required');
    }

    if (boundary.length < 1 || boundary.length > 70) {
      throw Error('boundary must be 10-70 characters long')
    }

    const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
    const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF + CRLF);
    let contentLength = footerBytes.byteLength;

    const parts = Array.from(form.entries()).map(([name, value]) => {
      const part = new FormDataPart(name, value);
      contentLength += part.size;
      return part;
    });

    contentLength += boundaryBytes.byteLength * parts.length;

    contentLength = utils.toFiniteNumber(contentLength);

    const computedHeaders = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    };

    if (Number.isFinite(contentLength)) {
      computedHeaders['Content-Length'] = contentLength;
    }

    headersHandler && headersHandler(computedHeaders);

    return stream.Readable.from((async function *() {
      for(const part of parts) {
        yield boundaryBytes;
        yield* part.encode();
      }

      yield footerBytes;
    })());
  };

  class ZlibHeaderTransformStream extends stream__default["default"].Transform {
    __transform(chunk, encoding, callback) {
      this.push(chunk);
      callback();
    }

    _transform(chunk, encoding, callback) {
      if (chunk.length !== 0) {
        this._transform = this.__transform;

        // Add Default Compression headers if no zlib headers are present
        if (chunk[0] !== 120) { // Hex: 78
          const header = Buffer.alloc(2);
          header[0] = 120; // Hex: 78
          header[1] = 156; // Hex: 9C 
          this.push(header, encoding);
        }
      }

      this.__transform(chunk, encoding, callback);
    }
  }

  const callbackify = (fn, reducer) => {
    return utils.isAsyncFn(fn) ? function (...args) {
      const cb = args.pop();
      fn.apply(this, args).then((value) => {
        try {
          reducer ? cb(null, ...reducer(value)) : cb(null, value);
        } catch (err) {
          cb(err);
        }
      }, cb);
    } : fn;
  };

  const zlibOptions = {
    flush: zlib__default["default"].constants.Z_SYNC_FLUSH,
    finishFlush: zlib__default["default"].constants.Z_SYNC_FLUSH
  };

  const brotliOptions = {
    flush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH,
    finishFlush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH
  };

  const isBrotliSupported = utils.isFunction(zlib__default["default"].createBrotliDecompress);

  const {http: httpFollow, https: httpsFollow} = followRedirectsExports;

  const isHttps = /https:?/;

  const supportedProtocols = platform.protocols.map(protocol => {
    return protocol + ':';
  });

  /**
   * If the proxy or config beforeRedirects functions are defined, call them with the options
   * object.
   *
   * @param {Object<string, any>} options - The options object that was passed to the request.
   *
   * @returns {Object<string, any>}
   */
  function dispatchBeforeRedirect(options) {
    if (options.beforeRedirects.proxy) {
      options.beforeRedirects.proxy(options);
    }
    if (options.beforeRedirects.config) {
      options.beforeRedirects.config(options);
    }
  }

  /**
   * If the proxy or config afterRedirects functions are defined, call them with the options
   *
   * @param {http.ClientRequestArgs} options
   * @param {AxiosProxyConfig} configProxy configuration from Axios options object
   * @param {string} location
   *
   * @returns {http.ClientRequestArgs}
   */
  function setProxy(options, configProxy, location) {
    let proxy = configProxy;
    if (!proxy && proxy !== false) {
      const proxyUrl = getProxyForUrl_1(location);
      if (proxyUrl) {
        proxy = new URL(proxyUrl);
      }
    }
    if (proxy) {
      // Basic proxy authorization
      if (proxy.username) {
        proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
      }

      if (proxy.auth) {
        // Support proxy auth object form
        if (proxy.auth.username || proxy.auth.password) {
          proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
        }
        const base64 = Buffer
          .from(proxy.auth, 'utf8')
          .toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }

      options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
      const proxyHost = proxy.hostname || proxy.host;
      options.hostname = proxyHost;
      // Replace 'host' since options is not a URL object
      options.host = proxyHost;
      options.port = proxy.port;
      options.path = location;
      if (proxy.protocol) {
        options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
      }
    }

    options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
      // Configure proxy for redirected request, passing the original config proxy to apply
      // the exact same logic as if the redirected request was performed by axios directly.
      setProxy(redirectOptions, configProxy, redirectOptions.href);
    };
  }

  const isHttpAdapterSupported = typeof process !== 'undefined' && utils.kindOf(process) === 'process';

  // temporary hotfix

  const wrapAsync = (asyncExecutor) => {
    return new Promise((resolve, reject) => {
      let onDone;
      let isDone;

      const done = (value, isRejected) => {
        if (isDone) return;
        isDone = true;
        onDone && onDone(value, isRejected);
      };

      const _resolve = (value) => {
        done(value);
        resolve(value);
      };

      const _reject = (reason) => {
        done(reason, true);
        reject(reason);
      };

      asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
    })
  };

  /*eslint consistent-return:0*/
  var httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
    return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
      let {data, lookup, family} = config;
      const {responseType, responseEncoding} = config;
      const method = config.method.toUpperCase();
      let isDone;
      let rejected = false;
      let req;

      if (lookup && utils.isAsyncFn(lookup)) {
        lookup = callbackify(lookup, (entry) => {
          if(utils.isString(entry)) {
            entry = [entry, entry.indexOf('.') < 0 ? 6 : 4];
          } else if (!utils.isArray(entry)) {
            throw new TypeError('lookup async function must return an array [ip: string, family: number]]')
          }
          return entry;
        });
      }

      // temporary internal emitter until the AxiosRequest class will be implemented
      const emitter = new EventEmitter__default["default"]();

      const onFinished = () => {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(abort);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', abort);
        }

        emitter.removeAllListeners();
      };

      onDone((value, isRejected) => {
        isDone = true;
        if (isRejected) {
          rejected = true;
          onFinished();
        }
      });

      function abort(reason) {
        emitter.emit('abort', !reason || reason.type ? new CanceledError(null, config, req) : reason);
      }

      emitter.once('abort', reject);

      if (config.cancelToken || config.signal) {
        config.cancelToken && config.cancelToken.subscribe(abort);
        if (config.signal) {
          config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
        }
      }

      // Parse url
      const fullPath = buildFullPath(config.baseURL, config.url);
      const parsed = new URL(fullPath, 'http://localhost');
      const protocol = parsed.protocol || supportedProtocols[0];

      if (protocol === 'data:') {
        let convertedData;

        if (method !== 'GET') {
          return settle(resolve, reject, {
            status: 405,
            statusText: 'method not allowed',
            headers: {},
            config
          });
        }

        try {
          convertedData = fromDataURI(config.url, responseType === 'blob', {
            Blob: config.env && config.env.Blob
          });
        } catch (err) {
          throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
        }

        if (responseType === 'text') {
          convertedData = convertedData.toString(responseEncoding);

          if (!responseEncoding || responseEncoding === 'utf8') {
            convertedData = utils.stripBOM(convertedData);
          }
        } else if (responseType === 'stream') {
          convertedData = stream__default["default"].Readable.from(convertedData);
        }

        return settle(resolve, reject, {
          data: convertedData,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config
        });
      }

      if (supportedProtocols.indexOf(protocol) === -1) {
        return reject(new AxiosError(
          'Unsupported protocol ' + protocol,
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      const headers = AxiosHeaders.from(config.headers).normalize();

      // Set User-Agent (required by some servers)
      // See https://github.com/axios/axios/issues/69
      // User-Agent is specified; handle case where no UA header is desired
      // Only set header if it hasn't been set in config
      headers.set('User-Agent', 'axios/' + VERSION, false);

      const onDownloadProgress = config.onDownloadProgress;
      const onUploadProgress = config.onUploadProgress;
      const maxRate = config.maxRate;
      let maxUploadRate = undefined;
      let maxDownloadRate = undefined;

      // support for spec compliant FormData objects
      if (utils.isSpecCompliantForm(data)) {
        const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

        data = formDataToStream(data, (formHeaders) => {
          headers.set(formHeaders);
        }, {
          tag: `axios-${VERSION}-boundary`,
          boundary: userBoundary && userBoundary[1] || undefined
        });
        // support for https://www.npmjs.com/package/form-data api
      } else if (utils.isFormData(data) && utils.isFunction(data.getHeaders)) {
        headers.set(data.getHeaders());

        if (!headers.hasContentLength()) {
          try {
            const knownLength = await require$$1__default["default"].promisify(data.getLength).call(data);
            Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
            /*eslint no-empty:0*/
          } catch (e) {
          }
        }
      } else if (utils.isBlob(data)) {
        data.size && headers.setContentType(data.type || 'application/octet-stream');
        headers.setContentLength(data.size || 0);
        data = stream__default["default"].Readable.from(readBlob(data));
      } else if (data && !utils.isStream(data)) {
        if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils.isString(data)) {
          data = Buffer.from(data, 'utf-8');
        } else {
          return reject(new AxiosError(
            'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
            AxiosError.ERR_BAD_REQUEST,
            config
          ));
        }

        // Add Content-Length header if data exists
        headers.setContentLength(data.length, false);

        if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
          return reject(new AxiosError(
            'Request body larger than maxBodyLength limit',
            AxiosError.ERR_BAD_REQUEST,
            config
          ));
        }
      }

      const contentLength = utils.toFiniteNumber(headers.getContentLength());

      if (utils.isArray(maxRate)) {
        maxUploadRate = maxRate[0];
        maxDownloadRate = maxRate[1];
      } else {
        maxUploadRate = maxDownloadRate = maxRate;
      }

      if (data && (onUploadProgress || maxUploadRate)) {
        if (!utils.isStream(data)) {
          data = stream__default["default"].Readable.from(data, {objectMode: false});
        }

        data = stream__default["default"].pipeline([data, new AxiosTransformStream({
          length: contentLength,
          maxRate: utils.toFiniteNumber(maxUploadRate)
        })], utils.noop);

        onUploadProgress && data.on('progress', progress => {
          onUploadProgress(Object.assign(progress, {
            upload: true
          }));
        });
      }

      // HTTP basic authentication
      let auth = undefined;
      if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password || '';
        auth = username + ':' + password;
      }

      if (!auth && parsed.username) {
        const urlUsername = parsed.username;
        const urlPassword = parsed.password;
        auth = urlUsername + ':' + urlPassword;
      }

      auth && headers.delete('authorization');

      let path;

      try {
        path = buildURL(
          parsed.pathname + parsed.search,
          config.params,
          config.paramsSerializer
        ).replace(/^\?/, '');
      } catch (err) {
        const customErr = new Error(err.message);
        customErr.config = config;
        customErr.url = config.url;
        customErr.exists = true;
        return reject(customErr);
      }

      headers.set(
        'Accept-Encoding',
        'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
        );

      const options = {
        path,
        method: method,
        headers: headers.toJSON(),
        agents: { http: config.httpAgent, https: config.httpsAgent },
        auth,
        protocol,
        family,
        lookup,
        beforeRedirect: dispatchBeforeRedirect,
        beforeRedirects: {}
      };

      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
        setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
      }

      let transport;
      const isHttpsRequest = isHttps.test(options.protocol);
      options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsRequest ? require$$4__default["default"] : require$$3__default["default"];
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        if (config.beforeRedirect) {
          options.beforeRedirects.config = config.beforeRedirect;
        }
        transport = isHttpsRequest ? httpsFollow : httpFollow;
      }

      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      } else {
        // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
        options.maxBodyLength = Infinity;
      }

      if (config.insecureHTTPParser) {
        options.insecureHTTPParser = config.insecureHTTPParser;
      }

      // Create the request
      req = transport.request(options, function handleResponse(res) {
        if (req.destroyed) return;

        const streams = [res];

        const responseLength = +res.headers['content-length'];

        if (onDownloadProgress) {
          const transformStream = new AxiosTransformStream({
            length: utils.toFiniteNumber(responseLength),
            maxRate: utils.toFiniteNumber(maxDownloadRate)
          });

          onDownloadProgress && transformStream.on('progress', progress => {
            onDownloadProgress(Object.assign(progress, {
              download: true
            }));
          });

          streams.push(transformStream);
        }

        // decompress the response body transparently if required
        let responseStream = res;

        // return the last request in case of redirects
        const lastRequest = res.req || req;

        // if decompress disabled we should not decompress
        if (config.decompress !== false && res.headers['content-encoding']) {
          // if no content, but headers still say that it is encoded,
          // remove the header not confuse downstream operations
          if (method === 'HEAD' || res.statusCode === 204) {
            delete res.headers['content-encoding'];
          }

          switch (res.headers['content-encoding']) {
          /*eslint default-case:0*/
          case 'gzip':
          case 'x-gzip':
          case 'compress':
          case 'x-compress':
            // add the unzipper to the body stream processing pipeline
            streams.push(zlib__default["default"].createUnzip(zlibOptions));

            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
          case 'deflate':
            streams.push(new ZlibHeaderTransformStream());

            // add the unzipper to the body stream processing pipeline
            streams.push(zlib__default["default"].createUnzip(zlibOptions));

            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
          case 'br':
            if (isBrotliSupported) {
              streams.push(zlib__default["default"].createBrotliDecompress(brotliOptions));
              delete res.headers['content-encoding'];
            }
          }
        }

        responseStream = streams.length > 1 ? stream__default["default"].pipeline(streams, utils.noop) : streams[0];

        const offListeners = stream__default["default"].finished(responseStream, () => {
          offListeners();
          onFinished();
        });

        const response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: new AxiosHeaders(res.headers),
          config,
          request: lastRequest
        };

        if (responseType === 'stream') {
          response.data = responseStream;
          settle(resolve, reject, response);
        } else {
          const responseBuffer = [];
          let totalResponseBytes = 0;

          responseStream.on('data', function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            totalResponseBytes += chunk.length;

            // make sure the content length is not over the maxContentLength if specified
            if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
              // stream.destroy() emit aborted event before calling reject() on Node.js v16
              rejected = true;
              responseStream.destroy();
              reject(new AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
                AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
            }
          });

          responseStream.on('aborted', function handlerStreamAborted() {
            if (rejected) {
              return;
            }

            const err = new AxiosError(
              'maxContentLength size of ' + config.maxContentLength + ' exceeded',
              AxiosError.ERR_BAD_RESPONSE,
              config,
              lastRequest
            );
            responseStream.destroy(err);
            reject(err);
          });

          responseStream.on('error', function handleStreamError(err) {
            if (req.destroyed) return;
            reject(AxiosError.from(err, null, config, lastRequest));
          });

          responseStream.on('end', function handleStreamEnd() {
            try {
              let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
              if (responseType !== 'arraybuffer') {
                responseData = responseData.toString(responseEncoding);
                if (!responseEncoding || responseEncoding === 'utf8') {
                  responseData = utils.stripBOM(responseData);
                }
              }
              response.data = responseData;
            } catch (err) {
              reject(AxiosError.from(err, null, config, response.request, response));
            }
            settle(resolve, reject, response);
          });
        }

        emitter.once('abort', err => {
          if (!responseStream.destroyed) {
            responseStream.emit('error', err);
            responseStream.destroy();
          }
        });
      });

      emitter.once('abort', err => {
        reject(err);
        req.destroy(err);
      });

      // Handle errors
      req.on('error', function handleRequestError(err) {
        // @todo remove
        // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
        reject(AxiosError.from(err, null, config, req));
      });

      // set tcp keep alive to prevent drop connection by peer
      req.on('socket', function handleRequestSocket(socket) {
        // default interval of sending ack packet is 1 minute
        socket.setKeepAlive(true, 1000 * 60);
      });

      // Handle request timeout
      if (config.timeout) {
        // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
        const timeout = parseInt(config.timeout, 10);

        if (isNaN(timeout)) {
          reject(new AxiosError(
            'error trying to parse `config.timeout` to int',
            AxiosError.ERR_BAD_OPTION_VALUE,
            config,
            req
          ));

          return;
        }

        // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
        // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
        // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
        // And then these socket which be hang up will devouring CPU little by little.
        // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
        req.setTimeout(timeout, function handleRequestTimeout() {
          if (isDone) return;
          let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            req
          ));
          abort();
        });
      }


      // Send the request
      if (utils.isStream(data)) {
        let ended = false;
        let errored = false;

        data.on('end', () => {
          ended = true;
        });

        data.once('error', err => {
          errored = true;
          req.destroy(err);
        });

        data.on('close', () => {
          if (!ended && !errored) {
            abort(new CanceledError('Request stream has been aborted', config, req));
          }
        });

        data.pipe(req);
      } else {
        req.end(data);
      }
    });
  };

  var cookies = platform.isStandardBrowserEnv ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          const cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })();

  var isURLSameOrigin = platform.isStandardBrowserEnv ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement('a');
      let originURL;

      /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
      function resolveURL(url) {
        let href = url;

        if (msie) {
          // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
      return function isURLSameOrigin(requestURL) {
        const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })();

  function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);

    return e => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : undefined;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;

      bytesNotified = loaded;

      const data = {
        loaded,
        total,
        progress: total ? (loaded / total) : undefined,
        bytes: progressBytes,
        rate: rate ? rate : undefined,
        estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
        event: e
      };

      data[isDownloadStream ? 'download' : 'upload'] = true;

      listener(data);
    };
  }

  const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

  var xhrAdapter = isXHRAdapterSupported && function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      let requestData = config.data;
      const requestHeaders = AxiosHeaders.from(config.headers).normalize();
      const responseType = config.responseType;
      let onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', onCanceled);
        }
      }

      if (utils.isFormData(requestData)) {
        if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
          requestHeaders.setContentType(false); // Let the browser set it
        } else {
          requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
        }
      }

      let request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
      }

      const fullPath = buildFullPath(config.baseURL, config.url);

      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        const responseHeaders = AxiosHeaders.from(
          'getAllResponseHeaders' in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
          request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };

        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = config.transitional || transitionalDefaults;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (platform.isStandardBrowserEnv) {
        // Add xsrf header
        const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
          && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

        if (xsrfValue) {
          requestHeaders.set(config.xsrfHeaderName, xsrfValue);
        }
      }

      // Remove Content-Type if data is undefined
      requestData === undefined && requestHeaders.setContentType(null);

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = config.responseType;
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
      }

      if (config.cancelToken || config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = cancel => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };

        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
        }
      }

      const protocol = parseProtocol(fullPath);

      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
        return;
      }


      // Send the request
      request.send(requestData || null);
    });
  };

  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter
  };

  utils.forEach(knownAdapters, (fn, value) => {
    if(fn) {
      try {
        Object.defineProperty(fn, 'name', {value});
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      Object.defineProperty(fn, 'adapterName', {value});
    }
  });

  var adapters = {
    getAdapter: (adapters) => {
      adapters = utils.isArray(adapters) ? adapters : [adapters];

      const {length} = adapters;
      let nameOrAdapter;
      let adapter;

      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
          break;
        }
      }

      if (!adapter) {
        if (adapter === false) {
          throw new AxiosError(
            `Adapter ${nameOrAdapter} is not supported by the environment`,
            'ERR_NOT_SUPPORT'
          );
        }

        throw new Error(
          utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
            `Adapter '${nameOrAdapter}' is not available in the build` :
            `Unknown adapter '${nameOrAdapter}'`
        );
      }

      if (!utils.isFunction(adapter)) {
        throw new TypeError('adapter is not a function');
      }

      return adapter;
    },
    adapters: knownAdapters
  };

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   *
   * @param {Object} config The config that is to be used for the request
   *
   * @returns {void}
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    config.headers = AxiosHeaders.from(config.headers);

    // Transform request data
    config.data = transformData.call(
      config,
      config.transformRequest
    );

    if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
      config.headers.setContentType('application/x-www-form-urlencoded', false);
    }

    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );

      response.headers = AxiosHeaders.from(response.headers);

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders.from(reason.response.headers);
        }
      }

      return Promise.reject(reason);
    });
  }

  const headersToObject = (thing) => thing instanceof AxiosHeaders ? thing.toJSON() : thing;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   *
   * @returns {Object} New object resulting from merging config2 to config1
   */
  function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};

    function getMergedValue(target, source, caseless) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge.call({caseless}, target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, caseless) {
      if (!utils.isUndefined(b)) {
        return getMergedValue(a, b, caseless);
      } else if (!utils.isUndefined(a)) {
        return getMergedValue(undefined, a, caseless);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
      if (!utils.isUndefined(b)) {
        return getMergedValue(undefined, b);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
      if (!utils.isUndefined(b)) {
        return getMergedValue(undefined, b);
      } else if (!utils.isUndefined(a)) {
        return getMergedValue(undefined, a);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(undefined, a);
      }
    }

    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };

    utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge(config1[prop], config2[prop], prop);
      (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
    });

    return config;
  }

  const validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
    validators$1[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  const deprecatedWarnings = {};

  /**
   * Transitional option validator
   *
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   *
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError(
          formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
          AxiosError.ERR_DEPRECATED
        );
      }

      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  /**
   * Assert object's properties type
   *
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   *
   * @returns {object}
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }

  var validator = {
    assertOptions,
    validators: validators$1
  };

  const validators = validator.validators;

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   *
   * @return {Axios} A new instance of Axios
   */
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      const {transitional, paramsSerializer, headers} = config;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      if (paramsSerializer != null) {
        if (utils.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }

      // Set config.method
      config.method = (config.method || this.defaults.method || 'get').toLowerCase();

      let contextHeaders;

      // Flatten headers
      contextHeaders = headers && utils.merge(
        headers.common,
        headers[config.method]
      );

      contextHeaders && utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        (method) => {
          delete headers[method];
        }
      );

      config.headers = AxiosHeaders.concat(contextHeaders, headers);

      // filter out skipped interceptors
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      let promise;
      let i = 0;
      let len;

      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), undefined];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;

        promise = Promise.resolve(config);

        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }

        return promise;
      }

      len = requestInterceptorChain.length;

      let newConfig = config;

      i = 0;

      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }

      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      i = 0;
      len = responseInterceptorChain.length;

      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }

      return promise;
    }

    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  }

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/

    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            'Content-Type': 'multipart/form-data'
          } : {},
          url,
          data
        }));
      };
    }

    Axios.prototype[method] = generateHTTPMethod();

    Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
  });

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @param {Function} executor The executor function.
   *
   * @returns {CancelToken}
   */
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      let resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      const token = this;

      // eslint-disable-next-line func-names
      this.promise.then(cancel => {
        if (!token._listeners) return;

        let i = token._listeners.length;

        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = onfulfilled => {
        let _resolve;
        // eslint-disable-next-line func-names
        const promise = new Promise(resolve => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message, config, request) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError(message, config, request);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }

    /**
     * Subscribe to the cancel signal
     */

    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }

    /**
     * Unsubscribe from the cancel signal
     */

    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  }

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   *
   * @returns {Function}
   */
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   *
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  function isAxiosError(payload) {
    return utils.isObject(payload) && (payload.isAxiosError === true);
  }

  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
  };

  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   *
   * @returns {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    const context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});

    // Copy context to instance
    utils.extend(instance, context, null, {allOwnKeys: true});

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };

    return instance;
  }

  // Create the default instance to be exported
  const axios = createInstance(defaults);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios;

  // Expose Cancel & CancelToken
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;

  // Expose AxiosError class
  axios.AxiosError = AxiosError;

  // alias for CanceledError for backward compatibility
  axios.Cancel = axios.CanceledError;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };

  axios.spread = spread;

  // Expose isAxiosError
  axios.isAxiosError = isAxiosError;

  // Expose mergeConfig
  axios.mergeConfig = mergeConfig;

  axios.AxiosHeaders = AxiosHeaders;

  axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

  axios.HttpStatusCode = HttpStatusCode;

  axios.default = axios;

  class BaseSpeed {}

  class PingSpeed extends BaseSpeed {
    manager;
    inter = undefined;
    startT = new Date().getTime(); //when the test was started
    prevT = null; // last time a pong was received
    ping = 0.0; // current ping value
    jitter = 0.0; // current jitter value
    i = 0; // counter of pongs received
    prevInstspd = 0; // last ping time, used for jitter calculation
    progress = 0;
    status = undefined;
    constructor(manager) {
      super();
      this.manager = manager;
    }
    processOne(url = "") {
      if (this.progress < 1) {
        setTimeout(() => {
          this.progress = this.i / this.manager.settings.count_ping;
          axios.get(url + "r=" + Math.random(), {
            headers: {
              // "Content-Encoding": "identity",
              // "X-Requested-With": "XMLHttpRequest",
              // "Cache-Control":
              //   "no-cache,no-store,must-revalidate,max-age=-1,private",
              // Expires: "-1",
            }
            // validateStatus: function () {
            //   return true;
            // },
          }).then(() => {
            if (this.i === 0) {
              this.prevT = new Date().getTime();
            } else {
              let instspd = new Date().getTime() - this.prevT;
              if (instspd < 1) instspd = this.prevInstspd;
              if (instspd < 1) instspd = 1;
              let instjitter = Math.abs(instspd - this.prevInstspd);
              if (this.i === 1) this.ping = instspd;
              /* first ping, can't tell jitter yet*/else {
                if (instspd < this.ping) this.ping = instspd; // update ping, if the instant ping is lower
                if (this.i === 2) this.jitter = instjitter;
                //discard the first jitter measurement because it might be much higher than it should be
                else this.jitter = instjitter > this.jitter ? this.jitter * 0.3 + instjitter * 0.7 : this.jitter * 0.8 + instjitter * 0.2; // update jitter, weighted average. spikes in ping values are given more weight.
              }

              this.prevInstspd = instspd;
            }
            let pingStatus = this.ping.toFixed(2);
            let jitterStatus = this.jitter.toFixed(2);
            this.i++;
            if (this.i < this.manager.settings.count_ping) {
              this.manager.AddInfo("ping", {
                process: this.progress,
                ping: pingStatus,
                jitter: jitterStatus
              });
              this.processOne(url);
            } else {
              this.progress = 1;
              this.manager.AddInfo("ping", {
                process: this.progress,
                ping: pingStatus,
                jitter: jitterStatus
              });
            }
          }).catch(_ => {
            this.i++;
            if (this.i < this.manager.settings.count_ping) {
              this.processOne(url);
              this.manager.AddInfo("ping", null);
            }
          });
        }, 0);
      }
    }
    start() {
      this.progress = 0;
      this.ping = 0;
      this.jitter = 0;
      this.status = "";
      this.i = 0;
      let url = this.manager.server.server + "/" + this.manager.server.pingURL + "?";
      if (this.manager.settings.mpot) url += "cors=true&";
      setTimeout(() => {
        this.processOne(url);
      }, 200);
      setTimeout(() => {
        this.prevT = new Date().getTime();
      }, 200);
    }
    stop() {}
  }

  // import { DownloadSpeed } from "./download";
  // import { UploadSpeed } from "./upload";
  class ManagerSpeed {
    //https://fra.speedtest.clouvider.net/backend/
    server = {
      name: "Amsterdam, Netherlands (Clouvider)",
      server: "//fra.speedtest.clouvider.net/backend",
      id: 51,
      dlURL: "garbage.php",
      ulURL: "empty.php",
      pingURL: "empty.php",
      getIpURL: "getIP.php",
      sponsorName: "Clouvider",
      sponsorURL: "https://www.clouvider.co.uk/"
    };
    settings = {
      mpot: false,
      test_order: "IP_D_U",
      time_ul_max: 15,
      time_dl_max: 15,
      time_auto: true,
      time_ulGraceTime: 1.5,
      time_dlGraceTime: 1.5,
      count_ping: 20,
      url_dl: "garbage.php",
      url_ul: "empty.php",
      url_ping: "empty.php",
      url_getIp: "getIP.php",
      getIp_ispInfo: true,
      getIp_ispInfo_distance: "km",
      xhr_dlMultistream: 6,
      xhr_ulMultistream: 3,
      xhr_multistreamDelay: 300,
      xhr_ignoreErrors: 1,
      xhr_dlUseBlob: false,
      xhr_ul_blob_megabytes: 20,
      garbagePhp_chunkSize: 100,
      enable_quirks: true,
      ping_allowPerformanceApi: true,
      overheadCompensationFactor: 1.06,
      useMebibits: false,
      telemetry_level: 0,
      url_telemetry: "results/telemetry.php",
      telemetry_extra: "",
      forceIE11Workaround: false //when set to true, it will foce the IE11 upload test on all browsers. Debug only
    };

    async Start() {
      await Promise.all([
      // new DownloadSpeed(this).start(),
      // new UploadSpeed(this).start(),
      new PingSpeed(this).start()]);
    }
    AddInfo(type, data) {
      console.log(type, data);
    }
  }

  class SpeedTest {
    inst = new ManagerSpeed();
    servers = [];
    async loadServer() {
      this.servers = await axios("https://speedtest.hau.xyz/servers.json");
    }
    start() {
      this.inst.Start();
    }
  }

  exports.SpeedTest = SpeedTest;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, require$$1, stream, require$$1$1, require$$3, require$$4, require$$0$1, require$$6, require$$4$1, require$$1$2, require$$0$2, zlib, EventEmitter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlZWR0ZXN0LmlpZmUuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0Vycm9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RlbGF5ZWQtc3RyZWFtL2xpYi9kZWxheWVkX3N0cmVhbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb21iaW5lZC1zdHJlYW0vbGliL2NvbWJpbmVkX3N0cmVhbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9taW1lLWRiL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL21pbWUtdHlwZXMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvYXN5bmNraXQvbGliL2RlZmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2FzeW5ja2l0L2xpYi9hc3luYy5qcyIsIi4uL25vZGVfbW9kdWxlcy9hc3luY2tpdC9saWIvYWJvcnQuanMiLCIuLi9ub2RlX21vZHVsZXMvYXN5bmNraXQvbGliL2l0ZXJhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvYXN5bmNraXQvbGliL3N0YXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2FzeW5ja2l0L2xpYi90ZXJtaW5hdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2FzeW5ja2l0L3BhcmFsbGVsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2FzeW5ja2l0L3NlcmlhbE9yZGVyZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvYXN5bmNraXQvc2VyaWFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2FzeW5ja2l0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Zvcm0tZGF0YS9saWIvcG9wdWxhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZm9ybS1kYXRhL2xpYi9mb3JtX2RhdGEuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vbm9kZS9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vbm9kZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90b1VSTEVuY29kZWRGb3JtLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Zvcm1EYXRhVG9KU09OLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NIZWFkZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcm94eS1mcm9tLWVudi9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvY29tbW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhcy1mbGFnL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3N1cHBvcnRzLWNvbG9yL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9mb2xsb3ctcmVkaXJlY3RzL2RlYnVnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2Vudi9kYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvZnJvbURhdGFVUkkuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdGhyb3R0bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3BlZWRvbWV0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvQXhpb3NUcmFuc2Zvcm1TdHJlYW0uanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcmVhZEJsb2IuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvZm9ybURhdGFUb1N0cmVhbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9abGliSGVhZGVyVHJhbnNmb3JtU3RyZWFtLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NhbGxiYWNraWZ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9odHRwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL2FkYXB0ZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL0h0dHBTdGF0dXNDb2RlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIi4uL3NyYy9zcGVlZC9iYXNlLnRzIiwiLi4vc3JjL3NwZWVkL3BpbmcudHMiLCIuLi9zcmMvc3BlZWQvbWFuYWdlci50cyIsIi4uL3NyYy9zcGVlZHRlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgYmluZCBmcm9tICcuL2hlbHBlcnMvYmluZC5qcyc7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbmNvbnN0IHt0b1N0cmluZ30gPSBPYmplY3QucHJvdG90eXBlO1xuY29uc3Qge2dldFByb3RvdHlwZU9mfSA9IE9iamVjdDtcblxuY29uc3Qga2luZE9mID0gKGNhY2hlID0+IHRoaW5nID0+IHtcbiAgICBjb25zdCBzdHIgPSB0b1N0cmluZy5jYWxsKHRoaW5nKTtcbiAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG59KShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY29uc3Qga2luZE9mVGVzdCA9ICh0eXBlKSA9PiB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAodGhpbmcpID0+IGtpbmRPZih0aGluZykgPT09IHR5cGVcbn1cblxuY29uc3QgdHlwZU9mVGVzdCA9IHR5cGUgPT4gdGhpbmcgPT4gdHlwZW9mIHRoaW5nID09PSB0eXBlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3Qge2lzQXJyYXl9ID0gQXJyYXk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVbmRlZmluZWQgPSB0eXBlT2ZUZXN0KCd1bmRlZmluZWQnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiBpc0Z1bmN0aW9uKHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcikgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNBcnJheUJ1ZmZlciA9IGtpbmRPZlRlc3QoJ0FycmF5QnVmZmVyJyk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICBsZXQgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdHlwZU9mVGVzdCgnc3RyaW5nJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGdW5jdGlvbiA9IHR5cGVPZlRlc3QoJ2Z1bmN0aW9uJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0eXBlT2ZUZXN0KCdudW1iZXInKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNPYmplY3QgPSAodGhpbmcpID0+IHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCb29sZWFuXG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCb29sZWFuLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNCb29sZWFuID0gdGhpbmcgPT4gdGhpbmcgPT09IHRydWUgfHwgdGhpbmcgPT09IGZhbHNlO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XG4gIGlmIChraW5kT2YodmFsKSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBwcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gKHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSkgPT09IG51bGwpICYmICEoU3ltYm9sLnRvU3RyaW5nVGFnIGluIHZhbCkgJiYgIShTeW1ib2wuaXRlcmF0b3IgaW4gdmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRGF0ZSA9IGtpbmRPZlRlc3QoJ0RhdGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRmlsZSA9IGtpbmRPZlRlc3QoJ0ZpbGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQmxvYiA9IGtpbmRPZlRlc3QoJ0Jsb2InKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVMaXN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdCgnRmlsZUxpc3QnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmVhbSA9ICh2YWwpID0+IGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRm9ybURhdGEgPSAodGhpbmcpID0+IHtcbiAgbGV0IGtpbmQ7XG4gIHJldHVybiB0aGluZyAmJiAoXG4gICAgKHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGluZyBpbnN0YW5jZW9mIEZvcm1EYXRhKSB8fCAoXG4gICAgICBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgKFxuICAgICAgICAoa2luZCA9IGtpbmRPZih0aGluZykpID09PSAnZm9ybWRhdGEnIHx8XG4gICAgICAgIC8vIGRldGVjdCBmb3JtLWRhdGEgaW5zdGFuY2VcbiAgICAgICAgKGtpbmQgPT09ICdvYmplY3QnICYmIGlzRnVuY3Rpb24odGhpbmcudG9TdHJpbmcpICYmIHRoaW5nLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEZvcm1EYXRhXScpXG4gICAgICApXG4gICAgKVxuICApXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1VSTFNlYXJjaFBhcmFtcyA9IGtpbmRPZlRlc3QoJ1VSTFNlYXJjaFBhcmFtcycpO1xuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5jb25zdCB0cmltID0gKHN0cikgPT4gc3RyLnRyaW0gP1xuICBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzID0gZmFsc2VdXG4gKiBAcmV0dXJucyB7YW55fVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4sIHthbGxPd25LZXlzID0gZmFsc2V9ID0ge30pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaTtcbiAgbGV0IGw7XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGNvbnN0IGtleXMgPSBhbGxPd25LZXlzID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgbGV0IGtleTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEtleShvYmosIGtleSkge1xuICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIGxldCBpID0ga2V5cy5sZW5ndGg7XG4gIGxldCBfa2V5O1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIF9rZXkgPSBrZXlzW2ldO1xuICAgIGlmIChrZXkgPT09IF9rZXkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIF9rZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBfZ2xvYmFsID0gKCgpID0+IHtcbiAgLyplc2xpbnQgbm8tdW5kZWY6MCovXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIHJldHVybiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpXG59KSgpO1xuXG5jb25zdCBpc0NvbnRleHREZWZpbmVkID0gKGNvbnRleHQpID0+ICFpc1VuZGVmaW5lZChjb250ZXh0KSAmJiBjb250ZXh0ICE9PSBfZ2xvYmFsO1xuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIGNvbnN0IHtjYXNlbGVzc30gPSBpc0NvbnRleHREZWZpbmVkKHRoaXMpICYmIHRoaXMgfHwge307XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBhc3NpZ25WYWx1ZSA9ICh2YWwsIGtleSkgPT4ge1xuICAgIGNvbnN0IHRhcmdldEtleSA9IGNhc2VsZXNzICYmIGZpbmRLZXkocmVzdWx0LCBrZXkpIHx8IGtleTtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRbdGFyZ2V0S2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHJlc3VsdFt0YXJnZXRLZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRbdGFyZ2V0S2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBhcmd1bWVudHNbaV0gJiYgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBbYWxsT3duS2V5c11cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuY29uc3QgZXh0ZW5kID0gKGEsIGIsIHRoaXNBcmcsIHthbGxPd25LZXlzfT0ge30pID0+IHtcbiAgZm9yRWFjaChiLCAodmFsLCBrZXkpID0+IHtcbiAgICBpZiAodGhpc0FyZyAmJiBpc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSwge2FsbE93bktleXN9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmNvbnN0IHN0cmlwQk9NID0gKGNvbnRlbnQpID0+IHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtwcm9wc11cbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVzY3JpcHRvcnNdXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmNvbnN0IGluaGVyaXRzID0gKGNvbnN0cnVjdG9yLCBzdXBlckNvbnN0cnVjdG9yLCBwcm9wcywgZGVzY3JpcHRvcnMpID0+IHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLCAnc3VwZXInLCB7XG4gICAgdmFsdWU6IHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlXG4gIH0pO1xuICBwcm9wcyAmJiBPYmplY3QuYXNzaWduKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJlc29sdmUgb2JqZWN0IHdpdGggZGVlcCBwcm90b3R5cGUgY2hhaW4gdG8gYSBmbGF0IG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZU9iaiBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gW2Rlc3RPYmpdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufEJvb2xlYW59IFtmaWx0ZXJdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvcEZpbHRlcl1cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5jb25zdCB0b0ZsYXRPYmplY3QgPSAoc291cmNlT2JqLCBkZXN0T2JqLCBmaWx0ZXIsIHByb3BGaWx0ZXIpID0+IHtcbiAgbGV0IHByb3BzO1xuICBsZXQgaTtcbiAgbGV0IHByb3A7XG4gIGNvbnN0IG1lcmdlZCA9IHt9O1xuXG4gIGRlc3RPYmogPSBkZXN0T2JqIHx8IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgaWYgKHNvdXJjZU9iaiA9PSBudWxsKSByZXR1cm4gZGVzdE9iajtcblxuICBkbyB7XG4gICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VPYmopO1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgIGlmICgoIXByb3BGaWx0ZXIgfHwgcHJvcEZpbHRlcihwcm9wLCBzb3VyY2VPYmosIGRlc3RPYmopKSAmJiAhbWVyZ2VkW3Byb3BdKSB7XG4gICAgICAgIGRlc3RPYmpbcHJvcF0gPSBzb3VyY2VPYmpbcHJvcF07XG4gICAgICAgIG1lcmdlZFtwcm9wXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvdXJjZU9iaiA9IGZpbHRlciAhPT0gZmFsc2UgJiYgZ2V0UHJvdG90eXBlT2Yoc291cmNlT2JqKTtcbiAgfSB3aGlsZSAoc291cmNlT2JqICYmICghZmlsdGVyIHx8IGZpbHRlcihzb3VyY2VPYmosIGRlc3RPYmopKSAmJiBzb3VyY2VPYmogIT09IE9iamVjdC5wcm90b3R5cGUpO1xuXG4gIHJldHVybiBkZXN0T2JqO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBlbmRzIHdpdGggdGhlIGNoYXJhY3RlcnMgb2YgYSBzcGVjaWZpZWQgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbj0gMF1cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgZW5kc1dpdGggPSAoc3RyLCBzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSA9PiB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCB8fCBwb3NpdGlvbiA+IHN0ci5sZW5ndGgpIHtcbiAgICBwb3NpdGlvbiA9IHN0ci5sZW5ndGg7XG4gIH1cbiAgcG9zaXRpb24gLT0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgY29uc3QgbGFzdEluZGV4ID0gc3RyLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbik7XG4gIHJldHVybiBsYXN0SW5kZXggIT09IC0xICYmIGxhc3RJbmRleCA9PT0gcG9zaXRpb247XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5ldyBhcnJheSBmcm9tIGFycmF5IGxpa2Ugb2JqZWN0IG9yIG51bGwgaWYgZmFpbGVkXG4gKlxuICogQHBhcmFtIHsqfSBbdGhpbmddXG4gKlxuICogQHJldHVybnMgez9BcnJheX1cbiAqL1xuY29uc3QgdG9BcnJheSA9ICh0aGluZykgPT4ge1xuICBpZiAoIXRoaW5nKSByZXR1cm4gbnVsbDtcbiAgaWYgKGlzQXJyYXkodGhpbmcpKSByZXR1cm4gdGhpbmc7XG4gIGxldCBpID0gdGhpbmcubGVuZ3RoO1xuICBpZiAoIWlzTnVtYmVyKGkpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGkpO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGFycltpXSA9IHRoaW5nW2ldO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbi8qKlxuICogQ2hlY2tpbmcgaWYgdGhlIFVpbnQ4QXJyYXkgZXhpc3RzIGFuZCBpZiBpdCBkb2VzLCBpdCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgdGhlXG4gKiB0aGluZyBwYXNzZWQgaW4gaXMgYW4gaW5zdGFuY2Ugb2YgVWludDhBcnJheVxuICpcbiAqIEBwYXJhbSB7VHlwZWRBcnJheX1cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5jb25zdCBpc1R5cGVkQXJyYXkgPSAoVHlwZWRBcnJheSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiB0aGluZyA9PiB7XG4gICAgcmV0dXJuIFR5cGVkQXJyYXkgJiYgdGhpbmcgaW5zdGFuY2VvZiBUeXBlZEFycmF5O1xuICB9O1xufSkodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIGdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpKTtcblxuLyoqXG4gKiBGb3IgZWFjaCBlbnRyeSBpbiB0aGUgb2JqZWN0LCBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBrZXkgYW5kIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PGFueSwgYW55Pn0gb2JqIC0gVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVudHJ5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5jb25zdCBmb3JFYWNoRW50cnkgPSAob2JqLCBmbikgPT4ge1xuICBjb25zdCBnZW5lcmF0b3IgPSBvYmogJiYgb2JqW1N5bWJvbC5pdGVyYXRvcl07XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBnZW5lcmF0b3IuY2FsbChvYmopO1xuXG4gIGxldCByZXN1bHQ7XG5cbiAgd2hpbGUgKChyZXN1bHQgPSBpdGVyYXRvci5uZXh0KCkpICYmICFyZXN1bHQuZG9uZSkge1xuICAgIGNvbnN0IHBhaXIgPSByZXN1bHQudmFsdWU7XG4gICAgZm4uY2FsbChvYmosIHBhaXJbMF0sIHBhaXJbMV0pO1xuICB9XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSByZWd1bGFyIGV4cHJlc3Npb24gYW5kIGEgc3RyaW5nLCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIG1hdGNoZXNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnRXhwIC0gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhZ2FpbnN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc2VhcmNoLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheTxib29sZWFuPn1cbiAqL1xuY29uc3QgbWF0Y2hBbGwgPSAocmVnRXhwLCBzdHIpID0+IHtcbiAgbGV0IG1hdGNoZXM7XG4gIGNvbnN0IGFyciA9IFtdO1xuXG4gIHdoaWxlICgobWF0Y2hlcyA9IHJlZ0V4cC5leGVjKHN0cikpICE9PSBudWxsKSB7XG4gICAgYXJyLnB1c2gobWF0Y2hlcyk7XG4gIH1cblxuICByZXR1cm4gYXJyO1xufVxuXG4vKiBDaGVja2luZyBpZiB0aGUga2luZE9mVGVzdCBmdW5jdGlvbiByZXR1cm5zIHRydWUgd2hlbiBwYXNzZWQgYW4gSFRNTEZvcm1FbGVtZW50LiAqL1xuY29uc3QgaXNIVE1MRm9ybSA9IGtpbmRPZlRlc3QoJ0hUTUxGb3JtRWxlbWVudCcpO1xuXG5jb25zdCB0b0NhbWVsQ2FzZSA9IHN0ciA9PiB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9cXHNdKFthLXpcXGRdKShcXHcqKS9nLFxuICAgIGZ1bmN0aW9uIHJlcGxhY2VyKG0sIHAxLCBwMikge1xuICAgICAgcmV0dXJuIHAxLnRvVXBwZXJDYXNlKCkgKyBwMjtcbiAgICB9XG4gICk7XG59O1xuXG4vKiBDcmVhdGluZyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjaGVjayBpZiBhbiBvYmplY3QgaGFzIGEgcHJvcGVydHkuICovXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9ICgoe2hhc093blByb3BlcnR5fSkgPT4gKG9iaiwgcHJvcCkgPT4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKShPYmplY3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzUmVnRXhwID0ga2luZE9mVGVzdCgnUmVnRXhwJyk7XG5cbmNvbnN0IHJlZHVjZURlc2NyaXB0b3JzID0gKG9iaiwgcmVkdWNlcikgPT4ge1xuICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaik7XG4gIGNvbnN0IHJlZHVjZWREZXNjcmlwdG9ycyA9IHt9O1xuXG4gIGZvckVhY2goZGVzY3JpcHRvcnMsIChkZXNjcmlwdG9yLCBuYW1lKSA9PiB7XG4gICAgaWYgKHJlZHVjZXIoZGVzY3JpcHRvciwgbmFtZSwgb2JqKSAhPT0gZmFsc2UpIHtcbiAgICAgIHJlZHVjZWREZXNjcmlwdG9yc1tuYW1lXSA9IGRlc2NyaXB0b3I7XG4gICAgfVxuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmosIHJlZHVjZWREZXNjcmlwdG9ycyk7XG59XG5cbi8qKlxuICogTWFrZXMgYWxsIG1ldGhvZHMgcmVhZC1vbmx5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxuY29uc3QgZnJlZXplTWV0aG9kcyA9IChvYmopID0+IHtcbiAgcmVkdWNlRGVzY3JpcHRvcnMob2JqLCAoZGVzY3JpcHRvciwgbmFtZSkgPT4ge1xuICAgIC8vIHNraXAgcmVzdHJpY3RlZCBwcm9wcyBpbiBzdHJpY3QgbW9kZVxuICAgIGlmIChpc0Z1bmN0aW9uKG9iaikgJiYgWydhcmd1bWVudHMnLCAnY2FsbGVyJywgJ2NhbGxlZSddLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm47XG5cbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBmYWxzZTtcblxuICAgIGlmICgnd3JpdGFibGUnIGluIGRlc2NyaXB0b3IpIHtcbiAgICAgIGRlc2NyaXB0b3Iud3JpdGFibGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldCA9ICgpID0+IHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NhbiBub3QgcmV3cml0ZSByZWFkLW9ubHkgbWV0aG9kIFxcJycgKyBuYW1lICsgJ1xcJycpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCB0b09iamVjdFNldCA9IChhcnJheU9yU3RyaW5nLCBkZWxpbWl0ZXIpID0+IHtcbiAgY29uc3Qgb2JqID0ge307XG5cbiAgY29uc3QgZGVmaW5lID0gKGFycikgPT4ge1xuICAgIGFyci5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIG9ialt2YWx1ZV0gPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgaXNBcnJheShhcnJheU9yU3RyaW5nKSA/IGRlZmluZShhcnJheU9yU3RyaW5nKSA6IGRlZmluZShTdHJpbmcoYXJyYXlPclN0cmluZykuc3BsaXQoZGVsaW1pdGVyKSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbmNvbnN0IHRvRmluaXRlTnVtYmVyID0gKHZhbHVlLCBkZWZhdWx0VmFsdWUpID0+IHtcbiAgdmFsdWUgPSArdmFsdWU7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpID8gdmFsdWUgOiBkZWZhdWx0VmFsdWU7XG59XG5cbmNvbnN0IEFMUEhBID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6J1xuXG5jb25zdCBESUdJVCA9ICcwMTIzNDU2Nzg5JztcblxuY29uc3QgQUxQSEFCRVQgPSB7XG4gIERJR0lULFxuICBBTFBIQSxcbiAgQUxQSEFfRElHSVQ6IEFMUEhBICsgQUxQSEEudG9VcHBlckNhc2UoKSArIERJR0lUXG59XG5cbmNvbnN0IGdlbmVyYXRlU3RyaW5nID0gKHNpemUgPSAxNiwgYWxwaGFiZXQgPSBBTFBIQUJFVC5BTFBIQV9ESUdJVCkgPT4ge1xuICBsZXQgc3RyID0gJyc7XG4gIGNvbnN0IHtsZW5ndGh9ID0gYWxwaGFiZXQ7XG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBzdHIgKz0gYWxwaGFiZXRbTWF0aC5yYW5kb20oKSAqIGxlbmd0aHwwXVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBJZiB0aGUgdGhpbmcgaXMgYSBGb3JtRGF0YSBvYmplY3QsIHJldHVybiB0cnVlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGhpbmcgLSBUaGUgdGhpbmcgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3BlY0NvbXBsaWFudEZvcm0odGhpbmcpIHtcbiAgcmV0dXJuICEhKHRoaW5nICYmIGlzRnVuY3Rpb24odGhpbmcuYXBwZW5kKSAmJiB0aGluZ1tTeW1ib2wudG9TdHJpbmdUYWddID09PSAnRm9ybURhdGEnICYmIHRoaW5nW1N5bWJvbC5pdGVyYXRvcl0pO1xufVxuXG5jb25zdCB0b0pTT05PYmplY3QgPSAob2JqKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IEFycmF5KDEwKTtcblxuICBjb25zdCB2aXNpdCA9IChzb3VyY2UsIGkpID0+IHtcblxuICAgIGlmIChpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICBpZiAoc3RhY2suaW5kZXhPZihzb3VyY2UpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZighKCd0b0pTT04nIGluIHNvdXJjZSkpIHtcbiAgICAgICAgc3RhY2tbaV0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGlzQXJyYXkoc291cmNlKSA/IFtdIDoge307XG5cbiAgICAgICAgZm9yRWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVkdWNlZFZhbHVlID0gdmlzaXQodmFsdWUsIGkgKyAxKTtcbiAgICAgICAgICAhaXNVbmRlZmluZWQocmVkdWNlZFZhbHVlKSAmJiAodGFyZ2V0W2tleV0gPSByZWR1Y2VkVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGFja1tpXSA9IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICByZXR1cm4gdmlzaXQob2JqLCAwKTtcbn1cblxuY29uc3QgaXNBc3luY0ZuID0ga2luZE9mVGVzdCgnQXN5bmNGdW5jdGlvbicpO1xuXG5jb25zdCBpc1RoZW5hYmxlID0gKHRoaW5nKSA9PlxuICB0aGluZyAmJiAoaXNPYmplY3QodGhpbmcpIHx8IGlzRnVuY3Rpb24odGhpbmcpKSAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRoZW4pICYmIGlzRnVuY3Rpb24odGhpbmcuY2F0Y2gpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmcsXG4gIGlzTnVtYmVyLFxuICBpc0Jvb2xlYW4sXG4gIGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlLFxuICBpc0ZpbGUsXG4gIGlzQmxvYixcbiAgaXNSZWdFeHAsXG4gIGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNUeXBlZEFycmF5LFxuICBpc0ZpbGVMaXN0LFxuICBmb3JFYWNoLFxuICBtZXJnZSxcbiAgZXh0ZW5kLFxuICB0cmltLFxuICBzdHJpcEJPTSxcbiAgaW5oZXJpdHMsXG4gIHRvRmxhdE9iamVjdCxcbiAga2luZE9mLFxuICBraW5kT2ZUZXN0LFxuICBlbmRzV2l0aCxcbiAgdG9BcnJheSxcbiAgZm9yRWFjaEVudHJ5LFxuICBtYXRjaEFsbCxcbiAgaXNIVE1MRm9ybSxcbiAgaGFzT3duUHJvcGVydHksXG4gIGhhc093blByb3A6IGhhc093blByb3BlcnR5LCAvLyBhbiBhbGlhcyB0byBhdm9pZCBFU0xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIGRldGVjdGlvblxuICByZWR1Y2VEZXNjcmlwdG9ycyxcbiAgZnJlZXplTWV0aG9kcyxcbiAgdG9PYmplY3RTZXQsXG4gIHRvQ2FtZWxDYXNlLFxuICBub29wLFxuICB0b0Zpbml0ZU51bWJlcixcbiAgZmluZEtleSxcbiAgZ2xvYmFsOiBfZ2xvYmFsLFxuICBpc0NvbnRleHREZWZpbmVkLFxuICBBTFBIQUJFVCxcbiAgZ2VuZXJhdGVTdHJpbmcsXG4gIGlzU3BlY0NvbXBsaWFudEZvcm0sXG4gIHRvSlNPTk9iamVjdCxcbiAgaXNBc3luY0ZuLFxuICBpc1RoZW5hYmxlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZ10gVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuZnVuY3Rpb24gQXhpb3NFcnJvcihtZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG5cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gIH1cblxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQXhpb3NFcnJvcic7XG4gIGNvZGUgJiYgKHRoaXMuY29kZSA9IGNvZGUpO1xuICBjb25maWcgJiYgKHRoaXMuY29uZmlnID0gY29uZmlnKTtcbiAgcmVxdWVzdCAmJiAodGhpcy5yZXF1ZXN0ID0gcmVxdWVzdCk7XG4gIHJlc3BvbnNlICYmICh0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2UpO1xufVxuXG51dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB1dGlscy50b0pTT05PYmplY3QodGhpcy5jb25maWcpLFxuICAgICAgY29kZTogdGhpcy5jb2RlLFxuICAgICAgc3RhdHVzOiB0aGlzLnJlc3BvbnNlICYmIHRoaXMucmVzcG9uc2Uuc3RhdHVzID8gdGhpcy5yZXNwb25zZS5zdGF0dXMgOiBudWxsXG4gICAgfTtcbiAgfVxufSk7XG5cbmNvbnN0IHByb3RvdHlwZSA9IEF4aW9zRXJyb3IucHJvdG90eXBlO1xuY29uc3QgZGVzY3JpcHRvcnMgPSB7fTtcblxuW1xuICAnRVJSX0JBRF9PUFRJT05fVkFMVUUnLFxuICAnRVJSX0JBRF9PUFRJT04nLFxuICAnRUNPTk5BQk9SVEVEJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFUlJfTkVUV09SSycsXG4gICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJyxcbiAgJ0VSUl9ERVBSRUNBVEVEJyxcbiAgJ0VSUl9CQURfUkVTUE9OU0UnLFxuICAnRVJSX0JBRF9SRVFVRVNUJyxcbiAgJ0VSUl9DQU5DRUxFRCcsXG4gICdFUlJfTk9UX1NVUFBPUlQnLFxuICAnRVJSX0lOVkFMSURfVVJMJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbl0uZm9yRWFjaChjb2RlID0+IHtcbiAgZGVzY3JpcHRvcnNbY29kZV0gPSB7dmFsdWU6IGNvZGV9O1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEF4aW9zRXJyb3IsIGRlc2NyaXB0b3JzKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsICdpc0F4aW9zRXJyb3InLCB7dmFsdWU6IHRydWV9KTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbkF4aW9zRXJyb3IuZnJvbSA9IChlcnJvciwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSwgY3VzdG9tUHJvcHMpID0+IHtcbiAgY29uc3QgYXhpb3NFcnJvciA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcblxuICB1dGlscy50b0ZsYXRPYmplY3QoZXJyb3IsIGF4aW9zRXJyb3IsIGZ1bmN0aW9uIGZpbHRlcihvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBFcnJvci5wcm90b3R5cGU7XG4gIH0sIHByb3AgPT4ge1xuICAgIHJldHVybiBwcm9wICE9PSAnaXNBeGlvc0Vycm9yJztcbiAgfSk7XG5cbiAgQXhpb3NFcnJvci5jYWxsKGF4aW9zRXJyb3IsIGVycm9yLm1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpO1xuXG4gIGF4aW9zRXJyb3IuY2F1c2UgPSBlcnJvcjtcblxuICBheGlvc0Vycm9yLm5hbWUgPSBlcnJvci5uYW1lO1xuXG4gIGN1c3RvbVByb3BzICYmIE9iamVjdC5hc3NpZ24oYXhpb3NFcnJvciwgY3VzdG9tUHJvcHMpO1xuXG4gIHJldHVybiBheGlvc0Vycm9yO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NFcnJvcjtcbiIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW07XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWxheWVkU3RyZWFtO1xuZnVuY3Rpb24gRGVsYXllZFN0cmVhbSgpIHtcbiAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICB0aGlzLmRhdGFTaXplID0gMDtcbiAgdGhpcy5tYXhEYXRhU2l6ZSA9IDEwMjQgKiAxMDI0O1xuICB0aGlzLnBhdXNlU3RyZWFtID0gdHJ1ZTtcblxuICB0aGlzLl9tYXhEYXRhU2l6ZUV4Y2VlZGVkID0gZmFsc2U7XG4gIHRoaXMuX3JlbGVhc2VkID0gZmFsc2U7XG4gIHRoaXMuX2J1ZmZlcmVkRXZlbnRzID0gW107XG59XG51dGlsLmluaGVyaXRzKERlbGF5ZWRTdHJlYW0sIFN0cmVhbSk7XG5cbkRlbGF5ZWRTdHJlYW0uY3JlYXRlID0gZnVuY3Rpb24oc291cmNlLCBvcHRpb25zKSB7XG4gIHZhciBkZWxheWVkU3RyZWFtID0gbmV3IHRoaXMoKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgZm9yICh2YXIgb3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICBkZWxheWVkU3RyZWFtW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl07XG4gIH1cblxuICBkZWxheWVkU3RyZWFtLnNvdXJjZSA9IHNvdXJjZTtcblxuICB2YXIgcmVhbEVtaXQgPSBzb3VyY2UuZW1pdDtcbiAgc291cmNlLmVtaXQgPSBmdW5jdGlvbigpIHtcbiAgICBkZWxheWVkU3RyZWFtLl9oYW5kbGVFbWl0KGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHJlYWxFbWl0LmFwcGx5KHNvdXJjZSwgYXJndW1lbnRzKTtcbiAgfTtcblxuICBzb3VyY2Uub24oJ2Vycm9yJywgZnVuY3Rpb24oKSB7fSk7XG4gIGlmIChkZWxheWVkU3RyZWFtLnBhdXNlU3RyZWFtKSB7XG4gICAgc291cmNlLnBhdXNlKCk7XG4gIH1cblxuICByZXR1cm4gZGVsYXllZFN0cmVhbTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEZWxheWVkU3RyZWFtLnByb3RvdHlwZSwgJ3JlYWRhYmxlJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnJlYWRhYmxlO1xuICB9XG59KTtcblxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc291cmNlLnNldEVuY29kaW5nLmFwcGx5KHRoaXMuc291cmNlLCBhcmd1bWVudHMpO1xufTtcblxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5fcmVsZWFzZWQpIHtcbiAgICB0aGlzLnJlbGVhc2UoKTtcbiAgfVxuXG4gIHRoaXMuc291cmNlLnJlc3VtZSgpO1xufTtcblxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zb3VyY2UucGF1c2UoKTtcbn07XG5cbkRlbGF5ZWRTdHJlYW0ucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fcmVsZWFzZWQgPSB0cnVlO1xuXG4gIHRoaXMuX2J1ZmZlcmVkRXZlbnRzLmZvckVhY2goZnVuY3Rpb24oYXJncykge1xuICAgIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5fYnVmZmVyZWRFdmVudHMgPSBbXTtcbn07XG5cbkRlbGF5ZWRTdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHIgPSBTdHJlYW0ucHJvdG90eXBlLnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdGhpcy5yZXN1bWUoKTtcbiAgcmV0dXJuIHI7XG59O1xuXG5EZWxheWVkU3RyZWFtLnByb3RvdHlwZS5faGFuZGxlRW1pdCA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgaWYgKHRoaXMuX3JlbGVhc2VkKSB7XG4gICAgdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChhcmdzWzBdID09PSAnZGF0YScpIHtcbiAgICB0aGlzLmRhdGFTaXplICs9IGFyZ3NbMV0ubGVuZ3RoO1xuICAgIHRoaXMuX2NoZWNrSWZNYXhEYXRhU2l6ZUV4Y2VlZGVkKCk7XG4gIH1cblxuICB0aGlzLl9idWZmZXJlZEV2ZW50cy5wdXNoKGFyZ3MpO1xufTtcblxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUuX2NoZWNrSWZNYXhEYXRhU2l6ZUV4Y2VlZGVkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9tYXhEYXRhU2l6ZUV4Y2VlZGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMuZGF0YVNpemUgPD0gdGhpcy5tYXhEYXRhU2l6ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX21heERhdGFTaXplRXhjZWVkZWQgPSB0cnVlO1xuICB2YXIgbWVzc2FnZSA9XG4gICAgJ0RlbGF5ZWRTdHJlYW0jbWF4RGF0YVNpemUgb2YgJyArIHRoaXMubWF4RGF0YVNpemUgKyAnIGJ5dGVzIGV4Y2VlZGVkLidcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihtZXNzYWdlKSk7XG59O1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtO1xudmFyIERlbGF5ZWRTdHJlYW0gPSByZXF1aXJlKCdkZWxheWVkLXN0cmVhbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbWJpbmVkU3RyZWFtO1xuZnVuY3Rpb24gQ29tYmluZWRTdHJlYW0oKSB7XG4gIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG4gIHRoaXMuZGF0YVNpemUgPSAwO1xuICB0aGlzLm1heERhdGFTaXplID0gMiAqIDEwMjQgKiAxMDI0O1xuICB0aGlzLnBhdXNlU3RyZWFtcyA9IHRydWU7XG5cbiAgdGhpcy5fcmVsZWFzZWQgPSBmYWxzZTtcbiAgdGhpcy5fc3RyZWFtcyA9IFtdO1xuICB0aGlzLl9jdXJyZW50U3RyZWFtID0gbnVsbDtcbiAgdGhpcy5faW5zaWRlTG9vcCA9IGZhbHNlO1xuICB0aGlzLl9wZW5kaW5nTmV4dCA9IGZhbHNlO1xufVxudXRpbC5pbmhlcml0cyhDb21iaW5lZFN0cmVhbSwgU3RyZWFtKTtcblxuQ29tYmluZWRTdHJlYW0uY3JlYXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgY29tYmluZWRTdHJlYW0gPSBuZXcgdGhpcygpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBmb3IgKHZhciBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgIGNvbWJpbmVkU3RyZWFtW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl07XG4gIH1cblxuICByZXR1cm4gY29tYmluZWRTdHJlYW07XG59O1xuXG5Db21iaW5lZFN0cmVhbS5pc1N0cmVhbUxpa2UgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3RyZWFtICE9PSAnZnVuY3Rpb24nKVxuICAgICYmICh0eXBlb2Ygc3RyZWFtICE9PSAnc3RyaW5nJylcbiAgICAmJiAodHlwZW9mIHN0cmVhbSAhPT0gJ2Jvb2xlYW4nKVxuICAgICYmICh0eXBlb2Ygc3RyZWFtICE9PSAnbnVtYmVyJylcbiAgICAmJiAoIUJ1ZmZlci5pc0J1ZmZlcihzdHJlYW0pKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIGlzU3RyZWFtTGlrZSA9IENvbWJpbmVkU3RyZWFtLmlzU3RyZWFtTGlrZShzdHJlYW0pO1xuXG4gIGlmIChpc1N0cmVhbUxpa2UpIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBEZWxheWVkU3RyZWFtKSkge1xuICAgICAgdmFyIG5ld1N0cmVhbSA9IERlbGF5ZWRTdHJlYW0uY3JlYXRlKHN0cmVhbSwge1xuICAgICAgICBtYXhEYXRhU2l6ZTogSW5maW5pdHksXG4gICAgICAgIHBhdXNlU3RyZWFtOiB0aGlzLnBhdXNlU3RyZWFtcyxcbiAgICAgIH0pO1xuICAgICAgc3RyZWFtLm9uKCdkYXRhJywgdGhpcy5fY2hlY2tEYXRhU2l6ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHN0cmVhbSA9IG5ld1N0cmVhbTtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVFcnJvcnMoc3RyZWFtKTtcblxuICAgIGlmICh0aGlzLnBhdXNlU3RyZWFtcykge1xuICAgICAgc3RyZWFtLnBhdXNlKCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fc3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIFN0cmVhbS5wcm90b3R5cGUucGlwZS5jYWxsKHRoaXMsIGRlc3QsIG9wdGlvbnMpO1xuICB0aGlzLnJlc3VtZSgpO1xuICByZXR1cm4gZGVzdDtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fZ2V0TmV4dCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jdXJyZW50U3RyZWFtID0gbnVsbDtcblxuICBpZiAodGhpcy5faW5zaWRlTG9vcCkge1xuICAgIHRoaXMuX3BlbmRpbmdOZXh0ID0gdHJ1ZTtcbiAgICByZXR1cm47IC8vIGRlZmVyIGNhbGxcbiAgfVxuXG4gIHRoaXMuX2luc2lkZUxvb3AgPSB0cnVlO1xuICB0cnkge1xuICAgIGRvIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdOZXh0ID0gZmFsc2U7XG4gICAgICB0aGlzLl9yZWFsR2V0TmV4dCgpO1xuICAgIH0gd2hpbGUgKHRoaXMuX3BlbmRpbmdOZXh0KTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0aGlzLl9pbnNpZGVMb29wID0gZmFsc2U7XG4gIH1cbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fcmVhbEdldE5leHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0cmVhbSA9IHRoaXMuX3N0cmVhbXMuc2hpZnQoKTtcblxuXG4gIGlmICh0eXBlb2Ygc3RyZWFtID09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIHN0cmVhbSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuX3BpcGVOZXh0KHN0cmVhbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGdldFN0cmVhbSA9IHN0cmVhbTtcbiAgZ2V0U3RyZWFtKGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBpc1N0cmVhbUxpa2UgPSBDb21iaW5lZFN0cmVhbS5pc1N0cmVhbUxpa2Uoc3RyZWFtKTtcbiAgICBpZiAoaXNTdHJlYW1MaWtlKSB7XG4gICAgICBzdHJlYW0ub24oJ2RhdGEnLCB0aGlzLl9jaGVja0RhdGFTaXplLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5faGFuZGxlRXJyb3JzKHN0cmVhbSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcGlwZU5leHQoc3RyZWFtKTtcbiAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fcGlwZU5leHQgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdGhpcy5fY3VycmVudFN0cmVhbSA9IHN0cmVhbTtcblxuICB2YXIgaXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSk7XG4gIGlmIChpc1N0cmVhbUxpa2UpIHtcbiAgICBzdHJlYW0ub24oJ2VuZCcsIHRoaXMuX2dldE5leHQuYmluZCh0aGlzKSk7XG4gICAgc3RyZWFtLnBpcGUodGhpcywge2VuZDogZmFsc2V9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdmFsdWUgPSBzdHJlYW07XG4gIHRoaXMud3JpdGUodmFsdWUpO1xuICB0aGlzLl9nZXROZXh0KCk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX2hhbmRsZUVycm9ycyA9IGZ1bmN0aW9uKHN0cmVhbSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICBzZWxmLl9lbWl0RXJyb3IoZXJyKTtcbiAgfSk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHRoaXMuZW1pdCgnZGF0YScsIGRhdGEpO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5wYXVzZVN0cmVhbXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZih0aGlzLnBhdXNlU3RyZWFtcyAmJiB0aGlzLl9jdXJyZW50U3RyZWFtICYmIHR5cGVvZih0aGlzLl9jdXJyZW50U3RyZWFtLnBhdXNlKSA9PSAnZnVuY3Rpb24nKSB0aGlzLl9jdXJyZW50U3RyZWFtLnBhdXNlKCk7XG4gIHRoaXMuZW1pdCgncGF1c2UnKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLl9yZWxlYXNlZCkge1xuICAgIHRoaXMuX3JlbGVhc2VkID0gdHJ1ZTtcbiAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9nZXROZXh0KCk7XG4gIH1cblxuICBpZih0aGlzLnBhdXNlU3RyZWFtcyAmJiB0aGlzLl9jdXJyZW50U3RyZWFtICYmIHR5cGVvZih0aGlzLl9jdXJyZW50U3RyZWFtLnJlc3VtZSkgPT0gJ2Z1bmN0aW9uJykgdGhpcy5fY3VycmVudFN0cmVhbS5yZXN1bWUoKTtcbiAgdGhpcy5lbWl0KCdyZXN1bWUnKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fcmVzZXQoKTtcbiAgdGhpcy5lbWl0KCdlbmQnKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3Jlc2V0KCk7XG4gIHRoaXMuZW1pdCgnY2xvc2UnKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICB0aGlzLl9zdHJlYW1zID0gW107XG4gIHRoaXMuX2N1cnJlbnRTdHJlYW0gPSBudWxsO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLl9jaGVja0RhdGFTaXplID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3VwZGF0ZURhdGFTaXplKCk7XG4gIGlmICh0aGlzLmRhdGFTaXplIDw9IHRoaXMubWF4RGF0YVNpemUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbWVzc2FnZSA9XG4gICAgJ0RlbGF5ZWRTdHJlYW0jbWF4RGF0YVNpemUgb2YgJyArIHRoaXMubWF4RGF0YVNpemUgKyAnIGJ5dGVzIGV4Y2VlZGVkLic7XG4gIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLl91cGRhdGVEYXRhU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRhdGFTaXplID0gMDtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3N0cmVhbXMuZm9yRWFjaChmdW5jdGlvbihzdHJlYW0pIHtcbiAgICBpZiAoIXN0cmVhbS5kYXRhU2l6ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuZGF0YVNpemUgKz0gc3RyZWFtLmRhdGFTaXplO1xuICB9KTtcblxuICBpZiAodGhpcy5fY3VycmVudFN0cmVhbSAmJiB0aGlzLl9jdXJyZW50U3RyZWFtLmRhdGFTaXplKSB7XG4gICAgdGhpcy5kYXRhU2l6ZSArPSB0aGlzLl9jdXJyZW50U3RyZWFtLmRhdGFTaXplO1xuICB9XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX2VtaXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICB0aGlzLl9yZXNldCgpO1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbn07XG4iLCIvKiFcbiAqIG1pbWUtZGJcbiAqIENvcHlyaWdodChjKSAyMDE0IEpvbmF0aGFuIE9uZ1xuICogQ29weXJpZ2h0KGMpIDIwMTUtMjAyMiBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGIuanNvbicpXG4iLCIvKiFcbiAqIG1pbWUtdHlwZXNcbiAqIENvcHlyaWdodChjKSAyMDE0IEpvbmF0aGFuIE9uZ1xuICogQ29weXJpZ2h0KGMpIDIwMTUgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBkYiA9IHJlcXVpcmUoJ21pbWUtZGInKVxudmFyIGV4dG5hbWUgPSByZXF1aXJlKCdwYXRoJykuZXh0bmFtZVxuXG4vKipcbiAqIE1vZHVsZSB2YXJpYWJsZXMuXG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBFWFRSQUNUX1RZUEVfUkVHRVhQID0gL15cXHMqKFteO1xcc10qKSg/Ojt8XFxzfCQpL1xudmFyIFRFWFRfVFlQRV9SRUdFWFAgPSAvXnRleHRcXC8vaVxuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY2hhcnNldCA9IGNoYXJzZXRcbmV4cG9ydHMuY2hhcnNldHMgPSB7IGxvb2t1cDogY2hhcnNldCB9XG5leHBvcnRzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGVcbmV4cG9ydHMuZXh0ZW5zaW9uID0gZXh0ZW5zaW9uXG5leHBvcnRzLmV4dGVuc2lvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5leHBvcnRzLmxvb2t1cCA9IGxvb2t1cFxuZXhwb3J0cy50eXBlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuLy8gUG9wdWxhdGUgdGhlIGV4dGVuc2lvbnMvdHlwZXMgbWFwc1xucG9wdWxhdGVNYXBzKGV4cG9ydHMuZXh0ZW5zaW9ucywgZXhwb3J0cy50eXBlcylcblxuLyoqXG4gKiBHZXQgdGhlIGRlZmF1bHQgY2hhcnNldCBmb3IgYSBNSU1FIHR5cGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGNoYXJzZXQgKHR5cGUpIHtcbiAgaWYgKCF0eXBlIHx8IHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gVE9ETzogdXNlIG1lZGlhLXR5cGVyXG4gIHZhciBtYXRjaCA9IEVYVFJBQ1RfVFlQRV9SRUdFWFAuZXhlYyh0eXBlKVxuICB2YXIgbWltZSA9IG1hdGNoICYmIGRiW21hdGNoWzFdLnRvTG93ZXJDYXNlKCldXG5cbiAgaWYgKG1pbWUgJiYgbWltZS5jaGFyc2V0KSB7XG4gICAgcmV0dXJuIG1pbWUuY2hhcnNldFxuICB9XG5cbiAgLy8gZGVmYXVsdCB0ZXh0LyogdG8gdXRmLThcbiAgaWYgKG1hdGNoICYmIFRFWFRfVFlQRV9SRUdFWFAudGVzdChtYXRjaFsxXSkpIHtcbiAgICByZXR1cm4gJ1VURi04J1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVsbCBDb250ZW50LVR5cGUgaGVhZGVyIGdpdmVuIGEgTUlNRSB0eXBlIG9yIGV4dGVuc2lvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtib29sZWFufHN0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBjb250ZW50VHlwZSAoc3RyKSB7XG4gIC8vIFRPRE86IHNob3VsZCB0aGlzIGV2ZW4gYmUgaW4gdGhpcyBtb2R1bGU/XG4gIGlmICghc3RyIHx8IHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB2YXIgbWltZSA9IHN0ci5pbmRleE9mKCcvJykgPT09IC0xXG4gICAgPyBleHBvcnRzLmxvb2t1cChzdHIpXG4gICAgOiBzdHJcblxuICBpZiAoIW1pbWUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIFRPRE86IHVzZSBjb250ZW50LXR5cGUgb3Igb3RoZXIgbW9kdWxlXG4gIGlmIChtaW1lLmluZGV4T2YoJ2NoYXJzZXQnKSA9PT0gLTEpIHtcbiAgICB2YXIgY2hhcnNldCA9IGV4cG9ydHMuY2hhcnNldChtaW1lKVxuICAgIGlmIChjaGFyc2V0KSBtaW1lICs9ICc7IGNoYXJzZXQ9JyArIGNoYXJzZXQudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgcmV0dXJuIG1pbWVcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRlZmF1bHQgZXh0ZW5zaW9uIGZvciBhIE1JTUUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gZXh0ZW5zaW9uICh0eXBlKSB7XG4gIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIFRPRE86IHVzZSBtZWRpYS10eXBlclxuICB2YXIgbWF0Y2ggPSBFWFRSQUNUX1RZUEVfUkVHRVhQLmV4ZWModHlwZSlcblxuICAvLyBnZXQgZXh0ZW5zaW9uc1xuICB2YXIgZXh0cyA9IG1hdGNoICYmIGV4cG9ydHMuZXh0ZW5zaW9uc1ttYXRjaFsxXS50b0xvd2VyQ2FzZSgpXVxuXG4gIGlmICghZXh0cyB8fCAhZXh0cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiBleHRzWzBdXG59XG5cbi8qKlxuICogTG9va3VwIHRoZSBNSU1FIHR5cGUgZm9yIGEgZmlsZSBwYXRoL2V4dGVuc2lvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gbG9va3VwIChwYXRoKSB7XG4gIGlmICghcGF0aCB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIGdldCB0aGUgZXh0ZW5zaW9uIChcImV4dFwiIG9yIFwiLmV4dFwiIG9yIGZ1bGwgcGF0aClcbiAgdmFyIGV4dGVuc2lvbiA9IGV4dG5hbWUoJ3guJyArIHBhdGgpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAuc3Vic3RyKDEpXG5cbiAgaWYgKCFleHRlbnNpb24pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLnR5cGVzW2V4dGVuc2lvbl0gfHwgZmFsc2Vcbn1cblxuLyoqXG4gKiBQb3B1bGF0ZSB0aGUgZXh0ZW5zaW9ucyBhbmQgdHlwZXMgbWFwcy5cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcG9wdWxhdGVNYXBzIChleHRlbnNpb25zLCB0eXBlcykge1xuICAvLyBzb3VyY2UgcHJlZmVyZW5jZSAobGVhc3QgLT4gbW9zdClcbiAgdmFyIHByZWZlcmVuY2UgPSBbJ25naW54JywgJ2FwYWNoZScsIHVuZGVmaW5lZCwgJ2lhbmEnXVxuXG4gIE9iamVjdC5rZXlzKGRiKS5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2hNaW1lVHlwZSAodHlwZSkge1xuICAgIHZhciBtaW1lID0gZGJbdHlwZV1cbiAgICB2YXIgZXh0cyA9IG1pbWUuZXh0ZW5zaW9uc1xuXG4gICAgaWYgKCFleHRzIHx8ICFleHRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gbWltZSAtPiBleHRlbnNpb25zXG4gICAgZXh0ZW5zaW9uc1t0eXBlXSA9IGV4dHNcblxuICAgIC8vIGV4dGVuc2lvbiAtPiBtaW1lXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZXh0ZW5zaW9uID0gZXh0c1tpXVxuXG4gICAgICBpZiAodHlwZXNbZXh0ZW5zaW9uXSkge1xuICAgICAgICB2YXIgZnJvbSA9IHByZWZlcmVuY2UuaW5kZXhPZihkYlt0eXBlc1tleHRlbnNpb25dXS5zb3VyY2UpXG4gICAgICAgIHZhciB0byA9IHByZWZlcmVuY2UuaW5kZXhPZihtaW1lLnNvdXJjZSlcblxuICAgICAgICBpZiAodHlwZXNbZXh0ZW5zaW9uXSAhPT0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgJiZcbiAgICAgICAgICAoZnJvbSA+IHRvIHx8IChmcm9tID09PSB0byAmJiB0eXBlc1tleHRlbnNpb25dLnN1YnN0cigwLCAxMikgPT09ICdhcHBsaWNhdGlvbi8nKSkpIHtcbiAgICAgICAgICAvLyBza2lwIHRoZSByZW1hcHBpbmdcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB0aGUgZXh0ZW5zaW9uIC0+IG1pbWVcbiAgICAgIHR5cGVzW2V4dGVuc2lvbl0gPSB0eXBlXG4gICAgfVxuICB9KVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBkZWZlcjtcblxuLyoqXG4gKiBSdW5zIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBldmVudCBsb29wXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBmdW5jdGlvbiB0byBydW5cbiAqL1xuZnVuY3Rpb24gZGVmZXIoZm4pXG57XG4gIHZhciBuZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT0gJ2Z1bmN0aW9uJ1xuICAgID8gc2V0SW1tZWRpYXRlXG4gICAgOiAoXG4gICAgICB0eXBlb2YgcHJvY2VzcyA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PSAnZnVuY3Rpb24nXG4gICAgICA/IHByb2Nlc3MubmV4dFRpY2tcbiAgICAgIDogbnVsbFxuICAgICk7XG5cbiAgaWYgKG5leHRUaWNrKVxuICB7XG4gICAgbmV4dFRpY2soZm4pO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICB9XG59XG4iLCJ2YXIgZGVmZXIgPSByZXF1aXJlKCcuL2RlZmVyLmpzJyk7XG5cbi8vIEFQSVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYztcblxuLyoqXG4gKiBSdW5zIHByb3ZpZGVkIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5XG4gKiBldmVuIGlmIGNhbGxiYWNrIGl0c2VsZiBpcyBub3RcbiAqXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gaW52b2tlXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IC0gYXVnbWVudGVkIGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGFzeW5jKGNhbGxiYWNrKVxue1xuICB2YXIgaXNBc3luYyA9IGZhbHNlO1xuXG4gIC8vIGNoZWNrIGlmIGFzeW5jIGhhcHBlbmVkXG4gIGRlZmVyKGZ1bmN0aW9uKCkgeyBpc0FzeW5jID0gdHJ1ZTsgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jX2NhbGxiYWNrKGVyciwgcmVzdWx0KVxuICB7XG4gICAgaWYgKGlzQXN5bmMpXG4gICAge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgZGVmZXIoZnVuY3Rpb24gbmV4dFRpY2tfY2FsbGJhY2soKVxuICAgICAge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCIvLyBBUElcbm1vZHVsZS5leHBvcnRzID0gYWJvcnQ7XG5cbi8qKlxuICogQWJvcnRzIGxlZnRvdmVyIGFjdGl2ZSBqb2JzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlIC0gY3VycmVudCBzdGF0ZSBvYmplY3RcbiAqL1xuZnVuY3Rpb24gYWJvcnQoc3RhdGUpXG57XG4gIE9iamVjdC5rZXlzKHN0YXRlLmpvYnMpLmZvckVhY2goY2xlYW4uYmluZChzdGF0ZSkpO1xuXG4gIC8vIHJlc2V0IGxlZnRvdmVyIGpvYnNcbiAgc3RhdGUuam9icyA9IHt9O1xufVxuXG4vKipcbiAqIENsZWFucyB1cCBsZWZ0b3ZlciBqb2IgYnkgaW52b2tpbmcgYWJvcnQgZnVuY3Rpb24gZm9yIHRoZSBwcm92aWRlZCBqb2IgaWRcbiAqXG4gKiBAdGhpcyAgc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0ga2V5IC0gam9iIGlkIHRvIGFib3J0XG4gKi9cbmZ1bmN0aW9uIGNsZWFuKGtleSlcbntcbiAgaWYgKHR5cGVvZiB0aGlzLmpvYnNba2V5XSA9PSAnZnVuY3Rpb24nKVxuICB7XG4gICAgdGhpcy5qb2JzW2tleV0oKTtcbiAgfVxufVxuIiwidmFyIGFzeW5jID0gcmVxdWlyZSgnLi9hc3luYy5qcycpXG4gICwgYWJvcnQgPSByZXF1aXJlKCcuL2Fib3J0LmpzJylcbiAgO1xuXG4vLyBBUElcbm1vZHVsZS5leHBvcnRzID0gaXRlcmF0ZTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVhY2ggam9iIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7YXJyYXl8b2JqZWN0fSBsaXN0IC0gYXJyYXkgb3Igb2JqZWN0IChuYW1lZCBsaXN0KSB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdG9yIC0gaXRlcmF0b3IgdG8gcnVuXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgLSBjdXJyZW50IGpvYiBzdGF0dXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gaW52b2tlZCB3aGVuIGFsbCBlbGVtZW50cyBwcm9jZXNzZWRcbiAqL1xuZnVuY3Rpb24gaXRlcmF0ZShsaXN0LCBpdGVyYXRvciwgc3RhdGUsIGNhbGxiYWNrKVxue1xuICAvLyBzdG9yZSBjdXJyZW50IGluZGV4XG4gIHZhciBrZXkgPSBzdGF0ZVsna2V5ZWRMaXN0J10gPyBzdGF0ZVsna2V5ZWRMaXN0J11bc3RhdGUuaW5kZXhdIDogc3RhdGUuaW5kZXg7XG5cbiAgc3RhdGUuam9ic1trZXldID0gcnVuSm9iKGl0ZXJhdG9yLCBrZXksIGxpc3Rba2V5XSwgZnVuY3Rpb24oZXJyb3IsIG91dHB1dClcbiAge1xuICAgIC8vIGRvbid0IHJlcGVhdCB5b3Vyc2VsZlxuICAgIC8vIHNraXAgc2Vjb25kYXJ5IGNhbGxiYWNrc1xuICAgIGlmICghKGtleSBpbiBzdGF0ZS5qb2JzKSlcbiAgICB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2xlYW4gdXAgam9ic1xuICAgIGRlbGV0ZSBzdGF0ZS5qb2JzW2tleV07XG5cbiAgICBpZiAoZXJyb3IpXG4gICAge1xuICAgICAgLy8gZG9uJ3QgcHJvY2VzcyByZXN0IG9mIHRoZSByZXN1bHRzXG4gICAgICAvLyBzdG9wIHN0aWxsIGFjdGl2ZSBqb2JzXG4gICAgICAvLyBhbmQgcmVzZXQgdGhlIGxpc3RcbiAgICAgIGFib3J0KHN0YXRlKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHN0YXRlLnJlc3VsdHNba2V5XSA9IG91dHB1dDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gc2FsdmFnZWQgcmVzdWx0c1xuICAgIGNhbGxiYWNrKGVycm9yLCBzdGF0ZS5yZXN1bHRzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUnVucyBpdGVyYXRvciBvdmVyIHByb3ZpZGVkIGpvYiBlbGVtZW50XG4gKlxuICogQHBhcmFtICAge2Z1bmN0aW9ufSBpdGVyYXRvciAtIGl0ZXJhdG9yIHRvIGludm9rZVxuICogQHBhcmFtICAge3N0cmluZ3xudW1iZXJ9IGtleSAtIGtleS9pbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbGlzdCBvZiBqb2JzXG4gKiBAcGFyYW0gICB7bWl4ZWR9IGl0ZW0gLSBqb2IgZGVzY3JpcHRpb25cbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBpbnZva2VkIGFmdGVyIGl0ZXJhdG9yIGlzIGRvbmUgd2l0aCB0aGUgam9iXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb258bWl4ZWR9IC0gam9iIGFib3J0IGZ1bmN0aW9uIG9yIHNvbWV0aGluZyBlbHNlXG4gKi9cbmZ1bmN0aW9uIHJ1bkpvYihpdGVyYXRvciwga2V5LCBpdGVtLCBjYWxsYmFjaylcbntcbiAgdmFyIGFib3J0ZXI7XG5cbiAgLy8gYWxsb3cgc2hvcnRjdXQgaWYgaXRlcmF0b3IgZXhwZWN0cyBvbmx5IHR3byBhcmd1bWVudHNcbiAgaWYgKGl0ZXJhdG9yLmxlbmd0aCA9PSAyKVxuICB7XG4gICAgYWJvcnRlciA9IGl0ZXJhdG9yKGl0ZW0sIGFzeW5jKGNhbGxiYWNrKSk7XG4gIH1cbiAgLy8gb3RoZXJ3aXNlIGdvIHdpdGggZnVsbCB0aHJlZSBhcmd1bWVudHNcbiAgZWxzZVxuICB7XG4gICAgYWJvcnRlciA9IGl0ZXJhdG9yKGl0ZW0sIGtleSwgYXN5bmMoY2FsbGJhY2spKTtcbiAgfVxuXG4gIHJldHVybiBhYm9ydGVyO1xufVxuIiwiLy8gQVBJXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlO1xuXG4vKipcbiAqIENyZWF0ZXMgaW5pdGlhbCBzdGF0ZSBvYmplY3RcbiAqIGZvciBpdGVyYXRpb24gb3ZlciBsaXN0XG4gKlxuICogQHBhcmFtICAge2FycmF5fG9iamVjdH0gbGlzdCAtIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb258bnVsbH0gc29ydE1ldGhvZCAtIGZ1bmN0aW9uIHRvIHVzZSBmb3Iga2V5cyBzb3J0LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgYG51bGxgIHRvIGtlZXAgdGhlbSBhcyBpc1xuICogQHJldHVybnMge29iamVjdH0gLSBpbml0aWFsIHN0YXRlIG9iamVjdFxuICovXG5mdW5jdGlvbiBzdGF0ZShsaXN0LCBzb3J0TWV0aG9kKVxue1xuICB2YXIgaXNOYW1lZExpc3QgPSAhQXJyYXkuaXNBcnJheShsaXN0KVxuICAgICwgaW5pdFN0YXRlID1cbiAgICB7XG4gICAgICBpbmRleCAgICA6IDAsXG4gICAgICBrZXllZExpc3Q6IGlzTmFtZWRMaXN0IHx8IHNvcnRNZXRob2QgPyBPYmplY3Qua2V5cyhsaXN0KSA6IG51bGwsXG4gICAgICBqb2JzICAgICA6IHt9LFxuICAgICAgcmVzdWx0cyAgOiBpc05hbWVkTGlzdCA/IHt9IDogW10sXG4gICAgICBzaXplICAgICA6IGlzTmFtZWRMaXN0ID8gT2JqZWN0LmtleXMobGlzdCkubGVuZ3RoIDogbGlzdC5sZW5ndGhcbiAgICB9XG4gICAgO1xuXG4gIGlmIChzb3J0TWV0aG9kKVxuICB7XG4gICAgLy8gc29ydCBhcnJheSBrZXlzIGJhc2VkIG9uIGl0J3MgdmFsdWVzXG4gICAgLy8gc29ydCBvYmplY3QncyBrZXlzIGp1c3Qgb24gb3duIG1lcml0XG4gICAgaW5pdFN0YXRlLmtleWVkTGlzdC5zb3J0KGlzTmFtZWRMaXN0ID8gc29ydE1ldGhvZCA6IGZ1bmN0aW9uKGEsIGIpXG4gICAge1xuICAgICAgcmV0dXJuIHNvcnRNZXRob2QobGlzdFthXSwgbGlzdFtiXSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gaW5pdFN0YXRlO1xufVxuIiwidmFyIGFib3J0ID0gcmVxdWlyZSgnLi9hYm9ydC5qcycpXG4gICwgYXN5bmMgPSByZXF1aXJlKCcuL2FzeW5jLmpzJylcbiAgO1xuXG4vLyBBUElcbm1vZHVsZS5leHBvcnRzID0gdGVybWluYXRvcjtcblxuLyoqXG4gKiBUZXJtaW5hdGVzIGpvYnMgaW4gdGhlIGF0dGFjaGVkIHN0YXRlIGNvbnRleHRcbiAqXG4gKiBAdGhpcyAgQXN5bmNLaXRTdGF0ZSNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZmluYWwgY2FsbGJhY2sgdG8gaW52b2tlIGFmdGVyIHRlcm1pbmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHRlcm1pbmF0b3IoY2FsbGJhY2spXG57XG4gIGlmICghT2JqZWN0LmtleXModGhpcy5qb2JzKS5sZW5ndGgpXG4gIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBmYXN0IGZvcndhcmQgaXRlcmF0aW9uIGluZGV4XG4gIHRoaXMuaW5kZXggPSB0aGlzLnNpemU7XG5cbiAgLy8gYWJvcnQgam9ic1xuICBhYm9ydCh0aGlzKTtcblxuICAvLyBzZW5kIGJhY2sgcmVzdWx0cyB3ZSBoYXZlIHNvIGZhclxuICBhc3luYyhjYWxsYmFjaykobnVsbCwgdGhpcy5yZXN1bHRzKTtcbn1cbiIsInZhciBpdGVyYXRlICAgID0gcmVxdWlyZSgnLi9saWIvaXRlcmF0ZS5qcycpXG4gICwgaW5pdFN0YXRlICA9IHJlcXVpcmUoJy4vbGliL3N0YXRlLmpzJylcbiAgLCB0ZXJtaW5hdG9yID0gcmVxdWlyZSgnLi9saWIvdGVybWluYXRvci5qcycpXG4gIDtcblxuLy8gUHVibGljIEFQSVxubW9kdWxlLmV4cG9ydHMgPSBwYXJhbGxlbDtcblxuLyoqXG4gKiBSdW5zIGl0ZXJhdG9yIG92ZXIgcHJvdmlkZWQgYXJyYXkgZWxlbWVudHMgaW4gcGFyYWxsZWxcbiAqXG4gKiBAcGFyYW0gICB7YXJyYXl8b2JqZWN0fSBsaXN0IC0gYXJyYXkgb3Igb2JqZWN0IChuYW1lZCBsaXN0KSB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBpdGVyYXRvciB0byBydW5cbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBpbnZva2VkIHdoZW4gYWxsIGVsZW1lbnRzIHByb2Nlc3NlZFxuICogQHJldHVybnMge2Z1bmN0aW9ufSAtIGpvYnMgdGVybWluYXRvclxuICovXG5mdW5jdGlvbiBwYXJhbGxlbChsaXN0LCBpdGVyYXRvciwgY2FsbGJhY2spXG57XG4gIHZhciBzdGF0ZSA9IGluaXRTdGF0ZShsaXN0KTtcblxuICB3aGlsZSAoc3RhdGUuaW5kZXggPCAoc3RhdGVbJ2tleWVkTGlzdCddIHx8IGxpc3QpLmxlbmd0aClcbiAge1xuICAgIGl0ZXJhdGUobGlzdCwgaXRlcmF0b3IsIHN0YXRlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KVxuICAgIHtcbiAgICAgIGlmIChlcnJvcilcbiAgICAgIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gbG9va3MgbGlrZSBpdCdzIHRoZSBsYXN0IG9uZVxuICAgICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlLmpvYnMpLmxlbmd0aCA9PT0gMClcbiAgICAgIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgc3RhdGUucmVzdWx0cyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHN0YXRlLmluZGV4Kys7XG4gIH1cblxuICByZXR1cm4gdGVybWluYXRvci5iaW5kKHN0YXRlLCBjYWxsYmFjayk7XG59XG4iLCJ2YXIgaXRlcmF0ZSAgICA9IHJlcXVpcmUoJy4vbGliL2l0ZXJhdGUuanMnKVxuICAsIGluaXRTdGF0ZSAgPSByZXF1aXJlKCcuL2xpYi9zdGF0ZS5qcycpXG4gICwgdGVybWluYXRvciA9IHJlcXVpcmUoJy4vbGliL3Rlcm1pbmF0b3IuanMnKVxuICA7XG5cbi8vIFB1YmxpYyBBUElcbm1vZHVsZS5leHBvcnRzID0gc2VyaWFsT3JkZXJlZDtcbi8vIHNvcnRpbmcgaGVscGVyc1xubW9kdWxlLmV4cG9ydHMuYXNjZW5kaW5nICA9IGFzY2VuZGluZztcbm1vZHVsZS5leHBvcnRzLmRlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xuXG4vKipcbiAqIFJ1bnMgaXRlcmF0b3Igb3ZlciBwcm92aWRlZCBzb3J0ZWQgYXJyYXkgZWxlbWVudHMgaW4gc2VyaWVzXG4gKlxuICogQHBhcmFtICAge2FycmF5fG9iamVjdH0gbGlzdCAtIGFycmF5IG9yIG9iamVjdCAobmFtZWQgbGlzdCkgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb259IGl0ZXJhdG9yIC0gaXRlcmF0b3IgdG8gcnVuXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb259IHNvcnRNZXRob2QgLSBjdXN0b20gc29ydCBmdW5jdGlvblxuICogQHBhcmFtICAge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGludm9rZWQgd2hlbiBhbGwgZWxlbWVudHMgcHJvY2Vzc2VkXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IC0gam9icyB0ZXJtaW5hdG9yXG4gKi9cbmZ1bmN0aW9uIHNlcmlhbE9yZGVyZWQobGlzdCwgaXRlcmF0b3IsIHNvcnRNZXRob2QsIGNhbGxiYWNrKVxue1xuICB2YXIgc3RhdGUgPSBpbml0U3RhdGUobGlzdCwgc29ydE1ldGhvZCk7XG5cbiAgaXRlcmF0ZShsaXN0LCBpdGVyYXRvciwgc3RhdGUsIGZ1bmN0aW9uIGl0ZXJhdG9ySGFuZGxlcihlcnJvciwgcmVzdWx0KVxuICB7XG4gICAgaWYgKGVycm9yKVxuICAgIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXRlLmluZGV4Kys7XG5cbiAgICAvLyBhcmUgd2UgdGhlcmUgeWV0P1xuICAgIGlmIChzdGF0ZS5pbmRleCA8IChzdGF0ZVsna2V5ZWRMaXN0J10gfHwgbGlzdCkubGVuZ3RoKVxuICAgIHtcbiAgICAgIGl0ZXJhdGUobGlzdCwgaXRlcmF0b3IsIHN0YXRlLCBpdGVyYXRvckhhbmRsZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGRvbmUgaGVyZVxuICAgIGNhbGxiYWNrKG51bGwsIHN0YXRlLnJlc3VsdHMpO1xuICB9KTtcblxuICByZXR1cm4gdGVybWluYXRvci5iaW5kKHN0YXRlLCBjYWxsYmFjayk7XG59XG5cbi8qXG4gKiAtLSBTb3J0IG1ldGhvZHNcbiAqL1xuXG4vKipcbiAqIHNvcnQgaGVscGVyIHRvIHNvcnQgYXJyYXkgZWxlbWVudHMgaW4gYXNjZW5kaW5nIG9yZGVyXG4gKlxuICogQHBhcmFtICAge21peGVkfSBhIC0gYW4gaXRlbSB0byBjb21wYXJlXG4gKiBAcGFyYW0gICB7bWl4ZWR9IGIgLSBhbiBpdGVtIHRvIGNvbXBhcmVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gY29tcGFyaXNvbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpXG57XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbn1cblxuLyoqXG4gKiBzb3J0IGhlbHBlciB0byBzb3J0IGFycmF5IGVsZW1lbnRzIGluIGRlc2NlbmRpbmcgb3JkZXJcbiAqXG4gKiBAcGFyYW0gICB7bWl4ZWR9IGEgLSBhbiBpdGVtIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSAgIHttaXhlZH0gYiAtIGFuIGl0ZW0gdG8gY29tcGFyZVxuICogQHJldHVybnMge251bWJlcn0gLSBjb21wYXJpc29uIHJlc3VsdFxuICovXG5mdW5jdGlvbiBkZXNjZW5kaW5nKGEsIGIpXG57XG4gIHJldHVybiAtMSAqIGFzY2VuZGluZyhhLCBiKTtcbn1cbiIsInZhciBzZXJpYWxPcmRlcmVkID0gcmVxdWlyZSgnLi9zZXJpYWxPcmRlcmVkLmpzJyk7XG5cbi8vIFB1YmxpYyBBUElcbm1vZHVsZS5leHBvcnRzID0gc2VyaWFsO1xuXG4vKipcbiAqIFJ1bnMgaXRlcmF0b3Igb3ZlciBwcm92aWRlZCBhcnJheSBlbGVtZW50cyBpbiBzZXJpZXNcbiAqXG4gKiBAcGFyYW0gICB7YXJyYXl8b2JqZWN0fSBsaXN0IC0gYXJyYXkgb3Igb2JqZWN0IChuYW1lZCBsaXN0KSB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBpdGVyYXRvciB0byBydW5cbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBpbnZva2VkIHdoZW4gYWxsIGVsZW1lbnRzIHByb2Nlc3NlZFxuICogQHJldHVybnMge2Z1bmN0aW9ufSAtIGpvYnMgdGVybWluYXRvclxuICovXG5mdW5jdGlvbiBzZXJpYWwobGlzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKVxue1xuICByZXR1cm4gc2VyaWFsT3JkZXJlZChsaXN0LCBpdGVyYXRvciwgbnVsbCwgY2FsbGJhY2spO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICBwYXJhbGxlbCAgICAgIDogcmVxdWlyZSgnLi9wYXJhbGxlbC5qcycpLFxuICBzZXJpYWwgICAgICAgIDogcmVxdWlyZSgnLi9zZXJpYWwuanMnKSxcbiAgc2VyaWFsT3JkZXJlZCA6IHJlcXVpcmUoJy4vc2VyaWFsT3JkZXJlZC5qcycpXG59O1xuIiwiLy8gcG9wdWxhdGVzIG1pc3NpbmcgdmFsdWVzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRzdCwgc3JjKSB7XG5cbiAgT2JqZWN0LmtleXMoc3JjKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApXG4gIHtcbiAgICBkc3RbcHJvcF0gPSBkc3RbcHJvcF0gfHwgc3JjW3Byb3BdO1xuICB9KTtcblxuICByZXR1cm4gZHN0O1xufTtcbiIsInZhciBDb21iaW5lZFN0cmVhbSA9IHJlcXVpcmUoJ2NvbWJpbmVkLXN0cmVhbScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciBwYXJzZVVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW07XG52YXIgbWltZSA9IHJlcXVpcmUoJ21pbWUtdHlwZXMnKTtcbnZhciBhc3luY2tpdCA9IHJlcXVpcmUoJ2FzeW5ja2l0Jyk7XG52YXIgcG9wdWxhdGUgPSByZXF1aXJlKCcuL3BvcHVsYXRlLmpzJyk7XG5cbi8vIFB1YmxpYyBBUElcbm1vZHVsZS5leHBvcnRzID0gRm9ybURhdGE7XG5cbi8vIG1ha2UgaXQgYSBTdHJlYW1cbnV0aWwuaW5oZXJpdHMoRm9ybURhdGEsIENvbWJpbmVkU3RyZWFtKTtcblxuLyoqXG4gKiBDcmVhdGUgcmVhZGFibGUgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgc3RyZWFtcy5cbiAqIENhbiBiZSB1c2VkIHRvIHN1Ym1pdCBmb3Jtc1xuICogYW5kIGZpbGUgdXBsb2FkcyB0byBvdGhlciB3ZWIgYXBwbGljYXRpb25zLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQcm9wZXJ0aWVzIHRvIGJlIGFkZGVkL292ZXJyaWRlbiBmb3IgRm9ybURhdGEgYW5kIENvbWJpbmVkU3RyZWFtXG4gKi9cbmZ1bmN0aW9uIEZvcm1EYXRhKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZvcm1EYXRhKSkge1xuICAgIHJldHVybiBuZXcgRm9ybURhdGEob3B0aW9ucyk7XG4gIH1cblxuICB0aGlzLl9vdmVyaGVhZExlbmd0aCA9IDA7XG4gIHRoaXMuX3ZhbHVlTGVuZ3RoID0gMDtcbiAgdGhpcy5fdmFsdWVzVG9NZWFzdXJlID0gW107XG5cbiAgQ29tYmluZWRTdHJlYW0uY2FsbCh0aGlzKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgZm9yICh2YXIgb3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICB0aGlzW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl07XG4gIH1cbn1cblxuRm9ybURhdGEuTElORV9CUkVBSyA9ICdcXHJcXG4nO1xuRm9ybURhdGEuREVGQVVMVF9DT05URU5UX1RZUEUgPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcblxuRm9ybURhdGEucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIGFsbG93IGZpbGVuYW1lIGFzIHNpbmdsZSBvcHRpb25cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09ICdzdHJpbmcnKSB7XG4gICAgb3B0aW9ucyA9IHtmaWxlbmFtZTogb3B0aW9uc307XG4gIH1cblxuICB2YXIgYXBwZW5kID0gQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLmFwcGVuZC5iaW5kKHRoaXMpO1xuXG4gIC8vIGFsbCB0aGF0IHN0cmVhbXkgYnVzaW5lc3MgY2FuJ3QgaGFuZGxlIG51bWJlcnNcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHZhbHVlID0gJycgKyB2YWx1ZTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZWxpeGdlL25vZGUtZm9ybS1kYXRhL2lzc3Vlcy8zOFxuICBpZiAodXRpbC5pc0FycmF5KHZhbHVlKSkge1xuICAgIC8vIFBsZWFzZSBjb252ZXJ0IHlvdXIgYXJyYXkgaW50byBzdHJpbmdcbiAgICAvLyB0aGUgd2F5IHdlYiBzZXJ2ZXIgZXhwZWN0cyBpdFxuICAgIHRoaXMuX2Vycm9yKG5ldyBFcnJvcignQXJyYXlzIGFyZSBub3Qgc3VwcG9ydGVkLicpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaGVhZGVyID0gdGhpcy5fbXVsdGlQYXJ0SGVhZGVyKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucyk7XG4gIHZhciBmb290ZXIgPSB0aGlzLl9tdWx0aVBhcnRGb290ZXIoKTtcblxuICBhcHBlbmQoaGVhZGVyKTtcbiAgYXBwZW5kKHZhbHVlKTtcbiAgYXBwZW5kKGZvb3Rlcik7XG5cbiAgLy8gcGFzcyBhbG9uZyBvcHRpb25zLmtub3duTGVuZ3RoXG4gIHRoaXMuX3RyYWNrTGVuZ3RoKGhlYWRlciwgdmFsdWUsIG9wdGlvbnMpO1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLl90cmFja0xlbmd0aCA9IGZ1bmN0aW9uKGhlYWRlciwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHZhbHVlTGVuZ3RoID0gMDtcblxuICAvLyB1c2VkIHcvIGdldExlbmd0aFN5bmMoKSwgd2hlbiBsZW5ndGggaXMga25vd24uXG4gIC8vIGUuZy4gZm9yIHN0cmVhbWluZyBkaXJlY3RseSBmcm9tIGEgcmVtb3RlIHNlcnZlcixcbiAgLy8gdy8gYSBrbm93biBmaWxlIGEgc2l6ZSwgYW5kIG5vdCB3YW50aW5nIHRvIHdhaXQgZm9yXG4gIC8vIGluY29taW5nIGZpbGUgdG8gZmluaXNoIHRvIGdldCBpdHMgc2l6ZS5cbiAgaWYgKG9wdGlvbnMua25vd25MZW5ndGggIT0gbnVsbCkge1xuICAgIHZhbHVlTGVuZ3RoICs9ICtvcHRpb25zLmtub3duTGVuZ3RoO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWVMZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aCh2YWx1ZSk7XG4gIH1cblxuICB0aGlzLl92YWx1ZUxlbmd0aCArPSB2YWx1ZUxlbmd0aDtcblxuICAvLyBAY2hlY2sgd2h5IGFkZCBDUkxGPyBkb2VzIHRoaXMgYWNjb3VudCBmb3IgY3VzdG9tL211bHRpcGxlIENSTEZzP1xuICB0aGlzLl9vdmVyaGVhZExlbmd0aCArPVxuICAgIEJ1ZmZlci5ieXRlTGVuZ3RoKGhlYWRlcikgK1xuICAgIEZvcm1EYXRhLkxJTkVfQlJFQUsubGVuZ3RoO1xuXG4gIC8vIGVtcHR5IG9yIGVpdGhlciBkb2Vzbid0IGhhdmUgcGF0aCBvciBub3QgYW4gaHR0cCByZXNwb25zZSBvciBub3QgYSBzdHJlYW1cbiAgaWYgKCF2YWx1ZSB8fCAoICF2YWx1ZS5wYXRoICYmICEodmFsdWUucmVhZGFibGUgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoJ2h0dHBWZXJzaW9uJykpICYmICEodmFsdWUgaW5zdGFuY2VvZiBTdHJlYW0pKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIG5vIG5lZWQgdG8gYm90aGVyIHdpdGggdGhlIGxlbmd0aFxuICBpZiAoIW9wdGlvbnMua25vd25MZW5ndGgpIHtcbiAgICB0aGlzLl92YWx1ZXNUb01lYXN1cmUucHVzaCh2YWx1ZSk7XG4gIH1cbn07XG5cbkZvcm1EYXRhLnByb3RvdHlwZS5fbGVuZ3RoUmV0cmlldmVyID0gZnVuY3Rpb24odmFsdWUsIGNhbGxiYWNrKSB7XG5cbiAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KCdmZCcpKSB7XG5cbiAgICAvLyB0YWtlIHJlYWQgcmFuZ2UgaW50byBhIGFjY291bnRcbiAgICAvLyBgZW5kYCA9IEluZmluaXR5IOKAkz4gcmVhZCBmaWxlIHRpbGwgdGhlIGVuZFxuICAgIC8vXG4gICAgLy8gVE9ETzogTG9va3MgbGlrZSB0aGVyZSBpcyBidWcgaW4gTm9kZSBmcy5jcmVhdGVSZWFkU3RyZWFtXG4gICAgLy8gaXQgZG9lc24ndCByZXNwZWN0IGBlbmRgIG9wdGlvbnMgd2l0aG91dCBgc3RhcnRgIG9wdGlvbnNcbiAgICAvLyBGaXggaXQgd2hlbiBub2RlIGZpeGVzIGl0LlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvNzgxOVxuICAgIGlmICh2YWx1ZS5lbmQgIT0gdW5kZWZpbmVkICYmIHZhbHVlLmVuZCAhPSBJbmZpbml0eSAmJiB2YWx1ZS5zdGFydCAhPSB1bmRlZmluZWQpIHtcblxuICAgICAgLy8gd2hlbiBlbmQgc3BlY2lmaWVkXG4gICAgICAvLyBubyBuZWVkIHRvIGNhbGN1bGF0ZSByYW5nZVxuICAgICAgLy8gaW5jbHVzaXZlLCBzdGFydHMgd2l0aCAwXG4gICAgICBjYWxsYmFjayhudWxsLCB2YWx1ZS5lbmQgKyAxIC0gKHZhbHVlLnN0YXJ0ID8gdmFsdWUuc3RhcnQgOiAwKSk7XG5cbiAgICAvLyBub3QgdGhhdCBmYXN0IHNub29weVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzdGlsbCBuZWVkIHRvIGZldGNoIGZpbGUgc2l6ZSBmcm9tIGZzXG4gICAgICBmcy5zdGF0KHZhbHVlLnBhdGgsIGZ1bmN0aW9uKGVyciwgc3RhdCkge1xuXG4gICAgICAgIHZhciBmaWxlU2l6ZTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgZmluYWwgc2l6ZSBiYXNlZCBvbiB0aGUgcmFuZ2Ugb3B0aW9uc1xuICAgICAgICBmaWxlU2l6ZSA9IHN0YXQuc2l6ZSAtICh2YWx1ZS5zdGFydCA/IHZhbHVlLnN0YXJ0IDogMCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbGVTaXplKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAvLyBvciBodHRwIHJlc3BvbnNlXG4gIH0gZWxzZSBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoJ2h0dHBWZXJzaW9uJykpIHtcbiAgICBjYWxsYmFjayhudWxsLCArdmFsdWUuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSk7XG5cbiAgLy8gb3IgcmVxdWVzdCBzdHJlYW0gaHR0cDovL2dpdGh1Yi5jb20vbWlrZWFsL3JlcXVlc3RcbiAgfSBlbHNlIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnaHR0cE1vZHVsZScpKSB7XG4gICAgLy8gd2FpdCB0aWxsIHJlc3BvbnNlIGNvbWUgYmFja1xuICAgIHZhbHVlLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICB2YWx1ZS5wYXVzZSgpO1xuICAgICAgY2FsbGJhY2sobnVsbCwgK3Jlc3BvbnNlLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pO1xuICAgIH0pO1xuICAgIHZhbHVlLnJlc3VtZSgpO1xuXG4gIC8vIHNvbWV0aGluZyBlbHNlXG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soJ1Vua25vd24gc3RyZWFtJyk7XG4gIH1cbn07XG5cbkZvcm1EYXRhLnByb3RvdHlwZS5fbXVsdGlQYXJ0SGVhZGVyID0gZnVuY3Rpb24oZmllbGQsIHZhbHVlLCBvcHRpb25zKSB7XG4gIC8vIGN1c3RvbSBoZWFkZXIgc3BlY2lmaWVkIChhcyBzdHJpbmcpP1xuICAvLyBpdCBiZWNvbWVzIHJlc3BvbnNpYmxlIGZvciBib3VuZGFyeVxuICAvLyAoZS5nLiB0byBoYW5kbGUgZXh0cmEgQ1JMRnMgb24gLk5FVCBzZXJ2ZXJzKVxuICBpZiAodHlwZW9mIG9wdGlvbnMuaGVhZGVyID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuaGVhZGVyO1xuICB9XG5cbiAgdmFyIGNvbnRlbnREaXNwb3NpdGlvbiA9IHRoaXMuX2dldENvbnRlbnREaXNwb3NpdGlvbih2YWx1ZSwgb3B0aW9ucyk7XG4gIHZhciBjb250ZW50VHlwZSA9IHRoaXMuX2dldENvbnRlbnRUeXBlKHZhbHVlLCBvcHRpb25zKTtcblxuICB2YXIgY29udGVudHMgPSAnJztcbiAgdmFyIGhlYWRlcnMgID0ge1xuICAgIC8vIGFkZCBjdXN0b20gZGlzcG9zaXRpb24gYXMgdGhpcmQgZWxlbWVudCBvciBrZWVwIGl0IHR3byBlbGVtZW50cyBpZiBub3RcbiAgICAnQ29udGVudC1EaXNwb3NpdGlvbic6IFsnZm9ybS1kYXRhJywgJ25hbWU9XCInICsgZmllbGQgKyAnXCInXS5jb25jYXQoY29udGVudERpc3Bvc2l0aW9uIHx8IFtdKSxcbiAgICAvLyBpZiBubyBjb250ZW50IHR5cGUuIGFsbG93IGl0IHRvIGJlIGVtcHR5IGFycmF5XG4gICAgJ0NvbnRlbnQtVHlwZSc6IFtdLmNvbmNhdChjb250ZW50VHlwZSB8fCBbXSlcbiAgfTtcblxuICAvLyBhbGxvdyBjdXN0b20gaGVhZGVycy5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmhlYWRlciA9PSAnb2JqZWN0Jykge1xuICAgIHBvcHVsYXRlKGhlYWRlcnMsIG9wdGlvbnMuaGVhZGVyKTtcbiAgfVxuXG4gIHZhciBoZWFkZXI7XG4gIGZvciAodmFyIHByb3AgaW4gaGVhZGVycykge1xuICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XG4gICAgaGVhZGVyID0gaGVhZGVyc1twcm9wXTtcblxuICAgIC8vIHNraXAgbnVsbGlzaCBoZWFkZXJzLlxuICAgIGlmIChoZWFkZXIgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbGwgaGVhZGVycyB0byBhcnJheXMuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgIGhlYWRlciA9IFtoZWFkZXJdO1xuICAgIH1cblxuICAgIC8vIGFkZCBub24tZW1wdHkgaGVhZGVycy5cbiAgICBpZiAoaGVhZGVyLmxlbmd0aCkge1xuICAgICAgY29udGVudHMgKz0gcHJvcCArICc6ICcgKyBoZWFkZXIuam9pbignOyAnKSArIEZvcm1EYXRhLkxJTkVfQlJFQUs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICctLScgKyB0aGlzLmdldEJvdW5kYXJ5KCkgKyBGb3JtRGF0YS5MSU5FX0JSRUFLICsgY29udGVudHMgKyBGb3JtRGF0YS5MSU5FX0JSRUFLO1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLl9nZXRDb250ZW50RGlzcG9zaXRpb24gPSBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuXG4gIHZhciBmaWxlbmFtZVxuICAgICwgY29udGVudERpc3Bvc2l0aW9uXG4gICAgO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5maWxlcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBjdXN0b20gZmlsZXBhdGggZm9yIHJlbGF0aXZlIHBhdGhzXG4gICAgZmlsZW5hbWUgPSBwYXRoLm5vcm1hbGl6ZShvcHRpb25zLmZpbGVwYXRoKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5maWxlbmFtZSB8fCB2YWx1ZS5uYW1lIHx8IHZhbHVlLnBhdGgpIHtcbiAgICAvLyBjdXN0b20gZmlsZW5hbWUgdGFrZSBwcmVjZWRlbmNlXG4gICAgLy8gZm9ybWlkYWJsZSBhbmQgdGhlIGJyb3dzZXIgYWRkIGEgbmFtZSBwcm9wZXJ0eVxuICAgIC8vIGZzLSBhbmQgcmVxdWVzdC0gc3RyZWFtcyBoYXZlIHBhdGggcHJvcGVydHlcbiAgICBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUob3B0aW9ucy5maWxlbmFtZSB8fCB2YWx1ZS5uYW1lIHx8IHZhbHVlLnBhdGgpO1xuICB9IGVsc2UgaWYgKHZhbHVlLnJlYWRhYmxlICYmIHZhbHVlLmhhc093blByb3BlcnR5KCdodHRwVmVyc2lvbicpKSB7XG4gICAgLy8gb3IgdHJ5IGh0dHAgcmVzcG9uc2VcbiAgICBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUodmFsdWUuY2xpZW50Ll9odHRwTWVzc2FnZS5wYXRoIHx8ICcnKTtcbiAgfVxuXG4gIGlmIChmaWxlbmFtZSkge1xuICAgIGNvbnRlbnREaXNwb3NpdGlvbiA9ICdmaWxlbmFtZT1cIicgKyBmaWxlbmFtZSArICdcIic7XG4gIH1cblxuICByZXR1cm4gY29udGVudERpc3Bvc2l0aW9uO1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLl9nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG5cbiAgLy8gdXNlIGN1c3RvbSBjb250ZW50LXR5cGUgYWJvdmUgYWxsXG4gIHZhciBjb250ZW50VHlwZSA9IG9wdGlvbnMuY29udGVudFR5cGU7XG5cbiAgLy8gb3IgdHJ5IGBuYW1lYCBmcm9tIGZvcm1pZGFibGUsIGJyb3dzZXJcbiAgaWYgKCFjb250ZW50VHlwZSAmJiB2YWx1ZS5uYW1lKSB7XG4gICAgY29udGVudFR5cGUgPSBtaW1lLmxvb2t1cCh2YWx1ZS5uYW1lKTtcbiAgfVxuXG4gIC8vIG9yIHRyeSBgcGF0aGAgZnJvbSBmcy0sIHJlcXVlc3QtIHN0cmVhbXNcbiAgaWYgKCFjb250ZW50VHlwZSAmJiB2YWx1ZS5wYXRoKSB7XG4gICAgY29udGVudFR5cGUgPSBtaW1lLmxvb2t1cCh2YWx1ZS5wYXRoKTtcbiAgfVxuXG4gIC8vIG9yIGlmIGl0J3MgaHR0cC1yZXBvbnNlXG4gIGlmICghY29udGVudFR5cGUgJiYgdmFsdWUucmVhZGFibGUgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoJ2h0dHBWZXJzaW9uJykpIHtcbiAgICBjb250ZW50VHlwZSA9IHZhbHVlLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddO1xuICB9XG5cbiAgLy8gb3IgZ3Vlc3MgaXQgZnJvbSB0aGUgZmlsZXBhdGggb3IgZmlsZW5hbWVcbiAgaWYgKCFjb250ZW50VHlwZSAmJiAob3B0aW9ucy5maWxlcGF0aCB8fCBvcHRpb25zLmZpbGVuYW1lKSkge1xuICAgIGNvbnRlbnRUeXBlID0gbWltZS5sb29rdXAob3B0aW9ucy5maWxlcGF0aCB8fCBvcHRpb25zLmZpbGVuYW1lKTtcbiAgfVxuXG4gIC8vIGZhbGxiYWNrIHRvIHRoZSBkZWZhdWx0IGNvbnRlbnQgdHlwZSBpZiBgdmFsdWVgIGlzIG5vdCBzaW1wbGUgdmFsdWVcbiAgaWYgKCFjb250ZW50VHlwZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICBjb250ZW50VHlwZSA9IEZvcm1EYXRhLkRFRkFVTFRfQ09OVEVOVF9UWVBFO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnRUeXBlO1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLl9tdWx0aVBhcnRGb290ZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5leHQpIHtcbiAgICB2YXIgZm9vdGVyID0gRm9ybURhdGEuTElORV9CUkVBSztcblxuICAgIHZhciBsYXN0UGFydCA9ICh0aGlzLl9zdHJlYW1zLmxlbmd0aCA9PT0gMCk7XG4gICAgaWYgKGxhc3RQYXJ0KSB7XG4gICAgICBmb290ZXIgKz0gdGhpcy5fbGFzdEJvdW5kYXJ5KCk7XG4gICAgfVxuXG4gICAgbmV4dChmb290ZXIpO1xuICB9LmJpbmQodGhpcyk7XG59O1xuXG5Gb3JtRGF0YS5wcm90b3R5cGUuX2xhc3RCb3VuZGFyeSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJy0tJyArIHRoaXMuZ2V0Qm91bmRhcnkoKSArICctLScgKyBGb3JtRGF0YS5MSU5FX0JSRUFLO1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLmdldEhlYWRlcnMgPSBmdW5jdGlvbih1c2VySGVhZGVycykge1xuICB2YXIgaGVhZGVyO1xuICB2YXIgZm9ybUhlYWRlcnMgPSB7XG4gICAgJ2NvbnRlbnQtdHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT0nICsgdGhpcy5nZXRCb3VuZGFyeSgpXG4gIH07XG5cbiAgZm9yIChoZWFkZXIgaW4gdXNlckhlYWRlcnMpIHtcbiAgICBpZiAodXNlckhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgZm9ybUhlYWRlcnNbaGVhZGVyLnRvTG93ZXJDYXNlKCldID0gdXNlckhlYWRlcnNbaGVhZGVyXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZm9ybUhlYWRlcnM7XG59O1xuXG5Gb3JtRGF0YS5wcm90b3R5cGUuc2V0Qm91bmRhcnkgPSBmdW5jdGlvbihib3VuZGFyeSkge1xuICB0aGlzLl9ib3VuZGFyeSA9IGJvdW5kYXJ5O1xufTtcblxuRm9ybURhdGEucHJvdG90eXBlLmdldEJvdW5kYXJ5ID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5fYm91bmRhcnkpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUJvdW5kYXJ5KCk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fYm91bmRhcnk7XG59O1xuXG5Gb3JtRGF0YS5wcm90b3R5cGUuZ2V0QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhQnVmZmVyID0gbmV3IEJ1ZmZlci5hbGxvYyggMCApO1xuICB2YXIgYm91bmRhcnkgPSB0aGlzLmdldEJvdW5kYXJ5KCk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBmb3JtIGNvbnRlbnQuIEFkZCBMaW5lIGJyZWFrcyB0byB0aGUgZW5kIG9mIGRhdGEuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9zdHJlYW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9zdHJlYW1zW2ldICE9PSAnZnVuY3Rpb24nKSB7XG5cbiAgICAgIC8vIEFkZCBjb250ZW50IHRvIHRoZSBidWZmZXIuXG4gICAgICBpZihCdWZmZXIuaXNCdWZmZXIodGhpcy5fc3RyZWFtc1tpXSkpIHtcbiAgICAgICAgZGF0YUJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoIFtkYXRhQnVmZmVyLCB0aGlzLl9zdHJlYW1zW2ldXSk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIGRhdGFCdWZmZXIgPSBCdWZmZXIuY29uY2F0KCBbZGF0YUJ1ZmZlciwgQnVmZmVyLmZyb20odGhpcy5fc3RyZWFtc1tpXSldKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGJyZWFrIGFmdGVyIGNvbnRlbnQuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3N0cmVhbXNbaV0gIT09ICdzdHJpbmcnIHx8IHRoaXMuX3N0cmVhbXNbaV0uc3Vic3RyaW5nKCAyLCBib3VuZGFyeS5sZW5ndGggKyAyICkgIT09IGJvdW5kYXJ5KSB7XG4gICAgICAgIGRhdGFCdWZmZXIgPSBCdWZmZXIuY29uY2F0KCBbZGF0YUJ1ZmZlciwgQnVmZmVyLmZyb20oRm9ybURhdGEuTElORV9CUkVBSyldICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIHRoZSBmb290ZXIgYW5kIHJldHVybiB0aGUgQnVmZmVyIG9iamVjdC5cbiAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoIFtkYXRhQnVmZmVyLCBCdWZmZXIuZnJvbSh0aGlzLl9sYXN0Qm91bmRhcnkoKSldICk7XG59O1xuXG5Gb3JtRGF0YS5wcm90b3R5cGUuX2dlbmVyYXRlQm91bmRhcnkgPSBmdW5jdGlvbigpIHtcbiAgLy8gVGhpcyBnZW5lcmF0ZXMgYSA1MCBjaGFyYWN0ZXIgYm91bmRhcnkgc2ltaWxhciB0byB0aG9zZSB1c2VkIGJ5IEZpcmVmb3guXG4gIC8vIFRoZXkgYXJlIG9wdGltaXplZCBmb3IgYm95ZXItbW9vcmUgcGFyc2luZy5cbiAgdmFyIGJvdW5kYXJ5ID0gJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgYm91bmRhcnkgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLnRvU3RyaW5nKDE2KTtcbiAgfVxuXG4gIHRoaXMuX2JvdW5kYXJ5ID0gYm91bmRhcnk7XG59O1xuXG4vLyBOb3RlOiBnZXRMZW5ndGhTeW5jIERPRVNOJ1QgY2FsY3VsYXRlIHN0cmVhbXMgbGVuZ3RoXG4vLyBBcyB3b3JrYXJvdW5kIG9uZSBjYW4gY2FsY3VsYXRlIGZpbGUgc2l6ZSBtYW51YWxseVxuLy8gYW5kIGFkZCBpdCBhcyBrbm93bkxlbmd0aCBvcHRpb25cbkZvcm1EYXRhLnByb3RvdHlwZS5nZXRMZW5ndGhTeW5jID0gZnVuY3Rpb24oKSB7XG4gIHZhciBrbm93bkxlbmd0aCA9IHRoaXMuX292ZXJoZWFkTGVuZ3RoICsgdGhpcy5fdmFsdWVMZW5ndGg7XG5cbiAgLy8gRG9uJ3QgZ2V0IGNvbmZ1c2VkLCB0aGVyZSBhcmUgMyBcImludGVybmFsXCIgc3RyZWFtcyBmb3IgZWFjaCBrZXl2YWwgcGFpclxuICAvLyBzbyBpdCBiYXNpY2FsbHkgY2hlY2tzIGlmIHRoZXJlIGlzIGFueSB2YWx1ZSBhZGRlZCB0byB0aGUgZm9ybVxuICBpZiAodGhpcy5fc3RyZWFtcy5sZW5ndGgpIHtcbiAgICBrbm93bkxlbmd0aCArPSB0aGlzLl9sYXN0Qm91bmRhcnkoKS5sZW5ndGg7XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZm9ybS1kYXRhL2Zvcm0tZGF0YS9pc3N1ZXMvNDBcbiAgaWYgKCF0aGlzLmhhc0tub3duTGVuZ3RoKCkpIHtcbiAgICAvLyBTb21lIGFzeW5jIGxlbmd0aCByZXRyaWV2ZXJzIGFyZSBwcmVzZW50XG4gICAgLy8gdGhlcmVmb3JlIHN5bmNocm9ub3VzIGxlbmd0aCBjYWxjdWxhdGlvbiBpcyBmYWxzZS5cbiAgICAvLyBQbGVhc2UgdXNlIGdldExlbmd0aChjYWxsYmFjaykgdG8gZ2V0IHByb3BlciBsZW5ndGhcbiAgICB0aGlzLl9lcnJvcihuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxjdWxhdGUgcHJvcGVyIGxlbmd0aCBpbiBzeW5jaHJvbm91cyB3YXkuJykpO1xuICB9XG5cbiAgcmV0dXJuIGtub3duTGVuZ3RoO1xufTtcblxuLy8gUHVibGljIEFQSSB0byBjaGVjayBpZiBsZW5ndGggb2YgYWRkZWQgdmFsdWVzIGlzIGtub3duXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZm9ybS1kYXRhL2Zvcm0tZGF0YS9pc3N1ZXMvMTk2XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZm9ybS1kYXRhL2Zvcm0tZGF0YS9pc3N1ZXMvMjYyXG5Gb3JtRGF0YS5wcm90b3R5cGUuaGFzS25vd25MZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhhc0tub3duTGVuZ3RoID0gdHJ1ZTtcblxuICBpZiAodGhpcy5fdmFsdWVzVG9NZWFzdXJlLmxlbmd0aCkge1xuICAgIGhhc0tub3duTGVuZ3RoID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gaGFzS25vd25MZW5ndGg7XG59O1xuXG5Gb3JtRGF0YS5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oY2IpIHtcbiAgdmFyIGtub3duTGVuZ3RoID0gdGhpcy5fb3ZlcmhlYWRMZW5ndGggKyB0aGlzLl92YWx1ZUxlbmd0aDtcblxuICBpZiAodGhpcy5fc3RyZWFtcy5sZW5ndGgpIHtcbiAgICBrbm93bkxlbmd0aCArPSB0aGlzLl9sYXN0Qm91bmRhcnkoKS5sZW5ndGg7XG4gIH1cblxuICBpZiAoIXRoaXMuX3ZhbHVlc1RvTWVhc3VyZS5sZW5ndGgpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGNiLmJpbmQodGhpcywgbnVsbCwga25vd25MZW5ndGgpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3luY2tpdC5wYXJhbGxlbCh0aGlzLl92YWx1ZXNUb01lYXN1cmUsIHRoaXMuX2xlbmd0aFJldHJpZXZlciwgZnVuY3Rpb24oZXJyLCB2YWx1ZXMpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgICAga25vd25MZW5ndGggKz0gbGVuZ3RoO1xuICAgIH0pO1xuXG4gICAgY2IobnVsbCwga25vd25MZW5ndGgpO1xuICB9KTtcbn07XG5cbkZvcm1EYXRhLnByb3RvdHlwZS5zdWJtaXQgPSBmdW5jdGlvbihwYXJhbXMsIGNiKSB7XG4gIHZhciByZXF1ZXN0XG4gICAgLCBvcHRpb25zXG4gICAgLCBkZWZhdWx0cyA9IHttZXRob2Q6ICdwb3N0J31cbiAgICA7XG5cbiAgLy8gcGFyc2UgcHJvdmlkZWQgdXJsIGlmIGl0J3Mgc3RyaW5nXG4gIC8vIG9yIHRyZWF0IGl0IGFzIG9wdGlvbnMgb2JqZWN0XG4gIGlmICh0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnKSB7XG5cbiAgICBwYXJhbXMgPSBwYXJzZVVybChwYXJhbXMpO1xuICAgIG9wdGlvbnMgPSBwb3B1bGF0ZSh7XG4gICAgICBwb3J0OiBwYXJhbXMucG9ydCxcbiAgICAgIHBhdGg6IHBhcmFtcy5wYXRobmFtZSxcbiAgICAgIGhvc3Q6IHBhcmFtcy5ob3N0bmFtZSxcbiAgICAgIHByb3RvY29sOiBwYXJhbXMucHJvdG9jb2xcbiAgICB9LCBkZWZhdWx0cyk7XG5cbiAgLy8gdXNlIGN1c3RvbSBwYXJhbXNcbiAgfSBlbHNlIHtcblxuICAgIG9wdGlvbnMgPSBwb3B1bGF0ZShwYXJhbXMsIGRlZmF1bHRzKTtcbiAgICAvLyBpZiBubyBwb3J0IHByb3ZpZGVkIHVzZSBkZWZhdWx0IG9uZVxuICAgIGlmICghb3B0aW9ucy5wb3J0KSB7XG4gICAgICBvcHRpb25zLnBvcnQgPSBvcHRpb25zLnByb3RvY29sID09ICdodHRwczonID8gNDQzIDogODA7XG4gICAgfVxuICB9XG5cbiAgLy8gcHV0IHRoYXQgZ29vZCBjb2RlIGluIGdldEhlYWRlcnMgdG8gc29tZSB1c2VcbiAgb3B0aW9ucy5oZWFkZXJzID0gdGhpcy5nZXRIZWFkZXJzKHBhcmFtcy5oZWFkZXJzKTtcblxuICAvLyBodHRwcyBpZiBzcGVjaWZpZWQsIGZhbGxiYWNrIHRvIGh0dHAgaW4gYW55IG90aGVyIGNhc2VcbiAgaWYgKG9wdGlvbnMucHJvdG9jb2wgPT0gJ2h0dHBzOicpIHtcbiAgICByZXF1ZXN0ID0gaHR0cHMucmVxdWVzdChvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0ID0gaHR0cC5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZ2V0IGNvbnRlbnQgbGVuZ3RoIGFuZCBmaXJlIGF3YXlcbiAgdGhpcy5nZXRMZW5ndGgoZnVuY3Rpb24oZXJyLCBsZW5ndGgpIHtcbiAgICBpZiAoZXJyICYmIGVyciAhPT0gJ1Vua25vd24gc3RyZWFtJykge1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBhZGQgY29udGVudCBsZW5ndGhcbiAgICBpZiAobGVuZ3RoKSB7XG4gICAgICByZXF1ZXN0LnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBsZW5ndGgpO1xuICAgIH1cblxuICAgIHRoaXMucGlwZShyZXF1ZXN0KTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIHZhciBvblJlc3BvbnNlO1xuXG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbmNlKSB7XG4gICAgICAgIHJlcXVlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2FsbGJhY2spO1xuICAgICAgICByZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKCdyZXNwb25zZScsIG9uUmVzcG9uc2UpO1xuXG4gICAgICAgIHJldHVybiBjYi5jYWxsKHRoaXMsIGVycm9yLCByZXNwb25jZSk7XG4gICAgICB9O1xuXG4gICAgICBvblJlc3BvbnNlID0gY2FsbGJhY2suYmluZCh0aGlzLCBudWxsKTtcblxuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCBjYWxsYmFjayk7XG4gICAgICByZXF1ZXN0Lm9uKCdyZXNwb25zZScsIG9uUmVzcG9uc2UpO1xuICAgIH1cbiAgfS5iaW5kKHRoaXMpKTtcblxuICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbkZvcm1EYXRhLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgaWYgKCF0aGlzLmVycm9yKSB7XG4gICAgdGhpcy5lcnJvciA9IGVycjtcbiAgICB0aGlzLnBhdXNlKCk7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbn07XG5cbkZvcm1EYXRhLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICdbb2JqZWN0IEZvcm1EYXRhXSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbi8vIHRlbXBvcmFyeSBob3RmaXggdG8gYXZvaWQgY2lyY3VsYXIgcmVmZXJlbmNlcyB1bnRpbCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBpcyByZWZhY3RvcmVkXG5pbXBvcnQgUGxhdGZvcm1Gb3JtRGF0YSBmcm9tICcuLi9wbGF0Zm9ybS9ub2RlL2NsYXNzZXMvRm9ybURhdGEuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIGdpdmVuIHRoaW5nIGlzIGEgYXJyYXkgb3IganMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGluZyAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gYmUgdmlzaXRlZC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNWaXNpdGFibGUodGhpbmcpIHtcbiAgcmV0dXJuIHV0aWxzLmlzUGxhaW5PYmplY3QodGhpbmcpIHx8IHV0aWxzLmlzQXJyYXkodGhpbmcpO1xufVxuXG4vKipcbiAqIEl0IHJlbW92ZXMgdGhlIGJyYWNrZXRzIGZyb20gdGhlIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBwYXJhbWV0ZXIuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGtleSB3aXRob3V0IHRoZSBicmFja2V0cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQnJhY2tldHMoa2V5KSB7XG4gIHJldHVybiB1dGlscy5lbmRzV2l0aChrZXksICdbXScpID8ga2V5LnNsaWNlKDAsIC0yKSA6IGtleTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhdGgsIGEga2V5LCBhbmQgYSBib29sZWFuLCBhbmQgcmV0dXJucyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGJlaW5nIGl0ZXJhdGVkIG92ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZG90cyAtIElmIHRydWUsIHRoZSBrZXkgd2lsbCBiZSByZW5kZXJlZCB3aXRoIGRvdHMgaW5zdGVhZCBvZiBicmFja2V0cy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcGF0aCB0byB0aGUgY3VycmVudCBrZXkuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcktleShwYXRoLCBrZXksIGRvdHMpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4ga2V5O1xuICByZXR1cm4gcGF0aC5jb25jYXQoa2V5KS5tYXAoZnVuY3Rpb24gZWFjaCh0b2tlbiwgaSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHRva2VuID0gcmVtb3ZlQnJhY2tldHModG9rZW4pO1xuICAgIHJldHVybiAhZG90cyAmJiBpID8gJ1snICsgdG9rZW4gKyAnXScgOiB0b2tlbjtcbiAgfSkuam9pbihkb3RzID8gJy4nIDogJycpO1xufVxuXG4vKipcbiAqIElmIHRoZSBhcnJheSBpcyBhbiBhcnJheSBhbmQgbm9uZSBvZiBpdHMgZWxlbWVudHMgYXJlIHZpc2l0YWJsZSwgdGhlbiBpdCdzIGEgZmxhdCBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjaGVja1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ZsYXRBcnJheShhcnIpIHtcbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkoYXJyKSAmJiAhYXJyLnNvbWUoaXNWaXNpdGFibGUpO1xufVxuXG5jb25zdCBwcmVkaWNhdGVzID0gdXRpbHMudG9GbGF0T2JqZWN0KHV0aWxzLCB7fSwgbnVsbCwgZnVuY3Rpb24gZmlsdGVyKHByb3ApIHtcbiAgcmV0dXJuIC9eaXNbQS1aXS8udGVzdChwcm9wKTtcbn0pO1xuXG4vKipcbiAqIENvbnZlcnQgYSBkYXRhIG9iamVjdCB0byBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7P09iamVjdH0gW2Zvcm1EYXRhXVxuICogQHBhcmFtIHs/T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnZpc2l0b3JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm1ldGFUb2tlbnMgPSB0cnVlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kb3RzID0gZmFsc2VdXG4gKiBAcGFyYW0gez9Cb29sZWFufSBbb3B0aW9ucy5pbmRleGVzID0gZmFsc2VdXG4gKlxuICogQHJldHVybnMge09iamVjdH1cbiAqKi9cblxuLyoqXG4gKiBJdCBjb252ZXJ0cyBhbiBvYmplY3QgaW50byBhIEZvcm1EYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PGFueSwgYW55Pn0gb2JqIC0gVGhlIG9iamVjdCB0byBjb252ZXJ0IHRvIGZvcm0gZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSAtIFRoZSBGb3JtRGF0YSBvYmplY3QgdG8gYXBwZW5kIHRvLlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBvcHRpb25zXG4gKlxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gdG9Gb3JtRGF0YShvYmosIGZvcm1EYXRhLCBvcHRpb25zKSB7XG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGZvcm1EYXRhID0gZm9ybURhdGEgfHwgbmV3IChQbGF0Zm9ybUZvcm1EYXRhIHx8IEZvcm1EYXRhKSgpO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBvcHRpb25zID0gdXRpbHMudG9GbGF0T2JqZWN0KG9wdGlvbnMsIHtcbiAgICBtZXRhVG9rZW5zOiB0cnVlLFxuICAgIGRvdHM6IGZhbHNlLFxuICAgIGluZGV4ZXM6IGZhbHNlXG4gIH0sIGZhbHNlLCBmdW5jdGlvbiBkZWZpbmVkKG9wdGlvbiwgc291cmNlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gICAgcmV0dXJuICF1dGlscy5pc1VuZGVmaW5lZChzb3VyY2Vbb3B0aW9uXSk7XG4gIH0pO1xuXG4gIGNvbnN0IG1ldGFUb2tlbnMgPSBvcHRpb25zLm1ldGFUb2tlbnM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICBjb25zdCB2aXNpdG9yID0gb3B0aW9ucy52aXNpdG9yIHx8IGRlZmF1bHRWaXNpdG9yO1xuICBjb25zdCBkb3RzID0gb3B0aW9ucy5kb3RzO1xuICBjb25zdCBpbmRleGVzID0gb3B0aW9ucy5pbmRleGVzO1xuICBjb25zdCBfQmxvYiA9IG9wdGlvbnMuQmxvYiB8fCB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgQmxvYjtcbiAgY29uc3QgdXNlQmxvYiA9IF9CbG9iICYmIHV0aWxzLmlzU3BlY0NvbXBsaWFudEZvcm0oZm9ybURhdGEpO1xuXG4gIGlmICghdXRpbHMuaXNGdW5jdGlvbih2aXNpdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3Zpc2l0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0VmFsdWUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiAnJztcblxuICAgIGlmICh1dGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoIXVzZUJsb2IgJiYgdXRpbHMuaXNCbG9iKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ0Jsb2IgaXMgbm90IHN1cHBvcnRlZC4gVXNlIGEgQnVmZmVyIGluc3RlYWQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIodmFsdWUpIHx8IHV0aWxzLmlzVHlwZWRBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB1c2VCbG9iICYmIHR5cGVvZiBCbG9iID09PSAnZnVuY3Rpb24nID8gbmV3IEJsb2IoW3ZhbHVlXSkgOiBCdWZmZXIuZnJvbSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdmlzaXRvci5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGtleVxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZ3xOdW1iZXI+fSBwYXRoXG4gICAqIEB0aGlzIHtGb3JtRGF0YX1cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIHRvIHZpc2l0IHRoZSBlYWNoIHByb3Agb2YgdGhlIHZhbHVlIHJlY3Vyc2l2ZWx5XG4gICAqL1xuICBmdW5jdGlvbiBkZWZhdWx0VmlzaXRvcih2YWx1ZSwga2V5LCBwYXRoKSB7XG4gICAgbGV0IGFyciA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlICYmICFwYXRoICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh1dGlscy5lbmRzV2l0aChrZXksICd7fScpKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBrZXkgPSBtZXRhVG9rZW5zID8ga2V5IDoga2V5LnNsaWNlKDAsIC0yKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgKHV0aWxzLmlzQXJyYXkodmFsdWUpICYmIGlzRmxhdEFycmF5KHZhbHVlKSkgfHxcbiAgICAgICAgKCh1dGlscy5pc0ZpbGVMaXN0KHZhbHVlKSB8fCB1dGlscy5lbmRzV2l0aChrZXksICdbXScpKSAmJiAoYXJyID0gdXRpbHMudG9BcnJheSh2YWx1ZSkpXG4gICAgICAgICkpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGtleSA9IHJlbW92ZUJyYWNrZXRzKGtleSk7XG5cbiAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gZWFjaChlbCwgaW5kZXgpIHtcbiAgICAgICAgICAhKHV0aWxzLmlzVW5kZWZpbmVkKGVsKSB8fCBlbCA9PT0gbnVsbCkgJiYgZm9ybURhdGEuYXBwZW5kKFxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XG4gICAgICAgICAgICBpbmRleGVzID09PSB0cnVlID8gcmVuZGVyS2V5KFtrZXldLCBpbmRleCwgZG90cykgOiAoaW5kZXhlcyA9PT0gbnVsbCA/IGtleSA6IGtleSArICdbXScpLFxuICAgICAgICAgICAgY29udmVydFZhbHVlKGVsKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzVmlzaXRhYmxlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9ybURhdGEuYXBwZW5kKHJlbmRlcktleShwYXRoLCBrZXksIGRvdHMpLCBjb252ZXJ0VmFsdWUodmFsdWUpKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gW107XG5cbiAgY29uc3QgZXhwb3NlZEhlbHBlcnMgPSBPYmplY3QuYXNzaWduKHByZWRpY2F0ZXMsIHtcbiAgICBkZWZhdWx0VmlzaXRvcixcbiAgICBjb252ZXJ0VmFsdWUsXG4gICAgaXNWaXNpdGFibGVcbiAgfSk7XG5cbiAgZnVuY3Rpb24gYnVpbGQodmFsdWUsIHBhdGgpIHtcbiAgICBpZiAodXRpbHMuaXNVbmRlZmluZWQodmFsdWUpKSByZXR1cm47XG5cbiAgICBpZiAoc3RhY2suaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICB0aHJvdyBFcnJvcignQ2lyY3VsYXIgcmVmZXJlbmNlIGRldGVjdGVkIGluICcgKyBwYXRoLmpvaW4oJy4nKSk7XG4gICAgfVxuXG4gICAgc3RhY2sucHVzaCh2YWx1ZSk7XG5cbiAgICB1dGlscy5mb3JFYWNoKHZhbHVlLCBmdW5jdGlvbiBlYWNoKGVsLCBrZXkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9ICEodXRpbHMuaXNVbmRlZmluZWQoZWwpIHx8IGVsID09PSBudWxsKSAmJiB2aXNpdG9yLmNhbGwoXG4gICAgICAgIGZvcm1EYXRhLCBlbCwgdXRpbHMuaXNTdHJpbmcoa2V5KSA/IGtleS50cmltKCkgOiBrZXksIHBhdGgsIGV4cG9zZWRIZWxwZXJzXG4gICAgICApO1xuXG4gICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgIGJ1aWxkKGVsLCBwYXRoID8gcGF0aC5jb25jYXQoa2V5KSA6IFtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHN0YWNrLnBvcCgpO1xuICB9XG5cbiAgaWYgKCF1dGlscy5pc09iamVjdChvYmopKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZGF0YSBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG5cbiAgYnVpbGQob2JqKTtcblxuICByZXR1cm4gZm9ybURhdGE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvRm9ybURhdGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5cbi8qKlxuICogSXQgZW5jb2RlcyBhIHN0cmluZyBieSByZXBsYWNpbmcgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IGluIHRoZSB1bnJlc2VydmVkIHNldCB3aXRoXG4gKiB0aGVpciBwZXJjZW50LWVuY29kZWQgZXF1aXZhbGVudHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBlbmNvZGUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGVuY29kZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlbmNvZGUoc3RyKSB7XG4gIGNvbnN0IGNoYXJNYXAgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICBcIidcIjogJyUyNycsXG4gICAgJygnOiAnJTI4JyxcbiAgICAnKSc6ICclMjknLFxuICAgICd+JzogJyU3RScsXG4gICAgJyUyMCc6ICcrJyxcbiAgICAnJTAwJzogJ1xceDAwJ1xuICB9O1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCl+XXwlMjB8JTAwL2csIGZ1bmN0aW9uIHJlcGxhY2VyKG1hdGNoKSB7XG4gICAgcmV0dXJuIGNoYXJNYXBbbWF0Y2hdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhcmFtcyBvYmplY3QgYW5kIGNvbnZlcnRzIGl0IHRvIGEgRm9ybURhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBGb3JtRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvYmplY3QgcGFzc2VkIHRvIHRoZSBBeGlvcyBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKSB7XG4gIHRoaXMuX3BhaXJzID0gW107XG5cbiAgcGFyYW1zICYmIHRvRm9ybURhdGEocGFyYW1zLCB0aGlzLCBvcHRpb25zKTtcbn1cblxuY29uc3QgcHJvdG90eXBlID0gQXhpb3NVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlO1xuXG5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX3BhaXJzLnB1c2goW25hbWUsIHZhbHVlXSk7XG59O1xuXG5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhlbmNvZGVyKSB7XG4gIGNvbnN0IF9lbmNvZGUgPSBlbmNvZGVyID8gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2Rlci5jYWxsKHRoaXMsIHZhbHVlLCBlbmNvZGUpO1xuICB9IDogZW5jb2RlO1xuXG4gIHJldHVybiB0aGlzLl9wYWlycy5tYXAoZnVuY3Rpb24gZWFjaChwYWlyKSB7XG4gICAgcmV0dXJuIF9lbmNvZGUocGFpclswXSkgKyAnPScgKyBfZW5jb2RlKHBhaXJbMV0pO1xuICB9LCAnJykuam9pbignJicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NVUkxTZWFyY2hQYXJhbXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgQXhpb3NVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi4vaGVscGVycy9BeGlvc1VSTFNlYXJjaFBhcmFtcy5qcyc7XG5cbi8qKlxuICogSXQgcmVwbGFjZXMgYWxsIGluc3RhbmNlcyBvZiB0aGUgY2hhcmFjdGVycyBgOmAsIGAkYCwgYCxgLCBgK2AsIGBbYCwgYW5kIGBdYCB3aXRoIHRoZWlyXG4gKiBVUkkgZW5jb2RlZCBjb3VudGVycGFydHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsIFRoZSB2YWx1ZSB0byBiZSBlbmNvZGVkLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHBhcmFtIHs/b2JqZWN0fSBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBcbiAgY29uc3QgX2VuY29kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGUgfHwgZW5jb2RlO1xuXG4gIGNvbnN0IHNlcmlhbGl6ZUZuID0gb3B0aW9ucyAmJiBvcHRpb25zLnNlcmlhbGl6ZTtcblxuICBsZXQgc2VyaWFsaXplZFBhcmFtcztcblxuICBpZiAoc2VyaWFsaXplRm4pIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gc2VyaWFsaXplRm4ocGFyYW1zLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gdXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSA/XG4gICAgICBwYXJhbXMudG9TdHJpbmcoKSA6XG4gICAgICBuZXcgQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKS50b1N0cmluZyhfZW5jb2RlKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgY29uc3QgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKFwiI1wiKTtcblxuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbmNsYXNzIEludGVyY2VwdG9yTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICAgKi9cbiAgdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgICAgZnVsZmlsbGVkLFxuICAgICAgcmVqZWN0ZWQsXG4gICAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBpbnRlcmNlcHRvciB3YXMgcmVtb3ZlZCwgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIGVqZWN0KGlkKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCBpbnRlcmNlcHRvcnMgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVycykge1xuICAgICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICAgKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmb3JFYWNoKGZuKSB7XG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgICBmbihoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuZXhwb3J0IGRlZmF1bHQgdXJsLlVSTFNlYXJjaFBhcmFtcztcbiIsImltcG9ydCBVUkxTZWFyY2hQYXJhbXMgZnJvbSAnLi9jbGFzc2VzL1VSTFNlYXJjaFBhcmFtcy5qcydcbmltcG9ydCBGb3JtRGF0YSBmcm9tICcuL2NsYXNzZXMvRm9ybURhdGEuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaXNOb2RlOiB0cnVlLFxuICBjbGFzc2VzOiB7XG4gICAgVVJMU2VhcmNoUGFyYW1zLFxuICAgIEZvcm1EYXRhLFxuICAgIEJsb2I6IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBCbG9iIHx8IG51bGxcbiAgfSxcbiAgcHJvdG9jb2xzOiBbICdodHRwJywgJ2h0dHBzJywgJ2ZpbGUnLCAnZGF0YScgXVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b1VSTEVuY29kZWRGb3JtKGRhdGEsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHRvRm9ybURhdGEoZGF0YSwgbmV3IHBsYXRmb3JtLmNsYXNzZXMuVVJMU2VhcmNoUGFyYW1zKCksIE9iamVjdC5hc3NpZ24oe1xuICAgIHZpc2l0b3I6IGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhdGgsIGhlbHBlcnMpIHtcbiAgICAgIGlmIChwbGF0Zm9ybS5pc05vZGUgJiYgdXRpbHMuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVycy5kZWZhdWx0VmlzaXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSwgb3B0aW9ucykpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nIGxpa2UgYGZvb1t4XVt5XVt6XWAgYW5kIHJldHVybnMgYW4gYXJyYXkgbGlrZSBgWydmb28nLCAneCcsICd5JywgJ3onXVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBzdHJpbmdzLlxuICovXG5mdW5jdGlvbiBwYXJzZVByb3BQYXRoKG5hbWUpIHtcbiAgLy8gZm9vW3hdW3ldW3pdXG4gIC8vIGZvby54LnkuelxuICAvLyBmb28teC15LXpcbiAgLy8gZm9vIHggeSB6XG4gIHJldHVybiB1dGlscy5tYXRjaEFsbCgvXFx3K3xcXFsoXFx3KildL2csIG5hbWUpLm1hcChtYXRjaCA9PiB7XG4gICAgcmV0dXJuIG1hdGNoWzBdID09PSAnW10nID8gJycgOiBtYXRjaFsxXSB8fCBtYXRjaFswXTtcbiAgfSk7XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBhcnJheSB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnIgLSBUaGUgYXJyYXkgdG8gY29udmVydCB0byBhbiBvYmplY3QuXG4gKlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdGhlIHNhbWUga2V5cyBhbmQgdmFsdWVzIGFzIHRoZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlUb09iamVjdChhcnIpIHtcbiAgY29uc3Qgb2JqID0ge307XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhcnIpO1xuICBsZXQgaTtcbiAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGxldCBrZXk7XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgb2JqW2tleV0gPSBhcnJba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEl0IHRha2VzIGEgRm9ybURhdGEgb2JqZWN0IGFuZCByZXR1cm5zIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybURhdGEgVGhlIEZvcm1EYXRhIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT04uXG4gKlxuICogQHJldHVybnMge09iamVjdDxzdHJpbmcsIGFueT4gfCBudWxsfSBUaGUgY29udmVydGVkIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZm9ybURhdGFUb0pTT04oZm9ybURhdGEpIHtcbiAgZnVuY3Rpb24gYnVpbGRQYXRoKHBhdGgsIHZhbHVlLCB0YXJnZXQsIGluZGV4KSB7XG4gICAgbGV0IG5hbWUgPSBwYXRoW2luZGV4KytdO1xuICAgIGNvbnN0IGlzTnVtZXJpY0tleSA9IE51bWJlci5pc0Zpbml0ZSgrbmFtZSk7XG4gICAgY29uc3QgaXNMYXN0ID0gaW5kZXggPj0gcGF0aC5sZW5ndGg7XG4gICAgbmFtZSA9ICFuYW1lICYmIHV0aWxzLmlzQXJyYXkodGFyZ2V0KSA/IHRhcmdldC5sZW5ndGggOiBuYW1lO1xuXG4gICAgaWYgKGlzTGFzdCkge1xuICAgICAgaWYgKHV0aWxzLmhhc093blByb3AodGFyZ2V0LCBuYW1lKSkge1xuICAgICAgICB0YXJnZXRbbmFtZV0gPSBbdGFyZ2V0W25hbWVdLCB2YWx1ZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICFpc051bWVyaWNLZXk7XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXRbbmFtZV0gfHwgIXV0aWxzLmlzT2JqZWN0KHRhcmdldFtuYW1lXSkpIHtcbiAgICAgIHRhcmdldFtuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkUGF0aChwYXRoLCB2YWx1ZSwgdGFyZ2V0W25hbWVdLCBpbmRleCk7XG5cbiAgICBpZiAocmVzdWx0ICYmIHV0aWxzLmlzQXJyYXkodGFyZ2V0W25hbWVdKSkge1xuICAgICAgdGFyZ2V0W25hbWVdID0gYXJyYXlUb09iamVjdCh0YXJnZXRbbmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiAhaXNOdW1lcmljS2V5O1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZm9ybURhdGEpICYmIHV0aWxzLmlzRnVuY3Rpb24oZm9ybURhdGEuZW50cmllcykpIHtcbiAgICBjb25zdCBvYmogPSB7fTtcblxuICAgIHV0aWxzLmZvckVhY2hFbnRyeShmb3JtRGF0YSwgKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBidWlsZFBhdGgocGFyc2VQcm9wUGF0aChuYW1lKSwgdmFsdWUsIG9iaiwgMCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1EYXRhVG9KU09OO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCB0cmFuc2l0aW9uYWxEZWZhdWx0cyBmcm9tICcuL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuLi9oZWxwZXJzL3RvRm9ybURhdGEuanMnO1xuaW1wb3J0IHRvVVJMRW5jb2RlZEZvcm0gZnJvbSAnLi4vaGVscGVycy90b1VSTEVuY29kZWRGb3JtLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgZm9ybURhdGFUb0pTT04gZnJvbSAnLi4vaGVscGVycy9mb3JtRGF0YVRvSlNPTi5qcyc7XG5cbmNvbnN0IERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkXG59O1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nLCB0cmllcyB0byBwYXJzZSBpdCwgYW5kIGlmIGl0IGZhaWxzLCBpdCByZXR1cm5zIHRoZSBzdHJpbmdpZmllZCB2ZXJzaW9uXG4gKiBvZiB0aGUgaW5wdXRcbiAqXG4gKiBAcGFyYW0ge2FueX0gcmF3VmFsdWUgLSBUaGUgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIGEgc3RyaW5nIGludG8gYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuY29kZXIgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB2YWx1ZSBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZ2lmaWVkIHZlcnNpb24gb2YgdGhlIHJhd1ZhbHVlLlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB0cmFuc2l0aW9uYWxEZWZhdWx0cyxcblxuICBhZGFwdGVyOiBbJ3hocicsICdodHRwJ10sXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpIHx8ICcnO1xuICAgIGNvbnN0IGhhc0pTT05Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSA+IC0xO1xuICAgIGNvbnN0IGlzT2JqZWN0UGF5bG9hZCA9IHV0aWxzLmlzT2JqZWN0KGRhdGEpO1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCAmJiB1dGlscy5pc0hUTUxGb3JtKGRhdGEpKSB7XG4gICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRm9ybURhdGEgPSB1dGlscy5pc0Zvcm1EYXRhKGRhdGEpO1xuXG4gICAgaWYgKGlzRm9ybURhdGEpIHtcbiAgICAgIGlmICghaGFzSlNPTkNvbnRlbnRUeXBlKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc0pTT05Db250ZW50VHlwZSA/IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhVG9KU09OKGRhdGEpKSA6IGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRUeXBlKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcsIGZhbHNlKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbGV0IGlzRmlsZUxpc3Q7XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkKSB7XG4gICAgICBpZiAoY29udGVudFR5cGUuaW5kZXhPZignYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgPiAtMSkge1xuICAgICAgICByZXR1cm4gdG9VUkxFbmNvZGVkRm9ybShkYXRhLCB0aGlzLmZvcm1TZXJpYWxpemVyKS50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGlzRmlsZUxpc3QgPSB1dGlscy5pc0ZpbGVMaXN0KGRhdGEpKSB8fCBjb250ZW50VHlwZS5pbmRleE9mKCdtdWx0aXBhcnQvZm9ybS1kYXRhJykgPiAtMSkge1xuICAgICAgICBjb25zdCBfRm9ybURhdGEgPSB0aGlzLmVudiAmJiB0aGlzLmVudi5Gb3JtRGF0YTtcblxuICAgICAgICByZXR1cm4gdG9Gb3JtRGF0YShcbiAgICAgICAgICBpc0ZpbGVMaXN0ID8geydmaWxlc1tdJzogZGF0YX0gOiBkYXRhLFxuICAgICAgICAgIF9Gb3JtRGF0YSAmJiBuZXcgX0Zvcm1EYXRhKCksXG4gICAgICAgICAgdGhpcy5mb3JtU2VyaWFsaXplclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc09iamVjdFBheWxvYWQgfHwgaGFzSlNPTkNvbnRlbnRUeXBlICkge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24vanNvbicsIGZhbHNlKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIGNvbnN0IHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICBjb25zdCBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgY29uc3QgSlNPTlJlcXVlc3RlZCA9IHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAoZGF0YSAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiAoKGZvcmNlZEpTT05QYXJzaW5nICYmICF0aGlzLnJlc3BvbnNlVHlwZSkgfHwgSlNPTlJlcXVlc3RlZCkpIHtcbiAgICAgIGNvbnN0IHNpbGVudEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5zaWxlbnRKU09OUGFyc2luZztcbiAgICAgIGNvbnN0IHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIEpTT05SZXF1ZXN0ZWQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lID09PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZSwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFLCB0aGlzLCBudWxsLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgZW52OiB7XG4gICAgRm9ybURhdGE6IHBsYXRmb3JtLmNsYXNzZXMuRm9ybURhdGEsXG4gICAgQmxvYjogcGxhdGZvcm0uY2xhc3Nlcy5CbG9iXG4gIH0sXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfSxcblxuICBoZWFkZXJzOiB7XG4gICAgY29tbW9uOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8vIFJhd0F4aW9zSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbmNvbnN0IGlnbm9yZUR1cGxpY2F0ZU9mID0gdXRpbHMudG9PYmplY3RTZXQoW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl0pO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmF3SGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKlxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgcmF3SGVhZGVycyA9PiB7XG4gIGNvbnN0IHBhcnNlZCA9IHt9O1xuICBsZXQga2V5O1xuICBsZXQgdmFsO1xuICBsZXQgaTtcblxuICByYXdIZWFkZXJzICYmIHJhd0hlYWRlcnMuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gbGluZS5zdWJzdHJpbmcoaSArIDEpLnRyaW0oKTtcblxuICAgIGlmICgha2V5IHx8IChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZltrZXldKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgaWYgKHBhcnNlZFtrZXldKSB7XG4gICAgICAgIHBhcnNlZFtrZXldLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gW3ZhbF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBwYXJzZUhlYWRlcnMgZnJvbSAnLi4vaGVscGVycy9wYXJzZUhlYWRlcnMuanMnO1xuXG5jb25zdCAkaW50ZXJuYWxzID0gU3ltYm9sKCdpbnRlcm5hbHMnKTtcblxuZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyKGhlYWRlcikge1xuICByZXR1cm4gaGVhZGVyICYmIFN0cmluZyhoZWFkZXIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gdXRpbHMuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5tYXAobm9ybWFsaXplVmFsdWUpIDogU3RyaW5nKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUb2tlbnMoc3RyKSB7XG4gIGNvbnN0IHRva2VucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGNvbnN0IHRva2Vuc1JFID0gLyhbXlxccyw7PV0rKVxccyooPzo9XFxzKihbXiw7XSspKT8vZztcbiAgbGV0IG1hdGNoO1xuXG4gIHdoaWxlICgobWF0Y2ggPSB0b2tlbnNSRS5leGVjKHN0cikpKSB7XG4gICAgdG9rZW5zW21hdGNoWzFdXSA9IG1hdGNoWzJdO1xuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cblxuY29uc3QgaXNWYWxpZEhlYWRlck5hbWUgPSAoc3RyKSA9PiAvXlstX2EtekEtWjAtOV5gfH4sISMkJSYnKisuXSskLy50ZXN0KHN0ci50cmltKCkpO1xuXG5mdW5jdGlvbiBtYXRjaEhlYWRlclZhbHVlKGNvbnRleHQsIHZhbHVlLCBoZWFkZXIsIGZpbHRlciwgaXNIZWFkZXJOYW1lRmlsdGVyKSB7XG4gIGlmICh1dGlscy5pc0Z1bmN0aW9uKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwodGhpcywgdmFsdWUsIGhlYWRlcik7XG4gIH1cblxuICBpZiAoaXNIZWFkZXJOYW1lRmlsdGVyKSB7XG4gICAgdmFsdWUgPSBoZWFkZXI7XG4gIH1cblxuICBpZiAoIXV0aWxzLmlzU3RyaW5nKHZhbHVlKSkgcmV0dXJuO1xuXG4gIGlmICh1dGlscy5pc1N0cmluZyhmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIHZhbHVlLmluZGV4T2YoZmlsdGVyKSAhPT0gLTE7XG4gIH1cblxuICBpZiAodXRpbHMuaXNSZWdFeHAoZmlsdGVyKSkge1xuICAgIHJldHVybiBmaWx0ZXIudGVzdCh2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0SGVhZGVyKGhlYWRlcikge1xuICByZXR1cm4gaGVhZGVyLnRyaW0oKVxuICAgIC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyhbYS16XFxkXSkoXFx3KikvZywgKHcsIGNoYXIsIHN0cikgPT4ge1xuICAgICAgcmV0dXJuIGNoYXIudG9VcHBlckNhc2UoKSArIHN0cjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYnVpbGRBY2Nlc3NvcnMob2JqLCBoZWFkZXIpIHtcbiAgY29uc3QgYWNjZXNzb3JOYW1lID0gdXRpbHMudG9DYW1lbENhc2UoJyAnICsgaGVhZGVyKTtcblxuICBbJ2dldCcsICdzZXQnLCAnaGFzJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBtZXRob2ROYW1lICsgYWNjZXNzb3JOYW1lLCB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2ROYW1lXS5jYWxsKHRoaXMsIGhlYWRlciwgYXJnMSwgYXJnMiwgYXJnMyk7XG4gICAgICB9LFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xufVxuXG5jbGFzcyBBeGlvc0hlYWRlcnMge1xuICBjb25zdHJ1Y3RvcihoZWFkZXJzKSB7XG4gICAgaGVhZGVycyAmJiB0aGlzLnNldChoZWFkZXJzKTtcbiAgfVxuXG4gIHNldChoZWFkZXIsIHZhbHVlT3JSZXdyaXRlLCByZXdyaXRlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBzZXRIZWFkZXIoX3ZhbHVlLCBfaGVhZGVyLCBfcmV3cml0ZSkge1xuICAgICAgY29uc3QgbEhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihfaGVhZGVyKTtcblxuICAgICAgaWYgKCFsSGVhZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaGVhZGVyIG5hbWUgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShzZWxmLCBsSGVhZGVyKTtcblxuICAgICAgaWYoIWtleSB8fCBzZWxmW2tleV0gPT09IHVuZGVmaW5lZCB8fCBfcmV3cml0ZSA9PT0gdHJ1ZSB8fCAoX3Jld3JpdGUgPT09IHVuZGVmaW5lZCAmJiBzZWxmW2tleV0gIT09IGZhbHNlKSkge1xuICAgICAgICBzZWxmW2tleSB8fCBfaGVhZGVyXSA9IG5vcm1hbGl6ZVZhbHVlKF92YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2V0SGVhZGVycyA9IChoZWFkZXJzLCBfcmV3cml0ZSkgPT5cbiAgICAgIHV0aWxzLmZvckVhY2goaGVhZGVycywgKF92YWx1ZSwgX2hlYWRlcikgPT4gc2V0SGVhZGVyKF92YWx1ZSwgX2hlYWRlciwgX3Jld3JpdGUpKTtcblxuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KGhlYWRlcikgfHwgaGVhZGVyIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgc2V0SGVhZGVycyhoZWFkZXIsIHZhbHVlT3JSZXdyaXRlKVxuICAgIH0gZWxzZSBpZih1dGlscy5pc1N0cmluZyhoZWFkZXIpICYmIChoZWFkZXIgPSBoZWFkZXIudHJpbSgpKSAmJiAhaXNWYWxpZEhlYWRlck5hbWUoaGVhZGVyKSkge1xuICAgICAgc2V0SGVhZGVycyhwYXJzZUhlYWRlcnMoaGVhZGVyKSwgdmFsdWVPclJld3JpdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkZXIgIT0gbnVsbCAmJiBzZXRIZWFkZXIodmFsdWVPclJld3JpdGUsIGhlYWRlciwgcmV3cml0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQoaGVhZGVyLCBwYXJzZXIpIHtcbiAgICBoZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoaGVhZGVyKTtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkodGhpcywgaGVhZGVyKTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNba2V5XTtcblxuICAgICAgICBpZiAoIXBhcnNlcikge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJzZXIgPT09IHRydWUpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbnModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24ocGFyc2VyKSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZXIuY2FsbCh0aGlzLCB2YWx1ZSwga2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc1JlZ0V4cChwYXJzZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlci5leGVjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3BhcnNlciBtdXN0IGJlIGJvb2xlYW58cmVnZXhwfGZ1bmN0aW9uJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFzKGhlYWRlciwgbWF0Y2hlcikge1xuICAgIGhlYWRlciA9IG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpO1xuXG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleSh0aGlzLCBoZWFkZXIpO1xuXG4gICAgICByZXR1cm4gISEoa2V5ICYmIHRoaXNba2V5XSAhPT0gdW5kZWZpbmVkICYmICghbWF0Y2hlciB8fCBtYXRjaEhlYWRlclZhbHVlKHRoaXMsIHRoaXNba2V5XSwga2V5LCBtYXRjaGVyKSkpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGRlbGV0ZShoZWFkZXIsIG1hdGNoZXIpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBsZXQgZGVsZXRlZCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlSGVhZGVyKF9oZWFkZXIpIHtcbiAgICAgIF9oZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmIChfaGVhZGVyKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoc2VsZiwgX2hlYWRlcik7XG5cbiAgICAgICAgaWYgKGtleSAmJiAoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZShzZWxmLCBzZWxmW2tleV0sIGtleSwgbWF0Y2hlcikpKSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGZba2V5XTtcblxuICAgICAgICAgIGRlbGV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXkoaGVhZGVyKSkge1xuICAgICAgaGVhZGVyLmZvckVhY2goZGVsZXRlSGVhZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlSGVhZGVyKGhlYWRlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBjbGVhcihtYXRjaGVyKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICAgIGxldCBpID0ga2V5cy5sZW5ndGg7XG4gICAgbGV0IGRlbGV0ZWQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICBpZighbWF0Y2hlciB8fCBtYXRjaEhlYWRlclZhbHVlKHRoaXMsIHRoaXNba2V5XSwga2V5LCBtYXRjaGVyLCB0cnVlKSkge1xuICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICBkZWxldGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsZXRlZDtcbiAgfVxuXG4gIG5vcm1hbGl6ZShmb3JtYXQpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBoZWFkZXJzID0ge307XG5cbiAgICB1dGlscy5mb3JFYWNoKHRoaXMsICh2YWx1ZSwgaGVhZGVyKSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KGhlYWRlcnMsIGhlYWRlcik7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgc2VsZltrZXldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpO1xuICAgICAgICBkZWxldGUgc2VsZltoZWFkZXJdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBmb3JtYXQgPyBmb3JtYXRIZWFkZXIoaGVhZGVyKSA6IFN0cmluZyhoZWFkZXIpLnRyaW0oKTtcblxuICAgICAgaWYgKG5vcm1hbGl6ZWQgIT09IGhlYWRlcikge1xuICAgICAgICBkZWxldGUgc2VsZltoZWFkZXJdO1xuICAgICAgfVxuXG4gICAgICBzZWxmW25vcm1hbGl6ZWRdID0gbm9ybWFsaXplVmFsdWUodmFsdWUpO1xuXG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWRdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY29uY2F0KC4uLnRhcmdldHMpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jb25jYXQodGhpcywgLi4udGFyZ2V0cyk7XG4gIH1cblxuICB0b0pTT04oYXNTdHJpbmdzKSB7XG4gICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIHV0aWxzLmZvckVhY2godGhpcywgKHZhbHVlLCBoZWFkZXIpID0+IHtcbiAgICAgIHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlICYmIChvYmpbaGVhZGVyXSA9IGFzU3RyaW5ncyAmJiB1dGlscy5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLmpvaW4oJywgJykgOiB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMudG9KU09OKCkpW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnRvSlNPTigpKS5tYXAoKFtoZWFkZXIsIHZhbHVlXSkgPT4gaGVhZGVyICsgJzogJyArIHZhbHVlKS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ0F4aW9zSGVhZGVycyc7XG4gIH1cblxuICBzdGF0aWMgZnJvbSh0aGluZykge1xuICAgIHJldHVybiB0aGluZyBpbnN0YW5jZW9mIHRoaXMgPyB0aGluZyA6IG5ldyB0aGlzKHRoaW5nKTtcbiAgfVxuXG4gIHN0YXRpYyBjb25jYXQoZmlyc3QsIC4uLnRhcmdldHMpIHtcbiAgICBjb25zdCBjb21wdXRlZCA9IG5ldyB0aGlzKGZpcnN0KTtcblxuICAgIHRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiBjb21wdXRlZC5zZXQodGFyZ2V0KSk7XG5cbiAgICByZXR1cm4gY29tcHV0ZWQ7XG4gIH1cblxuICBzdGF0aWMgYWNjZXNzb3IoaGVhZGVyKSB7XG4gICAgY29uc3QgaW50ZXJuYWxzID0gdGhpc1skaW50ZXJuYWxzXSA9ICh0aGlzWyRpbnRlcm5hbHNdID0ge1xuICAgICAgYWNjZXNzb3JzOiB7fVxuICAgIH0pO1xuXG4gICAgY29uc3QgYWNjZXNzb3JzID0gaW50ZXJuYWxzLmFjY2Vzc29ycztcbiAgICBjb25zdCBwcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcblxuICAgIGZ1bmN0aW9uIGRlZmluZUFjY2Vzc29yKF9oZWFkZXIpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghYWNjZXNzb3JzW2xIZWFkZXJdKSB7XG4gICAgICAgIGJ1aWxkQWNjZXNzb3JzKHByb3RvdHlwZSwgX2hlYWRlcik7XG4gICAgICAgIGFjY2Vzc29yc1tsSGVhZGVyXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHMuaXNBcnJheShoZWFkZXIpID8gaGVhZGVyLmZvckVhY2goZGVmaW5lQWNjZXNzb3IpIDogZGVmaW5lQWNjZXNzb3IoaGVhZGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbkF4aW9zSGVhZGVycy5hY2Nlc3NvcihbJ0NvbnRlbnQtVHlwZScsICdDb250ZW50LUxlbmd0aCcsICdBY2NlcHQnLCAnQWNjZXB0LUVuY29kaW5nJywgJ1VzZXItQWdlbnQnLCAnQXV0aG9yaXphdGlvbiddKTtcblxudXRpbHMuZnJlZXplTWV0aG9kcyhBeGlvc0hlYWRlcnMucHJvdG90eXBlKTtcbnV0aWxzLmZyZWV6ZU1ldGhvZHMoQXhpb3NIZWFkZXJzKTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NIZWFkZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuLi9jb3JlL0F4aW9zSGVhZGVycy5qcyc7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7P09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShmbnMsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IGNvbmZpZyA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIGNvbnN0IGNvbnRleHQgPSByZXNwb25zZSB8fCBjb25maWc7XG4gIGNvbnN0IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShjb250ZXh0LmhlYWRlcnMpO1xuICBsZXQgZGF0YSA9IGNvbnRleHQuZGF0YTtcblxuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29uZmlnLCBkYXRhLCBoZWFkZXJzLm5vcm1hbGl6ZSgpLCByZXNwb25zZSA/IHJlc3BvbnNlLnN0YXR1cyA6IHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGhlYWRlcnMubm9ybWFsaXplKCk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsZWRFcnJvcmAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge09iamVjdD19IHJlcXVlc3QgVGhlIHJlcXVlc3QuXG4gKlxuICogQHJldHVybnMge0NhbmNlbGVkRXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgQXhpb3NFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgPT0gbnVsbCA/ICdjYW5jZWxlZCcgOiBtZXNzYWdlLCBBeGlvc0Vycm9yLkVSUl9DQU5DRUxFRCwgY29uZmlnLCByZXF1ZXN0KTtcbiAgdGhpcy5uYW1lID0gJ0NhbmNlbGVkRXJyb3InO1xufVxuXG51dGlscy5pbmhlcml0cyhDYW5jZWxlZEVycm9yLCBBeGlvc0Vycm9yLCB7XG4gIF9fQ0FOQ0VMX186IHRydWVcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDYW5jZWxlZEVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL0F4aW9zRXJyb3IuanMnO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSByZXNwb25zZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkK1xcLS5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBpc0Fic29sdXRlVVJMIGZyb20gJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyc7XG5pbXBvcnQgY29tYmluZVVSTHMgZnJvbSAnLi4vaGVscGVycy9jb21iaW5lVVJMcy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlVXJsID0gcmVxdWlyZSgndXJsJykucGFyc2U7XG5cbnZhciBERUZBVUxUX1BPUlRTID0ge1xuICBmdHA6IDIxLFxuICBnb3BoZXI6IDcwLFxuICBodHRwOiA4MCxcbiAgaHR0cHM6IDQ0MyxcbiAgd3M6IDgwLFxuICB3c3M6IDQ0Myxcbn07XG5cbnZhciBzdHJpbmdFbmRzV2l0aCA9IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGggfHwgZnVuY3Rpb24ocykge1xuICByZXR1cm4gcy5sZW5ndGggPD0gdGhpcy5sZW5ndGggJiZcbiAgICB0aGlzLmluZGV4T2YocywgdGhpcy5sZW5ndGggLSBzLmxlbmd0aCkgIT09IC0xO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHVybCAtIFRoZSBVUkwsIG9yIHRoZSByZXN1bHQgZnJvbSB1cmwucGFyc2UuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBVUkwgb2YgdGhlIHByb3h5IHRoYXQgc2hvdWxkIGhhbmRsZSB0aGUgcmVxdWVzdCB0byB0aGVcbiAqICBnaXZlbiBVUkwuIElmIG5vIHByb3h5IGlzIHNldCwgdGhpcyB3aWxsIGJlIGFuIGVtcHR5IHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJveHlGb3JVcmwodXJsKSB7XG4gIHZhciBwYXJzZWRVcmwgPSB0eXBlb2YgdXJsID09PSAnc3RyaW5nJyA/IHBhcnNlVXJsKHVybCkgOiB1cmwgfHwge307XG4gIHZhciBwcm90byA9IHBhcnNlZFVybC5wcm90b2NvbDtcbiAgdmFyIGhvc3RuYW1lID0gcGFyc2VkVXJsLmhvc3Q7XG4gIHZhciBwb3J0ID0gcGFyc2VkVXJsLnBvcnQ7XG4gIGlmICh0eXBlb2YgaG9zdG5hbWUgIT09ICdzdHJpbmcnIHx8ICFob3N0bmFtZSB8fCB0eXBlb2YgcHJvdG8gIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuICcnOyAgLy8gRG9uJ3QgcHJveHkgVVJMcyB3aXRob3V0IGEgdmFsaWQgc2NoZW1lIG9yIGhvc3QuXG4gIH1cblxuICBwcm90byA9IHByb3RvLnNwbGl0KCc6JywgMSlbMF07XG4gIC8vIFN0cmlwcGluZyBwb3J0cyBpbiB0aGlzIHdheSBpbnN0ZWFkIG9mIHVzaW5nIHBhcnNlZFVybC5ob3N0bmFtZSB0byBtYWtlXG4gIC8vIHN1cmUgdGhhdCB0aGUgYnJhY2tldHMgYXJvdW5kIElQdjYgYWRkcmVzc2VzIGFyZSBrZXB0LlxuICBob3N0bmFtZSA9IGhvc3RuYW1lLnJlcGxhY2UoLzpcXGQqJC8sICcnKTtcbiAgcG9ydCA9IHBhcnNlSW50KHBvcnQpIHx8IERFRkFVTFRfUE9SVFNbcHJvdG9dIHx8IDA7XG4gIGlmICghc2hvdWxkUHJveHkoaG9zdG5hbWUsIHBvcnQpKSB7XG4gICAgcmV0dXJuICcnOyAgLy8gRG9uJ3QgcHJveHkgVVJMcyB0aGF0IG1hdGNoIE5PX1BST1hZLlxuICB9XG5cbiAgdmFyIHByb3h5ID1cbiAgICBnZXRFbnYoJ25wbV9jb25maWdfJyArIHByb3RvICsgJ19wcm94eScpIHx8XG4gICAgZ2V0RW52KHByb3RvICsgJ19wcm94eScpIHx8XG4gICAgZ2V0RW52KCducG1fY29uZmlnX3Byb3h5JykgfHxcbiAgICBnZXRFbnYoJ2FsbF9wcm94eScpO1xuICBpZiAocHJveHkgJiYgcHJveHkuaW5kZXhPZignOi8vJykgPT09IC0xKSB7XG4gICAgLy8gTWlzc2luZyBzY2hlbWUgaW4gcHJveHksIGRlZmF1bHQgdG8gdGhlIHJlcXVlc3RlZCBVUkwncyBzY2hlbWUuXG4gICAgcHJveHkgPSBwcm90byArICc6Ly8nICsgcHJveHk7XG4gIH1cbiAgcmV0dXJuIHByb3h5O1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIGdpdmVuIFVSTCBzaG91bGQgYmUgcHJveGllZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaG9zdG5hbWUgLSBUaGUgaG9zdCBuYW1lIG9mIHRoZSBVUkwuXG4gKiBAcGFyYW0ge251bWJlcn0gcG9ydCAtIFRoZSBlZmZlY3RpdmUgcG9ydCBvZiB0aGUgVVJMLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdpdmVuIFVSTCBzaG91bGQgYmUgcHJveGllZC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNob3VsZFByb3h5KGhvc3RuYW1lLCBwb3J0KSB7XG4gIHZhciBOT19QUk9YWSA9XG4gICAgKGdldEVudignbnBtX2NvbmZpZ19ub19wcm94eScpIHx8IGdldEVudignbm9fcHJveHknKSkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFOT19QUk9YWSkge1xuICAgIHJldHVybiB0cnVlOyAgLy8gQWx3YXlzIHByb3h5IGlmIE5PX1BST1hZIGlzIG5vdCBzZXQuXG4gIH1cbiAgaWYgKE5PX1BST1hZID09PSAnKicpIHtcbiAgICByZXR1cm4gZmFsc2U7ICAvLyBOZXZlciBwcm94eSBpZiB3aWxkY2FyZCBpcyBzZXQuXG4gIH1cblxuICByZXR1cm4gTk9fUFJPWFkuc3BsaXQoL1ssXFxzXS8pLmV2ZXJ5KGZ1bmN0aW9uKHByb3h5KSB7XG4gICAgaWYgKCFwcm94eSkge1xuICAgICAgcmV0dXJuIHRydWU7ICAvLyBTa2lwIHplcm8tbGVuZ3RoIGhvc3RzLlxuICAgIH1cbiAgICB2YXIgcGFyc2VkUHJveHkgPSBwcm94eS5tYXRjaCgvXiguKyk6KFxcZCspJC8pO1xuICAgIHZhciBwYXJzZWRQcm94eUhvc3RuYW1lID0gcGFyc2VkUHJveHkgPyBwYXJzZWRQcm94eVsxXSA6IHByb3h5O1xuICAgIHZhciBwYXJzZWRQcm94eVBvcnQgPSBwYXJzZWRQcm94eSA/IHBhcnNlSW50KHBhcnNlZFByb3h5WzJdKSA6IDA7XG4gICAgaWYgKHBhcnNlZFByb3h5UG9ydCAmJiBwYXJzZWRQcm94eVBvcnQgIT09IHBvcnQpIHtcbiAgICAgIHJldHVybiB0cnVlOyAgLy8gU2tpcCBpZiBwb3J0cyBkb24ndCBtYXRjaC5cbiAgICB9XG5cbiAgICBpZiAoIS9eWy4qXS8udGVzdChwYXJzZWRQcm94eUhvc3RuYW1lKSkge1xuICAgICAgLy8gTm8gd2lsZGNhcmRzLCBzbyBzdG9wIHByb3h5aW5nIGlmIHRoZXJlIGlzIGFuIGV4YWN0IG1hdGNoLlxuICAgICAgcmV0dXJuIGhvc3RuYW1lICE9PSBwYXJzZWRQcm94eUhvc3RuYW1lO1xuICAgIH1cblxuICAgIGlmIChwYXJzZWRQcm94eUhvc3RuYW1lLmNoYXJBdCgwKSA9PT0gJyonKSB7XG4gICAgICAvLyBSZW1vdmUgbGVhZGluZyB3aWxkY2FyZC5cbiAgICAgIHBhcnNlZFByb3h5SG9zdG5hbWUgPSBwYXJzZWRQcm94eUhvc3RuYW1lLnNsaWNlKDEpO1xuICAgIH1cbiAgICAvLyBTdG9wIHByb3h5aW5nIGlmIHRoZSBob3N0bmFtZSBlbmRzIHdpdGggdGhlIG5vX3Byb3h5IGhvc3QuXG4gICAgcmV0dXJuICFzdHJpbmdFbmRzV2l0aC5jYWxsKGhvc3RuYW1lLCBwYXJzZWRQcm94eUhvc3RuYW1lKTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBmb3IgYW4gZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldEVudihrZXkpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52W2tleS50b0xvd2VyQ2FzZSgpXSB8fCBwcm9jZXNzLmVudltrZXkudG9VcHBlckNhc2UoKV0gfHwgJyc7XG59XG5cbmV4cG9ydHMuZ2V0UHJveHlGb3JVcmwgPSBnZXRQcm94eUZvclVybDtcbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXAoZW52KSB7XG5cdGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmRlZmF1bHQgPSBjcmVhdGVEZWJ1Zztcblx0Y3JlYXRlRGVidWcuY29lcmNlID0gY29lcmNlO1xuXHRjcmVhdGVEZWJ1Zy5kaXNhYmxlID0gZGlzYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlID0gZW5hYmxlO1xuXHRjcmVhdGVEZWJ1Zy5lbmFibGVkID0gZW5hYmxlZDtcblx0Y3JlYXRlRGVidWcuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXHRjcmVhdGVEZWJ1Zy5kZXN0cm95ID0gZGVzdHJveTtcblxuXHRPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goa2V5ID0+IHtcblx0XHRjcmVhdGVEZWJ1Z1trZXldID0gZW52W2tleV07XG5cdH0pO1xuXG5cdC8qKlxuXHQqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuXHQqL1xuXG5cdGNyZWF0ZURlYnVnLm5hbWVzID0gW107XG5cdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0LyoqXG5cdCogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuXHQqXG5cdCogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuXHQqL1xuXHRjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzID0ge307XG5cblx0LyoqXG5cdCogU2VsZWN0cyBhIGNvbG9yIGZvciBhIGRlYnVnIG5hbWVzcGFjZVxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgVGhlIG5hbWVzcGFjZSBzdHJpbmcgZm9yIHRoZSBkZWJ1ZyBpbnN0YW5jZSB0byBiZSBjb2xvcmVkXG5cdCogQHJldHVybiB7TnVtYmVyfFN0cmluZ30gQW4gQU5TSSBjb2xvciBjb2RlIGZvciB0aGUgZ2l2ZW4gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHNlbGVjdENvbG9yKG5hbWVzcGFjZSkge1xuXHRcdGxldCBoYXNoID0gMDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXNwYWNlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBuYW1lc3BhY2UuY2hhckNvZGVBdChpKTtcblx0XHRcdGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNyZWF0ZURlYnVnLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGNyZWF0ZURlYnVnLmNvbG9ycy5sZW5ndGhdO1xuXHR9XG5cdGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yID0gc2VsZWN0Q29sb3I7XG5cblx0LyoqXG5cdCogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG5cdCpcblx0KiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQHJldHVybiB7RnVuY3Rpb259XG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlRGVidWcobmFtZXNwYWNlKSB7XG5cdFx0bGV0IHByZXZUaW1lO1xuXHRcdGxldCBlbmFibGVPdmVycmlkZSA9IG51bGw7XG5cdFx0bGV0IG5hbWVzcGFjZXNDYWNoZTtcblx0XHRsZXQgZW5hYmxlZENhY2hlO1xuXG5cdFx0ZnVuY3Rpb24gZGVidWcoLi4uYXJncykge1xuXHRcdFx0Ly8gRGlzYWJsZWQ/XG5cdFx0XHRpZiAoIWRlYnVnLmVuYWJsZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWxmID0gZGVidWc7XG5cblx0XHRcdC8vIFNldCBgZGlmZmAgdGltZXN0YW1wXG5cdFx0XHRjb25zdCBjdXJyID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuXHRcdFx0Y29uc3QgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuXHRcdFx0c2VsZi5kaWZmID0gbXM7XG5cdFx0XHRzZWxmLnByZXYgPSBwcmV2VGltZTtcblx0XHRcdHNlbGYuY3VyciA9IGN1cnI7XG5cdFx0XHRwcmV2VGltZSA9IGN1cnI7XG5cblx0XHRcdGFyZ3NbMF0gPSBjcmVhdGVEZWJ1Zy5jb2VyY2UoYXJnc1swXSk7XG5cblx0XHRcdGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cblx0XHRcdFx0YXJncy51bnNoaWZ0KCclTycpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuXHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EtekEtWiVdKS9nLCAobWF0Y2gsIGZvcm1hdCkgPT4ge1xuXHRcdFx0XHQvLyBJZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG5cdFx0XHRcdGlmIChtYXRjaCA9PT0gJyUlJykge1xuXHRcdFx0XHRcdHJldHVybiAnJSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0Y29uc3QgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuXHRcdFx0XHRcdG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuXHRcdFx0XHRcdC8vIE5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcblx0XHRcdFx0XHRhcmdzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0aW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblx0XHRcdGNyZWF0ZURlYnVnLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuXHRcdFx0Y29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG5cdFx0XHRsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cdFx0ZGVidWcudXNlQ29sb3JzID0gY3JlYXRlRGVidWcudXNlQ29sb3JzKCk7XG5cdFx0ZGVidWcuY29sb3IgPSBjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXHRcdGRlYnVnLmV4dGVuZCA9IGV4dGVuZDtcblx0XHRkZWJ1Zy5kZXN0cm95ID0gY3JlYXRlRGVidWcuZGVzdHJveTsgLy8gWFhYIFRlbXBvcmFyeS4gV2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVidWcsICdlbmFibGVkJywge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHtcblx0XHRcdFx0aWYgKGVuYWJsZU92ZXJyaWRlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVuYWJsZU92ZXJyaWRlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuYW1lc3BhY2VzQ2FjaGUgIT09IGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMpIHtcblx0XHRcdFx0XHRuYW1lc3BhY2VzQ2FjaGUgPSBjcmVhdGVEZWJ1Zy5uYW1lc3BhY2VzO1xuXHRcdFx0XHRcdGVuYWJsZWRDYWNoZSA9IGNyZWF0ZURlYnVnLmVuYWJsZWQobmFtZXNwYWNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbmFibGVkQ2FjaGU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiB2ID0+IHtcblx0XHRcdFx0ZW5hYmxlT3ZlcnJpZGUgPSB2O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gRW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcblx0XHRpZiAodHlwZW9mIGNyZWF0ZURlYnVnLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNyZWF0ZURlYnVnLmluaXQoZGVidWcpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWJ1Zztcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZChuYW1lc3BhY2UsIGRlbGltaXRlcikge1xuXHRcdGNvbnN0IG5ld0RlYnVnID0gY3JlYXRlRGVidWcodGhpcy5uYW1lc3BhY2UgKyAodHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnOicgOiBkZWxpbWl0ZXIpICsgbmFtZXNwYWNlKTtcblx0XHRuZXdEZWJ1Zy5sb2cgPSB0aGlzLmxvZztcblx0XHRyZXR1cm4gbmV3RGVidWc7XG5cdH1cblxuXHQvKipcblx0KiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG5cdCogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcblx0XHRjcmVhdGVEZWJ1Zy5zYXZlKG5hbWVzcGFjZXMpO1xuXHRcdGNyZWF0ZURlYnVnLm5hbWVzcGFjZXMgPSBuYW1lc3BhY2VzO1xuXG5cdFx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0XHRjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuXG5cdFx0bGV0IGk7XG5cdFx0Y29uc3Qgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuXHRcdGNvbnN0IGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKCFzcGxpdFtpXSkge1xuXHRcdFx0XHQvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0bmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG5cblx0XHRcdGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcblx0XHRcdFx0Y3JlYXRlRGVidWcuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc2xpY2UoMSkgKyAnJCcpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG5cdCpcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBkaXNhYmxlKCkge1xuXHRcdGNvbnN0IG5hbWVzcGFjZXMgPSBbXG5cdFx0XHQuLi5jcmVhdGVEZWJ1Zy5uYW1lcy5tYXAodG9OYW1lc3BhY2UpLFxuXHRcdFx0Li4uY3JlYXRlRGVidWcuc2tpcHMubWFwKHRvTmFtZXNwYWNlKS5tYXAobmFtZXNwYWNlID0+ICctJyArIG5hbWVzcGFjZSlcblx0XHRdLmpvaW4oJywnKTtcblx0XHRjcmVhdGVEZWJ1Zy5lbmFibGUoJycpO1xuXHRcdHJldHVybiBuYW1lc3BhY2VzO1xuXHR9XG5cblx0LyoqXG5cdCogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVcblx0KiBAcmV0dXJuIHtCb29sZWFufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuXHRcdGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0bGV0IGk7XG5cdFx0bGV0IGxlbjtcblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgbGVuID0gY3JlYXRlRGVidWcubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChjcmVhdGVEZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQqIENvbnZlcnQgcmVnZXhwIHRvIG5hbWVzcGFjZVxuXHQqXG5cdCogQHBhcmFtIHtSZWdFeHB9IHJlZ3hlcFxuXHQqIEByZXR1cm4ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHRvTmFtZXNwYWNlKHJlZ2V4cCkge1xuXHRcdHJldHVybiByZWdleHAudG9TdHJpbmcoKVxuXHRcdFx0LnN1YnN0cmluZygyLCByZWdleHAudG9TdHJpbmcoKS5sZW5ndGggLSAyKVxuXHRcdFx0LnJlcGxhY2UoL1xcLlxcKlxcPyQvLCAnKicpO1xuXHR9XG5cblx0LyoqXG5cdCogQ29lcmNlIGB2YWxgLlxuXHQqXG5cdCogQHBhcmFtIHtNaXhlZH0gdmFsXG5cdCogQHJldHVybiB7TWl4ZWR9XG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcblx0XHRpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHQvKipcblx0KiBYWFggRE8gTk9UIFVTRS4gVGhpcyBpcyBhIHRlbXBvcmFyeSBzdHViIGZ1bmN0aW9uLlxuXHQqIFhYWCBJdCBXSUxMIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblx0Ki9cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0fVxuXG5cdGNyZWF0ZURlYnVnLmVuYWJsZShjcmVhdGVEZWJ1Zy5sb2FkKCkpO1xuXG5cdHJldHVybiBjcmVhdGVEZWJ1Zztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cDtcbiIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9IGxvY2Fsc3RvcmFnZSgpO1xuZXhwb3J0cy5kZXN0cm95ID0gKCgpID0+IHtcblx0bGV0IHdhcm5lZCA9IGZhbHNlO1xuXG5cdHJldHVybiAoKSA9PiB7XG5cdFx0aWYgKCF3YXJuZWQpIHtcblx0XHRcdHdhcm5lZCA9IHRydWU7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0XHR9XG5cdH07XG59KSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcblx0JyMwMDAwQ0MnLFxuXHQnIzAwMDBGRicsXG5cdCcjMDAzM0NDJyxcblx0JyMwMDMzRkYnLFxuXHQnIzAwNjZDQycsXG5cdCcjMDA2NkZGJyxcblx0JyMwMDk5Q0MnLFxuXHQnIzAwOTlGRicsXG5cdCcjMDBDQzAwJyxcblx0JyMwMENDMzMnLFxuXHQnIzAwQ0M2NicsXG5cdCcjMDBDQzk5Jyxcblx0JyMwMENDQ0MnLFxuXHQnIzAwQ0NGRicsXG5cdCcjMzMwMENDJyxcblx0JyMzMzAwRkYnLFxuXHQnIzMzMzNDQycsXG5cdCcjMzMzM0ZGJyxcblx0JyMzMzY2Q0MnLFxuXHQnIzMzNjZGRicsXG5cdCcjMzM5OUNDJyxcblx0JyMzMzk5RkYnLFxuXHQnIzMzQ0MwMCcsXG5cdCcjMzNDQzMzJyxcblx0JyMzM0NDNjYnLFxuXHQnIzMzQ0M5OScsXG5cdCcjMzNDQ0NDJyxcblx0JyMzM0NDRkYnLFxuXHQnIzY2MDBDQycsXG5cdCcjNjYwMEZGJyxcblx0JyM2NjMzQ0MnLFxuXHQnIzY2MzNGRicsXG5cdCcjNjZDQzAwJyxcblx0JyM2NkNDMzMnLFxuXHQnIzk5MDBDQycsXG5cdCcjOTkwMEZGJyxcblx0JyM5OTMzQ0MnLFxuXHQnIzk5MzNGRicsXG5cdCcjOTlDQzAwJyxcblx0JyM5OUNDMzMnLFxuXHQnI0NDMDAwMCcsXG5cdCcjQ0MwMDMzJyxcblx0JyNDQzAwNjYnLFxuXHQnI0NDMDA5OScsXG5cdCcjQ0MwMENDJyxcblx0JyNDQzAwRkYnLFxuXHQnI0NDMzMwMCcsXG5cdCcjQ0MzMzMzJyxcblx0JyNDQzMzNjYnLFxuXHQnI0NDMzM5OScsXG5cdCcjQ0MzM0NDJyxcblx0JyNDQzMzRkYnLFxuXHQnI0NDNjYwMCcsXG5cdCcjQ0M2NjMzJyxcblx0JyNDQzk5MDAnLFxuXHQnI0NDOTkzMycsXG5cdCcjQ0NDQzAwJyxcblx0JyNDQ0NDMzMnLFxuXHQnI0ZGMDAwMCcsXG5cdCcjRkYwMDMzJyxcblx0JyNGRjAwNjYnLFxuXHQnI0ZGMDA5OScsXG5cdCcjRkYwMENDJyxcblx0JyNGRjAwRkYnLFxuXHQnI0ZGMzMwMCcsXG5cdCcjRkYzMzMzJyxcblx0JyNGRjMzNjYnLFxuXHQnI0ZGMzM5OScsXG5cdCcjRkYzM0NDJyxcblx0JyNGRjMzRkYnLFxuXHQnI0ZGNjYwMCcsXG5cdCcjRkY2NjMzJyxcblx0JyNGRjk5MDAnLFxuXHQnI0ZGOTkzMycsXG5cdCcjRkZDQzAwJyxcblx0JyNGRkNDMzMnXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG5cdC8vIE5COiBJbiBhbiBFbGVjdHJvbiBwcmVsb2FkIHNjcmlwdCwgZG9jdW1lbnQgd2lsbCBiZSBkZWZpbmVkIGJ1dCBub3QgZnVsbHlcblx0Ly8gaW5pdGlhbGl6ZWQuIFNpbmNlIHdlIGtub3cgd2UncmUgaW4gQ2hyb21lLCB3ZSdsbCBqdXN0IGRldGVjdCB0aGlzIGNhc2Vcblx0Ly8gZXhwbGljaXRseVxuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnByb2Nlc3MgJiYgKHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicgfHwgd2luZG93LnByb2Nlc3MuX19ud2pzKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgYW5kIEVkZ2UgZG8gbm90IHN1cHBvcnQgY29sb3JzLlxuXHRpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goLyhlZGdlfHRyaWRlbnQpXFwvKFxcZCspLykpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBJcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuXHQvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuXHRyZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcblx0XHQvLyBJcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG5cdFx0KHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcblx0XHQvLyBJcyBmaXJlZm94ID49IHYzMT9cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcblx0XHQodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcblx0XHQvLyBEb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG5cdFx0KHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcblx0YXJnc1swXSA9ICh0aGlzLnVzZUNvbG9ycyA/ICclYycgOiAnJykgK1xuXHRcdHRoaXMubmFtZXNwYWNlICtcblx0XHQodGhpcy51c2VDb2xvcnMgPyAnICVjJyA6ICcgJykgK1xuXHRcdGFyZ3NbMF0gK1xuXHRcdCh0aGlzLnVzZUNvbG9ycyA/ICclYyAnIDogJyAnKSArXG5cdFx0JysnICsgbW9kdWxlLmV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuXHRpZiAoIXRoaXMudXNlQ29sb3JzKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG5cdGFyZ3Muc3BsaWNlKDEsIDAsIGMsICdjb2xvcjogaW5oZXJpdCcpO1xuXG5cdC8vIFRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG5cdC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cblx0Ly8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG5cdGxldCBpbmRleCA9IDA7XG5cdGxldCBsYXN0QyA9IDA7XG5cdGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBtYXRjaCA9PiB7XG5cdFx0aWYgKG1hdGNoID09PSAnJSUnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGluZGV4Kys7XG5cdFx0aWYgKG1hdGNoID09PSAnJWMnKSB7XG5cdFx0XHQvLyBXZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcblx0XHRcdC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG5cdFx0XHRsYXN0QyA9IGluZGV4O1xuXHRcdH1cblx0fSk7XG5cblx0YXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUuZGVidWcoKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKiBJZiBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGF2YWlsYWJsZSwgZmFsbHMgYmFja1xuICogdG8gYGNvbnNvbGUubG9nYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnRzLmxvZyA9IGNvbnNvbGUuZGVidWcgfHwgY29uc29sZS5sb2cgfHwgKCgpID0+IHt9KTtcblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuXHR0cnkge1xuXHRcdGlmIChuYW1lc3BhY2VzKSB7XG5cdFx0XHRleHBvcnRzLnN0b3JhZ2Uuc2V0SXRlbSgnZGVidWcnLCBuYW1lc3BhY2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBsb2FkKCkge1xuXHRsZXQgcjtcblx0dHJ5IHtcblx0XHRyID0gZXhwb3J0cy5zdG9yYWdlLmdldEl0ZW0oJ2RlYnVnJyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG5cblx0Ly8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuXHRpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcblx0XHRyID0gcHJvY2Vzcy5lbnYuREVCVUc7XG5cdH1cblxuXHRyZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG5cdHRyeSB7XG5cdFx0Ly8gVFZNTEtpdCAoQXBwbGUgVFYgSlMgUnVudGltZSkgZG9lcyBub3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QsIGp1c3QgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dFxuXHRcdC8vIFRoZSBCcm93c2VyIGFsc28gaGFzIGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHQuXG5cdFx0cmV0dXJuIGxvY2FsU3RvcmFnZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuXG5jb25zdCB7Zm9ybWF0dGVyc30gPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZm9ybWF0dGVycy5qID0gZnVuY3Rpb24gKHYpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuICdbVW5leHBlY3RlZEpTT05QYXJzZUVycm9yXTogJyArIGVycm9yLm1lc3NhZ2U7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YgPSBwcm9jZXNzLmFyZ3YpID0+IHtcblx0Y29uc3QgcHJlZml4ID0gZmxhZy5zdGFydHNXaXRoKCctJykgPyAnJyA6IChmbGFnLmxlbmd0aCA9PT0gMSA/ICctJyA6ICctLScpO1xuXHRjb25zdCBwb3NpdGlvbiA9IGFyZ3YuaW5kZXhPZihwcmVmaXggKyBmbGFnKTtcblx0Y29uc3QgdGVybWluYXRvclBvc2l0aW9uID0gYXJndi5pbmRleE9mKCctLScpO1xuXHRyZXR1cm4gcG9zaXRpb24gIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zaXRpb24gPT09IC0xIHx8IHBvc2l0aW9uIDwgdGVybWluYXRvclBvc2l0aW9uKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5jb25zdCB0dHkgPSByZXF1aXJlKCd0dHknKTtcbmNvbnN0IGhhc0ZsYWcgPSByZXF1aXJlKCdoYXMtZmxhZycpO1xuXG5jb25zdCB7ZW52fSA9IHByb2Nlc3M7XG5cbmxldCBmb3JjZUNvbG9yO1xuaWYgKGhhc0ZsYWcoJ25vLWNvbG9yJykgfHxcblx0aGFzRmxhZygnbm8tY29sb3JzJykgfHxcblx0aGFzRmxhZygnY29sb3I9ZmFsc2UnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1uZXZlcicpKSB7XG5cdGZvcmNlQ29sb3IgPSAwO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gMTtcbn1cblxuaWYgKCdGT1JDRV9DT0xPUicgaW4gZW52KSB7XG5cdGlmIChlbnYuRk9SQ0VfQ09MT1IgPT09ICd0cnVlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAxO1xuXHR9IGVsc2UgaWYgKGVudi5GT1JDRV9DT0xPUiA9PT0gJ2ZhbHNlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAwO1xuXHR9IGVsc2Uge1xuXHRcdGZvcmNlQ29sb3IgPSBlbnYuRk9SQ0VfQ09MT1IubGVuZ3RoID09PSAwID8gMSA6IE1hdGgubWluKHBhcnNlSW50KGVudi5GT1JDRV9DT0xPUiwgMTApLCAzKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGVMZXZlbChsZXZlbCkge1xuXHRpZiAobGV2ZWwgPT09IDApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGxldmVsLFxuXHRcdGhhc0Jhc2ljOiB0cnVlLFxuXHRcdGhhczI1NjogbGV2ZWwgPj0gMixcblx0XHRoYXMxNm06IGxldmVsID49IDNcblx0fTtcbn1cblxuZnVuY3Rpb24gc3VwcG9ydHNDb2xvcihoYXZlU3RyZWFtLCBzdHJlYW1Jc1RUWSkge1xuXHRpZiAoZm9yY2VDb2xvciA9PT0gMCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKGhhdmVTdHJlYW0gJiYgIXN0cmVhbUlzVFRZICYmIGZvcmNlQ29sb3IgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0Y29uc3QgbWluID0gZm9yY2VDb2xvciB8fCAwO1xuXG5cdGlmIChlbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG5cdFx0cmV0dXJuIG1pbjtcblx0fVxuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0Ly8gV2luZG93cyAxMCBidWlsZCAxMDU4NiBpcyB0aGUgZmlyc3QgV2luZG93cyByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMjU2IGNvbG9ycy5cblx0XHQvLyBXaW5kb3dzIDEwIGJ1aWxkIDE0OTMxIGlzIHRoZSBmaXJzdCByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMTZtL1RydWVDb2xvci5cblx0XHRjb25zdCBvc1JlbGVhc2UgPSBvcy5yZWxlYXNlKCkuc3BsaXQoJy4nKTtcblx0XHRpZiAoXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSScsICdHSVRIVUJfQUNUSU9OUycsICdCVUlMREtJVEUnXS5zb21lKHNpZ24gPT4gc2lnbiBpbiBlbnYpIHx8IGVudi5DSV9OQU1FID09PSAnY29kZXNoaXAnKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWluO1xuXHR9XG5cblx0aWYgKCdURUFNQ0lUWV9WRVJTSU9OJyBpbiBlbnYpIHtcblx0XHRyZXR1cm4gL14oOVxcLigwKlsxLTldXFxkKilcXC58XFxkezIsfVxcLikvLnRlc3QoZW52LlRFQU1DSVRZX1ZFUlNJT04pID8gMSA6IDA7XG5cdH1cblxuXHRpZiAoZW52LkNPTE9SVEVSTSA9PT0gJ3RydWVjb2xvcicpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmICgnVEVSTV9QUk9HUkFNJyBpbiBlbnYpIHtcblx0XHRjb25zdCB2ZXJzaW9uID0gcGFyc2VJbnQoKGVudi5URVJNX1BST0dSQU1fVkVSU0lPTiB8fCAnJykuc3BsaXQoJy4nKVswXSwgMTApO1xuXG5cdFx0c3dpdGNoIChlbnYuVEVSTV9QUk9HUkFNKSB7XG5cdFx0XHRjYXNlICdpVGVybS5hcHAnOlxuXHRcdFx0XHRyZXR1cm4gdmVyc2lvbiA+PSAzID8gMyA6IDI7XG5cdFx0XHRjYXNlICdBcHBsZV9UZXJtaW5hbCc6XG5cdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0Ly8gTm8gZGVmYXVsdFxuXHRcdH1cblx0fVxuXG5cdGlmICgvLTI1Nihjb2xvcik/JC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDI7XG5cdH1cblxuXHRpZiAoL15zY3JlZW58Xnh0ZXJtfF52dDEwMHxednQyMjB8XnJ4dnR8Y29sb3J8YW5zaXxjeWd3aW58bGludXgvaS50ZXN0KGVudi5URVJNKSkge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDT0xPUlRFUk0nIGluIGVudikge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0cmV0dXJuIG1pbjtcbn1cblxuZnVuY3Rpb24gZ2V0U3VwcG9ydExldmVsKHN0cmVhbSkge1xuXHRjb25zdCBsZXZlbCA9IHN1cHBvcnRzQ29sb3Ioc3RyZWFtLCBzdHJlYW0gJiYgc3RyZWFtLmlzVFRZKTtcblx0cmV0dXJuIHRyYW5zbGF0ZUxldmVsKGxldmVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN1cHBvcnRzQ29sb3I6IGdldFN1cHBvcnRMZXZlbCxcblx0c3Rkb3V0OiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMSkpKSxcblx0c3RkZXJyOiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMikpKVxufTtcbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG5jb25zdCB0dHkgPSByZXF1aXJlKCd0dHknKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgTm9kZS5qcyBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cblxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLmRlc3Ryb3kgPSB1dGlsLmRlcHJlY2F0ZShcblx0KCkgPT4ge30sXG5cdCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJ1xuKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbNiwgMiwgMywgNCwgNSwgMV07XG5cbnRyeSB7XG5cdC8vIE9wdGlvbmFsIGRlcGVuZGVuY3kgKGFzIGluLCBkb2Vzbid0IG5lZWQgdG8gYmUgaW5zdGFsbGVkLCBOT1QgbGlrZSBvcHRpb25hbERlcGVuZGVuY2llcyBpbiBwYWNrYWdlLmpzb24pXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblx0Y29uc3Qgc3VwcG9ydHNDb2xvciA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG5cblx0aWYgKHN1cHBvcnRzQ29sb3IgJiYgKHN1cHBvcnRzQ29sb3Iuc3RkZXJyIHx8IHN1cHBvcnRzQ29sb3IpLmxldmVsID49IDIpIHtcblx0XHRleHBvcnRzLmNvbG9ycyA9IFtcblx0XHRcdDIwLFxuXHRcdFx0MjEsXG5cdFx0XHQyNixcblx0XHRcdDI3LFxuXHRcdFx0MzIsXG5cdFx0XHQzMyxcblx0XHRcdDM4LFxuXHRcdFx0MzksXG5cdFx0XHQ0MCxcblx0XHRcdDQxLFxuXHRcdFx0NDIsXG5cdFx0XHQ0Myxcblx0XHRcdDQ0LFxuXHRcdFx0NDUsXG5cdFx0XHQ1Nixcblx0XHRcdDU3LFxuXHRcdFx0NjIsXG5cdFx0XHQ2Myxcblx0XHRcdDY4LFxuXHRcdFx0NjksXG5cdFx0XHQ3NCxcblx0XHRcdDc1LFxuXHRcdFx0NzYsXG5cdFx0XHQ3Nyxcblx0XHRcdDc4LFxuXHRcdFx0NzksXG5cdFx0XHQ4MCxcblx0XHRcdDgxLFxuXHRcdFx0OTIsXG5cdFx0XHQ5Myxcblx0XHRcdDk4LFxuXHRcdFx0OTksXG5cdFx0XHQxMTIsXG5cdFx0XHQxMTMsXG5cdFx0XHQxMjgsXG5cdFx0XHQxMjksXG5cdFx0XHQxMzQsXG5cdFx0XHQxMzUsXG5cdFx0XHQxNDgsXG5cdFx0XHQxNDksXG5cdFx0XHQxNjAsXG5cdFx0XHQxNjEsXG5cdFx0XHQxNjIsXG5cdFx0XHQxNjMsXG5cdFx0XHQxNjQsXG5cdFx0XHQxNjUsXG5cdFx0XHQxNjYsXG5cdFx0XHQxNjcsXG5cdFx0XHQxNjgsXG5cdFx0XHQxNjksXG5cdFx0XHQxNzAsXG5cdFx0XHQxNzEsXG5cdFx0XHQxNzIsXG5cdFx0XHQxNzMsXG5cdFx0XHQxNzgsXG5cdFx0XHQxNzksXG5cdFx0XHQxODQsXG5cdFx0XHQxODUsXG5cdFx0XHQxOTYsXG5cdFx0XHQxOTcsXG5cdFx0XHQxOTgsXG5cdFx0XHQxOTksXG5cdFx0XHQyMDAsXG5cdFx0XHQyMDEsXG5cdFx0XHQyMDIsXG5cdFx0XHQyMDMsXG5cdFx0XHQyMDQsXG5cdFx0XHQyMDUsXG5cdFx0XHQyMDYsXG5cdFx0XHQyMDcsXG5cdFx0XHQyMDgsXG5cdFx0XHQyMDksXG5cdFx0XHQyMTQsXG5cdFx0XHQyMTUsXG5cdFx0XHQyMjAsXG5cdFx0XHQyMjFcblx0XHRdO1xuXHR9XG59IGNhdGNoIChlcnJvcikge1xuXHQvLyBTd2FsbG93IC0gd2Ugb25seSBjYXJlIGlmIGBzdXBwb3J0cy1jb2xvcmAgaXMgYXZhaWxhYmxlOyBpdCBkb2Vzbid0IGhhdmUgdG8gYmUuXG59XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIGRlZmF1bHQgYGluc3BlY3RPcHRzYCBvYmplY3QgZnJvbSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqICAgJCBERUJVR19DT0xPUlM9bm8gREVCVUdfREVQVEg9MTAgREVCVUdfU0hPV19ISURERU49ZW5hYmxlZCBub2RlIHNjcmlwdC5qc1xuICovXG5cbmV4cG9ydHMuaW5zcGVjdE9wdHMgPSBPYmplY3Qua2V5cyhwcm9jZXNzLmVudikuZmlsdGVyKGtleSA9PiB7XG5cdHJldHVybiAvXmRlYnVnXy9pLnRlc3Qoa2V5KTtcbn0pLnJlZHVjZSgob2JqLCBrZXkpID0+IHtcblx0Ly8gQ2FtZWwtY2FzZVxuXHRjb25zdCBwcm9wID0ga2V5XG5cdFx0LnN1YnN0cmluZyg2KVxuXHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0LnJlcGxhY2UoL18oW2Etel0pL2csIChfLCBrKSA9PiB7XG5cdFx0XHRyZXR1cm4gay50b1VwcGVyQ2FzZSgpO1xuXHRcdH0pO1xuXG5cdC8vIENvZXJjZSBzdHJpbmcgdmFsdWUgaW50byBKUyB2YWx1ZVxuXHRsZXQgdmFsID0gcHJvY2Vzcy5lbnZba2V5XTtcblx0aWYgKC9eKHllc3xvbnx0cnVlfGVuYWJsZWQpJC9pLnRlc3QodmFsKSkge1xuXHRcdHZhbCA9IHRydWU7XG5cdH0gZWxzZSBpZiAoL14obm98b2ZmfGZhbHNlfGRpc2FibGVkKSQvaS50ZXN0KHZhbCkpIHtcblx0XHR2YWwgPSBmYWxzZTtcblx0fSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuXHRcdHZhbCA9IG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0dmFsID0gTnVtYmVyKHZhbCk7XG5cdH1cblxuXHRvYmpbcHJvcF0gPSB2YWw7XG5cdHJldHVybiBvYmo7XG59LCB7fSk7XG5cbi8qKlxuICogSXMgc3Rkb3V0IGEgVFRZPyBDb2xvcmVkIG91dHB1dCBpcyBlbmFibGVkIHdoZW4gYHRydWVgLlxuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcblx0cmV0dXJuICdjb2xvcnMnIGluIGV4cG9ydHMuaW5zcGVjdE9wdHMgP1xuXHRcdEJvb2xlYW4oZXhwb3J0cy5pbnNwZWN0T3B0cy5jb2xvcnMpIDpcblx0XHR0dHkuaXNhdHR5KHByb2Nlc3Muc3RkZXJyLmZkKTtcbn1cblxuLyoqXG4gKiBBZGRzIEFOU0kgY29sb3IgZXNjYXBlIGNvZGVzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcblx0Y29uc3Qge25hbWVzcGFjZTogbmFtZSwgdXNlQ29sb3JzfSA9IHRoaXM7XG5cblx0aWYgKHVzZUNvbG9ycykge1xuXHRcdGNvbnN0IGMgPSB0aGlzLmNvbG9yO1xuXHRcdGNvbnN0IGNvbG9yQ29kZSA9ICdcXHUwMDFCWzMnICsgKGMgPCA4ID8gYyA6ICc4OzU7JyArIGMpO1xuXHRcdGNvbnN0IHByZWZpeCA9IGAgICR7Y29sb3JDb2RlfTsxbSR7bmFtZX0gXFx1MDAxQlswbWA7XG5cblx0XHRhcmdzWzBdID0gcHJlZml4ICsgYXJnc1swXS5zcGxpdCgnXFxuJykuam9pbignXFxuJyArIHByZWZpeCk7XG5cdFx0YXJncy5wdXNoKGNvbG9yQ29kZSArICdtKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpICsgJ1xcdTAwMUJbMG0nKTtcblx0fSBlbHNlIHtcblx0XHRhcmdzWzBdID0gZ2V0RGF0ZSgpICsgbmFtZSArICcgJyArIGFyZ3NbMF07XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RGF0ZSgpIHtcblx0aWYgKGV4cG9ydHMuaW5zcGVjdE9wdHMuaGlkZURhdGUpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0cmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArICcgJztcbn1cblxuLyoqXG4gKiBJbnZva2VzIGB1dGlsLmZvcm1hdCgpYCB3aXRoIHRoZSBzcGVjaWZpZWQgYXJndW1lbnRzIGFuZCB3cml0ZXMgdG8gc3RkZXJyLlxuICovXG5cbmZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG5cdHJldHVybiBwcm9jZXNzLnN0ZGVyci53cml0ZSh1dGlsLmZvcm1hdCguLi5hcmdzKSArICdcXG4nKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuXHRpZiAobmFtZXNwYWNlcykge1xuXHRcdHByb2Nlc3MuZW52LkRFQlVHID0gbmFtZXNwYWNlcztcblx0fSBlbHNlIHtcblx0XHQvLyBJZiB5b3Ugc2V0IGEgcHJvY2Vzcy5lbnYgZmllbGQgdG8gbnVsbCBvciB1bmRlZmluZWQsIGl0IGdldHMgY2FzdCB0byB0aGVcblx0XHQvLyBzdHJpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnLiBKdXN0IGRlbGV0ZSBpbnN0ZWFkLlxuXHRcdGRlbGV0ZSBwcm9jZXNzLmVudi5ERUJVRztcblx0fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG5cdHJldHVybiBwcm9jZXNzLmVudi5ERUJVRztcbn1cblxuLyoqXG4gKiBJbml0IGxvZ2ljIGZvciBgZGVidWdgIGluc3RhbmNlcy5cbiAqXG4gKiBDcmVhdGUgYSBuZXcgYGluc3BlY3RPcHRzYCBvYmplY3QgaW4gY2FzZSBgdXNlQ29sb3JzYCBpcyBzZXRcbiAqIGRpZmZlcmVudGx5IGZvciBhIHBhcnRpY3VsYXIgYGRlYnVnYCBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBpbml0KGRlYnVnKSB7XG5cdGRlYnVnLmluc3BlY3RPcHRzID0ge307XG5cblx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRkZWJ1Zy5pbnNwZWN0T3B0c1trZXlzW2ldXSA9IGV4cG9ydHMuaW5zcGVjdE9wdHNba2V5c1tpXV07XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuXG5jb25zdCB7Zm9ybWF0dGVyc30gPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsIG9uIGEgc2luZ2xlIGxpbmUuXG4gKi9cblxuZm9ybWF0dGVycy5vID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKVxuXHRcdC5zcGxpdCgnXFxuJylcblx0XHQubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuXHRcdC5qb2luKCcgJyk7XG59O1xuXG4vKipcbiAqIE1hcCAlTyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGxvd2luZyBtdWx0aXBsZSBsaW5lcyBpZiBuZWVkZWQuXG4gKi9cblxuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG4iLCIvKipcbiAqIERldGVjdCBFbGVjdHJvbiByZW5kZXJlciAvIG53anMgcHJvY2Vzcywgd2hpY2ggaXMgbm9kZSwgYnV0IHdlIHNob3VsZFxuICogdHJlYXQgYXMgYSBicm93c2VyLlxuICovXG5cbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHByb2Nlc3MuYnJvd3NlciA9PT0gdHJ1ZSB8fCBwcm9jZXNzLl9fbndqcykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpO1xufSBlbHNlIHtcblx0bW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL25vZGUuanMnKTtcbn1cbiIsInZhciBkZWJ1ZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghZGVidWcpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50IGdsb2JhbC1yZXF1aXJlOiBvZmYgKi9cbiAgICAgIGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwiZm9sbG93LXJlZGlyZWN0c1wiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IC8qICovIH1cbiAgICBpZiAodHlwZW9mIGRlYnVnICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGRlYnVnID0gZnVuY3Rpb24gKCkgeyAvKiAqLyB9O1xuICAgIH1cbiAgfVxuICBkZWJ1Zy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufTtcbiIsInZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xudmFyIFVSTCA9IHVybC5VUkw7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xudmFyIGh0dHBzID0gcmVxdWlyZShcImh0dHBzXCIpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZShcInN0cmVhbVwiKS5Xcml0YWJsZTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xudmFyIGRlYnVnID0gcmVxdWlyZShcIi4vZGVidWdcIik7XG5cbi8vIENyZWF0ZSBoYW5kbGVycyB0aGF0IHBhc3MgZXZlbnRzIGZyb20gbmF0aXZlIHJlcXVlc3RzXG52YXIgZXZlbnRzID0gW1wiYWJvcnRcIiwgXCJhYm9ydGVkXCIsIFwiY29ubmVjdFwiLCBcImVycm9yXCIsIFwic29ja2V0XCIsIFwidGltZW91dFwiXTtcbnZhciBldmVudEhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudEhhbmRsZXJzW2V2ZW50XSA9IGZ1bmN0aW9uIChhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgdGhpcy5fcmVkaXJlY3RhYmxlLmVtaXQoZXZlbnQsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICB9O1xufSk7XG5cbnZhciBJbnZhbGlkVXJsRXJyb3IgPSBjcmVhdGVFcnJvclR5cGUoXG4gIFwiRVJSX0lOVkFMSURfVVJMXCIsXG4gIFwiSW52YWxpZCBVUkxcIixcbiAgVHlwZUVycm9yXG4pO1xuLy8gRXJyb3IgdHlwZXMgd2l0aCBjb2Rlc1xudmFyIFJlZGlyZWN0aW9uRXJyb3IgPSBjcmVhdGVFcnJvclR5cGUoXG4gIFwiRVJSX0ZSX1JFRElSRUNUSU9OX0ZBSUxVUkVcIixcbiAgXCJSZWRpcmVjdGVkIHJlcXVlc3QgZmFpbGVkXCJcbik7XG52YXIgVG9vTWFueVJlZGlyZWN0c0Vycm9yID0gY3JlYXRlRXJyb3JUeXBlKFxuICBcIkVSUl9GUl9UT09fTUFOWV9SRURJUkVDVFNcIixcbiAgXCJNYXhpbXVtIG51bWJlciBvZiByZWRpcmVjdHMgZXhjZWVkZWRcIlxuKTtcbnZhciBNYXhCb2R5TGVuZ3RoRXhjZWVkZWRFcnJvciA9IGNyZWF0ZUVycm9yVHlwZShcbiAgXCJFUlJfRlJfTUFYX0JPRFlfTEVOR1RIX0VYQ0VFREVEXCIsXG4gIFwiUmVxdWVzdCBib2R5IGxhcmdlciB0aGFuIG1heEJvZHlMZW5ndGggbGltaXRcIlxuKTtcbnZhciBXcml0ZUFmdGVyRW5kRXJyb3IgPSBjcmVhdGVFcnJvclR5cGUoXG4gIFwiRVJSX1NUUkVBTV9XUklURV9BRlRFUl9FTkRcIixcbiAgXCJ3cml0ZSBhZnRlciBlbmRcIlxuKTtcblxuLy8gQW4gSFRUUChTKSByZXF1ZXN0IHRoYXQgY2FuIGJlIHJlZGlyZWN0ZWRcbmZ1bmN0aW9uIFJlZGlyZWN0YWJsZVJlcXVlc3Qob3B0aW9ucywgcmVzcG9uc2VDYWxsYmFjaykge1xuICAvLyBJbml0aWFsaXplIHRoZSByZXF1ZXN0XG4gIFdyaXRhYmxlLmNhbGwodGhpcyk7XG4gIHRoaXMuX3Nhbml0aXplT3B0aW9ucyhvcHRpb25zKTtcbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2VuZGVkID0gZmFsc2U7XG4gIHRoaXMuX2VuZGluZyA9IGZhbHNlO1xuICB0aGlzLl9yZWRpcmVjdENvdW50ID0gMDtcbiAgdGhpcy5fcmVkaXJlY3RzID0gW107XG4gIHRoaXMuX3JlcXVlc3RCb2R5TGVuZ3RoID0gMDtcbiAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzID0gW107XG5cbiAgLy8gQXR0YWNoIGEgY2FsbGJhY2sgaWYgcGFzc2VkXG4gIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihcInJlc3BvbnNlXCIsIHJlc3BvbnNlQ2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVhY3QgdG8gcmVzcG9uc2VzIG9mIG5hdGl2ZSByZXF1ZXN0c1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX29uTmF0aXZlUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBzZWxmLl9wcm9jZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gdGhlIGZpcnN0IHJlcXVlc3RcbiAgdGhpcy5fcGVyZm9ybVJlcXVlc3QoKTtcbn1cblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZS5wcm90b3R5cGUpO1xuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgYWJvcnRSZXF1ZXN0KHRoaXMuX2N1cnJlbnRSZXF1ZXN0KTtcbiAgdGhpcy5lbWl0KFwiYWJvcnRcIik7XG59O1xuXG4vLyBXcml0ZXMgYnVmZmVyZWQgZGF0YSB0byB0aGUgY3VycmVudCBuYXRpdmUgcmVxdWVzdFxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIC8vIFdyaXRpbmcgaXMgbm90IGFsbG93ZWQgaWYgZW5kIGhhcyBiZWVuIGNhbGxlZFxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IFdyaXRlQWZ0ZXJFbmRFcnJvcigpO1xuICB9XG5cbiAgLy8gVmFsaWRhdGUgaW5wdXQgYW5kIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbmVjZXNzYXJ5XG4gIGlmICghaXNTdHJpbmcoZGF0YSkgJiYgIWlzQnVmZmVyKGRhdGEpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImRhdGEgc2hvdWxkIGJlIGEgc3RyaW5nLCBCdWZmZXIgb3IgVWludDhBcnJheVwiKTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbihlbmNvZGluZykpIHtcbiAgICBjYWxsYmFjayA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIC8vIElnbm9yZSBlbXB0eSBidWZmZXJzLCBzaW5jZSB3cml0aW5nIHRoZW0gZG9lc24ndCBpbnZva2UgdGhlIGNhbGxiYWNrXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvMjIwNjZcbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgLy8gT25seSB3cml0ZSB3aGVuIHdlIGRvbid0IGV4Y2VlZCB0aGUgbWF4aW11bSBib2R5IGxlbmd0aFxuICBpZiAodGhpcy5fcmVxdWVzdEJvZHlMZW5ndGggKyBkYXRhLmxlbmd0aCA8PSB0aGlzLl9vcHRpb25zLm1heEJvZHlMZW5ndGgpIHtcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUxlbmd0aCArPSBkYXRhLmxlbmd0aDtcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnMucHVzaCh7IGRhdGE6IGRhdGEsIGVuY29kaW5nOiBlbmNvZGluZyB9KTtcbiAgICB0aGlzLl9jdXJyZW50UmVxdWVzdC53cml0ZShkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spO1xuICB9XG4gIC8vIEVycm9yIHdoZW4gd2UgZXhjZWVkIHRoZSBtYXhpbXVtIGJvZHkgbGVuZ3RoXG4gIGVsc2Uge1xuICAgIHRoaXMuZW1pdChcImVycm9yXCIsIG5ldyBNYXhCb2R5TGVuZ3RoRXhjZWVkZWRFcnJvcigpKTtcbiAgICB0aGlzLmFib3J0KCk7XG4gIH1cbn07XG5cbi8vIEVuZHMgdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgLy8gU2hpZnQgcGFyYW1ldGVycyBpZiBuZWNlc3NhcnlcbiAgaWYgKGlzRnVuY3Rpb24oZGF0YSkpIHtcbiAgICBjYWxsYmFjayA9IGRhdGE7XG4gICAgZGF0YSA9IGVuY29kaW5nID0gbnVsbDtcbiAgfVxuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVuY29kaW5nKSkge1xuICAgIGNhbGxiYWNrID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgLy8gV3JpdGUgZGF0YSBpZiBuZWVkZWQgYW5kIGVuZFxuICBpZiAoIWRhdGEpIHtcbiAgICB0aGlzLl9lbmRlZCA9IHRoaXMuX2VuZGluZyA9IHRydWU7XG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3QuZW5kKG51bGwsIG51bGwsIGNhbGxiYWNrKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGN1cnJlbnRSZXF1ZXN0ID0gdGhpcy5fY3VycmVudFJlcXVlc3Q7XG4gICAgdGhpcy53cml0ZShkYXRhLCBlbmNvZGluZywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fZW5kZWQgPSB0cnVlO1xuICAgICAgY3VycmVudFJlcXVlc3QuZW5kKG51bGwsIG51bGwsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgICB0aGlzLl9lbmRpbmcgPSB0cnVlO1xuICB9XG59O1xuXG4vLyBTZXRzIGEgaGVhZGVyIHZhbHVlIG9uIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5zZXRIZWFkZXIgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5fb3B0aW9ucy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gIHRoaXMuX2N1cnJlbnRSZXF1ZXN0LnNldEhlYWRlcihuYW1lLCB2YWx1ZSk7XG59O1xuXG4vLyBDbGVhcnMgYSBoZWFkZXIgdmFsdWUgb24gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLnJlbW92ZUhlYWRlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLl9vcHRpb25zLmhlYWRlcnNbbmFtZV07XG4gIHRoaXMuX2N1cnJlbnRSZXF1ZXN0LnJlbW92ZUhlYWRlcihuYW1lKTtcbn07XG5cbi8vIEdsb2JhbCB0aW1lb3V0IGZvciBhbGwgdW5kZXJseWluZyByZXF1ZXN0c1xuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuc2V0VGltZW91dCA9IGZ1bmN0aW9uIChtc2VjcywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIERlc3Ryb3lzIHRoZSBzb2NrZXQgb24gdGltZW91dFxuICBmdW5jdGlvbiBkZXN0cm95T25UaW1lb3V0KHNvY2tldCkge1xuICAgIHNvY2tldC5zZXRUaW1lb3V0KG1zZWNzKTtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoXCJ0aW1lb3V0XCIsIHNvY2tldC5kZXN0cm95KTtcbiAgICBzb2NrZXQuYWRkTGlzdGVuZXIoXCJ0aW1lb3V0XCIsIHNvY2tldC5kZXN0cm95KTtcbiAgfVxuXG4gIC8vIFNldHMgdXAgYSB0aW1lciB0byB0cmlnZ2VyIGEgdGltZW91dCBldmVudFxuICBmdW5jdGlvbiBzdGFydFRpbWVyKHNvY2tldCkge1xuICAgIGlmIChzZWxmLl90aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoc2VsZi5fdGltZW91dCk7XG4gICAgfVxuICAgIHNlbGYuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuZW1pdChcInRpbWVvdXRcIik7XG4gICAgICBjbGVhclRpbWVyKCk7XG4gICAgfSwgbXNlY3MpO1xuICAgIGRlc3Ryb3lPblRpbWVvdXQoc29ja2V0KTtcbiAgfVxuXG4gIC8vIFN0b3BzIGEgdGltZW91dCBmcm9tIHRyaWdnZXJpbmdcbiAgZnVuY3Rpb24gY2xlYXJUaW1lcigpIHtcbiAgICAvLyBDbGVhciB0aGUgdGltZW91dFxuICAgIGlmIChzZWxmLl90aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoc2VsZi5fdGltZW91dCk7XG4gICAgICBzZWxmLl90aW1lb3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDbGVhbiB1cCBhbGwgYXR0YWNoZWQgbGlzdGVuZXJzXG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcihcImFib3J0XCIsIGNsZWFyVGltZXIpO1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBjbGVhclRpbWVyKTtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKFwicmVzcG9uc2VcIiwgY2xlYXJUaW1lcik7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKFwidGltZW91dFwiLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGlmICghc2VsZi5zb2NrZXQpIHtcbiAgICAgIHNlbGYuX2N1cnJlbnRSZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKFwic29ja2V0XCIsIHN0YXJ0VGltZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEF0dGFjaCBjYWxsYmFjayBpZiBwYXNzZWRcbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihcInRpbWVvdXRcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gU3RhcnQgdGhlIHRpbWVyIGlmIG9yIHdoZW4gdGhlIHNvY2tldCBpcyBvcGVuZWRcbiAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgc3RhcnRUaW1lcih0aGlzLnNvY2tldCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3Qub25jZShcInNvY2tldFwiLCBzdGFydFRpbWVyKTtcbiAgfVxuXG4gIC8vIENsZWFuIHVwIG9uIGV2ZW50c1xuICB0aGlzLm9uKFwic29ja2V0XCIsIGRlc3Ryb3lPblRpbWVvdXQpO1xuICB0aGlzLm9uKFwiYWJvcnRcIiwgY2xlYXJUaW1lcik7XG4gIHRoaXMub24oXCJlcnJvclwiLCBjbGVhclRpbWVyKTtcbiAgdGhpcy5vbihcInJlc3BvbnNlXCIsIGNsZWFyVGltZXIpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gUHJveHkgYWxsIG90aGVyIHB1YmxpYyBDbGllbnRSZXF1ZXN0IG1ldGhvZHNcbltcbiAgXCJmbHVzaEhlYWRlcnNcIiwgXCJnZXRIZWFkZXJcIixcbiAgXCJzZXROb0RlbGF5XCIsIFwic2V0U29ja2V0S2VlcEFsaXZlXCIsXG5dLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICBSZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJlcXVlc3RbbWV0aG9kXShhLCBiKTtcbiAgfTtcbn0pO1xuXG4vLyBQcm94eSBhbGwgcHVibGljIENsaWVudFJlcXVlc3QgcHJvcGVydGllc1xuW1wiYWJvcnRlZFwiLCBcImNvbm5lY3Rpb25cIiwgXCJzb2NrZXRcIl0uZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fY3VycmVudFJlcXVlc3RbcHJvcGVydHldOyB9LFxuICB9KTtcbn0pO1xuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5fc2FuaXRpemVPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgLy8gRW5zdXJlIGhlYWRlcnMgYXJlIGFsd2F5cyBwcmVzZW50XG4gIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgb3B0aW9ucy5oZWFkZXJzID0ge307XG4gIH1cblxuICAvLyBTaW5jZSBodHRwLnJlcXVlc3QgdHJlYXRzIGhvc3QgYXMgYW4gYWxpYXMgb2YgaG9zdG5hbWUsXG4gIC8vIGJ1dCB0aGUgdXJsIG1vZHVsZSBpbnRlcnByZXRzIGhvc3QgYXMgaG9zdG5hbWUgcGx1cyBwb3J0LFxuICAvLyBlbGltaW5hdGUgdGhlIGhvc3QgcHJvcGVydHkgdG8gYXZvaWQgY29uZnVzaW9uLlxuICBpZiAob3B0aW9ucy5ob3N0KSB7XG4gICAgLy8gVXNlIGhvc3RuYW1lIGlmIHNldCwgYmVjYXVzZSBpdCBoYXMgcHJlY2VkZW5jZVxuICAgIGlmICghb3B0aW9ucy5ob3N0bmFtZSkge1xuICAgICAgb3B0aW9ucy5ob3N0bmFtZSA9IG9wdGlvbnMuaG9zdDtcbiAgICB9XG4gICAgZGVsZXRlIG9wdGlvbnMuaG9zdDtcbiAgfVxuXG4gIC8vIENvbXBsZXRlIHRoZSBVUkwgb2JqZWN0IHdoZW4gbmVjZXNzYXJ5XG4gIGlmICghb3B0aW9ucy5wYXRobmFtZSAmJiBvcHRpb25zLnBhdGgpIHtcbiAgICB2YXIgc2VhcmNoUG9zID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoXCI/XCIpO1xuICAgIGlmIChzZWFyY2hQb3MgPCAwKSB7XG4gICAgICBvcHRpb25zLnBhdGhuYW1lID0gb3B0aW9ucy5wYXRoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aG5hbWUgPSBvcHRpb25zLnBhdGguc3Vic3RyaW5nKDAsIHNlYXJjaFBvcyk7XG4gICAgICBvcHRpb25zLnNlYXJjaCA9IG9wdGlvbnMucGF0aC5zdWJzdHJpbmcoc2VhcmNoUG9zKTtcbiAgICB9XG4gIH1cbn07XG5cblxuLy8gRXhlY3V0ZXMgdGhlIG5leHQgbmF0aXZlIHJlcXVlc3QgKGluaXRpYWwgb3IgcmVkaXJlY3QpXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5fcGVyZm9ybVJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIExvYWQgdGhlIG5hdGl2ZSBwcm90b2NvbFxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLl9vcHRpb25zLnByb3RvY29sO1xuICB2YXIgbmF0aXZlUHJvdG9jb2wgPSB0aGlzLl9vcHRpb25zLm5hdGl2ZVByb3RvY29sc1twcm90b2NvbF07XG4gIGlmICghbmF0aXZlUHJvdG9jb2wpIHtcbiAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgVHlwZUVycm9yKFwiVW5zdXBwb3J0ZWQgcHJvdG9jb2wgXCIgKyBwcm90b2NvbCkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIElmIHNwZWNpZmllZCwgdXNlIHRoZSBhZ2VudCBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm90b2NvbFxuICAvLyAoSFRUUCBhbmQgSFRUUFMgdXNlIGRpZmZlcmVudCB0eXBlcyBvZiBhZ2VudHMpXG4gIGlmICh0aGlzLl9vcHRpb25zLmFnZW50cykge1xuICAgIHZhciBzY2hlbWUgPSBwcm90b2NvbC5zbGljZSgwLCAtMSk7XG4gICAgdGhpcy5fb3B0aW9ucy5hZ2VudCA9IHRoaXMuX29wdGlvbnMuYWdlbnRzW3NjaGVtZV07XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIG5hdGl2ZSByZXF1ZXN0IGFuZCBzZXQgdXAgaXRzIGV2ZW50IGhhbmRsZXJzXG4gIHZhciByZXF1ZXN0ID0gdGhpcy5fY3VycmVudFJlcXVlc3QgPVxuICAgICAgICBuYXRpdmVQcm90b2NvbC5yZXF1ZXN0KHRoaXMuX29wdGlvbnMsIHRoaXMuX29uTmF0aXZlUmVzcG9uc2UpO1xuICByZXF1ZXN0Ll9yZWRpcmVjdGFibGUgPSB0aGlzO1xuICBmb3IgKHZhciBldmVudCBvZiBldmVudHMpIHtcbiAgICByZXF1ZXN0Lm9uKGV2ZW50LCBldmVudEhhbmRsZXJzW2V2ZW50XSk7XG4gIH1cblxuICAvLyBSRkM3MjMwwqc1LjMuMTogV2hlbiBtYWtpbmcgYSByZXF1ZXN0IGRpcmVjdGx5IHRvIGFuIG9yaWdpbiBzZXJ2ZXIsIFvigKZdXG4gIC8vIGEgY2xpZW50IE1VU1Qgc2VuZCBvbmx5IHRoZSBhYnNvbHV0ZSBwYXRoIFvigKZdIGFzIHRoZSByZXF1ZXN0LXRhcmdldC5cbiAgdGhpcy5fY3VycmVudFVybCA9IC9eXFwvLy50ZXN0KHRoaXMuX29wdGlvbnMucGF0aCkgP1xuICAgIHVybC5mb3JtYXQodGhpcy5fb3B0aW9ucykgOlxuICAgIC8vIFdoZW4gbWFraW5nIGEgcmVxdWVzdCB0byBhIHByb3h5LCBb4oCmXVxuICAgIC8vIGEgY2xpZW50IE1VU1Qgc2VuZCB0aGUgdGFyZ2V0IFVSSSBpbiBhYnNvbHV0ZS1mb3JtIFvigKZdLlxuICAgIHRoaXMuX29wdGlvbnMucGF0aDtcblxuICAvLyBFbmQgYSByZWRpcmVjdGVkIHJlcXVlc3RcbiAgLy8gKFRoZSBmaXJzdCByZXF1ZXN0IG11c3QgYmUgZW5kZWQgZXhwbGljaXRseSB3aXRoIFJlZGlyZWN0YWJsZVJlcXVlc3QjZW5kKVxuICBpZiAodGhpcy5faXNSZWRpcmVjdCkge1xuICAgIC8vIFdyaXRlIHRoZSByZXF1ZXN0IGVudGl0eSBhbmQgZW5kXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVycyA9IHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycztcbiAgICAoZnVuY3Rpb24gd3JpdGVOZXh0KGVycm9yKSB7XG4gICAgICAvLyBPbmx5IHdyaXRlIGlmIHRoaXMgcmVxdWVzdCBoYXMgbm90IGJlZW4gcmVkaXJlY3RlZCB5ZXRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocmVxdWVzdCA9PT0gc2VsZi5fY3VycmVudFJlcXVlc3QpIHtcbiAgICAgICAgLy8gUmVwb3J0IGFueSB3cml0ZSBlcnJvcnNcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHNlbGYuZW1pdChcImVycm9yXCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXcml0ZSB0aGUgbmV4dCBidWZmZXIgaWYgdGhlcmUgYXJlIHN0aWxsIGxlZnRcbiAgICAgICAgZWxzZSBpZiAoaSA8IGJ1ZmZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IGJ1ZmZlcnNbaSsrXTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmICghcmVxdWVzdC5maW5pc2hlZCkge1xuICAgICAgICAgICAgcmVxdWVzdC53cml0ZShidWZmZXIuZGF0YSwgYnVmZmVyLmVuY29kaW5nLCB3cml0ZU5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbmQgdGhlIHJlcXVlc3QgaWYgYGVuZGAgaGFzIGJlZW4gY2FsbGVkIG9uIHVzXG4gICAgICAgIGVsc2UgaWYgKHNlbGYuX2VuZGVkKSB7XG4gICAgICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0oKSk7XG4gIH1cbn07XG5cbi8vIFByb2Nlc3NlcyBhIHJlc3BvbnNlIGZyb20gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLl9wcm9jZXNzUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgLy8gU3RvcmUgdGhlIHJlZGlyZWN0ZWQgcmVzcG9uc2VcbiAgdmFyIHN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlO1xuICBpZiAodGhpcy5fb3B0aW9ucy50cmFja1JlZGlyZWN0cykge1xuICAgIHRoaXMuX3JlZGlyZWN0cy5wdXNoKHtcbiAgICAgIHVybDogdGhpcy5fY3VycmVudFVybCxcbiAgICAgIGhlYWRlcnM6IHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNDb2RlLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gUkZDNzIzMcKnNi40OiBUaGUgM3h4IChSZWRpcmVjdGlvbikgY2xhc3Mgb2Ygc3RhdHVzIGNvZGUgaW5kaWNhdGVzXG4gIC8vIHRoYXQgZnVydGhlciBhY3Rpb24gbmVlZHMgdG8gYmUgdGFrZW4gYnkgdGhlIHVzZXIgYWdlbnQgaW4gb3JkZXIgdG9cbiAgLy8gZnVsZmlsbCB0aGUgcmVxdWVzdC4gSWYgYSBMb2NhdGlvbiBoZWFkZXIgZmllbGQgaXMgcHJvdmlkZWQsXG4gIC8vIHRoZSB1c2VyIGFnZW50IE1BWSBhdXRvbWF0aWNhbGx5IHJlZGlyZWN0IGl0cyByZXF1ZXN0IHRvIHRoZSBVUklcbiAgLy8gcmVmZXJlbmNlZCBieSB0aGUgTG9jYXRpb24gZmllbGQgdmFsdWUsXG4gIC8vIGV2ZW4gaWYgdGhlIHNwZWNpZmljIHN0YXR1cyBjb2RlIGlzIG5vdCB1bmRlcnN0b29kLlxuXG4gIC8vIElmIHRoZSByZXNwb25zZSBpcyBub3QgYSByZWRpcmVjdDsgcmV0dXJuIGl0IGFzLWlzXG4gIHZhciBsb2NhdGlvbiA9IHJlc3BvbnNlLmhlYWRlcnMubG9jYXRpb247XG4gIGlmICghbG9jYXRpb24gfHwgdGhpcy5fb3B0aW9ucy5mb2xsb3dSZWRpcmVjdHMgPT09IGZhbHNlIHx8XG4gICAgICBzdGF0dXNDb2RlIDwgMzAwIHx8IHN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgcmVzcG9uc2UucmVzcG9uc2VVcmwgPSB0aGlzLl9jdXJyZW50VXJsO1xuICAgIHJlc3BvbnNlLnJlZGlyZWN0cyA9IHRoaXMuX3JlZGlyZWN0cztcbiAgICB0aGlzLmVtaXQoXCJyZXNwb25zZVwiLCByZXNwb25zZSk7XG5cbiAgICAvLyBDbGVhbiB1cFxuICAgIHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycyA9IFtdO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFRoZSByZXNwb25zZSBpcyBhIHJlZGlyZWN0LCBzbyBhYm9ydCB0aGUgY3VycmVudCByZXF1ZXN0XG4gIGFib3J0UmVxdWVzdCh0aGlzLl9jdXJyZW50UmVxdWVzdCk7XG4gIC8vIERpc2NhcmQgdGhlIHJlbWFpbmRlciBvZiB0aGUgcmVzcG9uc2UgdG8gYXZvaWQgd2FpdGluZyBmb3IgZGF0YVxuICByZXNwb25zZS5kZXN0cm95KCk7XG5cbiAgLy8gUkZDNzIzMcKnNi40OiBBIGNsaWVudCBTSE9VTEQgZGV0ZWN0IGFuZCBpbnRlcnZlbmVcbiAgLy8gaW4gY3ljbGljYWwgcmVkaXJlY3Rpb25zIChpLmUuLCBcImluZmluaXRlXCIgcmVkaXJlY3Rpb24gbG9vcHMpLlxuICBpZiAoKyt0aGlzLl9yZWRpcmVjdENvdW50ID4gdGhpcy5fb3B0aW9ucy5tYXhSZWRpcmVjdHMpIHtcbiAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgVG9vTWFueVJlZGlyZWN0c0Vycm9yKCkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN0b3JlIHRoZSByZXF1ZXN0IGhlYWRlcnMgaWYgYXBwbGljYWJsZVxuICB2YXIgcmVxdWVzdEhlYWRlcnM7XG4gIHZhciBiZWZvcmVSZWRpcmVjdCA9IHRoaXMuX29wdGlvbnMuYmVmb3JlUmVkaXJlY3Q7XG4gIGlmIChiZWZvcmVSZWRpcmVjdCkge1xuICAgIHJlcXVlc3RIZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAvLyBUaGUgSG9zdCBoZWFkZXIgd2FzIHNldCBieSBuYXRpdmVQcm90b2NvbC5yZXF1ZXN0XG4gICAgICBIb3N0OiByZXNwb25zZS5yZXEuZ2V0SGVhZGVyKFwiaG9zdFwiKSxcbiAgICB9LCB0aGlzLl9vcHRpb25zLmhlYWRlcnMpO1xuICB9XG5cbiAgLy8gUkZDNzIzMcKnNi40OiBBdXRvbWF0aWMgcmVkaXJlY3Rpb24gbmVlZHMgdG8gZG9uZSB3aXRoXG4gIC8vIGNhcmUgZm9yIG1ldGhvZHMgbm90IGtub3duIHRvIGJlIHNhZmUsIFvigKZdXG4gIC8vIFJGQzcyMzHCpzYuNC4y4oCTMzogRm9yIGhpc3RvcmljYWwgcmVhc29ucywgYSB1c2VyIGFnZW50IE1BWSBjaGFuZ2VcbiAgLy8gdGhlIHJlcXVlc3QgbWV0aG9kIGZyb20gUE9TVCB0byBHRVQgZm9yIHRoZSBzdWJzZXF1ZW50IHJlcXVlc3QuXG4gIHZhciBtZXRob2QgPSB0aGlzLl9vcHRpb25zLm1ldGhvZDtcbiAgaWYgKChzdGF0dXNDb2RlID09PSAzMDEgfHwgc3RhdHVzQ29kZSA9PT0gMzAyKSAmJiB0aGlzLl9vcHRpb25zLm1ldGhvZCA9PT0gXCJQT1NUXCIgfHxcbiAgICAgIC8vIFJGQzcyMzHCpzYuNC40OiBUaGUgMzAzIChTZWUgT3RoZXIpIHN0YXR1cyBjb2RlIGluZGljYXRlcyB0aGF0XG4gICAgICAvLyB0aGUgc2VydmVyIGlzIHJlZGlyZWN0aW5nIHRoZSB1c2VyIGFnZW50IHRvIGEgZGlmZmVyZW50IHJlc291cmNlIFvigKZdXG4gICAgICAvLyBBIHVzZXIgYWdlbnQgY2FuIHBlcmZvcm0gYSByZXRyaWV2YWwgcmVxdWVzdCB0YXJnZXRpbmcgdGhhdCBVUklcbiAgICAgIC8vIChhIEdFVCBvciBIRUFEIHJlcXVlc3QgaWYgdXNpbmcgSFRUUCkgW+KApl1cbiAgICAgIChzdGF0dXNDb2RlID09PSAzMDMpICYmICEvXig/OkdFVHxIRUFEKSQvLnRlc3QodGhpcy5fb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5tZXRob2QgPSBcIkdFVFwiO1xuICAgIC8vIERyb3AgYSBwb3NzaWJsZSBlbnRpdHkgYW5kIGhlYWRlcnMgcmVsYXRlZCB0byBpdFxuICAgIHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycyA9IFtdO1xuICAgIHJlbW92ZU1hdGNoaW5nSGVhZGVycygvXmNvbnRlbnQtL2ksIHRoaXMuX29wdGlvbnMuaGVhZGVycyk7XG4gIH1cblxuICAvLyBEcm9wIHRoZSBIb3N0IGhlYWRlciwgYXMgdGhlIHJlZGlyZWN0IG1pZ2h0IGxlYWQgdG8gYSBkaWZmZXJlbnQgaG9zdFxuICB2YXIgY3VycmVudEhvc3RIZWFkZXIgPSByZW1vdmVNYXRjaGluZ0hlYWRlcnMoL15ob3N0JC9pLCB0aGlzLl9vcHRpb25zLmhlYWRlcnMpO1xuXG4gIC8vIElmIHRoZSByZWRpcmVjdCBpcyByZWxhdGl2ZSwgY2Fycnkgb3ZlciB0aGUgaG9zdCBvZiB0aGUgbGFzdCByZXF1ZXN0XG4gIHZhciBjdXJyZW50VXJsUGFydHMgPSB1cmwucGFyc2UodGhpcy5fY3VycmVudFVybCk7XG4gIHZhciBjdXJyZW50SG9zdCA9IGN1cnJlbnRIb3N0SGVhZGVyIHx8IGN1cnJlbnRVcmxQYXJ0cy5ob3N0O1xuICB2YXIgY3VycmVudFVybCA9IC9eXFx3KzovLnRlc3QobG9jYXRpb24pID8gdGhpcy5fY3VycmVudFVybCA6XG4gICAgdXJsLmZvcm1hdChPYmplY3QuYXNzaWduKGN1cnJlbnRVcmxQYXJ0cywgeyBob3N0OiBjdXJyZW50SG9zdCB9KSk7XG5cbiAgLy8gRGV0ZXJtaW5lIHRoZSBVUkwgb2YgdGhlIHJlZGlyZWN0aW9uXG4gIHZhciByZWRpcmVjdFVybDtcbiAgdHJ5IHtcbiAgICByZWRpcmVjdFVybCA9IHVybC5yZXNvbHZlKGN1cnJlbnRVcmwsIGxvY2F0aW9uKTtcbiAgfVxuICBjYXRjaCAoY2F1c2UpIHtcbiAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgUmVkaXJlY3Rpb25FcnJvcih7IGNhdXNlOiBjYXVzZSB9KSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSByZWRpcmVjdGVkIHJlcXVlc3RcbiAgZGVidWcoXCJyZWRpcmVjdGluZyB0b1wiLCByZWRpcmVjdFVybCk7XG4gIHRoaXMuX2lzUmVkaXJlY3QgPSB0cnVlO1xuICB2YXIgcmVkaXJlY3RVcmxQYXJ0cyA9IHVybC5wYXJzZShyZWRpcmVjdFVybCk7XG4gIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgcmVkaXJlY3RVcmxQYXJ0cyk7XG5cbiAgLy8gRHJvcCBjb25maWRlbnRpYWwgaGVhZGVycyB3aGVuIHJlZGlyZWN0aW5nIHRvIGEgbGVzcyBzZWN1cmUgcHJvdG9jb2xcbiAgLy8gb3IgdG8gYSBkaWZmZXJlbnQgZG9tYWluIHRoYXQgaXMgbm90IGEgc3VwZXJkb21haW5cbiAgaWYgKHJlZGlyZWN0VXJsUGFydHMucHJvdG9jb2wgIT09IGN1cnJlbnRVcmxQYXJ0cy5wcm90b2NvbCAmJlxuICAgICByZWRpcmVjdFVybFBhcnRzLnByb3RvY29sICE9PSBcImh0dHBzOlwiIHx8XG4gICAgIHJlZGlyZWN0VXJsUGFydHMuaG9zdCAhPT0gY3VycmVudEhvc3QgJiZcbiAgICAgIWlzU3ViZG9tYWluKHJlZGlyZWN0VXJsUGFydHMuaG9zdCwgY3VycmVudEhvc3QpKSB7XG4gICAgcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eKD86YXV0aG9yaXphdGlvbnxjb29raWUpJC9pLCB0aGlzLl9vcHRpb25zLmhlYWRlcnMpO1xuICB9XG5cbiAgLy8gRXZhbHVhdGUgdGhlIGJlZm9yZVJlZGlyZWN0IGNhbGxiYWNrXG4gIGlmIChpc0Z1bmN0aW9uKGJlZm9yZVJlZGlyZWN0KSkge1xuICAgIHZhciByZXNwb25zZURldGFpbHMgPSB7XG4gICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzQ29kZSxcbiAgICB9O1xuICAgIHZhciByZXF1ZXN0RGV0YWlscyA9IHtcbiAgICAgIHVybDogY3VycmVudFVybCxcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgaGVhZGVyczogcmVxdWVzdEhlYWRlcnMsXG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgYmVmb3JlUmVkaXJlY3QodGhpcy5fb3B0aW9ucywgcmVzcG9uc2VEZXRhaWxzLCByZXF1ZXN0RGV0YWlscyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3Nhbml0aXplT3B0aW9ucyh0aGlzLl9vcHRpb25zKTtcbiAgfVxuXG4gIC8vIFBlcmZvcm0gdGhlIHJlZGlyZWN0ZWQgcmVxdWVzdFxuICB0cnkge1xuICAgIHRoaXMuX3BlcmZvcm1SZXF1ZXN0KCk7XG4gIH1cbiAgY2F0Y2ggKGNhdXNlKSB7XG4gICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IFJlZGlyZWN0aW9uRXJyb3IoeyBjYXVzZTogY2F1c2UgfSkpO1xuICB9XG59O1xuXG4vLyBXcmFwcyB0aGUga2V5L3ZhbHVlIG9iamVjdCBvZiBwcm90b2NvbHMgd2l0aCByZWRpcmVjdCBmdW5jdGlvbmFsaXR5XG5mdW5jdGlvbiB3cmFwKHByb3RvY29scykge1xuICAvLyBEZWZhdWx0IHNldHRpbmdzXG4gIHZhciBleHBvcnRzID0ge1xuICAgIG1heFJlZGlyZWN0czogMjEsXG4gICAgbWF4Qm9keUxlbmd0aDogMTAgKiAxMDI0ICogMTAyNCxcbiAgfTtcblxuICAvLyBXcmFwIGVhY2ggcHJvdG9jb2xcbiAgdmFyIG5hdGl2ZVByb3RvY29scyA9IHt9O1xuICBPYmplY3Qua2V5cyhwcm90b2NvbHMpLmZvckVhY2goZnVuY3Rpb24gKHNjaGVtZSkge1xuICAgIHZhciBwcm90b2NvbCA9IHNjaGVtZSArIFwiOlwiO1xuICAgIHZhciBuYXRpdmVQcm90b2NvbCA9IG5hdGl2ZVByb3RvY29sc1twcm90b2NvbF0gPSBwcm90b2NvbHNbc2NoZW1lXTtcbiAgICB2YXIgd3JhcHBlZFByb3RvY29sID0gZXhwb3J0c1tzY2hlbWVdID0gT2JqZWN0LmNyZWF0ZShuYXRpdmVQcm90b2NvbCk7XG5cbiAgICAvLyBFeGVjdXRlcyBhIHJlcXVlc3QsIGZvbGxvd2luZyByZWRpcmVjdHNcbiAgICBmdW5jdGlvbiByZXF1ZXN0KGlucHV0LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgLy8gUGFyc2UgcGFyYW1ldGVyc1xuICAgICAgaWYgKGlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICB2YXIgcGFyc2VkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHBhcnNlZCA9IHVybFRvT3B0aW9ucyhuZXcgVVJMKGlucHV0KSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgcGFyc2VkID0gdXJsLnBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzU3RyaW5nKHBhcnNlZC5wcm90b2NvbCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFVybEVycm9yKHsgaW5wdXQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQgPSBwYXJzZWQ7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChVUkwgJiYgKGlucHV0IGluc3RhbmNlb2YgVVJMKSkge1xuICAgICAgICBpbnB1dCA9IHVybFRvT3B0aW9ucyhpbnB1dCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgICBvcHRpb25zID0gaW5wdXQ7XG4gICAgICAgIGlucHV0ID0geyBwcm90b2NvbDogcHJvdG9jb2wgfTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCBkZWZhdWx0c1xuICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICBtYXhSZWRpcmVjdHM6IGV4cG9ydHMubWF4UmVkaXJlY3RzLFxuICAgICAgICBtYXhCb2R5TGVuZ3RoOiBleHBvcnRzLm1heEJvZHlMZW5ndGgsXG4gICAgICB9LCBpbnB1dCwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLm5hdGl2ZVByb3RvY29scyA9IG5hdGl2ZVByb3RvY29scztcbiAgICAgIGlmICghaXNTdHJpbmcob3B0aW9ucy5ob3N0KSAmJiAhaXNTdHJpbmcob3B0aW9ucy5ob3N0bmFtZSkpIHtcbiAgICAgICAgb3B0aW9ucy5ob3N0bmFtZSA9IFwiOjoxXCI7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydC5lcXVhbChvcHRpb25zLnByb3RvY29sLCBwcm90b2NvbCwgXCJwcm90b2NvbCBtaXNtYXRjaFwiKTtcbiAgICAgIGRlYnVnKFwib3B0aW9uc1wiLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBuZXcgUmVkaXJlY3RhYmxlUmVxdWVzdChvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0ZXMgYSBHRVQgcmVxdWVzdCwgZm9sbG93aW5nIHJlZGlyZWN0c1xuICAgIGZ1bmN0aW9uIGdldChpbnB1dCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIHZhciB3cmFwcGVkUmVxdWVzdCA9IHdyYXBwZWRQcm90b2NvbC5yZXF1ZXN0KGlucHV0LCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICB3cmFwcGVkUmVxdWVzdC5lbmQoKTtcbiAgICAgIHJldHVybiB3cmFwcGVkUmVxdWVzdDtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgb24gdGhlIHdyYXBwZWQgcHJvdG9jb2xcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh3cmFwcGVkUHJvdG9jb2wsIHtcbiAgICAgIHJlcXVlc3Q6IHsgdmFsdWU6IHJlcXVlc3QsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSxcbiAgICAgIGdldDogeyB2YWx1ZTogZ2V0LCBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0sXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZXhwb3J0cztcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIG5vb3AoKSB7IC8qIGVtcHR5ICovIH1cblxuLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvbGliL2ludGVybmFsL3VybC5qc1xuZnVuY3Rpb24gdXJsVG9PcHRpb25zKHVybE9iamVjdCkge1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBwcm90b2NvbDogdXJsT2JqZWN0LnByb3RvY29sLFxuICAgIGhvc3RuYW1lOiB1cmxPYmplY3QuaG9zdG5hbWUuc3RhcnRzV2l0aChcIltcIikgP1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHVybE9iamVjdC5ob3N0bmFtZS5zbGljZSgxLCAtMSkgOlxuICAgICAgdXJsT2JqZWN0Lmhvc3RuYW1lLFxuICAgIGhhc2g6IHVybE9iamVjdC5oYXNoLFxuICAgIHNlYXJjaDogdXJsT2JqZWN0LnNlYXJjaCxcbiAgICBwYXRobmFtZTogdXJsT2JqZWN0LnBhdGhuYW1lLFxuICAgIHBhdGg6IHVybE9iamVjdC5wYXRobmFtZSArIHVybE9iamVjdC5zZWFyY2gsXG4gICAgaHJlZjogdXJsT2JqZWN0LmhyZWYsXG4gIH07XG4gIGlmICh1cmxPYmplY3QucG9ydCAhPT0gXCJcIikge1xuICAgIG9wdGlvbnMucG9ydCA9IE51bWJlcih1cmxPYmplY3QucG9ydCk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1hdGNoaW5nSGVhZGVycyhyZWdleCwgaGVhZGVycykge1xuICB2YXIgbGFzdFZhbHVlO1xuICBmb3IgKHZhciBoZWFkZXIgaW4gaGVhZGVycykge1xuICAgIGlmIChyZWdleC50ZXN0KGhlYWRlcikpIHtcbiAgICAgIGxhc3RWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyXTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl07XG4gICAgfVxuICB9XG4gIHJldHVybiAobGFzdFZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBsYXN0VmFsdWUgPT09IFwidW5kZWZpbmVkXCIpID9cbiAgICB1bmRlZmluZWQgOiBTdHJpbmcobGFzdFZhbHVlKS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yVHlwZShjb2RlLCBtZXNzYWdlLCBiYXNlQ2xhc3MpIHtcbiAgLy8gQ3JlYXRlIGNvbnN0cnVjdG9yXG4gIGZ1bmN0aW9uIEN1c3RvbUVycm9yKHByb3BlcnRpZXMpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHByb3BlcnRpZXMgfHwge30pO1xuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgdGhpcy5tZXNzYWdlID0gdGhpcy5jYXVzZSA/IG1lc3NhZ2UgKyBcIjogXCIgKyB0aGlzLmNhdXNlLm1lc3NhZ2UgOiBtZXNzYWdlO1xuICB9XG5cbiAgLy8gQXR0YWNoIGNvbnN0cnVjdG9yIGFuZCBzZXQgZGVmYXVsdCBwcm9wZXJ0aWVzXG4gIEN1c3RvbUVycm9yLnByb3RvdHlwZSA9IG5ldyAoYmFzZUNsYXNzIHx8IEVycm9yKSgpO1xuICBDdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcbiAgQ3VzdG9tRXJyb3IucHJvdG90eXBlLm5hbWUgPSBcIkVycm9yIFtcIiArIGNvZGUgKyBcIl1cIjtcbiAgcmV0dXJuIEN1c3RvbUVycm9yO1xufVxuXG5mdW5jdGlvbiBhYm9ydFJlcXVlc3QocmVxdWVzdCkge1xuICBmb3IgKHZhciBldmVudCBvZiBldmVudHMpIHtcbiAgICByZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXJzW2V2ZW50XSk7XG4gIH1cbiAgcmVxdWVzdC5vbihcImVycm9yXCIsIG5vb3ApO1xuICByZXF1ZXN0LmFib3J0KCk7XG59XG5cbmZ1bmN0aW9uIGlzU3ViZG9tYWluKHN1YmRvbWFpbiwgZG9tYWluKSB7XG4gIGFzc2VydChpc1N0cmluZyhzdWJkb21haW4pICYmIGlzU3RyaW5nKGRvbWFpbikpO1xuICB2YXIgZG90ID0gc3ViZG9tYWluLmxlbmd0aCAtIGRvbWFpbi5sZW5ndGggLSAxO1xuICByZXR1cm4gZG90ID4gMCAmJiBzdWJkb21haW5bZG90XSA9PT0gXCIuXCIgJiYgc3ViZG9tYWluLmVuZHNXaXRoKGRvbWFpbik7XG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIChcImxlbmd0aFwiIGluIHZhbHVlKTtcbn1cblxuLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB3cmFwKHsgaHR0cDogaHR0cCwgaHR0cHM6IGh0dHBzIH0pO1xubW9kdWxlLmV4cG9ydHMud3JhcCA9IHdyYXA7XG4iLCJleHBvcnQgY29uc3QgVkVSU0lPTiA9IFwiMS40LjBcIjsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlUHJvdG9jb2wodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gL14oWy0rXFx3XXsxLDI1fSkoOj9cXC9cXC98OikvLmV4ZWModXJsKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmNvbnN0IERBVEFfVVJMX1BBVFRFUk4gPSAvXig/OihbXjtdKyk7KT8oPzpbXjtdKzspPyhiYXNlNjR8KSwoW1xcc1xcU10qKSQvO1xuXG4vKipcbiAqIFBhcnNlIGRhdGEgdXJpIHRvIGEgQnVmZmVyIG9yIEJsb2JcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJpXG4gKiBAcGFyYW0gez9Cb29sZWFufSBhc0Jsb2JcbiAqIEBwYXJhbSB7P09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHs/RnVuY3Rpb259IG9wdGlvbnMuQmxvYlxuICpcbiAqIEByZXR1cm5zIHtCdWZmZXJ8QmxvYn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZnJvbURhdGFVUkkodXJpLCBhc0Jsb2IsIG9wdGlvbnMpIHtcbiAgY29uc3QgX0Jsb2IgPSBvcHRpb25zICYmIG9wdGlvbnMuQmxvYiB8fCBwbGF0Zm9ybS5jbGFzc2VzLkJsb2I7XG4gIGNvbnN0IHByb3RvY29sID0gcGFyc2VQcm90b2NvbCh1cmkpO1xuXG4gIGlmIChhc0Jsb2IgPT09IHVuZGVmaW5lZCAmJiBfQmxvYikge1xuICAgIGFzQmxvYiA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvdG9jb2wgPT09ICdkYXRhJykge1xuICAgIHVyaSA9IHByb3RvY29sLmxlbmd0aCA/IHVyaS5zbGljZShwcm90b2NvbC5sZW5ndGggKyAxKSA6IHVyaTtcblxuICAgIGNvbnN0IG1hdGNoID0gREFUQV9VUkxfUEFUVEVSTi5leGVjKHVyaSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignSW52YWxpZCBVUkwnLCBBeGlvc0Vycm9yLkVSUl9JTlZBTElEX1VSTCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWltZSA9IG1hdGNoWzFdO1xuICAgIGNvbnN0IGlzQmFzZTY0ID0gbWF0Y2hbMl07XG4gICAgY29uc3QgYm9keSA9IG1hdGNoWzNdO1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGRlY29kZVVSSUNvbXBvbmVudChib2R5KSwgaXNCYXNlNjQgPyAnYmFzZTY0JyA6ICd1dGY4Jyk7XG5cbiAgICBpZiAoYXNCbG9iKSB7XG4gICAgICBpZiAoIV9CbG9iKSB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdCbG9iIGlzIG5vdCBzdXBwb3J0ZWQnLCBBeGlvc0Vycm9yLkVSUl9OT1RfU1VQUE9SVCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgX0Jsb2IoW2J1ZmZlcl0sIHt0eXBlOiBtaW1lfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbnN1cHBvcnRlZCBwcm90b2NvbCAnICsgcHJvdG9jb2wsIEF4aW9zRXJyb3IuRVJSX05PVF9TVVBQT1JUKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaHJvdHRsZSBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge051bWJlcn0gZnJlcVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBmcmVxKSB7XG4gIGxldCB0aW1lc3RhbXAgPSAwO1xuICBjb25zdCB0aHJlc2hvbGQgPSAxMDAwIC8gZnJlcTtcbiAgbGV0IHRpbWVyID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRocm90dGxlZChmb3JjZSwgYXJncykge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKGZvcmNlIHx8IG5vdyAtIHRpbWVzdGFtcCA+IHRocmVzaG9sZCkge1xuICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRpbWVzdGFtcCA9IG5vdztcbiAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9XG4gICAgaWYgKCF0aW1lcikge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9LCB0aHJlc2hvbGQgLSAobm93IC0gdGltZXN0YW1wKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0aHJvdHRsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGUgZGF0YSBtYXhSYXRlXG4gKiBAcGFyYW0ge051bWJlcn0gW3NhbXBsZXNDb3VudD0gMTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW21pbj0gMTAwMF1cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gc3BlZWRvbWV0ZXIoc2FtcGxlc0NvdW50LCBtaW4pIHtcbiAgc2FtcGxlc0NvdW50ID0gc2FtcGxlc0NvdW50IHx8IDEwO1xuICBjb25zdCBieXRlcyA9IG5ldyBBcnJheShzYW1wbGVzQ291bnQpO1xuICBjb25zdCB0aW1lc3RhbXBzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGxldCBoZWFkID0gMDtcbiAgbGV0IHRhaWwgPSAwO1xuICBsZXQgZmlyc3RTYW1wbGVUUztcblxuICBtaW4gPSBtaW4gIT09IHVuZGVmaW5lZCA/IG1pbiA6IDEwMDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHB1c2goY2h1bmtMZW5ndGgpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3Qgc3RhcnRlZEF0ID0gdGltZXN0YW1wc1t0YWlsXTtcblxuICAgIGlmICghZmlyc3RTYW1wbGVUUykge1xuICAgICAgZmlyc3RTYW1wbGVUUyA9IG5vdztcbiAgICB9XG5cbiAgICBieXRlc1toZWFkXSA9IGNodW5rTGVuZ3RoO1xuICAgIHRpbWVzdGFtcHNbaGVhZF0gPSBub3c7XG5cbiAgICBsZXQgaSA9IHRhaWw7XG4gICAgbGV0IGJ5dGVzQ291bnQgPSAwO1xuXG4gICAgd2hpbGUgKGkgIT09IGhlYWQpIHtcbiAgICAgIGJ5dGVzQ291bnQgKz0gYnl0ZXNbaSsrXTtcbiAgICAgIGkgPSBpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGhlYWQgPSAoaGVhZCArIDEpICUgc2FtcGxlc0NvdW50O1xuXG4gICAgaWYgKGhlYWQgPT09IHRhaWwpIHtcbiAgICAgIHRhaWwgPSAodGFpbCArIDEpICUgc2FtcGxlc0NvdW50O1xuICAgIH1cblxuICAgIGlmIChub3cgLSBmaXJzdFNhbXBsZVRTIDwgbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFzc2VkID0gc3RhcnRlZEF0ICYmIG5vdyAtIHN0YXJ0ZWRBdDtcblxuICAgIHJldHVybiBwYXNzZWQgPyBNYXRoLnJvdW5kKGJ5dGVzQ291bnQgKiAxMDAwIC8gcGFzc2VkKSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3BlZWRvbWV0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBzdHJlYW0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnLi90aHJvdHRsZS5qcyc7XG5pbXBvcnQgc3BlZWRvbWV0ZXIgZnJvbSAnLi9zcGVlZG9tZXRlci5qcyc7XG5cbmNvbnN0IGtJbnRlcm5hbHMgPSBTeW1ib2woJ2ludGVybmFscycpO1xuXG5jbGFzcyBBeGlvc1RyYW5zZm9ybVN0cmVhbSBleHRlbmRzIHN0cmVhbS5UcmFuc2Zvcm17XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdXRpbHMudG9GbGF0T2JqZWN0KG9wdGlvbnMsIHtcbiAgICAgIG1heFJhdGU6IDAsXG4gICAgICBjaHVua1NpemU6IDY0ICogMTAyNCxcbiAgICAgIG1pbkNodW5rU2l6ZTogMTAwLFxuICAgICAgdGltZVdpbmRvdzogNTAwLFxuICAgICAgdGlja3NSYXRlOiAyLFxuICAgICAgc2FtcGxlc0NvdW50OiAxNVxuICAgIH0sIG51bGwsIChwcm9wLCBzb3VyY2UpID0+IHtcbiAgICAgIHJldHVybiAhdXRpbHMuaXNVbmRlZmluZWQoc291cmNlW3Byb3BdKTtcbiAgICB9KTtcblxuICAgIHN1cGVyKHtcbiAgICAgIHJlYWRhYmxlSGlnaFdhdGVyTWFyazogb3B0aW9ucy5jaHVua1NpemVcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgaW50ZXJuYWxzID0gdGhpc1trSW50ZXJuYWxzXSA9IHtcbiAgICAgIGxlbmd0aDogb3B0aW9ucy5sZW5ndGgsXG4gICAgICB0aW1lV2luZG93OiBvcHRpb25zLnRpbWVXaW5kb3csXG4gICAgICB0aWNrc1JhdGU6IG9wdGlvbnMudGlja3NSYXRlLFxuICAgICAgY2h1bmtTaXplOiBvcHRpb25zLmNodW5rU2l6ZSxcbiAgICAgIG1heFJhdGU6IG9wdGlvbnMubWF4UmF0ZSxcbiAgICAgIG1pbkNodW5rU2l6ZTogb3B0aW9ucy5taW5DaHVua1NpemUsXG4gICAgICBieXRlc1NlZW46IDAsXG4gICAgICBpc0NhcHR1cmVkOiBmYWxzZSxcbiAgICAgIG5vdGlmaWVkQnl0ZXNMb2FkZWQ6IDAsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgIGJ5dGVzOiAwLFxuICAgICAgb25SZWFkQ2FsbGJhY2s6IG51bGxcbiAgICB9O1xuXG4gICAgY29uc3QgX3NwZWVkb21ldGVyID0gc3BlZWRvbWV0ZXIoaW50ZXJuYWxzLnRpY2tzUmF0ZSAqIG9wdGlvbnMuc2FtcGxlc0NvdW50LCBpbnRlcm5hbHMudGltZVdpbmRvdyk7XG5cbiAgICB0aGlzLm9uKCduZXdMaXN0ZW5lcicsIGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudCA9PT0gJ3Byb2dyZXNzJykge1xuICAgICAgICBpZiAoIWludGVybmFscy5pc0NhcHR1cmVkKSB7XG4gICAgICAgICAgaW50ZXJuYWxzLmlzQ2FwdHVyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgYnl0ZXNOb3RpZmllZCA9IDA7XG5cbiAgICBpbnRlcm5hbHMudXBkYXRlUHJvZ3Jlc3MgPSB0aHJvdHRsZShmdW5jdGlvbiB0aHJvdHRsZWRIYW5kbGVyKCkge1xuICAgICAgY29uc3QgdG90YWxCeXRlcyA9IGludGVybmFscy5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlc1RyYW5zZmVycmVkID0gaW50ZXJuYWxzLmJ5dGVzU2VlbjtcbiAgICAgIGNvbnN0IHByb2dyZXNzQnl0ZXMgPSBieXRlc1RyYW5zZmVycmVkIC0gYnl0ZXNOb3RpZmllZDtcbiAgICAgIGlmICghcHJvZ3Jlc3NCeXRlcyB8fCBzZWxmLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCByYXRlID0gX3NwZWVkb21ldGVyKHByb2dyZXNzQnl0ZXMpO1xuXG4gICAgICBieXRlc05vdGlmaWVkID0gYnl0ZXNUcmFuc2ZlcnJlZDtcblxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCB7XG4gICAgICAgICAgJ2xvYWRlZCc6IGJ5dGVzVHJhbnNmZXJyZWQsXG4gICAgICAgICAgJ3RvdGFsJzogdG90YWxCeXRlcyxcbiAgICAgICAgICAncHJvZ3Jlc3MnOiB0b3RhbEJ5dGVzID8gKGJ5dGVzVHJhbnNmZXJyZWQgLyB0b3RhbEJ5dGVzKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAnYnl0ZXMnOiBwcm9ncmVzc0J5dGVzLFxuICAgICAgICAgICdyYXRlJzogcmF0ZSA/IHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgJ2VzdGltYXRlZCc6IHJhdGUgJiYgdG90YWxCeXRlcyAmJiBieXRlc1RyYW5zZmVycmVkIDw9IHRvdGFsQnl0ZXMgP1xuICAgICAgICAgICAgKHRvdGFsQnl0ZXMgLSBieXRlc1RyYW5zZmVycmVkKSAvIHJhdGUgOiB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBpbnRlcm5hbHMudGlja3NSYXRlKTtcblxuICAgIGNvbnN0IG9uRmluaXNoID0gKCkgPT4ge1xuICAgICAgaW50ZXJuYWxzLnVwZGF0ZVByb2dyZXNzKHRydWUpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uY2UoJ2VuZCcsIG9uRmluaXNoKTtcbiAgICB0aGlzLm9uY2UoJ2Vycm9yJywgb25GaW5pc2gpO1xuICB9XG5cbiAgX3JlYWQoc2l6ZSkge1xuICAgIGNvbnN0IGludGVybmFscyA9IHRoaXNba0ludGVybmFsc107XG5cbiAgICBpZiAoaW50ZXJuYWxzLm9uUmVhZENhbGxiYWNrKSB7XG4gICAgICBpbnRlcm5hbHMub25SZWFkQ2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3VwZXIuX3JlYWQoc2l6ZSk7XG4gIH1cblxuICBfdHJhbnNmb3JtKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBpbnRlcm5hbHMgPSB0aGlzW2tJbnRlcm5hbHNdO1xuICAgIGNvbnN0IG1heFJhdGUgPSBpbnRlcm5hbHMubWF4UmF0ZTtcblxuICAgIGNvbnN0IHJlYWRhYmxlSGlnaFdhdGVyTWFyayA9IHRoaXMucmVhZGFibGVIaWdoV2F0ZXJNYXJrO1xuXG4gICAgY29uc3QgdGltZVdpbmRvdyA9IGludGVybmFscy50aW1lV2luZG93O1xuXG4gICAgY29uc3QgZGl2aWRlciA9IDEwMDAgLyB0aW1lV2luZG93O1xuICAgIGNvbnN0IGJ5dGVzVGhyZXNob2xkID0gKG1heFJhdGUgLyBkaXZpZGVyKTtcbiAgICBjb25zdCBtaW5DaHVua1NpemUgPSBpbnRlcm5hbHMubWluQ2h1bmtTaXplICE9PSBmYWxzZSA/IE1hdGgubWF4KGludGVybmFscy5taW5DaHVua1NpemUsIGJ5dGVzVGhyZXNob2xkICogMC4wMSkgOiAwO1xuXG4gICAgZnVuY3Rpb24gcHVzaENodW5rKF9jaHVuaywgX2NhbGxiYWNrKSB7XG4gICAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5ieXRlTGVuZ3RoKF9jaHVuayk7XG4gICAgICBpbnRlcm5hbHMuYnl0ZXNTZWVuICs9IGJ5dGVzO1xuICAgICAgaW50ZXJuYWxzLmJ5dGVzICs9IGJ5dGVzO1xuXG4gICAgICBpZiAoaW50ZXJuYWxzLmlzQ2FwdHVyZWQpIHtcbiAgICAgICAgaW50ZXJuYWxzLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLnB1c2goX2NodW5rKSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKF9jYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnRlcm5hbHMub25SZWFkQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgaW50ZXJuYWxzLm9uUmVhZENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKF9jYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNmb3JtQ2h1bmsgPSAoX2NodW5rLCBfY2FsbGJhY2spID0+IHtcbiAgICAgIGNvbnN0IGNodW5rU2l6ZSA9IEJ1ZmZlci5ieXRlTGVuZ3RoKF9jaHVuayk7XG4gICAgICBsZXQgY2h1bmtSZW1haW5kZXIgPSBudWxsO1xuICAgICAgbGV0IG1heENodW5rU2l6ZSA9IHJlYWRhYmxlSGlnaFdhdGVyTWFyaztcbiAgICAgIGxldCBieXRlc0xlZnQ7XG4gICAgICBsZXQgcGFzc2VkID0gMDtcblxuICAgICAgaWYgKG1heFJhdGUpIHtcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgICBpZiAoIWludGVybmFscy50cyB8fCAocGFzc2VkID0gKG5vdyAtIGludGVybmFscy50cykpID49IHRpbWVXaW5kb3cpIHtcbiAgICAgICAgICBpbnRlcm5hbHMudHMgPSBub3c7XG4gICAgICAgICAgYnl0ZXNMZWZ0ID0gYnl0ZXNUaHJlc2hvbGQgLSBpbnRlcm5hbHMuYnl0ZXM7XG4gICAgICAgICAgaW50ZXJuYWxzLmJ5dGVzID0gYnl0ZXNMZWZ0IDwgMCA/IC1ieXRlc0xlZnQgOiAwO1xuICAgICAgICAgIHBhc3NlZCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBieXRlc0xlZnQgPSBieXRlc1RocmVzaG9sZCAtIGludGVybmFscy5ieXRlcztcbiAgICAgIH1cblxuICAgICAgaWYgKG1heFJhdGUpIHtcbiAgICAgICAgaWYgKGJ5dGVzTGVmdCA8PSAwKSB7XG4gICAgICAgICAgLy8gbmV4dCB0aW1lIHdpbmRvd1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIF9jYWxsYmFjayhudWxsLCBfY2h1bmspO1xuICAgICAgICAgIH0sIHRpbWVXaW5kb3cgLSBwYXNzZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ5dGVzTGVmdCA8IG1heENodW5rU2l6ZSkge1xuICAgICAgICAgIG1heENodW5rU2l6ZSA9IGJ5dGVzTGVmdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWF4Q2h1bmtTaXplICYmIGNodW5rU2l6ZSA+IG1heENodW5rU2l6ZSAmJiAoY2h1bmtTaXplIC0gbWF4Q2h1bmtTaXplKSA+IG1pbkNodW5rU2l6ZSkge1xuICAgICAgICBjaHVua1JlbWFpbmRlciA9IF9jaHVuay5zdWJhcnJheShtYXhDaHVua1NpemUpO1xuICAgICAgICBfY2h1bmsgPSBfY2h1bmsuc3ViYXJyYXkoMCwgbWF4Q2h1bmtTaXplKTtcbiAgICAgIH1cblxuICAgICAgcHVzaENodW5rKF9jaHVuaywgY2h1bmtSZW1haW5kZXIgPyAoKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soX2NhbGxiYWNrLCBudWxsLCBjaHVua1JlbWFpbmRlcik7XG4gICAgICB9IDogX2NhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgdHJhbnNmb3JtQ2h1bmsoY2h1bmssIGZ1bmN0aW9uIHRyYW5zZm9ybU5leHRDaHVuayhlcnIsIF9jaHVuaykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jaHVuaykge1xuICAgICAgICB0cmFuc2Zvcm1DaHVuayhfY2h1bmssIHRyYW5zZm9ybU5leHRDaHVuayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldExlbmd0aChsZW5ndGgpIHtcbiAgICB0aGlzW2tJbnRlcm5hbHNdLmxlbmd0aCA9ICtsZW5ndGg7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NUcmFuc2Zvcm1TdHJlYW07XG4iLCJjb25zdCB7YXN5bmNJdGVyYXRvcn0gPSBTeW1ib2w7XG5cbmNvbnN0IHJlYWRCbG9iID0gYXN5bmMgZnVuY3Rpb24qIChibG9iKSB7XG4gIGlmIChibG9iLnN0cmVhbSkge1xuICAgIHlpZWxkKiBibG9iLnN0cmVhbSgpXG4gIH0gZWxzZSBpZiAoYmxvYi5hcnJheUJ1ZmZlcikge1xuICAgIHlpZWxkIGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKVxuICB9IGVsc2UgaWYgKGJsb2JbYXN5bmNJdGVyYXRvcl0pIHtcbiAgICB5aWVsZCogYmxvYlthc3luY0l0ZXJhdG9yXSgpO1xuICB9IGVsc2Uge1xuICAgIHlpZWxkIGJsb2I7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVhZEJsb2I7XG4iLCJpbXBvcnQge1RleHRFbmNvZGVyfSBmcm9tICd1dGlsJztcbmltcG9ydCB7UmVhZGFibGV9IGZyb20gJ3N0cmVhbSc7XG5pbXBvcnQgdXRpbHMgZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5pbXBvcnQgcmVhZEJsb2IgZnJvbSBcIi4vcmVhZEJsb2IuanNcIjtcblxuY29uc3QgQk9VTkRBUllfQUxQSEFCRVQgPSB1dGlscy5BTFBIQUJFVC5BTFBIQV9ESUdJVCArICctXyc7XG5cbmNvbnN0IHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmNvbnN0IENSTEYgPSAnXFxyXFxuJztcbmNvbnN0IENSTEZfQllURVMgPSB0ZXh0RW5jb2Rlci5lbmNvZGUoQ1JMRik7XG5jb25zdCBDUkxGX0JZVEVTX0NPVU5UID0gMjtcblxuY2xhc3MgRm9ybURhdGFQYXJ0IHtcbiAgY29uc3RydWN0b3IobmFtZSwgdmFsdWUpIHtcbiAgICBjb25zdCB7ZXNjYXBlTmFtZX0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IGlzU3RyaW5nVmFsdWUgPSB1dGlscy5pc1N0cmluZyh2YWx1ZSk7XG5cbiAgICBsZXQgaGVhZGVycyA9IGBDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCIke2VzY2FwZU5hbWUobmFtZSl9XCIke1xuICAgICAgIWlzU3RyaW5nVmFsdWUgJiYgdmFsdWUubmFtZSA/IGA7IGZpbGVuYW1lPVwiJHtlc2NhcGVOYW1lKHZhbHVlLm5hbWUpfVwiYCA6ICcnXG4gICAgfSR7Q1JMRn1gO1xuXG4gICAgaWYgKGlzU3RyaW5nVmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdGV4dEVuY29kZXIuZW5jb2RlKFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvXFxyP1xcbnxcXHJcXG4/L2csIENSTEYpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVycyArPSBgQ29udGVudC1UeXBlOiAke3ZhbHVlLnR5cGUgfHwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIn0ke0NSTEZ9YFxuICAgIH1cblxuICAgIHRoaXMuaGVhZGVycyA9IHRleHRFbmNvZGVyLmVuY29kZShoZWFkZXJzICsgQ1JMRik7XG5cbiAgICB0aGlzLmNvbnRlbnRMZW5ndGggPSBpc1N0cmluZ1ZhbHVlID8gdmFsdWUuYnl0ZUxlbmd0aCA6IHZhbHVlLnNpemU7XG5cbiAgICB0aGlzLnNpemUgPSB0aGlzLmhlYWRlcnMuYnl0ZUxlbmd0aCArIHRoaXMuY29udGVudExlbmd0aCArIENSTEZfQllURVNfQ09VTlQ7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGFzeW5jICplbmNvZGUoKXtcbiAgICB5aWVsZCB0aGlzLmhlYWRlcnM7XG5cbiAgICBjb25zdCB7dmFsdWV9ID0gdGhpcztcblxuICAgIGlmKHV0aWxzLmlzVHlwZWRBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHlpZWxkIHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB5aWVsZCogcmVhZEJsb2IodmFsdWUpO1xuICAgIH1cblxuICAgIHlpZWxkIENSTEZfQllURVM7XG4gIH1cblxuICBzdGF0aWMgZXNjYXBlTmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKG5hbWUpLnJlcGxhY2UoL1tcXHJcXG5cIl0vZywgKG1hdGNoKSA9PiAoe1xuICAgICAgICAnXFxyJyA6ICclMEQnLFxuICAgICAgICAnXFxuJyA6ICclMEEnLFxuICAgICAgICAnXCInIDogJyUyMicsXG4gICAgICB9W21hdGNoXSkpO1xuICB9XG59XG5cbmNvbnN0IGZvcm1EYXRhVG9TdHJlYW0gPSAoZm9ybSwgaGVhZGVyc0hhbmRsZXIsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qge1xuICAgIHRhZyA9ICdmb3JtLWRhdGEtYm91bmRhcnknLFxuICAgIHNpemUgPSAyNSxcbiAgICBib3VuZGFyeSA9IHRhZyArICctJyArIHV0aWxzLmdlbmVyYXRlU3RyaW5nKHNpemUsIEJPVU5EQVJZX0FMUEhBQkVUKVxuICB9ID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZighdXRpbHMuaXNGb3JtRGF0YShmb3JtKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignRm9ybURhdGEgaW5zdGFuY2UgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGlmIChib3VuZGFyeS5sZW5ndGggPCAxIHx8IGJvdW5kYXJ5Lmxlbmd0aCA+IDcwKSB7XG4gICAgdGhyb3cgRXJyb3IoJ2JvdW5kYXJ5IG11c3QgYmUgMTAtNzAgY2hhcmFjdGVycyBsb25nJylcbiAgfVxuXG4gIGNvbnN0IGJvdW5kYXJ5Qnl0ZXMgPSB0ZXh0RW5jb2Rlci5lbmNvZGUoJy0tJyArIGJvdW5kYXJ5ICsgQ1JMRik7XG4gIGNvbnN0IGZvb3RlckJ5dGVzID0gdGV4dEVuY29kZXIuZW5jb2RlKCctLScgKyBib3VuZGFyeSArICctLScgKyBDUkxGICsgQ1JMRik7XG4gIGxldCBjb250ZW50TGVuZ3RoID0gZm9vdGVyQnl0ZXMuYnl0ZUxlbmd0aDtcblxuICBjb25zdCBwYXJ0cyA9IEFycmF5LmZyb20oZm9ybS5lbnRyaWVzKCkpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IHBhcnQgPSBuZXcgRm9ybURhdGFQYXJ0KG5hbWUsIHZhbHVlKTtcbiAgICBjb250ZW50TGVuZ3RoICs9IHBhcnQuc2l6ZTtcbiAgICByZXR1cm4gcGFydDtcbiAgfSk7XG5cbiAgY29udGVudExlbmd0aCArPSBib3VuZGFyeUJ5dGVzLmJ5dGVMZW5ndGggKiBwYXJ0cy5sZW5ndGg7XG5cbiAgY29udGVudExlbmd0aCA9IHV0aWxzLnRvRmluaXRlTnVtYmVyKGNvbnRlbnRMZW5ndGgpO1xuXG4gIGNvbnN0IGNvbXB1dGVkSGVhZGVycyA9IHtcbiAgICAnQ29udGVudC1UeXBlJzogYG11bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PSR7Ym91bmRhcnl9YFxuICB9XG5cbiAgaWYgKE51bWJlci5pc0Zpbml0ZShjb250ZW50TGVuZ3RoKSkge1xuICAgIGNvbXB1dGVkSGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IGNvbnRlbnRMZW5ndGg7XG4gIH1cblxuICBoZWFkZXJzSGFuZGxlciAmJiBoZWFkZXJzSGFuZGxlcihjb21wdXRlZEhlYWRlcnMpO1xuXG4gIHJldHVybiBSZWFkYWJsZS5mcm9tKChhc3luYyBmdW5jdGlvbiAqKCkge1xuICAgIGZvcihjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICB5aWVsZCBib3VuZGFyeUJ5dGVzO1xuICAgICAgeWllbGQqIHBhcnQuZW5jb2RlKCk7XG4gICAgfVxuXG4gICAgeWllbGQgZm9vdGVyQnl0ZXM7XG4gIH0pKCkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZm9ybURhdGFUb1N0cmVhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgc3RyZWFtIGZyb20gXCJzdHJlYW1cIjtcblxuY2xhc3MgWmxpYkhlYWRlclRyYW5zZm9ybVN0cmVhbSBleHRlbmRzIHN0cmVhbS5UcmFuc2Zvcm0ge1xuICBfX3RyYW5zZm9ybShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wdXNoKGNodW5rKTtcbiAgICBjYWxsYmFjaygpO1xuICB9XG5cbiAgX3RyYW5zZm9ybShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNodW5rLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy5fdHJhbnNmb3JtID0gdGhpcy5fX3RyYW5zZm9ybTtcblxuICAgICAgLy8gQWRkIERlZmF1bHQgQ29tcHJlc3Npb24gaGVhZGVycyBpZiBubyB6bGliIGhlYWRlcnMgYXJlIHByZXNlbnRcbiAgICAgIGlmIChjaHVua1swXSAhPT0gMTIwKSB7IC8vIEhleDogNzhcbiAgICAgICAgY29uc3QgaGVhZGVyID0gQnVmZmVyLmFsbG9jKDIpO1xuICAgICAgICBoZWFkZXJbMF0gPSAxMjA7IC8vIEhleDogNzhcbiAgICAgICAgaGVhZGVyWzFdID0gMTU2OyAvLyBIZXg6IDlDIFxuICAgICAgICB0aGlzLnB1c2goaGVhZGVyLCBlbmNvZGluZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fX3RyYW5zZm9ybShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBabGliSGVhZGVyVHJhbnNmb3JtU3RyZWFtO1xuIiwiaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuXG5jb25zdCBjYWxsYmFja2lmeSA9IChmbiwgcmVkdWNlcikgPT4ge1xuICByZXR1cm4gdXRpbHMuaXNBc3luY0ZuKGZuKSA/IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY29uc3QgY2IgPSBhcmdzLnBvcCgpO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZWR1Y2VyID8gY2IobnVsbCwgLi4ucmVkdWNlcih2YWx1ZSkpIDogY2IobnVsbCwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNiKGVycik7XG4gICAgICB9XG4gICAgfSwgY2IpO1xuICB9IDogZm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNhbGxiYWNraWZ5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgc2V0dGxlIGZyb20gJy4vLi4vY29yZS9zZXR0bGUuanMnO1xuaW1wb3J0IGJ1aWxkRnVsbFBhdGggZnJvbSAnLi4vY29yZS9idWlsZEZ1bGxQYXRoLmpzJztcbmltcG9ydCBidWlsZFVSTCBmcm9tICcuLy4uL2hlbHBlcnMvYnVpbGRVUkwuanMnO1xuaW1wb3J0IHtnZXRQcm94eUZvclVybH0gZnJvbSAncHJveHktZnJvbS1lbnYnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgZm9sbG93UmVkaXJlY3RzIGZyb20gJ2ZvbGxvdy1yZWRpcmVjdHMnO1xuaW1wb3J0IHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4uL2Vudi9kYXRhLmpzJztcbmltcG9ydCB0cmFuc2l0aW9uYWxEZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy90cmFuc2l0aW9uYWwuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCBDYW5jZWxlZEVycm9yIGZyb20gJy4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgZnJvbURhdGFVUkkgZnJvbSAnLi4vaGVscGVycy9mcm9tRGF0YVVSSS5qcyc7XG5pbXBvcnQgc3RyZWFtIGZyb20gJ3N0cmVhbSc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCBBeGlvc1RyYW5zZm9ybVN0cmVhbSBmcm9tICcuLi9oZWxwZXJzL0F4aW9zVHJhbnNmb3JtU3RyZWFtLmpzJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBmb3JtRGF0YVRvU3RyZWFtIGZyb20gXCIuLi9oZWxwZXJzL2Zvcm1EYXRhVG9TdHJlYW0uanNcIjtcbmltcG9ydCByZWFkQmxvYiBmcm9tIFwiLi4vaGVscGVycy9yZWFkQmxvYi5qc1wiO1xuaW1wb3J0IFpsaWJIZWFkZXJUcmFuc2Zvcm1TdHJlYW0gZnJvbSAnLi4vaGVscGVycy9abGliSGVhZGVyVHJhbnNmb3JtU3RyZWFtLmpzJztcbmltcG9ydCBjYWxsYmFja2lmeSBmcm9tIFwiLi4vaGVscGVycy9jYWxsYmFja2lmeS5qc1wiO1xuXG5jb25zdCB6bGliT3B0aW9ucyA9IHtcbiAgZmx1c2g6IHpsaWIuY29uc3RhbnRzLlpfU1lOQ19GTFVTSCxcbiAgZmluaXNoRmx1c2g6IHpsaWIuY29uc3RhbnRzLlpfU1lOQ19GTFVTSFxufTtcblxuY29uc3QgYnJvdGxpT3B0aW9ucyA9IHtcbiAgZmx1c2g6IHpsaWIuY29uc3RhbnRzLkJST1RMSV9PUEVSQVRJT05fRkxVU0gsXG4gIGZpbmlzaEZsdXNoOiB6bGliLmNvbnN0YW50cy5CUk9UTElfT1BFUkFUSU9OX0ZMVVNIXG59XG5cbmNvbnN0IGlzQnJvdGxpU3VwcG9ydGVkID0gdXRpbHMuaXNGdW5jdGlvbih6bGliLmNyZWF0ZUJyb3RsaURlY29tcHJlc3MpO1xuXG5jb25zdCB7aHR0cDogaHR0cEZvbGxvdywgaHR0cHM6IGh0dHBzRm9sbG93fSA9IGZvbGxvd1JlZGlyZWN0cztcblxuY29uc3QgaXNIdHRwcyA9IC9odHRwczo/LztcblxuY29uc3Qgc3VwcG9ydGVkUHJvdG9jb2xzID0gcGxhdGZvcm0ucHJvdG9jb2xzLm1hcChwcm90b2NvbCA9PiB7XG4gIHJldHVybiBwcm90b2NvbCArICc6Jztcbn0pO1xuXG4vKipcbiAqIElmIHRoZSBwcm94eSBvciBjb25maWcgYmVmb3JlUmVkaXJlY3RzIGZ1bmN0aW9ucyBhcmUgZGVmaW5lZCwgY2FsbCB0aGVtIHdpdGggdGhlIG9wdGlvbnNcbiAqIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvYmplY3QgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSByZXF1ZXN0LlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBhbnk+fVxuICovXG5mdW5jdGlvbiBkaXNwYXRjaEJlZm9yZVJlZGlyZWN0KG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuYmVmb3JlUmVkaXJlY3RzLnByb3h5KSB7XG4gICAgb3B0aW9ucy5iZWZvcmVSZWRpcmVjdHMucHJveHkob3B0aW9ucyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuYmVmb3JlUmVkaXJlY3RzLmNvbmZpZykge1xuICAgIG9wdGlvbnMuYmVmb3JlUmVkaXJlY3RzLmNvbmZpZyhvcHRpb25zKTtcbiAgfVxufVxuXG4vKipcbiAqIElmIHRoZSBwcm94eSBvciBjb25maWcgYWZ0ZXJSZWRpcmVjdHMgZnVuY3Rpb25zIGFyZSBkZWZpbmVkLCBjYWxsIHRoZW0gd2l0aCB0aGUgb3B0aW9uc1xuICpcbiAqIEBwYXJhbSB7aHR0cC5DbGllbnRSZXF1ZXN0QXJnc30gb3B0aW9uc1xuICogQHBhcmFtIHtBeGlvc1Byb3h5Q29uZmlnfSBjb25maWdQcm94eSBjb25maWd1cmF0aW9uIGZyb20gQXhpb3Mgb3B0aW9ucyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICpcbiAqIEByZXR1cm5zIHtodHRwLkNsaWVudFJlcXVlc3RBcmdzfVxuICovXG5mdW5jdGlvbiBzZXRQcm94eShvcHRpb25zLCBjb25maWdQcm94eSwgbG9jYXRpb24pIHtcbiAgbGV0IHByb3h5ID0gY29uZmlnUHJveHk7XG4gIGlmICghcHJveHkgJiYgcHJveHkgIT09IGZhbHNlKSB7XG4gICAgY29uc3QgcHJveHlVcmwgPSBnZXRQcm94eUZvclVybChsb2NhdGlvbik7XG4gICAgaWYgKHByb3h5VXJsKSB7XG4gICAgICBwcm94eSA9IG5ldyBVUkwocHJveHlVcmwpO1xuICAgIH1cbiAgfVxuICBpZiAocHJveHkpIHtcbiAgICAvLyBCYXNpYyBwcm94eSBhdXRob3JpemF0aW9uXG4gICAgaWYgKHByb3h5LnVzZXJuYW1lKSB7XG4gICAgICBwcm94eS5hdXRoID0gKHByb3h5LnVzZXJuYW1lIHx8ICcnKSArICc6JyArIChwcm94eS5wYXNzd29yZCB8fCAnJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3h5LmF1dGgpIHtcbiAgICAgIC8vIFN1cHBvcnQgcHJveHkgYXV0aCBvYmplY3QgZm9ybVxuICAgICAgaWYgKHByb3h5LmF1dGgudXNlcm5hbWUgfHwgcHJveHkuYXV0aC5wYXNzd29yZCkge1xuICAgICAgICBwcm94eS5hdXRoID0gKHByb3h5LmF1dGgudXNlcm5hbWUgfHwgJycpICsgJzonICsgKHByb3h5LmF1dGgucGFzc3dvcmQgfHwgJycpO1xuICAgICAgfVxuICAgICAgY29uc3QgYmFzZTY0ID0gQnVmZmVyXG4gICAgICAgIC5mcm9tKHByb3h5LmF1dGgsICd1dGY4JylcbiAgICAgICAgLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIG9wdGlvbnMuaGVhZGVyc1snUHJveHktQXV0aG9yaXphdGlvbiddID0gJ0Jhc2ljICcgKyBiYXNlNjQ7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5oZWFkZXJzLmhvc3QgPSBvcHRpb25zLmhvc3RuYW1lICsgKG9wdGlvbnMucG9ydCA/ICc6JyArIG9wdGlvbnMucG9ydCA6ICcnKTtcbiAgICBjb25zdCBwcm94eUhvc3QgPSBwcm94eS5ob3N0bmFtZSB8fCBwcm94eS5ob3N0O1xuICAgIG9wdGlvbnMuaG9zdG5hbWUgPSBwcm94eUhvc3Q7XG4gICAgLy8gUmVwbGFjZSAnaG9zdCcgc2luY2Ugb3B0aW9ucyBpcyBub3QgYSBVUkwgb2JqZWN0XG4gICAgb3B0aW9ucy5ob3N0ID0gcHJveHlIb3N0O1xuICAgIG9wdGlvbnMucG9ydCA9IHByb3h5LnBvcnQ7XG4gICAgb3B0aW9ucy5wYXRoID0gbG9jYXRpb247XG4gICAgaWYgKHByb3h5LnByb3RvY29sKSB7XG4gICAgICBvcHRpb25zLnByb3RvY29sID0gcHJveHkucHJvdG9jb2wuaW5jbHVkZXMoJzonKSA/IHByb3h5LnByb3RvY29sIDogYCR7cHJveHkucHJvdG9jb2x9OmA7XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5iZWZvcmVSZWRpcmVjdHMucHJveHkgPSBmdW5jdGlvbiBiZWZvcmVSZWRpcmVjdChyZWRpcmVjdE9wdGlvbnMpIHtcbiAgICAvLyBDb25maWd1cmUgcHJveHkgZm9yIHJlZGlyZWN0ZWQgcmVxdWVzdCwgcGFzc2luZyB0aGUgb3JpZ2luYWwgY29uZmlnIHByb3h5IHRvIGFwcGx5XG4gICAgLy8gdGhlIGV4YWN0IHNhbWUgbG9naWMgYXMgaWYgdGhlIHJlZGlyZWN0ZWQgcmVxdWVzdCB3YXMgcGVyZm9ybWVkIGJ5IGF4aW9zIGRpcmVjdGx5LlxuICAgIHNldFByb3h5KHJlZGlyZWN0T3B0aW9ucywgY29uZmlnUHJveHksIHJlZGlyZWN0T3B0aW9ucy5ocmVmKTtcbiAgfTtcbn1cblxuY29uc3QgaXNIdHRwQWRhcHRlclN1cHBvcnRlZCA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB1dGlscy5raW5kT2YocHJvY2VzcykgPT09ICdwcm9jZXNzJztcblxuLy8gdGVtcG9yYXJ5IGhvdGZpeFxuXG5jb25zdCB3cmFwQXN5bmMgPSAoYXN5bmNFeGVjdXRvcikgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBvbkRvbmU7XG4gICAgbGV0IGlzRG9uZTtcblxuICAgIGNvbnN0IGRvbmUgPSAodmFsdWUsIGlzUmVqZWN0ZWQpID0+IHtcbiAgICAgIGlmIChpc0RvbmUpIHJldHVybjtcbiAgICAgIGlzRG9uZSA9IHRydWU7XG4gICAgICBvbkRvbmUgJiYgb25Eb25lKHZhbHVlLCBpc1JlamVjdGVkKTtcbiAgICB9XG5cbiAgICBjb25zdCBfcmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgZG9uZSh2YWx1ZSk7XG4gICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgY29uc3QgX3JlamVjdCA9IChyZWFzb24pID0+IHtcbiAgICAgIGRvbmUocmVhc29uLCB0cnVlKTtcbiAgICAgIHJlamVjdChyZWFzb24pO1xuICAgIH1cblxuICAgIGFzeW5jRXhlY3V0b3IoX3Jlc29sdmUsIF9yZWplY3QsIChvbkRvbmVIYW5kbGVyKSA9PiAob25Eb25lID0gb25Eb25lSGFuZGxlcikpLmNhdGNoKF9yZWplY3QpO1xuICB9KVxufTtcblxuLyplc2xpbnQgY29uc2lzdGVudC1yZXR1cm46MCovXG5leHBvcnQgZGVmYXVsdCBpc0h0dHBBZGFwdGVyU3VwcG9ydGVkICYmIGZ1bmN0aW9uIGh0dHBBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gd3JhcEFzeW5jKGFzeW5jIGZ1bmN0aW9uIGRpc3BhdGNoSHR0cFJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0LCBvbkRvbmUpIHtcbiAgICBsZXQge2RhdGEsIGxvb2t1cCwgZmFtaWx5fSA9IGNvbmZpZztcbiAgICBjb25zdCB7cmVzcG9uc2VUeXBlLCByZXNwb25zZUVuY29kaW5nfSA9IGNvbmZpZztcbiAgICBjb25zdCBtZXRob2QgPSBjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gICAgbGV0IGlzRG9uZTtcbiAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgICBsZXQgcmVxO1xuXG4gICAgaWYgKGxvb2t1cCAmJiB1dGlscy5pc0FzeW5jRm4obG9va3VwKSkge1xuICAgICAgbG9va3VwID0gY2FsbGJhY2tpZnkobG9va3VwLCAoZW50cnkpID0+IHtcbiAgICAgICAgaWYodXRpbHMuaXNTdHJpbmcoZW50cnkpKSB7XG4gICAgICAgICAgZW50cnkgPSBbZW50cnksIGVudHJ5LmluZGV4T2YoJy4nKSA8IDAgPyA2IDogNF1cbiAgICAgICAgfSBlbHNlIGlmICghdXRpbHMuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsb29rdXAgYXN5bmMgZnVuY3Rpb24gbXVzdCByZXR1cm4gYW4gYXJyYXkgW2lwOiBzdHJpbmcsIGZhbWlseTogbnVtYmVyXV0nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gdGVtcG9yYXJ5IGludGVybmFsIGVtaXR0ZXIgdW50aWwgdGhlIEF4aW9zUmVxdWVzdCBjbGFzcyB3aWxsIGJlIGltcGxlbWVudGVkXG4gICAgY29uc3QgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGNvbnN0IG9uRmluaXNoZWQgPSAoKSA9PiB7XG4gICAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi51bnN1YnNjcmliZShhYm9ydCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydCk7XG4gICAgICB9XG5cbiAgICAgIGVtaXR0ZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgb25Eb25lKCh2YWx1ZSwgaXNSZWplY3RlZCkgPT4ge1xuICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgIGlmIChpc1JlamVjdGVkKSB7XG4gICAgICAgIHJlamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgb25GaW5pc2hlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYWJvcnQocmVhc29uKSB7XG4gICAgICBlbWl0dGVyLmVtaXQoJ2Fib3J0JywgIXJlYXNvbiB8fCByZWFzb24udHlwZSA/IG5ldyBDYW5jZWxlZEVycm9yKG51bGwsIGNvbmZpZywgcmVxKSA6IHJlYXNvbik7XG4gICAgfVxuXG4gICAgZW1pdHRlci5vbmNlKCdhYm9ydCcsIHJlamVjdCk7XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuIHx8IGNvbmZpZy5zaWduYWwpIHtcbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbiAmJiBjb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKGFib3J0KTtcbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IGFib3J0KCkgOiBjb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFBhcnNlIHVybFxuICAgIGNvbnN0IGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTChmdWxsUGF0aCwgJ2h0dHA6Ly9sb2NhbGhvc3QnKTtcbiAgICBjb25zdCBwcm90b2NvbCA9IHBhcnNlZC5wcm90b2NvbCB8fCBzdXBwb3J0ZWRQcm90b2NvbHNbMF07XG5cbiAgICBpZiAocHJvdG9jb2wgPT09ICdkYXRhOicpIHtcbiAgICAgIGxldCBjb252ZXJ0ZWREYXRhO1xuXG4gICAgICBpZiAobWV0aG9kICE9PSAnR0VUJykge1xuICAgICAgICByZXR1cm4gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwge1xuICAgICAgICAgIHN0YXR1czogNDA1LFxuICAgICAgICAgIHN0YXR1c1RleHQ6ICdtZXRob2Qgbm90IGFsbG93ZWQnLFxuICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgIGNvbmZpZ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29udmVydGVkRGF0YSA9IGZyb21EYXRhVVJJKGNvbmZpZy51cmwsIHJlc3BvbnNlVHlwZSA9PT0gJ2Jsb2InLCB7XG4gICAgICAgICAgQmxvYjogY29uZmlnLmVudiAmJiBjb25maWcuZW52LkJsb2JcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgQXhpb3NFcnJvci5mcm9tKGVyciwgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZVR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICBjb252ZXJ0ZWREYXRhID0gY29udmVydGVkRGF0YS50b1N0cmluZyhyZXNwb25zZUVuY29kaW5nKTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlRW5jb2RpbmcgfHwgcmVzcG9uc2VFbmNvZGluZyA9PT0gJ3V0ZjgnKSB7XG4gICAgICAgICAgY29udmVydGVkRGF0YSA9IHV0aWxzLnN0cmlwQk9NKGNvbnZlcnRlZERhdGEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScpIHtcbiAgICAgICAgY29udmVydGVkRGF0YSA9IHN0cmVhbS5SZWFkYWJsZS5mcm9tKGNvbnZlcnRlZERhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwge1xuICAgICAgICBkYXRhOiBjb252ZXJ0ZWREYXRhLFxuICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgc3RhdHVzVGV4dDogJ09LJyxcbiAgICAgICAgaGVhZGVyczogbmV3IEF4aW9zSGVhZGVycygpLFxuICAgICAgICBjb25maWdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzdXBwb3J0ZWRQcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICAnVW5zdXBwb3J0ZWQgcHJvdG9jb2wgJyArIHByb3RvY29sLFxuICAgICAgICBBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCxcbiAgICAgICAgY29uZmlnXG4gICAgICApKTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oY29uZmlnLmhlYWRlcnMpLm5vcm1hbGl6ZSgpO1xuXG4gICAgLy8gU2V0IFVzZXItQWdlbnQgKHJlcXVpcmVkIGJ5IHNvbWUgc2VydmVycylcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy82OVxuICAgIC8vIFVzZXItQWdlbnQgaXMgc3BlY2lmaWVkOyBoYW5kbGUgY2FzZSB3aGVyZSBubyBVQSBoZWFkZXIgaXMgZGVzaXJlZFxuICAgIC8vIE9ubHkgc2V0IGhlYWRlciBpZiBpdCBoYXNuJ3QgYmVlbiBzZXQgaW4gY29uZmlnXG4gICAgaGVhZGVycy5zZXQoJ1VzZXItQWdlbnQnLCAnYXhpb3MvJyArIFZFUlNJT04sIGZhbHNlKTtcblxuICAgIGNvbnN0IG9uRG93bmxvYWRQcm9ncmVzcyA9IGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3M7XG4gICAgY29uc3Qgb25VcGxvYWRQcm9ncmVzcyA9IGNvbmZpZy5vblVwbG9hZFByb2dyZXNzO1xuICAgIGNvbnN0IG1heFJhdGUgPSBjb25maWcubWF4UmF0ZTtcbiAgICBsZXQgbWF4VXBsb2FkUmF0ZSA9IHVuZGVmaW5lZDtcbiAgICBsZXQgbWF4RG93bmxvYWRSYXRlID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gc3VwcG9ydCBmb3Igc3BlYyBjb21wbGlhbnQgRm9ybURhdGEgb2JqZWN0c1xuICAgIGlmICh1dGlscy5pc1NwZWNDb21wbGlhbnRGb3JtKGRhdGEpKSB7XG4gICAgICBjb25zdCB1c2VyQm91bmRhcnkgPSBoZWFkZXJzLmdldENvbnRlbnRUeXBlKC9ib3VuZGFyeT0oWy1fXFx3XFxkXXsxMCw3MH0pL2kpO1xuXG4gICAgICBkYXRhID0gZm9ybURhdGFUb1N0cmVhbShkYXRhLCAoZm9ybUhlYWRlcnMpID0+IHtcbiAgICAgICAgaGVhZGVycy5zZXQoZm9ybUhlYWRlcnMpO1xuICAgICAgfSwge1xuICAgICAgICB0YWc6IGBheGlvcy0ke1ZFUlNJT059LWJvdW5kYXJ5YCxcbiAgICAgICAgYm91bmRhcnk6IHVzZXJCb3VuZGFyeSAmJiB1c2VyQm91bmRhcnlbMV0gfHwgdW5kZWZpbmVkXG4gICAgICB9KTtcbiAgICAgIC8vIHN1cHBvcnQgZm9yIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Zvcm0tZGF0YSBhcGlcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgJiYgdXRpbHMuaXNGdW5jdGlvbihkYXRhLmdldEhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLnNldChkYXRhLmdldEhlYWRlcnMoKSk7XG5cbiAgICAgIGlmICghaGVhZGVycy5oYXNDb250ZW50TGVuZ3RoKCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBrbm93bkxlbmd0aCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGRhdGEuZ2V0TGVuZ3RoKS5jYWxsKGRhdGEpO1xuICAgICAgICAgIE51bWJlci5pc0Zpbml0ZShrbm93bkxlbmd0aCkgJiYga25vd25MZW5ndGggPj0gMCAmJiBoZWFkZXJzLnNldENvbnRlbnRMZW5ndGgoa25vd25MZW5ndGgpO1xuICAgICAgICAgIC8qZXNsaW50IG5vLWVtcHR5OjAqL1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQmxvYihkYXRhKSkge1xuICAgICAgZGF0YS5zaXplICYmIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoZGF0YS50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nKTtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudExlbmd0aChkYXRhLnNpemUgfHwgMCk7XG4gICAgICBkYXRhID0gc3RyZWFtLlJlYWRhYmxlLmZyb20ocmVhZEJsb2IoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAoZGF0YSAmJiAhdXRpbHMuaXNTdHJlYW0oZGF0YSkpIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgLy8gTm90aGluZyB0byBkby4uLlxuICAgICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpKSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShuZXcgVWludDhBcnJheShkYXRhKSk7XG4gICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhLCAndXRmLTgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgJ0RhdGEgYWZ0ZXIgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhIHN0cmluZywgYW4gQXJyYXlCdWZmZXIsIGEgQnVmZmVyLCBvciBhIFN0cmVhbScsXG4gICAgICAgICAgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgQ29udGVudC1MZW5ndGggaGVhZGVyIGlmIGRhdGEgZXhpc3RzXG4gICAgICBoZWFkZXJzLnNldENvbnRlbnRMZW5ndGgoZGF0YS5sZW5ndGgsIGZhbHNlKTtcblxuICAgICAgaWYgKGNvbmZpZy5tYXhCb2R5TGVuZ3RoID4gLTEgJiYgZGF0YS5sZW5ndGggPiBjb25maWcubWF4Qm9keUxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICAgICdSZXF1ZXN0IGJvZHkgbGFyZ2VyIHRoYW4gbWF4Qm9keUxlbmd0aCBsaW1pdCcsXG4gICAgICAgICAgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbnRlbnRMZW5ndGggPSB1dGlscy50b0Zpbml0ZU51bWJlcihoZWFkZXJzLmdldENvbnRlbnRMZW5ndGgoKSk7XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheShtYXhSYXRlKSkge1xuICAgICAgbWF4VXBsb2FkUmF0ZSA9IG1heFJhdGVbMF07XG4gICAgICBtYXhEb3dubG9hZFJhdGUgPSBtYXhSYXRlWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXhVcGxvYWRSYXRlID0gbWF4RG93bmxvYWRSYXRlID0gbWF4UmF0ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSAmJiAob25VcGxvYWRQcm9ncmVzcyB8fCBtYXhVcGxvYWRSYXRlKSkge1xuICAgICAgaWYgKCF1dGlscy5pc1N0cmVhbShkYXRhKSkge1xuICAgICAgICBkYXRhID0gc3RyZWFtLlJlYWRhYmxlLmZyb20oZGF0YSwge29iamVjdE1vZGU6IGZhbHNlfSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGEgPSBzdHJlYW0ucGlwZWxpbmUoW2RhdGEsIG5ldyBBeGlvc1RyYW5zZm9ybVN0cmVhbSh7XG4gICAgICAgIGxlbmd0aDogY29udGVudExlbmd0aCxcbiAgICAgICAgbWF4UmF0ZTogdXRpbHMudG9GaW5pdGVOdW1iZXIobWF4VXBsb2FkUmF0ZSlcbiAgICAgIH0pXSwgdXRpbHMubm9vcCk7XG5cbiAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MgJiYgZGF0YS5vbigncHJvZ3Jlc3MnLCBwcm9ncmVzcyA9PiB7XG4gICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MoT2JqZWN0LmFzc2lnbihwcm9ncmVzcywge1xuICAgICAgICAgIHVwbG9hZDogdHJ1ZVxuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgbGV0IGF1dGggPSB1bmRlZmluZWQ7XG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICBjb25zdCB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIGF1dGggPSB1c2VybmFtZSArICc6JyArIHBhc3N3b3JkO1xuICAgIH1cblxuICAgIGlmICghYXV0aCAmJiBwYXJzZWQudXNlcm5hbWUpIHtcbiAgICAgIGNvbnN0IHVybFVzZXJuYW1lID0gcGFyc2VkLnVzZXJuYW1lO1xuICAgICAgY29uc3QgdXJsUGFzc3dvcmQgPSBwYXJzZWQucGFzc3dvcmQ7XG4gICAgICBhdXRoID0gdXJsVXNlcm5hbWUgKyAnOicgKyB1cmxQYXNzd29yZDtcbiAgICB9XG5cbiAgICBhdXRoICYmIGhlYWRlcnMuZGVsZXRlKCdhdXRob3JpemF0aW9uJyk7XG5cbiAgICBsZXQgcGF0aDtcblxuICAgIHRyeSB7XG4gICAgICBwYXRoID0gYnVpbGRVUkwoXG4gICAgICAgIHBhcnNlZC5wYXRobmFtZSArIHBhcnNlZC5zZWFyY2gsXG4gICAgICAgIGNvbmZpZy5wYXJhbXMsXG4gICAgICAgIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyXG4gICAgICApLnJlcGxhY2UoL15cXD8vLCAnJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBjdXN0b21FcnIgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgY3VzdG9tRXJyLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgIGN1c3RvbUVyci51cmwgPSBjb25maWcudXJsO1xuICAgICAgY3VzdG9tRXJyLmV4aXN0cyA9IHRydWU7XG4gICAgICByZXR1cm4gcmVqZWN0KGN1c3RvbUVycik7XG4gICAgfVxuXG4gICAgaGVhZGVycy5zZXQoXG4gICAgICAnQWNjZXB0LUVuY29kaW5nJyxcbiAgICAgICdnemlwLCBjb21wcmVzcywgZGVmbGF0ZScgKyAoaXNCcm90bGlTdXBwb3J0ZWQgPyAnLCBicicgOiAnJyksIGZhbHNlXG4gICAgICApO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHBhdGgsXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMudG9KU09OKCksXG4gICAgICBhZ2VudHM6IHsgaHR0cDogY29uZmlnLmh0dHBBZ2VudCwgaHR0cHM6IGNvbmZpZy5odHRwc0FnZW50IH0sXG4gICAgICBhdXRoLFxuICAgICAgcHJvdG9jb2wsXG4gICAgICBmYW1pbHksXG4gICAgICBsb29rdXAsXG4gICAgICBiZWZvcmVSZWRpcmVjdDogZGlzcGF0Y2hCZWZvcmVSZWRpcmVjdCxcbiAgICAgIGJlZm9yZVJlZGlyZWN0czoge31cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy5zb2NrZXRQYXRoKSB7XG4gICAgICBvcHRpb25zLnNvY2tldFBhdGggPSBjb25maWcuc29ja2V0UGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5ob3N0bmFtZSA9IHBhcnNlZC5ob3N0bmFtZTtcbiAgICAgIG9wdGlvbnMucG9ydCA9IHBhcnNlZC5wb3J0O1xuICAgICAgc2V0UHJveHkob3B0aW9ucywgY29uZmlnLnByb3h5LCBwcm90b2NvbCArICcvLycgKyBwYXJzZWQuaG9zdG5hbWUgKyAocGFyc2VkLnBvcnQgPyAnOicgKyBwYXJzZWQucG9ydCA6ICcnKSArIG9wdGlvbnMucGF0aCk7XG4gICAgfVxuXG4gICAgbGV0IHRyYW5zcG9ydDtcbiAgICBjb25zdCBpc0h0dHBzUmVxdWVzdCA9IGlzSHR0cHMudGVzdChvcHRpb25zLnByb3RvY29sKTtcbiAgICBvcHRpb25zLmFnZW50ID0gaXNIdHRwc1JlcXVlc3QgPyBjb25maWcuaHR0cHNBZ2VudCA6IGNvbmZpZy5odHRwQWdlbnQ7XG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQpIHtcbiAgICAgIHRyYW5zcG9ydCA9IGNvbmZpZy50cmFuc3BvcnQ7XG4gICAgfSBlbHNlIGlmIChjb25maWcubWF4UmVkaXJlY3RzID09PSAwKSB7XG4gICAgICB0cmFuc3BvcnQgPSBpc0h0dHBzUmVxdWVzdCA/IGh0dHBzIDogaHR0cDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbmZpZy5tYXhSZWRpcmVjdHMpIHtcbiAgICAgICAgb3B0aW9ucy5tYXhSZWRpcmVjdHMgPSBjb25maWcubWF4UmVkaXJlY3RzO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5iZWZvcmVSZWRpcmVjdCkge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVJlZGlyZWN0cy5jb25maWcgPSBjb25maWcuYmVmb3JlUmVkaXJlY3Q7XG4gICAgICB9XG4gICAgICB0cmFuc3BvcnQgPSBpc0h0dHBzUmVxdWVzdCA/IGh0dHBzRm9sbG93IDogaHR0cEZvbGxvdztcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1heEJvZHlMZW5ndGggPiAtMSkge1xuICAgICAgb3B0aW9ucy5tYXhCb2R5TGVuZ3RoID0gY29uZmlnLm1heEJvZHlMZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGZvbGxvdy1yZWRpcmVjdHMgZG9lcyBub3Qgc2tpcCBjb21wYXJpc29uLCBzbyBpdCBzaG91bGQgYWx3YXlzIHN1Y2NlZWQgZm9yIGF4aW9zIC0xIHVubGltaXRlZFxuICAgICAgb3B0aW9ucy5tYXhCb2R5TGVuZ3RoID0gSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pbnNlY3VyZUhUVFBQYXJzZXIpIHtcbiAgICAgIG9wdGlvbnMuaW5zZWN1cmVIVFRQUGFyc2VyID0gY29uZmlnLmluc2VjdXJlSFRUUFBhcnNlcjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJlcXVlc3RcbiAgICByZXEgPSB0cmFuc3BvcnQucmVxdWVzdChvcHRpb25zLCBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXMpIHtcbiAgICAgIGlmIChyZXEuZGVzdHJveWVkKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHN0cmVhbXMgPSBbcmVzXTtcblxuICAgICAgY29uc3QgcmVzcG9uc2VMZW5ndGggPSArcmVzLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ107XG5cbiAgICAgIGlmIChvbkRvd25sb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtU3RyZWFtID0gbmV3IEF4aW9zVHJhbnNmb3JtU3RyZWFtKHtcbiAgICAgICAgICBsZW5ndGg6IHV0aWxzLnRvRmluaXRlTnVtYmVyKHJlc3BvbnNlTGVuZ3RoKSxcbiAgICAgICAgICBtYXhSYXRlOiB1dGlscy50b0Zpbml0ZU51bWJlcihtYXhEb3dubG9hZFJhdGUpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9uRG93bmxvYWRQcm9ncmVzcyAmJiB0cmFuc2Zvcm1TdHJlYW0ub24oJ3Byb2dyZXNzJywgcHJvZ3Jlc3MgPT4ge1xuICAgICAgICAgIG9uRG93bmxvYWRQcm9ncmVzcyhPYmplY3QuYXNzaWduKHByb2dyZXNzLCB7XG4gICAgICAgICAgICBkb3dubG9hZDogdHJ1ZVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RyZWFtcy5wdXNoKHRyYW5zZm9ybVN0cmVhbSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGRlY29tcHJlc3MgdGhlIHJlc3BvbnNlIGJvZHkgdHJhbnNwYXJlbnRseSBpZiByZXF1aXJlZFxuICAgICAgbGV0IHJlc3BvbnNlU3RyZWFtID0gcmVzO1xuXG4gICAgICAvLyByZXR1cm4gdGhlIGxhc3QgcmVxdWVzdCBpbiBjYXNlIG9mIHJlZGlyZWN0c1xuICAgICAgY29uc3QgbGFzdFJlcXVlc3QgPSByZXMucmVxIHx8IHJlcTtcblxuICAgICAgLy8gaWYgZGVjb21wcmVzcyBkaXNhYmxlZCB3ZSBzaG91bGQgbm90IGRlY29tcHJlc3NcbiAgICAgIGlmIChjb25maWcuZGVjb21wcmVzcyAhPT0gZmFsc2UgJiYgcmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXSkge1xuICAgICAgICAvLyBpZiBubyBjb250ZW50LCBidXQgaGVhZGVycyBzdGlsbCBzYXkgdGhhdCBpdCBpcyBlbmNvZGVkLFxuICAgICAgICAvLyByZW1vdmUgdGhlIGhlYWRlciBub3QgY29uZnVzZSBkb3duc3RyZWFtIG9wZXJhdGlvbnNcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ0hFQUQnIHx8IHJlcy5zdGF0dXNDb2RlID09PSAyMDQpIHtcbiAgICAgICAgICBkZWxldGUgcmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXSkge1xuICAgICAgICAvKmVzbGludCBkZWZhdWx0LWNhc2U6MCovXG4gICAgICAgIGNhc2UgJ2d6aXAnOlxuICAgICAgICBjYXNlICd4LWd6aXAnOlxuICAgICAgICBjYXNlICdjb21wcmVzcyc6XG4gICAgICAgIGNhc2UgJ3gtY29tcHJlc3MnOlxuICAgICAgICAgIC8vIGFkZCB0aGUgdW56aXBwZXIgdG8gdGhlIGJvZHkgc3RyZWFtIHByb2Nlc3NpbmcgcGlwZWxpbmVcbiAgICAgICAgICBzdHJlYW1zLnB1c2goemxpYi5jcmVhdGVVbnppcCh6bGliT3B0aW9ucykpO1xuXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBjb250ZW50LWVuY29kaW5nIGluIG9yZGVyIHRvIG5vdCBjb25mdXNlIGRvd25zdHJlYW0gb3BlcmF0aW9uc1xuICAgICAgICAgIGRlbGV0ZSByZXMuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWZsYXRlJzpcbiAgICAgICAgICBzdHJlYW1zLnB1c2gobmV3IFpsaWJIZWFkZXJUcmFuc2Zvcm1TdHJlYW0oKSk7XG5cbiAgICAgICAgICAvLyBhZGQgdGhlIHVuemlwcGVyIHRvIHRoZSBib2R5IHN0cmVhbSBwcm9jZXNzaW5nIHBpcGVsaW5lXG4gICAgICAgICAgc3RyZWFtcy5wdXNoKHpsaWIuY3JlYXRlVW56aXAoemxpYk9wdGlvbnMpKTtcblxuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgY29udGVudC1lbmNvZGluZyBpbiBvcmRlciB0byBub3QgY29uZnVzZSBkb3duc3RyZWFtIG9wZXJhdGlvbnNcbiAgICAgICAgICBkZWxldGUgcmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYnInOlxuICAgICAgICAgIGlmIChpc0Jyb3RsaVN1cHBvcnRlZCkge1xuICAgICAgICAgICAgc3RyZWFtcy5wdXNoKHpsaWIuY3JlYXRlQnJvdGxpRGVjb21wcmVzcyhicm90bGlPcHRpb25zKSk7XG4gICAgICAgICAgICBkZWxldGUgcmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2VTdHJlYW0gPSBzdHJlYW1zLmxlbmd0aCA+IDEgPyBzdHJlYW0ucGlwZWxpbmUoc3RyZWFtcywgdXRpbHMubm9vcCkgOiBzdHJlYW1zWzBdO1xuXG4gICAgICBjb25zdCBvZmZMaXN0ZW5lcnMgPSBzdHJlYW0uZmluaXNoZWQocmVzcG9uc2VTdHJlYW0sICgpID0+IHtcbiAgICAgICAgb2ZmTGlzdGVuZXJzKCk7XG4gICAgICAgIG9uRmluaXNoZWQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVzLnN0YXR1c01lc3NhZ2UsXG4gICAgICAgIGhlYWRlcnM6IG5ldyBBeGlvc0hlYWRlcnMocmVzLmhlYWRlcnMpLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IGxhc3RSZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBpZiAocmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJykge1xuICAgICAgICByZXNwb25zZS5kYXRhID0gcmVzcG9uc2VTdHJlYW07XG4gICAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQnVmZmVyID0gW107XG4gICAgICAgIGxldCB0b3RhbFJlc3BvbnNlQnl0ZXMgPSAwO1xuXG4gICAgICAgIHJlc3BvbnNlU3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRGF0YShjaHVuaykge1xuICAgICAgICAgIHJlc3BvbnNlQnVmZmVyLnB1c2goY2h1bmspO1xuICAgICAgICAgIHRvdGFsUmVzcG9uc2VCeXRlcyArPSBjaHVuay5sZW5ndGg7XG5cbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGNvbnRlbnQgbGVuZ3RoIGlzIG5vdCBvdmVyIHRoZSBtYXhDb250ZW50TGVuZ3RoIGlmIHNwZWNpZmllZFxuICAgICAgICAgIGlmIChjb25maWcubWF4Q29udGVudExlbmd0aCA+IC0xICYmIHRvdGFsUmVzcG9uc2VCeXRlcyA+IGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzdHJlYW0uZGVzdHJveSgpIGVtaXQgYWJvcnRlZCBldmVudCBiZWZvcmUgY2FsbGluZyByZWplY3QoKSBvbiBOb2RlLmpzIHYxNlxuICAgICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVzcG9uc2VTdHJlYW0uZGVzdHJveSgpO1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKCdtYXhDb250ZW50TGVuZ3RoIHNpemUgb2YgJyArIGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoICsgJyBleGNlZWRlZCcsXG4gICAgICAgICAgICAgIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRSwgY29uZmlnLCBsYXN0UmVxdWVzdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzcG9uc2VTdHJlYW0ub24oJ2Fib3J0ZWQnLCBmdW5jdGlvbiBoYW5kbGVyU3RyZWFtQWJvcnRlZCgpIHtcbiAgICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgICAgICdtYXhDb250ZW50TGVuZ3RoIHNpemUgb2YgJyArIGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoICsgJyBleGNlZWRlZCcsXG4gICAgICAgICAgICBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBsYXN0UmVxdWVzdFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVzcG9uc2VTdHJlYW0uZGVzdHJveShlcnIpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNwb25zZVN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbiBoYW5kbGVTdHJlYW1FcnJvcihlcnIpIHtcbiAgICAgICAgICBpZiAocmVxLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICAgIHJlamVjdChBeGlvc0Vycm9yLmZyb20oZXJyLCBudWxsLCBjb25maWcsIGxhc3RSZXF1ZXN0KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc3BvbnNlU3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiBoYW5kbGVTdHJlYW1FbmQoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZURhdGEgPSByZXNwb25zZUJ1ZmZlci5sZW5ndGggPT09IDEgPyByZXNwb25zZUJ1ZmZlclswXSA6IEJ1ZmZlci5jb25jYXQocmVzcG9uc2VCdWZmZXIpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlVHlwZSAhPT0gJ2FycmF5YnVmZmVyJykge1xuICAgICAgICAgICAgICByZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEudG9TdHJpbmcocmVzcG9uc2VFbmNvZGluZyk7XG4gICAgICAgICAgICAgIGlmICghcmVzcG9uc2VFbmNvZGluZyB8fCByZXNwb25zZUVuY29kaW5nID09PSAndXRmOCcpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgPSB1dGlscy5zdHJpcEJPTShyZXNwb25zZURhdGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNwb25zZS5kYXRhID0gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KEF4aW9zRXJyb3IuZnJvbShlcnIsIG51bGwsIGNvbmZpZywgcmVzcG9uc2UucmVxdWVzdCwgcmVzcG9uc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZW1pdHRlci5vbmNlKCdhYm9ydCcsIGVyciA9PiB7XG4gICAgICAgIGlmICghcmVzcG9uc2VTdHJlYW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgcmVzcG9uc2VTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICAgIHJlc3BvbnNlU3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBlbWl0dGVyLm9uY2UoJ2Fib3J0JywgZXJyID0+IHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgICAgcmVxLmRlc3Ryb3koZXJyKTtcbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBlcnJvcnNcbiAgICByZXEub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlUmVxdWVzdEVycm9yKGVycikge1xuICAgICAgLy8gQHRvZG8gcmVtb3ZlXG4gICAgICAvLyBpZiAocmVxLmFib3J0ZWQgJiYgZXJyLmNvZGUgIT09IEF4aW9zRXJyb3IuRVJSX0ZSX1RPT19NQU5ZX1JFRElSRUNUUykgcmV0dXJuO1xuICAgICAgcmVqZWN0KEF4aW9zRXJyb3IuZnJvbShlcnIsIG51bGwsIGNvbmZpZywgcmVxKSk7XG4gICAgfSk7XG5cbiAgICAvLyBzZXQgdGNwIGtlZXAgYWxpdmUgdG8gcHJldmVudCBkcm9wIGNvbm5lY3Rpb24gYnkgcGVlclxuICAgIHJlcS5vbignc29ja2V0JywgZnVuY3Rpb24gaGFuZGxlUmVxdWVzdFNvY2tldChzb2NrZXQpIHtcbiAgICAgIC8vIGRlZmF1bHQgaW50ZXJ2YWwgb2Ygc2VuZGluZyBhY2sgcGFja2V0IGlzIDEgbWludXRlXG4gICAgICBzb2NrZXQuc2V0S2VlcEFsaXZlKHRydWUsIDEwMDAgKiA2MCk7XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUgcmVxdWVzdCB0aW1lb3V0XG4gICAgaWYgKGNvbmZpZy50aW1lb3V0KSB7XG4gICAgICAvLyBUaGlzIGlzIGZvcmNpbmcgYSBpbnQgdGltZW91dCB0byBhdm9pZCBwcm9ibGVtcyBpZiB0aGUgYHJlcWAgaW50ZXJmYWNlIGRvZXNuJ3QgaGFuZGxlIG90aGVyIHR5cGVzLlxuICAgICAgY29uc3QgdGltZW91dCA9IHBhcnNlSW50KGNvbmZpZy50aW1lb3V0LCAxMCk7XG5cbiAgICAgIGlmIChpc05hTih0aW1lb3V0KSkge1xuICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgJ2Vycm9yIHRyeWluZyB0byBwYXJzZSBgY29uZmlnLnRpbWVvdXRgIHRvIGludCcsXG4gICAgICAgICAgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVxXG4gICAgICAgICkpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU29tZXRpbWUsIHRoZSByZXNwb25zZSB3aWxsIGJlIHZlcnkgc2xvdywgYW5kIGRvZXMgbm90IHJlc3BvbmQsIHRoZSBjb25uZWN0IGV2ZW50IHdpbGwgYmUgYmxvY2sgYnkgZXZlbnQgbG9vcCBzeXN0ZW0uXG4gICAgICAvLyBBbmQgdGltZXIgY2FsbGJhY2sgd2lsbCBiZSBmaXJlZCwgYW5kIGFib3J0KCkgd2lsbCBiZSBpbnZva2VkIGJlZm9yZSBjb25uZWN0aW9uLCB0aGVuIGdldCBcInNvY2tldCBoYW5nIHVwXCIgYW5kIGNvZGUgRUNPTk5SRVNFVC5cbiAgICAgIC8vIEF0IHRoaXMgdGltZSwgaWYgd2UgaGF2ZSBhIGxhcmdlIG51bWJlciBvZiByZXF1ZXN0LCBub2RlanMgd2lsbCBoYW5nIHVwIHNvbWUgc29ja2V0IG9uIGJhY2tncm91bmQuIGFuZCB0aGUgbnVtYmVyIHdpbGwgdXAgYW5kIHVwLlxuICAgICAgLy8gQW5kIHRoZW4gdGhlc2Ugc29ja2V0IHdoaWNoIGJlIGhhbmcgdXAgd2lsbCBkZXZvdXJpbmcgQ1BVIGxpdHRsZSBieSBsaXR0bGUuXG4gICAgICAvLyBDbGllbnRSZXF1ZXN0LnNldFRpbWVvdXQgd2lsbCBiZSBmaXJlZCBvbiB0aGUgc3BlY2lmeSBtaWxsaXNlY29uZHMsIGFuZCBjYW4gbWFrZSBzdXJlIHRoYXQgYWJvcnQoKSB3aWxsIGJlIGZpcmVkIGFmdGVyIGNvbm5lY3QuXG4gICAgICByZXEuc2V0VGltZW91dCh0aW1lb3V0LCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0VGltZW91dCgpIHtcbiAgICAgICAgaWYgKGlzRG9uZSkgcmV0dXJuO1xuICAgICAgICBsZXQgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbmFsID0gY29uZmlnLnRyYW5zaXRpb25hbCB8fCB0cmFuc2l0aW9uYWxEZWZhdWx0cztcbiAgICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICAgIHRyYW5zaXRpb25hbC5jbGFyaWZ5VGltZW91dEVycm9yID8gQXhpb3NFcnJvci5FVElNRURPVVQgOiBBeGlvc0Vycm9yLkVDT05OQUJPUlRFRCxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVxXG4gICAgICAgICkpO1xuICAgICAgICBhYm9ydCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgaWYgKHV0aWxzLmlzU3RyZWFtKGRhdGEpKSB7XG4gICAgICBsZXQgZW5kZWQgPSBmYWxzZTtcbiAgICAgIGxldCBlcnJvcmVkID0gZmFsc2U7XG5cbiAgICAgIGRhdGEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgZW5kZWQgPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIGRhdGEub25jZSgnZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgcmVxLmRlc3Ryb3koZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgaWYgKCFlbmRlZCAmJiAhZXJyb3JlZCkge1xuICAgICAgICAgIGFib3J0KG5ldyBDYW5jZWxlZEVycm9yKCdSZXF1ZXN0IHN0cmVhbSBoYXMgYmVlbiBhYm9ydGVkJywgY29uZmlnLCByZXEpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRhdGEucGlwZShyZXEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXEuZW5kKGRhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBfX3NldFByb3h5ID0gc2V0UHJveHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXRmb3JtLmlzU3RhbmRhcmRCcm93c2VyRW52ID9cblxuLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgY29uc3QgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCkgOlxuXG4vLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm0uaXNTdGFuZGFyZEJyb3dzZXJFbnYgP1xuXG4vLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3Rcbi8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIGNvbnN0IG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGNvbnN0IHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxldCBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgbGV0IGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLy4uL3V0aWxzLmpzJztcbmltcG9ydCBzZXR0bGUgZnJvbSAnLi8uLi9jb3JlL3NldHRsZS5qcyc7XG5pbXBvcnQgY29va2llcyBmcm9tICcuLy4uL2hlbHBlcnMvY29va2llcy5qcyc7XG5pbXBvcnQgYnVpbGRVUkwgZnJvbSAnLi8uLi9oZWxwZXJzL2J1aWxkVVJMLmpzJztcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gJy4uL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyc7XG5pbXBvcnQgaXNVUkxTYW1lT3JpZ2luIGZyb20gJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi4vaGVscGVycy9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCBzcGVlZG9tZXRlciBmcm9tICcuLi9oZWxwZXJzL3NwZWVkb21ldGVyLmpzJztcblxuZnVuY3Rpb24gcHJvZ3Jlc3NFdmVudFJlZHVjZXIobGlzdGVuZXIsIGlzRG93bmxvYWRTdHJlYW0pIHtcbiAgbGV0IGJ5dGVzTm90aWZpZWQgPSAwO1xuICBjb25zdCBfc3BlZWRvbWV0ZXIgPSBzcGVlZG9tZXRlcig1MCwgMjUwKTtcblxuICByZXR1cm4gZSA9PiB7XG4gICAgY29uc3QgbG9hZGVkID0gZS5sb2FkZWQ7XG4gICAgY29uc3QgdG90YWwgPSBlLmxlbmd0aENvbXB1dGFibGUgPyBlLnRvdGFsIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHByb2dyZXNzQnl0ZXMgPSBsb2FkZWQgLSBieXRlc05vdGlmaWVkO1xuICAgIGNvbnN0IHJhdGUgPSBfc3BlZWRvbWV0ZXIocHJvZ3Jlc3NCeXRlcyk7XG4gICAgY29uc3QgaW5SYW5nZSA9IGxvYWRlZCA8PSB0b3RhbDtcblxuICAgIGJ5dGVzTm90aWZpZWQgPSBsb2FkZWQ7XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgbG9hZGVkLFxuICAgICAgdG90YWwsXG4gICAgICBwcm9ncmVzczogdG90YWwgPyAobG9hZGVkIC8gdG90YWwpIDogdW5kZWZpbmVkLFxuICAgICAgYnl0ZXM6IHByb2dyZXNzQnl0ZXMsXG4gICAgICByYXRlOiByYXRlID8gcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGVzdGltYXRlZDogcmF0ZSAmJiB0b3RhbCAmJiBpblJhbmdlID8gKHRvdGFsIC0gbG9hZGVkKSAvIHJhdGUgOiB1bmRlZmluZWQsXG4gICAgICBldmVudDogZVxuICAgIH07XG5cbiAgICBkYXRhW2lzRG93bmxvYWRTdHJlYW0gPyAnZG93bmxvYWQnIDogJ3VwbG9hZCddID0gdHJ1ZTtcblxuICAgIGxpc3RlbmVyKGRhdGEpO1xuICB9O1xufVxuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGxldCByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oY29uZmlnLmhlYWRlcnMpLm5vcm1hbGl6ZSgpO1xuICAgIGNvbnN0IHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgbGV0IG9uQ2FuY2VsZWQ7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBpZiAocGxhdGZvcm0uaXNTdGFuZGFyZEJyb3dzZXJFbnYgfHwgcGxhdGZvcm0uaXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnMuc2V0Q29udGVudFR5cGUoZmFsc2UpOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0SGVhZGVycy5zZXRDb250ZW50VHlwZSgnbXVsdGlwYXJ0L2Zvcm0tZGF0YTsnLCBmYWxzZSk7IC8vIG1vYmlsZS9kZXNrdG9wIGFwcCBmcmFtZXdvcmtzXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICBjb25zdCBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcblxuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oXG4gICAgICAgICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgJiYgcmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgbGV0IHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dCA/ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcgOiAndGltZW91dCBleGNlZWRlZCc7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHBsYXRmb3JtLmlzU3RhbmRhcmRCcm93c2VyRW52KSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIGNvbnN0IHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpXG4gICAgICAgICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSAmJiBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKTtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVycy5zZXQoY29uZmlnLnhzcmZIZWFkZXJOYW1lLCB4c3JmVmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICByZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkICYmIHJlcXVlc3RIZWFkZXJzLnNldENvbnRlbnRUeXBlKG51bGwpO1xuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMudG9KU09OKCksIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50UmVkdWNlcihjb25maWcub25Eb3dubG9hZFByb2dyZXNzLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnRSZWR1Y2VyKGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgb25DYW5jZWxlZCA9IGNhbmNlbCA9PiB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZWplY3QoIWNhbmNlbCB8fCBjYW5jZWwudHlwZSA/IG5ldyBDYW5jZWxlZEVycm9yKG51bGwsIGNvbmZpZywgcmVxdWVzdCkgOiBjYW5jZWwpO1xuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfTtcblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuICYmIGNvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLmFib3J0ZWQgPyBvbkNhbmNlbGVkKCkgOiBjb25maWcuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKGZ1bGxQYXRoKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBwbGF0Zm9ybS5wcm90b2NvbHMuaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IGh0dHBBZGFwdGVyIGZyb20gJy4vaHR0cC5qcyc7XG5pbXBvcnQgeGhyQWRhcHRlciBmcm9tICcuL3hoci5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5cbmNvbnN0IGtub3duQWRhcHRlcnMgPSB7XG4gIGh0dHA6IGh0dHBBZGFwdGVyLFxuICB4aHI6IHhockFkYXB0ZXJcbn1cblxudXRpbHMuZm9yRWFjaChrbm93bkFkYXB0ZXJzLCAoZm4sIHZhbHVlKSA9PiB7XG4gIGlmKGZuKSB7XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ25hbWUnLCB7dmFsdWV9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnYWRhcHRlck5hbWUnLCB7dmFsdWV9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0QWRhcHRlcjogKGFkYXB0ZXJzKSA9PiB7XG4gICAgYWRhcHRlcnMgPSB1dGlscy5pc0FycmF5KGFkYXB0ZXJzKSA/IGFkYXB0ZXJzIDogW2FkYXB0ZXJzXTtcblxuICAgIGNvbnN0IHtsZW5ndGh9ID0gYWRhcHRlcnM7XG4gICAgbGV0IG5hbWVPckFkYXB0ZXI7XG4gICAgbGV0IGFkYXB0ZXI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBuYW1lT3JBZGFwdGVyID0gYWRhcHRlcnNbaV07XG4gICAgICBpZigoYWRhcHRlciA9IHV0aWxzLmlzU3RyaW5nKG5hbWVPckFkYXB0ZXIpID8ga25vd25BZGFwdGVyc1tuYW1lT3JBZGFwdGVyLnRvTG93ZXJDYXNlKCldIDogbmFtZU9yQWRhcHRlcikpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFhZGFwdGVyKSB7XG4gICAgICBpZiAoYWRhcHRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgYEFkYXB0ZXIgJHtuYW1lT3JBZGFwdGVyfSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBlbnZpcm9ubWVudGAsXG4gICAgICAgICAgJ0VSUl9OT1RfU1VQUE9SVCdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICB1dGlscy5oYXNPd25Qcm9wKGtub3duQWRhcHRlcnMsIG5hbWVPckFkYXB0ZXIpID9cbiAgICAgICAgICBgQWRhcHRlciAnJHtuYW1lT3JBZGFwdGVyfScgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnVpbGRgIDpcbiAgICAgICAgICBgVW5rbm93biBhZGFwdGVyICcke25hbWVPckFkYXB0ZXJ9J2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhZGFwdGVyIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXI7XG4gIH0sXG4gIGFkYXB0ZXJzOiBrbm93bkFkYXB0ZXJzXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0cmFuc2Zvcm1EYXRhIGZyb20gJy4vdHJhbnNmb3JtRGF0YS5qcyc7XG5pbXBvcnQgaXNDYW5jZWwgZnJvbSAnLi4vY2FuY2VsL2lzQ2FuY2VsLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCBhZGFwdGVycyBmcm9tIFwiLi4vYWRhcHRlcnMvYWRhcHRlcnMuanNcIjtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWxlZEVycm9yKG51bGwsIGNvbmZpZyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICBjb25maWcuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbmZpZy5oZWFkZXJzKTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIGlmIChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10uaW5kZXhPZihjb25maWcubWV0aG9kKSAhPT0gLTEpIHtcbiAgICBjb25maWcuaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJywgZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgYWRhcHRlciA9IGFkYXB0ZXJzLmdldEFkYXB0ZXIoY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcik7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICBjb25maWcsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UsXG4gICAgICByZXNwb25zZVxuICAgICk7XG5cbiAgICByZXNwb25zZS5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20ocmVzcG9uc2UuaGVhZGVycyk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20ocmVhc29uLnJlc3BvbnNlLmhlYWRlcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSBcIi4vQXhpb3NIZWFkZXJzLmpzXCI7XG5cbmNvbnN0IGhlYWRlcnNUb09iamVjdCA9ICh0aGluZykgPT4gdGhpbmcgaW5zdGFuY2VvZiBBeGlvc0hlYWRlcnMgPyB0aGluZy50b0pTT04oKSA6IHRoaW5nO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICBjb25zdCBjb25maWcgPSB7fTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSwgY2FzZWxlc3MpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlLmNhbGwoe2Nhc2VsZXNzfSwgdGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKGEsIGIsIGNhc2VsZXNzKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChiKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGEsIGIsIGNhc2VsZXNzKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSwgY2FzZWxlc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKGEsIGIpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBiKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihhLCBiKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChiKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYik7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBtZXJnZURpcmVjdEtleXMoYSwgYiwgcHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShhLCBiKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWVyZ2VNYXAgPSB7XG4gICAgdXJsOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIG1ldGhvZDogdmFsdWVGcm9tQ29uZmlnMixcbiAgICBkYXRhOiB2YWx1ZUZyb21Db25maWcyLFxuICAgIGJhc2VVUkw6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdHJhbnNmb3JtUmVxdWVzdDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0cmFuc2Zvcm1SZXNwb25zZTogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBwYXJhbXNTZXJpYWxpemVyOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRpbWVvdXQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdGltZW91dE1lc3NhZ2U6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgd2l0aENyZWRlbnRpYWxzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGFkYXB0ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgcmVzcG9uc2VUeXBlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHhzcmZDb29raWVOYW1lOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHhzcmZIZWFkZXJOYW1lOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgb25Eb3dubG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGRlY29tcHJlc3M6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Q29udGVudExlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBtYXhCb2R5TGVuZ3RoOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGJlZm9yZVJlZGlyZWN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zcG9ydDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBodHRwQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cHNBZ2VudDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBjYW5jZWxUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBzb2NrZXRQYXRoOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlRW5jb2Rpbmc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdmFsaWRhdGVTdGF0dXM6IG1lcmdlRGlyZWN0S2V5cyxcbiAgICBoZWFkZXJzOiAoYSwgYikgPT4gbWVyZ2VEZWVwUHJvcGVydGllcyhoZWFkZXJzVG9PYmplY3QoYSksIGhlYWRlcnNUb09iamVjdChiKSwgdHJ1ZSlcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZzEsIGNvbmZpZzIpKSwgZnVuY3Rpb24gY29tcHV0ZUNvbmZpZ1ZhbHVlKHByb3ApIHtcbiAgICBjb25zdCBtZXJnZSA9IG1lcmdlTWFwW3Byb3BdIHx8IG1lcmdlRGVlcFByb3BlcnRpZXM7XG4gICAgY29uc3QgY29uZmlnVmFsdWUgPSBtZXJnZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdLCBwcm9wKTtcbiAgICAodXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMpIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi4vZW52L2RhdGEuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcblxuY29uc3QgdmFsaWRhdG9ycyA9IHt9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuWydvYmplY3QnLCAnYm9vbGVhbicsICdudW1iZXInLCAnZnVuY3Rpb24nLCAnc3RyaW5nJywgJ3N5bWJvbCddLmZvckVhY2goKHR5cGUsIGkpID0+IHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbmNvbnN0IGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xuXG4vKipcbiAqIFRyYW5zaXRpb25hbCBvcHRpb24gdmFsaWRhdG9yXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuICh2YWx1ZSwgb3B0LCBvcHRzKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKG9wdCwgJyBoYXMgYmVlbiByZW1vdmVkJyArICh2ZXJzaW9uID8gJyBpbiAnICsgdmVyc2lvbiA6ICcnKSksXG4gICAgICAgIEF4aW9zRXJyb3IuRVJSX0RFUFJFQ0FURURcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0JywgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTl9WQUxVRSk7XG4gIH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIGNvbnN0IG9wdCA9IGtleXNbaV07XG4gICAgY29uc3QgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgYnVpbGRVUkwgZnJvbSAnLi4vaGVscGVycy9idWlsZFVSTC5qcyc7XG5pbXBvcnQgSW50ZXJjZXB0b3JNYW5hZ2VyIGZyb20gJy4vSW50ZXJjZXB0b3JNYW5hZ2VyLmpzJztcbmltcG9ydCBkaXNwYXRjaFJlcXVlc3QgZnJvbSAnLi9kaXNwYXRjaFJlcXVlc3QuanMnO1xuaW1wb3J0IG1lcmdlQ29uZmlnIGZyb20gJy4vbWVyZ2VDb25maWcuanMnO1xuaW1wb3J0IGJ1aWxkRnVsbFBhdGggZnJvbSAnLi9idWlsZEZ1bGxQYXRoLmpzJztcbmltcG9ydCB2YWxpZGF0b3IgZnJvbSAnLi4vaGVscGVycy92YWxpZGF0b3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuL0F4aW9zSGVhZGVycy5qcyc7XG5cbmNvbnN0IHZhbGlkYXRvcnMgPSB2YWxpZGF0b3IudmFsaWRhdG9ycztcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuY2xhc3MgQXhpb3Mge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZUNvbmZpZykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGNvbmZpZ09yVXJsIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAgICogQHBhcmFtIHs/T2JqZWN0fSBjb25maWdcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICAgKi9cbiAgcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICAgIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ09yVXJsIHx8IHt9O1xuICAgIH1cblxuICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBjb25zdCB7dHJhbnNpdGlvbmFsLCBwYXJhbXNTZXJpYWxpemVyLCBoZWFkZXJzfSA9IGNvbmZpZztcblxuICAgIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXNTZXJpYWxpemVyICE9IG51bGwpIHtcbiAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcmFtc1NlcmlhbGl6ZXIpKSB7XG4gICAgICAgIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyID0ge1xuICAgICAgICAgIHNlcmlhbGl6ZTogcGFyYW1zU2VyaWFsaXplclxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyhwYXJhbXNTZXJpYWxpemVyLCB7XG4gICAgICAgICAgZW5jb2RlOiB2YWxpZGF0b3JzLmZ1bmN0aW9uLFxuICAgICAgICAgIHNlcmlhbGl6ZTogdmFsaWRhdG9ycy5mdW5jdGlvblxuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICAgIGNvbmZpZy5tZXRob2QgPSAoY29uZmlnLm1ldGhvZCB8fCB0aGlzLmRlZmF1bHRzLm1ldGhvZCB8fCAnZ2V0JykudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBjb250ZXh0SGVhZGVycztcblxuICAgIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICAgIGNvbnRleHRIZWFkZXJzID0gaGVhZGVycyAmJiB1dGlscy5tZXJnZShcbiAgICAgIGhlYWRlcnMuY29tbW9uLFxuICAgICAgaGVhZGVyc1tjb25maWcubWV0aG9kXVxuICAgICk7XG5cbiAgICBjb250ZXh0SGVhZGVycyAmJiB1dGlscy5mb3JFYWNoKFxuICAgICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgICAobWV0aG9kKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBoZWFkZXJzW21ldGhvZF07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbmZpZy5oZWFkZXJzID0gQXhpb3NIZWFkZXJzLmNvbmNhdChjb250ZXh0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gICAgY29uc3QgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICBsZXQgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuXG4gICAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgbGV0IHByb21pc2U7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW47XG5cbiAgICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgICAgY29uc3QgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LmJpbmQodGhpcyksIHVuZGVmaW5lZF07XG4gICAgICBjaGFpbi51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgICBjaGFpbi5wdXNoLmFwcGx5KGNoYWluLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgbGVuID0gY2hhaW4ubGVuZ3RoO1xuXG4gICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW5baSsrXSwgY2hhaW5baSsrXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGxlbiA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIGxldCBuZXdDb25maWcgPSBjb25maWc7XG5cbiAgICBpID0gMDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBjb25zdCBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluW2krK107XG4gICAgICBjb25zdCBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW5baSsrXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBvblJlamVjdGVkLmNhbGwodGhpcywgZXJyb3IpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcHJvbWlzZSA9IGRpc3BhdGNoUmVxdWVzdC5jYWxsKHRoaXMsIG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgaSA9IDA7XG4gICAgbGVuID0gcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbltpKytdLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW5baSsrXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZXRVcmkoY29uZmlnKSB7XG4gICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgICBjb25zdCBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJldHVybiBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpO1xuICB9XG59XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSFRUUE1ldGhvZChpc0Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaHR0cE1ldGhvZCh1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzOiBpc0Zvcm0gPyB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICAgICAgICB9IDoge30sXG4gICAgICAgIHVybCxcbiAgICAgICAgZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH1cblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2QgKyAnRm9ybSddID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuL0NhbmNlbGVkRXJyb3IuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxUb2tlbn1cbiAqL1xuY2xhc3MgQ2FuY2VsVG9rZW4ge1xuICBjb25zdHJ1Y3RvcihleGVjdXRvcikge1xuICAgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb2x2ZVByb21pc2U7XG5cbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB0aGlzLnByb21pc2UudGhlbihjYW5jZWwgPT4ge1xuICAgICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICAgIGxldCBpID0gdG9rZW4uX2xpc3RlbmVycy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICAgIHRva2VuLl9saXN0ZW5lcnNbaV0oY2FuY2VsKTtcbiAgICAgIH1cbiAgICAgIHRva2VuLl9saXN0ZW5lcnMgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB0aGlzLnByb21pc2UudGhlbiA9IG9uZnVsZmlsbGVkID0+IHtcbiAgICAgIGxldCBfcmVzb2x2ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRva2VuLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgfSkudGhlbihvbmZ1bGZpbGxlZCk7XG5cbiAgICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCkge1xuICAgICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpO1xuICAgICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAgICovXG4gIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIHRoZSBjYW5jZWwgc2lnbmFsXG4gICAqL1xuXG4gIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmUgZnJvbSB0aGUgY2FuY2VsIHNpZ25hbFxuICAgKi9cblxuICB1bnN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gICAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gICAqL1xuICBzdGF0aWMgc291cmNlKCkge1xuICAgIGxldCBjYW5jZWw7XG4gICAgY29uc3QgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgICAgY2FuY2VsID0gYztcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW4sXG4gICAgICBjYW5jZWxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn1cbiIsImNvbnN0IEh0dHBTdGF0dXNDb2RlID0ge1xuICBDb250aW51ZTogMTAwLFxuICBTd2l0Y2hpbmdQcm90b2NvbHM6IDEwMSxcbiAgUHJvY2Vzc2luZzogMTAyLFxuICBFYXJseUhpbnRzOiAxMDMsXG4gIE9rOiAyMDAsXG4gIENyZWF0ZWQ6IDIwMSxcbiAgQWNjZXB0ZWQ6IDIwMixcbiAgTm9uQXV0aG9yaXRhdGl2ZUluZm9ybWF0aW9uOiAyMDMsXG4gIE5vQ29udGVudDogMjA0LFxuICBSZXNldENvbnRlbnQ6IDIwNSxcbiAgUGFydGlhbENvbnRlbnQ6IDIwNixcbiAgTXVsdGlTdGF0dXM6IDIwNyxcbiAgQWxyZWFkeVJlcG9ydGVkOiAyMDgsXG4gIEltVXNlZDogMjI2LFxuICBNdWx0aXBsZUNob2ljZXM6IDMwMCxcbiAgTW92ZWRQZXJtYW5lbnRseTogMzAxLFxuICBGb3VuZDogMzAyLFxuICBTZWVPdGhlcjogMzAzLFxuICBOb3RNb2RpZmllZDogMzA0LFxuICBVc2VQcm94eTogMzA1LFxuICBVbnVzZWQ6IDMwNixcbiAgVGVtcG9yYXJ5UmVkaXJlY3Q6IDMwNyxcbiAgUGVybWFuZW50UmVkaXJlY3Q6IDMwOCxcbiAgQmFkUmVxdWVzdDogNDAwLFxuICBVbmF1dGhvcml6ZWQ6IDQwMSxcbiAgUGF5bWVudFJlcXVpcmVkOiA0MDIsXG4gIEZvcmJpZGRlbjogNDAzLFxuICBOb3RGb3VuZDogNDA0LFxuICBNZXRob2ROb3RBbGxvd2VkOiA0MDUsXG4gIE5vdEFjY2VwdGFibGU6IDQwNixcbiAgUHJveHlBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA0MDcsXG4gIFJlcXVlc3RUaW1lb3V0OiA0MDgsXG4gIENvbmZsaWN0OiA0MDksXG4gIEdvbmU6IDQxMCxcbiAgTGVuZ3RoUmVxdWlyZWQ6IDQxMSxcbiAgUHJlY29uZGl0aW9uRmFpbGVkOiA0MTIsXG4gIFBheWxvYWRUb29MYXJnZTogNDEzLFxuICBVcmlUb29Mb25nOiA0MTQsXG4gIFVuc3VwcG9ydGVkTWVkaWFUeXBlOiA0MTUsXG4gIFJhbmdlTm90U2F0aXNmaWFibGU6IDQxNixcbiAgRXhwZWN0YXRpb25GYWlsZWQ6IDQxNyxcbiAgSW1BVGVhcG90OiA0MTgsXG4gIE1pc2RpcmVjdGVkUmVxdWVzdDogNDIxLFxuICBVbnByb2Nlc3NhYmxlRW50aXR5OiA0MjIsXG4gIExvY2tlZDogNDIzLFxuICBGYWlsZWREZXBlbmRlbmN5OiA0MjQsXG4gIFRvb0Vhcmx5OiA0MjUsXG4gIFVwZ3JhZGVSZXF1aXJlZDogNDI2LFxuICBQcmVjb25kaXRpb25SZXF1aXJlZDogNDI4LFxuICBUb29NYW55UmVxdWVzdHM6IDQyOSxcbiAgUmVxdWVzdEhlYWRlckZpZWxkc1Rvb0xhcmdlOiA0MzEsXG4gIFVuYXZhaWxhYmxlRm9yTGVnYWxSZWFzb25zOiA0NTEsXG4gIEludGVybmFsU2VydmVyRXJyb3I6IDUwMCxcbiAgTm90SW1wbGVtZW50ZWQ6IDUwMSxcbiAgQmFkR2F0ZXdheTogNTAyLFxuICBTZXJ2aWNlVW5hdmFpbGFibGU6IDUwMyxcbiAgR2F0ZXdheVRpbWVvdXQ6IDUwNCxcbiAgSHR0cFZlcnNpb25Ob3RTdXBwb3J0ZWQ6IDUwNSxcbiAgVmFyaWFudEFsc29OZWdvdGlhdGVzOiA1MDYsXG4gIEluc3VmZmljaWVudFN0b3JhZ2U6IDUwNyxcbiAgTG9vcERldGVjdGVkOiA1MDgsXG4gIE5vdEV4dGVuZGVkOiA1MTAsXG4gIE5ldHdvcmtBdXRoZW50aWNhdGlvblJlcXVpcmVkOiA1MTEsXG59O1xuXG5PYmplY3QuZW50cmllcyhIdHRwU3RhdHVzQ29kZSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gIEh0dHBTdGF0dXNDb2RlW3ZhbHVlXSA9IGtleTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIdHRwU3RhdHVzQ29kZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IGJpbmQgZnJvbSAnLi9oZWxwZXJzL2JpbmQuanMnO1xuaW1wb3J0IEF4aW9zIGZyb20gJy4vY29yZS9BeGlvcy5qcyc7XG5pbXBvcnQgbWVyZ2VDb25maWcgZnJvbSAnLi9jb3JlL21lcmdlQ29uZmlnLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzL2luZGV4LmpzJztcbmltcG9ydCBmb3JtRGF0YVRvSlNPTiBmcm9tICcuL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgQ2FuY2VsVG9rZW4gZnJvbSAnLi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMnO1xuaW1wb3J0IGlzQ2FuY2VsIGZyb20gJy4vY2FuY2VsL2lzQ2FuY2VsLmpzJztcbmltcG9ydCB7VkVSU0lPTn0gZnJvbSAnLi9lbnYvZGF0YS5qcyc7XG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgc3ByZWFkIGZyb20gJy4vaGVscGVycy9zcHJlYWQuanMnO1xuaW1wb3J0IGlzQXhpb3NFcnJvciBmcm9tICcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSBcIi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBIdHRwU3RhdHVzQ29kZSBmcm9tICcuL2hlbHBlcnMvSHR0cFN0YXR1c0NvZGUuanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKlxuICogQHJldHVybnMge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIGNvbnN0IGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQsIHthbGxPd25LZXlzOiB0cnVlfSk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCwgbnVsbCwge2FsbE93bktleXM6IHRydWV9KTtcblxuICAvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG4gIGluc3RhbmNlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICAgIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhkZWZhdWx0Q29uZmlnLCBpbnN0YW5jZUNvbmZpZykpO1xuICB9O1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5jb25zdCBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbGVkRXJyb3IgPSBDYW5jZWxlZEVycm9yO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSBDYW5jZWxUb2tlbjtcbmF4aW9zLmlzQ2FuY2VsID0gaXNDYW5jZWw7XG5heGlvcy5WRVJTSU9OID0gVkVSU0lPTjtcbmF4aW9zLnRvRm9ybURhdGEgPSB0b0Zvcm1EYXRhO1xuXG4vLyBFeHBvc2UgQXhpb3NFcnJvciBjbGFzc1xuYXhpb3MuQXhpb3NFcnJvciA9IEF4aW9zRXJyb3I7XG5cbi8vIGFsaWFzIGZvciBDYW5jZWxlZEVycm9yIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5heGlvcy5DYW5jZWwgPSBheGlvcy5DYW5jZWxlZEVycm9yO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuXG5heGlvcy5zcHJlYWQgPSBzcHJlYWQ7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IGlzQXhpb3NFcnJvcjtcblxuLy8gRXhwb3NlIG1lcmdlQ29uZmlnXG5heGlvcy5tZXJnZUNvbmZpZyA9IG1lcmdlQ29uZmlnO1xuXG5heGlvcy5BeGlvc0hlYWRlcnMgPSBBeGlvc0hlYWRlcnM7XG5cbmF4aW9zLmZvcm1Ub0pTT04gPSB0aGluZyA9PiBmb3JtRGF0YVRvSlNPTih1dGlscy5pc0hUTUxGb3JtKHRoaW5nKSA/IG5ldyBGb3JtRGF0YSh0aGluZykgOiB0aGluZyk7XG5cbmF4aW9zLkh0dHBTdGF0dXNDb2RlID0gSHR0cFN0YXR1c0NvZGU7XG5cbmF4aW9zLmRlZmF1bHQgPSBheGlvcztcblxuLy8gdGhpcyBtb2R1bGUgc2hvdWxkIG9ubHkgaGF2ZSBhIGRlZmF1bHQgZXhwb3J0XG5leHBvcnQgZGVmYXVsdCBheGlvc1xuIiwiZXhwb3J0IGNsYXNzIEJhc2VTcGVlZHtcbiAgICBcbn0iLCJpbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBCYXNlU3BlZWQgfSBmcm9tIFwiLi9iYXNlXCI7XG5pbXBvcnQgeyBNYW5hZ2VyU3BlZWQgfSBmcm9tIFwiLi9tYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBQaW5nU3BlZWQgZXh0ZW5kcyBCYXNlU3BlZWQge1xuICBpbnRlcjogYW55ID0gdW5kZWZpbmVkO1xuICBzdGFydFQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgLy93aGVuIHRoZSB0ZXN0IHdhcyBzdGFydGVkXG4gIHByZXZUOiBhbnkgPSBudWxsOyAvLyBsYXN0IHRpbWUgYSBwb25nIHdhcyByZWNlaXZlZFxuICBwaW5nID0gMC4wOyAvLyBjdXJyZW50IHBpbmcgdmFsdWVcbiAgaml0dGVyID0gMC4wOyAvLyBjdXJyZW50IGppdHRlciB2YWx1ZVxuICBpID0gMDsgLy8gY291bnRlciBvZiBwb25ncyByZWNlaXZlZFxuICBwcmV2SW5zdHNwZCA9IDA7IC8vIGxhc3QgcGluZyB0aW1lLCB1c2VkIGZvciBqaXR0ZXIgY2FsY3VsYXRpb25cbiAgcHJvZ3Jlc3MgPSAwO1xuICBzdGF0dXM6IGFueSA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBtYW5hZ2VyOiBNYW5hZ2VyU3BlZWQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzT25lKHVybCA9IFwiXCIpIHtcbiAgICBpZiAodGhpcy5wcm9ncmVzcyA8IDEpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5pIC8gdGhpcy5tYW5hZ2VyLnNldHRpbmdzLmNvdW50X3Bpbmc7XG4gICAgICAgIGF4aW9zXG4gICAgICAgICAgLmdldCh1cmwgKyBcInI9XCIgKyBNYXRoLnJhbmRvbSgpLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIC8vIFwiQ29udGVudC1FbmNvZGluZ1wiOiBcImlkZW50aXR5XCIsXG4gICAgICAgICAgICAgIC8vIFwiWC1SZXF1ZXN0ZWQtV2l0aFwiOiBcIlhNTEh0dHBSZXF1ZXN0XCIsXG4gICAgICAgICAgICAgIC8vIFwiQ2FjaGUtQ29udHJvbFwiOlxuICAgICAgICAgICAgICAvLyAgIFwibm8tY2FjaGUsbm8tc3RvcmUsbXVzdC1yZXZhbGlkYXRlLG1heC1hZ2U9LTEscHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAvLyBFeHBpcmVzOiBcIi0xXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaSA9PT0gMCkge1xuICAgICAgICAgICAgICB0aGlzLnByZXZUID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgaW5zdHNwZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5wcmV2VDtcbiAgICAgICAgICAgICAgaWYgKGluc3RzcGQgPCAxKSBpbnN0c3BkID0gdGhpcy5wcmV2SW5zdHNwZDtcbiAgICAgICAgICAgICAgaWYgKGluc3RzcGQgPCAxKSBpbnN0c3BkID0gMTtcbiAgICAgICAgICAgICAgbGV0IGluc3RqaXR0ZXIgPSBNYXRoLmFicyhpbnN0c3BkIC0gdGhpcy5wcmV2SW5zdHNwZCk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmkgPT09IDEpIHRoaXMucGluZyA9IGluc3RzcGQ7XG4gICAgICAgICAgICAgIC8qIGZpcnN0IHBpbmcsIGNhbid0IHRlbGwgaml0dGVyIHlldCovIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpbnN0c3BkIDwgdGhpcy5waW5nKSB0aGlzLnBpbmcgPSBpbnN0c3BkOyAvLyB1cGRhdGUgcGluZywgaWYgdGhlIGluc3RhbnQgcGluZyBpcyBsb3dlclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmkgPT09IDIpIHRoaXMuaml0dGVyID0gaW5zdGppdHRlcjtcbiAgICAgICAgICAgICAgICAvL2Rpc2NhcmQgdGhlIGZpcnN0IGppdHRlciBtZWFzdXJlbWVudCBiZWNhdXNlIGl0IG1pZ2h0IGJlIG11Y2ggaGlnaGVyIHRoYW4gaXQgc2hvdWxkIGJlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgdGhpcy5qaXR0ZXIgPVxuICAgICAgICAgICAgICAgICAgICBpbnN0aml0dGVyID4gdGhpcy5qaXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuaml0dGVyICogMC4zICsgaW5zdGppdHRlciAqIDAuN1xuICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5qaXR0ZXIgKiAwLjggKyBpbnN0aml0dGVyICogMC4yOyAvLyB1cGRhdGUgaml0dGVyLCB3ZWlnaHRlZCBhdmVyYWdlLiBzcGlrZXMgaW4gcGluZyB2YWx1ZXMgYXJlIGdpdmVuIG1vcmUgd2VpZ2h0LlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMucHJldkluc3RzcGQgPSBpbnN0c3BkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBpbmdTdGF0dXMgPSB0aGlzLnBpbmcudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGxldCBqaXR0ZXJTdGF0dXMgPSB0aGlzLmppdHRlci50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgdGhpcy5pKys7XG4gICAgICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy5tYW5hZ2VyLnNldHRpbmdzLmNvdW50X3BpbmcpIHtcbiAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLkFkZEluZm8oXCJwaW5nXCIsIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzOiB0aGlzLnByb2dyZXNzLFxuICAgICAgICAgICAgICAgIHBpbmc6IHBpbmdTdGF0dXMsXG4gICAgICAgICAgICAgICAgaml0dGVyOiBqaXR0ZXJTdGF0dXMsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NPbmUodXJsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAxO1xuICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuQWRkSW5mbyhcInBpbmdcIiwge1xuICAgICAgICAgICAgICAgIHByb2Nlc3M6IHRoaXMucHJvZ3Jlc3MsXG4gICAgICAgICAgICAgICAgcGluZzogcGluZ1N0YXR1cyxcbiAgICAgICAgICAgICAgICBqaXR0ZXI6IGppdHRlclN0YXR1cyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKF86IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pKys7XG4gICAgICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy5tYW5hZ2VyLnNldHRpbmdzLmNvdW50X3BpbmcpIHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzT25lKHVybCk7XG4gICAgICAgICAgICAgIHRoaXMubWFuYWdlci5BZGRJbmZvKFwicGluZ1wiLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgc3RhcnQoKSB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5waW5nID0gMDtcbiAgICB0aGlzLmppdHRlciA9IDA7XG4gICAgdGhpcy5zdGF0dXMgPSBcIlwiO1xuICAgIHRoaXMuaSA9IDA7XG4gICAgbGV0IHVybCA9XG4gICAgICB0aGlzLm1hbmFnZXIuc2VydmVyLnNlcnZlciArIFwiL1wiICsgdGhpcy5tYW5hZ2VyLnNlcnZlci5waW5nVVJMICsgXCI/XCI7XG4gICAgaWYgKHRoaXMubWFuYWdlci5zZXR0aW5ncy5tcG90KSB1cmwgKz0gXCJjb3JzPXRydWUmXCI7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3NPbmUodXJsKTtcbiAgICB9LCAyMDApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcmV2VCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0sIDIwMCk7XG4gIH1cbiAgcHVibGljIHN0b3AoKSB7fVxufVxuIiwiLy8gaW1wb3J0IHsgRG93bmxvYWRTcGVlZCB9IGZyb20gXCIuL2Rvd25sb2FkXCI7XG5pbXBvcnQgeyBQaW5nU3BlZWQgfSBmcm9tIFwiLi9waW5nXCI7XG4vLyBpbXBvcnQgeyBVcGxvYWRTcGVlZCB9IGZyb20gXCIuL3VwbG9hZFwiO1xuXG5leHBvcnQgY2xhc3MgTWFuYWdlclNwZWVkIHtcbiAgLy9odHRwczovL2ZyYS5zcGVlZHRlc3QuY2xvdXZpZGVyLm5ldC9iYWNrZW5kL1xuICBzZXJ2ZXIgPSB7XG4gICAgbmFtZTogXCJBbXN0ZXJkYW0sIE5ldGhlcmxhbmRzIChDbG91dmlkZXIpXCIsXG4gICAgc2VydmVyOiBcIi8vZnJhLnNwZWVkdGVzdC5jbG91dmlkZXIubmV0L2JhY2tlbmRcIixcbiAgICBpZDogNTEsXG4gICAgZGxVUkw6IFwiZ2FyYmFnZS5waHBcIixcbiAgICB1bFVSTDogXCJlbXB0eS5waHBcIixcbiAgICBwaW5nVVJMOiBcImVtcHR5LnBocFwiLFxuICAgIGdldElwVVJMOiBcImdldElQLnBocFwiLFxuICAgIHNwb25zb3JOYW1lOiBcIkNsb3V2aWRlclwiLFxuICAgIHNwb25zb3JVUkw6IFwiaHR0cHM6Ly93d3cuY2xvdXZpZGVyLmNvLnVrL1wiLFxuICB9O1xuICBzZXR0aW5ncyA9IHtcbiAgICBtcG90OiBmYWxzZSwgLy9zZXQgdG8gdHJ1ZSB3aGVuIGluIE1QT1QgbW9kZVxuICAgIHRlc3Rfb3JkZXI6IFwiSVBfRF9VXCIsIC8vb3JkZXIgaW4gd2hpY2ggdGVzdHMgd2lsbCBiZSBwZXJmb3JtZWQgYXMgYSBzdHJpbmcuIEQ9RG93bmxvYWQsIFU9VXBsb2FkLCBQPVBpbmcrSml0dGVyLCBJPUlQLCBfPTEgc2Vjb25kIGRlbGF5XG4gICAgdGltZV91bF9tYXg6IDE1LCAvLyBtYXggZHVyYXRpb24gb2YgdXBsb2FkIHRlc3QgaW4gc2Vjb25kc1xuICAgIHRpbWVfZGxfbWF4OiAxNSwgLy8gbWF4IGR1cmF0aW9uIG9mIGRvd25sb2FkIHRlc3QgaW4gc2Vjb25kc1xuICAgIHRpbWVfYXV0bzogdHJ1ZSwgLy8gaWYgc2V0IHRvIHRydWUsIHRlc3RzIHdpbGwgdGFrZSBsZXNzIHRpbWUgb24gZmFzdGVyIGNvbm5lY3Rpb25zXG4gICAgdGltZV91bEdyYWNlVGltZTogMS41LCAvL3RpbWUgdG8gd2FpdCBpbiBzZWNvbmRzIGJlZm9yZSBhY3R1YWxseSBtZWFzdXJpbmcgdWwgc3BlZWQgKHdhaXQgZm9yIGJ1ZmZlcnMgdG8gZmlsbClcbiAgICB0aW1lX2RsR3JhY2VUaW1lOiAxLjUsIC8vdGltZSB0byB3YWl0IGluIHNlY29uZHMgYmVmb3JlIGFjdHVhbGx5IG1lYXN1cmluZyBkbCBzcGVlZCAod2FpdCBmb3IgVENQIHdpbmRvdyB0byBpbmNyZWFzZSlcbiAgICBjb3VudF9waW5nOiAyMCwgLy8gbnVtYmVyIG9mIHBpbmdzIHRvIHBlcmZvcm0gaW4gcGluZyB0ZXN0XG4gICAgdXJsX2RsOiBcImdhcmJhZ2UucGhwXCIsIC8vIHBhdGggdG8gYSBsYXJnZSBmaWxlIG9yIGdhcmJhZ2UucGhwLCB1c2VkIGZvciBkb3dubG9hZCB0ZXN0LiBtdXN0IGJlIHJlbGF0aXZlIHRvIHRoaXMganMgZmlsZVxuICAgIHVybF91bDogXCJlbXB0eS5waHBcIiwgLy8gcGF0aCB0byBhbiBlbXB0eSBmaWxlLCB1c2VkIGZvciB1cGxvYWQgdGVzdC4gbXVzdCBiZSByZWxhdGl2ZSB0byB0aGlzIGpzIGZpbGVcbiAgICB1cmxfcGluZzogXCJlbXB0eS5waHBcIiwgLy8gcGF0aCB0byBhbiBlbXB0eSBmaWxlLCB1c2VkIGZvciBwaW5nIHRlc3QuIG11c3QgYmUgcmVsYXRpdmUgdG8gdGhpcyBqcyBmaWxlXG4gICAgdXJsX2dldElwOiBcImdldElQLnBocFwiLCAvLyBwYXRoIHRvIGdldElQLnBocCByZWxhdGl2ZSB0byB0aGlzIGpzIGZpbGUsIG9yIGEgc2ltaWxhciB0aGluZyB0aGF0IG91dHB1dHMgdGhlIGNsaWVudCdzIGlwXG4gICAgZ2V0SXBfaXNwSW5mbzogdHJ1ZSwgLy9pZiBzZXQgdG8gdHJ1ZSwgdGhlIHNlcnZlciB3aWxsIGluY2x1ZGUgSVNQIGluZm8gd2l0aCB0aGUgSVAgYWRkcmVzc1xuICAgIGdldElwX2lzcEluZm9fZGlzdGFuY2U6IFwia21cIiwgLy9rbSBvciBtaT1lc3RpbWF0ZSBkaXN0YW5jZSBmcm9tIHNlcnZlciBpbiBrbS9taTsgc2V0IHRvIGZhbHNlIHRvIGRpc2FibGUgZGlzdGFuY2UgZXN0aW1hdGlvbi4gZ2V0SXBfaXNwSW5mbyBtdXN0IGJlIGVuYWJsZWQgaW4gb3JkZXIgZm9yIHRoaXMgdG8gd29ya1xuICAgIHhocl9kbE11bHRpc3RyZWFtOiA2LCAvLyBudW1iZXIgb2YgZG93bmxvYWQgc3RyZWFtcyB0byB1c2UgKGNhbiBiZSBkaWZmZXJlbnQgaWYgZW5hYmxlX3F1aXJrcyBpcyBhY3RpdmUpXG4gICAgeGhyX3VsTXVsdGlzdHJlYW06IDMsIC8vIG51bWJlciBvZiB1cGxvYWQgc3RyZWFtcyB0byB1c2UgKGNhbiBiZSBkaWZmZXJlbnQgaWYgZW5hYmxlX3F1aXJrcyBpcyBhY3RpdmUpXG4gICAgeGhyX211bHRpc3RyZWFtRGVsYXk6IDMwMCwgLy9ob3cgbXVjaCBjb25jdXJyZW50IHJlcXVlc3RzIHNob3VsZCBiZSBkZWxheWVkXG4gICAgeGhyX2lnbm9yZUVycm9yczogMSwgLy8gMD1mYWlsIG9uIGVycm9ycywgMT1hdHRlbXB0IHRvIHJlc3RhcnQgYSBzdHJlYW0gaWYgaXQgZmFpbHMsIDI9aWdub3JlIGFsbCBlcnJvcnNcbiAgICB4aHJfZGxVc2VCbG9iOiBmYWxzZSwgLy8gaWYgc2V0IHRvIHRydWUsIGl0IHJlZHVjZXMgcmFtIHVzYWdlIGJ1dCB1c2VzIHRoZSBoYXJkIGRyaXZlICh1c2VmdWwgd2l0aCBsYXJnZSBnYXJiYWdlUGhwX2NodW5rU2l6ZSBhbmQvb3IgaGlnaCB4aHJfZGxNdWx0aXN0cmVhbSlcbiAgICB4aHJfdWxfYmxvYl9tZWdhYnl0ZXM6IDIwLCAvL3NpemUgaW4gbWVnYWJ5dGVzIG9mIHRoZSB1cGxvYWQgYmxvYnMgc2VudCBpbiB0aGUgdXBsb2FkIHRlc3QgKGZvcmNlZCB0byA0IG9uIGNocm9tZSBtb2JpbGUpXG4gICAgZ2FyYmFnZVBocF9jaHVua1NpemU6IDEwMCwgLy8gc2l6ZSBvZiBjaHVua3Mgc2VudCBieSBnYXJiYWdlLnBocCAoY2FuIGJlIGRpZmZlcmVudCBpZiBlbmFibGVfcXVpcmtzIGlzIGFjdGl2ZSlcbiAgICBlbmFibGVfcXVpcmtzOiB0cnVlLCAvLyBlbmFibGUgcXVpcmtzIGZvciBzcGVjaWZpYyBicm93c2Vycy4gY3VycmVudGx5IGl0IG92ZXJyaWRlcyBzZXR0aW5ncyB0byBvcHRpbWl6ZSBmb3Igc3BlY2lmaWMgYnJvd3NlcnMsIHVubGVzcyB0aGV5IGFyZSBhbHJlYWR5IGJlaW5nIG92ZXJyaWRkZW4gd2l0aCB0aGUgc3RhcnQgY29tbWFuZFxuICAgIHBpbmdfYWxsb3dQZXJmb3JtYW5jZUFwaTogdHJ1ZSwgLy8gaWYgZW5hYmxlZCwgdGhlIHBpbmcgdGVzdCB3aWxsIGF0dGVtcHQgdG8gY2FsY3VsYXRlIHRoZSBwaW5nIG1vcmUgcHJlY2lzZWx5IHVzaW5nIHRoZSBQZXJmb3JtYW5jZSBBUEkuIEN1cnJlbnRseSB3b3JrcyBwZXJmZWN0bHkgaW4gQ2hyb21lLCBiYWRseSBpbiBFZGdlLCBhbmQgbm90IGF0IGFsbCBpbiBGaXJlZm94LiBJZiBQZXJmb3JtYW5jZSBBUEkgaXMgbm90IHN1cHBvcnRlZCBvciB0aGUgcmVzdWx0IGlzIG9idmlvdXNseSB3cm9uZywgYSBmYWxsYmFjayBpcyBwcm92aWRlZC5cbiAgICBvdmVyaGVhZENvbXBlbnNhdGlvbkZhY3RvcjogMS4wNiwgLy9jYW4gYmUgY2hhbmdlZCB0byBjb21wZW5zYXRpZSBmb3IgdHJhbnNwb3J0IG92ZXJoZWFkLiAoc2VlIGRvYy5tZCBmb3Igc29tZSBvdGhlciB2YWx1ZXMpXG4gICAgdXNlTWViaWJpdHM6IGZhbHNlLCAvL2lmIHNldCB0byB0cnVlLCBzcGVlZCB3aWxsIGJlIHJlcG9ydGVkIGluIG1lYmliaXRzL3MgaW5zdGVhZCBvZiBtZWdhYml0cy9zXG4gICAgdGVsZW1ldHJ5X2xldmVsOiAwLCAvLyAwPWRpc2FibGVkLCAxPWJhc2ljIChyZXN1bHRzIG9ubHkpLCAyPWZ1bGwgKHJlc3VsdHMgYW5kIHRpbWluZykgMz1kZWJ1ZyAocmVzdWx0cytsb2cpXG4gICAgdXJsX3RlbGVtZXRyeTogXCJyZXN1bHRzL3RlbGVtZXRyeS5waHBcIiwgLy8gcGF0aCB0byB0aGUgc2NyaXB0IHRoYXQgYWRkcyB0ZWxlbWV0cnkgZGF0YSB0byB0aGUgZGF0YWJhc2VcbiAgICB0ZWxlbWV0cnlfZXh0cmE6IFwiXCIsIC8vZXh0cmEgZGF0YSB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIHRlbGVtZXRyeSB0aHJvdWdoIHRoZSBzZXR0aW5nc1xuICAgIGZvcmNlSUUxMVdvcmthcm91bmQ6IGZhbHNlLCAvL3doZW4gc2V0IHRvIHRydWUsIGl0IHdpbGwgZm9jZSB0aGUgSUUxMSB1cGxvYWQgdGVzdCBvbiBhbGwgYnJvd3NlcnMuIERlYnVnIG9ubHlcbiAgfTtcblxuICBhc3luYyBTdGFydCgpIHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAvLyBuZXcgRG93bmxvYWRTcGVlZCh0aGlzKS5zdGFydCgpLFxuICAgICAgLy8gbmV3IFVwbG9hZFNwZWVkKHRoaXMpLnN0YXJ0KCksXG4gICAgICBuZXcgUGluZ1NwZWVkKHRoaXMpLnN0YXJ0KCksXG4gICAgXSk7XG4gIH1cbiAgcHVibGljIEFkZEluZm8odHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyh0eXBlLCBkYXRhKTtcbiAgfVxufVxuIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IFwiLi9zcGVlZHRlc3Quc2Nzc1wiO1xuaW1wb3J0IHsgTWFuYWdlclNwZWVkIH0gZnJvbSBcIi4vc3BlZWQvbWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU3BlZWRUZXN0IHtcbiAgaW5zdCA9IG5ldyBNYW5hZ2VyU3BlZWQoKTtcbiAgc2VydmVycyA9IFtdO1xuICBhc3luYyBsb2FkU2VydmVyKCkge1xuICAgIHRoaXMuc2VydmVycyA9IGF3YWl0IGF4aW9zKFwiaHR0cHM6Ly9zcGVlZHRlc3QuaGF1Lnh5ei9zZXJ2ZXJzLmpzb25cIik7XG4gIH1cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbnN0LlN0YXJ0KCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJpc0J1ZmZlciIsImlzRnVuY3Rpb24iLCJpc1N0cmluZyIsIm5vb3AiLCJwcm90b3R5cGUiLCJTdHJlYW0iLCJyZXF1aXJlJCQwIiwidXRpbCIsInJlcXVpcmUkJDEiLCJEZWxheWVkU3RyZWFtIiwicmVxdWlyZSQkMiIsIkNvbWJpbmVkU3RyZWFtIiwiZGVmZXIiLCJhc3luYyIsImFib3J0IiwiaXRlcmF0ZSIsInRlcm1pbmF0b3IiLCJpbml0U3RhdGUiLCJzZXJpYWxPcmRlcmVkTW9kdWxlIiwic2VyaWFsT3JkZXJlZCIsInNlcmlhbE9yZGVyZWRfMSIsImFzeW5ja2l0IiwicG9wdWxhdGUiLCJodHRwIiwicmVxdWlyZSQkMyIsImh0dHBzIiwicmVxdWlyZSQkNCIsInBhcnNlVXJsIiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsIkZvcm1EYXRhIiwiUGxhdGZvcm1Gb3JtRGF0YSIsImVuY29kZSIsInVybCIsImRlYnVnIiwiVVJMIiwiZm9sbG93UmVkaXJlY3RzTW9kdWxlIiwiZm9sbG93UmVkaXJlY3RzIiwic3RyZWFtIiwiVGV4dEVuY29kZXIiLCJSZWFkYWJsZSIsInpsaWIiLCJnZXRQcm94eUZvclVybCIsIkV2ZW50RW1pdHRlciIsInZhbGlkYXRvcnMiLCJCYXNlU3BlZWQiLCJQaW5nU3BlZWQiLCJtYW5hZ2VyIiwiaW50ZXIiLCJ1bmRlZmluZWQiLCJzdGFydFQiLCJEYXRlIiwiZ2V0VGltZSIsInByZXZUIiwicGluZyIsImppdHRlciIsImkiLCJwcmV2SW5zdHNwZCIsInByb2dyZXNzIiwic3RhdHVzIiwiY29uc3RydWN0b3IiLCJwcm9jZXNzT25lIiwic2V0VGltZW91dCIsInNldHRpbmdzIiwiY291bnRfcGluZyIsImF4aW9zIiwiZ2V0IiwiTWF0aCIsInJhbmRvbSIsImhlYWRlcnMiLCJ0aGVuIiwiaW5zdHNwZCIsImluc3RqaXR0ZXIiLCJhYnMiLCJwaW5nU3RhdHVzIiwidG9GaXhlZCIsImppdHRlclN0YXR1cyIsIkFkZEluZm8iLCJwcm9jZXNzIiwiY2F0Y2giLCJfIiwic3RhcnQiLCJzZXJ2ZXIiLCJwaW5nVVJMIiwibXBvdCIsInN0b3AiLCJNYW5hZ2VyU3BlZWQiLCJuYW1lIiwiaWQiLCJkbFVSTCIsInVsVVJMIiwiZ2V0SXBVUkwiLCJzcG9uc29yTmFtZSIsInNwb25zb3JVUkwiLCJ0ZXN0X29yZGVyIiwidGltZV91bF9tYXgiLCJ0aW1lX2RsX21heCIsInRpbWVfYXV0byIsInRpbWVfdWxHcmFjZVRpbWUiLCJ0aW1lX2RsR3JhY2VUaW1lIiwidXJsX2RsIiwidXJsX3VsIiwidXJsX3BpbmciLCJ1cmxfZ2V0SXAiLCJnZXRJcF9pc3BJbmZvIiwiZ2V0SXBfaXNwSW5mb19kaXN0YW5jZSIsInhocl9kbE11bHRpc3RyZWFtIiwieGhyX3VsTXVsdGlzdHJlYW0iLCJ4aHJfbXVsdGlzdHJlYW1EZWxheSIsInhocl9pZ25vcmVFcnJvcnMiLCJ4aHJfZGxVc2VCbG9iIiwieGhyX3VsX2Jsb2JfbWVnYWJ5dGVzIiwiZ2FyYmFnZVBocF9jaHVua1NpemUiLCJlbmFibGVfcXVpcmtzIiwicGluZ19hbGxvd1BlcmZvcm1hbmNlQXBpIiwib3ZlcmhlYWRDb21wZW5zYXRpb25GYWN0b3IiLCJ1c2VNZWJpYml0cyIsInRlbGVtZXRyeV9sZXZlbCIsInVybF90ZWxlbWV0cnkiLCJ0ZWxlbWV0cnlfZXh0cmEiLCJmb3JjZUlFMTFXb3JrYXJvdW5kIiwiU3RhcnQiLCJQcm9taXNlIiwiYWxsIiwidHlwZSIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiU3BlZWRUZXN0IiwiaW5zdCIsInNlcnZlcnMiLCJsb2FkU2VydmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFFZSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0VBQzFDLEVBQUUsT0FBTyxTQUFTLElBQUksR0FBRztFQUN6QixJQUFJLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDeEMsR0FBRyxDQUFDO0VBQ0o7O0VDRkE7QUFDQTtFQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0VBQ3BDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDaEM7RUFDQSxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUk7RUFDbEMsSUFBSSxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3JDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztFQUN2RSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3hCO0VBQ0EsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEtBQUs7RUFDN0IsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQzVCLEVBQUUsT0FBTyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSTtFQUMxQyxFQUFDO0FBQ0Q7RUFDQSxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJ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QUssRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztFQUMxSyxFQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEM7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJQSxZQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssS0FBSztFQUM5QixFQUFFLElBQUksSUFBSSxDQUFDO0VBQ1gsRUFBRSxPQUFPLEtBQUs7RUFDZCxJQUFJLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxJQUFJLEtBQUssWUFBWSxRQUFRO0VBQ2hFLE1BQU1BLFlBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0VBQzlCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLFVBQVU7RUFDN0M7RUFDQSxTQUFTLElBQUksS0FBSyxRQUFRLElBQUlBLFlBQVUsQ0FBQyxLQUFL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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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RUFDMUMsRUFBRSxJQUFJLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7RUFDekMsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDcEM7RUFDQTtFQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDNUQsSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDaEQ7RUFDQTtFQUNBLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtFQUM1QyxRQUFRLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BFLE9BQU8sS0FBSztFQUNaLFFBQVEsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pGLE9BQU87QUFDUDtFQUNBO0VBQ0EsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssUUFBUSxFQUFFO0VBQ3JILFFBQVEsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQ0Es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Q0E7RUFDQSxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUU7RUFDN0IsRUFBRSxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0VBQzVELENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0VBQ3BDLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsQ0FBQztFQUN4QixFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRTtFQUN0RDtFQUNBLElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNsQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztFQUNsRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUMzQixDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtFQUMxQixFQUFFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDdEQsQ0FBQztBQUNEO0VBQ0EsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7RUFDN0UsRUFBRSxP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O0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7RUFDNUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDcEI7RUFDQSxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtFQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUU7RUFDckM7RUFDQSxRQUFRLEdBQUcsR0FBRyxVQUFVLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEQ7RUFDQSxRQUFRLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3RDLE9BQU8sTUFBTTtFQUNiLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUM7RUFDbkQsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDL0YsU0FBUyxFQUFFO0VBQ1g7RUFDQSxRQUFRLEdBQUcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEM7RUFDQSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtFQUM3QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU07RUFDcEU7RUFDQSxZQUFZLE9BQU8sS0FB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QUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixHQUFDLFNBQVM7RUFDVixH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QUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsRUFBRTtFQUNMLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtBQUcsR0FBRztFQUNOLEtB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
