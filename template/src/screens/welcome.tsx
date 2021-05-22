import React from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import Container from '~/components/container';
import PrimaryText from '~/components/primary-text';
import { RootStackScreenProps } from '~/navigators/root-stack';

const Welcome = observer<RootStackScreenProps<'Welcome'>>(() => {
  return (
    <Container contentContainerStyle={styles.center}>
      <PrimaryText>Welcome to HelloWorld</PrimaryText>
    </Container>
  );
});

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Welcome;
