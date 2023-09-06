import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text, StyleSheet, View } from 'react-native';

const CustomDrawerContent = ({ name, phoneNumber, ...props }) => {

    const avatarText = name.charAt(0).toUpperCase();
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatarText}</Text>
                </View>
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>Hi, {name}</Text>
                <Text style={styles.name}>{phoneNumber}</Text>
            </View>

            <View style={styles.divider} />
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    divider: {
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 2,
        marginVertical: 10,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        marginLeft: 20,
        paddingHorizontal: 0,
    },
    nameContainer: {
        marginBottom: 10,
        marginLeft: 20,
        paddingHorizontal: 0,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#3730A4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 26,
        color: 'white',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CustomDrawerContent;