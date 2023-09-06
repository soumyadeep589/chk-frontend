import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const getFcmToken = async () => {
    try {
        const newFcmToken = await messaging().getToken();
        console.log("fcm token", newFcmToken);
        return newFcmToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
};

const notificationListener = () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        })
        .catch(error => console.log('failed', error));

    // Foreground State
    messaging().onMessage(async remoteMessage => {
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        console.log('foreground', remoteMessage);
    });
};

export {
    getFcmToken,
    requestUserPermission,
    notificationListener,
  };