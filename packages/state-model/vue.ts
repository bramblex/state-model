import { customRef, onUnmounted, Ref } from "vue";
import type { BaseState, StateModel } from "./index.js";

export * from "./index.js";

type ToRefs<T extends BaseState> = {
  [key in keyof T]: Ref<T[key]>;
};

export function useModel<State extends BaseState>(
  model: StateModel<State>
): ToRefs<State> {
  const triggers = {} as Record<string, () => void>;

  const refs = new Proxy(model.state, {
    get(_, key) {
      return customRef((track, trigger) => {
        triggers[key as string] = trigger;

        return {
          get() {
            track();
            return model.state[key as keyof State];
          },
          set() {
            console.warn("useModel: state is readonly");
            return false;
          },
        };
      });
    },
    set() {
      return false;
    },
  });

  const off = model.onUpdate((state) => {
    for (const key in state) {
      triggers[key]?.();
    }
  });

  onUnmounted(off);
  return refs as ToRefs<State>;
}
