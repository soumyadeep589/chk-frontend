import * as React from 'react';
import {
	Button, View, Text,
	StyleSheet, KeyboardAvoidingView,
	TextInput, Dimensions, TouchableOpacity, ToastAndroid

} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import RnOtpTimer from 'rn-otp-timer';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';



const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function InputOTPScreen({ route, navigation }) {

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				keyboardVerticalOffset={50}
				behavior={'padding'}
				style={styles.containerAvoid}
			>
				<Text style={styles.heading}>
					{"Verify your OTP"}
				</Text>
				<Text style={styles.para}>
					{"Enter the OTP sent to your mobile"}
				</Text>
				<Text>
					{route.params.phone}
				</Text>
				<OTPInputView
					style={{ width: '80%', height: 100 }}
					pinCount={6}
					autoFocusOnLoad
					codeInputFieldStyle={styles.underlineStyleBase}
					codeInputHighlightStyle={styles.underlineStyleHighLighted}
					onCodeFilled={async (code) => {
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
							const response = await fetch(REACT_APP_BASE_URL + "/user/api/verify-otp", requestOptions)
							const res = await response.json();
							// if (res["success"] == true) {
							// 	var value = res["data"]["token"]
							// 	try {
							// 		await AsyncStorage.setItem('token', value)
							// 	} catch (e) {
							// 		console.log("error", e)
							// 	} 1
							// 	ToastAndroid.show("Phone number verified", ToastAndroid.SHORT)
							// 	navigation.navigate("Request")
							// }
							// else {
							// 	ToastAndroid.show(res["error"], ToastAndroid.SHORT)
							// }
							navigation.navigate("Request")
						} catch (error) {
							console.error(error);
							ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
						}

					}}

				/>
				<View style={styles.OtpTimeResendContainer}>
					<Text style={styles.ExpireText}>
						{"Code will expire in"}
					</Text>
					<RnOtpTimer
						style={styles.OtpTimer}
						minutes={0}
						seconds={10}
						resendButtonStyle={styles.button}
						resendButtonTextStyle={styles.buttonText}
						resendButtonAction={() => {
							console.log('otp resent!');
						}}
					/>
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
		fontSize: 14,
		color: 'white',
		alignSelf: 'center',
	},
	underlineStyleBase: {
		width: 30,
		height: 45,
		borderWidth: 0,
		borderBottomWidth: 1,
	},

	underlineStyleHighLighted: {
		borderColor: "#060505",
	},
	OtpTimeResendContainer: {
		flexDirection: 'row',
		width: '80%',
		justifyContent: 'center',
	},
	ExpireText: {
		flex: 2
	},
	OtpTimer: {
		flex: 1,
		width: '33%',
	}

})