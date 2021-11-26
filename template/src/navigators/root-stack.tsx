import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import Drawer, { DrawerScreensParams } from '~/navigators/drawer';
import Loader from '~/screens/loader';

export type RootStackScreensParams = {
  Loader: undefined | { delay?: number; text?: string };
  Drawer: undefined | NavigatorScreenParams<DrawerScreensParams>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackScreensParams {}
  }
}

export type RootStackScreens = keyof RootStackScreensParams;

export type RootStackScreenProp<T extends RootStackScreens> = NativeStackScreenProps<
  RootStackScreensParams,
  T
>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackScreensParams>();

const RootStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen name="Loader" component={Loader} />
    <Screen name="Drawer" component={Drawer} />
  </Navigator>
);

export default RootStack;
