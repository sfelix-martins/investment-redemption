import React from 'react';
import { Button, Text, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../routes/AppRoutes';

type InvestmentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Investments'
>;

type Props = {
  navigation: InvestmentsScreenNavigationProp;
};

function Investments({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Investments</Text>
      <Button
        title="Navigate to redemption"
        onPress={() => navigation.navigate('Redemption')}
      />
    </View>
  );
}

export default Investments;
