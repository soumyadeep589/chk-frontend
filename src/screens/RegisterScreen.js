import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid, Platform, ActivityIndicator

} from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import { REACT_APP_BASE_URL } from "chk"

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function RegisterScreen({ navigation }) {

    const [name, setName] = useState('');
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);
    const [buttonLoading, setButtonLoading] = useState(false);

    const submitRegister = () => {
        if (name === '') {
            ToastAndroid.show("Please Provide Your Name", ToastAndroid.SHORT)
        }
        else {
            registerPost();
        }
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const registerPost = async () => {
        checkValid = validate()
        if (checkValid) {
            try {
                setButtonLoading(true);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "phone": value,
                    "name": name
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + "/user/register", requestOptions)
                const res = await response.json();
                // var res = { "success": true }
                if (res["success"] == true) {
                    setButtonLoading(false);
                    ToastAndroid.show("Registered successfully", ToastAndroid.SHORT)
                    navigation.navigate('InputOTP', { phone: value })
                }
                else {
                    setButtonLoading(false);
                    ToastAndroid.show(res["error"], ToastAndroid.SHORT)
                }
            } catch (error) {
                console.error(error);
                setButtonLoading(false);
                ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
            }
        }
        else {
            ToastAndroid.show("Please Provide Valid Ph. No", ToastAndroid.SHORT)
        }

    };

    const validate = () => {
        return phoneInput.current?.isValidNumber(value);
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                style={styles.containerAvoid}
            >
                <Text style={styles.heading}>
                    {"Welcome Onboard !"}
                </Text>
                <Text style={styles.para}>
                    {"Lets transact cash with your friends"}
                </Text>
                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        placeholder="Enter your name"
                        onChangeText={name => setName(name)}
                    />
                    <PhoneInput
                        containerStyle={styles.phone}
                        textContainerStyle={styles.phoneInputContainer}
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="IN"
                        layout="first"
                        placeholder='Mobile Number'
                        onChangeText={(text) => {
                            setValue(text);
                        }}
                        withDarkTheme
                        withShadow
                        autoFocus
                    />
                    <TouchableOpacity style={styles.button} onPress={submitRegister}>
                        {buttonLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}> Register </Text>
                        )}

                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={styles.loginText}> Already have an account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginText, {
                                fontFamily: 'Poppins', fontWeight: 'bold', color: '#261EA6'
                            }]}> Log in </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E9ECF4',
        fontFamily: 'Poppins'
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
        marginBottom: 20,
        marginTop: 10,
        fontSize: 13
    },
    input: {
        height: 70,
        margin: 12,
        borderWidth: 0,
        paddingLeft: 30, // Add padding to the left side only
        paddingRight: 30,
        width: 0.8 * SCREENWIDTH,
        backgroundColor: 'white',
        borderRadius: 50,
        fontSize: 16
    },
    phone: {
        height: 70,
        margin: 12,
        borderWidth: 0,
        width: 0.8 * SCREENWIDTH,
        backgroundColor: 'white',
        borderRadius: 50,
    },
    phoneInputContainer: {
        borderRadius: 50,
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