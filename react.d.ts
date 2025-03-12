import type { BaseState, StateModel } from "./index.js";
export * from "./index.js";
export declare function useModel<Model extends StateModel<BaseState>>(model: Model): void;
export declare function useLocalModel<Model extends StateModel<BaseState>>(creator: () => Model): Model;
