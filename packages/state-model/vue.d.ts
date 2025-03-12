import { Ref } from "vue";
import type { BaseState, StateModel } from "./index.js";
export * from "./index.js";
type ToRefs<T extends BaseState> = {
    [key in keyof T]: Ref<T[key]>;
};
export declare function useModel<State extends BaseState>(model: StateModel<State>): ToRefs<State>;
