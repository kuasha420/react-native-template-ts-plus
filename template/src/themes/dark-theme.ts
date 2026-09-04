import {
  DarkTheme as NavigationDarkTheme,
  Theme,
} from '@react-navigation/native';
import { MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';

const { DarkTheme: NavigationDark } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  materialDark: MD3DarkTheme,
});

export const paperTheme = MD3DarkTheme;
export const navigationTheme: Theme = {
  ...NavigationDarkTheme,
  ...NavigationDark,
  colors: {
    ...NavigationDarkTheme.colors,
    ...NavigationDark.colors,
  },
};

const DarkTheme = {
  paperTheme,
  navigationTheme,
};

export default DarkTheme;
