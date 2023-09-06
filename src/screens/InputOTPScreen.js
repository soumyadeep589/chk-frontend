import React from 'react';
import {
	Button, View, Text,
	StyleSheet, KeyboardAvoidingView,
	TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import RnOtpTimer from 'rn-otp-timer';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function InputOTPScreen({ route, navigation }) {

	const { signIn } = React.useContext(AuthContext);

	const createDevice = async (authToken) => {
		try {
			const fcmToken = await AsyncStorage.getItem('fcmToken')
			var myHeaders = new Headers();
			myHeaders.append("authorization", `token ${authToken}`);
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				"registration_id": fcmToken,
				"type": "android"
			});

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};
			const responseFcm = await fetch(REACT_APP_BASE_URL + "/devices", requestOptions)
			const resFcm = await responseFcm.json();
			console.log("success fcm ----------------------------------")
			// navigation.navigate("Request")
		} catch (error) {
			console.error(error);
			ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
		}
	}

	const verifyOtp = async (code) => {
		try {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				"phone": route.params.phone,
				"otp": code
			});

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};
			const response = await fetch(REACT_APP_BASE_URL + "/user/verify-otp", requestOptions)
			const res = await response.json();
			if (res["success"] == true) {
				// var authToken = "d2d0d75fa1c89edb5d421d501c34447c13eb3789"
				var authToken = res["data"]["token"]
				try {
					await AsyncStorage.setItem('token', authToken)
				} catch (e) {
					console.log("error", e)
				}
				ToastAndroid.show("Phone number verified", ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show(res["error"], ToastAndroid.SHORT)
			}
			createDevice(authToken)
			signIn(authToken)
			// navigation.navigate("Request")
		} catch (error) {
			console.error(error);
			ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
		}
	}

	const resendOtp = async () => {
        try {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				"phone": route.params.phone,
			});

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};
			const response = await fetch(REACT_APP_BASE_URL + "/user/login", requestOptions)
			const res = await response.json();
			// var res = {"success" : true}
			if (res["success"] == true) {
				ToastAndroid.show("Otp generated for login", ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show(res["error"], ToastAndroid.SHORT)
			}
		} catch (error) {
			console.error(error);
			ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
		}

    };

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
				style={styles.containerAvoid}
			>
				<Text style={styles.heading}>
					{"Verify your OTP"}
				</Text>
				<Text style={styles.para}>
					{"Enter the OTP sent to your mobile"}
				</Text>
				<Text style={styles.phoneNumberText}>
					{route.params.phone}
				</Text>
				<OTPInputView
					style={{ width: '80%', height: 100 }}
					pinCount={6}
					autoFocusOnLoad
					codeInputFieldStyle={styles.underlineStyleBase}
					codeInputHighlightStyle={styles.underlineStyleHighLighted}
					onCodeFilled={verifyOtp}
				/>
				<View style={styles.OtpTimeResendContainer}>
					<Text style={styles.ExpireText}>
						{"Code will expire in"}
					</Text>
					<RnOtpTimer
						style={styles.OtpTimer}
						minutes={0}
						seconds={60}
						timerStyle={styles.timerStyle}
						resendButtonStyle={styles.button}
						resendButtonTextStyle={styles.buttonText}
						resendButtonAction={resendOtp}
					/>
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
	},
	para: {
        marginBottom: 20,
        marginTop: 10,
        fontSize: 13
    },
	phoneNumberText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#5C54DF'
	},
	button: {
		backgroundColor: '#5C54DF',
		width: 0.2 * SCREENWIDTH,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		borderRadius: 15,
	},
	buttonText: {
		fontFamily: 'Poppins',
		fontSize: 16,
		color: 'white',
		alignSelf: 'center',
	},
	underlineStyleBase: {
		width: 30,
		height: 45,
		borderWidth: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#8a8a8a',
		color: "#060505"
	},

	underlineStyleHighLighted: {
		borderBottomWidth: 1.2,
		borderBottomColor: "#060505",
	},
	OtpTimeResendContainer: {
		flexDirection: 'row',
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	ExpireText: {
		flex: 2
	},
	OtpTimer: {
		flex: 1,
		width: '33%',
		
	},
	timerStyle: {
		color: '#261EA6',
		fontSize: 16,
		fontWeight: 'bold',
		borderBottomWidth: 1,
		borderBottomColor: '#261EA6'
	}

})