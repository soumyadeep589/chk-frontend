
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import { getFcmToken, notificationListener, requestUserPermission } from './src/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from "chk";
import { LoginScreen } from './src/screens/LoginScreen';
import { InputOTPScreen } from './src/screens/InputOTPScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, request } from 'react-native-permissions';

const Drawer = createDrawerNavigator();

export const AuthContext = React.createContext();

export default function App({ navigation }) {

  const [generatedToken, setGeneratedToken] = useState();
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            authToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            authToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            authToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      authToken: null,
    }
  );

  const fetchFcmToken = async () => {
    const token = await getFcmToken();
    if (token) {
      setGeneratedToken(token);
      try {
        await AsyncStorage.setItem('fcmToken', token)
      } catch (e) {
        console.log("error", e)
      }
    }
  };

  const checkLocationPermission = async () => {
    const locationPermissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (locationPermissionStatus === 'granted') {
      fetchLocation();
    } else {
      requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    try {
      const locationPermissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (locationPermissionStatus === 'granted') {
        fetchLocation();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocation = () => {
    Geolocation.requestAuthorization();

    // Get the current location of the device
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        console.log(position.coords);
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  useEffect(() => {

    const fetchAuthToken = async () => {
      try {
        var authToken = await AsyncStorage.getItem('token')
        // var authToken = null;
        // var authToken = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setAuthToken(authToken)
      dispatch({ type: 'RESTORE_TOKEN', token: authToken });
    }

    const checkNotificationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        } catch (error) {
        }
      }
    };

    // let token = await AsyncStorage.getItem('token')
    // let token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
    // let token = null
    // setAuthToken(token)
    fetchAuthToken();
    void fetchFcmToken();
    void notificationListener();
    void requestUserPermission();
    checkNotificationPermission();
    checkLocationPermission();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (authToken) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: authToken });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (authToken) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: authToken });
      },
    }),
    []
  );

  const delay = ms => new Promise(res => setTimeout(res, ms));

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>

        {state.authToken ? (
          <AppNavigator />
        ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="Login" component={LoginScreen}
              options={{
                drawerItemStyle: { display: 'none' },
                headerShown: false
              }}
            />
            <Drawer.Screen name="InputOTP" component={InputOTPScreen}
              options={{
                drawerItemStyle: { display: 'none' },
                headerShown: false
              }}
            />
            <Drawer.Screen name="Register" component={RegisterScreen}
              options={{
                drawerItemStyle: { display: 'none' },
                headerShown: false
              }}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
