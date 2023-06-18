import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';

// Screens
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InputOTPScreen } from './screens/InputOTPScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RequestScreen } from './screens/RequestScreen';
import { YourRequestScreen } from './screens/YourRequestScreen';
import { AboutUsScreen } from './screens/AboutUsScreen';
import DrawerItems from './constants/DrawerItems';


import Icon from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();

const AppNavigator = ({ name, phoneNumber }) => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} name={name} phoneNumber={phoneNumber} />}
            drawerType="front"
            initialRouteName="Your Requests"
            screenOptions={{
                activeTintColor: 'blue',
                inactiveTintColor: 'gray',
                itemStyle: { marginVertical: 5 },
                labelStyle: { fontSize: 16 },
                iconContainerStyle: { marginLeft: 8 },
            }}
        >
            {
                DrawerItems.map(drawer => <Drawer.Screen
                    key={drawer.name}
                    name={drawer.name}
                    options={{
                        drawerIcon: ({ focused }) =>
                            <Icon name={drawer.iconName} size={24} color={focused ? "#e91e63" : "black"} />

                    }}
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
    );
};

export default AppNavigator;