import { StyleSheet, View, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
import { IconButton, useTheme } from 'react-native-paper';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getAllUsersFB } from '../utils/api';
import { capitalise, requestLocationPermission } from '../utils/helper';

type Props = {};
type Location = {
  userName?: string;
  coords: {
    accuracy?: number;
    longitude: number | string;
    latitude: number | string;
  };
};

const CurrentLocation = (_props: Props) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [position, setPosition] = useState<Location | null>({
    coords: { longitude: 0, latitude: 0, accuracy: 20 },
  });
  const [allUserPositions, setAllUserPositions] = useState<Location[]>([]);

  useEffect(() => {
    requestLocationPermission((res: Location) => {
      setPosition(res);
    });
  }, []);

  useEffect(() => {
    getAllUsersFB().then(docSnapshot => {
      const allPos: Location[] = [];
      docSnapshot.docs.forEach(doc => {
        if (doc.data().location?.latitude && doc.data().location?.longitude) {
          allPos.push({
            userName: capitalise(doc.data().name),
            coords: {
              ...doc.data().location,
            },
          });
        }
      });
      setAllUserPositions(allPos);
    });
  }, []);

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

      <View style={styles.inner}>
        {position ? (
          <MapView
            style={styles.mapView}
            minZoomLevel={0.1}
            region={{
              latitude: +position?.coords?.latitude,
              longitude: +position?.coords?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            // maxZoomLevel={20}
            focusable
            provider={PROVIDER_GOOGLE}
            userLocationPriority="high"
            zoomEnabled
            zoomControlEnabled
            followsUserLocation
            showsTraffic
            showsBuildings
            showsCompass
            showsUserLocation
            loadingEnabled>
            {allUserPositions.map((pos: Location) => {
              return (
                <Marker
                  title={pos.userName}
                  description={pos.userName}
                  key={`${pos.coords.latitude}-${pos.coords.longitude}`}
                  coordinate={{
                    latitude: +pos.coords.latitude,
                    longitude: +pos.coords.longitude,
                  }}>
                  {/* <Text variant="displayLarge">{pos.userName}</Text> */}
                </Marker>
              );
            })}
          </MapView>
        ) : null}
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
  inner: {
    flex: 1,
    marginTop: STATUS_BAR_HEIGHT,
  },
  headerCon: {
    position: 'absolute',
    marginTop: STATUS_BAR_HEIGHT,
    marginLeft: 10,
    zIndex: 999,
  },
  mapView: {
    flex: 1,
  },
});
