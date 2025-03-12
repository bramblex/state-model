import { useEffect, useMemo, useState } from "react";
import type { BaseState, StateModel } from "./index.js";

export * from "./index.js";

function useForceUpdate() {
  const [_, setState] = useState({});
  return (..._args: unknown[]) => setState({});
}

export function useModel<Model extends StateModel<BaseState>>(
  model: Model
): void {
  const forceUpdate = useForceUpdate();
  useEffect(() => model.onUpdate(forceUpdate), [model]);
}

export function useLocalModel<Model extends StateModel<BaseState>>(
  creator: () => Model
): Model {
  const model = useMemo(creator, []);
  useModel(model);
  return model;
}
