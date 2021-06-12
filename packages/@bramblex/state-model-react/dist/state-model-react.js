
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model-react.js v1.0.0
   * Released under the MIT license.
   */

var StateModelReact = (function (exports, react) {
    'use strict';

    function useForceUpdate() {
        const [, setState] = react.useState(0);
        return () => setState((n) => n + 1);
    }
    function useModel(model) {
        const forceUpdate = useForceUpdate();
        react.useEffect(() => model.onStateChange(forceUpdate), [model]);
        return model;
    }
    function useLocalModel(creator, deps = []) {
        return useModel(react.useMemo(creator, deps));
    }
    function getContextByModelClass(ModelClass) {
        if (!Object.prototype.hasOwnProperty.apply(ModelClass, ['__Context__'])) {
            ModelClass.__Context__ = react.createContext(null);
        }
        return ModelClass.__Context__;
    }
    function useModelContext(ModelClass) {
        const ModelContext = getContextByModelClass(ModelClass);
        return react.useContext(ModelContext);
    }
    function useModelProvider(ModelClass) {
        const ModelContext = getContextByModelClass(ModelClass);
        return ModelContext.Provider;
    }

    exports.useLocalModel = useLocalModel;
    exports.useModel = useModel;
    exports.useModelContext = useModelContext;
    exports.useModelProvider = useModelProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, React));
