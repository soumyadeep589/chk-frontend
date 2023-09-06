import React, { useState, useEffect, memo, useMemo } from 'react';
import {
    Button, View, Text,
    StyleSheet, KeyboardAvoidingView,
    TextInput, Dimensions, TouchableOpacity, ToastAndroid,
    useWindowDimensions, FlatList, Alert, Modal, Pressable, ActivityIndicator

} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
import { REACT_APP_BASE_URL } from "chk";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

// const ModalContent = memo((buttonLoading, handleButtonPress, onClose) => {
//     return (
//         <View style={styles.modalButtonContainer}>
//             <Pressable
//                 style={[styles.modalButton, styles.buttonCancel]}
//                 onPress={() => onClose()}
//             >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//             </Pressable>
//             <Pressable
//                 disabled={buttonLoading}
//                 style={[styles.modalButton, styles.buttonDelete]}
//                 onPress={() => handleButtonPress()}
//             >
//                 {buttonLoading ? (
//                     <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                     <Text style={styles.modalButtonText}>Delete</Text>
//                 )}
//             </Pressable>
//         </View>
//     );
// });


export function YourRequestScreen({ route, navigation }) {

    const layout = useWindowDimensions();
    const isFocused = useIsFocused();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'active', title: 'Active' },
        { key: 'history', title: 'History' },
    ])
    const [requestType, setRequestType] = useState('');
    const [requestId, setRequestId] = useState('');
    const [callList, setCallList] = useState([]);
    const [activePresent, setActivePresent] = useState(false);
    const [requestHistories, setRequestHistories] = useState([]);
    const [amount, setAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [closedToId, setClosedToId] = useState('');
    const [closedToName, setClosedToName] = useState('');
    const [action, setAction] = useState('delete');
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            // Perform actions when the screen is focused
            setLoading(true);
            fetchActiveRequest();
            fetchRequestHistories();
        }

    }, [isFocused]);


    // const handleButtonPress = () => {
    //     setButtonLoading(true);
    //     // Perform asynchronous task (e.g., API call) here
    //     setTimeout(() => {
    //         setButtonLoading(false);
    //     }, 2000);
    // };

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
                            <Text style={styles.modalText}>Are you sure, you want to close this request with <Text style={{ color: '#5C54DF', fontSize: 20 }}>{closedToName}</Text>?</Text>
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={[styles.modalButton, styles.buttonCancel]}
                                    onPress={() => onClose()}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.modalButton, styles.modalButtonClose]}
                                    onPress={() => closeRequest(requestId, closedToId)}
                                >
                                    <Text style={styles.modalButtonText}>Close</Text>
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
                            <Text style={styles.modalText}>Are you sure, you want to delete your request?</Text>
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={[styles.modalButton, styles.buttonCancel]}
                                    onPress={() => onClose()}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    disabled={buttonLoading}
                                    style={[styles.modalButton, styles.buttonDelete]}
                                    onPress={() => deleteRequest(requestId)}
                                >
                                    {buttonLoading ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text style={styles.modalButtonText}>Delete</Text>
                                    )}
                                </Pressable>
                            </View>

                            {/* <ModalContent buttonLoading={buttonLoading} handleButtonPress={handleButtonPress} onClose={() => onClose()} /> */}

                        </View>
                    </View>
                </Modal>
            );

        }

    }

    const naviagateToUpdateScreen = (id) => {
        navigation.navigate('UpdateAmount', { requestId: requestId })
    };

    const handleOpenModal = (id, action, name) => {
        setClosedToId(id)
        if (name) {
            setClosedToName(name);
        }
        setAction(action)
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
                    flex: 1
                }}>
                    <Text style={{ fontSize: 18, color: '#3D3D3F', width: '40%' }}>{item.called_by.name}</Text>
                    <Text style={{ fontSize: 12, width: '30%' }} >{"tried calling you"}</Text>
                    <TouchableOpacity
                        style={[styles.closeButton, { width: '20%' }]}
                        onPress={() => handleOpenModal(item.called_by.id, "close", item.called_by.name)}>
                        <Text style={styles.buttonText}> Close </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderHistory = ({ item }) => {
        return (
            <ScrollView>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    margin: 16,
                    padding: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View>
                        <Text style={{ fontSize: 12 }}>{"Amount"}</Text>
                        <Text style={{ fontSize: 20, color: '#3D3D3F' }}>{item.amount}</Text>
                    </View>
                    <View style={{ fontSize: 12 }}>
                        {item.type === 'B' ? (
                            <Text>{"In Bank"}</Text>
                        ) : (
                            <Text>{"In Cash"}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ fontSize: 12 }}>{item.updated_on}</Text>
                        {item.status === 'CL' ? (
                            <Text style={{ fontSize: 20, color: '#38887A' }}>{"Closed"}</Text>
                        ) : (
                            <Text style={{ fontSize: 20, color: '#E854A4' }}>{"Deleted"}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    };

    const ActiveRoute = () => {
        if (loading) {
            return (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#5C54DF" />
                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: '#E9ECF4' }}>
                    {activePresent ? (
                        <View style={{ flex: 1 }}>
                            <View style={styles.cardContainer}>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 10 }}>{"Amount"}</Text>
                                        <Text style={{ fontSize: 20, color: '#3D3D3F' }}>{amount}</Text>
                                    </View>
                                    <Text>{"in " + requestType}</Text>
                                </View>

                                <View style={styles.divider} />
                                {callList.length === 0 ? (
                                    <Text>Waiting for others to call and show here. Meanwhile you can try our home section to see other requests.</Text>
                                ) : (
                                    <FlatList
                                        data={callList}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id}
                                    />
                                )}



                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                // height: 0.08 * SCREENHEIGHT,
                                flex: 0.1
                            }}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={showDeleteModal}>
                                    <Text style={styles.buttonTextUpdate}> Delete </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.updateButton}
                                    onPress={naviagateToUpdateScreen}>
                                    <Text style={styles.buttonTextUpdate}> Update </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    ) : (
                        <View style={styles.cardContainer}>
                            <Text>Sorry, You don't have any active request. Please create one.</Text>
                        </View>
                    )}

                </View>
            )

        }

    };

    const HistoryRoute = () => {
        if (loading) {
            return (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#5C54DF" />
                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: '#E9ECF4' }}>
                    {requestHistories.length === 0 ? (
                        <View style={{margin: 20}}>
                            <Text>You Don’t Have Any Previous Requests, Please Create a New Request.</Text>
                        </View>

                    ) : (
                        <FlatList
                            data={requestHistories}
                            renderItem={renderHistory}
                            keyExtractor={(item) => item.id}
                        />
                    )}
                </View>
            )
        }


    };

    const renderScene = SceneMap({
        active: ActiveRoute,
        history: HistoryRoute,
    });

    const showDeleteModal = () => {
        handleOpenModal(requestId, "delete")
        console.log("delete request")
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const fetchActiveRequest = async () => {
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
                const response = await fetch(REACT_APP_BASE_URL + `/requests/active`, requestOptions)
                if (response.status === 404) {
                    setCallList([])
                    setAmount('')
                    setRequestId('')
                    setActivePresent(false)
                }
                else if (response.status === 200) {
                    const resData = await response.json();
                    setActivePresent(true)
                    setCallList(resData.call_list)
                    setAmount(resData.request.amount)
                    setRequestId(resData.request.id)
                    if (resData.request.type === "C") {
                        setRequestType("cash")
                    }
                    else if (resData.request.type === "B") {
                        setRequestType("bank")
                    }
                }
                setLoading(false);
            }
        }

        catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchRequestHistories = async () => {
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
                const response = await fetch(REACT_APP_BASE_URL + `/requests/history`, requestOptions)
                const resData = await response.json();
                setRequestHistories(resData)
                setLoading(false);
                console.log("here", resData)
            }
        }

        catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const closeRequest = async (requestId, closedToId) => {
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
                const response = await fetch(REACT_APP_BASE_URL + `/requests/${requestId}/close`, requestOptions)
                const resData = await response.json();
                console.log("here", resData)
                handleCloseModal()
                navigation.navigate('Add Request')
            }
        }


        catch (error) {
            console.error(error);
        }
    };

    const deleteRequest = async () => {
        try {
            setButtonLoading(true);
            const token = await AsyncStorage.getItem('token')
            // const token = "a8c4fb963aa9f975a3ca86a371e17148494ca738"
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
                const response = await fetch(REACT_APP_BASE_URL + `/requests/${requestId}/delete`, requestOptions)
                const resData = await response.json();
                console.log("here", resData)

                // todo: go back to home or another page
                setButtonLoading(false);
                ToastAndroid.show("Request Deleted Successfully", ToastAndroid.SHORT)
                handleCloseModal()
                navigation.navigate('Add Request')
            }
        }


        catch (error) {
            console.error(error);
            setButtonLoading(false);
        }
    };

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
            />
            <CallModal requestId={requestId} closedToId={closedToId} visible={modalVisible} onClose={handleCloseModal} action={action} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#5C54DF',
        width: 0.2 * SCREENWIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
    },
    deleteButton: {
        backgroundColor: '#E854A4',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    updateButton: {
        backgroundColor: '#5C54DF',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextUpdate: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
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
    item: {
        marginBottom: 25
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
    },
    cardContainer: {
        margin: 16,
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#8374a6',
        flex: 0.9
    },
    divider: {
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        marginVertical: 30
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
    buttonCancel: {
        backgroundColor: '#5C54DF'
    },
    buttonDelete: {
        backgroundColor: '#E854A4'
    },
    modalButtonClose: {
        backgroundColor: '#4ABAA6'
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },

})