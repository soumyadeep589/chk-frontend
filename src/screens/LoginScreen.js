import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid, ActivityIndicator

} from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import { REACT_APP_BASE_URL } from "chk"

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function LoginScreen({ navigation }) {
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);
    const [buttonLoading, setButtonLoading] = useState(false);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const login = async () => {
        checkValid = validate()
        if (checkValid) {
            try {
                setButtonLoading(true);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "phone": value,
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + "/user/login", requestOptions)
                const res = await response.json();
                if (res["success"] == true) {
                    setButtonLoading(false);
                    ToastAndroid.show("Otp generated for login", ToastAndroid.SHORT)
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
                    {"Welcome Back !"}
                </Text>
                <Text style={styles.para}>
                    {"Please enter your number to login"}
                </Text>
                <View style={styles.containerInput}>
                    <PhoneInput
                        containerStyle={styles.phone}
                        textContainerStyle={styles.phoneInputContainer}
                        textInputStyle={{height: 50}}
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
                    <TouchableOpacity style={styles.button} onPress={login}>
                        {buttonLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}> Login </Text>
                        )}

                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={styles.loginText}> Don’t have an account?
                        </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.loginText, {
                                fontFamily: 'Poppins', fontWeight: 'bold', color: '#261EA6'
                            }]}> Register </Text>
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
        marginTop: 20
    },
    para: {
        marginBottom: 20,
        marginTop: 10,
        fontSize: 13
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 0.9 * SCREENWIDTH,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#5C54DF',
        width: 0.8 * SCREENWIDTH,
        height: 0.09 * SCREENHEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 40,
    },
    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        fontWeight: "bold",
    },
})