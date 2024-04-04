import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uniqid from 'react-native-uuid';
const LOCAL_AUTH_KEY = 'user_login';
import messaging from '@react-native-firebase/messaging';
export const showToast = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
  );
};

export const logout = () => {
  auth()
    .signOut()
    .then(async () => {
      GoogleSignin.revokeAccess();
      await AsyncStorage.removeItem(LOCAL_AUTH_KEY);
    });
};
export const saveError = (error: any) => {
  const id = uniqid.v4() as string;
  firestore()
    .collection('Errors')
    .doc(id)
    .set({
      message: error?.message,
      stackTrace: JSON.stringify(error),
    });
};
export const registerUser = async () => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const pushNotificationToken = await messaging().getToken();

    // Sign-in the user with the credential
    let { user } = await auth().signInWithCredential(googleCredential);
    // email got in Oauth
    if (user.email) {
      const data = await firestore()
        .collection('Users')
        .where('email', '==', user.email)
        .get();
      // user already registered
      if (data.size > 0) {
        const userData = {
          token: '' + googleCredential.token,
          secret: '' + googleCredential.secret,
          photo: '' + user.photoURL,
          lastLogin: new Date(),
          pushNotificationToken,
        };
        firestore()
          .collection('Users')
          .doc(data.docs[0].id)
          .update(userData)
          .then(() => {
            console.log('updated');
          });
      } else {
        // new user
        const userData = {
          name: '' + user.displayName,
          token: '' + googleCredential.token,
          secret: '' + googleCredential.secret,
          photo: '' + user.photoURL,
          alloNotification: false,
          lastLogin: new Date(),
          pushNotificationToken,
          role: 'user',
          email: user.email,
          location: {
            latitude: '',
            longitude: '',
          },
          friends: [],
        };
        firestore()
          .collection('Users')
          .doc()
          .set(userData)
          .then(() => {
            showToast('User registered successfully!');
          });
      }
    }
  } catch (error) {
    saveError(error);
  }
};

export const updateLastSeenFB = async () => {
  let { email } = auth().currentUser!;
  const data = await firestore()
    .collection('Users')
    .where('email', '==', email)
    .get();
  if (data.size === 0) {
    return null;
  } else {
    firestore().collection('Users').doc(data.docs[0].id).update({
      lastSeen: new Date(),
    });
  }
};
export const updatePushNotiToken = async (pushNotificationToken: string) => {
  if (!pushNotificationToken) {
    return;
  }
  let { email } = auth().currentUser!;
  const data = await firestore()
    .collection('Users')
    .where('email', '==', email)
    .get();
  if (data.size === 0) {
    return null;
  } else {
    firestore().collection('Users').doc(data.docs[0].id).update({
      pushNotificationToken: new Date(),
    });
  }
};

export const getLastSeenFB = async (cName: string) => {
  const currentUser = auth().currentUser;
  if (cName) {
    const users = cName.split('_chat_');
    const userOne = users[0];
    const userTwo = users[1];
    const data = await firestore()
      .collection('Users')
      .where('email', 'in', [userOne, userTwo])
      .get();

    if (data.size > 0) {
      const seens: string[] = [];
      data.forEach(e => {
        seens.push(`${e.data().email}_date_${e.data().lastSeen.toDate()}`);
      });
      const lastSeen = seens.filter(
        (e: string) => !e.includes(currentUser?.email!),
      )[0];
      return [lastSeen.split('_date_')[0], lastSeen.split('_date_')[1]];
    }
  } else {
  }
};

export const getAllChannelsFB = () => {
  return firestore()
    .collection('Chats')
    .get()
    .then(res => res.docs)
    .then(res => {
      return res.map(e => {
        return {
          name: e.id,
        };
      });
    });
};

export const getAllUsersFB = async () => {
  return firestore().collection('Users').get();
};

export const getUserDetails = async () => {
  try {
    let { email } = auth().currentUser!;
    const data = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();
    if (data.size === 0) {
      return null;
    } else {
      return data.docs[0].data();
    }
  } catch (error) {}
};

export const deleteAllMessagesFB = (cName: string) => {
  const colRef = firestore()
    .collection('Chats')
    .doc(cName)
    .collection('messages');
  return colRef.get().then(querySnapshot => {
    return Promise.all(querySnapshot.docs.map(d => d.ref.delete()));
  });
};

export const updateLocation = async location => {
  let { email } = auth().currentUser!;
  const data = await firestore()
    .collection('Users')
    .where('email', '==', email)
    .get();
  if (data.size === 0) {
  } else {
    firestore()
      .collection('Users')
      .doc(data.docs[0].id)
      .update({
        location: {
          latitude: `${location.coords.latitude}`,
          longitude: `${location.coords.longitude}`,
        },
      });
  }
};

export const saveMessageFB = async (msg: string, channelName?: string) => {
  try {
    const { email } = auth().currentUser!;
    const res = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();
    if (!email) {
      return null;
    }
    if (res.size === 0) {
      return null;
    }
    const userData: any = res.docs[0].data();

    if (channelName && channelName.includes(email)) {
      const message = {
        msg,
        createdAt: new Date(),
        from: email,
      };
      await firestore()
        .collection('Chats')
        .doc(channelName)
        .collection('messages')
        .doc()
        .set(message);
      return true;
    } else {
      if (userData?.friends.length === 0 && !(userData.role === 'admin')) {
        showToast('Cannot send message, No friends added');
        return false;
      }
      const to = userData?.friends[0];

      const message = {
        msg,
        createdAt: new Date(),
        from: email,
        to,
      };
      let c = channelName ? channelName : `${email}_chat_${to}`;

      await firestore()
        .collection('Chats')
        .doc(c)
        .collection('messages')
        .doc()
        .set(message);
      return true;
    }
  } catch (error) {
    saveError(error);
  }
};

export const getMessagesFB = async (cName?: string) => {
  try {
    let x;
    if (cName) {
      x = cName;
    } else {
      let { email } = auth().currentUser!;
      const res = await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();
      const userData: any = res.docs[0].data();
      const to = userData?.friends[0];
      const channelName = `${email}_chat_${to}`;
      x = channelName;
    }
    return firestore()
      .collection('Chats')
      .doc(x)
      .collection('messages')
      .orderBy('createdAt', 'asc');
  } catch (error) {
    saveError(error);
  }
};
