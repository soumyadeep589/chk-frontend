import React, { useState, useEffect } from 'react';
import {
	Button, View, Text,
	StyleSheet, KeyboardAvoidingView,
	TextInput, Dimensions, TouchableOpacity, ToastAndroid,
	useWindowDimensions, FlatList, Alert, Modal, Pressable, Linking

} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import { REACT_APP_BASE_URL } from "chk";


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function HomeScreen({ route, navigation }) {

	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'cash', title: 'Cash' },
		{ key: 'bank', title: 'Bank' },
	])
	const [requests, setRequests] = useState([]);
	const [cashRequests, setcashRequests] = useState([]);
	const [bankRequests, setbankRequests] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

	useEffect(() => {
		fetchRequest();
		fetchCashRequest();
		fetchBankRequest();
	}, []);

	// requests = [
	// 	{ id: '1', name: 'Component 1', amount: 100, noOfTransactions: 121 },
	// 	{ id: '2', name: 'Component 2', amount: 200, noOfTransactions: 122 },
	// 	{ id: '4', name: 'Component 3', amount: 300, noOfTransactions: 123 },
	// 	{ id: '5', name: 'Component 4', amount: 400, noOfTransactions: 124 },
	// 	{ id: '6', name: 'Component 5', amount: 500, noOfTransactions: 125 },
	// 	{ id: '7', name: 'Component 6', amount: 600, noOfTransactions: 126 },
	// 	{ id: '8', name: 'Component 7', amount: 700, noOfTransactions: 127 },
	// 	// Add more items as needed
	// ];

	const CallModal = ({ phoneNumber, visible, onClose }) => {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible}
				onRequestClose={() => onClose()}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Please call to meet and exchange money</Text>
						<View style={styles.modalButtonContainer}>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => onClose()}
							>
								<Text style={styles.textStyle}>Cancel</Text>
							</Pressable>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => handleCall(phoneNumber)}
							>
								<Text style={styles.textStyle}>Call</Text>
							</Pressable>
						</View>

					</View>
				</View>
			</Modal>
		);
	};

	const handleOpenModal = (phoneNumber) => {
		setSelectedPhoneNumber(phoneNumber);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
	};



	const renderItem = ({ item }) => {
		return (
			<ScrollView style={styles.item}>
				<View>
					<Text>{item.opened_by.name}</Text>
					<Text>{item.opened_by.transactions + "Transacted"}</Text>
				</View>
				<View>
					<View>
						<Text>{"Amount"}</Text>
						<Text>{item.amount}</Text>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={() => handleOpenModal(item.opened_by.phone)}>
						<Text style={styles.buttonText}> Accept </Text>
					</TouchableOpacity>
				</View>

			</ScrollView>
		);
	};

	const CashRoute = () => (
		<View style={{ flex: 1, backgroundColor: '#ff4081' }}>
			<FlatList
				data={cashRequests}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);

	const BankRoute = () => (
		<View style={{ flex: 1, backgroundColor: '#ff4081' }}>
			<FlatList
				data={bankRequests}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>

	);

	const renderScene = SceneMap({
		cash: CashRoute,
		bank: BankRoute,
	});

	const acceptRequest = async (item) => {
		setModalVisible(true)
		console.log("from accept Request" + item.name);
	}

	const fetchRequest = async () => {
		try {

			// const token = await AsyncStorage.getItem('token')
			const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
			console.log(token)
			if (token !== null) {
				// if (token === null) {
				var myHeaders = new Headers();
				myHeaders.append("authorization", `token ${token}`);
				myHeaders.append("Content-Type", "application/json");

				var requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow'
				};
				let requestType;
				if (route.params.requestType === "B") {
					requestType = "C"
					setIndex(1);
				}
				else {
					requestType = "B"
				}
				const response = await fetch(REACT_APP_BASE_URL + `/api/requests?type=${requestType}`, requestOptions)
				const resData = await response.json();
				if (route.params.requestType === "B") {
					setbankRequests(resData)
				}
				else {
					setcashRequests(resData)
				}
				console.log("here", resData)
			}
		}

		catch (error) {
			console.error(error);
		}
	};

	const fetchCashRequest = async () => {
		try {

			// const token = await AsyncStorage.getItem('token')
			const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
			console.log(token)
			if (token !== null) {
				// if (token === null) {
				var myHeaders = new Headers();
				myHeaders.append("authorization", `token ${token}`);
				myHeaders.append("Content-Type", "application/json");

				var requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow'
				};
				let requestType = route.params.requestType
				const response = await fetch(REACT_APP_BASE_URL + `/api/requests?type=B`, requestOptions)
				const resData = await response.json();
				setcashRequests(resData);
				console.log("here", resData)
			}
		}


		catch (error) {
			console.error(error);
		}
	};

	const fetchBankRequest = async () => {
		try {

			// const token = await AsyncStorage.getItem('token')
			const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
			console.log(token)
			if (token !== null) {
				// if (token === null) {
				var myHeaders = new Headers();
				myHeaders.append("authorization", `token ${token}`);
				myHeaders.append("Content-Type", "application/json");

				var requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow'
				};
				const response = await fetch(REACT_APP_BASE_URL + `/api/requests?type=C`, requestOptions)
				const resData = await response.json();
				setbankRequests(resData);
				console.log("here", resData)
			}
		}


		catch (error) {
			console.error(error);
		}
	};

	const handleCall = (phone) => {
		console.log("phone", phone)
		Linking.openURL(`tel:${phone}`);
	};

	return (
		<View style={styles.container}>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
			<TouchableOpacity
				style={styles.button}
				onPress={fetchRequest}>
				<Text style={styles.buttonText}> Request </Text>
			</TouchableOpacity>
			<CallModal phoneNumber={selectedPhoneNumber} visible={modalVisible} onClose={handleCloseModal} />
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
	},
	item: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
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
		elevation: 5
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center"
	},
	modalButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	}

})