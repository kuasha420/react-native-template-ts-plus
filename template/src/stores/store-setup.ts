import createPersistentStore from 'mst-persistent-store';
import RootStore from '~/stores/root-store';

export const [RootStoreProvider, useRootStore] = createPersistentStore(
  RootStore,
  {},
  {
    hydrated: false,
  }
);
