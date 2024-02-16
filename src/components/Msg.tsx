import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../constants/colors';

const Msg = ({ msg = '', myMessage = false }) => {
  return (
    <>
      <View
        style={[
          { ...styles.con },
          myMessage ? { ...styles.right } : { ...styles.left },
        ]}>
        <Text
          variant="bodyMedium"
          style={[
            { ...styles.text },
            myMessage ? { ...styles.rightText } : { ...styles.leftText },
          ]}>
          {msg}
        </Text>
      </View>
    </>
  );
};

export default Msg;

const styles = StyleSheet.create({
  con: {
    // width: '65%',
    marginVertical: 7,
  },

  leftCon: {
    backgroundColor: colors.secondry,
  },
  rightCon: {
    backgroundColor: colors.secondry,
  },
  text: {
    //
  },
  leftText: {
    color: colors.secondry,
  },
  rightText: {
    color: colors.white,
  },
  left: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: colors.white,
    borderWidth: 0.7,
    borderColor: colors.secondry,
  },
  right: {
    backgroundColor: colors.secondry,
    borderColor: colors.secondry,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    alignSelf: 'flex-end',
    padding: 10,
    borderWidth: 0.7,
  },
});
