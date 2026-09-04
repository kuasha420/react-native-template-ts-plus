module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-paper|@callstack|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-vector-icons|react-native-pager-view|react-native-tab-view|mobx-state-tree|mst-persistent-store|use-async-effect)/',
  ],
};
