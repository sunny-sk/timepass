import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Msg from '../msg';
import { getMessagesFB } from '../../utils/api';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../hooks';

type MSG = {
  message: string;
  createdAt: string;
  from: string;
  myMessage: boolean;
};

const MessagesList = () => {
  const chatList = useRef(null);
  const [allMessages, setAllMessages] = useState<MSG[]>();
  const route = useRoute();
  const { authData } = useAuth();
  const keyExtractor = useCallback((e: any) => {
    return e.toString() + Math.random();
  }, []);
  const renderItem = useCallback(({ item }: { item: any }) => {
    return <Msg myMessage={item.myMessage} msg={item.message} />;
  }, []);

  useEffect(() => {
    getMessagesFB(route?.params?.channelName).then(x => {
      x?.get().then(querySnapshot => {
        const allMsg: MSG[] = [];
        querySnapshot.docs.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          allMsg.push({
            message: data.msg,
            createdAt: data.createAt,
            from: data.from,
            myMessage: data.from === authData.email,
          });
        });
        setAllMessages(allMsg);
        if (chatList?.current) {
          chatList.current.scrollToEnd();
        }
      });
    });
  }, [route?.params?.channelName]);

  useEffect(() => {
    let subscriber: any;
    getMessagesFB(route?.params?.channelName).then(x => {
      subscriber = x?.onSnapshot(documentSnapshot => {
        const allMsg: MSG[] = [];
        documentSnapshot?.docs.forEach(ds => {
          const data = ds.data();
          allMsg.push({
            message: data.msg,
            createdAt: data.createAt,
            from: data.from,
            myMessage: data.from === authData.email,
          });
        });
        if (chatList?.current) {
          chatList.current.scrollToEnd();
        }
        setAllMessages(allMsg);
      });
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [route?.params?.channelName]);

  return (
    <FlatList
      ref={chatList}
      showsVerticalScrollIndicator={false}
      data={allMessages}
      keyExtractor={keyExtractor}
      ListFooterComponent={ListFooterComponent}
      renderItem={renderItem}
      style={styles.list}
    />
  );
};

export default MessagesList;

const ListFooterComponent = () => {
  return <View style={styles.bottomSpace} />;
};
const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    width: '100%',
  },
  bottomSpace: {
    height: 100,
  },
});
