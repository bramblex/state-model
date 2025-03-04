import { Ref } from "vue";
import type { BaseState, StateModel } from "./index.js";
export * from "./index.js";
type ToRefs<T extends BaseState> = {
    [key in keyof T]: Ref<T[key]>;
};
export declare function useModel<Model extends StateModel<State>, State extends BaseState>(model: Model): ToRefs<State>;
