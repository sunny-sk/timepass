import React, { useEffect } from 'react';
import Navigation from './src/navigation/nav';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import AuthProvider from './src/context/auth-context';
import { updatePushNotiToken } from './src/utils/api';
import notifee from '@notifee/react-native';
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
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // Display a notification
  }
  useEffect(() => {
    onDisplayNotification();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('noti when app open', remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      await notifee.displayNotification({
        title:
          '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
        subtitle: '&#129395;',
        body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
        android: {
          channelId,
          color: '#4caf50',
          actions: [
            {
              title: '<b>Dance</b> &#128111;',
              pressAction: { id: 'dance' },
            },
            {
              title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
              pressAction: { id: 'cry' },
            },
          ],
        },
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      updatePushNotiToken(token);
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;
