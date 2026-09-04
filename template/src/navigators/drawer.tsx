import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const WelcomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" color={color} size={size} />
);

const TopTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="numeric" color={color} size={size} />
);

const BottomTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="dots-horizontal" color={color} size={size} />
);

const renderDrawerContent = (props: DrawerContentComponentProps) => (
  <CustomDrawer {...props} />
);

const Drawer = () => (
  <Navigator
    drawerContent={renderDrawerContent}
    screenOptions={{
      headerShown: false,
      drawerStyle: styles.drawer,
    }}
  >
    <Screen
      name="Welcome"
      component={Welcome}
      options={{
        drawerIcon: WelcomeIcon,
      }}
    />
    <Screen
      name="TopTab"
      component={TopTabNavigator}
      options={{
        drawerIcon: TopTabIcon,
        title: 'Top Tab',
      }}
    />
    <Screen
      name="BottomTab"
      component={BottomTab}
      options={{
        drawerIcon: BottomTabIcon,
        title: 'Bottom Tab',
      }}
    />
  </Navigator>
);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
});

export default Drawer;
