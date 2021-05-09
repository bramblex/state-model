
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v0.0.2
   * Released under the MIT license.
   */

import { useEffect, useMemo, useContext, useState, createContext } from 'react';

class StateModel {
    constructor(state) {
        this.listeners = [];
        this.state = state;
    }
    onStateChange(rawListener) {
        const listener = (...args) => rawListener(...args);
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    setState(state) {
        const prev = this.state;
        this.state = state;
        this.listeners.forEach(l => l(state, prev, this));
    }
}
function useForceUpdate() {
    const [, setState] = useState(0);
    return () => setState((n) => n + 1);
}
function useModel(model) {
    const forceUpdate = useForceUpdate();
    useEffect(() => model.onStateChange(forceUpdate), [model]);
    return model;
}
function useLocalModel(creator, deps = []) {
    return useModel(useMemo(creator, deps));
}
function getContextByModelClass(ModelClass) {
    if (!Object.prototype.hasOwnProperty.apply(ModelClass, ['__Context__'])) {
        ModelClass.__Context__ = createContext(null);
    }
    return ModelClass.__Context__;
}
function useModelContext(ModelClass) {
    const ModelContext = getContextByModelClass(ModelClass);
    return useContext(ModelContext);
}
function useModelProvider(ModelClass) {
    const ModelContext = getContextByModelClass(ModelClass);
    return ModelContext.Provider;
}

export { StateModel, useLocalModel, useModel, useModelContext, useModelProvider };
