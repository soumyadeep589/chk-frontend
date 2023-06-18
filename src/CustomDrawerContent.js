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
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    nameContainer: {
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CustomDrawerContent;