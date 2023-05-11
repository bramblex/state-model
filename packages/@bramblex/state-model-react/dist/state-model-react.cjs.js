
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model-react.js v1.0.3
   * Released under the MIT license.
   */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var e = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var e__default = /*#__PURE__*/_interopDefaultLegacy(e);

function useForceUpdate() {
    const [, setState] = e.useState(0);
    return () => setState((n) => n + 1);
}
function useModel(model) {
    const forceUpdate = useForceUpdate();
    e.useEffect(() => model.onStateChange(forceUpdate), [model]);
    return model;
}
function useLocalModel(creator, deps = []) {
    return useModel(e.useMemo(creator, deps));
}
function getContextByModelClass(ModelClass) {
    if (!Object.prototype.hasOwnProperty.apply(ModelClass, ['__Context__'])) {
        ModelClass.__Context__ = e.createContext(null);
    }
    return ModelClass.__Context__;
}
function useModelContext(ModelClass) {
    const ModelContext = getContextByModelClass(ModelClass);
    return e.useContext(ModelContext);
}
function useModelProvider(ModelClass) {
    const ModelContext = getContextByModelClass(ModelClass);
    return ModelContext.Provider;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function h(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var k = "function" === typeof Object.is ? Object.is : h,
  l = e__default["default"].useState,
  m = e__default["default"].useEffect,
  n = e__default["default"].useLayoutEffect,
  p = e__default["default"].useDebugValue;
function q(a, b) {
  var d = b(),
    f = l({
      inst: {
        value: d,
        getSnapshot: b
      }
    }),
    c = f[0].inst,
    g = f[1];
  n(function () {
    c.value = d;
    c.getSnapshot = b;
    r(c) && g({
      inst: c
    });
  }, [a, d, b]);
  m(function () {
    r(c) && g({
      inst: c
    });
    return a(function () {
      r(c) && g({
        inst: c
      });
    });
  }, [a]);
  p(d);
  return d;
}
function r(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var d = b();
    return !k(a, d);
  } catch (f) {
    return !0;
  }
}
function t(a, b) {
  return b();
}
var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
var useSyncExternalStore$1 = void 0 !== e__default["default"].useSyncExternalStore ? e__default["default"].useSyncExternalStore : u;
var useSyncExternalStoreShim_production_min = {
  useSyncExternalStore: useSyncExternalStore$1
};

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var useSyncExternalStoreShim_development = createCommonjsModule(function (module, exports) {

  if (process.env.NODE_ENV !== "production") {
    (function () {

      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React = e__default["default"];
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning('error', format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        // When changing this logic, you might want to also
        // update consoleWithStackDev.www.js as well.
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== '') {
            format += '%s';
            args = args.concat([stack]);
          } // eslint-disable-next-line react-internal/safe-string-coercion

          var argsWithFormat = args.map(function (item) {
            return String(item);
          }); // Careful: RN currently depends on this prefix

          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          // eslint-disable-next-line react-internal/no-production-logging

          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }

      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      function is(x, y) {
        return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
        ;
      }

      var objectIs = typeof Object.is === 'function' ? Object.is : is;

      // dispatch for CommonJS interop named imports.

      var useState = React.useState,
        useEffect = React.useEffect,
        useLayoutEffect = React.useLayoutEffect,
        useDebugValue = React.useDebugValue;
      var didWarnOld18Alpha = false;
      var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
      // because of a very particular set of implementation details and assumptions
      // -- change any one of them and it will break. The most important assumption
      // is that updates are always synchronous, because concurrent rendering is
      // only available in versions of React that also have a built-in
      // useSyncExternalStore API. And we only use this shim when the built-in API
      // does not exist.
      //
      // Do not assume that the clever hacks used by this hook also work in general.
      // The point of this shim is to replace the need for hacks by other libraries.

      function useSyncExternalStore(subscribe, getSnapshot,
      // Note: The shim does not use getServerSnapshot, because pre-18 versions of
      // React do not expose a way to check if we're hydrating. So users of the shim
      // will need to track that themselves and return the correct value
      // from `getSnapshot`.
      getServerSnapshot) {
        {
          if (!didWarnOld18Alpha) {
            if (React.startTransition !== undefined) {
              didWarnOld18Alpha = true;
              error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
            }
          }
        } // Read the current snapshot from the store on every render. Again, this
        // breaks the rules of React, and only works here because of specific
        // implementation details, most importantly that updates are
        // always synchronous.

        var value = getSnapshot();
        {
          if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            if (!objectIs(value, cachedValue)) {
              error('The result of getSnapshot should be cached to avoid an infinite loop');
              didWarnUncachedGetSnapshot = true;
            }
          }
        } // Because updates are synchronous, we don't queue them. Instead we force a
        // re-render whenever the subscribed state changes by updating an some
        // arbitrary useState hook. Then, during render, we call getSnapshot to read
        // the current value.
        //
        // Because we don't actually use the state returned by the useState hook, we
        // can save a bit of memory by storing other stuff in that slot.
        //
        // To implement the early bailout, we need to track some things on a mutable
        // object. Usually, we would put that in a useRef hook, but we can stash it in
        // our useState hook instead.
        //
        // To force a re-render, we call forceUpdate({inst}). That works because the
        // new object always fails an equality check.

        var _useState = useState({
            inst: {
              value: value,
              getSnapshot: getSnapshot
            }
          }),
          inst = _useState[0].inst,
          forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
        // in the layout phase so we can access it during the tearing check that
        // happens on subscribe.

        useLayoutEffect(function () {
          inst.value = value;
          inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
          // commit phase if there was an interleaved mutation. In concurrent mode
          // this can happen all the time, but even in synchronous mode, an earlier
          // effect may have mutated the store.

          if (checkIfSnapshotChanged(inst)) {
            // Force a re-render.
            forceUpdate({
              inst: inst
            });
          }
        }, [subscribe, value, getSnapshot]);
        useEffect(function () {
          // Check for changes right before subscribing. Subsequent changes will be
          // detected in the subscription handler.
          if (checkIfSnapshotChanged(inst)) {
            // Force a re-render.
            forceUpdate({
              inst: inst
            });
          }
          var handleStoreChange = function handleStoreChange() {
            // TODO: Because there is no cross-renderer API for batching updates, it's
            // up to the consumer of this library to wrap their subscription event
            // with unstable_batchedUpdates. Should we try to detect when this isn't
            // the case and print a warning in development?
            // The store changed. Check if the snapshot changed since the last time we
            // read from the store.
            if (checkIfSnapshotChanged(inst)) {
              // Force a re-render.
              forceUpdate({
                inst: inst
              });
            }
          }; // Subscribe to the store and return a clean-up function.

          return subscribe(handleStoreChange);
        }, [subscribe]);
        useDebugValue(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        var prevValue = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(prevValue, nextValue);
        } catch (error) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
        // Note: The shim does not use getServerSnapshot, because pre-18 versions of
        // React do not expose a way to check if we're hydrating. So users of the shim
        // will need to track that themselves and return the correct value
        // from `getSnapshot`.
        return getSnapshot();
      }
      var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');
      var isServerEnvironment = !canUseDOM;
      var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
      var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;
      exports.useSyncExternalStore = useSyncExternalStore$2;
      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
});

var shim = createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = useSyncExternalStoreShim_production_min;
  } else {
    module.exports = useSyncExternalStoreShim_development;
  }
});

// 草，cjs gg
const { useSyncExternalStore } = shim;
const useSyncModel = (api) => {
    return useSyncExternalStore(api.subscribe, api.getSnapshot);
};

exports.useLocalModel = useLocalModel;
exports.useModel = useModel;
exports.useModelContext = useModelContext;
exports.useModelProvider = useModelProvider;
exports.useSyncModel = useSyncModel;
