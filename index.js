export class StateModel {
    __listeners__ = [];
    __updatePromise__ = null;
    __updateCached__ = {};
    state;
    constructor(initialState) {
        this.state = initialState;
    }
    update(_state) {
        const state = typeof _state === "function" ? _state(this.state) : _state;
        // 如果 state 为空，则不更新
        if (Object.keys(state).length === 0) {
            return;
        }
        // 更新状态
        this.state = {
            ...this.state,
            ...state,
        };
        this.__updateCached__ = {
            ...this.__updateCached__,
            ...state,
        };
        if (this.__updatePromise__) {
            return;
        }
        // 将多次更新合并为一次更新，用 updateCached 来缓存更新的状态
        this.__updatePromise__ = Promise.resolve().then(() => {
            const updateCached = this.__updateCached__;
            this.__updateCached__ = {};
            this.__updatePromise__ = null;
            this.__listeners__.forEach((listener) => listener(updateCached));
        });
    }
    onUpdate(listener) {
        this.__listeners__.push(listener);
        return () => (this.__listeners__ = this.__listeners__.filter((item) => item !== listener));
    }
}
//# sourceMappingURL=index.js.map