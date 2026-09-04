/* eslint-disable no-undef */
global.window = global.window || {};
global.window.dispatchEvent = global.window.dispatchEvent || jest.fn();
global.dispatchEvent = global.dispatchEvent || jest.fn();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const InsetsContext = React.createContext(inset);
  const FrameContext = React.createContext({ x: 0, y: 0, width: 390, height: 844 });
  return {
    SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children, style, ...rest }) => React.createElement(View, { style, ...rest }, children),
    SafeAreaInsetsContext: InsetsContext,
    SafeAreaFrameContext: FrameContext,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 390, height: 844 },
      insets: inset,
    },
  };
});

import 'react-native-gesture-handler/jestSetup';

// Mock react-dom for mobx-react-lite in React Native environment
jest.mock('react-dom', () => ({
  unstable_batchedUpdates: (cb) => cb(),
}), { virtual: true });

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-worklets
jest.mock('react-native-worklets', () => {
  return require('react-native-worklets/lib/module/mock');
});

// Mock Reanimated 4 CSS proxy for Jest
jest.mock('react-native-reanimated/lib/module/css/native/proxy', () => ({
  setViewStyle: jest.fn(),
  setCSSEventHandler: jest.fn(),
  markNodeAsRemovable: jest.fn(),
  unmarkNodeAsRemovable: jest.fn(),
  registerCSSKeyframes: jest.fn(),
  unregisterCSSKeyframes: jest.fn(),
  applyCSSAnimations: jest.fn(),
  unregisterCSSAnimations: jest.fn(),
  runCSSTransition: jest.fn(),
  unregisterCSSTransition: jest.fn(),
  registerPseudoStyles: jest.fn(),
  unregisterPseudoStyles: jest.fn(),
}));

// Setup official react-native-reanimated test helpers
require('react-native-reanimated').setUpTests();

// Mock version service network fetch
jest.mock('~/services/version', () => ({
  __esModule: true,
  currentVersion: '5.1.0',
  default: () => Promise.resolve('5.1.0'),
}));

// Mock delay in tests so initial screen renders cleanly without unhandled timer navigation
jest.mock('~/utils/delay', () => ({
  __esModule: true,
  default: () => new Promise(() => {}),
  delay: () => new Promise(() => {}),
}));
