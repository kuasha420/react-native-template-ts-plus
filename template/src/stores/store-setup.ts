import AsyncStorage from '@react-native-async-storage/async-storage';
import createPersistentStore from 'mst-persistent-store';
import RootStore from '~/stores/root-store';

const createStore =
  typeof createPersistentStore === 'function'
    ? createPersistentStore
    : (createPersistentStore as any).default;

const storage = {
  setItem: (key: string, value: any) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

export const [RootStoreProvider, useRootStore] = createStore(
  RootStore,
  storage,
  {},
  {
    hydrated: false,
  },
  {
    logging: false,
    devtool: false,
  }
);
