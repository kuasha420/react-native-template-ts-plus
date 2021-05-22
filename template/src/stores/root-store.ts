import { flow, types } from 'mobx-state-tree';
import getLatestVersion from '~/services/version';

/**
 * Example of a Appwide Global Store
 */

const RootStore = types
  .model('RootStore', {
    version: '1.0.0',
    latestVersion: '1.0.0',
    hydrated: false,
  })
  .actions((self) => ({
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
  }));

export default RootStore;
