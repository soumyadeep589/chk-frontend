import React, { useState, useRef, useEffect } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import { REACT_APP_BASE_URL } from "chk";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function UpdateAmountScreen({ route, navigation }) {

    const isFocused = useIsFocused();

    const [errors, setErrors] = useState({});
    const [updateAmount, setupdateAmount] = useState('');

    useEffect(() => {
        if (isFocused) {
            setupdateAmount('');
            setErrors({});
        }
    }, [isFocused]);

    const handleSubmitUpdate = () => {
        if (validateForm()) {
            // Form is valid, perform your submit logic here
            console.log('Form submitted');
            updateRequest()
        }
    };

    const updateRequest = async () => {
        try {

            const token = await AsyncStorage.getItem('token')
            // const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
            console.log(token)
            if (token !== null) {
                // if (token === null) {
                var myHeaders = new Headers();
                myHeaders.append("authorization", `token ${token}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "amount": updateAmount,
                });
                var requestOptions = {
                    method: 'PATCH',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + `/requests/${route.params.requestId}`, requestOptions)
                const resData = await response.json();
                console.log("here2", resData)
                navigation.navigate('Your Requests');
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (updateAmount.trim() === '') {
            isValid = false;
            errors.updateAmount = 'Amount is required';
        }
        setErrors(errors);
        // setModalVisible(true);
        return isValid;
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior={'padding'}
                style={styles.containerAvoid}
            >
                <Text style={styles.heading}>Enter The New Amount</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={updateAmount}
                    onChangeText={value => setupdateAmount(value)}
                    placeholder="Enter the amount"
                />
                {errors.updateAmount && <Text style={styles.error}>{errors.updateAmount}</Text>}
                <TouchableOpacity style={styles.button} onPress={handleSubmitUpdate}>
                    <Text style={styles.buttonText}> Update </Text>
                </TouchableOpacity>
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
        marginVertical: 40,
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
        height: 60,
        margin: 12,
        borderWidth: 0,
        paddingLeft: 30, // Add padding to the left side only
        paddingRight: 30,
        width: 0.8 * SCREENWIDTH,
        backgroundColor: 'white',
        borderRadius: 50,
        fontSize: 16
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
    error: {
        color: 'red',
        marginHorizontal: 12,
        paddingLeft: 30,
        alignSelf: 'flex-start',
    },
})