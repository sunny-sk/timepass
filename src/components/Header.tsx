/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { Menu, Divider, Avatar, IconButton, Text } from 'react-native-paper';
import colors from '../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks';
import { deleteAllMessagesFB } from '../utils/api';

type Props = {
  lastSeen: string[];
};

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

const Header = ({ lastSeen }: Props) => {
  const route = useRoute();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { authData } = useAuth();

  return (
    <View style={styles.headerCon}>
      <View style={styles.headerInnerCon}>
        <View style={styles.headerInnerLeft}>
          <Avatar.Text size={35} label={lastSeen[0]?.[0]?.toUpperCase()} />
          {/* <Text style={styles.usernameText}>sunny</Text> */}
          <View style={styles.lastSeenCon}>
            <Text textBreakStrategy="simple" variant="bodySmall">
              Last seen : {new Date(lastSeen[1]).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.headerInnerRight}>
          {authData.role === 'admin' && (
            <Menu
              contentStyle={{
                marginTop: STATUS_BAR_HEIGHT,
                backgroundColor: '#fff',
              }}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton onPress={openMenu} icon="dots-vertical" size={24} />
              }>
              <Menu.Item
                onPress={() => {
                  deleteAllMessagesFB(route.params?.channelName).finally(
                    closeMenu,
                  );
                }}
                leadingIcon="delete-alert-outline"
                title="Delete all"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  navigation.navigate('current-location');
                }}
                leadingIcon="location-enter"
                title="Location"
              />
            </Menu>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerCon: {
    width: '100%',
    // paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: STATUS_BAR_HEIGHT,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  usernameText: {
    fontWeight: '700',
    fontSize: 17,
    marginLeft: 10,
  },
  lastSeenCon: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  lastSeen: {
    fontWeight: '300',
    fontSize: 11,
    color: '#4f4848',
    marginLeft: 10,
  },
  headerInnerCon: {
    flexDirection: 'row',
  },
  headerInnerLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerInnerRight: {
    alignItems: 'flex-end',
    height: 52,
    position: 'relative',
  },
});
