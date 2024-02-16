import { StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../constants/colors';
import Header from '../components/header';

type Props = {};
import { useTheme } from 'react-native-paper';
import SendMessage from '../components/chat/send-msg';
import MessagesList from '../components/chat/messages';
import { getLastSeenFB, updateLastSeenFB, updateLocation } from '../utils/api';
import { requestLocationPermission } from '../utils/helper';
import Geolocation from '@react-native-community/geolocation';
import { useRoute } from '@react-navigation/native';
const Chat = (_props: Props) => {
  const theme = useTheme();
  const [lastSeen, setLastSeen] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const route = useRoute();
  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
  };

  useEffect(() => {
    requestLocationPermission((res: any) => {
      updateLocation(res);
    });
  }, []);

  useEffect(() => {
    const watchID = Geolocation.watchPosition(
      position => {
        updateLocation(position);
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        interval: 1000,
      },
    );
    setSubscriptionId(watchID);
    return () => {
      clearWatch();
    };
  }, []);

  useEffect(() => {
    updateLastSeenFB();
  }, []);

  useEffect(() => {
    getLastSeenFB(route.params?.channelName).then(data => {
      if (data) {
        setLastSeen(data);
      }
    });

    return () => { };
  }, []);

  return (
    <>
      <View
        style={[
          styles.screen,
          { backgroundColor: theme.colors.inverseOnSurface },
        ]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.white}
          translucent={true}
        />
        <Header lastSeen={lastSeen} />
        <MessagesList />
        <SendMessage />
      </View>
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
});
