import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import PhoneInput from "react-native-phone-number-input";

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function LoginScreen({ navigation }) {
    const [name, setName] = useState('');
    const [value, setValue] = useState("");
    const phoneInput = useRef(null);
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior={'padding'}
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
                    <TouchableOpacity style={styles.button} onPress={() => {
                        const checkValid = phoneInput.current?.isValidNumber(value);
                        if (checkValid) {
                            ToastAndroid.show("valid", ToastAndroid.SHORT)
                            navigation.navigate('InputOTP')
                        }
                        else ToastAndroid.show("not valid", ToastAndroid.SHORT)
                    }}>
                        <Text style={styles.buttonText}> Login </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={styles.loginText}> Don’t have an account?
                        </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.loginText, {
                                fontFamily: 'Poppins',
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