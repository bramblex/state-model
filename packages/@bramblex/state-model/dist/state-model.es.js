
  /**
   * @license
   * author: bramblex<qjnight@gmail.com>
   * state-model.js v1.0.2
   * Released under the MIT license.
   */

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

export { StateModel };
