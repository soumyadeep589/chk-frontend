
import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { RegisterScreen } from './src/RegisterScreen';
import { HomeScreen } from './src/HomeScreen';
import { InputOTPScreen } from './src/InputOTPScreen';
import { LoginScreen } from './src/LoginScreen';
import { RequestScreen } from './src/RequestScreen';
import { YourRequestScreen } from './src/YourRequestScreen';
import { AboutUsScreen } from './src/AboutUsScreen';
import DrawerItems from './src/constants/DrawerItems';

// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Request">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Register" component={RegisterScreen} />
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     <Stack.Screen name="InputOTP" component={InputOTPScreen} />
    //     <Stack.Screen name="Request" component={RequestScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <Drawer.Navigator
        drawerType="front"
        initialRouteName="Your Requests"
        screenOptions={{
          activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 10 },
        }}

      >
        {
          DrawerItems.map(drawer => <Drawer.Screen
            key={drawer.name}
            name={drawer.name}
            component={
              drawer.name === 'Home' ? HomeScreen
                : drawer.name === 'Add Request' ? RequestScreen
                : drawer.name === 'Your Requests' ? YourRequestScreen
                : drawer.name === 'About Us' ? AboutUsScreen
                : drawer.name === 'Privacy Policy' ? AboutUsScreen
                : drawer.name === 'Contact Us' ? AboutUsScreen
                : drawer.name === 'Terms & Conditions' ? AboutUsScreen
                : drawer.name === 'Refer a Friend' ? AboutUsScreen
                  : LoginScreen
            }
          />)
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
