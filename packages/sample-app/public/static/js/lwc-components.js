/* proxy-compat-disable */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function detect() {
  // Don't apply polyfill when ProxyCompat is enabled.
  if ('getKey' in Proxy) {
    return false;
  }

  const proxy = new Proxy([3, 4], {});
  const res = [1, 2].concat(proxy);
  return res.length !== 4;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const {
  isConcatSpreadable
} = Symbol;
const {
  isArray
} = Array;
const {
  slice: ArraySlice,
  unshift: ArrayUnshift,
  shift: ArrayShift
} = Array.prototype;

function isObject(O) {
  return typeof O === 'object' ? O !== null : typeof O === 'function';
} // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


function isSpreadable(O) {
  if (!isObject(O)) {
    return false;
  }

  const spreadable = O[isConcatSpreadable];
  return spreadable !== undefined ? Boolean(spreadable) : isArray(O);
} // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


function ArrayConcatPolyfill(..._args) {
  const O = Object(this);
  const A = [];
  let N = 0;
  const items = ArraySlice.call(arguments);
  ArrayUnshift.call(items, O);

  while (items.length) {
    const E = ArrayShift.call(items);

    if (isSpreadable(E)) {
      let k = 0;
      const length = E.length;

      for (k; k < length; k += 1, N += 1) {
        if (k in E) {
          const subElement = E[k];
          A[N] = subElement;
        }
      }
    } else {
      A[N] = E;
      N += 1;
    }
  }

  return A;
}

function apply() {
  // eslint-disable-next-line no-extend-native
  Array.prototype.concat = ArrayConcatPolyfill;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


if (detect()) {
  apply();
}
/**
 * Copyright (C) 2018 salesforce.com, inc.
 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function invariant(value, msg) {
  if (!value) {
    throw new Error(`Invariant Violation: ${msg}`);
  }
}

function isTrue(value, msg) {
  if (!value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}

function isFalse(value, msg) {
  if (value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}

function fail(msg) {
  throw new Error(msg);
}

var assert = /*#__PURE__*/Object.freeze({
  __proto__: null,
  invariant: invariant,
  isTrue: isTrue,
  isFalse: isFalse,
  fail: fail
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const {
  assign,
  create,
  defineProperties,
  defineProperty,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getPrototypeOf,
  hasOwnProperty,
  isFrozen,
  keys,
  seal,
  setPrototypeOf
} = Object;
const {
  filter: ArrayFilter,
  find: ArrayFind,
  indexOf: ArrayIndexOf,
  join: ArrayJoin,
  map: ArrayMap,
  push: ArrayPush,
  reduce: ArrayReduce,
  reverse: ArrayReverse,
  slice: ArraySlice$1,
  splice: ArraySplice,
  unshift: ArrayUnshift$1,
  forEach
} = Array.prototype;
const {
  charCodeAt: StringCharCodeAt,
  replace: StringReplace,
  slice: StringSlice,
  toLowerCase: StringToLowerCase
} = String.prototype;

function isUndefined(obj) {
  return obj === undefined;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * According to the following list, there are 48 aria attributes of which two (ariaDropEffect and
 * ariaGrabbed) are deprecated:
 * https://www.w3.org/TR/wai-aria-1.1/#x6-6-definitions-of-states-and-properties-all-aria-attributes
 *
 * The above list of 46 aria attributes is consistent with the following resources:
 * https://github.com/w3c/aria/pull/708/files#diff-eacf331f0ffc35d4b482f1d15a887d3bR11060
 * https://wicg.github.io/aom/spec/aria-reflection.html
 */

const AriaPropertyNames = ['ariaActiveDescendant', 'ariaAtomic', 'ariaAutoComplete', 'ariaBusy', 'ariaChecked', 'ariaColCount', 'ariaColIndex', 'ariaColSpan', 'ariaControls', 'ariaCurrent', 'ariaDescribedBy', 'ariaDetails', 'ariaDisabled', 'ariaErrorMessage', 'ariaExpanded', 'ariaFlowTo', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaKeyShortcuts', 'ariaLabel', 'ariaLabelledBy', 'ariaLevel', 'ariaLive', 'ariaModal', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaOwns', 'ariaPlaceholder', 'ariaPosInSet', 'ariaPressed', 'ariaReadOnly', 'ariaRelevant', 'ariaRequired', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaSelected', 'ariaSetSize', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'role'];
const AttrNameToPropNameMap = create(null);
const PropNameToAttrNameMap = create(null); // Synthetic creation of all AOM property descriptors for Custom Elements

forEach.call(AriaPropertyNames, propName => {
  // Typescript infers the wrong function type for this particular overloaded method:
  // https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch
  const attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, 'aria-'));
  AttrNameToPropNameMap[attrName] = propName;
  PropNameToAttrNameMap[propName] = attrName;
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Inspired from: https://mathiasbynens.be/notes/globalthis

const _globalThis = function () {
  // On recent browsers, `globalThis` is already defined. In this case return it directly.
  if (typeof globalThis === 'object') {
    return globalThis;
  }

  let _globalThis;

  try {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true
    }); // __magic__ is undefined in Safari 10 and IE10 and older.
    // @ts-ignore
    // eslint-disable-next-line no-undef

    _globalThis = __magic__; // @ts-ignore

    delete Object.prototype.__magic__;
  } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
  } finally {
    // If the magic above fails for some reason we assume that we are in a legacy browser.
    // Assume `window` exists in this case.
    if (typeof _globalThis === 'undefined') {
      // @ts-ignore
      _globalThis = window;
    }
  }

  return _globalThis;
}();
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * In IE11, symbols are expensive.
 * Due to the nature of the symbol polyfill. This method abstract the
 * creation of symbols, so we can fallback to string when native symbols
 * are not supported. Note that we can't use typeof since it will fail when transpiling.
 */


const hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';

function createHiddenField(key, namespace) {
  return hasNativeSymbolsSupport ? Symbol(key) : `$$lwc-${namespace}-${key}$$`;
}

const hiddenFieldsMap = new WeakMap();

function getHiddenField(o, field) {
  const valuesByField = hiddenFieldsMap.get(o);

  if (!isUndefined(valuesByField)) {
    return valuesByField[field];
  }
}

const HTML_ATTRIBUTES_TO_PROPERTY = {
  accesskey: 'accessKey',
  readonly: 'readOnly',
  tabindex: 'tabIndex',
  bgcolor: 'bgColor',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  formaction: 'formAction',
  ismap: 'isMap',
  maxlength: 'maxLength',
  minlength: 'minLength',
  novalidate: 'noValidate',
  usemap: 'useMap',
  for: 'htmlFor'
};
keys(HTML_ATTRIBUTES_TO_PROPERTY).forEach(attrName => {});
/** version: 1.9.1 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function detect$1(propName) {
  return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const nodeToAriaPropertyValuesMap = new WeakMap();

function getAriaPropertyMap(elm) {
  let map = nodeToAriaPropertyValuesMap.get(elm);

  if (map === undefined) {
    map = {};
    nodeToAriaPropertyValuesMap.set(elm, map);
  }

  return map;
}

function getNormalizedAriaPropertyValue(value) {
  return value == null ? null : String(value);
}

function createAriaPropertyPropertyDescriptor(propName, attrName) {
  return {
    get() {
      const map = getAriaPropertyMap(this);

      if (hasOwnProperty.call(map, propName)) {
        return map[propName];
      } // otherwise just reflect what's in the attribute


      return this.hasAttribute(attrName) ? this.getAttribute(attrName) : null;
    },

    set(newValue) {
      const normalizedValue = getNormalizedAriaPropertyValue(newValue);
      const map = getAriaPropertyMap(this);
      map[propName] = normalizedValue; // reflect into the corresponding attribute

      if (newValue === null) {
        this.removeAttribute(attrName);
      } else {
        this.setAttribute(attrName, newValue);
      }
    },

    configurable: true,
    enumerable: true
  };
}

function patch(propName) {
  // Typescript is inferring the wrong function type for this particular
  // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch
  const attrName = PropNameToAttrNameMap[propName];
  const descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
  Object.defineProperty(Element.prototype, propName, descriptor);
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const ElementPrototypeAriaPropertyNames = keys(PropNameToAttrNameMap);

for (let i = 0, len = ElementPrototypeAriaPropertyNames.length; i < len; i += 1) {
  const propName = ElementPrototypeAriaPropertyNames[i];

  if (detect$1(propName)) {
    patch(propName);
  }
}
/* proxy-compat-disable */

/**
 * Copyright (C) 2018 salesforce.com, inc.
 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function invariant$1(value, msg) {
  if (!value) {
    throw new Error(`Invariant Violation: ${msg}`);
  }
}

function isTrue$1(value, msg) {
  if (!value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}

function isFalse$2(value, msg) {
  if (value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}

function fail$1(msg) {
  throw new Error(msg);
}

var assert$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  invariant: invariant$1,
  isTrue: isTrue$1,
  isFalse: isFalse$2,
  fail: fail$1
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const {
  assign: assign$1,
  create: create$1,
  defineProperties: defineProperties$1,
  defineProperty: defineProperty$1,
  freeze: freeze$1,
  getOwnPropertyDescriptor: getOwnPropertyDescriptor$1,
  getOwnPropertyNames: getOwnPropertyNames$1,
  getPrototypeOf: getPrototypeOf$1,
  hasOwnProperty: hasOwnProperty$1,
  isFrozen: isFrozen$1,
  keys: keys$1,
  seal: seal$1,
  setPrototypeOf: setPrototypeOf$1
} = Object;
const {
  isArray: isArray$2
} = Array;
const {
  filter: ArrayFilter$1,
  find: ArrayFind$1,
  indexOf: ArrayIndexOf$1,
  join: ArrayJoin$1,
  map: ArrayMap$1,
  push: ArrayPush$1,
  reduce: ArrayReduce$1,
  reverse: ArrayReverse$1,
  slice: ArraySlice$2,
  splice: ArraySplice$1,
  unshift: ArrayUnshift$2,
  forEach: forEach$1
} = Array.prototype;
const {
  charCodeAt: StringCharCodeAt$1,
  replace: StringReplace$1,
  slice: StringSlice$1,
  toLowerCase: StringToLowerCase$1
} = String.prototype;

function isUndefined$1(obj) {
  return obj === undefined;
}

function isNull$1(obj) {
  return obj === null;
}

function isTrue$1$1(obj) {
  return obj === true;
}

function isFalse$1$1(obj) {
  return obj === false;
}

function isFunction$1(obj) {
  return typeof obj === 'function';
}

function isObject$2(obj) {
  return typeof obj === 'object';
}

function isString(obj) {
  return typeof obj === 'string';
}

function isNumber(obj) {
  return typeof obj === 'number';
}

const OtS$1 = {}.toString;

function toString$1(obj) {
  if (obj && obj.toString) {
    // Arrays might hold objects with "null" prototype So using
    // Array.prototype.toString directly will cause an error Iterate through
    // all the items and handle individually.
    if (isArray$2(obj)) {
      return ArrayJoin$1.call(ArrayMap$1.call(obj, toString$1), ',');
    }

    return obj.toString();
  } else if (typeof obj === 'object') {
    return OtS$1.call(obj);
  } else {
    return obj + emptyString$1;
  }
}

function getPropertyDescriptor(o, p) {
  do {
    const d = getOwnPropertyDescriptor$1(o, p);

    if (!isUndefined$1(d)) {
      return d;
    }

    o = getPrototypeOf$1(o);
  } while (o !== null);
}

const emptyString$1 = '';
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * According to the following list, there are 48 aria attributes of which two (ariaDropEffect and
 * ariaGrabbed) are deprecated:
 * https://www.w3.org/TR/wai-aria-1.1/#x6-6-definitions-of-states-and-properties-all-aria-attributes
 *
 * The above list of 46 aria attributes is consistent with the following resources:
 * https://github.com/w3c/aria/pull/708/files#diff-eacf331f0ffc35d4b482f1d15a887d3bR11060
 * https://wicg.github.io/aom/spec/aria-reflection.html
 */

const AriaPropertyNames$1 = ['ariaActiveDescendant', 'ariaAtomic', 'ariaAutoComplete', 'ariaBusy', 'ariaChecked', 'ariaColCount', 'ariaColIndex', 'ariaColSpan', 'ariaControls', 'ariaCurrent', 'ariaDescribedBy', 'ariaDetails', 'ariaDisabled', 'ariaErrorMessage', 'ariaExpanded', 'ariaFlowTo', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaKeyShortcuts', 'ariaLabel', 'ariaLabelledBy', 'ariaLevel', 'ariaLive', 'ariaModal', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaOwns', 'ariaPlaceholder', 'ariaPosInSet', 'ariaPressed', 'ariaReadOnly', 'ariaRelevant', 'ariaRequired', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaSelected', 'ariaSetSize', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'role'];
const AttrNameToPropNameMap$1 = create$1(null);
const PropNameToAttrNameMap$1 = create$1(null); // Synthetic creation of all AOM property descriptors for Custom Elements

forEach$1.call(AriaPropertyNames$1, propName => {
  // Typescript infers the wrong function type for this particular overloaded method:
  // https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch
  const attrName = StringToLowerCase$1.call(StringReplace$1.call(propName, /^aria/, 'aria-'));
  AttrNameToPropNameMap$1[attrName] = propName;
  PropNameToAttrNameMap$1[propName] = attrName;
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Inspired from: https://mathiasbynens.be/notes/globalthis

const _globalThis$1 = function () {
  // On recent browsers, `globalThis` is already defined. In this case return it directly.
  if (typeof globalThis === 'object') {
    return globalThis;
  }

  let _globalThis;

  try {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true
    }); // __magic__ is undefined in Safari 10 and IE10 and older.
    // @ts-ignore
    // eslint-disable-next-line no-undef

    _globalThis = __magic__; // @ts-ignore

    delete Object.prototype.__magic__;
  } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
  } finally {
    // If the magic above fails for some reason we assume that we are in a legacy browser.
    // Assume `window` exists in this case.
    if (typeof _globalThis === 'undefined') {
      // @ts-ignore
      _globalThis = window;
    }
  }

  return _globalThis;
}();
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * In IE11, symbols are expensive.
 * Due to the nature of the symbol polyfill. This method abstract the
 * creation of symbols, so we can fallback to string when native symbols
 * are not supported. Note that we can't use typeof since it will fail when transpiling.
 */


const hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';

function createHiddenField$1(key, namespace) {
  return hasNativeSymbolsSupport$1 ? Symbol(key) : `$$lwc-${namespace}-${key}$$`;
}

const hiddenFieldsMap$1 = new WeakMap();

function setHiddenField$1(o, field, value) {
  let valuesByField = hiddenFieldsMap$1.get(o);

  if (isUndefined$1(valuesByField)) {
    valuesByField = create$1(null);
    hiddenFieldsMap$1.set(o, valuesByField);
  }

  valuesByField[field] = value;
}

function getHiddenField$1(o, field) {
  const valuesByField = hiddenFieldsMap$1.get(o);

  if (!isUndefined$1(valuesByField)) {
    return valuesByField[field];
  }
}

const HTML_ATTRIBUTES_TO_PROPERTY$1 = {
  accesskey: 'accessKey',
  readonly: 'readOnly',
  tabindex: 'tabIndex',
  bgcolor: 'bgColor',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  formaction: 'formAction',
  ismap: 'isMap',
  maxlength: 'maxLength',
  minlength: 'minLength',
  novalidate: 'noValidate',
  usemap: 'useMap',
  for: 'htmlFor'
};
keys$1(HTML_ATTRIBUTES_TO_PROPERTY$1).forEach(attrName => {});
/** version: 1.9.1 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

let nextTickCallbackQueue = [];
const SPACE_CHAR = 32;
const EmptyObject = seal$1(create$1(null));
const EmptyArray = seal$1([]);

function flushCallbackQueue() {
  {
    if (nextTickCallbackQueue.length === 0) {
      throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
    }
  }

  const callbacks = nextTickCallbackQueue;
  nextTickCallbackQueue = []; // reset to a new queue

  for (let i = 0, len = callbacks.length; i < len; i += 1) {
    callbacks[i]();
  }
}

function addCallbackToNextTick(callback) {
  {
    if (!isFunction$1(callback)) {
      throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
    }
  }

  if (nextTickCallbackQueue.length === 0) {
    Promise.resolve().then(flushCallbackQueue);
  }

  ArrayPush$1.call(nextTickCallbackQueue, callback);
}
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const {
  create: create$1$1
} = Object;
const {
  splice: ArraySplice$1$1,
  indexOf: ArrayIndexOf$1$1,
  push: ArrayPush$1$1
} = Array.prototype;
const TargetToReactiveRecordMap = new WeakMap();

function isUndefined$1$1(obj) {
  return obj === undefined;
}

function getReactiveRecord(target) {
  let reactiveRecord = TargetToReactiveRecordMap.get(target);

  if (isUndefined$1$1(reactiveRecord)) {
    const newRecord = create$1$1(null);
    reactiveRecord = newRecord;
    TargetToReactiveRecordMap.set(target, newRecord);
  }

  return reactiveRecord;
}

let currentReactiveObserver = null;

function valueMutated(target, key) {
  const reactiveRecord = TargetToReactiveRecordMap.get(target);

  if (!isUndefined$1$1(reactiveRecord)) {
    const reactiveObservers = reactiveRecord[key];

    if (!isUndefined$1$1(reactiveObservers)) {
      for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
        const ro = reactiveObservers[i];
        ro.notify();
      }
    }
  }
}

function valueObserved(target, key) {
  // We should determine if an active Observing Record is present to track mutations.
  if (currentReactiveObserver === null) {
    return;
  }

  const ro = currentReactiveObserver;
  const reactiveRecord = getReactiveRecord(target);
  let reactiveObservers = reactiveRecord[key];

  if (isUndefined$1$1(reactiveObservers)) {
    reactiveObservers = [];
    reactiveRecord[key] = reactiveObservers;
  } else if (reactiveObservers[0] === ro) {
    return; // perf optimization considering that most subscriptions will come from the same record
  }

  if (ArrayIndexOf$1$1.call(reactiveObservers, ro) === -1) {
    ro.link(reactiveObservers);
  }
}

class ReactiveObserver {
  constructor(callback) {
    this.listeners = [];
    this.callback = callback;
  }

  observe(job) {
    const inceptionReactiveRecord = currentReactiveObserver;
    currentReactiveObserver = this;
    let error;

    try {
      job();
    } catch (e) {
      error = Object(e);
    } finally {
      currentReactiveObserver = inceptionReactiveRecord;

      if (error !== undefined) {
        throw error; // eslint-disable-line no-unsafe-finally
      }
    }
  }
  /**
   * This method is responsible for disconnecting the Reactive Observer
   * from any Reactive Record that has a reference to it, to prevent future
   * notifications about previously recorded access.
   */


  reset() {
    const {
      listeners
    } = this;
    const len = listeners.length;

    if (len > 0) {
      for (let i = 0; i < len; i += 1) {
        const set = listeners[i];
        const pos = ArrayIndexOf$1$1.call(listeners[i], this);
        ArraySplice$1$1.call(set, pos, 1);
      }

      listeners.length = 0;
    }
  } // friend methods


  notify() {
    this.callback.call(undefined, this);
  }

  link(reactiveObservers) {
    ArrayPush$1$1.call(reactiveObservers, this); // we keep track of observing records where the observing record was added to so we can do some clean up later on

    ArrayPush$1$1.call(this.listeners, reactiveObservers);
  }

}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function componentValueMutated(vm, key) {
  valueMutated(vm.component, key);
}

function componentValueObserved(vm, key) {
  valueObserved(vm.component, key);
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function getComponentTag(vm) {
  return `<${StringToLowerCase$1.call(vm.tagName)}>`;
} // TODO [#1695]: Unify getComponentStack and getErrorComponentStack


function getComponentStack(vm) {
  const stack = [];
  let prefix = '';

  while (!isNull$1(vm.owner)) {
    ArrayPush$1.call(stack, prefix + getComponentTag(vm));
    vm = vm.owner;
    prefix += '\t';
  }

  return ArrayJoin$1.call(stack, '\n');
}

function getErrorComponentStack(vm) {
  const wcStack = [];
  let currentVm = vm;

  while (!isNull$1(currentVm)) {
    ArrayPush$1.call(wcStack, getComponentTag(currentVm));
    currentVm = currentVm.owner;
  }

  return wcStack.reverse().join('\n\t');
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function logError(message, vm) {
  let msg = `[LWC error]: ${message}`;

  if (!isUndefined$1(vm)) {
    msg = `${msg}\n${getComponentStack(vm)}`;
  }

  try {
    throw new Error(msg);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function handleEvent(event, vnode) {
  const {
    type
  } = event;
  const {
    data: {
      on
    }
  } = vnode;
  const handler = on && on[type]; // call event handler if exists

  if (handler) {
    handler.call(undefined, event);
  }
}

function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  };
}

function updateAllEventListeners(oldVnode, vnode) {
  if (isUndefined$1(oldVnode.listener)) {
    createAllEventListeners(vnode);
  } else {
    vnode.listener = oldVnode.listener;
    vnode.listener.vnode = vnode;
  }
}

function createAllEventListeners(vnode) {
  const {
    elm,
    data: {
      on
    },
    owner: {
      renderer
    }
  } = vnode;

  if (isUndefined$1(on)) {
    return;
  }

  const listener = vnode.listener = createListener();
  listener.vnode = vnode;
  let name;

  for (name in on) {
    renderer.addEventListener(elm, name, listener);
  }
}

var modEvents = {
  update: updateAllEventListeners,
  create: createAllEventListeners
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const defaultDefHTMLPropertyNames = ['accessKey', 'dir', 'draggable', 'hidden', 'id', 'lang', 'spellcheck', 'tabIndex', 'title']; // Few more exceptions that are using the attribute name to match the property in lowercase.
// this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
// and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
// Note: this list most be in sync with the compiler as well.

const HTMLPropertyNamesWithLowercasedReflectiveAttributes = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];

function offsetPropertyErrorMessage(name) {
  return `Using the \`${name}\` property is an anti-pattern because it rounds the value to an integer. Instead, use the \`getBoundingClientRect\` method to obtain fractional values for the size of an element and its position relative to the viewport.`;
} // Global HTML Attributes & Properties
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement


const globalHTMLProperties = assign$1(create$1(null), {
  accessKey: {
    attribute: 'accesskey'
  },
  accessKeyLabel: {
    readOnly: true
  },
  className: {
    attribute: 'class',
    error: 'Using the `className` property is an anti-pattern because of slow runtime behavior and potential conflicts with classes provided by the owner element. Use the `classList` API instead.'
  },
  contentEditable: {
    attribute: 'contenteditable'
  },
  dataset: {
    readOnly: true,
    error: "Using the `dataset` property is an anti-pattern because it can't be statically analyzed. Expose each property individually using the `@api` decorator instead."
  },
  dir: {
    attribute: 'dir'
  },
  draggable: {
    attribute: 'draggable'
  },
  dropzone: {
    attribute: 'dropzone',
    readOnly: true
  },
  hidden: {
    attribute: 'hidden'
  },
  id: {
    attribute: 'id'
  },
  inputMode: {
    attribute: 'inputmode'
  },
  lang: {
    attribute: 'lang'
  },
  slot: {
    attribute: 'slot',
    error: 'Using the `slot` property is an anti-pattern.'
  },
  spellcheck: {
    attribute: 'spellcheck'
  },
  style: {
    attribute: 'style'
  },
  tabIndex: {
    attribute: 'tabindex'
  },
  title: {
    attribute: 'title'
  },
  translate: {
    attribute: 'translate'
  },
  // additional "global attributes" that are not present in the link above.
  isContentEditable: {
    readOnly: true
  },
  offsetHeight: {
    readOnly: true,
    error: offsetPropertyErrorMessage('offsetHeight')
  },
  offsetLeft: {
    readOnly: true,
    error: offsetPropertyErrorMessage('offsetLeft')
  },
  offsetParent: {
    readOnly: true
  },
  offsetTop: {
    readOnly: true,
    error: offsetPropertyErrorMessage('offsetTop')
  },
  offsetWidth: {
    readOnly: true,
    error: offsetPropertyErrorMessage('offsetWidth')
  },
  role: {
    attribute: 'role'
  }
});
const AttrNameToPropNameMap$1$1 = assign$1(create$1(null), AttrNameToPropNameMap$1);
const PropNameToAttrNameMap$1$1 = assign$1(create$1(null), PropNameToAttrNameMap$1);
forEach$1.call(defaultDefHTMLPropertyNames, propName => {
  const attrName = StringToLowerCase$1.call(propName);
  AttrNameToPropNameMap$1$1[attrName] = propName;
  PropNameToAttrNameMap$1$1[propName] = attrName;
});
forEach$1.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, propName => {
  const attrName = StringToLowerCase$1.call(propName);
  AttrNameToPropNameMap$1$1[attrName] = propName;
  PropNameToAttrNameMap$1$1[propName] = attrName;
});
const CAPS_REGEX = /[A-Z]/g;
/**
 * This method maps between property names
 * and the corresponding attribute name.
 */

function getAttrNameFromPropName(propName) {
  if (isUndefined$1(PropNameToAttrNameMap$1$1[propName])) {
    PropNameToAttrNameMap$1$1[propName] = StringReplace$1.call(propName, CAPS_REGEX, match => '-' + match.toLowerCase());
  }

  return PropNameToAttrNameMap$1$1[propName];
}

let controlledElement = null;
let controlledAttributeName;

function isAttributeLocked(elm, attrName) {
  return elm !== controlledElement || attrName !== controlledAttributeName;
}

function lockAttribute(_elm, _key) {
  controlledElement = null;
  controlledAttributeName = undefined;
}

function unlockAttribute(elm, key) {
  controlledElement = elm;
  controlledAttributeName = key;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const ColonCharCode = 58;

function updateAttrs(oldVnode, vnode) {
  const {
    data: {
      attrs
    },
    owner: {
      renderer
    }
  } = vnode;

  if (isUndefined$1(attrs)) {
    return;
  }

  let {
    data: {
      attrs: oldAttrs
    }
  } = oldVnode;

  if (oldAttrs === attrs) {
    return;
  }

  {
    assert$1.invariant(isUndefined$1(oldAttrs) || keys$1(oldAttrs).join(',') === keys$1(attrs).join(','), `vnode.data.attrs cannot change shape.`);
  }

  const elm = vnode.elm;
  const {
    setAttribute,
    removeAttribute
  } = renderer;
  let key;
  oldAttrs = isUndefined$1(oldAttrs) ? EmptyObject : oldAttrs; // update modified attributes, add new attributes
  // this routine is only useful for data-* attributes in all kind of elements
  // and aria-* in standard elements (custom elements will use props for these)

  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];

    if (old !== cur) {
      unlockAttribute(elm, key);

      if (StringCharCodeAt$1.call(key, 3) === ColonCharCode) {
        // Assume xml namespace
        setAttribute(elm, key, cur, xmlNS);
      } else if (StringCharCodeAt$1.call(key, 5) === ColonCharCode) {
        // Assume xlink namespace
        setAttribute(elm, key, cur, xlinkNS);
      } else if (isNull$1(cur)) {
        removeAttribute(elm, key);
      } else {
        setAttribute(elm, key, cur);
      }

      lockAttribute();
    }
  }
}

const emptyVNode = {
  data: {}
};
var modAttrs = {
  create: vnode => updateAttrs(emptyVNode, vnode),
  update: updateAttrs
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function isLiveBindingProp(sel, key) {
  // For properties with live bindings, we read values from the DOM element
  // instead of relying on internally tracked values.
  return sel === 'input' && (key === 'value' || key === 'checked');
}

function update(oldVnode, vnode) {
  const props = vnode.data.props;

  if (isUndefined$1(props)) {
    return;
  }

  const oldProps = oldVnode.data.props;

  if (oldProps === props) {
    return;
  }

  {
    assert$1.invariant(isUndefined$1(oldProps) || keys$1(oldProps).join(',') === keys$1(props).join(','), 'vnode.data.props cannot change shape.');
  }

  const isFirstPatch = isUndefined$1(oldProps);
  const {
    elm,
    sel,
    owner: {
      renderer
    }
  } = vnode;

  for (const key in props) {
    const cur = props[key]; // if it is the first time this element is patched, or the current value is different to the previous value...

    if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? renderer.getProperty(elm, key) : oldProps[key])) {
      renderer.setProperty(elm, key, cur);
    }
  }
}

const emptyVNode$1 = {
  data: {}
};
var modProps = {
  create: vnode => update(emptyVNode$1, vnode),
  update
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const classNameToClassMap = create$1(null);

function getMapFromClassName(className) {
  // Intentionally using == to match undefined and null values from computed style attribute
  if (className == null) {
    return EmptyObject;
  } // computed class names must be string


  className = isString(className) ? className : className + '';
  let map = classNameToClassMap[className];

  if (map) {
    return map;
  }

  map = create$1(null);
  let start = 0;
  let o;
  const len = className.length;

  for (o = 0; o < len; o++) {
    if (StringCharCodeAt$1.call(className, o) === SPACE_CHAR) {
      if (o > start) {
        map[StringSlice$1.call(className, start, o)] = true;
      }

      start = o + 1;
    }
  }

  if (o > start) {
    map[StringSlice$1.call(className, start, o)] = true;
  }

  classNameToClassMap[className] = map;

  {
    // just to make sure that this object never changes as part of the diffing algo
    freeze$1(map);
  }

  return map;
}

function updateClassAttribute(oldVnode, vnode) {
  const {
    elm,
    data: {
      className: newClass
    },
    owner: {
      renderer
    }
  } = vnode;
  const {
    data: {
      className: oldClass
    }
  } = oldVnode;

  if (oldClass === newClass) {
    return;
  }

  const classList = renderer.getClassList(elm);
  const newClassMap = getMapFromClassName(newClass);
  const oldClassMap = getMapFromClassName(oldClass);
  let name;

  for (name in oldClassMap) {
    // remove only if it is not in the new class collection and it is not set from within the instance
    if (isUndefined$1(newClassMap[name])) {
      classList.remove(name);
    }
  }

  for (name in newClassMap) {
    if (isUndefined$1(oldClassMap[name])) {
      classList.add(name);
    }
  }
}

const emptyVNode$2 = {
  data: {}
};
var modComputedClassName = {
  create: vnode => updateClassAttribute(emptyVNode$2, vnode),
  update: updateClassAttribute
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function updateStyleAttribute(oldVnode, vnode) {
  const {
    elm,
    data: {
      style: newStyle
    },
    owner: {
      renderer
    }
  } = vnode;
  const {
    getStyleDeclaration,
    removeAttribute
  } = renderer;

  if (oldVnode.data.style === newStyle) {
    return;
  }

  const style = getStyleDeclaration(elm);

  if (!isString(newStyle) || newStyle === '') {
    removeAttribute(elm, 'style');
  } else {
    style.cssText = newStyle;
  }
}

const emptyVNode$3 = {
  data: {}
};
var modComputedStyle = {
  create: vnode => updateStyleAttribute(emptyVNode$3, vnode),
  update: updateStyleAttribute
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The compiler takes care of transforming the inline classnames into an object. It's faster to set the
// different classnames properties individually instead of via a string.

function createClassAttribute(vnode) {
  const {
    elm,
    data: {
      classMap
    },
    owner: {
      renderer
    }
  } = vnode;

  if (isUndefined$1(classMap)) {
    return;
  }

  const classList = renderer.getClassList(elm);

  for (const name in classMap) {
    classList.add(name);
  }
}

var modStaticClassName = {
  create: createClassAttribute
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The compiler takes care of transforming the inline style into an object. It's faster to set the
// different style properties individually instead of via a string.

function createStyleAttribute(vnode) {
  const {
    elm,
    data: {
      styleMap
    },
    owner: {
      renderer
    }
  } = vnode;

  if (isUndefined$1(styleMap)) {
    return;
  }

  const style = renderer.getStyleDeclaration(elm);

  for (const name in styleMap) {
    style[name] = styleMap[name];
  }
}

var modStaticStyle = {
  create: createStyleAttribute
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
@license
Copyright (c) 2015 Simon Friis Vindum.
This code may only be used under the MIT License found at
https://github.com/snabbdom/snabbdom/blob/master/LICENSE
Code distributed by Snabbdom as part of the Snabbdom project at
https://github.com/snabbdom/snabbdom/
*/

function isUndef(s) {
  return s === undefined;
}

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function isVNode(vnode) {
  return vnode != null;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {};
  let j, key, ch; // TODO [#1637]: simplify this by assuming that all vnodes has keys

  for (j = beginIdx; j <= endIdx; ++j) {
    ch = children[j];

    if (isVNode(ch)) {
      key = ch.key;

      if (key !== undefined) {
        map[key] = j;
      }
    }
  }

  return map;
}

function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];

    if (isVNode(ch)) {
      ch.hook.create(ch);
      ch.hook.insert(ch, parentElm, before);
    }
  }
}

function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]; // text nodes do not have logic associated to them

    if (isVNode(ch)) {
      ch.hook.remove(ch, parentElm);
    }
  }
}

function updateDynamicChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  const newChEnd = newCh.length - 1;
  let newEndIdx = newChEnd;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  let before;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!isVNode(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
    } else if (!isVNode(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (!isVNode(newStartVnode)) {
      newStartVnode = newCh[++newStartIdx];
    } else if (!isVNode(newEndVnode)) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode);
      newEndVnode.hook.move(oldStartVnode, parentElm, oldEndVnode.owner.renderer.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode);
      newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }

      idxInOld = oldKeyToIdx[newStartVnode.key];

      if (isUndef(idxInOld)) {
        // New element
        newStartVnode.hook.create(newStartVnode);
        newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];

        if (isVNode(elmToMove)) {
          if (elmToMove.sel !== newStartVnode.sel) {
            // New element
            newStartVnode.hook.create(newStartVnode);
            newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
          } else {
            patchVnode(elmToMove, newStartVnode);
            oldCh[idxInOld] = undefined;
            newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
          }
        }

        newStartVnode = newCh[++newStartIdx];
      }
    }
  }

  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // There's some cases in which the sub array of vnodes to be inserted is followed by null(s) and an
      // already processed vnode, in such cases the vnodes to be inserted should be before that processed vnode.
      let i = newEndIdx;
      let n;

      do {
        n = newCh[++i];
      } while (!isVNode(n) && i < newChEnd);

      before = isVNode(n) ? n.elm : null;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
    } else {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
}

function updateStaticChildren(parentElm, oldCh, newCh) {
  const oldChLength = oldCh.length;
  const newChLength = newCh.length;

  if (oldChLength === 0) {
    // the old list is empty, we can directly insert anything new
    addVnodes(parentElm, null, newCh, 0, newChLength);
    return;
  }

  if (newChLength === 0) {
    // the old list is nonempty and the new list is empty so we can directly remove all old nodes
    // this is the case in which the dynamic children of an if-directive should be removed
    removeVnodes(parentElm, oldCh, 0, oldChLength);
    return;
  } // if the old list is not empty, the new list MUST have the same
  // amount of nodes, that's why we call this static children


  let referenceElm = null;

  for (let i = newChLength - 1; i >= 0; i -= 1) {
    const vnode = newCh[i];
    const oldVNode = oldCh[i];

    if (vnode !== oldVNode) {
      if (isVNode(oldVNode)) {
        if (isVNode(vnode)) {
          // both vnodes must be equivalent, and se just need to patch them
          patchVnode(oldVNode, vnode);
          referenceElm = vnode.elm;
        } else {
          // removing the old vnode since the new one is null
          oldVNode.hook.remove(oldVNode, parentElm);
        }
      } else if (isVNode(vnode)) {
        // this condition is unnecessary
        vnode.hook.create(vnode); // insert the new node one since the old one is null

        vnode.hook.insert(vnode, parentElm, referenceElm);
        referenceElm = vnode.elm;
      }
    }
  }
}

function patchVnode(oldVnode, vnode) {
  if (oldVnode !== vnode) {
    vnode.elm = oldVnode.elm;
    vnode.hook.update(oldVnode, vnode);
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function generateDataDescriptor(options) {
  return assign$1({
    configurable: true,
    enumerable: true,
    writable: true
  }, options);
}

function generateAccessorDescriptor(options) {
  return assign$1({
    configurable: true,
    enumerable: true
  }, options);
}

let isDomMutationAllowed = false;

function unlockDomMutation() {

  isDomMutationAllowed = true;
}

function lockDomMutation() {

  isDomMutationAllowed = false;
}

function logMissingPortalError(name, type) {
  return logError(`The \`${name}\` ${type} is available only on elements that use the \`lwc:dom="manual"\` directive.`);
}

function patchElementWithRestrictions(elm, options) {

  const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
  const descriptors = {
    outerHTML: generateAccessorDescriptor({
      get() {
        return originalOuterHTMLDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set outerHTML on Element.`);
      }

    })
  }; // Apply extra restriction related to DOM manipulation if the element is not a portal.

  if (isFalse$1$1(options.isPortal)) {
    const {
      appendChild,
      insertBefore,
      removeChild,
      replaceChild
    } = elm;
    const originalNodeValueDescriptor = getPropertyDescriptor(elm, 'nodeValue');
    const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
    assign$1(descriptors, {
      appendChild: generateDataDescriptor({
        value(aChild) {
          logMissingPortalError('appendChild', 'method');
          return appendChild.call(this, aChild);
        }

      }),
      insertBefore: generateDataDescriptor({
        value(newNode, referenceNode) {
          if (!isDomMutationAllowed) {
            logMissingPortalError('insertBefore', 'method');
          }

          return insertBefore.call(this, newNode, referenceNode);
        }

      }),
      removeChild: generateDataDescriptor({
        value(aChild) {
          if (!isDomMutationAllowed) {
            logMissingPortalError('removeChild', 'method');
          }

          return removeChild.call(this, aChild);
        }

      }),
      replaceChild: generateDataDescriptor({
        value(newChild, oldChild) {
          logMissingPortalError('replaceChild', 'method');
          return replaceChild.call(this, newChild, oldChild);
        }

      }),
      nodeValue: generateAccessorDescriptor({
        get() {
          return originalNodeValueDescriptor.get.call(this);
        },

        set(value) {
          if (!isDomMutationAllowed) {
            logMissingPortalError('nodeValue', 'property');
          }

          originalNodeValueDescriptor.set.call(this, value);
        }

      }),
      textContent: generateAccessorDescriptor({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(value) {
          logMissingPortalError('textContent', 'property');
          originalTextContentDescriptor.set.call(this, value);
        }

      }),
      innerHTML: generateAccessorDescriptor({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(value) {
          logMissingPortalError('innerHTML', 'property');
          return originalInnerHTMLDescriptor.set.call(this, value);
        }

      })
    });
  }

  defineProperties$1(elm, descriptors);
}

const BLOCKED_SHADOW_ROOT_METHODS = ['cloneNode', 'getElementById', 'getSelection', 'elementsFromPoint', 'dispatchEvent'];

function getShadowRootRestrictionsDescriptors(sr) {
  // thing when using the real shadow root, because if that's the case,
  // the component will not work when running with synthetic shadow.


  const originalAddEventListener = sr.addEventListener;
  const originalInnerHTMLDescriptor = getPropertyDescriptor(sr, 'innerHTML');
  const originalTextContentDescriptor = getPropertyDescriptor(sr, 'textContent');
  const descriptors = {
    innerHTML: generateAccessorDescriptor({
      get() {
        return originalInnerHTMLDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set innerHTML on ShadowRoot.`);
      }

    }),
    textContent: generateAccessorDescriptor({
      get() {
        return originalTextContentDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set textContent on ShadowRoot.`);
      }

    }),
    addEventListener: generateDataDescriptor({
      value(type, listener, options) {
        // TODO [#420]: this is triggered when the component author attempts to add a listener
        // programmatically into its Component's shadow root
        if (!isUndefined$1(options)) {
          logError('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent(this));
        } // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch


        return originalAddEventListener.apply(this, arguments);
      }

    })
  };
  forEach$1.call(BLOCKED_SHADOW_ROOT_METHODS, methodName => {
    descriptors[methodName] = generateAccessorDescriptor({
      get() {
        throw new Error(`Disallowed method "${methodName}" in ShadowRoot.`);
      }

    });
  });
  return descriptors;
} // Custom Elements Restrictions:
// -----------------------------


function getCustomElementRestrictionsDescriptors(elm) {

  const originalAddEventListener = elm.addEventListener;
  const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
  const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
  const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
  return {
    innerHTML: generateAccessorDescriptor({
      get() {
        return originalInnerHTMLDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set innerHTML on HTMLElement.`);
      }

    }),
    outerHTML: generateAccessorDescriptor({
      get() {
        return originalOuterHTMLDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set outerHTML on HTMLElement.`);
      }

    }),
    textContent: generateAccessorDescriptor({
      get() {
        return originalTextContentDescriptor.get.call(this);
      },

      set(_value) {
        throw new TypeError(`Invalid attempt to set textContent on HTMLElement.`);
      }

    }),
    addEventListener: generateDataDescriptor({
      value(type, listener, options) {
        // TODO [#420]: this is triggered when the component author attempts to add a listener
        // programmatically into a lighting element node
        if (!isUndefined$1(options)) {
          logError('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent(this));
        } // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch


        return originalAddEventListener.apply(this, arguments);
      }

    })
  };
}

function getComponentRestrictionsDescriptors() {

  return {
    tagName: generateAccessorDescriptor({
      get() {
        throw new Error(`Usage of property \`tagName\` is disallowed because the component itself does` + ` not know which tagName will be used to create the element, therefore writing` + ` code that check for that value is error prone.`);
      },

      configurable: true,
      enumerable: false
    })
  };
}

function getLightningElementPrototypeRestrictionsDescriptors(proto) {

  const originalDispatchEvent = proto.dispatchEvent;
  const descriptors = {
    dispatchEvent: generateDataDescriptor({
      value(event) {
        const vm = getAssociatedVM(this);

        if (!isNull$1(event) && isObject$2(event)) {
          const {
            type
          } = event;

          if (!/^[a-z][a-z0-9_]*$/.test(type)) {
            logError(`Invalid event type "${type}" dispatched in element ${getComponentTag(vm)}.` + ` Event name must start with a lowercase letter and followed only lowercase` + ` letters, numbers, and underscores`, vm);
          }
        } // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-ignore type-mismatch


        return originalDispatchEvent.apply(this, arguments);
      }

    })
  };
  forEach$1.call(getOwnPropertyNames$1(globalHTMLProperties), propName => {
    if (propName in proto) {
      return; // no need to redefine something that we are already exposing
    }

    descriptors[propName] = generateAccessorDescriptor({
      get() {
        const {
          error,
          attribute
        } = globalHTMLProperties[propName];
        const msg = [];
        msg.push(`Accessing the global HTML property "${propName}" is disabled.`);

        if (error) {
          msg.push(error);
        } else if (attribute) {
          msg.push(`Instead access it via \`this.getAttribute("${attribute}")\`.`);
        }

        logError(msg.join('\n'), getAssociatedVM(this));
      },

      set() {
        const {
          readOnly
        } = globalHTMLProperties[propName];

        if (readOnly) {
          logError(`The global HTML property \`${propName}\` is read-only.`, getAssociatedVM(this));
        }
      }

    });
  });
  return descriptors;
} // This routine will prevent access to certain properties on a shadow root instance to guarantee
// that all components will work fine in IE11 and other browsers without shadow dom support.


function patchShadowRootWithRestrictions(sr) {
  defineProperties$1(sr, getShadowRootRestrictionsDescriptors(sr));
}

function patchCustomElementWithRestrictions(elm) {
  const restrictionsDescriptors = getCustomElementRestrictionsDescriptors(elm);
  const elmProto = getPrototypeOf$1(elm);
  setPrototypeOf$1(elm, create$1(elmProto, restrictionsDescriptors));
}

function patchComponentWithRestrictions(cmp) {
  defineProperties$1(cmp, getComponentRestrictionsDescriptors());
}

function patchLightningElementPrototypeWithRestrictions(proto) {
  defineProperties$1(proto, getLightningElementPrototypeRestrictionsDescriptors(proto));
}
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// This is a temporary workaround to get the @lwc/engine-server to evaluate in node without having
// to inject at runtime.


const HTMLElementConstructor = typeof HTMLElement !== 'undefined' ? HTMLElement : function () {};
const HTMLElementPrototype = HTMLElementConstructor.prototype;
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * This is a descriptor map that contains
 * all standard properties that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base HTML Element and
 * Base Lightning Element should support.
 */

const HTMLElementOriginalDescriptors = create$1(null);
forEach$1.call(keys$1(PropNameToAttrNameMap$1), propName => {
  // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
  // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
  const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);

  if (!isUndefined$1(descriptor)) {
    HTMLElementOriginalDescriptors[propName] = descriptor;
  }
});
forEach$1.call(defaultDefHTMLPropertyNames, propName => {
  // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
  // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
  // this category, so, better to be sure.
  const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);

  if (!isUndefined$1(descriptor)) {
    HTMLElementOriginalDescriptors[propName] = descriptor;
  }
});
/**
 * Copyright (C) 2017 salesforce.com, inc.
 */

const {
  isArray: isArray$1$1
} = Array;
const {
  getPrototypeOf: getPrototypeOf$1$1,
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  defineProperties: ObjectDefineProperties,
  isExtensible,
  getOwnPropertyDescriptor: getOwnPropertyDescriptor$1$1,
  getOwnPropertyNames: getOwnPropertyNames$1$1,
  getOwnPropertySymbols,
  preventExtensions,
  hasOwnProperty: hasOwnProperty$1$1
} = Object;
const {
  push: ArrayPush$2,
  concat: ArrayConcat,
  map: ArrayMap$1$1
} = Array.prototype;
const OtS$1$1 = {}.toString;

function toString$1$1(obj) {
  if (obj && obj.toString) {
    return obj.toString();
  } else if (typeof obj === 'object') {
    return OtS$1$1.call(obj);
  } else {
    return obj + '';
  }
}

function isUndefined$2(obj) {
  return obj === undefined;
}

function isFunction$1$1(obj) {
  return typeof obj === 'function';
}

const proxyToValueMap = new WeakMap();

function registerProxy(proxy, value) {
  proxyToValueMap.set(proxy, value);
}

const unwrap = replicaOrAny => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

class BaseProxyHandler {
  constructor(membrane, value) {
    this.originalTarget = value;
    this.membrane = membrane;
  } // Shared utility methods


  wrapDescriptor(descriptor) {
    if (hasOwnProperty$1$1.call(descriptor, 'value')) {
      descriptor.value = this.wrapValue(descriptor.value);
    } else {
      const {
        set: originalSet,
        get: originalGet
      } = descriptor;

      if (!isUndefined$2(originalGet)) {
        descriptor.get = this.wrapGetter(originalGet);
      }

      if (!isUndefined$2(originalSet)) {
        descriptor.set = this.wrapSetter(originalSet);
      }
    }

    return descriptor;
  }

  copyDescriptorIntoShadowTarget(shadowTarget, key) {
    const {
      originalTarget
    } = this; // Note: a property might get defined multiple times in the shadowTarget
    //       but it will always be compatible with the previous descriptor
    //       to preserve the object invariants, which makes these lines safe.

    const originalDescriptor = getOwnPropertyDescriptor$1$1(originalTarget, key);

    if (!isUndefined$2(originalDescriptor)) {
      const wrappedDesc = this.wrapDescriptor(originalDescriptor);
      ObjectDefineProperty(shadowTarget, key, wrappedDesc);
    }
  }

  lockShadowTarget(shadowTarget) {
    const {
      originalTarget
    } = this;
    const targetKeys = ArrayConcat.call(getOwnPropertyNames$1$1(originalTarget), getOwnPropertySymbols(originalTarget));
    targetKeys.forEach(key => {
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    });
    const {
      membrane: {
        tagPropertyKey
      }
    } = this;

    if (!isUndefined$2(tagPropertyKey) && !hasOwnProperty$1$1.call(shadowTarget, tagPropertyKey)) {
      ObjectDefineProperty(shadowTarget, tagPropertyKey, ObjectCreate(null));
    }

    preventExtensions(shadowTarget);
  } // Shared Traps


  apply(shadowTarget, thisArg, argArray) {
    /* No op */
  }

  construct(shadowTarget, argArray, newTarget) {
    /* No op */
  }

  get(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueObserved
      }
    } = this;
    const value = originalTarget[key];
    valueObserved(originalTarget, key);
    return this.wrapValue(value);
  }

  has(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        tagPropertyKey,
        valueObserved
      }
    } = this;
    valueObserved(originalTarget, key); // since key is never going to be undefined, and tagPropertyKey might be undefined
    // we can simply compare them as the second part of the condition.

    return key in originalTarget || key === tagPropertyKey;
  }

  ownKeys(shadowTarget) {
    const {
      originalTarget,
      membrane: {
        tagPropertyKey
      }
    } = this; // if the membrane tag key exists and it is not in the original target, we add it to the keys.

    const keys = isUndefined$2(tagPropertyKey) || hasOwnProperty$1$1.call(originalTarget, tagPropertyKey) ? [] : [tagPropertyKey]; // small perf optimization using push instead of concat to avoid creating an extra array

    ArrayPush$2.apply(keys, getOwnPropertyNames$1$1(originalTarget));
    ArrayPush$2.apply(keys, getOwnPropertySymbols(originalTarget));
    return keys;
  }

  isExtensible(shadowTarget) {
    const {
      originalTarget
    } = this; // optimization to avoid attempting to lock down the shadowTarget multiple times

    if (!isExtensible(shadowTarget)) {
      return false; // was already locked down
    }

    if (!isExtensible(originalTarget)) {
      this.lockShadowTarget(shadowTarget);
      return false;
    }

    return true;
  }

  getPrototypeOf(shadowTarget) {
    const {
      originalTarget
    } = this;
    return getPrototypeOf$1$1(originalTarget);
  }

  getOwnPropertyDescriptor(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueObserved,
        tagPropertyKey
      }
    } = this; // keys looked up via getOwnPropertyDescriptor need to be reactive

    valueObserved(originalTarget, key);
    let desc = getOwnPropertyDescriptor$1$1(originalTarget, key);

    if (isUndefined$2(desc)) {
      if (key !== tagPropertyKey) {
        return undefined;
      } // if the key is the membrane tag key, and is not in the original target,
      // we produce a synthetic descriptor and install it on the shadow target


      desc = {
        value: undefined,
        writable: false,
        configurable: false,
        enumerable: false
      };
      ObjectDefineProperty(shadowTarget, tagPropertyKey, desc);
      return desc;
    }

    if (desc.configurable === false) {
      // updating the descriptor to non-configurable on the shadow
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    } // Note: by accessing the descriptor, the key is marked as observed
    // but access to the value, setter or getter (if available) cannot observe
    // mutations, just like regular methods, in which case we just do nothing.


    return this.wrapDescriptor(desc);
  }

}

const getterMap = new WeakMap();
const setterMap = new WeakMap();
const reverseGetterMap = new WeakMap();
const reverseSetterMap = new WeakMap();

class ReactiveProxyHandler extends BaseProxyHandler {
  wrapValue(value) {
    return this.membrane.getProxy(value);
  }

  wrapGetter(originalGet) {
    const wrappedGetter = getterMap.get(originalGet);

    if (!isUndefined$2(wrappedGetter)) {
      return wrappedGetter;
    }

    const handler = this;

    const get = function () {
      // invoking the original getter with the original target
      return handler.wrapValue(originalGet.call(unwrap(this)));
    };

    getterMap.set(originalGet, get);
    reverseGetterMap.set(get, originalGet);
    return get;
  }

  wrapSetter(originalSet) {
    const wrappedSetter = setterMap.get(originalSet);

    if (!isUndefined$2(wrappedSetter)) {
      return wrappedSetter;
    }

    const set = function (v) {
      // invoking the original setter with the original target
      originalSet.call(unwrap(this), unwrap(v));
    };

    setterMap.set(originalSet, set);
    reverseSetterMap.set(set, originalSet);
    return set;
  }

  unwrapDescriptor(descriptor) {
    if (hasOwnProperty$1$1.call(descriptor, 'value')) {
      // dealing with a data descriptor
      descriptor.value = unwrap(descriptor.value);
    } else {
      const {
        set,
        get
      } = descriptor;

      if (!isUndefined$2(get)) {
        descriptor.get = this.unwrapGetter(get);
      }

      if (!isUndefined$2(set)) {
        descriptor.set = this.unwrapSetter(set);
      }
    }

    return descriptor;
  }

  unwrapGetter(redGet) {
    const reverseGetter = reverseGetterMap.get(redGet);

    if (!isUndefined$2(reverseGetter)) {
      return reverseGetter;
    }

    const handler = this;

    const get = function () {
      // invoking the red getter with the proxy of this
      return unwrap(redGet.call(handler.wrapValue(this)));
    };

    getterMap.set(get, redGet);
    reverseGetterMap.set(redGet, get);
    return get;
  }

