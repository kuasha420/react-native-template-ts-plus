import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { overlay, useTheme } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import { DrawerScreenProps, DrawerScreensParams } from '~/navigators/drawer';
import { RootStackScreensParams } from '~/navigators/root-stack';
import One from '~/screens/one';
import Three from '~/screens/three';
import Two from '~/screens/two';

export type TopTabScreensParams = {
  One: undefined;
  Two: undefined;
  Three: undefined;
};

export type TopTabScreens = keyof TopTabScreensParams;

export interface TopTabScreenProps<T extends TopTabScreens> {
  navigation: CompositeNavigationProp<
    MaterialTopTabNavigationProp<TopTabScreensParams, T>,
    CompositeNavigationProp<
      DrawerNavigationProp<DrawerScreensParams>,
      NativeStackNavigationProp<RootStackScreensParams>
    >
  >;
  route: RouteProp<TopTabScreensParams, T>;
}

const { Navigator, Screen } = createMaterialTopTabNavigator<TopTabScreensParams>();

const TopTabs = () => {
  const theme = useTheme();

  const tabBarOptions = useMemo(() => {
    if (theme.dark) {
      return {
        style: {
          backgroundColor: overlay(4, theme.colors.surface),
        },

        inactiveTintColor: theme.colors.disabled,
        activeTintColor: theme.colors.text,
        indicatorStyle: {
          backgroundColor: theme.colors.notification,
        },
      };
    }
    return {
      style: {
        backgroundColor: theme.colors.primary,
      },

      inactiveTintColor: theme.colors.surface,
      activeTintColor: theme.colors.background,
      indicatorStyle: {
        backgroundColor: theme.colors.notification,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.dark]);
  return (
    <Navigator tabBarOptions={tabBarOptions}>
      <Screen name="One" component={One} />
      <Screen name="Two" component={Two} />
      <Screen name="Three" component={Three} />
    </Navigator>
  );
};

const edges: Edge[] = ['right', 'bottom', 'left'];

const TopTabNavigator: React.FC<DrawerScreenProps<'TopTab'>> = ({ navigation }) => {
  return (
    <FixedContainer edges={edges}>
      <CustomHeader
        onLeftMenuPress={navigation.toggleDrawer}
        title="Top Tab Navigator"
        subtitle="src/screens/top-tab.tsx"
      />
      <TopTabs />
    </FixedContainer>
  );
};

export default TopTabNavigator;
