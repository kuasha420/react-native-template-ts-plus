import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, HelperText } from 'react-native-paper';
import { TopTabScreenProps } from '~/navigators/top-tab';

const One = observer<TopTabScreenProps<'One'>>(({ navigation }) => {
  return (
    <View style={styles.center}>
      <Headline>Top Tab Screen One</Headline>
      <HelperText type="info" style={styles.path}>
        src/screens/one.tsx
      </HelperText>
      <Button onPress={() => navigation.jumpTo('Two')}>Go to Screen Two</Button>
      <Button onPress={() => navigation.jumpTo('Three')}>Go to Screen Three</Button>
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

export default One;
