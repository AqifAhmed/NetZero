import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ExpensesProvider } from './src/context/ExpensesContext';
import { COLORS } from './src/constants/theme';
import MainTab from './src/navigation/MainTab';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    border: COLORS.border,
    text: COLORS.text,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
        <NavigationContainer theme={MyTheme}>
          <MainTab />
        </NavigationContainer>
      </ExpensesProvider>
    </SafeAreaProvider>
  );
}

