import { changeBarColors } from '@aladdinstudios/react-native-immersive-bars';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import { DrawerScreenProp } from '~/navigators/drawer';
import Details from '~/screens/details';
import Home from '~/screens/home';

export type BottomTabScreensParams = {
  Home: undefined;
  Details: undefined;
};

export type BottomTabScreens = keyof BottomTabScreensParams;

export type BottomTabScreenProp<T extends BottomTabScreens> = CompositeScreenProps<
  MaterialBottomTabScreenProps<BottomTabScreensParams, T>,
  DrawerScreenProp<'BottomTab'>
>;

const { Navigator, Screen } = createMaterialBottomTabNavigator<BottomTabScreensParams>();

const BottomTab = () => {
  const { bottom } = useSafeAreaInsets();
  const [isDark] = useIsDarkTheme();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        changeBarColors(true);
        return () => changeBarColors(isDark);
      }
    }, [isDark])
  );

  return (
    <Navigator sceneAnimationEnabled={true} initialRouteName="Home" safeAreaInsets={{ bottom }}>
      <Screen name="Home" component={Home} options={{ tabBarIcon: 'home' }} />
      <Screen name="Details" component={Details} options={{ tabBarIcon: 'account' }} />
    </Navigator>
  );
};

export default BottomTab;
