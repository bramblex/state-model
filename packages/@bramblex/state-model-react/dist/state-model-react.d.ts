import { Provider } from 'react';
import { StateModelType, GetStateByModel, StateModel } from '@bramblex/state-model';
import { useSyncExternalStore as useSyncExternalStore$1 } from 'use-sync-external-store/shim';

declare const useSyncExternalStore: typeof useSyncExternalStore$1;
declare function useModel<Model extends StateModelType<GetStateByModel<Model>>>(model: Model): Model;
declare const useModelSync: <Model>(model: StateModel<Model>) => Model;
declare function useLocalModel<Model extends StateModelType<GetStateByModel<Model>>>(creator: () => Model, deps?: unknown[]): Model;
declare function useModelContext<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Model;
declare function useModelProvider<Model extends StateModelType<GetStateByModel<Model>>>(ModelClass: new (...args: unknown[]) => Model): Provider<Model>;

export { useLocalModel, useModel, useModelContext, useModelProvider, useModelSync, useSyncExternalStore };
