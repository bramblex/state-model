
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v0.0.1
   * Released under the MIT license.
   */

import { useEffect, useMemo, useContext, createContext, useState } from 'react';

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
    const [, setState] = useState(0);
    return () => setState((n) => n + 1);
}
function useModel(model) {
    const forceUpdate = useForceUpdate();
    useEffect(() => model.on(forceUpdate), [model]);
    return model;
}
function useLocalModel(creator, deps = []) {
    return useModel(useMemo(creator, deps));
}
function useModelContext(ModelClass) {
    const ModelContext = ModelClass.getOwnPropertyNames('__Context__');
    return useContext(ModelContext);
}
function useModelProvider(ModelClass) {
    const ModelContext = ModelClass.getOwnPropertyNames('__Context__') || createContext(null);
    ModelClass.__Context__ = ModelContext;
    return ModelContext.Provider;
}

export { StateModel, useLocalModel, useModel, useModelContext, useModelProvider };
