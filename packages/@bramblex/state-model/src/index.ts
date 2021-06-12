export type Listener<State> = (state: State, prev: State, model: StateModelType<State>) => void;

export type GetStateByModel<T> = T extends StateModelType<infer P> ? P : never;

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