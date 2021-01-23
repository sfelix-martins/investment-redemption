import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';

import { theme } from './config/theme';
import AppRoutes from './routes/AppRoutes';

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <AppRoutes />
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
