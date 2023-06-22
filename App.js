
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './src/AppNavigator';
import { getFcmToken, notificationListener, requestUserPermission } from './src/notifications';


// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();


const App = () => {


  const [generatedToken, setGeneratedToken] = useState();
  const name = 'John Doe'; // Replace with actual name
  const phoneNumber = '123-456-7890'; // Replace with actual phone number

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken();
      if (token) {
        setGeneratedToken(token);
      }
    };
    void fetchToken();
    void notificationListener();
    void requestUserPermission();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator name={name} phoneNumber={phoneNumber} />
    </NavigationContainer>
  );
};

export default App;
