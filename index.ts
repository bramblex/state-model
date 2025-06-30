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
  private __listeners__: UpdateListener<State>[] = [];
  private __updatePromise__: Promise<void> | null = null;
  private __updateCached__: Partial<State> = {};

  public readonly state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  update(_state: Partial<State> | ((State: State) => Partial<State>)): void {
    const state = typeof _state === "function" ? _state(this.state) : _state;

    // 如果 state 为空，则不更新
    if (Object.keys(state).length === 0) {
      return;
    }

    // 更新状态
    (this as { state: State }).state = {
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

  onUpdate(listener: UpdateListener<State>): () => void {
    this.__listeners__.push(listener);
    return () =>
      (this.__listeners__ = this.__listeners__.filter(
        (item) => item !== listener
      ));
  }
}