  unwrapSetter(redSet) {
    const reverseSetter = reverseSetterMap.get(redSet);

    if (!isUndefined$2(reverseSetter)) {
      return reverseSetter;
    }

    const handler = this;

    const set = function (v) {
      // invoking the red setter with the proxy of this
      redSet.call(handler.wrapValue(this), handler.wrapValue(v));
    };

    setterMap.set(set, redSet);
    reverseSetterMap.set(redSet, set);
    return set;
  }

  set(shadowTarget, key, value) {
    const {
      originalTarget,
      membrane: {
        valueMutated
      }
    } = this;
    const oldValue = originalTarget[key];

    if (oldValue !== value) {
      originalTarget[key] = value;
      valueMutated(originalTarget, key);
    } else if (key === 'length' && isArray$1$1(originalTarget)) {
      // fix for issue #236: push will add the new index, and by the time length
      // is updated, the internal length is already equal to the new length value
      // therefore, the oldValue is equal to the value. This is the forking logic
      // to support this use case.
      valueMutated(originalTarget, key);
    }

    return true;
  }

  deleteProperty(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueMutated
      }
    } = this;
    delete originalTarget[key];
    valueMutated(originalTarget, key);
    return true;
  }

  setPrototypeOf(shadowTarget, prototype) {
    {
      throw new Error(`Invalid setPrototypeOf invocation for reactive proxy ${toString$1$1(this.originalTarget)}. Prototype of reactive objects cannot be changed.`);
    }
  }

  preventExtensions(shadowTarget) {
    if (isExtensible(shadowTarget)) {
      const {
        originalTarget
      } = this;
      preventExtensions(originalTarget); // if the originalTarget is a proxy itself, it might reject
      // the preventExtension call, in which case we should not attempt to lock down
      // the shadow target.

      if (isExtensible(originalTarget)) {
        return false;
      }

      this.lockShadowTarget(shadowTarget);
    }

    return true;
  }

  defineProperty(shadowTarget, key, descriptor) {
    const {
      originalTarget,
      membrane: {
        valueMutated,
        tagPropertyKey
      }
    } = this;

    if (key === tagPropertyKey && !hasOwnProperty$1$1.call(originalTarget, key)) {
      // To avoid leaking the membrane tag property into the original target, we must
      // be sure that the original target doesn't have yet.
      // NOTE: we do not return false here because Object.freeze and equivalent operations
      // will attempt to set the descriptor to the same value, and expect no to throw. This
      // is an small compromise for the sake of not having to diff the descriptors.
      return true;
    }

    ObjectDefineProperty(originalTarget, key, this.unwrapDescriptor(descriptor)); // intentionally testing if false since it could be undefined as well

    if (descriptor.configurable === false) {
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    }

    valueMutated(originalTarget, key);
    return true;
  }

}

const getterMap$1 = new WeakMap();
const setterMap$1 = new WeakMap();

class ReadOnlyHandler extends BaseProxyHandler {
  wrapValue(value) {
    return this.membrane.getReadOnlyProxy(value);
  }

  wrapGetter(originalGet) {
    const wrappedGetter = getterMap$1.get(originalGet);

    if (!isUndefined$2(wrappedGetter)) {
      return wrappedGetter;
    }

    const handler = this;

    const get = function () {
      // invoking the original getter with the original target
      return handler.wrapValue(originalGet.call(unwrap(this)));
    };

    getterMap$1.set(originalGet, get);
    return get;
  }

  wrapSetter(originalSet) {
    const wrappedSetter = setterMap$1.get(originalSet);

    if (!isUndefined$2(wrappedSetter)) {
      return wrappedSetter;
    }

    const handler = this;

    const set = function (v) {
      {
        const {
          originalTarget
        } = handler;
        throw new Error(`Invalid mutation: Cannot invoke a setter on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    };

    setterMap$1.set(originalSet, set);
    return set;
  }

  set(shadowTarget, key, value) {
    {
      const {
        originalTarget
      } = this;
      throw new Error(`Invalid mutation: Cannot set "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
    }
  }

  deleteProperty(shadowTarget, key) {
    {
      const {
        originalTarget
      } = this;
      throw new Error(`Invalid mutation: Cannot delete "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
    }
  }

  setPrototypeOf(shadowTarget, prototype) {
    {
      const {
        originalTarget
      } = this;
      throw new Error(`Invalid prototype mutation: Cannot set prototype on "${originalTarget}". "${originalTarget}" prototype is read-only.`);
    }
  }

  preventExtensions(shadowTarget) {
    {
      const {
        originalTarget
      } = this;
      throw new Error(`Invalid mutation: Cannot preventExtensions on ${originalTarget}". "${originalTarget} is read-only.`);
    }
  }

  defineProperty(shadowTarget, key, descriptor) {
    {
      const {
        originalTarget
      } = this;
      throw new Error(`Invalid mutation: Cannot defineProperty "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
    }
  }

}

function extract(objectOrArray) {
  if (isArray$1$1(objectOrArray)) {
    return objectOrArray.map(item => {
      const original = unwrap(item);

      if (original !== item) {
        return extract(original);
      }

      return item;
    });
  }

  const obj = ObjectCreate(getPrototypeOf$1$1(objectOrArray));
  const names = getOwnPropertyNames$1$1(objectOrArray);
  return ArrayConcat.call(names, getOwnPropertySymbols(objectOrArray)).reduce((seed, key) => {
    const item = objectOrArray[key];
    const original = unwrap(item);

    if (original !== item) {
      seed[key] = extract(original);
    } else {
      seed[key] = item;
    }

    return seed;
  }, obj);
}

const formatter = {
  header: plainOrProxy => {
    const originalTarget = unwrap(plainOrProxy); // if originalTarget is falsy or not unwrappable, exit

    if (!originalTarget || originalTarget === plainOrProxy) {
      return null;
    }

    const obj = extract(plainOrProxy);
    return ['object', {
      object: obj
    }];
  },
  hasBody: () => {
    return false;
  },
  body: () => {
    return null;
  }
}; // Inspired from paulmillr/es6-shim
// https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L176-L185

function getGlobal() {
  // the only reliable means to get the global object is `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  } // Gracefully degrade if not able to locate the global object


  return {};
}

function init() {

  const global = getGlobal(); // Custom Formatter for Dev Tools. To enable this, open Chrome Dev Tools
  //  - Go to Settings,
  //  - Under console, select "Enable custom formatters"
  // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview

  const devtoolsFormatters = global.devtoolsFormatters || [];
  ArrayPush$2.call(devtoolsFormatters, formatter);
  global.devtoolsFormatters = devtoolsFormatters;
}

{
  init();
}

const ObjectDotPrototype = Object.prototype;

function defaultValueIsObservable(value) {
  // intentionally checking for null
  if (value === null) {
    return false;
  } // treat all non-object types, including undefined, as non-observable values


  if (typeof value !== 'object') {
    return false;
  }

  if (isArray$1$1(value)) {
    return true;
  }

  const proto = getPrototypeOf$1$1(value);
  return proto === ObjectDotPrototype || proto === null || getPrototypeOf$1$1(proto) === null;
}

const defaultValueObserved = (obj, key) => {
  /* do nothing */
};

const defaultValueMutated = (obj, key) => {
  /* do nothing */
};

const defaultValueDistortion = value => value;

function createShadowTarget(value) {
  return isArray$1$1(value) ? [] : {};
}

class ReactiveMembrane {
  constructor(options) {
    this.valueDistortion = defaultValueDistortion;
    this.valueMutated = defaultValueMutated;
    this.valueObserved = defaultValueObserved;
    this.valueIsObservable = defaultValueIsObservable;
    this.objectGraph = new WeakMap();

    if (!isUndefined$2(options)) {
      const {
        valueDistortion,
        valueMutated,
        valueObserved,
        valueIsObservable,
        tagPropertyKey
      } = options;
      this.valueDistortion = isFunction$1$1(valueDistortion) ? valueDistortion : defaultValueDistortion;
      this.valueMutated = isFunction$1$1(valueMutated) ? valueMutated : defaultValueMutated;
      this.valueObserved = isFunction$1$1(valueObserved) ? valueObserved : defaultValueObserved;
      this.valueIsObservable = isFunction$1$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
      this.tagPropertyKey = tagPropertyKey;
    }
  }

  getProxy(value) {
    const unwrappedValue = unwrap(value);
    const distorted = this.valueDistortion(unwrappedValue);

    if (this.valueIsObservable(distorted)) {
      const o = this.getReactiveState(unwrappedValue, distorted); // when trying to extract the writable version of a readonly
      // we return the readonly.

      return o.readOnly === value ? value : o.reactive;
    }

    return distorted;
  }

  getReadOnlyProxy(value) {
    value = unwrap(value);
    const distorted = this.valueDistortion(value);

    if (this.valueIsObservable(distorted)) {
      return this.getReactiveState(value, distorted).readOnly;
    }

    return distorted;
  }

  unwrapProxy(p) {
    return unwrap(p);
  }

  getReactiveState(value, distortedValue) {
    const {
      objectGraph
    } = this;
    let reactiveState = objectGraph.get(distortedValue);

    if (reactiveState) {
      return reactiveState;
    }

    const membrane = this;
    reactiveState = {
      get reactive() {
        const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue); // caching the reactive proxy after the first time it is accessed

        const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
        registerProxy(proxy, value);
        ObjectDefineProperty(this, 'reactive', {
          value: proxy
        });
        return proxy;
      },

      get readOnly() {
        const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue); // caching the readOnly proxy after the first time it is accessed

        const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
        registerProxy(proxy, value);
        ObjectDefineProperty(this, 'readOnly', {
          value: proxy
        });
        return proxy;
      }

    };
    objectGraph.set(distortedValue, reactiveState);
    return reactiveState;
  }

}
/** version: 1.0.0 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const lockerLivePropertyKey = Symbol.for('@@lockerLiveValue');

function valueDistortion(value) {
  return value;
}

const reactiveMembrane = new ReactiveMembrane({
  valueObserved,
  valueMutated,
  valueDistortion,
  tagPropertyKey: lockerLivePropertyKey
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * This operation is called with a descriptor of an standard html property
 * that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
 * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
 */


function createBridgeToElementDescriptor(propName, descriptor) {
  const {
    get,
    set,
    enumerable,
    configurable
  } = descriptor;

  if (!isFunction$1(get)) {
    {
      assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
    }

    throw new TypeError();
  }

  if (!isFunction$1(set)) {
    {
      assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
    }

    throw new TypeError();
  }

  return {
    enumerable,
    configurable,

    get() {
      const vm = getAssociatedVM(this);

      if (isBeingConstructed(vm)) {
        {
          logError(`The value of property \`${propName}\` can't be read from the constructor because the owner component hasn't set the value yet. Instead, use the constructor to set a default value for the property.`, vm);
        }

        return;
      }

      componentValueObserved(vm, propName);
      return get.call(vm.elm);
    },

    set(newValue) {
      const vm = getAssociatedVM(this);

      {
        const vmBeingRendered = getVMBeingRendered();
        assert$1.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
        assert$1.invariant(!isUpdatingTemplate, `When updating the template of ${vmBeingRendered}, one of the accessors used by the template has side effects on the state of ${vm}.${propName}`);
        assert$1.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
        assert$1.invariant(!isObject$2(newValue) || isNull$1(newValue), `Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
      }

      if (newValue !== vm.cmpProps[propName]) {
        vm.cmpProps[propName] = newValue;
        componentValueMutated(vm, propName);
      }

      return set.call(vm.elm, newValue);
    }

  };
}
/**
 * This class is the base class for any LWC element.
 * Some elements directly extends this class, others implement it via inheritance.
 **/


function BaseLightningElementConstructor() {
  var _a; // This should be as performant as possible, while any initialization should be done lazily


  if (isNull$1(vmBeingConstructed)) {
    throw new ReferenceError('Illegal constructor');
  }

  const vm = vmBeingConstructed;
  const {
    elm,
    mode,
    renderer,
    def: {
      ctor,
      bridge
    }
  } = vm;

  {
    (_a = renderer.assertInstanceOfHTMLElement) === null || _a === void 0 ? void 0 : _a.call(renderer, vm.elm, `Component creation requires a DOM element to be associated to ${vm}.`);
  }

  const component = this;
  setPrototypeOf$1(elm, bridge.prototype);
  const cmpRoot = renderer.attachShadow(elm, {
    mode,
    delegatesFocus: !!ctor.delegatesFocus,
    '$$lwc-synthetic-mode$$': true
  });
  vm.component = this;
  vm.cmpRoot = cmpRoot; // Locker hooks assignment. When the LWC engine run with Locker, Locker intercepts all the new
  // component creation and passes hooks to instrument all the component interactions with the
  // engine. We are intentionally hiding this argument from the formal API of LightningElement
  // because we don't want folks to know about it just yet.

  if (arguments.length === 1) {
    const {
      callHook,
      setHook,
      getHook
    } = arguments[0];
    vm.callHook = callHook;
    vm.setHook = setHook;
    vm.getHook = getHook;
  } // Making the component instance a live value when using Locker to support expandos.


  defineProperty$1(component, lockerLivePropertyKey, EmptyObject); // Linking elm, shadow root and component with the VM.

  associateVM(component, vm);
  associateVM(cmpRoot, vm);
  associateVM(elm, vm); // Adding extra guard rails in DEV mode.

  {
    patchCustomElementWithRestrictions(elm);
    patchComponentWithRestrictions(component);
    patchShadowRootWithRestrictions(cmpRoot);
  }

  return this;
}

BaseLightningElementConstructor.prototype = {
  constructor: BaseLightningElementConstructor,

  dispatchEvent(event) {
    const {
      elm,
      renderer: {
        dispatchEvent
      }
    } = getAssociatedVM(this);
    return dispatchEvent(elm, event);
  },

  addEventListener(type, listener, options) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        addEventListener
      }
    } = vm;

    {
      const vmBeingRendered = getVMBeingRendered();
      assert$1.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
      assert$1.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm} by adding an event listener for "${type}".`);
      assert$1.invariant(isFunction$1(listener), `Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
    }

    const wrappedListener = getWrappedComponentsListener(vm, listener);
    addEventListener(elm, type, wrappedListener, options);
  },

  removeEventListener(type, listener, options) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        removeEventListener
      }
    } = vm;
    const wrappedListener = getWrappedComponentsListener(vm, listener);
    removeEventListener(elm, type, wrappedListener, options);
  },

  hasAttribute(name) {
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = getAssociatedVM(this);
    return !isNull$1(getAttribute(elm, name));
  },

  hasAttributeNS(namespace, name) {
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = getAssociatedVM(this);
    return !isNull$1(getAttribute(elm, name, namespace));
  },

  removeAttribute(name) {
    const {
      elm,
      renderer: {
        removeAttribute
      }
    } = getAssociatedVM(this);
    unlockAttribute(elm, name);
    removeAttribute(elm, name);
    lockAttribute();
  },

  removeAttributeNS(namespace, name) {
    const {
      elm,
      renderer: {
        removeAttribute
      }
    } = getAssociatedVM(this);
    unlockAttribute(elm, name);
    removeAttribute(elm, name, namespace);
    lockAttribute();
  },

  getAttribute(name) {
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = getAssociatedVM(this);
    return getAttribute(elm, name);
  },

  getAttributeNS(namespace, name) {
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = getAssociatedVM(this);
    return getAttribute(elm, name, namespace);
  },

  setAttribute(name, value) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        setAttribute
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
    }

    unlockAttribute(elm, name);
    setAttribute(elm, name, value);
    lockAttribute();
  },

  setAttributeNS(namespace, name, value) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        setAttribute
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
    }

    unlockAttribute(elm, name);
    setAttribute(elm, name, value, namespace);
    lockAttribute();
  },

  getBoundingClientRect() {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getBoundingClientRect
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `this.getBoundingClientRect() should not be called during the construction of the custom element for ${getComponentTag(vm)} because the element is not yet in the DOM, instead, you can use it in one of the available life-cycle hooks.`);
    }

    return getBoundingClientRect(elm);
  },

  querySelector(selectors) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        querySelector
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `this.querySelector() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
    }

    return querySelector(elm, selectors);
  },

  querySelectorAll(selectors) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        querySelectorAll
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `this.querySelectorAll() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
    }

    return querySelectorAll(elm, selectors);
  },

  getElementsByTagName(tagNameOrWildCard) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getElementsByTagName
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `this.getElementsByTagName() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
    }

    return getElementsByTagName(elm, tagNameOrWildCard);
  },

  getElementsByClassName(names) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getElementsByClassName
      }
    } = vm;

    {
      assert$1.isFalse(isBeingConstructed(vm), `this.getElementsByClassName() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
    }

    return getElementsByClassName(elm, names);
  },

  get isConnected() {
    const {
      elm,
      renderer: {
        isConnected
      }
    } = getAssociatedVM(this);
    return isConnected(elm);
  },

  get classList() {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getClassList
      }
    } = vm;

    {
      // TODO [#1290]: this still fails in dev but works in production, eventually, we should
      // just throw in all modes
      assert$1.isFalse(isBeingConstructed(vm), `Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
    }

    return getClassList(elm);
  },

  get template() {
    const vm = getAssociatedVM(this);
    return vm.cmpRoot;
  },

  get shadowRoot() {
    // From within the component instance, the shadowRoot is always reported as "closed".
    // Authors should rely on this.template instead.
    return null;
  },

  render() {
    const vm = getAssociatedVM(this);
    return vm.def.template;
  },

  toString() {
    const vm = getAssociatedVM(this);
    return `[object ${vm.def.name}]`;
  }

};
const lightningBasedDescriptors = create$1(null);

for (const propName in HTMLElementOriginalDescriptors) {
  lightningBasedDescriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
}

defineProperties$1(BaseLightningElementConstructor.prototype, lightningBasedDescriptors);
defineProperty$1(BaseLightningElementConstructor, 'CustomElementConstructor', {
  get() {
    // If required, a runtime-specific implementation must be defined.
    throw new ReferenceError('The current runtime does not support CustomElementConstructor.');
  },

  configurable: true
});

{
  patchLightningElementPrototypeWithRestrictions(BaseLightningElementConstructor.prototype);
} // @ts-ignore


const BaseLightningElement = BaseLightningElementConstructor;

function internalWireFieldDecorator(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      componentValueObserved(vm, key);
      return vm.cmpFields[key];
    },

    set(value) {
      const vm = getAssociatedVM(this);
      /**
       * Reactivity for wired fields is provided in wiring.
       * We intentionally add reactivity here since this is just
       * letting the author to do the wrong thing, but it will keep our
       * system to be backward compatible.
       */

      if (value !== vm.cmpFields[key]) {
        vm.cmpFields[key] = value;
        componentValueMutated(vm, key);
      }
    },

    enumerable: true,
    configurable: true
  };
}

function internalTrackDecorator(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      componentValueObserved(vm, key);
      return vm.cmpFields[key];
    },

    set(newValue) {
      const vm = getAssociatedVM(this);

      {
        const vmBeingRendered = getVMBeingRendered();
        assert$1.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString$1(key)}`);
        assert$1.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm}.${toString$1(key)}`);
      }

      const reactiveOrAnyValue = reactiveMembrane.getProxy(newValue);

      if (reactiveOrAnyValue !== vm.cmpFields[key]) {
        vm.cmpFields[key] = reactiveOrAnyValue;
        componentValueMutated(vm, key);
      }
    },

    enumerable: true,
    configurable: true
  };
}
/**
 * Copyright (C) 2018 salesforce.com, inc.
 */

/**
 * Copyright (C) 2018 salesforce.com, inc.
 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const {
  assign: assign$1$1,
  create: create$2,
  defineProperties: defineProperties$1$1,
  defineProperty: defineProperty$1$1,
  freeze: freeze$1$1,
  getOwnPropertyDescriptor: getOwnPropertyDescriptor$2,
  getOwnPropertyNames: getOwnPropertyNames$2,
  getPrototypeOf: getPrototypeOf$2,
  hasOwnProperty: hasOwnProperty$2,
  isFrozen: isFrozen$1$1,
  keys: keys$1$1,
  seal: seal$1$1,
  setPrototypeOf: setPrototypeOf$1$1
} = Object;
const {
  filter: ArrayFilter$1$1,
  find: ArrayFind$1$1,
  indexOf: ArrayIndexOf$2,
  join: ArrayJoin$1$1,
  map: ArrayMap$2,
  push: ArrayPush$3,
  reduce: ArrayReduce$1$1,
  reverse: ArrayReverse$1$1,
  slice: ArraySlice$1$1,
  splice: ArraySplice$2,
  unshift: ArrayUnshift$1$1,
  forEach: forEach$1$1
} = Array.prototype;
const {
  charCodeAt: StringCharCodeAt$1$1,
  replace: StringReplace$1$1,
  slice: StringSlice$1$1,
  toLowerCase: StringToLowerCase$1$1
} = String.prototype;
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * According to the following list, there are 48 aria attributes of which two (ariaDropEffect and
 * ariaGrabbed) are deprecated:
 * https://www.w3.org/TR/wai-aria-1.1/#x6-6-definitions-of-states-and-properties-all-aria-attributes
 *
 * The above list of 46 aria attributes is consistent with the following resources:
 * https://github.com/w3c/aria/pull/708/files#diff-eacf331f0ffc35d4b482f1d15a887d3bR11060
 * https://wicg.github.io/aom/spec/aria-reflection.html
 */


const AriaPropertyNames$1$1 = ['ariaActiveDescendant', 'ariaAtomic', 'ariaAutoComplete', 'ariaBusy', 'ariaChecked', 'ariaColCount', 'ariaColIndex', 'ariaColSpan', 'ariaControls', 'ariaCurrent', 'ariaDescribedBy', 'ariaDetails', 'ariaDisabled', 'ariaErrorMessage', 'ariaExpanded', 'ariaFlowTo', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaKeyShortcuts', 'ariaLabel', 'ariaLabelledBy', 'ariaLevel', 'ariaLive', 'ariaModal', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaOwns', 'ariaPlaceholder', 'ariaPosInSet', 'ariaPressed', 'ariaReadOnly', 'ariaRelevant', 'ariaRequired', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaSelected', 'ariaSetSize', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'role'];
const AttrNameToPropNameMap$2 = create$2(null);
const PropNameToAttrNameMap$2 = create$2(null); // Synthetic creation of all AOM property descriptors for Custom Elements

forEach$1$1.call(AriaPropertyNames$1$1, propName => {
  // Typescript infers the wrong function type for this particular overloaded method:
  // https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch
  const attrName = StringToLowerCase$1$1.call(StringReplace$1$1.call(propName, /^aria/, 'aria-'));
  AttrNameToPropNameMap$2[attrName] = propName;
  PropNameToAttrNameMap$2[propName] = attrName;
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Inspired from: https://mathiasbynens.be/notes/globalthis

const _globalThis$1$1 = function () {
  // On recent browsers, `globalThis` is already defined. In this case return it directly.
  if (typeof globalThis === 'object') {
    return globalThis;
  }

  let _globalThis;

  try {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true
    }); // __magic__ is undefined in Safari 10 and IE10 and older.
    // @ts-ignore
    // eslint-disable-next-line no-undef

    _globalThis = __magic__; // @ts-ignore

    delete Object.prototype.__magic__;
  } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
  } finally {
    // If the magic above fails for some reason we assume that we are in a legacy browser.
    // Assume `window` exists in this case.
    if (typeof _globalThis === 'undefined') {
      // @ts-ignore
      _globalThis = window;
    }
  }

  return _globalThis;
}();
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * In IE11, symbols are expensive.
 * Due to the nature of the symbol polyfill. This method abstract the
 * creation of symbols, so we can fallback to string when native symbols
 * are not supported. Note that we can't use typeof since it will fail when transpiling.
 */


