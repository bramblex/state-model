import { Provider } from 'react';

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
declare function useModel<Model extends StateModelType<GetStateByModel<Model>>>(model: Model): Model;
declare function useLocalModel<Model extends StateModelType<GetStateByModel<Model>>>(creator: () => Model, deps?: unknown[]): Model;
declare function useModelContext<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Model;
declare function useModelProvider<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Provider<Model>;

export { StateModel, StateModelType, useLocalModel, useModel, useModelContext, useModelProvider };
