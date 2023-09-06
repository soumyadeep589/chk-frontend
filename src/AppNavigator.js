import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

// Screens
import { UpdateAmountScreen } from './screens/UpdateAmountScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InputOTPScreen } from './screens/InputOTPScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RequestScreen } from './screens/RequestScreen';
import { YourRequestScreen } from './screens/YourRequestScreen';
import { AboutUsScreen } from './screens/AboutUsScreen';
import DrawerItems from './constants/DrawerItems';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from "chk";

import Icon from 'react-native-vector-icons/FontAwesome';
import { LogoutScreen } from './screens/LogoutScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { ReferFriendScreen } from './screens/ReferFriendScreen';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const fetchUserInfo = async () => {
        try {
            var authToken = await AsyncStorage.getItem('token')
            if (authToken !== null) {
                // if (authToken === null) {
                var myHeaders = new Headers();
                myHeaders.append("authorization", `token ${authToken}`);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + `/user/user-info`, requestOptions)
                const resData = await response.json();
                setName(resData.data.name);
                setPhoneNumber(resData.data.phone);
                console.log("here", resData)
            }
        }

        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);


    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} name={name} phoneNumber={phoneNumber} />}
            drawerType="front"
            initialRouteName="Home"
            screenOptions={{
                activeTintColor: '#3730A4',
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
                            <Icon name={drawer.iconName} size={24} color={focused ? "#3730A4" : "#3c3d3c"} />

                    }}
                    component={
                        drawer.name === 'Home' ? HomeScreen
                            : drawer.name === 'Add Request' ? RequestScreen
                                : drawer.name === 'Your Request' ? YourRequestScreen
                                    : drawer.name === 'About Us' ? AboutUsScreen
                                        : drawer.name === 'Privacy Policy' ? PrivacyPolicyScreen
                                            : drawer.name === 'Refer a Friend' ? ReferFriendScreen
                                                : drawer.name === 'Logout' ? LogoutScreen
                                                    : InputOTPScreen
                    }
                />)

            }
            <Drawer.Screen name="UpdateAmount" component={UpdateAmountScreen}
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerShown: true,
                    title: 'Update Request',
                    headerLeft: () => (
                        <HeaderBackButton label="Hello" onPress={() => navigation.navigate('Your Requests')} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default AppNavigator;