const hasNativeSymbolsSupport$1$1 = Symbol('x').toString() === 'Symbol(x)';
const HTML_ATTRIBUTES_TO_PROPERTY$1$1 = {
  accesskey: 'accessKey',
  readonly: 'readOnly',
  tabindex: 'tabIndex',
  bgcolor: 'bgColor',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  formaction: 'formAction',
  ismap: 'isMap',
  maxlength: 'maxLength',
  minlength: 'minLength',
  novalidate: 'noValidate',
  usemap: 'useMap',
  for: 'htmlFor'
};
keys$1$1(HTML_ATTRIBUTES_TO_PROPERTY$1$1).forEach(attrName => {});
/** version: 1.9.1 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

if (!_globalThis$1$1.lwcRuntimeFlags) {
  Object.defineProperty(_globalThis$1$1, 'lwcRuntimeFlags', {
    value: create$2(null)
  });
}

const runtimeFlags = _globalThis$1$1.lwcRuntimeFlags; // This function is not supported for use within components and is meant for

function createPublicPropertyDescriptor(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);

      if (isBeingConstructed(vm)) {
        {
          logError(`Can’t read the value of property \`${toString$1(key)}\` from the constructor because the owner component hasn’t set the value yet. Instead, use the constructor to set a default value for the property.`, vm);
        }

        return;
      }

      componentValueObserved(vm, key);
      return vm.cmpProps[key];
    },

    set(newValue) {
      const vm = getAssociatedVM(this);

      {
        const vmBeingRendered = getVMBeingRendered();
        assert$1.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString$1(key)}`);
        assert$1.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm}.${toString$1(key)}`);
      }

      vm.cmpProps[key] = newValue;
      componentValueMutated(vm, key);
    },

    enumerable: true,
    configurable: true
  };
}

class AccessorReactiveObserver extends ReactiveObserver {
  constructor(vm, set) {
    super(() => {
      if (isFalse$1$1(this.debouncing)) {
        this.debouncing = true;
        addCallbackToNextTick(() => {
          if (isTrue$1$1(this.debouncing)) {
            const {
              value
            } = this;
            const {
              isDirty: dirtyStateBeforeSetterCall,
              component,
              idx
            } = vm;
            set.call(component, value); // de-bouncing after the call to the original setter to prevent
            // infinity loop if the setter itself is mutating things that
            // were accessed during the previous invocation.

            this.debouncing = false;

            if (isTrue$1$1(vm.isDirty) && isFalse$1$1(dirtyStateBeforeSetterCall) && idx > 0) {
              // immediate rehydration due to a setter driven mutation, otherwise
              // the component will get rendered on the second tick, which it is not
              // desirable.
              rerenderVM(vm);
            }
          }
        });
      }
    });
    this.debouncing = false;
  }

  reset(value) {
    super.reset();
    this.debouncing = false;

    if (arguments.length > 0) {
      this.value = value;
    }
  }

}

function createPublicAccessorDescriptor(key, descriptor) {
  const {
    get,
    set,
    enumerable,
    configurable
  } = descriptor;

  if (!isFunction$1(get)) {
    {
      assert$1.invariant(isFunction$1(get), `Invalid compiler output for public accessor ${toString$1(key)} decorated with @api`);
    }

    throw new Error();
  }

  return {
    get() {
      {
        // Assert that the this value is an actual Component with an associated VM.
        getAssociatedVM(this);
      }

      return get.call(this);
    },

    set(newValue) {
      const vm = getAssociatedVM(this);

      {
        const vmBeingRendered = getVMBeingRendered();
        assert$1.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString$1(key)}`);
        assert$1.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm}.${toString$1(key)}`);
      }

      if (set) {
        if (runtimeFlags.ENABLE_REACTIVE_SETTER) {
          let ro = vm.oar[key];

          if (isUndefined$1(ro)) {
            ro = vm.oar[key] = new AccessorReactiveObserver(vm, set);
          } // every time we invoke this setter from outside (through this wrapper setter)
          // we should reset the value and then debounce just in case there is a pending
          // invocation the next tick that is not longer relevant since the value is changing
          // from outside.


          ro.reset(newValue);
          ro.observe(() => {
            set.call(this, newValue);
          });
        } else {
          set.call(this, newValue);
        }
      } else {
        assert$1.fail(`Invalid attempt to set a new value for property ${toString$1(key)} of ${vm} that does not has a setter decorated with @api.`);
      }
    },

    enumerable,
    configurable
  };
}

function createObservedFieldPropertyDescriptor(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      componentValueObserved(vm, key);
      return vm.cmpFields[key];
    },

    set(newValue) {
      const vm = getAssociatedVM(this);

      if (newValue !== vm.cmpFields[key]) {
        vm.cmpFields[key] = newValue;
        componentValueMutated(vm, key);
      }
    },

    enumerable: true,
    configurable: true
  };
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


var PropType;

(function (PropType) {
  PropType[PropType["Field"] = 0] = "Field";
  PropType[PropType["Set"] = 1] = "Set";
  PropType[PropType["Get"] = 2] = "Get";
  PropType[PropType["GetSet"] = 3] = "GetSet";
})(PropType || (PropType = {}));

function validateObservedField(Ctor, fieldName, descriptor) {
  {
    if (!isUndefined$1(descriptor)) {
      assert$1.fail(`Compiler Error: Invalid field ${fieldName} declaration.`);
    }
  }
}

function validateFieldDecoratedWithTrack(Ctor, fieldName, descriptor) {
  {
    if (!isUndefined$1(descriptor)) {
      assert$1.fail(`Compiler Error: Invalid @track ${fieldName} declaration.`);
    }
  }
}

function validateFieldDecoratedWithWire(Ctor, fieldName, descriptor) {
  {
    if (!isUndefined$1(descriptor)) {
      assert$1.fail(`Compiler Error: Invalid @wire(...) ${fieldName} field declaration.`);
    }
  }
}

function validateMethodDecoratedWithWire(Ctor, methodName, descriptor) {
  {
    if (isUndefined$1(descriptor) || !isFunction$1(descriptor.value) || isFalse$1$1(descriptor.writable)) {
      assert$1.fail(`Compiler Error: Invalid @wire(...) ${methodName} method declaration.`);
    }
  }
}

function validateFieldDecoratedWithApi(Ctor, fieldName, descriptor) {
  {
    if (!isUndefined$1(descriptor)) {
      assert$1.fail(`Compiler Error: Invalid @api ${fieldName} field declaration.`);
    }
  }
}

function validateAccessorDecoratedWithApi(Ctor, fieldName, descriptor) {
  {
    if (isUndefined$1(descriptor)) {
      assert$1.fail(`Compiler Error: Invalid @api get ${fieldName} accessor declaration.`);
    } else if (isFunction$1(descriptor.set)) {
      assert$1.isTrue(isFunction$1(descriptor.get), `Compiler Error: Missing getter for property ${toString$1(fieldName)} decorated with @api in ${Ctor}. You cannot have a setter without the corresponding getter.`);
    } else if (!isFunction$1(descriptor.get)) {
      assert$1.fail(`Compiler Error: Missing @api get ${fieldName} accessor declaration.`);
    }
  }
}

function validateMethodDecoratedWithApi(Ctor, methodName, descriptor) {
  {
    if (isUndefined$1(descriptor) || !isFunction$1(descriptor.value) || isFalse$1$1(descriptor.writable)) {
      assert$1.fail(`Compiler Error: Invalid @api ${methodName} method declaration.`);
    }
  }
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by user-land code.
 */


function registerDecorators(Ctor, meta) {
  const proto = Ctor.prototype;
  const {
    publicProps,
    publicMethods,
    wire,
    track,
    fields
  } = meta;
  const apiMethods = create$1(null);
  const apiFields = create$1(null);
  const wiredMethods = create$1(null);
  const wiredFields = create$1(null);
  const observedFields = create$1(null);
  const apiFieldsConfig = create$1(null);
  let descriptor;

  if (!isUndefined$1(publicProps)) {
    for (const fieldName in publicProps) {
      const propConfig = publicProps[fieldName];
      apiFieldsConfig[fieldName] = propConfig.config;
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);

      if (propConfig.config > 0) {
        // accessor declaration
        {
          validateAccessorDecoratedWithApi(Ctor, fieldName, descriptor);
        }

        if (isUndefined$1(descriptor)) {
          throw new Error();
        }

        descriptor = createPublicAccessorDescriptor(fieldName, descriptor);
      } else {
        // field declaration
        {
          validateFieldDecoratedWithApi(Ctor, fieldName, descriptor);
        }

        descriptor = createPublicPropertyDescriptor(fieldName);
      }

      apiFields[fieldName] = descriptor;
      defineProperty$1(proto, fieldName, descriptor);
    }
  }

  if (!isUndefined$1(publicMethods)) {
    forEach$1.call(publicMethods, methodName => {
      descriptor = getOwnPropertyDescriptor$1(proto, methodName);

      {
        validateMethodDecoratedWithApi(Ctor, methodName, descriptor);
      }

      if (isUndefined$1(descriptor)) {
        throw new Error();
      }

      apiMethods[methodName] = descriptor;
    });
  }

  if (!isUndefined$1(wire)) {
    for (const fieldOrMethodName in wire) {
      const {
        adapter,
        method,
        config: configCallback,
        dynamic = []
      } = wire[fieldOrMethodName];
      descriptor = getOwnPropertyDescriptor$1(proto, fieldOrMethodName);

      if (method === 1) {
        {
          assert$1.isTrue(adapter, `@wire on method "${fieldOrMethodName}": adapter id must be truthy.`);
          validateMethodDecoratedWithWire(Ctor, fieldOrMethodName, descriptor);
        }

        if (isUndefined$1(descriptor)) {
          throw new Error();
        }

        wiredMethods[fieldOrMethodName] = descriptor;
        storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic);
      } else {
        {
          assert$1.isTrue(adapter, `@wire on field "${fieldOrMethodName}": adapter id must be truthy.`);
          validateFieldDecoratedWithWire(Ctor, fieldOrMethodName, descriptor);
        }

        descriptor = internalWireFieldDecorator(fieldOrMethodName);
        wiredFields[fieldOrMethodName] = descriptor;
        storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic);
        defineProperty$1(proto, fieldOrMethodName, descriptor);
      }
    }
  }

  if (!isUndefined$1(track)) {
    for (const fieldName in track) {
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);

      {
        validateFieldDecoratedWithTrack(Ctor, fieldName, descriptor);
      }

      descriptor = internalTrackDecorator(fieldName);
      defineProperty$1(proto, fieldName, descriptor);
    }
  }

  if (!isUndefined$1(fields)) {
    for (let i = 0, n = fields.length; i < n; i++) {
      const fieldName = fields[i];
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);

      {
        validateObservedField(Ctor, fieldName, descriptor);
      }

      observedFields[fieldName] = createObservedFieldPropertyDescriptor(fieldName);
    }
  }

  setDecoratorsMeta(Ctor, {
    apiMethods,
    apiFields,
    apiFieldsConfig,
    wiredMethods,
    wiredFields,
    observedFields
  });
  return Ctor;
}

const signedDecoratorToMetaMap = new Map();

function setDecoratorsMeta(Ctor, meta) {
  signedDecoratorToMetaMap.set(Ctor, meta);
}

const defaultMeta = {
  apiMethods: EmptyObject,
  apiFields: EmptyObject,
  apiFieldsConfig: EmptyObject,
  wiredMethods: EmptyObject,
  wiredFields: EmptyObject,
  observedFields: EmptyObject
};

function getDecoratorsMeta(Ctor) {
  const meta = signedDecoratorToMetaMap.get(Ctor);
  return isUndefined$1(meta) ? defaultMeta : meta;
}

const signedTemplateSet = new Set();

function defaultEmptyTemplate() {
  return [];
}

signedTemplateSet.add(defaultEmptyTemplate);

