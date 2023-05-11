type InternalSetState<T> = (partialState: T | Partial<T> | ((state: T) => T | Partial<T>)) => void

type GetOrNever<T, P> = T extends keyof P ? P[T] : never;

type Listener<T> = (state: T, prevState: T) => void

export interface ModelApi<T> {
  setState: InternalSetState<T>,
  getSnapshot: () => T,
  subscribe: (listener: Listener<T>) => () => void
}

export type Initializer<T> = ((
  setState: GetOrNever<'setState', ModelApi<T>>,
  getSnapshot: GetOrNever<'getSnapshot', ModelApi<T>>,
  store: ModelApi<T>
) => T);

type GetModelImpl = <T>(initializer: Initializer<T>) => ModelApi<T>;

export const createModel: GetModelImpl = (initializer) => {
  type Model = ReturnType<typeof initializer>;
  const listeners: Set<Listener<Model>> = new Set();
  let model: Model;

  const subscribe: ModelApi<Model>['subscribe'] = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  };

  const getSnapshot: ModelApi<Model>['getSnapshot'] = () => model;

  const setState: ModelApi<Model>['setState'] = (setter) => {
    const nextModel = typeof setter === 'function' ? (setter as (state: Model) => Model)(model) : setter;
    const prevModel = model;

    model = { ...model, ...nextModel };
    listeners.forEach(l => l(model, prevModel));
  };

  const modelApi = {
    subscribe,
    getSnapshot,
    setState
  };

  // init
  model = initializer(setState, getSnapshot, modelApi);
  return modelApi
}
