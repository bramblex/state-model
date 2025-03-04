export class StateModel {
    // static
    // 用于记录所有 StateModel 实例
    static __instanceMap__ = new Map();
    // 生成匿名 ID
    static __anonymousId__(constructor) {
        return Symbol(constructor.name);
    }
    static getInstance(constructor, id) {
        return this.__instanceMap__.get(constructor)?.get(id) ?? null;
    }
    static setInstance(constructor, id, instance) {
        let instanceMap = this.__instanceMap__.get(constructor);
        if (!instanceMap) {
            instanceMap = new Map();
            this.__instanceMap__.set(constructor, instanceMap);
        }
        instanceMap.set(id, instance);
    }
    static deleteInstance(constructor, id) {
        return this.__instanceMap__.get(constructor)?.delete(id) ?? false;
    }
    // instance
    __listeners__ = [];
    __updatePromise__ = null;
    __updateCached__ = {};
    __ModelClass__;
    id;
    state;
    constructor(initialState, id, updateState, constructor) {
        // 初始化状态
        this.state = initialState;
        this.__ModelClass__ = constructor || this.constructor;
        // 如果没传 id，则生成一个匿名 id，直接返回，不记录进 __instanceMap__
        if (id === undefined || id === null) {
            this.id = StateModel.__anonymousId__(this.constructor);
            return;
        }
        this.id = id;
        let instance = StateModel.getInstance(this.__ModelClass__, id);
        if (!instance) {
            instance = this;
            StateModel.setInstance(this.__ModelClass__, id, instance);
        }
        // 如果有 updateState，则更新状态
        if (updateState) {
            instance.update(updateState);
        }
        return instance;
    }
    update(_state) {
        const state = typeof _state === "function" ? _state(this.state) : _state;
        // 更新状态
        this.state = {
            ...this.state,
            ...state,
        };
        // 如果 state 为空，则不更新
        if (Object.keys(state).length === 0) {
            return;
        }
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
    destroy() {
        return StateModel.deleteInstance(this.__ModelClass__, this.id);
    }
}
//# sourceMappingURL=index.js.map