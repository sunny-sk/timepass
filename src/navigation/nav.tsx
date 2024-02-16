import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home';
import ChatScreen from '../screens/chat';
import ChannelsScreen from '../screens/channels';
import ProfileScreen from '../screens/profile';
import CurrentLocationScreen from '../screens/current-location';

const Stack = createNativeStackNavigator();

function Navigation() {
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
