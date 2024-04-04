import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home';
import ChatScreen from '../screens/chat';
import ChannelsScreen from '../screens/channels';
import ProfileScreen from '../screens/profile';
import CurrentLocationScreen from '../screens/current-location';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
const Stack = createNativeStackNavigator();

function Navigation() {
  const NAVIGATION_IDS = ['home', 'chat', 'channels'];
  function buildDeepLinkFromNotificationData(data): any | string | null {
    const navigationId = data?.navigationId;
    console.log(navigationId);
    if (!NAVIGATION_IDS.includes(navigationId)) {
      console.warn('Unverified navigationId', navigationId);
      return null;
    }
    if (navigationId === 'home') {
      return 'myapp://home';
    }

    console.warn('Missing postId');
    return null;
  }
  const linking = {
    prefixes: ['myapp://'],
    config: {
      initialRouteName: 'Home',
      screens: {
        Home: 'home',
        Chat: 'chat',
        Channels: 'channels',
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        return url;
      }
      //getInitialNotification: When the application is opened from a quit state.
      const message = await messaging().getInitialNotification();
      const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
      if (typeof deeplinkURL === 'string') {
        return deeplinkURL;
      }
    },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url);

      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

      //onNotificationOpenedApp: When the application is running, but in the background.
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);
        if (typeof url === 'string') {
          listener(url);
        }
      });

      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'home'}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="channels" component={ChannelsScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen
          name="current-location"
          component={CurrentLocationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
