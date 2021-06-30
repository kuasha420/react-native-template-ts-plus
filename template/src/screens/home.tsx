import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import { BottomTabScreenProps } from '~/navigators/bottom-tab';

const edges: Edge[] = ['right', 'left'];

const Home = observer<BottomTabScreenProps<'Home'>>(({ navigation }) => {
  return (
    <FixedContainer edges={edges}>
      <CustomHeader
        onLeftMenuPress={navigation.toggleDrawer}
        title="Bottom Tab - Home"
        subtitle="src/screens/home.tsx"
      />
      <View style={styles.center}>
        <Headline>Bottom Tab Home Screen</Headline>
        <Button onPress={() => navigation.navigate('Details')}>Go to Details Page</Button>
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
