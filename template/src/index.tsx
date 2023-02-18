import { changeBarColors } from '@aladdinstudios/react-native-immersive-bars';
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Linking, Platform } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import RootStack, { RootStackScreensParams } from '~/navigators/root-stack';
import { RootStoreProvider, useRootStore } from '~/stores/store-setup';
import DarkTheme from '~/themes/dark-theme';
import DefaultTheme from '~/themes/default-theme';
import delay from '~/utils/delay';

const linking: LinkingOptions<RootStackScreensParams> = {
  prefixes: [
    /* your linking prefixes */
    'helloworld://',
    'https://www.helloworld.com',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'Loader',
    screens: {
      Loader: {
        path: 'loader/:delay?/:text?',
        parse: {
          delay: (ms) => Number(ms),
          text: (text) => decodeURIComponent(text),
        },
        stringify: {
          delay: (ms) => String(ms),
          text: (text) => encodeURIComponent(text),
        },
      },
      Drawer: {
        screens: {
          Welcome: 'welcome',
        },
      },
    },
  },
};

const Main = observer(() => {
  const { hydrate } = useRootStore();
  const nav = useRef<NavigationContainerRef<RootStackScreensParams>>(null);
  const [isDark] = useIsDarkTheme();
  const theme = useMemo(() => {
    if (isDark) {
      return DarkTheme;
    }
    return DefaultTheme;
  }, [isDark]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeBarColors(isDark);
    }
  }, [isDark]);

  const onReady = useCallback(async () => {
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        await delay(500);
        await hydrate();
        RNBootSplash.hide({ fade: true });
      }
    } catch (error) {
      console.error(error);
    }
  }, [hydrate]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <NavigationContainer linking={linking} theme={theme} ref={nav} onReady={onReady}>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
});

const App = () => (
  <RootStoreProvider>
    <Main />
  </RootStoreProvider>
);

export default App;
