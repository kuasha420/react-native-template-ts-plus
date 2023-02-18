import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Drawer, Text, ToggleButton, useTheme } from 'react-native-paper';
import FixedContainer from '~/components/fixed-container';
import { IMAGESIZE, WIDTH } from '~/constant';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import { useRootStore } from '~/stores/store-setup';

const iconProps = {
  color: '',
  size: 0,
  focused: false,
};

const CustomDrawer = observer<DrawerContentComponentProps>((props) => {
  const { setUserColorScheme, currentColorScheme } = useRootStore();
  const [isDark, isSystem] = useIsDarkTheme();
  const { colors } = useTheme();
  return (
    <FixedContainer style={styles.drawer} edges={['top', 'bottom', 'left']}>
      <Drawer.Section style={styles.container}>
        <Avatar.Image
          style={styles.avatar}
          size={IMAGESIZE / 9}
          source={require('~/assets/bootsplash_logo.png')}
        />
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.title2}>src/components/custom-drawer.tsx</Text>
        </View>
      </Drawer.Section>
      <Drawer.Section style={[styles.drawerItemTopColor, { borderColor: colors.background }]}>
        {props.state.routes.map((route, i) => (
          <Drawer.Item
            key={route.key}
            active={props.state.index === i}
            label={props.descriptors[route.key].options.title || route.name}
            // @ts-ignore - This is a bug in React Native Paper when React 18 types are used.
            icon={props.descriptors[route.key].options.drawerIcon?.(iconProps) ?? undefined}
            onPress={() => props.navigation.navigate(route.name)}
          />
        ))}
      </Drawer.Section>
      <Drawer.Section
        style={[
          styles.footer,
          {
            borderColor: colors.background,
          },
        ]}
      >
        <ToggleButton.Row
          style={styles.toggle}
          onValueChange={(value) => setUserColorScheme(value as any)}
          value={currentColorScheme}
        >
          <ToggleButton style={styles.togglebtn} icon="cog" value="auto" />
          <ToggleButton style={styles.togglebtn} icon="weather-sunny" value="light" />
          <ToggleButton style={styles.togglebtn} icon="weather-night" value="dark" />
          <Text style={styles.theme}>
            {isDark ? 'Dark' : 'Light'} ({isSystem ? 'System' : 'User'})
          </Text>
        </ToggleButton.Row>
      </Drawer.Section>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  container: {
    paddingVertical: WIDTH / 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 11,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
  },
  toggle: {
    alignItems: 'center',
    marginLeft: 9,
  },
  togglebtn: {
    borderWidth: 0,
  },
  theme: {
    marginLeft: 9,
  },
  drawerItemTopColor: {
    borderTopWidth: 1,
  },
});

export default CustomDrawer;
