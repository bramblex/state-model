import { useState, useEffect, createContext, useContext, Context, useMemo, Provider } from 'react';
import { StateModelType, GetStateByModel, StateModel } from '@bramblex/state-model';
import { useSyncExternalStore as _useSyncExternalStore } from 'use-sync-external-store/shim';

export const useSyncExternalStore = _useSyncExternalStore

function useForceUpdate() {
  const [, setState] = useState(0);
  return () => setState((n: number) => n + 1);
}

export function useModel<Model extends StateModelType<GetStateByModel<Model>>>(
  model: Model,
): Model {
  const forceUpdate = useForceUpdate();
  useEffect(() => model.onStateChange(forceUpdate), [model]);
  return model;
}
export const useModelSync = <Model>(model: StateModel<Model>) => {
  return useSyncExternalStore(model.onStateChange.bind(model), () => model.state);
};

export function useLocalModel<Model extends StateModelType<GetStateByModel<Model>>>(
  creator: () => Model, deps: unknown[] = []
): Model {
  return useModel(useMemo(creator, deps));
}

type ModelClassType<Model> = {
  new(...args: unknown[]): Model;
  __Context__: Context<Model>;
}

function getContextByModelClass<
  Model extends StateModelType<GetStateByModel<Model>>
>(ModelClass: ModelClassType<Model>): Context<Model> {
  if (!Object.prototype.hasOwnProperty.apply(ModelClass, ['__Context__'])) {
    ModelClass.__Context__ = createContext<Model>(null as never);
  }
  return ModelClass.__Context__;
}

export function useModelContext<
  Model extends StateModelType<GetStateByModel<Model>>
>(ModelClass: new (...args: unknown[]) => Model): Model {
  const ModelContext = getContextByModelClass(ModelClass as ModelClassType<Model>);
  return useContext(ModelContext);
}

export function useModelProvider<
  Model extends StateModelType<GetStateByModel<Model>>
>(ModelClass: new (...args: unknown[]) => Model): Provider<Model> {
  const ModelContext = getContextByModelClass(ModelClass as ModelClassType<Model>);
  return ModelContext.Provider;
}
