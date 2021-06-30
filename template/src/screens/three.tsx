import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, HelperText } from 'react-native-paper';
import { TopTabScreenProps } from '~/navigators/top-tab';

const Three = observer<TopTabScreenProps<'Three'>>(({ navigation }) => {
  return (
    <View style={styles.center}>
      <Headline>Top Tab Screen Three</Headline>
      <HelperText type="info" style={styles.path}>
        src/screens/three.tsx
      </HelperText>
      <Button onPress={() => navigation.jumpTo('One')}>Go to Screen One</Button>
      <Button onPress={() => navigation.jumpTo('Two')}>Go to Screen Two</Button>
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  path: {
    fontSize: 11,
  },
});

export default Three;
