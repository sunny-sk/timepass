/* eslint-disable react-native/no-inline-styles */
import { FlatList, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import colors from '../constants/colors';
import Msg from '../components/Msg';
import Header from '../components/Header';
type Props = {};
import {
  Button,
  Icon,
  MD2Colors,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
const Home = (_props: Props) => {
  const chatList = useRef(null);
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    { message: 'Hi', left: false },
    { message: 'Hello', left: true },
    { message: 'Kya kr rhi hai', left: true },
    { message: 'kuch ni', left: false },
    { message: 'sb thik?', left: false },
    { message: 'ha', left: true },
  ]);
  const [noOfLinesInMessage, setNoOfLinesInMessage] = useState(1);
  const keyExtractor = useCallback(e => {
    return e.toString() + Math.random();
  }, []);
  const renderItem = useCallback(({ item }) => {
    return <Msg left={item.left} msg={item.message} />;
  }, []);
  const setMessageText = (text: string) => {
    let count = text.split(/\r\n|\r|\n/).length;
    setNoOfLinesInMessage(count);
    setMessage(text);
  };
  const onSendMessage = async () => {
    if (!message) {
      return;
    }
    try {
      setMessage('');
      setIsLoading(true);
      setIsLoading(false);
      setNoOfLinesInMessage(1);
    } catch (error) { }
  };
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
      <Header />
      <FlatList
        ref={chatList}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={keyExtractor}
        ListFooterComponent={() => {
          return <View style={{ height: 100 }} />;
        }}
        renderItem={renderItem}
        style={styles.list}
      />
      <View
        style={[
          { ...styles.typeCon },
          { height: 50 + noOfLinesInMessage * 10 },
        ]}>
        <View style={styles.typeLeft}>
          <TextInput
            multiline
            numberOfLines={100}
            value={message}
            onChangeText={setMessageText}
            placeholderTextColor="#c6c6c6"
            placeholder="Enter your message"
          />
        </View>
        <View style={styles.typeRight}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="small"
              color={MD2Colors.blue800}
            />
          ) : (
            <Button mode="contained" onPress={onSendMessage}>
              <Icon source="send" color={'#fff'} size={20} />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
  list: {
    paddingHorizontal: 10,
    width: '100%',
  },

  typeCon: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  sendCon: {
    height: 40,
    width: 40,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    marginHorizontal: 5,
  },
  sendImageCon: {
    height: 40,
    width: 40,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },

  typeLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  typeRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
