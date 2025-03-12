export type BaseId = number | string | symbol | bigint;

export type BaseState = {};

export type UpdateListener<State extends BaseState = BaseState> = (
  state: Partial<State>
) => unknown;

export type StateModelClass = {
  new (...args: unknown[]): StateModel;
};

export class StateModel<
  State extends BaseState = BaseState,
  Id extends BaseId = BaseId
> {
  // static

  // 用于记录所有 StateModel 实例
  private static __instanceMap__: Map<Function, Map<BaseId, StateModel>> =
    new Map();

  // 生成匿名 ID
  private static __anonymousId__(constructor: Function): Symbol {
    return Symbol(constructor.name);
  }

  public static getInstance<Model extends StateModel>(
    constructor: StateModelClass,
    id: BaseId
  ): Model | null {
    return (this.__instanceMap__.get(constructor)?.get(id) as Model) ?? null;
  }

  public static setInstance<Model extends StateModel>(
    constructor: StateModelClass,
    id: BaseId,
    instance: Model
  ): void {
    let instanceMap = this.__instanceMap__.get(constructor);
    if (!instanceMap) {
      instanceMap = new Map();
      this.__instanceMap__.set(constructor, instanceMap);
    }
    instanceMap.set(id, instance);
  }

  public static deleteInstance<Model extends StateModel>(
    constructor: StateModelClass,
    id: BaseId
  ): boolean {
    return this.__instanceMap__.get(constructor)?.delete(id) ?? false;
  }

  // instance
  private __listeners__: UpdateListener<State>[] = [];
  private __updatePromise__: Promise<void> | null = null;
  private __updateCached__: Partial<State> = {};
  private __ModelClass__: StateModelClass;

  public readonly id: Id;
  public readonly state: State;

  constructor(
    initialState: State,
    id?: Id,
    updateState?: Partial<State>,
    constructor?: StateModelClass
  ) {
    // 初始化状态
    this.state = initialState;
    this.__ModelClass__ = constructor || (this.constructor as StateModelClass);

    // 如果没传 id，则生成一个匿名 id，直接返回，不记录进 __instanceMap__
    if (id === undefined || id === null) {
      this.id = StateModel.__anonymousId__(this.constructor) as Id;
      return;
    }

    this.id = id;

    let instance: StateModel<State, Id> | null = StateModel.getInstance(
      this.__ModelClass__,
      id
    );

    if (!instance) {
      instance = this;
      StateModel.setInstance(
        this.__ModelClass__ as StateModelClass,
        id,
        instance
      );
    }

    // 如果有 updateState，则更新状态
    if (updateState) {
      instance.update(updateState);
    }

    return instance;
  }

  update(_state: Partial<State> | ((State: State) => Partial<State>)): void {
    const state = typeof _state === "function" ? _state(this.state) : _state;
    // 更新状态
    (this as { state: State }).state = {
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

  onUpdate(listener: UpdateListener<State>): () => void {
    this.__listeners__.push(listener);
    return () =>
      (this.__listeners__ = this.__listeners__.filter(
        (item) => item !== listener
      ));
  }

  destroy(): boolean {
    return StateModel.deleteInstance(this.__ModelClass__, this.id);
  }
}
