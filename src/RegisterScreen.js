import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import { REACT_APP_BASE_URL } from "chk"

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function RegisterScreen({ navigation }) {

    const [name, setName] = useState('');
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);
    const registerPost = async () => {
        checkValid = validate()
        if (checkValid) {
            try {
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
                const response = await fetch(REACT_APP_BASE_URL + "/user/api/register", requestOptions)
                const res = await response.json();
                console.log(res)
                if (res["success"] == true) {
                    ToastAndroid.show("Registered successfully", ToastAndroid.SHORT)
                    navigation.navigate('InputOTP', { phone: value })
                }
                else {
                    ToastAndroid.show(res["error"], ToastAndroid.SHORT)
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
            }
        }
        else {
            ToastAndroid.show("not valid", ToastAndroid.SHORT)
        }

    };

    const validate = () => {
        return phoneInput.current?.isValidNumber(value);
    }
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior={'padding'}
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
                    {/* <TextInput
                        style={styles.input}
                        value={number}
                        placeholder="Enter your number"
                        keyboardType="numeric"
                        onChangeText={number => setNumber(number)}
                    /> */}
                    <PhoneInput
                        style={styles.phone}
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="IN"
                        layout="second"
                        onChangeText={(text) => {
                            setValue(text);
                        }}
                        withDarkTheme
                        withShadow
                        autoFocus
                    />
                    <TouchableOpacity style={styles.button} onPress={registerPost}>
                        <Text style={styles.buttonText}> Register </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={styles.loginText}> Already have an account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginText, {
                                fontFamily: 'Poppins',
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
    },
    containerAvoid: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    heading: {
        marginBottom: 10,
        marginTop: 40,
        fontSize: 20
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
        width: 0.7 * SCREENWIDTH,
        height: 0.07 * SCREENHEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 20,
    },
    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        fontWeight: "bold",
    },
})