import {
  DefaultTheme as NavigationDefaultTheme,
  Theme,
} from '@react-navigation/native';
import { MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  materialLight: MD3LightTheme,
});

export const paperTheme = MD3LightTheme;
export const navigationTheme: Theme = {
  ...NavigationDefaultTheme,
  ...LightTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...LightTheme.colors,
  },
};

const DefaultTheme = {
  paperTheme,
  navigationTheme,
};

export default DefaultTheme;
