import { DefaultTheme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      white: string;
    }
  }
}

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#fae128',
    accent: '#015ba5',
    white: '#fff',
    disabled: '#fcfcfc',
  },
};
