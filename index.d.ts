export type BaseId = number | string | symbol | bigint;
export type BaseState = {};
export type UpdateListener<State extends BaseState = BaseState> = (state: Partial<State>) => unknown;
export type StateModelClass = {
    new (...args: unknown[]): StateModel;
};
export declare class StateModel<State extends BaseState = BaseState, Id extends BaseId = BaseId> {
    private static __instanceMap__;
    private static __anonymousId__;
    static getInstance<Model extends StateModel>(constructor: StateModelClass, id: BaseId): Model | null;
    static setInstance<Model extends StateModel>(constructor: StateModelClass, id: BaseId, instance: Model): void;
    static deleteInstance<Model extends StateModel>(constructor: StateModelClass, id: BaseId): boolean;
    private __listeners__;
    private __updatePromise__;
    private __updateCached__;
    private __ModelClass__;
    readonly id: Id;
    readonly state: State;
    constructor(initialState: State, id?: Id, updateState?: Partial<State>, constructor?: StateModelClass);
    update(_state: Partial<State> | ((State: State) => Partial<State>)): void;
    onUpdate(listener: UpdateListener<State>): () => void;
    destroy(): boolean;
}
