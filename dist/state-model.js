
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v0.0.1
   * Released under the MIT license.
   */

var StateModel = (function (exports, react) {
    'use strict';

    class StateModel {
        constructor(state) {
            this.listeners = [];
            this.state = state;
        }
        on(rawListener) {
            const listener = (...args) => rawListener(...args);
            this.listeners.push(listener);
            return () => {
                this.listeners = this.listeners.filter(l => l !== listener);
            };
        }
        setState(newState) {
            this.state = newState;
            this.listeners.forEach(l => l(this));
        }
    }
    function useForceUpdate() {
        const [, setState] = react.useState(0);
        return () => setState((n) => n + 1);
    }
    function useModel(model) {
        const forceUpdate = useForceUpdate();
        react.useEffect(() => model.on(forceUpdate), [model]);
        return model;
    }
    function useLocalModel(creator, deps = []) {
        return useModel(react.useMemo(creator, deps));
    }
    function useModelContext(ModelClass) {
        const ModelContext = ModelClass.getOwnPropertyNames('__Context__');
        return react.useContext(ModelContext);
    }
    function useModelProvider(ModelClass) {
        const ModelContext = ModelClass.getOwnPropertyNames('__Context__') || react.createContext(null);
        ModelClass.__Context__ = ModelContext;
        return ModelContext.Provider;
    }

    exports.StateModel = StateModel;
    exports.useLocalModel = useLocalModel;
    exports.useModel = useModel;
    exports.useModelContext = useModelContext;
    exports.useModelProvider = useModelProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, React));
