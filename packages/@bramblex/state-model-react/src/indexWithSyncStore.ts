import type { ModelApi } from '@bramblex/state-model';
// 草，cjs gg
// @ts-ignore
import moduleExports from 'use-sync-external-store/shim';

const { useSyncExternalStore } = moduleExports

export const useSyncModel = <T>(api: ModelApi<T>) => {
  return useSyncExternalStore(api.subscribe, api.getSnapshot);
};
