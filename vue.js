import { customRef, onUnmounted } from "vue";
export * from "./index.js";
export function useModel(model) {
    const triggers = {};
    const refs = new Proxy(model.state, {
        get(_, key) {
            return customRef((track, trigger) => {
                triggers[key] = trigger;
                return {
                    get() {
                        track();
                        return model.state[key];
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
    return refs;
}
//# sourceMappingURL=vue.js.map