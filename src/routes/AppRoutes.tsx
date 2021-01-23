import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Investments from '../pages/Investments/Investments';
import Redemption from '../pages/Redemption/Redemption';

export type RootStackParamList = {
  Investments: undefined;
  Redemption: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Investments"
      screenOptions={{ title: 'Resgate', headerBackTitleVisible: false }}>
      <Stack.Screen name="Investments" component={Investments} />
      <Stack.Screen name="Redemption" component={Redemption} />
    </Stack.Navigator>
  );
}

export default AppRoutes;
