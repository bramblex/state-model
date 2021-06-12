declare type Listener<State> = (state: State, prev: State, model: StateModelType<State>) => void;
declare type GetStateByModel<T> = T extends StateModelType<infer P> ? P : never;
interface StateModelType<State> {
    onStateChange(rawListener: Listener<State>): () => void;
}
declare class StateModel<State> implements StateModelType<State> {
    state: State;
    private listeners;
    constructor(state: State);
    onStateChange(rawListener: Listener<State>): () => void;
    setState(state: State): void;
}

export { GetStateByModel, Listener, StateModel, StateModelType };
