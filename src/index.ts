import { useState, useEffect, createContext, useContext, Context, useMemo, Provider } from 'react';

type Listener<State> = (state: State, prev: State, model: StateModelType<State>) => void;

type GetStateByModel<T> = T extends StateModelType<infer P> ? P : never;

export interface StateModelType<State> {
  onStateChange(rawListener: Listener<State>): () => void;
}

export class StateModel<State> implements StateModelType<State> {
  public state: State;

  private listeners: Listener<State>[] = [];

  constructor(state: State) {
    this.state = state;
  }

  onStateChange(rawListener: Listener<State>): () => void {
    const listener: Listener<State> = (...args) => rawListener(...args);
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(state: State): void {
    const prev = this.state;
    this.state = state;
    this.listeners.forEach(l => l(state, prev, this));
  }
}

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
