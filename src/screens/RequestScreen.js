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
    Picker,
    ToastAndroid,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator

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
    const [amount, setAmount] = useState('')
    const [value, setValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);


    const CallModal = ({ visible, onClose }) => {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => onClose()}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                Hi, you have an open request, please close that before requesting new.
                            </Text>
                            <TouchableOpacity onPress={gotoRequestPage}>
                                <Text style={{ color: '#261EA6', fontSize: 16 }}>
                                    Go to Your Requests page
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
        );

    }


    const submitRequest = () => {
        if (amount === '') {
            ToastAndroid.show("Please Provide Amount", ToastAndroid.SHORT)
        }
        else if (value === '') {
            ToastAndroid.show("Please Select a Type", ToastAndroid.SHORT)
        }
        else {
            createRequest();
        }
    }

    const gotoRequestPage = () => {
        setAmount('');
        setValue('');
        navigation.navigate('Your Request');
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));


    const createRequest = async () => {
        try {
            setButtonLoading(true);

            const token = await AsyncStorage.getItem('token')
            console.log(token)
            if (token !== null) {
                // if (token === null) {
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
                const response = await fetch(REACT_APP_BASE_URL + `/requests`, requestOptions)
                const json = await response.json();
                if (json["non_field_errors"] !== undefined && json["non_field_errors"][0] === 'already opened request') {
                    handleOpenModal()
                }
                setButtonLoading(false);
                console.log(json)
            }


        } catch (error) {
            console.error(error);
            setButtonLoading(false);
        }
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={StyleSheet.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
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

                <Image source={require('../assets/images/transfer_money.png')} style={styles.image} />
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
                            placeholder={!isFocus ? 'Select' : '...'}

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
                    onPress={submitRequest}>
                    {buttonLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}> Request </Text>
                    )}

                </TouchableOpacity>

            </KeyboardAvoidingView>
            <CallModal visible={modalVisible} onClose={handleCloseModal} />
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
        alignItems: 'center',
        padding: 10
    },
    containerHeading: {
        alignItems: 'center'
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
        borderWidth: 0,
        borderRadius: 50,
        paddingHorizontal: 16,
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
    image: {
        width: 203,
        height: 195,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E854A4'
    },
})