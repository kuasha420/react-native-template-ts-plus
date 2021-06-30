import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, HelperText } from 'react-native-paper';
import { TopTabScreenProps } from '~/navigators/top-tab';

const Two = observer<TopTabScreenProps<'Two'>>(({ navigation }) => {
  return (
    <View style={styles.center}>
      <Headline>Top Tab Screen Two</Headline>
      <HelperText type="info" style={styles.path}>
        src/screens/two.tsx
      </HelperText>
      <Button onPress={() => navigation.jumpTo('One')}>Go to Screen One</Button>
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

export default Two;
