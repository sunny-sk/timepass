import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { MD2Colors, ActivityIndicator } from 'react-native-paper';
import colors from '../../constants/colors';
import { saveMessageFB, showToast } from '../../utils/api';
import { useRoute } from '@react-navigation/native';
type Props = {};

const SendMessage = (_props: Props) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const [noOfLinesInMessage, setNoOfLinesInMessage] = useState(1);

  const setMessageText = (text: string) => {
    let count = text.split(/\r\n|\r|\n/).length;
    setNoOfLinesInMessage(count);
    setMessage(text);
  };
  const onSendMessage = async () => {
    setIsLoading(true);
    const res = await saveMessageFB(message, route.params?.channelName);
    setIsLoading(false);
    if (res) {
      setMessage('');
      showToast('Message sent!!');
    }
  };

  return (
    <>
      <View
        style={[
          { ...styles.typeCon },
          { maxHeight: 60 + noOfLinesInMessage * 10 },
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
            <>
              <View
                style={{
                  borderRadius: 100,
                  height: 45,
                  width: 45,
                  overflow: 'hidden',
                  marginRight: 5,
                }}>
                <Button
                  labelStyle={{
                    width: '100%',
                  }}
                  contentStyle={{
                    height: '100%',
                    width: '100%',
                  }}
                  style={{ width: '100%', minWidth: '100%' }}
                  mode="contained"
                  onPress={onSendMessage}>
                  <IconAntDesign name="paperclip" color={'#fff'} size={18} />
                </Button>
              </View>
              <Button
                disabled={!message || isLoading}
                mode="contained"
                onPress={onSendMessage}>
                <Icon source="send" color={'#fff'} size={20} />
              </Button>
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
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
