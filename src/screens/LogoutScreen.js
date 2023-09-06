import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import { AuthContext } from '../../App';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function LogoutScreen({ navigation }) {

    const { signOut } = React.useContext(AuthContext);

    const logout = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token')
            var myHeaders = new Headers();
            myHeaders.append("authorization", `token ${authToken}`);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(REACT_APP_BASE_URL + "/user/logout", requestOptions)
            const res = await response.json();
            console.log("success logout ----------------------------------")
            signOut();
            await AsyncStorage.removeItem('token')
        } catch (error) {
            console.error(error);
            ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
        }
        
    }
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior={'padding'}
                style={styles.containerAvoid}
            >
                <Text style={styles.heading}>
                    {"Are you sure, you want to logout?"}
                </Text>
                <View style={styles.containerInput}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: '#E854A4'}]} onPress={logout}>
                        <Text style={styles.buttonText}> Logout </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}> Back to Home </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAvoid: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    heading: {
        marginTop: 40,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    containerInput: {
        flex: 1,
        alignItems: 'center',
    },
    para: {
        marginBottom: 10,
        marginTop: 10,
        fontSize: 10
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 0.9 * SCREENWIDTH,
    },
    phone: {

    },
    button: {
        backgroundColor: '#5C54DF',
        width: 0.8 * SCREENWIDTH,
        height: 0.09 * SCREENHEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        fontWeight: "bold",
    },
})