import { useState, useEffect, createContext, useContext, Context, useMemo } from 'react';

type Listener<State> = (model: StateModel<State>) => any;

type GetStateByModel<T> = T extends StateModel<infer P> ? P : never;

export class StateModel<State> {
  public state: State;

  private listeners: Listener<State>[] = [];

  constructor(state: State) {
    this.state = state;
  }

  on(rawListener: Listener<State>) {
    const listener: Listener<State> = (...args) => rawListener(...args);
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(newState: State) {
    this.state = newState;
    this.listeners.forEach(l => l(this));
  }
}

function useForceUpdate() {
  const [, setState] = useState(0);
  return () => setState((n: number) => n + 1);
}

export function useModel<Model extends StateModel<GetStateByModel<Model>>>(
  model: Model,
): Model {
  const forceUpdate = useForceUpdate();
  useEffect(() => model.on(forceUpdate), [model]);
  return model;
}

export function useLocalModel<Model extends StateModel<GetStateByModel<Model>>>(
  creator: () => Model, deps: any[] = []
): Model {
  return useModel(useMemo(creator, deps));
}

export function useModelContext<
  Model extends StateModel<GetStateByModel<Model>>
>(ModelClass: new (...args: any[]) => Model): Model {
  const ModelContext = (ModelClass as any).getOwnPropertyNames(
    '__Context__',
  ) as Context<Model>;
  return useContext(ModelContext);
}

export function useModelProvider<
  Model extends StateModel<GetStateByModel<Model>>
>(ModelClass: new (...args: any[]) => Model) {
  const ModelContext =
    ((ModelClass as any).getOwnPropertyNames(
      '__Context__',
    ) as Context<Model>) || createContext<Model>(null as any);
  (ModelClass as any).__Context__ = ModelContext;
  return ModelContext.Provider;
}
