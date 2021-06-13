
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model-react.js v1.0.1
   * Released under the MIT license.
   */

import { useEffect, useMemo, useContext, useState, createContext } from 'react';

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

export { useLocalModel, useModel, useModelContext, useModelProvider };
