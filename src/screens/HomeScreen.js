import React, { useState, useEffect } from 'react';
import {
	Button, View, Text,
	StyleSheet, KeyboardAvoidingView,
	TextInput, Dimensions, TouchableOpacity, ToastAndroid,
	useWindowDimensions, FlatList, Alert, Modal, Pressable, Linking

} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

export function HomeScreen({ route, navigation }) {

	const layout = useWindowDimensions();
	const isFocused = useIsFocused();

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'cash', title: 'Cash' },
		{ key: 'bank', title: 'Bank' },
	])
	const [cashRequests, setcashRequests] = useState([]);
	const [bankRequests, setbankRequests] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
	const [requestId, setRequestId] = useState('');

	useEffect(() => {
		if (isFocused) {
			fetchRequest();
			fetchCashRequest();
			fetchBankRequest();
		}
	}, [isFocused]);

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
								style={[styles.modalButton, styles.buttonCancel]}
								onPress={() => onClose()}
							>
								<Text style={styles.modalButtonText}>Cancel</Text>
							</Pressable>
							<Pressable
								style={[styles.modalButton, styles.buttonCall]}
								onPress={() => handleCall(phoneNumber)}
							>
								<Text style={styles.modalButtonText}>Call</Text>
							</Pressable>
						</View>

					</View>
				</View>
			</Modal>
		);
	};

	const handleOpenModal = (phoneNumber, requestId) => {
		setSelectedPhoneNumber(phoneNumber);
		setRequestId(requestId);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
	};



	const renderItem = ({ item }) => {
		return (
			<ScrollView style={styles.item}>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					flex: 1,
				}}>
					<Text style={{ fontSize: 16, color: '#424242' }}>{item.opened_by.name}</Text>
					<Text>{item.opened_by.transactions + " Transacted"}</Text>
				</View>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					flex: 1,
					marginTop: 30
				}}>
					<View>
						<Text style={{ fontSize: 10 }}>{"Amount"}</Text>
						<Text style={{ fontSize: 20, color: '#3D3D3F' }}>{item.amount}</Text>
					</View>
					<TouchableOpacity
						style={styles.acceptButton}
						onPress={() => handleOpenModal(item.opened_by.phone, item.id)}>
						<Text style={styles.buttonText}> Accept </Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	};

	const CashRoute = () => (
		<View style={{ flex: 1, backgroundColor: '#E9ECF4' }}>
			<FlatList
				data={cashRequests}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);

	const BankRoute = () => (
		<View style={{ flex: 1, backgroundColor: '#E9ECF4' }}>
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

	const createCall = async () => {
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
					"request": requestId,
				});
				var requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: raw,
					redirect: 'follow'
				};
				const response = await fetch(REACT_APP_BASE_URL + `/calls`, requestOptions)
				const resData = await response.json();
				console.log("here", resData)
			}
		}

		catch (error) {
			console.error(error);
		}
	}

	const fetchRequest = async () => {
		try {

			const token = await AsyncStorage.getItem('token')
			// const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
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
				if (route.params !== undefined && route.params.requestType === "B") {
					requestType = "C"
					setIndex(1);
				}
				else {
					requestType = "B"
				}
				const response = await fetch(REACT_APP_BASE_URL + `/requests?type=${requestType}`, requestOptions)
				const resData = await response.json();
				if (route.params !== undefined && route.params.requestType === "B") {
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

			const token = await AsyncStorage.getItem('token')
			// const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
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
				const response = await fetch(REACT_APP_BASE_URL + `/requests?type=B`, requestOptions)
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

			const token = await AsyncStorage.getItem('token')
			// const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
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
				const response = await fetch(REACT_APP_BASE_URL + `/requests?type=C`, requestOptions)
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
		createCall();
		Linking.openURL(`tel:${phone}`);
	};

	const goToRequestPage = () => {
		navigation.navigate("Add Request")
	}

	const renderTabBar = props => (
		<TabBar
			{...props}
			indicatorStyle={styles.tabIndicator}
			indicatorContainerStyle={{ flex: 1 }}
			style={styles.tabBar}
			activeColor='#4A43BD'
			inactiveColor='#908E8E'
			labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
		/>
	);


	return (
		<View style={styles.container}>
			<TabView
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				style={styles.tabView}
			/>
			<TouchableOpacity
				style={styles.requestButton}
				onPress={goToRequestPage}>
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
	acceptButton: {
		backgroundColor: '#5C54DF',
		width: 0.3 * SCREENWIDTH,
		height: 0.05 * SCREENHEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	buttonText: {
		fontFamily: 'Poppins',
		fontSize: 18,
		color: 'white',
		alignSelf: 'center',
	},
	item: {
		margin: 16,
		padding: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		backgroundColor: 'white',
		borderRadius: 10,
		elevation: 10,
		shadowColor: '#8374a6',
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
	requestButton: {
		backgroundColor: '#5C54DF',
		width: SCREENWIDTH,
		height: 0.07 * SCREENHEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonCancel: {
		backgroundColor: '#5C54DF'
	},
	buttonCall: {
		backgroundColor: '#4ABAA6'
	},
	modalButton: {
		width: 0.25 * SCREENWIDTH,
		height: 0.05 * SCREENHEIGHT,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white'
	},
	modalText: {
		marginBottom: 30,
		textAlign: "center",
		fontSize: 18,
		fontWeight: 'bold',
		color: '#232325'
	},
	modalButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 0.6 * SCREENWIDTH
	},
	tabView: {
		backgroundColor: '#E9ECF4'
	},
	tabIndicator: {
		backgroundColor: '#4A43BD',
		height: 0.005 * SCREENHEIGHT,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabBar: {
		backgroundColor: '#E9ECF4'
	}

})