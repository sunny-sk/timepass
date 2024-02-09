import { StyleSheet, View, StatusBar } from 'react-native';
import React from 'react';
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
import { IconButton, useTheme } from 'react-native-paper';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type Props = {};

const CurrentLocation = (_props: Props) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
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

      <View style={{ flex: 1, marginTop: STATUS_BAR_HEIGHT }}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: 28.4532461,
            longitude: 76.9988664,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          focusable
          provider={PROVIDER_GOOGLE}
          zoomEnabled
          zoomControlEnabled
          followsUserLocation
          showsCompass
          showsUserLocation
          loadingEnabled>
          <Marker
            coordinate={{
              latitude: 28.4532461,
              longitude: 76.9988664,
            }}
          />
        </MapView>
      </View>
      <View style={styles.headerCon}>
        <IconButton
          mode="contained"
          onPress={navigation.goBack}
          icon="keyboard-backspace"
          size={24}
        />
      </View>
    </View>
  );
};

export default CurrentLocation;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  headerCon: {
    position: 'absolute',
    marginTop: STATUS_BAR_HEIGHT,
    marginLeft: 10,
    zIndex: 999,
    // width: '100%',
    // // paddingVertical: 10,
    // justifyContent: 'center',
    // marginTop: STATUS_BAR_HEIGHT,
    // backgroundColor: colors.white,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
});
