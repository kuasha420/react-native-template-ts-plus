import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import { TopTabScreenProp } from '~/navigators/top-tab';

const Two: React.FC<TopTabScreenProp<'Two'>> = observer(({ navigation }) => {
  return (
    <View style={styles.center}>
      <Text variant="headlineSmall" style={styles.headline}>
        Top Tab Screen Two
      </Text>
      <HelperText type="info" style={styles.path}>
        src/screens/two.tsx
      </HelperText>
      <Button mode="contained-tonal" onPress={() => navigation.jumpTo('One')}>
        Go to Screen One
      </Button>
      <Button mode="contained-tonal" onPress={() => navigation.jumpTo('Three')}>
        Go to Screen Three
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headline: {
    fontWeight: 'bold',
  },
  path: {
    fontSize: 12,
  },
});

export default Two;
