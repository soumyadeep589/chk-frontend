import React, { useState, useRef } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, Image

} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function SplashScreen({ navigation }) {


    return (
        <LinearGradient
            colors={['#6C67BE', '#1B1858']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            style={styles.container}
        >
            {/* Your app content */}
            <Image source={require('../assets/images/chklogo.png')} style={styles.image} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})