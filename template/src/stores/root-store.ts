import { flow, types } from 'mobx-state-tree';
import getLatestVersion, { currentVersion } from '~/services/version';

/**
 * Example of an Appwide Global Store
 */

const RootStore = types
  .model('RootStore', {
    version: types.optional(types.string, currentVersion),
    latestVersion: types.optional(types.string, currentVersion),
    userColorScheme: types.maybeNull(types.union(types.literal('light'), types.literal('dark'))),
    hydrated: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setUserColorScheme(colorScheme: 'light' | 'dark' | 'auto' | null) {
      if (colorScheme === 'auto' || colorScheme === null) {
        self.userColorScheme = null;
      } else {
        self.userColorScheme = colorScheme;
      }
    },
    hydrate: flow(function* hydrate() {
      try {
        const version: string = yield getLatestVersion();
        self.latestVersion = version;
        self.hydrated = true;
      } catch (error) {
        console.error(error);
        self.hydrated = true;
      }
    }),
  }))
  .views((self) => ({
    get outdated() {
      return self.version !== self.latestVersion;
    },
    get currentColorScheme() {
      if (self.userColorScheme) {
        return self.userColorScheme;
      }
      return 'auto';
    },
  }));

export default RootStore;
