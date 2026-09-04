import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Text, ToggleButton, useTheme } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import Container from '~/components/container';
import CustomHeader from '~/components/custom-header';
import PrimaryText from '~/components/primary-text';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import { DrawerScreenProp } from '~/navigators/drawer';
import { useRootStore } from '~/stores/store-setup';

const edges: Edge[] = ['right', 'bottom', 'left'];

const Welcome: React.FC<DrawerScreenProp<'Welcome'>> = observer(({ navigation }) => {
  const { version, latestVersion, outdated, setUserColorScheme, currentColorScheme } =
    useRootStore();

  const theme = useTheme();
  const [isDark, isSystem] = useIsDarkTheme();

  const topValue = useRef(new Animated.Value(0));
  const spin = useRef(new Animated.Value(0));

  const animate = useCallback(() => {
    Animated.stagger(700, [
      Animated.timing(topValue.current, {
        toValue: 70,
        duration: 750,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spin.current, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const rotate = spin.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Container
      edges={edges}
      header={
        <CustomHeader
          onLeftMenuPress={navigation.toggleDrawer}
          title="Welcome"
          subtitle="src/screens/welcome.tsx"
        />
      }
    >
      <Animated.View style={styles.logo}>
        <Animated.Image
          style={[styles.reactLogo, { transform: [{ rotate }] }]}
          source={require('~/assets/react_logo.png')}
        />
        <Animated.Image
          onLoad={animate}
          style={[
            styles.templateLogo,
            {
              transform: [
                {
                  translateY: topValue.current,
                },
              ],
            },
          ]}
          source={require('~/assets/template_logo.png')}
        />
      </Animated.View>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.headline}>
          Thank You For Using React Native TS-Plus Template
        </Text>
        <Text variant="bodySmall" style={[styles.disclaimer, { color: theme.colors.outline }]}>
          This is not an official template!
        </Text>
        <Text variant="bodyMedium" style={styles.pitch}>
          This is a pre-configured template. Most of the tedious stuff of starting a new project has
          been done for you. We hope it will allow you to be more productive and waste less time on
          doing the essential things that most apps need.
        </Text>
        <Text variant="bodyMedium">
          See <PrimaryText>README.md</PrimaryText> to find out what's included and how to get the
          most out of this template.
        </Text>
        <View style={styles.version}>
          <Text variant="bodyMedium">Template Version: {version}</Text>
          {outdated && (
            <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
              New Version Available: {latestVersion}
            </Text>
          )}
        </View>
        <View style={styles.theme}>
          <Text variant="bodyMedium">Currently using: {isDark ? 'Dark' : 'Default'} Theme</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Theme is set by {isSystem ? 'System' : 'User'}
          </Text>
        </View>
        <ToggleButton.Row
          style={styles.toggle}
          onValueChange={(value) => setUserColorScheme(value as any)}
          value={currentColorScheme}
        >
          <ToggleButton icon="cog" value="auto" />
          <ToggleButton icon="weather-sunny" value="light" />
          <ToggleButton icon="weather-night" value="dark" />
        </ToggleButton.Row>
      </View>
    </Container>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingBottom: 24,
  },
  logo: {
    marginTop: 15,
    alignSelf: 'center',
    height: 260,
    width: 200,
    position: 'relative',
  },
  reactLogo: {
    height: 200,
    width: 200,
  },
  templateLogo: {
    height: 200,
    width: 200,
    position: 'absolute',
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pitch: {
    marginBottom: 10,
  },
  version: {
    marginVertical: 10,
    alignItems: 'center',
  },
  theme: {
    marginBottom: 16,
    alignItems: 'center',
  },
  toggle: {
    marginBottom: 10,
    justifyContent: 'center',
  },
  disclaimer: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Welcome;