function isTemplateRegistered(tpl) {
  return signedTemplateSet.has(tpl);
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 */


function registerTemplate(tpl) {
  signedTemplateSet.add(tpl); // chaining this method as a way to wrap existing
  // assignment of templates easily, without too much transformation

  return tpl;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// from the element instance, and get the value or set a new value on the component.
// This means that across different elements, similar names can get the exact same
// descriptor, so we can cache them:


const cachedGetterByKey = create$1(null);
const cachedSetterByKey = create$1(null);

function createGetter(key) {
  let fn = cachedGetterByKey[key];

  if (isUndefined$1(fn)) {
    fn = cachedGetterByKey[key] = function () {
      const vm = getAssociatedVM(this);
      const {
        getHook
      } = vm;
      return getHook(vm.component, key);
    };
  }

  return fn;
}

function createSetter(key) {
  let fn = cachedSetterByKey[key];

  if (isUndefined$1(fn)) {
    fn = cachedSetterByKey[key] = function (newValue) {
      const vm = getAssociatedVM(this);
      const {
        setHook
      } = vm;
      newValue = reactiveMembrane.getReadOnlyProxy(newValue);
      setHook(vm.component, key, newValue);
    };
  }

  return fn;
}

function createMethodCaller(methodName) {
  return function () {
    const vm = getAssociatedVM(this);
    const {
      callHook,
      component
    } = vm;
    const fn = component[methodName];
    return callHook(vm.component, fn, ArraySlice$2.call(arguments));
  };
}

function HTMLBridgeElementFactory(SuperClass, props, methods) {
  let HTMLBridgeElement;
  /**
   * Modern browsers will have all Native Constructors as regular Classes
   * and must be instantiated with the new keyword. In older browsers,
   * specifically IE11, those are objects with a prototype property defined,
   * since they are not supposed to be extended or instantiated with the
   * new keyword. This forking logic supports both cases, specifically because
   * wc.ts relies on the construction path of the bridges to create new
   * fully qualifying web components.
   */

  if (isFunction$1(SuperClass)) {
    HTMLBridgeElement = class extends SuperClass {};
  } else {
    HTMLBridgeElement = function () {
      // Bridge classes are not supposed to be instantiated directly in
      // browsers that do not support web components.
      throw new TypeError('Illegal constructor');
    }; // prototype inheritance dance


    setPrototypeOf$1(HTMLBridgeElement, SuperClass);
    setPrototypeOf$1(HTMLBridgeElement.prototype, SuperClass.prototype);
    defineProperty$1(HTMLBridgeElement.prototype, 'constructor', {
      writable: true,
      configurable: true,
      value: HTMLBridgeElement
    });
  }

  const descriptors = create$1(null); // expose getters and setters for each public props on the new Element Bridge

  for (let i = 0, len = props.length; i < len; i += 1) {
    const propName = props[i];
    descriptors[propName] = {
      get: createGetter(propName),
      set: createSetter(propName),
      enumerable: true,
      configurable: true
    };
  } // expose public methods as props on the new Element Bridge


  for (let i = 0, len = methods.length; i < len; i += 1) {
    const methodName = methods[i];
    descriptors[methodName] = {
      value: createMethodCaller(methodName),
      writable: true,
      configurable: true
    };
  }

  defineProperties$1(HTMLBridgeElement.prototype, descriptors);
  return HTMLBridgeElement;
}

const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElementConstructor, getOwnPropertyNames$1(HTMLElementOriginalDescriptors), []);
freeze$1(BaseBridgeElement);
seal$1(BaseBridgeElement.prototype);
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function resolveCircularModuleDependency(fn) {
  return fn();
}

function isCircularModuleDependency(obj) {
  return isFunction$1(obj) && hasOwnProperty$1.call(obj, '__circular__');
}
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const swappedTemplateMap = new WeakMap();
const swappedComponentMap = new WeakMap();
const swappedStyleMap = new WeakMap();
const activeTemplates = new WeakMap();
const activeComponents = new WeakMap();
const activeStyles = new WeakMap();

function flattenStylesheets(stylesheets) {
  const list = [];

  for (const stylesheet of stylesheets) {
    if (!Array.isArray(stylesheet)) {
      list.push(stylesheet);
    } else {
      list.push(...flattenStylesheets(stylesheet));
    }
  }

  return list;
}

function getTemplateOrSwappedTemplate(tpl) {

  const visited = new Set();

  while (swappedTemplateMap.has(tpl) && !visited.has(tpl)) {
    visited.add(tpl);
    tpl = swappedTemplateMap.get(tpl);
  }

  return tpl;
}

function getComponentOrSwappedComponent(Ctor) {

  const visited = new Set();

  while (swappedComponentMap.has(Ctor) && !visited.has(Ctor)) {
    visited.add(Ctor);
    Ctor = swappedComponentMap.get(Ctor);
  }

  return Ctor;
}

function getStyleOrSwappedStyle(style) {

  const visited = new Set();

  while (swappedStyleMap.has(style) && !visited.has(style)) {
    visited.add(style);
    style = swappedStyleMap.get(style);
  }

  return style;
}

function setActiveVM(vm) {


  const Ctor = vm.def.ctor;
  let componentVMs = activeComponents.get(Ctor);

  if (isUndefined$1(componentVMs)) {
    componentVMs = new Set();
    activeComponents.set(Ctor, componentVMs);
  } // this will allow us to keep track of the hot components


  componentVMs.add(vm); // tracking active template

  const tpl = vm.cmpTemplate;

  if (tpl) {
    let templateVMs = activeTemplates.get(tpl);

    if (isUndefined$1(templateVMs)) {
      templateVMs = new Set();
      activeTemplates.set(tpl, templateVMs);
    } // this will allow us to keep track of the templates that are
    // being used by a hot component


    templateVMs.add(vm); // tracking active styles associated to template

    const stylesheets = tpl.stylesheets;

    if (!isUndefined$1(stylesheets)) {
      flattenStylesheets(stylesheets).forEach(stylesheet => {
        // this is necessary because we don't hold the list of styles
        // in the vm, we only hold the selected (already swapped template)
        // but the styles attached to the template might not be the actual
        // active ones, but the swapped versions of those.
        stylesheet = getStyleOrSwappedStyle(stylesheet);
        let stylesheetVMs = activeStyles.get(stylesheet);

        if (isUndefined$1(stylesheetVMs)) {
          stylesheetVMs = new Set();
          activeStyles.set(stylesheet, stylesheetVMs);
        } // this will allow us to keep track of the stylesheet that are
        // being used by a hot component


        stylesheetVMs.add(vm);
      });
    }
  }
}

function removeActiveVM(vm) {


  const Ctor = vm.def.ctor;
  let list = activeComponents.get(Ctor);

  if (!isUndefined$1(list)) {
    // deleting the vm from the set to avoid leaking memory
    list.delete(vm);
  } // removing inactive template


  const tpl = vm.cmpTemplate;

  if (tpl) {
    list = activeTemplates.get(tpl);

    if (!isUndefined$1(list)) {
      // deleting the vm from the set to avoid leaking memory
      list.delete(vm);
    } // removing active styles associated to template


    const styles = tpl.stylesheets;

    if (!isUndefined$1(styles)) {
      flattenStylesheets(styles).forEach(style => {
        list = activeStyles.get(style);

        if (!isUndefined$1(list)) {
          // deleting the vm from the set to avoid leaking memory
          list.delete(vm);
        }
      });
    }
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const CtorToDefMap = new WeakMap();

function getCtorProto(Ctor) {
  let proto = getPrototypeOf$1(Ctor);

  if (isNull$1(proto)) {
    throw new ReferenceError(`Invalid prototype chain for ${Ctor.name}, you must extend LightningElement.`);
  } // covering the cases where the ref is circular in AMD


  if (isCircularModuleDependency(proto)) {
    const p = resolveCircularModuleDependency(proto);

    {
      if (isNull$1(p)) {
        throw new ReferenceError(`Circular module dependency for ${Ctor.name}, must resolve to a constructor that extends LightningElement.`);
      }
    } // escape hatch for Locker and other abstractions to provide their own base class instead
    // of our Base class without having to leak it to user-land. If the circular function returns
    // itself, that's the signal that we have hit the end of the proto chain, which must always
    // be base.


    proto = p === proto ? BaseLightningElement : p;
  }

  return proto;
}

function createComponentDef(Ctor) {
  {
    const ctorName = Ctor.name; // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
    // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);

    assert$1.isTrue(Ctor.constructor, `Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
  }

  const decoratorsMeta = getDecoratorsMeta(Ctor);
  const {
    apiFields,
    apiFieldsConfig,
    apiMethods,
    wiredFields,
    wiredMethods,
    observedFields
  } = decoratorsMeta;
  const proto = Ctor.prototype;
  let {
    connectedCallback,
    disconnectedCallback,
    renderedCallback,
    errorCallback,
    render
  } = proto;
  const superProto = getCtorProto(Ctor);
  const superDef = superProto !== BaseLightningElement ? getComponentInternalDef(superProto) : lightingElementDef;
  const bridge = HTMLBridgeElementFactory(superDef.bridge, keys$1(apiFields), keys$1(apiMethods));
  const props = assign$1(create$1(null), superDef.props, apiFields);
  const propsConfig = assign$1(create$1(null), superDef.propsConfig, apiFieldsConfig);
  const methods = assign$1(create$1(null), superDef.methods, apiMethods);
  const wire = assign$1(create$1(null), superDef.wire, wiredFields, wiredMethods);
  connectedCallback = connectedCallback || superDef.connectedCallback;
  disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
  renderedCallback = renderedCallback || superDef.renderedCallback;
  errorCallback = errorCallback || superDef.errorCallback;
  render = render || superDef.render;
  const template = getComponentRegisteredTemplate(Ctor) || superDef.template;
  const name = Ctor.name || superDef.name; // installing observed fields into the prototype.

  defineProperties$1(proto, observedFields);
  const def = {
    ctor: Ctor,
    name,
    wire,
    props,
    propsConfig,
    methods,
    bridge,
    template,
    connectedCallback,
    disconnectedCallback,
    renderedCallback,
    errorCallback,
    render
  };

  {
    freeze$1(Ctor.prototype);
  }

  return def;
}
/**
 * EXPERIMENTAL: This function allows for the identification of LWC constructors. This API is
 * subject to change or being removed.
 */


function isComponentConstructor(ctor) {
  if (!isFunction$1(ctor)) {
    return false;
  } // Fast path: LightningElement is part of the prototype chain of the constructor.


  if (ctor.prototype instanceof BaseLightningElement) {
    return true;
  } // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
  // climb up the constructor prototype chain to check in case there are circular dependencies
  // to resolve.


  let current = ctor;

  do {
    if (isCircularModuleDependency(current)) {
      const circularResolved = resolveCircularModuleDependency(current); // If the circular function returns itself, that's the signal that we have hit the end
      // of the proto chain, which must always be a valid base constructor.

      if (circularResolved === current) {
        return true;
      }

      current = circularResolved;
    }

    if (current === BaseLightningElement) {
      return true;
    }
  } while (!isNull$1(current) && (current = getPrototypeOf$1(current))); // Finally return false if the LightningElement is not part of the prototype chain.


  return false;
}

function getComponentInternalDef(Ctor) {
  {
    Ctor = getComponentOrSwappedComponent(Ctor);
  }

  let def = CtorToDefMap.get(Ctor);

  if (isUndefined$1(def)) {
    if (isCircularModuleDependency(Ctor)) {
      const resolvedCtor = resolveCircularModuleDependency(Ctor);
      def = getComponentInternalDef(resolvedCtor); // Cache the unresolved component ctor too. The next time if the same unresolved ctor is used,
      // look up the definition in cache instead of re-resolving and recreating the def.

      CtorToDefMap.set(Ctor, def);
      return def;
    }

    if (!isComponentConstructor(Ctor)) {
      throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
    }

    def = createComponentDef(Ctor);
    CtorToDefMap.set(Ctor, def);
  }

  return def;
}

const lightingElementDef = {
  ctor: BaseLightningElement,
  name: BaseLightningElement.name,
  props: lightningBasedDescriptors,
  propsConfig: EmptyObject,
  methods: EmptyObject,
  wire: EmptyObject,
  bridge: BaseBridgeElement,
  template: defaultEmptyTemplate,
  render: BaseLightningElement.prototype.render
};
var PropDefType;

(function (PropDefType) {
  PropDefType["any"] = "any";
})(PropDefType || (PropDefType = {}));
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const noop = () => void 0;

function observeElementChildNodes(elm) {
  elm.$domManual$ = true;
}

function setElementShadowToken(elm, token) {
  elm.$shadowToken$ = token;
}

function updateNodeHook(oldVnode, vnode) {
  const {
    elm,
    text,
    owner: {
      renderer
    }
  } = vnode;

  if (oldVnode.text !== text) {
    {
      unlockDomMutation();
    }

    renderer.setText(elm, text);

    {
      lockDomMutation();
    }
  }
}

function insertNodeHook(vnode, parentNode, referenceNode) {
  const {
    renderer
  } = vnode.owner;

  {
    unlockDomMutation();
  }

  renderer.insert(vnode.elm, parentNode, referenceNode);

  {
    lockDomMutation();
  }
}

function removeNodeHook(vnode, parentNode) {
  const {
    renderer
  } = vnode.owner;

  {
    unlockDomMutation();
  }

  renderer.remove(vnode.elm, parentNode);

  {
    lockDomMutation();
  }
}

function createElmHook(vnode) {
  modEvents.create(vnode); // Attrs need to be applied to element before props
  // IE11 will wipe out value on radio inputs if value
  // is set before type=radio.

  modAttrs.create(vnode);
  modProps.create(vnode);
  modStaticClassName.create(vnode);
  modStaticStyle.create(vnode);
  modComputedClassName.create(vnode);
  modComputedStyle.create(vnode);
}

var LWCDOMMode;

(function (LWCDOMMode) {
  LWCDOMMode["manual"] = "manual";
})(LWCDOMMode || (LWCDOMMode = {}));

function fallbackElmHook(elm, vnode) {
  const {
    owner
  } = vnode;

  if (isTrue$1$1(owner.renderer.syntheticShadow)) {
    const {
      data: {
        context
      }
    } = vnode;
    const {
      shadowAttribute
    } = owner.context;

    if (!isUndefined$1(context) && !isUndefined$1(context.lwc) && context.lwc.dom === LWCDOMMode.manual) {
      // this element will now accept any manual content inserted into it
      observeElementChildNodes(elm);
    } // when running in synthetic shadow mode, we need to set the shadowToken value
    // into each element from the template, so they can be styled accordingly.


    setElementShadowToken(elm, shadowAttribute);
  }

  {
    const {
      data: {
        context
      }
    } = vnode;
    const isPortal = !isUndefined$1(context) && !isUndefined$1(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
    patchElementWithRestrictions(elm, {
      isPortal
    });
  }
}

function updateElmHook(oldVnode, vnode) {
  // Attrs need to be applied to element before props
  // IE11 will wipe out value on radio inputs if value
  // is set before type=radio.
  modAttrs.update(oldVnode, vnode);
  modProps.update(oldVnode, vnode);
  modComputedClassName.update(oldVnode, vnode);
  modComputedStyle.update(oldVnode, vnode);
}

function updateChildrenHook(oldVnode, vnode) {
  const {
    children,
    owner
  } = vnode;
  const fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
  runWithBoundaryProtection(owner, owner.owner, noop, () => {
    fn(vnode.elm, oldVnode.children, children);
  }, noop);
}

function allocateChildrenHook(vnode, vm) {
  // A component with slots will re-render because:
  // 1- There is a change of the internal state.
  // 2- There is a change on the external api (ex: slots)
  //
  // In case #1, the vnodes in the cmpSlots will be reused since they didn't changed. This routine emptied the
  // slotted children when those VCustomElement were rendered and therefore in subsequent calls to allocate children
  // in a reused VCustomElement, there won't be any slotted children.
  // For those cases, we will use the reference for allocated children stored when rendering the fresh VCustomElement.
  //
  // In case #2, we will always get a fresh VCustomElement.
  const children = vnode.aChildren || vnode.children;
  vm.aChildren = children;

  if (isTrue$1$1(vm.renderer.syntheticShadow)) {
    // slow path
    allocateInSlot(vm, children); // save the allocated children in case this vnode is reused.

    vnode.aChildren = children; // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

    vnode.children = EmptyArray;
  }
}

function createViewModelHook(elm, vnode) {
  if (!isUndefined$1(getAssociatedVMIfPresent(elm))) {
    // There is a possibility that a custom element is registered under tagName,
    // in which case, the initialization is already carry on, and there is nothing else
    // to do here since this hook is called right after invoking `document.createElement`.
    return;
  }

  const {
    sel,
    mode,
    ctor,
    owner
  } = vnode;
  const def = getComponentInternalDef(ctor);

  if (isTrue$1$1(owner.renderer.syntheticShadow)) {
    const {
      shadowAttribute
    } = owner.context; // when running in synthetic shadow mode, we need to set the shadowToken value
    // into each element from the template, so they can be styled accordingly.

    setElementShadowToken(elm, shadowAttribute);
  }

  createVM(elm, def, {
    mode,
    owner,
    tagName: sel,
    renderer: owner.renderer
  });

  {
    assert$1.isTrue(isArray$2(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
  }
}

function createCustomElmHook(vnode) {
  modEvents.create(vnode); // Attrs need to be applied to element before props
  // IE11 will wipe out value on radio inputs if value
  // is set before type=radio.

  modAttrs.create(vnode);
  modProps.create(vnode);
  modStaticClassName.create(vnode);
  modStaticStyle.create(vnode);
  modComputedClassName.create(vnode);
  modComputedStyle.create(vnode);
}

function createChildrenHook(vnode) {
  const {
    elm,
    children
  } = vnode;

  for (let j = 0; j < children.length; ++j) {
    const ch = children[j];

    if (ch != null) {
      ch.hook.create(ch);
      ch.hook.insert(ch, elm, null);
    }
  }
}

function updateCustomElmHook(oldVnode, vnode) {
  // Attrs need to be applied to element before props
  // IE11 will wipe out value on radio inputs if value
  // is set before type=radio.
  modAttrs.update(oldVnode, vnode);
  modProps.update(oldVnode, vnode);
  modComputedClassName.update(oldVnode, vnode);
  modComputedStyle.update(oldVnode, vnode);
}

function removeElmHook(vnode) {
  // this method only needs to search on child vnodes from template
  // to trigger the remove hook just in case some of those children
  // are custom elements.
  const {
    children,
    elm
  } = vnode;

  for (let j = 0, len = children.length; j < len; ++j) {
    const ch = children[j];

    if (!isNull$1(ch)) {
      ch.hook.remove(ch, elm);
    }
  }
} // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


const FromIteration = new WeakMap(); // dynamic children means it was generated by an iteration
// in a template, and will require a more complex diffing algo.

function markAsDynamicChildren(children) {
  FromIteration.set(children, 1);
}

function hasDynamicChildren(children) {
  return FromIteration.has(children);
}
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function getUpgradableConstructor(tagName, renderer) {
  // Should never get a tag with upper case letter at this point, the compiler should
  // produce only tags with lowercase letters
  // But, for backwards compatibility, we will lower case the tagName
  tagName = tagName.toLowerCase();
  let CE = renderer.getCustomElement(tagName);

  if (!isUndefined$1(CE)) {
    return CE;
  }
  /**
   * LWC Upgradable Element reference to an element that was created
   * via the scoped registry mechanism, and that is ready to be upgraded.
   */


  CE = class LWCUpgradableElement extends renderer.HTMLElement {
    constructor(upgradeCallback) {
      super();

      if (isFunction$1(upgradeCallback)) {
        upgradeCallback(this); // nothing to do with the result for now
      }
    }

  };
  renderer.defineCustomElement(tagName, CE);
  return CE;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const CHAR_S = 115;
const CHAR_V = 118;
const CHAR_G = 103;
const NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
const SymbolIterator = Symbol.iterator;
const TextHook = {
  create: vnode => {
    const {
      renderer
    } = vnode.owner;
    const elm = renderer.createText(vnode.text);
    linkNodeToShadow(elm, vnode);
    vnode.elm = elm;
  },
  update: updateNodeHook,
  insert: insertNodeHook,
  move: insertNodeHook,
  remove: removeNodeHook
}; // insert is called after update, which is used somewhere else (via a module)
// to mark the vm as inserted, that means we cannot use update as the main channel
// to rehydrate when dirty, because sometimes the element is not inserted just yet,
// which breaks some invariants. For that reason, we have the following for any
// Custom Element that is inserted via a template.

const ElementHook = {
  create: vnode => {
    const {
      sel,
      data: {
        ns
      },
      owner: {
        renderer
      }
    } = vnode;
    const elm = renderer.createElement(sel, ns);
    linkNodeToShadow(elm, vnode);
    fallbackElmHook(elm, vnode);
    vnode.elm = elm;
    createElmHook(vnode);
  },
  update: (oldVnode, vnode) => {
    updateElmHook(oldVnode, vnode);
    updateChildrenHook(oldVnode, vnode);
  },
  insert: (vnode, parentNode, referenceNode) => {
    insertNodeHook(vnode, parentNode, referenceNode);
    createChildrenHook(vnode);
  },
  move: (vnode, parentNode, referenceNode) => {
    insertNodeHook(vnode, parentNode, referenceNode);
  },
  remove: (vnode, parentNode) => {
    removeNodeHook(vnode, parentNode);
    removeElmHook(vnode);
  }
};
const CustomElementHook = {
  create: vnode => {
    const {
      sel,
      owner: {
        renderer
      }
    } = vnode;
    const UpgradableConstructor = getUpgradableConstructor(sel, renderer);
    /**
     * Note: if the upgradable constructor does not expect, or throw when we new it
     * with a callback as the first argument, we could implement a more advanced
     * mechanism that only passes that argument if the constructor is known to be
     * an upgradable custom element.
     */

    const elm = new UpgradableConstructor(elm => {
      // the custom element from the registry is expecting an upgrade callback
      createViewModelHook(elm, vnode);
    });
    vnode.elm = elm;
    linkNodeToShadow(elm, vnode);
    const vm = getAssociatedVMIfPresent(elm);

    if (vm) {
      allocateChildrenHook(vnode, vm);
    } else if (vnode.ctor !== UpgradableConstructor) {
      throw new TypeError(`Incorrect Component Constructor`);
    }

    createCustomElmHook(vnode);
  },
  update: (oldVnode, vnode) => {
    updateCustomElmHook(oldVnode, vnode);
    const vm = getAssociatedVMIfPresent(vnode.elm);

    if (vm) {
      // in fallback mode, the allocation will always set children to
      // empty and delegate the real allocation to the slot elements
      allocateChildrenHook(vnode, vm);
    } // in fallback mode, the children will be always empty, so, nothing
    // will happen, but in native, it does allocate the light dom


    updateChildrenHook(oldVnode, vnode);

    if (vm) {
      {
        assert$1.isTrue(isArray$2(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
      } // this will probably update the shadowRoot, but only if the vm is in a dirty state
      // this is important to preserve the top to bottom synchronous rendering phase.


      rerenderVM(vm);
    }
  },
  insert: (vnode, parentNode, referenceNode) => {
    insertNodeHook(vnode, parentNode, referenceNode);
    const vm = getAssociatedVMIfPresent(vnode.elm);

    if (vm) {
      {
        assert$1.isTrue(vm.state === VMState.created, `${vm} cannot be recycled.`);
      }

      runConnectedCallback(vm);
    }

    createChildrenHook(vnode);

    if (vm) {
      appendVM(vm);
    }
  },
  move: (vnode, parentNode, referenceNode) => {
    insertNodeHook(vnode, parentNode, referenceNode);
  },
  remove: (vnode, parentNode) => {
    removeNodeHook(vnode, parentNode);
    const vm = getAssociatedVMIfPresent(vnode.elm);

    if (vm) {
      // for custom elements we don't have to go recursively because the removeVM routine
      // will take care of disconnecting any child VM attached to its shadow as well.
      removeVM(vm);
    }
  }
};

function linkNodeToShadow(elm, vnode) {
  // TODO [#1164]: this should eventually be done by the polyfill directly
  elm.$shadowResolver$ = vnode.owner.cmpRoot.$shadowResolver$;
} // TODO [#1136]: this should be done by the compiler, adding ns to every sub-element


function addNS(vnode) {
  const {
    data,
    children,
    sel
  } = vnode;
  data.ns = NamespaceAttributeForSVG; // TODO [#1275]: review why `sel` equal `foreignObject` should get this `ns`

  if (isArray$2(children) && sel !== 'foreignObject') {
    for (let j = 0, n = children.length; j < n; ++j) {
      const childNode = children[j];

      if (childNode != null && childNode.hook === ElementHook) {
        addNS(childNode);
      }
    }
  }
}

function addVNodeToChildLWC(vnode) {
  ArrayPush$1.call(getVMBeingRendered().velements, vnode);
} // [h]tml node


function h(sel, data, children) {
  const vmBeingRendered = getVMBeingRendered();

  {
    assert$1.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
    assert$1.isTrue(isObject$2(data), `h() 2nd argument data must be an object.`);
    assert$1.isTrue(isArray$2(children), `h() 3rd argument children must be an array.`);
    assert$1.isTrue('key' in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`); // checking reserved internal data properties

    assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

    if (data.style && !isString(data.style)) {
      logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
    }

    forEach$1.call(children, childVnode => {
      if (childVnode != null) {
        assert$1.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
      }
    });
  }

  const {
    key
  } = data;
  let text, elm;
  const vnode = {
    sel,
    data,
    children,
    text,
    elm,
    key,
    hook: ElementHook,
    owner: vmBeingRendered
  };

  if (sel.length === 3 && StringCharCodeAt$1.call(sel, 0) === CHAR_S && StringCharCodeAt$1.call(sel, 1) === CHAR_V && StringCharCodeAt$1.call(sel, 2) === CHAR_G) {
    addNS(vnode);
  }

  return vnode;
} // [t]ab[i]ndex function


function ti(value) {
  // if value is greater than 0, we normalize to 0
  // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
  // If value is less than -1, we don't care
  const shouldNormalize = value > 0 && !(isTrue$1$1(value) || isFalse$1$1(value));

  {
    const vmBeingRendered = getVMBeingRendered();

    if (shouldNormalize) {
      logError(`Invalid tabindex value \`${toString$1(value)}\` in template for ${vmBeingRendered}. This attribute must be set to 0 or -1.`, vmBeingRendered);
    }
  }

  return shouldNormalize ? 0 : value;
} // [s]lot element node


function s(slotName, data, children, slotset) {
  {
    assert$1.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
    assert$1.isTrue(isObject$2(data), `s() 2nd argument data must be an object.`);
    assert$1.isTrue(isArray$2(children), `h() 3rd argument children must be an array.`);
  }

  if (!isUndefined$1(slotset) && !isUndefined$1(slotset[slotName]) && slotset[slotName].length !== 0) {
    children = slotset[slotName];
  }

  const vnode = h('slot', data, children);

  if (vnode.owner.renderer.syntheticShadow) {
    // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
    sc(children);
  }

  return vnode;
} // [c]ustom element node


function c(sel, Ctor, data, children = EmptyArray) {
  const vmBeingRendered = getVMBeingRendered();

  {
    assert$1.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
    assert$1.isTrue(isFunction$1(Ctor), `c() 2nd argument Ctor must be a function.`);
    assert$1.isTrue(isObject$2(data), `c() 3nd argument data must be an object.`);
    assert$1.isTrue(arguments.length === 3 || isArray$2(children), `c() 4nd argument data must be an array.`); // checking reserved internal data properties

    assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

    if (data.style && !isString(data.style)) {
      logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
    }

    if (arguments.length === 4) {
      forEach$1.call(children, childVnode => {
        if (childVnode != null) {
          assert$1.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
        }
      });
    }
  }

  const {
    key
  } = data;
  let text, elm;
  const vnode = {
    sel,
    data,
    children,
    text,
    elm,
    key,
    hook: CustomElementHook,
    ctor: Ctor,
    owner: vmBeingRendered,
    mode: 'open'
  };
  addVNodeToChildLWC(vnode);
  return vnode;
} // [i]terable node


function i(iterable, factory) {
  const list = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

  sc(list);
  const vmBeingRendered = getVMBeingRendered();

  if (isUndefined$1(iterable) || iterable === null) {
    {
      logError(`Invalid template iteration for value "${toString$1(iterable)}" in ${vmBeingRendered}. It must be an Array or an iterable Object.`, vmBeingRendered);
    }

    return list;
  }

  {
    assert$1.isFalse(isUndefined$1(iterable[SymbolIterator]), `Invalid template iteration for value \`${toString$1(iterable)}\` in ${vmBeingRendered}. It must be an array-like object and not \`null\` nor \`undefined\`.`);
  }

  const iterator = iterable[SymbolIterator]();

  {
    assert$1.isTrue(iterator && isFunction$1(iterator.next), `Invalid iterator function for "${toString$1(iterable)}" in ${vmBeingRendered}.`);
  }

  let next = iterator.next();
  let j = 0;
  let {
    value,
    done: last
  } = next;
  let keyMap;
  let iterationError;

  {
    keyMap = create$1(null);
  }

  while (last === false) {
    // implementing a look-back-approach because we need to know if the element is the last
    next = iterator.next();
    last = next.done; // template factory logic based on the previous collected value

    const vnode = factory(value, j, j === 0, last);

    if (isArray$2(vnode)) {
      ArrayPush$1.apply(list, vnode);
    } else {
      ArrayPush$1.call(list, vnode);
    }

    {
      const vnodes = isArray$2(vnode) ? vnode : [vnode];
      forEach$1.call(vnodes, childVnode => {
        if (!isNull$1(childVnode) && isObject$2(childVnode) && !isUndefined$1(childVnode.sel)) {
          const {
            key
          } = childVnode;

          if (isString(key) || isNumber(key)) {
            if (keyMap[key] === 1 && isUndefined$1(iterationError)) {
              iterationError = `Duplicated "key" attribute value for "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. A key with value "${childVnode.key}" appears more than once in the iteration. Key values must be unique numbers or strings.`;
            }

            keyMap[key] = 1;
          } else if (isUndefined$1(iterationError)) {
            iterationError = `Invalid "key" attribute value in "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Set a unique "key" value on all iterated child elements.`;
          }
        }
      });
    } // preparing next value


    j += 1;
    value = next.value;
  }

  {
    if (!isUndefined$1(iterationError)) {
      logError(iterationError, vmBeingRendered);
    }
  }

  return list;
}
/**
 * [f]lattening
 */


function f(items) {
  {
    assert$1.isTrue(isArray$2(items), 'flattening api can only work with arrays.');
  }

  const len = items.length;
  const flattened = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

  sc(flattened);

  for (let j = 0; j < len; j += 1) {
    const item = items[j];

    if (isArray$2(item)) {
      ArrayPush$1.apply(flattened, item);
    } else {
      ArrayPush$1.call(flattened, item);
    }
  }

  return flattened;
} // [t]ext node


function t(text) {
  const data = EmptyObject;
  let sel, children, key, elm;
  return {
    sel,
    data,
    children,
    text,
    elm,
    key,
    hook: TextHook,
    owner: getVMBeingRendered()
  };
} // [d]ynamic value to produce a text vnode


function d(value) {
  if (value == null) {
    return null;
  }

  return t(value);
} // [b]ind function


function b(fn) {
  const vmBeingRendered = getVMBeingRendered();

  if (isNull$1(vmBeingRendered)) {
    throw new Error();
  }

  const vm = vmBeingRendered;
  return function (event) {
    invokeEventListener(vm, fn, vm.component, event);
  };
} // [k]ey function


function k(compilerKey, obj) {
  switch (typeof obj) {
    case 'number':
    case 'string':
      return compilerKey + ':' + obj;

    case 'object':
      {
        assert$1.fail(`Invalid key value "${obj}" in ${getVMBeingRendered()}. Key must be a string or number.`);
      }

  }
} // [g]lobal [id] function


function gid(id) {
  const vmBeingRendered = getVMBeingRendered();

  if (isUndefined$1(id) || id === '') {
    {
      logError(`Invalid id value "${id}". The id attribute must contain a non-empty string.`, vmBeingRendered);
    }

    return id;
  } // We remove attributes when they are assigned a value of null


  if (isNull$1(id)) {
    return null;
  }

  return `${id}-${vmBeingRendered.idx}`;
} // [f]ragment [id] function


function fid(url) {
  const vmBeingRendered = getVMBeingRendered();

  if (isUndefined$1(url) || url === '') {
    {
      if (isUndefined$1(url)) {
        logError(`Undefined url value for "href" or "xlink:href" attribute. Expected a non-empty string.`, vmBeingRendered);
      }
    }

    return url;
  } // We remove attributes when they are assigned a value of null


  if (isNull$1(url)) {
    return null;
  } // Apply transformation only for fragment-only-urls


  if (/^#/.test(url)) {
    return `${url}-${vmBeingRendered.idx}`;
  }

  return url;
}
/**
 * Map to store an index value assigned to any dynamic component reference ingested
 * by dc() api. This allows us to generate a unique unique per template per dynamic
 * component reference to avoid diffing algo mismatches.
 */


const DynamicImportedComponentMap = new Map();
let dynamicImportedComponentCounter = 0;
/**
 * create a dynamic component via `<x-foo lwc:dynamic={Ctor}>`
 */

function dc(sel, Ctor, data, children) {
  {
    assert$1.isTrue(isString(sel), `dc() 1st argument sel must be a string.`);
    assert$1.isTrue(isObject$2(data), `dc() 3nd argument data must be an object.`);
    assert$1.isTrue(arguments.length === 3 || isArray$2(children), `dc() 4nd argument data must be an array.`);
  } // null or undefined values should produce a null value in the VNodes


  if (Ctor == null) {
    return null;
  }

  if (!isComponentConstructor(Ctor)) {
    throw new Error(`Invalid LWC Constructor ${toString$1(Ctor)} for custom element <${sel}>.`);
  }

  let idx = DynamicImportedComponentMap.get(Ctor);

  if (isUndefined$1(idx)) {
    idx = dynamicImportedComponentCounter++;
    DynamicImportedComponentMap.set(Ctor, idx);
  } // the new vnode key is a mix of idx and compiler key, this is required by the diffing algo
  // to identify different constructors as vnodes with different keys to avoid reusing the
  // element used for previous constructors.


  data.key = `dc:${idx}:${data.key}`;
  return c(sel, Ctor, data, children);
}
/**
 * slow children collection marking mechanism. this API allows the compiler to signal
 * to the engine that a particular collection of children must be diffed using the slow
 * algo based on keys due to the nature of the list. E.g.:
 *
 *   - slot element's children: the content of the slot has to be dynamic when in synthetic
 *                              shadow mode because the `vnode.children` might be the slotted
 *                              content vs default content, in which case the size and the
 *                              keys are not matching.
 *   - children that contain dynamic components
 *   - children that are produced by iteration
 *
 */


function sc(vnodes) {
  {
    assert$1.isTrue(isArray$2(vnodes), 'sc() api can only work with arrays.');
  } // We have to mark the vnodes collection as dynamic so we can later on
  // choose to use the snabbdom virtual dom diffing algo instead of our
  // static dummy algo.


  markAsDynamicChildren(vnodes);
  return vnodes;
}

var api$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  h: h,
  ti: ti,
  s: s,
  c: c,
  i: i,
  f: f,
  t: t,
  d: d,
  b: b,
  k: k,
  gid: gid,
  fid: fid,
  dc: dc,
  sc: sc
});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function createShadowStyleVNode(content) {
  return h('style', {
    key: 'style',
    attrs: {
      type: 'text/css'
    }
  }, [t(content)]);
}

function updateSyntheticShadowAttributes(vm, template) {
  const {
    elm,
    context,
    renderer
  } = vm;
  const {
    stylesheets: newStylesheets,
    stylesheetTokens: newStylesheetTokens
  } = template;
  let newHostAttribute;
  let newShadowAttribute; // Reset the styling token applied to the host element.

  const oldHostAttribute = context.hostAttribute;

  if (!isUndefined$1(oldHostAttribute)) {
    renderer.removeAttribute(elm, oldHostAttribute);
  } // Apply the new template styling token to the host element, if the new template has any
  // associated stylesheets.


  if (!isUndefined$1(newStylesheetTokens) && !isUndefined$1(newStylesheets) && newStylesheets.length !== 0) {
    newHostAttribute = newStylesheetTokens.hostAttribute;
    newShadowAttribute = newStylesheetTokens.shadowAttribute;
    renderer.setAttribute(elm, newHostAttribute, '');
  } // Update the styling tokens present on the context object.


  context.hostAttribute = newHostAttribute;
  context.shadowAttribute = newShadowAttribute;
}

function evaluateStylesheetsContent(stylesheets, hostSelector, shadowSelector, nativeShadow) {
  const content = [];

  for (let i = 0; i < stylesheets.length; i++) {
    let stylesheet = stylesheets[i];

    if (isArray$2(stylesheet)) {
      ArrayPush$1.apply(content, evaluateStylesheetsContent(stylesheet, hostSelector, shadowSelector, nativeShadow));
    } else {
      {
        // in dev-mode, we support hot swapping of stylesheet, which means that
        // the component instance might be attempting to use an old version of
        // the stylesheet, while internally, we have a replacement for it.
        stylesheet = getStyleOrSwappedStyle(stylesheet);
      }

      ArrayPush$1.call(content, stylesheet(hostSelector, shadowSelector, nativeShadow));
    }
  }

  return content;
}

function getStylesheetsContent(vm, template) {
  const {
    stylesheets,
    stylesheetTokens: tokens
  } = template;
  const {
    syntheticShadow
  } = vm.renderer;
  let content = [];

  if (!isUndefined$1(stylesheets) && !isUndefined$1(tokens)) {
    const hostSelector = syntheticShadow ? `[${tokens.hostAttribute}]` : '';
    const shadowSelector = syntheticShadow ? `[${tokens.shadowAttribute}]` : '';
    content = evaluateStylesheetsContent(stylesheets, hostSelector, shadowSelector, !syntheticShadow);
  }

  return content;
}

function createStylesheet(vm, stylesheets) {
  const {
    renderer
  } = vm;

  if (renderer.syntheticShadow) {
    for (let i = 0; i < stylesheets.length; i++) {
      renderer.insertGlobalStylesheet(stylesheets[i]);
    }

    return null;
  } else {
    const shadowStyleSheetContent = ArrayJoin$1.call(stylesheets, '\n');
    return createShadowStyleVNode(shadowStyleSheetContent);
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


var GlobalMeasurementPhase;

(function (GlobalMeasurementPhase) {
  GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
  GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
})(GlobalMeasurementPhase || (GlobalMeasurementPhase = {})); // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
// JSDom (used in Jest) for example doesn't implement the UserTiming APIs.


const isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

function getMarkName(phase, vm) {
  // Adding the VM idx to the mark name creates a unique mark name component instance. This is necessary to produce
  // the right measures for components that are recursive.
  return `${getComponentTag(vm)} - ${phase} - ${vm.idx}`;
}

function getMeasureName(phase, vm) {
  return `${getComponentTag(vm)} - ${phase}`;
}

function start(markName) {
  performance.mark(markName);
}

function end(measureName, markName) {
  performance.measure(measureName, markName); // Clear the created marks and measure to avoid filling the performance entries buffer.
  // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.

  performance.clearMarks(markName);
  performance.clearMarks(measureName);
}

function noop$1() {
  /* do nothing */
}

const startMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
  const markName = getMarkName(phase, vm);
  start(markName);
};
const endMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
  const markName = getMarkName(phase, vm);
  const measureName = getMeasureName(phase, vm);
  end(measureName, markName);
};
const startGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
  const markName = isUndefined$1(vm) ? phase : getMarkName(phase, vm);
  start(markName);
};
const endGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
  const markName = isUndefined$1(vm) ? phase : getMarkName(phase, vm);
  end(phase, markName);
};
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function noop$2(_opId, _phase, _cmpName, _vm_idx) {}

let logOperation = noop$2;
var OperationId;

(function (OperationId) {
  OperationId[OperationId["constructor"] = 0] = "constructor";
  OperationId[OperationId["render"] = 1] = "render";
  OperationId[OperationId["patch"] = 2] = "patch";
  OperationId[OperationId["connectedCallback"] = 3] = "connectedCallback";
  OperationId[OperationId["renderedCallback"] = 4] = "renderedCallback";
  OperationId[OperationId["disconnectedCallback"] = 5] = "disconnectedCallback";
  OperationId[OperationId["errorCallback"] = 6] = "errorCallback";
})(OperationId || (OperationId = {}));

var Phase;

(function (Phase) {
  Phase[Phase["Start"] = 0] = "Start";
  Phase[Phase["Stop"] = 1] = "Stop";
})(Phase || (Phase = {}));

const opIdToMeasurementPhaseMappingArray = ['constructor', 'render', 'patch', 'connectedCallback', 'renderedCallback', 'disconnectedCallback', 'errorCallback'];
let profilerEnabled = false;
let logMarks = false;
let bufferLogging = false;

{
  profilerEnabled = true;
  logMarks = true;
  bufferLogging = false;
}

function trackProfilerState(callback) {
  callback(profilerEnabled);
}

function logOperationStart(opId, vm) {
  if (logMarks) {
    startMeasure(opIdToMeasurementPhaseMappingArray[opId], vm);
  }

  if (bufferLogging) {
    logOperation(opId, Phase.Start, vm.tagName, vm.idx);
  }
}

