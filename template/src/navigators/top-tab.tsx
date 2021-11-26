import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { overlay, useTheme } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import { DrawerScreenProp } from '~/navigators/drawer';
import One from '~/screens/one';
import Three from '~/screens/three';
import Two from '~/screens/two';

export type TopTabScreensParams = {
  One: undefined;
  Two: undefined;
  Three: undefined;
};

export type TopTabScreens = keyof TopTabScreensParams;

export type TopTabScreenProp<T extends TopTabScreens> = CompositeScreenProps<
  MaterialTopTabScreenProps<TopTabScreensParams, T>,
  DrawerScreenProp<'TopTab'>
>;

const { Navigator, Screen } = createMaterialTopTabNavigator<TopTabScreensParams>();

const TopTabs = () => {
  const theme = useTheme();

  const tabBarOptions = useMemo(() => {
    const options: MaterialTopTabNavigationOptions = theme.dark
      ? {
          tabBarStyle: {
            backgroundColor: overlay(4, theme.colors.surface),
          },
          tabBarInactiveTintColor: theme.colors.disabled,
          tabBarActiveTintColor: theme.colors.text,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
        }
      : {
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
          },

          tabBarInactiveTintColor: theme.colors.surface,
          tabBarActiveTintColor: theme.colors.background,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.notification,
          },
        };
    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.dark]);
  return (
    <Navigator screenOptions={tabBarOptions}>
      <Screen name="One" component={One} />
      <Screen name="Two" component={Two} />
      <Screen name="Three" component={Three} />
    </Navigator>
  );
};

const edges: Edge[] = ['right', 'bottom', 'left'];

const TopTabNavigator: React.FC<DrawerScreenProp<'TopTab'>> = ({ navigation }) => {
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
