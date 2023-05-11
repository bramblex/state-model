
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v1.0.3
   * Released under the MIT license.
   */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const createModel = (initializer) => {
    const listeners = new Set();
    let model;
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };
    const getSnapshot = () => model;
    const setState = (setter) => {
        const nextModel = typeof setter === 'function' ? setter(model) : setter;
        const prevModel = model;
        model = Object.assign(Object.assign({}, model), nextModel);
        listeners.forEach(l => l(model, prevModel));
    };
    const modelApi = {
        subscribe,
        getSnapshot,
        setState
    };
    // init
    model = initializer(setState, getSnapshot, modelApi);
    return modelApi;
};

exports.StateModel = StateModel;
exports.createModel = createModel;
