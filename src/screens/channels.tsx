import { StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../constants/colors';
import { Avatar, Card } from 'react-native-paper';

type Props = {};
type ChannelName = {
  id?: string;
  name: string;
};
import { useTheme } from 'react-native-paper';
import { getAllChannelsFB } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

const LeftContent = props => <Avatar.Icon size={35} {...props} icon="folder" />;

const ChannelsScreen = (_props: Props) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [channelNames, setChannelNames] = useState<ChannelName[]>([]);

  useEffect(() => {
    getAllChannelsFB().then(channels => {
      setChannelNames(channels);
    });
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
        <View style={styles.listCon}>
          {channelNames.map(channel => {
            return (
              <Card
                onPress={() => {
                  navigation.navigate('chat', { channelName: channel.name });
                }}
                key={channel.name}
                style={styles.card}>
                <Card.Title title={channel.name} left={LeftContent} />
              </Card>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default ChannelsScreen;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
  listCon: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 55,
  },
  card: {
    backgroundColor: '#fff',
  },
});