function logOperationEnd(opId, vm) {
  if (logMarks) {
    endMeasure(opIdToMeasurementPhaseMappingArray[opId], vm);
  }

  if (bufferLogging) {
    logOperation(opId, Phase.Stop, vm.tagName, vm.idx);
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

let isUpdatingTemplate = false;
let vmBeingRendered = null;

function getVMBeingRendered() {
  return vmBeingRendered;
}

function setVMBeingRendered(vm) {
  vmBeingRendered = vm;
}

let profilerEnabled$1 = false;
trackProfilerState(t => profilerEnabled$1 = t);

function validateSlots(vm, html) {

  const {
    cmpSlots
  } = vm;
  const {
    slots = EmptyArray
  } = html;

  for (const slotName in cmpSlots) {
    // eslint-disable-next-line lwc-internal/no-production-assert
    assert$1.isTrue(isArray$2(cmpSlots[slotName]), `Slots can only be set to an array, instead received ${toString$1(cmpSlots[slotName])} for slot "${slotName}" in ${vm}.`);

    if (slotName !== '' && ArrayIndexOf$1.call(slots, slotName) === -1) {
      // TODO [#1297]: this should never really happen because the compiler should always validate
      // eslint-disable-next-line lwc-internal/no-production-assert
      logError(`Ignoring unknown provided slot name "${slotName}" in ${vm}. Check for a typo on the slot attribute.`, vm);
    }
  }
}

function evaluateTemplate(vm, html) {
  {
    assert$1.isTrue(isFunction$1(html), `evaluateTemplate() second argument must be an imported template instead of ${toString$1(html)}`); // in dev-mode, we support hot swapping of templates, which means that
    // the component instance might be attempting to use an old version of
    // the template, while internally, we have a replacement for it.

    html = getTemplateOrSwappedTemplate(html);
  }

  const isUpdatingTemplateInception = isUpdatingTemplate;
  const vmOfTemplateBeingUpdatedInception = vmBeingRendered;
  let vnodes = [];
  runWithBoundaryProtection(vm, vm.owner, () => {
    // pre
    vmBeingRendered = vm;

    if (profilerEnabled$1) {
      logOperationStart(OperationId.render, vm);
    }
  }, () => {
    // job
    const {
      component,
      context,
      cmpSlots,
      cmpTemplate,
      tro,
      renderer
    } = vm;
    tro.observe(() => {
      // Reset the cache memoizer for template when needed.
      if (html !== cmpTemplate) {
        // Perf opt: do not reset the shadow root during the first rendering (there is
        // nothing to reset).
        if (!isNull$1(cmpTemplate)) {
          // It is important to reset the content to avoid reusing similar elements
          // generated from a different template, because they could have similar IDs,
          // and snabbdom just rely on the IDs.
          resetShadowRoot(vm);
        } // Check that the template was built by the compiler.


        if (!isTemplateRegistered(html)) {
          throw new TypeError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString$1(html)}.`);
        }

        vm.cmpTemplate = html; // Create a brand new template cache for the swapped templated.

        context.tplCache = create$1(null); // Update the synthetic shadow attributes on the host element if necessary.

        if (renderer.syntheticShadow) {
          updateSyntheticShadowAttributes(vm, html);
        } // Evaluate, create stylesheet and cache the produced VNode for future
        // re-rendering.


        const stylesheetsContent = getStylesheetsContent(vm, html);
        context.styleVNode = stylesheetsContent.length === 0 ? null : createStylesheet(vm, stylesheetsContent);
      }

      if ("development" !== 'production') {
        // validating slots in every rendering since the allocated content might change over time
        validateSlots(vm, html); // add the VM to the list of host VMs that can be re-rendered if html is swapped

        setActiveVM(vm);
      } // right before producing the vnodes, we clear up all internal references
      // to custom elements from the template.


      vm.velements = []; // Set the global flag that template is being updated

      isUpdatingTemplate = true;
      vnodes = html.call(undefined, api$1, component, cmpSlots, context.tplCache);
      const {
        styleVNode
      } = context;

      if (!isNull$1(styleVNode)) {
        ArrayUnshift$2.call(vnodes, styleVNode);
      }
    });
  }, () => {
    // post
    isUpdatingTemplate = isUpdatingTemplateInception;
    vmBeingRendered = vmOfTemplateBeingUpdatedInception;

    if (profilerEnabled$1) {
      logOperationEnd(OperationId.render, vm);
    }
  });

  {
    assert$1.invariant(isArray$2(vnodes), `Compiler should produce html functions that always return an array.`);
  }

  return vnodes;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


function addErrorComponentStack(vm, error) {
  if (!isFrozen$1(error) && isUndefined$1(error.wcStack)) {
    const wcStack = getErrorComponentStack(vm);
    defineProperty$1(error, 'wcStack', {
      get() {
        return wcStack;
      }

    });
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


let isInvokingRender = false;
let vmBeingConstructed = null;

function isBeingConstructed(vm) {
  return vmBeingConstructed === vm;
}

let profilerEnabled$2 = false;
trackProfilerState(t => profilerEnabled$2 = t);

const noop$3 = () => void 0;

function invokeComponentCallback(vm, fn, args) {
  const {
    component,
    callHook,
    owner
  } = vm;
  let result;
  runWithBoundaryProtection(vm, owner, noop$3, () => {
    // job
    result = callHook(component, fn, args);
  }, noop$3);
  return result;
}

function invokeComponentConstructor(vm, Ctor) {
  const vmBeingConstructedInception = vmBeingConstructed;
  let error;

  if (profilerEnabled$2) {
    logOperationStart(OperationId.constructor, vm);
  }

  vmBeingConstructed = vm;
  /**
   * Constructors don't need to be wrapped with a boundary because for root elements
   * it should throw, while elements from template are already wrapped by a boundary
   * associated to the diffing algo.
   */

  try {
    // job
    const result = new Ctor(); // Check indirectly if the constructor result is an instance of LightningElement. Using
    // the "instanceof" operator would not work here since Locker Service provides its own
    // implementation of LightningElement, so we indirectly check if the base constructor is
    // invoked by accessing the component on the vm.

    if (vmBeingConstructed.component !== result) {
      throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
    }
  } catch (e) {
    error = Object(e);
  } finally {
    if (profilerEnabled$2) {
      logOperationEnd(OperationId.constructor, vm);
    }

    vmBeingConstructed = vmBeingConstructedInception;

    if (!isUndefined$1(error)) {
      addErrorComponentStack(vm, error); // re-throwing the original error annotated after restoring the context

      throw error; // eslint-disable-line no-unsafe-finally
    }
  }
}

function invokeComponentRenderMethod(vm) {
  const {
    def: {
      render
    },
    callHook,
    component,
    owner
  } = vm;
  const isRenderBeingInvokedInception = isInvokingRender;
  const vmBeingRenderedInception = getVMBeingRendered();
  let html;
  let renderInvocationSuccessful = false;
  runWithBoundaryProtection(vm, owner, () => {
    // pre
    isInvokingRender = true;
    setVMBeingRendered(vm);
  }, () => {
    // job
    vm.tro.observe(() => {
      html = callHook(component, render);
      renderInvocationSuccessful = true;
    });
  }, () => {
    // post
    isInvokingRender = isRenderBeingInvokedInception;
    setVMBeingRendered(vmBeingRenderedInception);
  }); // If render() invocation failed, process errorCallback in boundary and return an empty template

  return renderInvocationSuccessful ? evaluateTemplate(vm, html) : [];
}

function invokeComponentRenderedCallback(vm) {
  const {
    def: {
      renderedCallback
    },
    component,
    callHook,
    owner
  } = vm;

  if (!isUndefined$1(renderedCallback)) {
    runWithBoundaryProtection(vm, owner, () => {
      if (profilerEnabled$2) {
        logOperationStart(OperationId.renderedCallback, vm);
      }
    }, () => {
      // job
      callHook(component, renderedCallback);
    }, () => {
      // post
      if (profilerEnabled$2) {
        logOperationEnd(OperationId.renderedCallback, vm);
      }
    });
  }
}

function invokeEventListener(vm, fn, thisValue, event) {
  const {
    callHook,
    owner
  } = vm;
  runWithBoundaryProtection(vm, owner, noop$3, () => {
    // job
    if ("development" !== 'production') {
      assert$1.isTrue(isFunction$1(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
    }

    callHook(thisValue, fn, [event]);
  }, noop$3);
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const signedTemplateMap = new Map();
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 */

function registerComponent(Ctor, {
  tmpl
}) {
  signedTemplateMap.set(Ctor, tmpl); // chaining this method as a way to wrap existing assignment of component constructor easily,
  // without too much transformation

  return Ctor;
}

function getComponentRegisteredTemplate(Ctor) {
  return signedTemplateMap.get(Ctor);
}

function createComponent(vm, Ctor) {
  // create the component instance
  invokeComponentConstructor(vm, Ctor);

  if (isUndefined$1(vm.component)) {
    throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
  }
}

function getTemplateReactiveObserver(vm) {
  return new ReactiveObserver(() => {
    const {
      isDirty
    } = vm;

    if (isFalse$1$1(isDirty)) {
      markComponentAsDirty(vm);
      scheduleRehydration(vm);
    }
  });
}

function renderComponent(vm) {
  {
    assert$1.invariant(vm.isDirty, `${vm} is not dirty.`);
  }

  vm.tro.reset();
  const vnodes = invokeComponentRenderMethod(vm);
  vm.isDirty = false;
  vm.isScheduled = false;

  {
    assert$1.invariant(isArray$2(vnodes), `${vm}.render() should always return an array of vnodes instead of ${vnodes}`);
  }

  return vnodes;
}

function markComponentAsDirty(vm) {
  {
    const vmBeingRendered = getVMBeingRendered();
    assert$1.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
    assert$1.isFalse(isInvokingRender, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
    assert$1.isFalse(isUpdatingTemplate, `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`);
  }

  vm.isDirty = true;
}

const cmpEventListenerMap = new WeakMap();

function getWrappedComponentsListener(vm, listener) {
  if (!isFunction$1(listener)) {
    throw new TypeError(); // avoiding problems with non-valid listeners
  }

  let wrappedListener = cmpEventListenerMap.get(listener);

  if (isUndefined$1(wrappedListener)) {
    wrappedListener = function (event) {
      invokeEventListener(vm, listener, undefined, event);
    };

    cmpEventListenerMap.set(listener, wrappedListener);
  }

  return wrappedListener;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const Services = create$1(null);

function invokeServiceHook(vm, cbs) {
  {
    assert$1.isTrue(isArray$2(cbs) && cbs.length > 0, `Optimize invokeServiceHook() to be invoked only when needed`);
  }

  const {
    component,
    def,
    context
  } = vm;

  for (let i = 0, len = cbs.length; i < len; ++i) {
    cbs[i].call(undefined, component, {}, def, context);
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


var VMState;

(function (VMState) {
  VMState[VMState["created"] = 0] = "created";
  VMState[VMState["connected"] = 1] = "connected";
  VMState[VMState["disconnected"] = 2] = "disconnected";
})(VMState || (VMState = {}));

let profilerEnabled$3 = false;
trackProfilerState(t => profilerEnabled$3 = t);
let idx = 0;
/** The internal slot used to associate different objects the engine manipulates with the VM */

const ViewModelReflection = createHiddenField$1('ViewModel', 'engine');

function callHook(cmp, fn, args = []) {
  return fn.apply(cmp, args);
}

function setHook(cmp, prop, newValue) {
  cmp[prop] = newValue;
}

function getHook(cmp, prop) {
  return cmp[prop];
}

function rerenderVM(vm) {
  rehydrate(vm);
}

function connectRootElement(elm) {
  const vm = getAssociatedVM(elm);
  startGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm); // Usually means moving the element from one place to another, which is observable via
  // life-cycle hooks.

  if (vm.state === VMState.connected) {
    disconnectRootElement(elm);
  }

  runConnectedCallback(vm);
  rehydrate(vm);
  endGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm);
}

function disconnectRootElement(elm) {
  const vm = getAssociatedVM(elm);
  resetComponentStateWhenRemoved(vm);
}

function appendVM(vm) {
  rehydrate(vm);
} // just in case the component comes back, with this we guarantee re-rendering it
// while preventing any attempt to rehydration until after reinsertion.


function resetComponentStateWhenRemoved(vm) {
  const {
    state
  } = vm;

  if (state !== VMState.disconnected) {
    const {
      oar,
      tro
    } = vm; // Making sure that any observing record will not trigger the rehydrated on this vm

    tro.reset(); // Making sure that any observing accessor record will not trigger the setter to be reinvoked

    for (const key in oar) {
      oar[key].reset();
    }

    runDisconnectedCallback(vm); // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)

    runShadowChildNodesDisconnectedCallback(vm);
    runLightChildNodesDisconnectedCallback(vm);
  }
} // this method is triggered by the diffing algo only when a vnode from the
// old vnode.children is removed from the DOM.


function removeVM(vm) {
  {
    removeActiveVM(vm);
    assert$1.isTrue(vm.state === VMState.connected || vm.state === VMState.disconnected, `${vm} must have been connected.`);
  }

  resetComponentStateWhenRemoved(vm);
}

function createVM(elm, def, options) {
  const {
    mode,
    owner,
    renderer,
    tagName
  } = options;
  const vm = {
    elm,
    def,
    idx: idx++,
    state: VMState.created,
    isScheduled: false,
    isDirty: true,
    tagName,
    mode,
    owner,
    renderer,
    children: EmptyArray,
    aChildren: EmptyArray,
    velements: EmptyArray,
    cmpProps: create$1(null),
    cmpFields: create$1(null),
    cmpSlots: create$1(null),
    oar: create$1(null),
    cmpTemplate: null,
    context: {
      hostAttribute: undefined,
      shadowAttribute: undefined,
      styleVNode: null,
      tplCache: EmptyObject,
      wiredConnecting: EmptyArray,
      wiredDisconnecting: EmptyArray
    },
    tro: null,
    component: null,
    cmpRoot: null,
    callHook,
    setHook,
    getHook
  };
  vm.tro = getTemplateReactiveObserver(vm);

  {
    vm.toString = () => {
      return `[object:vm ${def.name} (${vm.idx})]`;
    };
  } // Create component instance associated to the vm and the element.


  createComponent(vm, def.ctor); // Initializing the wire decorator per instance only when really needed

  if (isFalse$1$1(renderer.ssr) && hasWireAdapters(vm)) {
    installWireAdapters(vm);
  }

  return vm;
}

function assertIsVM(obj) {
  if (isNull$1(obj) || !isObject$2(obj) || !('cmpRoot' in obj)) {
    throw new TypeError(`${obj} is not a VM.`);
  }
}

function associateVM(obj, vm) {
  setHiddenField$1(obj, ViewModelReflection, vm);
}

function getAssociatedVM(obj) {
  const vm = getHiddenField$1(obj, ViewModelReflection);

  {
    assertIsVM(vm);
  }

  return vm;
}

function getAssociatedVMIfPresent(obj) {
  const maybeVm = getHiddenField$1(obj, ViewModelReflection);

  {
    if (!isUndefined$1(maybeVm)) {
      assertIsVM(maybeVm);
    }
  }

  return maybeVm;
}

function rehydrate(vm) {
  if (isTrue$1$1(vm.isDirty)) {
    const children = renderComponent(vm);
    patchShadowRoot(vm, children);
  }
}

function patchShadowRoot(vm, newCh) {
  const {
    cmpRoot,
    children: oldCh
  } = vm; // caching the new children collection

  vm.children = newCh;

  if (newCh.length > 0 || oldCh.length > 0) {
    // patch function mutates vnodes by adding the element reference,
    // however, if patching fails it contains partial changes.
    if (oldCh !== newCh) {
      const fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
      runWithBoundaryProtection(vm, vm, () => {
        // pre
        if (profilerEnabled$3) {
          logOperationStart(OperationId.patch, vm);
        }
      }, () => {
        // job
        fn(cmpRoot, oldCh, newCh);
      }, () => {
        // post
        if (profilerEnabled$3) {
          logOperationEnd(OperationId.patch, vm);
        }
      });
    }
  }

  if (vm.state === VMState.connected) {
    // If the element is connected, that means connectedCallback was already issued, and
    // any successive rendering should finish with the call to renderedCallback, otherwise
    // the connectedCallback will take care of calling it in the right order at the end of
    // the current rehydration process.
    runRenderedCallback(vm);
  }
}

function runRenderedCallback(vm) {
  if (isTrue$1$1(vm.renderer.ssr)) {
    return;
  }

  const {
    rendered
  } = Services;

  if (rendered) {
    invokeServiceHook(vm, rendered);
  }

  invokeComponentRenderedCallback(vm);
}

let rehydrateQueue = [];

function flushRehydrationQueue() {
  startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);

  {
    assert$1.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
  }

  const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
  rehydrateQueue = []; // reset to a new queue

  for (let i = 0, len = vms.length; i < len; i += 1) {
    const vm = vms[i];

    try {
      rehydrate(vm);
    } catch (error) {
      if (i + 1 < len) {
        // pieces of the queue are still pending to be rehydrated, those should have priority
        if (rehydrateQueue.length === 0) {
          addCallbackToNextTick(flushRehydrationQueue);
        }

        ArrayUnshift$2.apply(rehydrateQueue, ArraySlice$2.call(vms, i + 1));
      } // we need to end the measure before throwing.


      endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE); // re-throwing the original error will break the current tick, but since the next tick is
      // already scheduled, it should continue patching the rest.

      throw error; // eslint-disable-line no-unsafe-finally
    }
  }

  endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
}

function runConnectedCallback(vm) {
  const {
    state
  } = vm;

  if (state === VMState.connected) {
    return; // nothing to do since it was already connected
  }

  vm.state = VMState.connected; // reporting connection

  const {
    connected
  } = Services;

  if (connected) {
    invokeServiceHook(vm, connected);
  }

  if (hasWireAdapters(vm)) {
    connectWireAdapters(vm);
  }

  const {
    connectedCallback
  } = vm.def;

  if (!isUndefined$1(connectedCallback)) {
    if (profilerEnabled$3) {
      logOperationStart(OperationId.connectedCallback, vm);
    }

    invokeComponentCallback(vm, connectedCallback);

    if (profilerEnabled$3) {
      logOperationEnd(OperationId.connectedCallback, vm);
    }
  }
}

function hasWireAdapters(vm) {
  return getOwnPropertyNames$1(vm.def.wire).length > 0;
}

function runDisconnectedCallback(vm) {
  {
    assert$1.isTrue(vm.state !== VMState.disconnected, `${vm} must be inserted.`);
  }

  if (isFalse$1$1(vm.isDirty)) {
    // this guarantees that if the component is reused/reinserted,
    // it will be re-rendered because we are disconnecting the reactivity
    // linking, so mutations are not automatically reflected on the state
    // of disconnected components.
    vm.isDirty = true;
  }

  vm.state = VMState.disconnected; // reporting disconnection

  const {
    disconnected
  } = Services;

  if (disconnected) {
    invokeServiceHook(vm, disconnected);
  }

  if (hasWireAdapters(vm)) {
    disconnectWireAdapters(vm);
  }

  const {
    disconnectedCallback
  } = vm.def;

  if (!isUndefined$1(disconnectedCallback)) {
    if (profilerEnabled$3) {
      logOperationStart(OperationId.disconnectedCallback, vm);
    }

    invokeComponentCallback(vm, disconnectedCallback);

    if (profilerEnabled$3) {
      logOperationEnd(OperationId.disconnectedCallback, vm);
    }
  }
}

function runShadowChildNodesDisconnectedCallback(vm) {
  const {
    velements: vCustomElementCollection
  } = vm; // Reporting disconnection for every child in inverse order since they are
  // inserted in reserved order.

  for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
    const {
      elm
    } = vCustomElementCollection[i]; // There are two cases where the element could be undefined:
    // * when there is an error during the construction phase, and an error
    //   boundary picks it, there is a possibility that the VCustomElement
    //   is not properly initialized, and therefore is should be ignored.
    // * when slotted custom element is not used by the element where it is
    //   slotted into it, as  a result, the custom element was never
    //   initialized.

    if (!isUndefined$1(elm)) {
      const childVM = getAssociatedVMIfPresent(elm); // The VM associated with the element might be associated undefined
      // in the case where the VM failed in the middle of its creation,
      // eg: constructor throwing before invoking super().

      if (!isUndefined$1(childVM)) {
        resetComponentStateWhenRemoved(childVM);
      }
    }
  }
}

function runLightChildNodesDisconnectedCallback(vm) {
  const {
    aChildren: adoptedChildren
  } = vm;
  recursivelyDisconnectChildren(adoptedChildren);
}
/**
 * The recursion doesn't need to be a complete traversal of the vnode graph,
 * instead it can be partial, when a custom element vnode is found, we don't
 * need to continue into its children because by attempting to disconnect the
 * custom element itself will trigger the removal of anything slotted or anything
 * defined on its shadow.
 */


function recursivelyDisconnectChildren(vnodes) {
  for (let i = 0, len = vnodes.length; i < len; i += 1) {
    const vnode = vnodes[i];

    if (!isNull$1(vnode) && isArray$2(vnode.children) && !isUndefined$1(vnode.elm)) {
      // vnode is a VElement with children
      if (isUndefined$1(vnode.ctor)) {
        // it is a VElement, just keep looking (recursively)
        recursivelyDisconnectChildren(vnode.children);
      } else {
        // it is a VCustomElement, disconnect it and ignore its children
        resetComponentStateWhenRemoved(getAssociatedVM(vnode.elm));
      }
    }
  }
} // This is a super optimized mechanism to remove the content of the shadowRoot without having to go
// into snabbdom. Especially useful when the reset is a consequence of an error, in which case the
// children VNodes might not be representing the current state of the DOM.


function resetShadowRoot(vm) {
  const {
    children,
    cmpRoot,
    renderer
  } = vm;

  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];

    if (!isNull$1(child) && !isUndefined$1(child.elm)) {
      renderer.remove(child.elm, cmpRoot);
    }
  }

  vm.children = EmptyArray;
  runShadowChildNodesDisconnectedCallback(vm);
  vm.velements = EmptyArray;
}

function scheduleRehydration(vm) {
  if (isTrue$1$1(vm.renderer.ssr) || isTrue$1$1(vm.isScheduled)) {
    return;
  }

  vm.isScheduled = true;

  if (rehydrateQueue.length === 0) {
    addCallbackToNextTick(flushRehydrationQueue);
  }

  ArrayPush$1.call(rehydrateQueue, vm);
}

function getErrorBoundaryVM(vm) {
  let currentVm = vm;

  while (!isNull$1(currentVm)) {
    if (!isUndefined$1(currentVm.def.errorCallback)) {
      return currentVm;
    }

    currentVm = currentVm.owner;
  }
} // slow path routine
// NOTE: we should probably more this routine to the synthetic shadow folder
// and get the allocation to be cached by in the elm instead of in the VM


function allocateInSlot(vm, children) {
  {
    assert$1.invariant(isObject$2(vm.cmpSlots), `When doing manual allocation, there must be a cmpSlots object available.`);
  }

  const {
    cmpSlots: oldSlots
  } = vm;
  const cmpSlots = vm.cmpSlots = create$1(null);

  for (let i = 0, len = children.length; i < len; i += 1) {
    const vnode = children[i];

    if (isNull$1(vnode)) {
      continue;
    }

    const {
      data
    } = vnode;
    const slotName = data.attrs && data.attrs.slot || '';
    const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
    // which might have similar keys. Each vnode will always have a key that
    // starts with a numeric character from compiler. In this case, we add a unique
    // notation for slotted vnodes keys, e.g.: `@foo:1:1`

    if (!isUndefined$1(vnode.key)) {
      vnode.key = `@${slotName}:${vnode.key}`;
    }

    ArrayPush$1.call(vnodes, vnode);
  }

  if (isFalse$1$1(vm.isDirty)) {
    // We need to determine if the old allocation is really different from the new one
    // and mark the vm as dirty
    const oldKeys = keys$1(oldSlots);

    if (oldKeys.length !== keys$1(cmpSlots).length) {
      markComponentAsDirty(vm);
      return;
    }

    for (let i = 0, len = oldKeys.length; i < len; i += 1) {
      const key = oldKeys[i];

      if (isUndefined$1(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
        markComponentAsDirty(vm);
        return;
      }

      const oldVNodes = oldSlots[key];
      const vnodes = cmpSlots[key];

      for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
        if (oldVNodes[j] !== vnodes[j]) {
          markComponentAsDirty(vm);
          return;
        }
      }
    }
  }
}

function runWithBoundaryProtection(vm, owner, pre, job, post) {
  let error;
  pre();

  try {
    job();
  } catch (e) {
    error = Object(e);
  } finally {
    post();

    if (!isUndefined$1(error)) {
      addErrorComponentStack(vm, error);
      const errorBoundaryVm = isNull$1(owner) ? undefined : getErrorBoundaryVM(owner);

      if (isUndefined$1(errorBoundaryVm)) {
        throw error; // eslint-disable-line no-unsafe-finally
      }

      resetShadowRoot(vm); // remove offenders

      if (profilerEnabled$3) {
        logOperationStart(OperationId.errorCallback, vm);
      } // error boundaries must have an ErrorCallback


      const errorCallback = errorBoundaryVm.def.errorCallback;
      invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);

      if (profilerEnabled$3) {
        logOperationEnd(OperationId.errorCallback, vm);
      }
    }
  }
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const DeprecatedWiredElementHost = '$$DeprecatedWiredElementHostKey$$';
const DeprecatedWiredParamsMeta = '$$DeprecatedWiredParamsMetaKey$$';
const WireMetaMap = new Map();

function noop$4() {}

class WireContextRegistrationEvent extends CustomEvent {
  constructor(adapterToken, {
    setNewContext,
    setDisconnectedCallback
  }) {
    super(adapterToken, {
      bubbles: true,
      composed: true
    });
    defineProperties$1(this, {
      setNewContext: {
        value: setNewContext
      },
      setDisconnectedCallback: {
        value: setDisconnectedCallback
      }
    });
  }

}

function createFieldDataCallback(vm, name) {
  const {
    cmpFields
  } = vm;
  return value => {
    if (value !== vm.cmpFields[name]) {
      // storing the value in the underlying storage
      cmpFields[name] = value;
      componentValueMutated(vm, name);
    }
  };
}

function createMethodDataCallback(vm, method) {
  return value => {
    // dispatching new value into the wired method
    runWithBoundaryProtection(vm, vm.owner, noop$4, () => {
      // job
      method.call(vm.component, value);
    }, noop$4);
  };
}

function createConfigWatcher(vm, wireDef, callbackWhenConfigIsReady) {
  const {
    component
  } = vm;
  const {
    configCallback
  } = wireDef;
  let hasPendingConfig = false; // creating the reactive observer for reactive params when needed

  const ro = new ReactiveObserver(() => {
    if (hasPendingConfig === false) {
      hasPendingConfig = true; // collect new config in the micro-task

      Promise.resolve().then(() => {
        hasPendingConfig = false; // resetting current reactive params

        ro.reset(); // dispatching a new config due to a change in the configuration

        callback();
      });
    }
  });

  const callback = () => {
    let config;
    ro.observe(() => config = configCallback(component)); // eslint-disable-next-line lwc-internal/no-invalid-todo
    // TODO: dev-mode validation of config based on the adapter.configSchema
    // @ts-ignore it is assigned in the observe() callback

    callbackWhenConfigIsReady(config);
  };

  return callback;
}

function createContextWatcher(vm, wireDef, callbackWhenContextIsReady) {
  const {
    adapter
  } = wireDef;
  const adapterContextToken = getAdapterToken(adapter);

  if (isUndefined$1(adapterContextToken)) {
    return; // no provider found, nothing to be done
  }

  const {
    elm,
    renderer,
    context: {
      wiredConnecting,
      wiredDisconnecting
    }
  } = vm; // waiting for the component to be connected to formally request the context via the token

  ArrayPush$1.call(wiredConnecting, () => {
    // This event is responsible for connecting the host element with another
    // element in the composed path that is providing contextual data. The provider
    // must be listening for a special dom event with the name corresponding to the value of
    // `adapterContextToken`, which will remain secret and internal to this file only to
    // guarantee that the linkage can be forged.
    const contextRegistrationEvent = new WireContextRegistrationEvent(adapterContextToken, {
      setNewContext(newContext) {
        // eslint-disable-next-line lwc-internal/no-invalid-todo
        // TODO: dev-mode validation of config based on the adapter.contextSchema
        callbackWhenContextIsReady(newContext);
      },

      setDisconnectedCallback(disconnectCallback) {
        // adds this callback into the disconnect bucket so it gets disconnected from parent
        // the the element hosting the wire is disconnected
        ArrayPush$1.call(wiredDisconnecting, disconnectCallback);
      }

    });
    renderer.dispatchEvent(elm, contextRegistrationEvent);
  });
}

function createConnector(vm, name, wireDef) {
  const {
    method,
    adapter,
    configCallback,
    dynamic
  } = wireDef;
  const hasDynamicParams = dynamic.length > 0;
  const {
    component
  } = vm;
  const dataCallback = isUndefined$1(method) ? createFieldDataCallback(vm, name) : createMethodDataCallback(vm, method);
  let context;
  let connector; // Workaround to pass the component element associated to this wire adapter instance.

  defineProperty$1(dataCallback, DeprecatedWiredElementHost, {
    value: vm.elm
  });
  defineProperty$1(dataCallback, DeprecatedWiredParamsMeta, {
    value: dynamic
  });
  runWithBoundaryProtection(vm, vm, noop$4, () => {
    // job
    connector = new adapter(dataCallback);
  }, noop$4);

  const updateConnectorConfig = config => {
    // every time the config is recomputed due to tracking,
    // this callback will be invoked with the new computed config
    runWithBoundaryProtection(vm, vm, noop$4, () => {
      // job
      connector.update(config, context);
    }, noop$4);
  }; // Computes the current wire config and calls the update method on the wire adapter.
  // This initial implementation may change depending on the specific wire instance, if it has params, we will need
  // to observe changes in the next tick.


  let computeConfigAndUpdate = () => {
    updateConnectorConfig(configCallback(component));
  };

  if (hasDynamicParams) {
    // This wire has dynamic parameters: we wait for the component instance is created and its values set
    // in order to call the update(config) method.
    Promise.resolve().then(() => {
      computeConfigAndUpdate = createConfigWatcher(vm, wireDef, updateConnectorConfig);
      computeConfigAndUpdate();
    });
  } else {
    computeConfigAndUpdate();
  } // if the adapter needs contextualization, we need to watch for new context and push it alongside the config


  if (!isUndefined$1(adapter.contextSchema)) {
    createContextWatcher(vm, wireDef, newContext => {
      // every time the context is pushed into this component,
      // this callback will be invoked with the new computed context
      if (context !== newContext) {
        context = newContext; // Note: when new context arrives, the config will be recomputed and pushed along side the new
        // context, this is to preserve the identity characteristics, config should not have identity
        // (ever), while context can have identity

        computeConfigAndUpdate();
      }
    });
  } // @ts-ignore the boundary protection executes sync, connector is always defined


  return connector;
}

const AdapterToTokenMap = new Map();

function getAdapterToken(adapter) {
  return AdapterToTokenMap.get(adapter);
}

function storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic) {
  // support for callable adapters
  if (adapter.adapter) {
    adapter = adapter.adapter;
  }

  const method = descriptor.value;
  const def = {
    adapter,
    method,
    configCallback,
    dynamic
  };
  WireMetaMap.set(descriptor, def);
}

function storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic) {
  // support for callable adapters
  if (adapter.adapter) {
    adapter = adapter.adapter;
  }

  const def = {
    adapter,
    configCallback,
    dynamic
  };
  WireMetaMap.set(descriptor, def);
}

function installWireAdapters(vm) {
  const {
    context,
    def: {
      wire
    }
  } = vm;
  const wiredConnecting = context.wiredConnecting = [];
  const wiredDisconnecting = context.wiredDisconnecting = [];

  for (const fieldNameOrMethod in wire) {
    const descriptor = wire[fieldNameOrMethod];
    const wireDef = WireMetaMap.get(descriptor);

    {
      assert$1.invariant(wireDef, `Internal Error: invalid wire definition found.`);
    }

    if (!isUndefined$1(wireDef)) {
      const adapterInstance = createConnector(vm, fieldNameOrMethod, wireDef);
      ArrayPush$1.call(wiredConnecting, () => adapterInstance.connect());
      ArrayPush$1.call(wiredDisconnecting, () => adapterInstance.disconnect());
    }
  }
}

function connectWireAdapters(vm) {
  const {
    wiredConnecting
  } = vm.context;

  for (let i = 0, len = wiredConnecting.length; i < len; i += 1) {
    wiredConnecting[i]();
  }
}

function disconnectWireAdapters(vm) {
  const {
    wiredDisconnecting
  } = vm.context;
  runWithBoundaryProtection(vm, vm, noop$4, () => {
    // job
    for (let i = 0, len = wiredDisconnecting.length; i < len; i += 1) {
      wiredDisconnecting[i]();
    }
  }, noop$4);
}
/* version: 1.9.1 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const globalStylesheets = create(null);
const globalStylesheetsParentElement = document.head || document.body || document;
let getCustomElement, defineCustomElement, HTMLElementConstructor$1; // Read the existing styles from the document
// This could be enhanced if we associate a hash to every style tag. A unique hash can be generated by the compiler
// and passed to insertGlobalStylesheet, then set as the data-lwc-ssr value. This way, we would only compare simple attribute
// values and not the style content.

function loadGlobalStylesheet() {
  const styles = globalStylesheetsParentElement.querySelectorAll('style[lwc-scoped-style]');

  for (let i = 0; i < styles.length; i++) {
    const text = styles[i].textContent;

    if (text) {
      globalStylesheets[text] = true;
    }
  }
}

function isCustomElementRegistryAvailable() {
  if (typeof customElements === 'undefined') {
    return false;
  }

  try {
    // dereference HTMLElement global because babel wraps globals in compat mode with a
    // _wrapNativeSuper()
    // This is a problem because LWCUpgradableElement extends renderer.HTMLElement which does not
    // get wrapped by babel.
    const HTMLElementAlias = HTMLElement; // In case we use compat mode with a modern browser, the compat mode transformation
    // invokes the DOM api with an .apply() or .call() to initialize any DOM api sub-classing,
    // which are not equipped to be initialized that way.

    class clazz extends HTMLElementAlias {}

    customElements.define('lwc-test-' + Math.floor(Math.random() * 1000000), clazz);
    new clazz();
    return true;
  } catch (_a) {
    return false;
  }
}

if (isCustomElementRegistryAvailable()) {
  getCustomElement = customElements.get.bind(customElements);
  defineCustomElement = customElements.define.bind(customElements);
  HTMLElementConstructor$1 = HTMLElement;
} else {
  const registry = create(null);
  const reverseRegistry = new WeakMap();

  defineCustomElement = function define(name, ctor) {
    if (name !== StringToLowerCase.call(name) || registry[name]) {
      throw new TypeError(`Invalid Registration`);
    }

    registry[name] = ctor;
    reverseRegistry.set(ctor, name);
  };

  getCustomElement = function get(name) {
    return registry[name];
  };

  HTMLElementConstructor$1 = function HTMLElement() {
    if (!(this instanceof HTMLElement)) {
      throw new TypeError(`Invalid Invocation`);
    }

    const {
      constructor
    } = this;
    const name = reverseRegistry.get(constructor);

    if (!name) {
      throw new TypeError(`Invalid Construction`);
    }

    const elm = document.createElement(name);
    setPrototypeOf(elm, constructor.prototype);
    return elm;
  };

  HTMLElementConstructor$1.prototype = HTMLElement.prototype;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
} // TODO [#0]: Evaluate how we can extract the `$shadowToken$` property name in a shared package
// to avoid having to synchronize it between the different modules.


const useSyntheticShadow = hasOwnProperty.call(Element.prototype, '$shadowToken$');

if (useSyntheticShadow) {
  loadGlobalStylesheet();
}

const renderer = {
  ssr: false,
  syntheticShadow: useSyntheticShadow,

  createElement(tagName, namespace) {
    return isUndefined(namespace) ? document.createElement(tagName) : document.createElementNS(namespace, tagName);
  },

  createText(content) {
    return document.createTextNode(content);
  },

  insert(node, parent, anchor) {
    parent.insertBefore(node, anchor);
  },

  remove(node, parent) {
    parent.removeChild(node);
  },

  nextSibling(node) {
    return node.nextSibling;
  },

  attachShadow(element, options) {
    if (element.shadowRoot) {
      removeAllChildNodes(element.shadowRoot);
      return element.shadowRoot;
    }

    if (useSyntheticShadow) {
      removeAllChildNodes(element);
    }

    return element.attachShadow(options);
  },

  setText(node, content) {
    node.nodeValue = content;
  },

  getProperty(node, key) {
    return node[key];
  },

  setProperty(node, key, value) {
    {
      if (node instanceof Element && !(key in node)) {
        // TODO [#1297]: Move this validation to the compiler
        assert.fail(`Unknown public property "${key}" of element <${node.tagName}>. This is likely a typo on the corresponding attribute "${getAttrNameFromPropName(key)}".`);
      }
    }

    node[key] = value;
  },

  getAttribute(element, name, namespace) {
    return isUndefined(namespace) ? element.getAttribute(name) : element.getAttributeNS(namespace, name);
  },

  setAttribute(element, name, value, namespace) {
    return isUndefined(namespace) ? element.setAttribute(name, value) : element.setAttributeNS(namespace, name, value);
  },

  removeAttribute(element, name, namespace) {
    if (isUndefined(namespace)) {
      element.removeAttribute(name);
    } else {
      element.removeAttributeNS(namespace, name);
    }
  },

  addEventListener(target, type, callback, options) {
    target.addEventListener(type, callback, options);
  },

  removeEventListener(target, type, callback, options) {
    target.removeEventListener(type, callback, options);
  },

  dispatchEvent(target, event) {
    return target.dispatchEvent(event);
  },

  getClassList(element) {
    return element.classList;
  },

  getStyleDeclaration(element) {
    // TODO [#0]: How to avoid this type casting? Shall we use a different type interface to
    // represent elements in the engine?
    return element.style;
  },

  getBoundingClientRect(element) {
    return element.getBoundingClientRect();
  },

  querySelector(element, selectors) {
    return element.querySelector(selectors);
  },

  querySelectorAll(element, selectors) {
    return element.querySelectorAll(selectors);
  },

  getElementsByTagName(element, tagNameOrWildCard) {
    return element.getElementsByTagName(tagNameOrWildCard);
  },

  getElementsByClassName(element, names) {
    return element.getElementsByClassName(names);
  },

  isConnected(node) {
    return node.isConnected;
  },

  insertGlobalStylesheet(content) {
    if (!isUndefined(globalStylesheets[content])) {
      return;
    }

    globalStylesheets[content] = true;
    const elm = document.createElement('style');
    elm.type = 'text/css';
    elm.textContent = content;
    globalStylesheetsParentElement.appendChild(elm);
  },

  assertInstanceOfHTMLElement(elm, msg) {
    assert.invariant(elm instanceof HTMLElement, msg);
  },

  defineCustomElement,
  getCustomElement,
  HTMLElement: HTMLElementConstructor$1
};

function buildCustomElementConstructor(Ctor) {
  var _a;

  const def = getComponentInternalDef(Ctor); // generating the hash table for attributes to avoid duplicate fields and facilitate validation
  // and false positives in case of inheritance.

  const attributeToPropMap = create(null);

  for (const propName in def.props) {
    attributeToPropMap[getAttrNameFromPropName(propName)] = propName;
  }

  return _a = class extends def.bridge {
    constructor() {
      super();
      createVM(this, def, {
        mode: 'open',
        owner: null,
        tagName: this.tagName,
        renderer
      });
    }

    connectedCallback() {
      connectRootElement(this);
    }

    disconnectedCallback() {
      disconnectRootElement(this);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      if (oldValue === newValue) {
        // Ignore same values.
        return;
      }

      const propName = attributeToPropMap[attrName];

      if (isUndefined(propName)) {
        // Ignore unknown attributes.
        return;
      }

      if (!isAttributeLocked(this, attrName)) {
        // Ignore changes triggered by the engine itself during:
        // * diffing when public props are attempting to reflect to the DOM
        // * component via `this.setAttribute()`, should never update the prop
        // Both cases, the setAttribute call is always wrapped by the unlocking of the
        // attribute to be changed
        return;
      } // Reflect attribute change to the corresponding property when changed from outside.


      this[propName] = newValue;
    }

  }, // Specify attributes for which we want to reflect changes back to their corresponding
  // properties via attributeChangedCallback.
  _a.observedAttributes = keys(attributeToPropMap), _a;
}
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const ConnectingSlot = createHiddenField('connecting', 'engine');
const DisconnectingSlot = createHiddenField('disconnecting', 'engine');

function callNodeSlot(node, slot) {
  {
    assert.isTrue(node, `callNodeSlot() should not be called for a non-object`);
  }

  const fn = getHiddenField(node, slot);

  if (!isUndefined(fn)) {
    fn(node);
  }

  return node; // for convenience
} // Monkey patching Node methods to be able to detect the insertions and removal of root elements
// created via createElement.


const {
  appendChild,
  insertBefore,
  removeChild,
  replaceChild
} = Node.prototype;
assign(Node.prototype, {
  appendChild(newChild) {
    const appendedNode = appendChild.call(this, newChild);
    return callNodeSlot(appendedNode, ConnectingSlot);
  },

  insertBefore(newChild, referenceNode) {
    const insertedNode = insertBefore.call(this, newChild, referenceNode);
    return callNodeSlot(insertedNode, ConnectingSlot);
  },

  removeChild(oldChild) {
    const removedNode = removeChild.call(this, oldChild);
    return callNodeSlot(removedNode, DisconnectingSlot);
  },

  replaceChild(newChild, oldChild) {
    const replacedNode = replaceChild.call(this, newChild, oldChild);
    callNodeSlot(replacedNode, DisconnectingSlot);
    callNodeSlot(newChild, ConnectingSlot);
    return replacedNode;
  }

});
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */


const ComponentConstructorToCustomElementConstructorMap = new Map();

function getCustomElementConstructor(Ctor) {
  if (Ctor === BaseLightningElement) {
    throw new TypeError(`Invalid Constructor. LightningElement base class can't be claimed as a custom element.`);
  }

  let ce = ComponentConstructorToCustomElementConstructorMap.get(Ctor);

  if (isUndefined(ce)) {
    ce = buildCustomElementConstructor(Ctor);
    ComponentConstructorToCustomElementConstructorMap.set(Ctor, ce);
  }

  return ce;
}
/**
 * This static getter builds a Web Component class from a LWC constructor so it can be registered
 * as a new element via customElements.define() at any given time. E.g.:
 *
 *      import Foo from 'ns/foo';
 *      customElements.define('x-foo', Foo.CustomElementConstructor);
 *      const elm = document.createElement('x-foo');
 *
 */


defineProperty(BaseLightningElement, 'CustomElementConstructor', {
  get() {
    return getCustomElementConstructor(this);
  }

});
freeze(BaseLightningElement);
seal(BaseLightningElement.prototype);
/* version: 1.9.1 */

function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return ["h1", shadowSelector, " {font-size:22px;}\n.counterTitle", shadowSelector, " {font-size:18px;margin-bottom: 1em;}\n.counter", shadowSelector, " {color: blue;}\nbutton", shadowSelector, " {margin-right: 5px;margin-bottom: 10px;}\ntable", shadowSelector, " {font-size:14px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;margin-left: 4em;}\ntable", shadowSelector, " th", shadowSelector, " {font-size:18px;border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}\ntable", shadowSelector, " td", shadowSelector, " {border-width: 1px;padding: 2em;border-style: solid;border-color: #666666;background-color: #ffffff;}\n"].join('');
}
var _implicitStylesheets = [stylesheet];

function stylesheet$1(hostSelector, shadowSelector, nativeShadow) {
  return [".blue", shadowSelector, " {color: blue;}\n"].join('');
}
var _implicitStylesheets$1 = [stylesheet$1];

function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    d: api_dynamic,
    b: api_bind,
    h: api_element
  } = $api;
  const {
    _m0
  } = $ctx;
  return [api_element("div", {
    classMap: {
      "blue": true
    },
    key: 1
  }, [api_text("Blue Text, clicked $"), api_dynamic($cmp.clicked), api_text(", "), api_element("button", {
    attrs: {
      "type": "button"
    },
    key: 0,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.onClick))
    }
  }, [api_text("Click Me!")])])];
}

