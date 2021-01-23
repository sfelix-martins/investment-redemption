import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import { theme } from './config/theme';
import AppRoutes from './routes/AppRoutes';

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
