import {
  BottomTabBarProps,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { CommonActions, CompositeScreenProps } from '@react-navigation/native';
import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerScreenProp } from '~/navigators/drawer';
import Details from '~/screens/details';
import Home from '~/screens/home';

export type BottomTabScreensParams = {
  Home: undefined;
  Details: undefined;
};

export type BottomTabScreens = keyof BottomTabScreensParams;

export type BottomTabScreenProp<T extends BottomTabScreens> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabScreensParams, T>,
  DrawerScreenProp<'BottomTab'>
>;

const Tab = createBottomTabNavigator<BottomTabScreensParams>();

const HomeTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const DetailsTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="account" size={size} color={color} />
);

const BottomTabBar = ({ navigation, state, descriptors, insets }: BottomTabBarProps) => (
  <BottomNavigation.Bar
    navigationState={state}
    safeAreaInsets={insets}
    onTabPress={({ route, preventDefault }) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        preventDefault();
      } else {
        navigation.dispatch({
          ...CommonActions.navigate(route.name, route.params),
          target: state.key,
        });
      }
    }}
    renderIcon={({ route, color }) => {
      const { options } = descriptors[route.key];
      if (options.tabBarIcon) {
        return options.tabBarIcon({ focused: false, color, size: 24 });
      }
      return null;
    }}
    getLabelText={({ route }) => {
      const { options } = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      return typeof label === 'string' ? label : route.name;
    }}
  />
);

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={BottomTabBar}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Details"
        component={Details}
        options={{
          tabBarLabel: 'Details',
          tabBarIcon: DetailsTabBarIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
