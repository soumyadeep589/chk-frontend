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

export function YourRequestScreen({ route, navigation }) {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'active', title: 'Active' },
        { key: 'history', title: 'History' },
    ])
    const [requestType, setRequestType] = useState('');
    const [requestId, setRequestId] = useState('');
    const [callList, setCallList] = useState([]);
    const [requestHistories, setRequestHistories] = useState([]);
    const [amount, setAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [closedToId, setClosedToId] = useState('');
    const [number, setNumber] = useState('');
    const [action, setAction] = useState('update');

    useEffect(() => {
        fetchActiveRequest();
        fetchRequestHistories();
    }, []);

    const CallModal = ({ requestId, closedToId, visible, onClose, action }) => {

        if (action === "close") {

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => onClose()}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure, you want to close this request with Samiran?</Text>
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => onClose()}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => closeRequest(requestId, closedToId)}
                                >
                                    <Text style={styles.textStyle}>Close</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </Modal>
            );

        }

        else if (action === "delete") {

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => onClose()}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure, you want to delete your request?</Text>
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => onClose()}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => deleteRequest(requestId)}
                                >
                                    <Text style={styles.textStyle}>delete</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </Modal>
            );

        }

        else {

            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => onClose()}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Enter the new amount</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={number}
                                onChangeText={handleNumberChange}
                                placeholder="Enter a number"
                            />
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => onClose()}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => updateRequest(requestId)}
                                >
                                    <Text style={styles.textStyle}>update</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            );

        }

    };

    const handleOpenModal = (id, action) => {
        setClosedToId(id)
        setAction(action)
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleNumberChange = (value) => {
        setNumber(value);
    };

    const renderItem = ({ item }) => {
        return (
            <ScrollView style={styles.item}>
                <View>
                    <Text>{item.called_by.name}</Text>
                    <Text>{"tried calling you"}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleOpenModal(item.called_by.id, "close")}>
                        <Text style={styles.buttonText}> Close </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderHistory = ({ item }) => {
        return (
            <ScrollView style={styles.item}>
                <View>
                    <View>
                        <Text>{"Amount"}</Text>
                        <Text>{item.amount}</Text>
                    </View>
                    <View>
                        {item.type === 'B' ? (
                            <Text>{"In Bank"}</Text>
                        ) : (
                            <Text>{"In Cash"}</Text>
                        )}
                    </View>
                    <View>
                        <Text>{item.updated_on}</Text>
                        {item.status === 'CL' ? (
                            <Text>{"Closed"}</Text>
                        ) : (
                            <Text>{"Deleted"}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    };

    const ActiveRoute = () => (
        <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
            <View style={styles.cardContainer}>
                <View style={styles.amountContainer}>
                    <Text>{"Amount"}</Text>
                    <Text>{amount}</Text>
                </View>
                <Text>{"In " + requestType}</Text>
                <View style={styles.divider} />
                <FlatList
                    data={callList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={showDeleteModal}>
                    <Text style={styles.buttonText}> Delete </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={showUpdateModal}>
                    <Text style={styles.buttonText}> Update </Text>
                </TouchableOpacity>
            </View>

        </View>
    );

    const HistoryRoute = () => (
        <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
            <FlatList
                data={requestHistories}
                renderItem={renderHistory}
                keyExtractor={(item) => item.id}
            />
        </View>

    );

    const renderScene = SceneMap({
        active: ActiveRoute,
        history: HistoryRoute,
    });

    const showDeleteModal = () => {
        handleOpenModal(requestId, "delete")
        console.log("delete request")
    }
    const showUpdateModal = () => {
        handleOpenModal(requestId, "update")
        console.log("update request")
    }
    const fetchActiveRequest = async () => {
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
                const response = await fetch(REACT_APP_BASE_URL + `/api/requests/active`, requestOptions)
                const resData = await response.json();
                setCallList(resData.call_list)
                setAmount(resData.request.amount)
                setRequestId(resData.request.id)
                if (resData.request.type === "C") {
                    setRequestType("cash")
                }
                else if (resData.request.type === "B") {
                    setRequestType("bank")
                }
                console.log(requestType)
                console.log("here", resData)
            }
        }

        catch (error) {
            console.error(error);
        }
    };

    const fetchRequestHistories = async () => {
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
                const response = await fetch(REACT_APP_BASE_URL + `/api/requests/history`, requestOptions)
                const resData = await response.json();
                setRequestHistories(resData)
                console.log("here", resData)
            }
        }

        catch (error) {
            console.error(error);
        }
    };

    const closeRequest = async (requestId, closedToId) => {
        try {

            // const token = await AsyncStorage.getItem('token')
            const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
            console.log(token)
            if (token !== null) {
                // if (token === null) {
                var myHeaders = new Headers();
                myHeaders.append("authorization", `token ${token}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "closed_to": closedToId,
                    "status": "CL"
                });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                console.log(requestId, closedToId, "here")
                // const response = await fetch(REACT_APP_BASE_URL + `/api/requests/${requestId}/close`, requestOptions)
                // const resData = await response.json();
                // console.log("here", resData)
                handleCloseModal()
            }
        }


        catch (error) {
            console.error(error);
        }
    };

    const deleteRequest = async () => {
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
                    method: 'POST',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                // const response = await fetch(REACT_APP_BASE_URL + `/api/requests/${requestId}/delete`, requestOptions)
                // const resData = await response.json();
                console.log("here", resData)

                // todo: go back to home or another page

                // navigation.navigate('Home')
                handleCloseModal()
            }
        }


        catch (error) {
            console.error(error);
        }
    };

    const updateRequest = async () => {
        try {

            // const token = await AsyncStorage.getItem('token')
            const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
            console.log(token)
            if (token !== null) {
                // if (token === null) {
                var myHeaders = new Headers();
                myHeaders.append("authorization", `token ${token}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "amount": number,
                });
                var requestOptions = {
                    method: 'PATCH',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(REACT_APP_BASE_URL + `/api/requests/${requestId}`, requestOptions)
                const resData = await response.json();
                console.log("here2", resData)

                fetchActiveRequest()
                handleCloseModal()
            }
        }


        catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
            <CallModal requestId={requestId} closedToId={closedToId} visible={modalVisible} onClose={handleCloseModal} action={action} />
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