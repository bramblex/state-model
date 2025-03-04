import { useEffect, useMemo, useState } from "react";
export * from "./index.js";
function useForceUpdate() {
    const [_, setState] = useState({});
    return (..._args) => setState({});
}
export function useModel(model) {
    const forceUpdate = useForceUpdate();
    useEffect(() => model.onUpdate(forceUpdate), [model]);
}
export function useLocalModel(creator) {
    const model = useMemo(creator, []);
    useModel(model);
    return model;
}
//# sourceMappingURL=react.js.map