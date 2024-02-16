import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const capitalise = (str: string) => {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.substring(1, str.length);
};

export const requestLocationPermission = async success => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      Geolocation.getCurrentPosition(
        success,
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          interval: 1000,
        },
      );
    } else {
      console.log('You cannot use Geolocation');
    }
  } catch (err) {
    return false;
  }
};
