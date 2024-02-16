import { StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import colors from '../constants/colors';
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

import LinearGradient from 'react-native-linear-gradient';
import { Text, Button } from 'react-native-paper';
const WIDTH = Dimensions.get('screen').width;
import LeftArrowSvg from '../assets/left-arrow.svg';
import RightArrowSvg from '../assets/right-arrow.svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../hooks';
import { logout, registerUser } from '../utils/api';

type Props = {};
const Home = (_props: Props) => {
  const { authData } = useAuth();
  const navigation = useNavigation();
  function onGoogleButtonPress() {
    registerUser();
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '854723128103-rb2mn396q3drup9ed68fq18pg24lbg4n.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: '#363738' }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={true}
      />

      <View style={styles.header}>
        <View style={styles.badge}>
          <Text variant="labelSmall">12,18,30</Text>
        </View>
        <View style={styles.badge}>
          <Text variant="labelSmall">9</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#000',
            paddingHorizontal: 16,
            paddingVertical: 10,
            width: '100%',
            height: 200,
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          {/* left arrow */}
          <View
            style={{
              position: 'absolute',
              height: 20,
              width: 20,
              left: -10,
              top: '50%',
            }}>
            <RightArrowSvg height={20} width={20} />
          </View>
          {/* right arrow */}
          <View
            style={{
              position: 'absolute',
              height: 20,
              width: 20,
              right: -10,
              top: '50%',
            }}>
            <LeftArrowSvg height={20} width={20} />
          </View>

          {/* top layer */}
          <View
            style={{
              position: 'absolute',
              height: 100,
              left: 0,
              top: 0,
              zIndex: 999,
              width: WIDTH - 40,
            }}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 8)', 'rgba(255, 255, 255, 0)']}
              style={{ height: '100%', width: '100%' }}>
              <View style={{ height: 100, width: '100%' }} />
            </LinearGradient>
          </View>
          {/* bottom layer */}
          <View
            style={{
              position: 'absolute',
              height: 100,
              left: 0,
              bottom: 0,
              zIndex: 999,
              width: WIDTH - 40,
            }}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 8)']}
              style={{ height: '100%', width: '100%' }}>
              <View style={{ height: 100, width: '100%' }} />
            </LinearGradient>
          </View>

          {/* three bars */}
          <View
            style={{
              width: '32.5%',
              height: '100%',
              backgroundColor: '#7c7c7c',
            }}
          />
          <View
            style={{
              width: '32.5%',
              height: '100%',
              backgroundColor: '#7c7c7c',
            }}
          />
          <View
            style={{
              width: '32.5%',
              height: '100%',
              backgroundColor: '#7c7c7c',
            }}
          />
        </View>
        <Text
          style={{ marginVertical: 20, color: '#fff' }}
          variant="bodyMedium">
          spin for 1,00 . 3/5 spins left
        </Text>
        <Button
          mode="elevated"
          contentStyle={{ padding: 5 }}
          style={{ width: 200 }}
        >
          Spin
        </Button>
        {!authData && (
          <Button
            mode="elevated"
            contentStyle={{ padding: 5 }}
            style={{ width: 200, marginTop: 15 }}
            onPress={onGoogleButtonPress}>
            Login
          </Button>
        )}
        {authData && (
          <>
            {(authData?.friends?.length > 0 || authData.role === 'admin') && (
              <Button
                mode="elevated"
                contentStyle={{ padding: 5 }}
                style={{ width: 200, marginTop: 15 }}
                onPress={() => {
                  if (authData.role === 'admin') {
                    navigation.navigate('channels');
                  } else {
                    navigation.navigate('chat');
                  }
                }}>
                Chat
              </Button>
            )}
            <Button
              mode="elevated"
              contentStyle={{ padding: 5 }}
              style={{ width: 200, marginTop: 15 }}
              onPress={logout}>
              Logout
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  badge: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffff',
    marginLeft: 10,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
