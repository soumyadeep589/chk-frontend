import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, Share, Image, TouchableOpacity

} from 'react-native';


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function ReferFriendScreen({ navigation }) {

    const onShare = async () => {
        try {
            const result = await Share.share({
                title: 'App link',
                message: 'Hi, Please checkout this app to avoid ATM and getting your money exchanged from cash-to-digital or digital-to-cash easily among your friends !\nLink: https://play.google.com/store/apps/details?id=com.chkrn',
                url: 'https://play.google.com/store/apps/details?id=com.chkrn'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                style={styles.containerAvoid}
            >
                <View style={styles.containerHeading}>
                    <Text style={styles.heading}>
                        {"Invite your friends"}
                    </Text>
                    <Text style={styles.para}>
                        {"Refer friends to improve your chance of getting money exchanged"}
                    </Text>
                </View>

                <Image source={require('../assets/images/refer.png')} style={styles.image} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onShare}>
                    <Text style={styles.buttonText}> Share </Text>

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
    containerHeading: {
        alignItems: 'center',
        padding: 10
    },
    heading: {
        marginTop: 40,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 20
    },
    para: {
        margin: 10,
        fontSize: 13,
        textAlign: 'center'
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
    image: {
        width: 203,
        height: 195,
        marginVertical: 30
    },
})