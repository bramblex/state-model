import * as react from 'react';

declare type Listener<State> = (model: StateModel<State>) => any;
declare type GetStateByModel<T> = T extends StateModel<infer P> ? P : never;
declare class StateModel<State> {
    state: State;
    private listeners;
    constructor(state: State);
    on(rawListener: Listener<State>): () => void;
    setState(newState: State): void;
}
declare function useModel<Model extends StateModel<GetStateByModel<Model>>>(model: Model): Model;
declare function useLocalModel<Model extends StateModel<GetStateByModel<Model>>>(creator: () => Model, deps?: any[]): Model;
declare function useModelContext<Model extends StateModel<GetStateByModel<Model>>>(ModelClass: new (...args: any[]) => Model): Model;
declare function useModelProvider<Model extends StateModel<GetStateByModel<Model>>>(ModelClass: new (...args: any[]) => Model): react.Provider<Model>;

export { StateModel, useLocalModel, useModel, useModelContext, useModelProvider };
