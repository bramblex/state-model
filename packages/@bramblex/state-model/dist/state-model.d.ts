type Listener$1<State> = (state: State, prev: State, model: StateModelType<State>) => void;
type GetStateByModel<T> = T extends StateModelType<infer P> ? P : never;
interface StateModelType<State> {
    onStateChange(rawListener: Listener$1<State>): () => void;
}
declare class StateModel<State> implements StateModelType<State> {
    state: State;
    private listeners;
    constructor(state: State);
    onStateChange(rawListener: Listener$1<State>): () => void;
    setState(state: State): void;
}

type InternalSetState<T> = (partialState: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;
type GetOrNever<T, P> = T extends keyof P ? P[T] : never;
type Listener<T> = (state: T, prevState: T) => void;
interface ModelApi<T> {
    setState: InternalSetState<T>;
    getSnapshot: () => T;
    subscribe: (listener: Listener<T>) => () => void;
}
type Initializer<T> = ((setState: GetOrNever<'setState', ModelApi<T>>, getSnapshot: GetOrNever<'getSnapshot', ModelApi<T>>, store: ModelApi<T>) => T);
type GetModelImpl = <T>(initializer: Initializer<T>) => ModelApi<T>;
declare const createModel: GetModelImpl;

export { GetStateByModel, Initializer, Listener$1 as Listener, ModelApi, StateModel, StateModelType, createModel };
