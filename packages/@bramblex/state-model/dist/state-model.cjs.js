
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v1.0.1
   * Released under the MIT license.
   */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class StateModel {
    state;
    listeners = [];
    constructor(state) {
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

exports.StateModel = StateModel;
