import { Provider } from 'react';
import { StateModelType, GetStateByModel } from '@bramblex/state-model';

declare function useModel<Model extends StateModelType<GetStateByModel<Model>>>(model: Model): Model;
declare function useLocalModel<Model extends StateModelType<GetStateByModel<Model>>>(creator: () => Model, deps?: unknown[]): Model;
declare function useModelContext<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Model;
declare function useModelProvider<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Provider<Model>;

export { useLocalModel, useModel, useModelContext, useModelProvider };
