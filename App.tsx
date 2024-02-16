import React from 'react';
import Navigation from './src/navigation/nav';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import AuthProvider from './src/context/auth-context';
const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: '#4062BB',
  },
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;
