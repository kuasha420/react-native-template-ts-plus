import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import CustomDrawer from '~/components/custom-drawer';
import BottomTab, { BottomTabScreensParams } from '~/navigators/bottom-tab';
import { RootStackScreensParams } from '~/navigators/root-stack';
import TopTabNavigator, { TopTabScreensParams } from '~/navigators/top-tab';
import Welcome from '~/screens/welcome';

export type DrawerScreensParams = {
  Welcome: undefined;
  BottomTab: undefined | NavigatorScreenParams<BottomTabScreensParams>;
  TopTab: undefined | NavigatorScreenParams<TopTabScreensParams>;
};

export type DrawerScreens = keyof DrawerScreensParams;

export type DrawerScreenProp<T extends DrawerScreens> = CompositeScreenProps<
  DrawerScreenProps<DrawerScreensParams, T>,
  NativeStackScreenProps<RootStackScreensParams>
>;

const { Navigator, Screen } = createDrawerNavigator<DrawerScreensParams>();

const Drawer = () => (
  <Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      lazy: true,
      drawerStyle: styles.drawer,
    }}
  >
    <Screen name="Welcome" component={Welcome} options={{ drawerIcon: () => 'home' }} />
    <Screen
      name="TopTab"
      component={TopTabNavigator}
      options={{ drawerIcon: () => 'numeric', title: 'Top Tab' }}
    />
    <Screen
      name="BottomTab"
      component={BottomTab}
      options={{ drawerIcon: () => 'dots-horizontal', title: 'Bottom Tab' }}
    />
  </Navigator>
);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
});

export default Drawer;
