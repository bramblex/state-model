export type BaseId = number | string | symbol | bigint;
export type BaseState = {};
export type UpdateListener<State extends BaseState = BaseState> = (state: Partial<State>) => unknown;
export type StateModelClass = {
    new (...args: unknown[]): StateModel;
};
export declare class StateModel<State extends BaseState = BaseState, Id extends BaseId = BaseId> {
    private __listeners__;
    private __updatePromise__;
    private __updateCached__;
    readonly state: State;
    constructor(initialState: State);
    update(_state: Partial<State> | ((State: State) => Partial<State>)): void;
    onUpdate(listener: UpdateListener<State>): () => void;
}
