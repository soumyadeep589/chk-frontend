import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Picker

} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';



const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;
const data = [
    { label: 'Cash', value: 'C' },
    { label: 'Bank', value: 'B' },
];
export function RequestScreen({ navigation }) {
    const [amount, setAmount] = useState(null)
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const fetchRequest = async () => {
        try {

            const token = await AsyncStorage.getItem('token')
            console.log(token)
            if (token !== null) {
                var myHeaders = new Headers();
                myHeaders.append("authorization", `token ${token}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "amount": amount,
                    "type": value
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + `/api/requests`, requestOptions)
                const json = await response.json();
                console.log(json)
            }


        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View style={StyleSheet.container}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior={'padding'}
                style={styles.containerAvoid}
            >
                <View style={styles.containerHeading}>
                    <Text style={styles.heading}>
                        {"Request Money"}
                    </Text>
                    <Text style={styles.para}>
                        {"Request money as cash or in your bank"}
                    </Text>
                </View>

                <Image source={require('./assets/images/transfer_money.png')} style={styles.image} />
                <View style={styles.inputDropDownContainer}>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        onChangeText={(amount) => setAmount(amount)}
                        value={amount}
                        placeholder="Amount"
                        maxLength={5}  //setting limit of input
                    />
                    <View style={styles.dropDownContainer}>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={data}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select item' : '...'}

                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}

                        />
                    </View>

                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={fetchRequest}>
                    <Text style={styles.buttonText}> Request </Text>
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
        alignItems: 'center',
        padding: 10
    },
    containerHeading: {
        alignItems: 'center'
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
        padding: 10,
        paddingLeft: 15,
        width: 0.5 * SCREENWIDTH,
        backgroundColor: 'white',
        borderRadius: 100
    },

    button: {
        backgroundColor: '#5C54DF',
        width: 0.8 * SCREENWIDTH,
        height: 0.07 * SCREENHEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 0.07 * SCREENHEIGHT,
    },
    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        fontWeight: "bold",
    },
    inputDropDownContainer: {
        marginTop: 0.07 * SCREENHEIGHT,
        flexDirection: 'row',
        width: 0.8 * SCREENWIDTH,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropDownContainer: {
    },
    dropdown: {
        width: 100,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
})