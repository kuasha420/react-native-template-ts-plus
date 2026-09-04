import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import { BottomTabScreenProp } from '~/navigators/bottom-tab';

const edges: Edge[] = ['right', 'left'];

const Details: React.FC<BottomTabScreenProp<'Details'>> = observer(({ navigation }) => {
  return (
    <FixedContainer edges={edges}>
      <CustomHeader
        onLeftMenuPress={navigation.toggleDrawer}
        title="Bottom Tab - Details"
        subtitle="src/screens/details.tsx"
      />
      <View style={styles.center}>
        <Text variant="headlineSmall" style={styles.headline}>
          Bottom Tab Details Screen
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')}>
          Go to Home Page
        </Button>
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  headline: {
    fontWeight: 'bold',
  },
});

export default Details;
