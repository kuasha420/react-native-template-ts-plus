import Loader from '~/screens/loader';
import Welcome from '~/screens/welcome';
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';

export type RootStackParams = {
  Loader: undefined | { delay?: number; text?: string };
  Welcome: undefined;
};

export type RootStackScreens = keyof RootStackParams;

export type RootStackScreenProps<T extends RootStackScreens> = NativeStackScreenProps<
  RootStackParams,
  T
>;

export type UseRootStackNavigation<T extends RootStackScreens = 'Loader'> =
  NativeStackNavigationProp<RootStackParams, T>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParams>();

const RootStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen name="Loader" component={Loader} />
    <Screen name="Welcome" component={Welcome} />
  </Navigator>
);

export default RootStack;