var _tmpl = registerTemplate(tmpl);
tmpl.stylesheets = [];

if (_implicitStylesheets$1) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets$1);
}
tmpl.stylesheetTokens = {
  hostAttribute: "demo-squareBlue_squareBlue-host",
  shadowAttribute: "demo-squareBlue_squareBlue"
};

class SquareBlue extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.clicked = 0;
  }

  onClick() {
    this.clicked++;
  }

}

registerDecorators(SquareBlue, {
  fields: ["clicked"]
});

var _demoSquareBlue = registerComponent(SquareBlue, {
  tmpl: _tmpl
});

function stylesheet$2(hostSelector, shadowSelector, nativeShadow) {
  return [".red", shadowSelector, " {color: red;}\n"].join('');
}
var _implicitStylesheets$2 = [stylesheet$2];

function tmpl$1($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    d: api_dynamic,
    b: api_bind,
    h: api_element
  } = $api;
  const {
    _m0
  } = $ctx;
  return [api_element("div", {
    classMap: {
      "red": true
    },
    key: 1
  }, [api_text("Red Text, clicked $"), api_dynamic($cmp.clicked), api_text(", "), api_element("button", {
    attrs: {
      "type": "button"
    },
    key: 0,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.onClick))
    }
  }, [api_text("Click Me!")])])];
}

var _tmpl$1 = registerTemplate(tmpl$1);
tmpl$1.stylesheets = [];

if (_implicitStylesheets$2) {
  tmpl$1.stylesheets.push.apply(tmpl$1.stylesheets, _implicitStylesheets$2);
}
tmpl$1.stylesheetTokens = {
  hostAttribute: "demo-squareRed_squareRed-host",
  shadowAttribute: "demo-squareRed_squareRed"
};

class SquareBlue$1 extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.clicked = 0;
  }

  onClick() {
    this.clicked++;
  }

}

registerDecorators(SquareBlue$1, {
  fields: ["clicked"]
});

var _demoSquareRed = registerComponent(SquareBlue$1, {
  tmpl: _tmpl$1
});

function tmpl$2($api, $cmp, $slotset, $ctx) {
  const {
    d: api_dynamic,
    h: api_element,
    c: api_custom_element,
    t: api_text,
    b: api_bind
  } = $api;
  const {
    _m0
  } = $ctx;
  return [api_element("h2", {
    key: 0
  }, [api_dynamic($cmp.title)]), api_custom_element("demo-square-blue", _demoSquareBlue, {
    key: 1
  }, []), api_custom_element("demo-square-red", _demoSquareRed, {
    key: 2
  }, []), api_element("a", {
    attrs: {
      "href": "#"
    },
    key: 3,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.infoClick))
    }
  }, [api_text("Details...")])];
}

var _tmpl$2 = registerTemplate(tmpl$2);
tmpl$2.stylesheets = [];
tmpl$2.stylesheetTokens = {
  hostAttribute: "demo-block_block-host",
  shadowAttribute: "demo-block_block"
};

class Block extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.row = void 0;
    this.col = void 0;
  }

  get title() {
    return `Block ${this.row}-${this.col}`;
  }

  infoClick() {
    const json = {
      row: this.row,
      col: this.col
    };
    alert(JSON.stringify(json, null, '  '));
  }

}

registerDecorators(Block, {
  publicProps: {
    row: {
      config: 0
    },
    col: {
      config: 0
    }
  }
});

var _demoBlock = registerComponent(Block, {
  tmpl: _tmpl$2
});

function tmpl$3($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    c: api_custom_element,
    k: api_key,
    i: api_iterator
  } = $api;
  return [api_element("div", {
    classMap: {
      "d-flex": true,
      "flex-column": true,
      "flex-md-row": true,
      "p-3": true,
      "px-md-4": true,
      "mb-3": true,
      "bg-white": true,
      "border-bottom": true,
      "shadow-sm": true
    },
    key: 6
  }, [api_element("h5", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "font-weight-normal": true
    },
    key: 0
  }, [api_text("SSR DEMO")]), !$cmp.ssr ? api_element("a", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "p-2": true,
      "text-dark": true
    },
    attrs: {
      "href": $cmp.SSR
    },
    key: 1
  }, [api_text("SSR")]) : null, $cmp.ssr ? api_element("a", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "p-2": true,
      "text-dark": true
    },
    attrs: {
      "href": $cmp.NOSSR
    },
    key: 2
  }, [api_text("NO SSR")]) : null, !$cmp.shadow ? api_element("a", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "p-2": true,
      "text-dark": true
    },
    attrs: {
      "href": $cmp.SHADOW
    },
    key: 3
  }, [api_text("NATIVE SHADOW")]) : null, $cmp.shadow ? api_element("a", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "p-2": true,
      "text-dark": true
    },
    attrs: {
      "href": $cmp.NOSHADOW
    },
    key: 4
  }, [api_text("SYNTH SHADOW")]) : null, api_element("a", {
    classMap: {
      "my-0": true,
      "mr-md-auto": true,
      "p-2": true,
      "text-dark": true
    },
    attrs: {
      "href": "/"
    },
    key: 5
  }, [api_text("Commerce Demo")])]), api_element("h1", {
    key: 8
  }, [api_element("blockquote", {
    key: 7
  }, [])]), api_element("table", {
    key: 12
  }, api_iterator($cmp.rows, function (row) {
    return api_element("tr", {
      key: api_key(11, row)
    }, api_iterator($cmp.cols, function (col) {
      return api_element("td", {
        key: api_key(10, col)
      }, [api_custom_element("demo-block", _demoBlock, {
        props: {
          "row": row,
          "col": col
        },
        key: 9
      }, [])]);
    }));
  }))];
}

var _tmpl$3 = registerTemplate(tmpl$3);
tmpl$3.stylesheets = [];

if (_implicitStylesheets) {
  tmpl$3.stylesheets.push.apply(tmpl$3.stylesheets, _implicitStylesheets);
}
tmpl$3.stylesheetTokens = {
  hostAttribute: "demo-main_main-host",
  shadowAttribute: "demo-main_main"
};

const SSRFLAG = '__B2C_SSR__';
const SSRCONTEXT = '__B2C_SSRCONTEXT__';
function isSsr() {
  return typeof global !== 'undefined' && global[SSRFLAG] === true;
}
function getSsrContext() {
  if (isSsr()) {
    return global[SSRCONTEXT];
  }

  return undefined;
}

var _tmpl$4 = void 0;

class Subscription {
  /**
   * Unsubscribes from the associated observable.
   */
  unsubscribe() {
    // If we have a handler, invoke it.
    if (this._unsubscribeHandler !== undefined) {
      // Snag a reference to the handler, then delete the instance property so that we only execute it once.
      const handler = this._unsubscribeHandler;
      delete this._unsubscribeHandler;
      handler();
    }
  }
  /**
   * Initializes a new Subscription with the specified unsubscribe handler.
   *
   * @param {Function} [unsubscribeHandler]
   *  A handler that is executed when then subscription is ended.
   *
   */


  constructor(unsubscribeHandler) {
    this._unsubscribeHandler = void 0;
    this._unsubscribeHandler = unsubscribeHandler;
  }

}

registerDecorators(Subscription, {
  fields: ["_unsubscribeHandler"]
});
/**
 * A subscription to an observable notification stream.
 */


var Subscription$1 = registerComponent(Subscription, {
  tmpl: _tmpl$4
});

/**
 * A simple observable subject.
 */

class Subject {
  constructor() {
    this._nextHandlers = new Set();
  }

  /**
   * Emits the next value to all subscribed handlers.
   *
   * @param {object} [nextValue]
   *  The optional value to provide to subscribers.
   */
  next(nextValue) {
    this._nextHandlers.forEach(nextHandler => nextHandler(nextValue));
  }
  /**
   * Subscribes to notifications from this subject.
   *
   * @param {function} nextHandler
   *  A handler for the notification.
   *
   * @returns {Subscription}
   *      A subscription that may be used to unsubscribe from the notifications.
   */


  subscribe(nextHandler) {
    this._nextHandlers.add(nextHandler);

    return new Subscription$1(() => {
      this._nextHandlers.delete(nextHandler);
    });
  }

  _unsubscribed(nextHandler) {}

}

registerDecorators(Subject, {
  fields: ["_nextHandlers"]
});

var Subject$1 = registerComponent(Subject, {
  tmpl: _tmpl$4
});

/**
 * A simple observable behavior subject.
 */

class BehaviorSubject extends Subject$1 {
  constructor(value) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
  }

  getValue() {
    return this._value;
  }
  /**
   * Emits the next value to all subscribed handlers.
   * The value is stored to be emitted to late subscribers
   *
   * @param {object} [nextValue]
   *  The optional value to provide to subscribers.
   */


  next(nextValue) {
    this._value = nextValue;
    return super.next(nextValue);
  }
  /**
   * Subscribes to notifications from this subject.
   * The handler is immediately notified with the current value.
   *
   * @param {function} nextHandler
   *  A handler for the notification.
   *
   * @returns {Subscription}
   *      A subscription that may be used to unsubscribe from the notifications.
   */


  subscribe(nextHandler) {
    const subscription = super.subscribe(nextHandler);
    nextHandler(this._value);
    return subscription;
  }

}

var BehaviorSubject$1 = registerComponent(BehaviorSubject, {
  tmpl: _tmpl$4
});

