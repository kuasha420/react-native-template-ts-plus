import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import FixedContainer from '~/components/fixed-container';
import PrimaryText from '~/components/primary-text';
import { RootStackScreenProp } from '~/navigators/root-stack';
import { useRootStore } from '~/stores/store-setup';
import delay from '~/utils/delay';

const Loader: React.FC<RootStackScreenProp<'Loader'>> = observer(
  ({ navigation, route }) => {
    const { hydrate, hydrated, version } = useRootStore();
    const theme = useTheme();

    useEffect(() => {
      if (hydrated) {
        delay(route.params?.delay ?? 500).then(() =>
          navigation.replace('Drawer')
        );
      }
    }, [hydrated, navigation, route.params?.delay]);

    useEffect(() => {
      if (!hydrated) {
        hydrate();
      }
    }, [hydrate, hydrated]);

    return (
      <FixedContainer style={styles.center} edges={[]}>
        <Image
          style={styles.logo}
          source={require('~/assets/bootsplash_logo.png')}
        />
        <View style={styles.report}>
          <ActivityIndicator style={styles.progress} />
          <PrimaryText>{route.params?.text ?? 'Initializing'}</PrimaryText>
          <Text style={[styles.copy, { color: theme.colors.outline }]}>
            Template Version: {version}
          </Text>
        </View>
      </FixedContainer>
    );
  }
);

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  logo: {
    width: 200,
    height: 200,
  },
  report: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  progress: {
    marginVertical: 15,
  },
  copy: {
    marginTop: 75,
  },
});

export default Loader;
