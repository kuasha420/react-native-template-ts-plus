import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { ProgressBar, Text } from 'react-native-paper';
import FixedContainer from '~/components/fixed-container';
import PrimaryText from '~/components/primary-text';
import { RootStackScreenProps } from '~/navigators/root-stack';
import { useRootStore } from '~/stores/store-setup';

const Loader: React.FC<RootStackScreenProps<'Loader'>> = ({ navigation, route }) => {
  const [progress, setProgress] = useState(0);

  const { hydrate, hydrated, version } = useRootStore();

  useEffect(() => {
    if (hydrated) {
      if (progress >= 1) {
        return navigation.replace('Welcome');
      } else {
        return navigation.setParams({ speed: 300 });
      }
    }
    const id = setTimeout(() => setProgress(progress + 0.04), route.params?.speed ?? 100);
    return () => clearTimeout(id);
  }, [hydrated, navigation, progress, route.params]);

  useEffect(() => {
    (async () => {
      try {
        if ((await RNBootSplash.getVisibilityStatus()) === 'visible') {
          await RNBootSplash.hide({ fade: false });
          hydrate();
        }
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FixedContainer style={styles.center} edges={[]}>
      <Image style={styles.logo} source={require('@/assets/images/bootsplash_logo.png')} />
      <View style={styles.report}>
        <ProgressBar style={styles.progress} progress={progress} color="#ffffff" />
        <PrimaryText>{(progress * 100).toFixed(0)} %</PrimaryText>
        <PrimaryText>{route.params?.text ?? 'Initializing'}</PrimaryText>
        <Text style={styles.copy}>Template Version: {version}</Text>
      </View>
    </FixedContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
  },
  report: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  progress: {
    width: 250,
    height: 10,
    marginVertical: 15,
  },
  copy: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 75,
  },
});

export default Loader;
