/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title:
      '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
    subtitle: '&#129395;',
    body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
    android: {
      channelId,
      color: '#4caf50',
      actions: [
        {
          title: '<b>Dance</b> &#128111;',
          pressAction: { id: 'dance' },
        },
        {
          title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
          pressAction: { id: 'cry' },
        },
      ],
    },
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // console.log(notification, pressAction);
});

AppRegistry.registerComponent(appName, () => App);