function keyAsString(key) {
  if (key === undefined || key === null) {
    return '';
  }

  if (typeof key === 'string' || key instanceof String) {
    return key;
  }

  if (Array.isArray(key)) {
    return key.reduce((a, v) => {
      return a + (a ? '&' : '') + encodeURIComponent(v);
    }, '');
  }

  if (typeof key === 'object') {
    return Object.keys(key).sort().reduce((a, v) => {
      return a + (a ? '&' : '') + encodeURIComponent(v) + '=' + encodeURIComponent(key[v]);
    }, '');
  }

  return key.toString(); // Last resort...
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const INITIAL_STATE = '__B2C_INITIAL_STATE__';
/**
 * Internal subject class
 */

class StoreSubject extends BehaviorSubject$1 {
  constructor(store, keyString, value) {
    super(value);
    this.store = store;
    this.keyString = keyString;
    this.subscribers = 0; // We have to store the SSR context when the subject is created, as it will be unavailable when the request is completed
    // Thus it won't be available dynamically when a Promise is resolved

    if (isSsr()) {
      this.ssrContext = getSsrContext();
    }
  }

  next(nextValue) {
    // In case of SSR, we make sure that the value is stored in the global ssr context
    // So the server renderer can retrieve it afterwards
    if (this.ssrContext) {
      const states = this.ssrContext.states;
      const state = states[this.store.name] || (states[this.store.name] = {});
      state[this.keyString] = nextValue;
    }

    super.next(nextValue);
  }

  subscribe(handler) {
    const subscription = super.subscribe(handler);

    if (++this.subscribers === 1) {
      this.store._addSubject(this);
    }

    return {
      unsubscribe: () => {
        subscription.unsubscribe(); // If no more handlers, we remove the subject

        if (--this.subscribers === 0) {
          this.store._removeSubject(this);
        }
      }
    };
  }

}
/**
 * Simple in memory store.
 *
 * This is a centralized client side state manager that stores data and notify subscribers on changes.
 * An instance of a store is generally dedicated to one type of data management, like a cart of a set of products.
 *
 * A store can hold a single JS object or a set of objects referemced by a key. For example, a typical commerce
 * application will have one cart object, and multiple products referenced by their id. A single object is
 * in fact an object with a undefined, null or empty string key.
 *
 * The store uses a lazy loading mechanism, which attempts to load the data on its first access. To do this,
 * it uses a 'loader' that is invoked when the data should be loaded. This function returns a Promise that
 * resolves when the data, or a load error, is available.
 *
 * An object is created in the store as soon as it is accessed for the first time. It always contains the
 * following properties:
 *   - data
 *     The actually object data, like a product. It can be null if the data hasn't been loaded yet, or if
 *     there was an error when loading the object.
 *   - error
 *     An error object if the store failed to load the object. It can be null if the data hasn't been loaded yet,
 *     or if the object loaded properly.
 *   - loaded
 *     Set when an attempt to load the object was completed, which resulted in some data or an error.
 *   - loading
 *     Contains a promise if the data is being loaded. Most applications will simply check if the value
 *     is not null/undefined to display a loading icon. The promise is provided to support advanced use cases
 *     like Server Side Rendering
 *
 * Each object in the store can have subscribers that will be notified when the object is updated. When an
 * object has no longer subscribers, it is removed from the store. To keep it alive, one can create a fake
 * subscriber to keep a reference active.
 * When the an object is changed, because the data was loaded, or changed programmatically, all the subscribers
 * are notified. Also, when a subscriber sunscribes to an object that is already in the store, then it
 * receives an initial notification.
 *
 */


class Store {
  constructor(name, options) {
    this.options = options || {};
    this.name = name;
    this.subjects = []; // Preload the store on the client when SSR was activated

    if (!isSsr()) {
      this._container = {};

      if (typeof window !== 'undefined' && typeof window[INITIAL_STATE] !== 'undefined') {
        const initialState = window[INITIAL_STATE][name];

        if (initialState) {
          for (const [keyString, value] of Object.entries(initialState)) {
            this._container[keyString] = value;
            this.subjects[keyString] = new StoreSubject(this, keyString, value);
          }

          delete window[INITIAL_STATE][name];
        }
      }
    }
  }

  _addSubject(subject) {
    this.subjects.push(subject);
  }

  _removeSubject(subject) {
    // First remove the subject from the list of subjects
    const idx = this.subjects.findIndex(s => subject === s);

    if (idx >= 0) {
      this.subjects.splice(idx, 1);
    } // Discard the value in the store if there is no more observable
    // We could have a function that discards using a MRU, or whatever...
    // This can be extended in many ways


    if (this.options.discard) {
      const keyString = subject.keyString;
      const count = this.subjects.reduce((a, s) => a + (s.keyString === keyString), 0);

      if (count === 0) {
        delete this.container[keyString];
      }
    }
  }

  get container() {
    // Client side container
    if (!isSsr()) {
      return this._container;
    } // Server side container
    // It must be stored in the SSR context as


    const states = getSsrContext().states;
    return states[this.name] || (states[this.name] = {});
  }

  _get(key, keyString, load) {
    const container = this.container;

    if (!container[keyString]) {
      container[keyString] = {
        data: undefined,
        error: undefined,
        loaded: false,
        loading: undefined
      };
    }

    if (load && !container[keyString].loaded && !container[keyString].loading) {
      this._load(key, keyString);
    }

    return container[keyString];
  }

  _load(key, keyString, loader) {
    // We get the container here so it is available to the promises even though the context changed
    const container = this.container;
    loader = loader || this.options.loader;

    if (loader) {
      this._cancelRequest(container[keyString]);

      try {
        const result = loader(key);

        if (result.then) {
          const loading = result.then(data => {
            // Verify that the promise is the expected one
            // It happens when multiple load requests are sent at the same time
            // The latest will win
            if (container[keyString].loading === loading) {
              const v = container[keyString] = {
                data: data,
                error: undefined,
                loaded: true,
                loading: undefined
              };

              this._notify(key, keyString, v);
            }

            return container[keyString];
          }).catch(ex => {
            const error = this._errorFromException(ex);

            if (container[keyString].loading === loading) {
              const v = container[keyString] = {
                data: undefined,
                error: error,
                loaded: true,
                loading: undefined
              };

              this._notify(key, keyString, v);
            }

            return container[keyString];
          });

          if (isSsr()) {
            // With SSR, we don't notify the loading state as this is not necessary
            // We simply store the value so it gets to the store.
            container[keyString].loading = loading;

            if (loading) {
              getSsrContext().loading.push(loading);
            }
          } else {
            const v = container[keyString] = _objectSpread(_objectSpread({}, container[keyString]), {}, {
              loading
            });

            this._notify(key, keyString, v);
          }
        } else {
          const v = container[keyString] = {
            data: result,
            error: undefined,
            loaded: true,
            loading: undefined
          };

          this._notify(key, keyString, v);
        }
      } catch (ex) {
        const error = this._errorFromException(ex);

        const v = container[keyString] = {
          data: undefined,
          error: error,
          loaded: true,
          loading: undefined
        };

        this._notify(key, keyString, v);
      }
    }

    return container[keyString];
  }

  _errorFromException(ex) {
    return ex.toString();
  }

  _cancelRequest(value) {
    if (value && value.loading) {
      // For now, only clear it - do more later with AbortablePromises
      value.loading = undefined;
    }
  }

  _notify(key, keyString, value) {
    this.subjects.filter(subject => subject.keyString === keyString).forEach(sub => {
      sub.next(value);
    });
  } //
  // Public methods
  //

  /**
   * Checks if the store has an entry for a key.
   *
   * @param {*} key
   */


  has(key) {
    const keyString = keyAsString(key);
    return Object.prototype.hasOwnProperty.call(this.container, keyString);
  }
  /**
   * Get a value by key.
   *
   * @param {object} key
   */


  get(key) {
    return this._get(key, keyAsString(key), true);
  }
  /**
   * Shortcut to get the data by key.
   *
   * @param {object} key
   */


  getData(key) {
    return this.get(key).data;
  }
  /**
   * Shortcut to get the error by key.
   *
   * @param {object} key
   */


  getError(key) {
    return this.get(key).error;
  }
  /**
   * Returns the data after waiting for its load.
   *
   * @param {object} key
   */


  async getAsync(key) {
    const keyString = keyAsString(key);

    const value = this._get(key, keyString, true);

    if (!value.loaded && value.loading) {
      await value.loading;
    }

    return this.container[keyString];
  }
  /**
   * Set the data for a key.
   *
   * The key is optional.
   * @param {*} key
   * @param {*} data
   */


  setData(key, data) {
    const _key = arguments.length === 1 ? undefined : key;

    const _data = arguments.length === 1 ? key : data;

    const keyString = keyAsString(_key);
    const v = this.container[keyString] = {
      data: _data,
      error: undefined,
      loaded: true,
      loading: undefined
    };

    this._notify(key, keyString, v);
  }
  /**
   * Set the error for a key.
   *
   * The key is optional.
   * @param {*} key
   * @param {*} data
   */


  setError(key, error) {
    const _key = arguments.length === 1 ? undefined : key;

    const _error = arguments.length === 1 ? key : error;

    const keyString = keyAsString(_key);
    const v = this.container[keyString] = {
      data: undefined,
      error: _error,
      loaded: true,
      loading: undefined
    };

    this._notify(key, keyString, v);
  }
  /**
   * Remove an entry by key.
   *
   * @param {*} key
   * @param {*} data
   */


  remove(key) {
    const keyString = keyAsString(key);

    this._cancelRequest(this.container[keyString]);

    delete this.container[keyString];
    const v = {
      data: undefined,
      error: undefined
    };

    this._notify(key, keyString, v);
  }
  /**
   * Load an entry by key.
   *
   * The loading state is set during the loading process and the observers are notified
   *
   * The key is optional.
   * @param {*} key
   * @param {*} data
   */


  load(key, loader) {
    const _key = arguments.length === 1 ? undefined : key;

    const _listener = arguments.length === 1 ? key : loader;

    const keyString = keyAsString(_key);

    this._get(_key, keyString, false);

    return this._load(_key, keyString, _listener);
  }
  /**
   * Get an observable to get the notifications for a given key.
   *
   * @param {*} key
   */


  getObservable(key) {
    const keyString = keyAsString(key);

    const value = this._get(key, keyString, true);

    return new StoreSubject(this, keyString, value);
  }
  /**
   * Cancel an on-going request if there is one.
   */


  cancelRequest(key) {
    this._cancelRequest(this.container[keyAsString(key)]);
  }

}

/**
 * Some url utilities.
 */
function hasQueryParameter(key) {
  if (getSsrContext()) {
    return getSsrContext().query.hasOwnProperty(key);
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(key);
}
function getQueryParameter(key) {
  if (getSsrContext()) {
    return getSsrContext().query[key];
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
function queryString(params) {
  // The order of the parameters is predictable
  return params ? Object.keys(params).sort().map(function (k) {
    const pk = params[k];
    return encodeURIComponent(k) + (pk !== undefined ? '=' + encodeURIComponent(pk) : '');
  }).join('&') : "";
}
function composeUrl(path, params = {}) {
  let url = path; // Propagate the SSR parameter

  const ssr = hasQueryParameter('ssr');

  if (ssr) {
    params['ssr'] = undefined;
  }

  const shadow = hasQueryParameter('shadow');

  if (shadow) {
    params['shadow'] = undefined;
  }

  let qs = queryString(params);

  if (qs) {
    url += '?' + qs;
  }

  return url;
}
function getBaseUrl() {
  if (getSsrContext()) {
    return getSsrContext().baseUrl;
  }

  return '';
}

class Main extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.rows = [1, 2, 3, 4, 5, 6];
    this.cols = [1, 2, 3, 4];
  }

  get ssr() {
    return hasQueryParameter('ssr');
  }

  get shadow() {
    return hasQueryParameter('shadow');
  }

  qs(ssr, shadow) {
    let q = '';
    if (ssr) q += "ssr";
    if (shadow) q += (q ? '&' : '') + "shadow";
    return '/demo' + (q ? '?' + q : '');
  }

  get SSR() {
    return this.qs(true, this.shadow);
  }

  get NOSSR() {
    return this.qs(false, this.shadow);
  }

  get SHADOW() {
    return this.qs(this.ssr, true);
  }

  get NOSHADOW() {
    return this.qs(this.ssr, false);
  }

}

registerDecorators(Main, {
  fields: ["rows", "cols"]
});

var DemoMain = registerComponent(Main, {
  tmpl: _tmpl$3
});

function tmpl$4($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    s: api_slot,
    h: api_element
  } = $api;
  return [api_element("div", {
    key: 1
  }, [api_text("This is slot one: "), api_slot("one", {
    attrs: {
      "name": "one"
    },
    key: 0
  }, [api_text("#1")], $slotset)]), api_element("div", {
    key: 3
  }, [api_text("This is main: "), api_slot("", {
    key: 2
  }, [api_text("main")], $slotset)]), api_element("div", {
    key: 5
  }, [api_text("This is slot two: "), api_slot("two", {
    attrs: {
      "name": "two"
    },
    key: 4
  }, [api_text("#2")], $slotset)])];
}

var _tmpl$5 = registerTemplate(tmpl$4);
tmpl$4.slots = ["one", "", "two"];
tmpl$4.stylesheets = [];
tmpl$4.stylesheetTokens = {
  hostAttribute: "slot-container_container-host",
  shadowAttribute: "slot-container_container"
};

class MainLayout extends BaseLightningElement {}

var _slotContainer = registerComponent(MainLayout, {
  tmpl: _tmpl$5
});

function tmpl$5($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    c: api_custom_element
  } = $api;
  return [api_custom_element("slot-container", _slotContainer, {
    key: 2
  }, [api_element("span", {
    attrs: {
      "slot": "one"
    },
    key: 0
  }, [api_text("1- My Slot ONE")]), api_element("span", {
    key: 1
  }, [api_text("M - Here is the MAIN SLOT")])])];
}

var _tmpl$6 = registerTemplate(tmpl$5);
tmpl$5.stylesheets = [];
tmpl$5.stylesheetTokens = {
  hostAttribute: "slot-main_main-host",
  shadowAttribute: "slot-main_main"
};

class MainLayout$1 extends BaseLightningElement {}

var SlotMain = registerComponent(MainLayout$1, {
  tmpl: _tmpl$6
});

function tmpl$6($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    gid: api_scoped_id,
    fid: api_scoped_frag_id
  } = $api;
  return [api_element("nav", {
    classMap: {
      "navbar": true,
      "navbar-expand-lg": true,
      "navbar-dark": true,
      "bg-dark": true,
      "fixed-top": true
    },
    key: 16
  }, [api_element("div", {
    classMap: {
      "container": true
    },
    key: 15
  }, [api_element("a", {
    classMap: {
      "navbar-brand": true
    },
    attrs: {
      "href": "/"
    },
    key: 0
  }, [api_text("Commerce Demo")]), api_element("button", {
    classMap: {
      "navbar-toggler": true
    },
    attrs: {
      "type": "button",
      "data-toggle": "collapse",
      "data-target": "#navbarResponsive",
      "aria-controls": `${api_scoped_id("navbarResponsive")}`,
      "aria-expanded": "false",
      "aria-label": "Toggle navigation"
    },
    key: 2
  }, [api_element("span", {
    classMap: {
      "navbar-toggler-icon": true
    },
    key: 1
  }, [])]), api_element("div", {
    classMap: {
      "collapse": true,
      "navbar-collapse": true
    },
    attrs: {
      "id": api_scoped_id("navbarResponsive")
    },
    key: 14
  }, [api_element("ul", {
    classMap: {
      "navbar-nav": true,
      "ml-auto": true
    },
    key: 13
  }, [api_element("li", {
    classMap: {
      "nav-item": true,
      "active": true
    },
    key: 5
  }, [!$cmp.ssr ? api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": api_scoped_frag_id($cmp.SSR)
    },
    key: 3
  }, [api_text("SSR")]) : null, $cmp.ssr ? api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": api_scoped_frag_id($cmp.NOSSR)
    },
    key: 4
  }, [api_text("NO SSR")]) : null]), api_element("li", {
    classMap: {
      "nav-item": true,
      "active": true
    },
    key: 8
  }, [!$cmp.shadow ? api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": api_scoped_frag_id($cmp.SHADOW)
    },
    key: 6
  }, [api_text("NATIVE SHADOW")]) : null, $cmp.shadow ? api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": api_scoped_frag_id($cmp.NOSHADOW)
    },
    key: 7
  }, [api_text("SYNTH SHADOW")]) : null]), api_element("li", {
    classMap: {
      "nav-item": true,
      "active": true
    },
    key: 10
  }, [api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": "/demo"
    },
    key: 9
  }, [api_text("Tech Demo")])]), api_element("li", {
    classMap: {
      "nav-item": true,
      "active": true
    },
    key: 12
  }, [api_element("a", {
    classMap: {
      "nav-link": true
    },
    attrs: {
      "href": "/slots"
    },
    key: 11
  }, [api_text("Slots")])])])])])])];
}

var _tmpl$7 = registerTemplate(tmpl$6);
tmpl$6.stylesheets = [];
tmpl$6.stylesheetTokens = {
  hostAttribute: "commerce-header_header-host",
  shadowAttribute: "commerce-header_header"
};

class Header extends BaseLightningElement {
  get ssr() {
    return hasQueryParameter('ssr');
  }

  get shadow() {
    return hasQueryParameter('shadow');
  }

  qs(ssr, shadow) {
    let q = '';
    if (ssr) q += "ssr";
    if (shadow) q += (q ? '&' : '') + "shadow";
    return '/' + (q ? '?' + q : '');
  }

  get SSR() {
    return this.qs(true, this.shadow);
  }

  get NOSSR() {
    return this.qs(false, this.shadow);
  }

  get SHADOW() {
    return this.qs(this.ssr, true);
  }

  get NOSHADOW() {
    return this.qs(this.ssr, false);
  }

}

var _commerceHeader = registerComponent(Header, {
  tmpl: _tmpl$7
});

function tmpl$7($api, $cmp, $slotset, $ctx) {
  const {
    c: api_custom_element,
    h: api_element,
    s: api_slot
  } = $api;
  return [api_element("header", {
    key: 1
  }, [api_custom_element("commerce-header", _commerceHeader, {
    key: 0
  }, [])]), api_element("main", {
    classMap: {
      "container": true
    },
    key: 3
  }, [api_slot("", {
    key: 2
  }, [], $slotset)])];
}

var _tmpl$8 = registerTemplate(tmpl$7);
tmpl$7.slots = [""];
tmpl$7.stylesheets = [];
tmpl$7.stylesheetTokens = {
  hostAttribute: "commerce-page_page-host",
  shadowAttribute: "commerce-page_page"
};

class Page extends BaseLightningElement {}

var _commercePage = registerComponent(Page, {
  tmpl: _tmpl$8
});

function tmpl$8($api, $cmp, $slotset, $ctx) {
  const {
    d: api_dynamic,
    h: api_element
  } = $api;
  return [api_element("a", {
    classMap: {
      "list-group-item": true
    },
    attrs: {
      "href": $cmp.link
    },
    key: 0
  }, [api_dynamic($cmp.category)])];
}

var _tmpl$9 = registerTemplate(tmpl$8);
tmpl$8.stylesheets = [];
tmpl$8.stylesheetTokens = {
  hostAttribute: "commerce-categoryItem_categoryItem-host",
  shadowAttribute: "commerce-categoryItem_categoryItem"
};

class CategoryNav extends BaseLightningElement {
  constructor() {
    super();
    this.category = void 0;
  }

  get link() {
    return composeUrl('/', {
      category: this.category
    });
  }

}

registerDecorators(CategoryNav, {
  publicProps: {
    category: {
      config: 0
    }
  }
});

var _commerceCategoryItem = registerComponent(CategoryNav, {
  tmpl: _tmpl$9
});

function tmpl$9($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    k: api_key,
    c: api_custom_element,
    i: api_iterator
  } = $api;
  return [api_element("h3", {
    classMap: {
      "my-4": true
    },
    key: 0
  }, [api_text("Products")]), api_element("div", {
    classMap: {
      "list-group": true
    },
    key: 2
  }, $cmp.categories.data ? api_iterator($cmp.categories.data, function (category) {
    return api_custom_element("commerce-category-item", _commerceCategoryItem, {
      props: {
        "category": category
      },
      key: api_key(1, category)
    }, []);
  }) : [])];
}

var _tmpl$a = registerTemplate(tmpl$9);
tmpl$9.stylesheets = [];
tmpl$9.stylesheetTokens = {
  hostAttribute: "commerce-categoryNav_categoryNav-host",
  shadowAttribute: "commerce-categoryNav_categoryNav"
};

async function connGetCategories() {
  const r = await fetch(getBaseUrl() + '/api/categories');
  return await r.json();
}
async function connGetProductsByCategory(category) {
  const r = await fetch(getBaseUrl() + `/api/products?category=${encodeURIComponent(category)}`);
  return await r.json();
}

const categoriesStore = new Store('CategoriesStore', {
  loader: getCategories
});
const productsStore = new Store('ProductsStore', {
  loader: getProductsByCategory
});
async function getCategories() {
  const categories = await connGetCategories();
  return categories;
}
async function getProductsByCategory(category) {
  const products = await connGetProductsByCategory(category);
  return products;
}

class LeftNav extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.categories = void 0;
  }

  connectedCallback() {
    this.subscription = categoriesStore.getObservable().subscribe(categories => {
      this.categories = categories;
    });
  }

  disconnectedCallback() {
    this.subscription.unsubscribe();
  }

}

registerDecorators(LeftNav, {
  fields: ["categories"]
});

var _commerceCategoryNav = registerComponent(LeftNav, {
  tmpl: _tmpl$a
});

function tmpl$a($api, $cmp, $slotset, $ctx) {
  const {
    h: api_element,
    d: api_dynamic,
    t: api_text,
    b: api_bind
  } = $api;
  const {
    _m0
  } = $ctx;
  return [api_element("div", {
    classMap: {
      "card": true
    },
    styleMap: {
      "height": "580px"
    },
    key: 10
  }, [api_element("a", {
    attrs: {
      "href": $cmp.productPage
    },
    key: 1
  }, [api_element("img", {
    classMap: {
      "card-img-top": true,
      "product-list-image": true
    },
    styleMap: {
      "width": "256px",
      "height": "256px"
    },
    attrs: {
      "src": $cmp.product.ProductImagePath1,
      "alt": ""
    },
    key: 0
  }, [])]), api_element("div", {
    classMap: {
      "card-body": true
    },
    key: 7
  }, [api_element("h4", {
    classMap: {
      "card-title": true
    },
    key: 3
  }, [api_element("span", {
    key: 2
  }, [api_dynamic($cmp.product.Name)])]), api_element("h5", {
    key: 4
  }, [api_text("$"), api_dynamic($cmp.product.ListPrice)]), $cmp.product ? api_element("a", {
    attrs: {
      "href": "#"
    },
    key: 5,
    on: {
      "click": _m0 || ($ctx._m0 = api_bind($cmp.infoClick))
    }
  }, [api_text("More information...")]) : null, api_element("p", {
    classMap: {
      "card-text": true
    },
    key: 6
  }, [api_dynamic($cmp.product.Description)])]), api_element("div", {
    classMap: {
      "card-footer": true
    },
    key: 9
  }, [api_element("span", {
    key: 8
  }, [api_dynamic($cmp.product.ProductCategory)])])])];
}

var _tmpl$b = registerTemplate(tmpl$a);
tmpl$a.stylesheets = [];
tmpl$a.stylesheetTokens = {
  hostAttribute: "commerce-productcard_productcard-host",
  shadowAttribute: "commerce-productcard_productcard"
};

class ProductCard extends BaseLightningElement {
  constructor(...args) {
    super(...args);
    this.product = void 0;
  }

  get productPage() {
    return this.product && this.product.id ? "product?pid=" + encodeURIComponent(this.product.id) : "";
  }

  infoClick() {
    const json = JSON.stringify(this.product, null, '  ');
    alert(json);
  }

}

registerDecorators(ProductCard, {
  publicProps: {
    product: {
      config: 0
    }
  }
});

var _commerceProductcard = registerComponent(ProductCard, {
  tmpl: _tmpl$b
});

function tmpl$b($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    c: api_custom_element,
    k: api_key,
    i: api_iterator
  } = $api;
  return [!$cmp.hasCategory ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 1
  }, [api_element("h3", {
    classMap: {
      "my-4": true
    },
    key: 0
  }, [api_text("Welcome to LWC Commerce!")])]) : null, !$cmp.hasCategory ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 2
  }, [api_text("Please select a product category on the left")]) : null, $cmp.hasCategory ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 10
  }, [$cmp.hasProducts ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 4
  }, [api_element("h3", {
    classMap: {
      "my-4": true
    },
    key: 3
  }, [api_text("Search Results:")])]) : null, $cmp.hasProducts ? $cmp.hasProducts ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 7
  }, api_iterator($cmp.products.data, function (product) {
    return api_element("div", {
      classMap: {
        "col-lg-4": true,
        "col-md-6": true,
        "mb-4": true
      },
      key: api_key(6, product.ProductCode)
    }, [api_custom_element("commerce-productcard", _commerceProductcard, {
      props: {
        "product": product
      },
      key: 5
    }, [])]);
  })) : null : null, !$cmp.hasProducts ? $cmp.loading ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 8
  }, [api_text("Loading...")]) : null : null, !$cmp.hasProducts ? !$cmp.loading ? api_element("div", {
    classMap: {
      "row": true
    },
    key: 9
  }, [api_text("No product is available, please change the selection")]) : null : null]) : null];
}

var _tmpl$c = registerTemplate(tmpl$b);
tmpl$b.stylesheets = [];
tmpl$b.stylesheetTokens = {
  hostAttribute: "commerce-productlist_productlist-host",
  shadowAttribute: "commerce-productlist_productlist"
};

class ProductList extends BaseLightningElement {
  constructor() {
    super();
    this.category = void 0;
    this.products = void 0;
  }

  connectedCallback() {
    this.category = getQueryParameter("category");
    this.subscription = productsStore.getObservable(this.category).subscribe(products => {
      this.products = products;
    });
  }

  disconnectedCallback() {
    this.subscription.unsubscribe();
  }

  get hasProducts() {
    return this.products.data && this.products.data.length > 0;
  }

  get hasCategory() {
    return !!this.category;
  }

}

registerDecorators(ProductList, {
  fields: ["category", "products"]
});

var _commerceProductlist = registerComponent(ProductList, {
  tmpl: _tmpl$c
});

function tmpl$c($api, $cmp, $slotset, $ctx) {
  const {
    c: api_custom_element,
    h: api_element
  } = $api;
  return [api_custom_element("commerce-page", _commercePage, {
    key: 6
  }, [api_element("div", {
    classMap: {
      "container": true
    },
    key: 5
  }, [api_element("div", {
    classMap: {
      "row": true
    },
    key: 4
  }, [api_element("div", {
    classMap: {
      "col-lg-3": true
    },
    key: 1
  }, [api_custom_element("commerce-category-nav", _commerceCategoryNav, {
    key: 0
  }, [])]), api_element("div", {
    classMap: {
      "col-lg-9": true
    },
    key: 3
  }, [api_custom_element("commerce-productlist", _commerceProductlist, {
    key: 2
  }, [])])])])])];
}

var _tmpl$d = registerTemplate(tmpl$c);
tmpl$c.stylesheets = [];
tmpl$c.stylesheetTokens = {
  hostAttribute: "commerce-main_main-host",
  shadowAttribute: "commerce-main_main"
};

class Main$1 extends BaseLightningElement {}

var CommerceMain = registerComponent(Main$1, {
  tmpl: _tmpl$d
});

/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
customElements.define("demo-main", DemoMain.CustomElementConstructor);
customElements.define("slot-main", SlotMain.CustomElementConstructor);
customElements.define("commerce-main", CommerceMain.CustomElementConstructor);
