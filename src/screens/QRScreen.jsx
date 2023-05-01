import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
    View,
    ScrollView,
    Image,
    Modal
} from 'react-native';
import {
    Appbar, Button, TextInput, Text
} from 'react-native-paper';

import { useFocusEffect } from '@react-navigation/native';
import { StyleContext } from '../utils/StyleContext';
import { ThemeContext } from '../utils/ThemeContext';
import currentDate from '../tools/currentDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


/* QRCODE: DATE | BUILDING_SITE_ID | ACTIVITY_CODE | ZONE_ID > ENCODED AS BASE64 */


function QRScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const theme = useContext(ThemeContext);
    const payload = route.params;
    const [registryData, setRegistryData] = useState({
        "qty": 0,
        "comments": "",
        "machinery": "",
        "imageBase64": null,
        "status": "pending",
    });
    const [QRData, setQRData] = useState("");
    const [quantityText, setQuantityText] = useState("");
    const [showDialog, setShowDialog] = useState(false);

    const quantityField = (value) => {

        /* payload.activity.qty is the max value! */

        const parsedValue = parseFloat(value);
        if (parsedValue > payload.activity.qty) {
            value = payload.activity.qty;
        }
        if (parsedValue < 0) {
            value = 0;
        }

        let newRegistryData = {
            ...registryData,
            qty: value,
        }
        setRegistryData(newRegistryData);
    }

    const commentsField = (value) => {
        let newRegistryData = {
            ...registryData,
            comments: value,
        }
        setRegistryData(newRegistryData);
    }

    const machineryField = (value) => {
        let newRegistryData = {
            ...registryData,
            machinery: value,
        }
        setRegistryData(newRegistryData);
    }

    const imageField = (value) => {
        let newRegistryData = {
            ...registryData,
            imageBase64: value,
        }
        setRegistryData(newRegistryData);
    }

    handleCurrentRecordOpen = async () => {
        let qtyReplaceComma = payload.activity.qty;
        qtyReplaceComma = qtyReplaceComma.toString().replace('.', ',');
        setQuantityText("Cantidad (Max: " + qtyReplaceComma + " [" + payload.activity.unt + "]): ");
        let buildingSiteId = payload.buildingSite.id;
        let activityCode = payload.activity.activity_code;
        let zoneId = payload.activity.fk_zone;
        let date = currentDate();
        let QRString = `${date}|${buildingSiteId}|${activityCode}|${zoneId}`;
        let activityData = await AsyncStorage.getItem('@myActivities');
        if (activityData) {
            activityData = JSON.parse(activityData);
        } else {
            activityData = {};
        }

        if (activityData?.[payload.activity.id]?.[currentDate()]) {
            setRegistryData(activityData[payload.activity.id][currentDate()]);
            await AsyncStorage.setItem('@myActivities', JSON.stringify(activityData));
        } else {
            activityData[payload.activity.id] = {
                [currentDate()]: registryData
            }
            await AsyncStorage.setItem('@myActivities', JSON.stringify(activityData));
        }
        setQRData(QRString);
    }

    const handleSave = async () => {
        let activityData = await AsyncStorage.getItem('@myActivities');
        if (activityData) {
            activityData = JSON.parse(activityData);
        } else {
            activityData = {};
        }
        activityData[payload.activity.id] = {
            [currentDate()]: registryData
        }
        await AsyncStorage.setItem('@myActivities', JSON.stringify(activityData));
        navigation.navigate({
            name: 'Actividad',
            params: handleReturnParams(),
            merge: true,
        })
    }

    useFocusEffect(
        useCallback(() => {
            handleCurrentRecordOpen();
            return () => { };
        }, [])
    );

    const handleReturnParams = () => {
        if (payload.currentRecord) {
            let params = {
                ...payload,
            };
            delete params.currentRecord;
            return params;
        } else {
            return payload;
        }
    }

    useEffect(() => {
        console.log(showDialog);
    }, [showDialog]);

    return (
        <>
            <Appbar.Header style={style.appbar}>
                <Appbar.BackAction onPress={() => {
                    navigation.navigate({
                        name: 'Actividad',
                        params: handleReturnParams(),
                        merge: true,
                    })
                }}
                    color='white' />
                <Appbar.Content title="QR" color='white' />
            </Appbar.Header>
            {
                <ScrollView>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                        <Text style={{
                            fontWeight: 'bold',
                            marginBottom: 10,
                        }}>
                            {payload.activity.name}
                        </Text>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: 24,
                        }}>
                            {payload.activity.activity_code}
                        </Text>
                        {
                            QRData != "" && <QRCode
                                value={QRData}
                                size={150}
                                color="black"
                                backgroundColor="white"
                            />
                        }
                    </View>
                    <View>
                        <TextInput
                            label={quantityText}
                            value={registryData.qty.toString()}
                            style={{
                                margin: 10,
                            }}
                            maxValue={payload.activity.qty}
                            onChangeText={quantityField}
                            keyboardType="numeric"
                            inputMode='numeric'
                        />
                        <TextInput
                            label="Notas (separe con comas)"
                            value={registryData.comments}
                            style={{
                                margin: 10,
                            }}
                            onChangeText={commentsField}
                            multiline={true}
                        />
                        <TextInput
                            label="Maquinaria (separe con comas)"
                            value={registryData.machinery}
                            style={{
                                margin: 10,
                            }}
                            onChangeText={machineryField}
                            multiline={true}
                        />

                        {
                            registryData.imageBase64 && <>
                                <Image
                                    source={{ uri: registryData.imageBase64 }}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        alignSelf: 'center',
                                        margin: 10,
                                    }}
                                />
                                <Button
                                    mode="contained"
                                    style={{
                                        margin: 10,
                                    }}
                                    buttonColor='red'
                                    onPress={() => {
                                        imageField(null);
                                    }}
                                >
                                    Eliminar imagen
                                </Button>
                            </>
                        }
                        <Button
                            mode="contained"
                            style={{
                                margin: 10,
                            }}
                            onPress={() => {
                                setShowDialog(!showDialog);
                            }}
                        >
                            {
                                registryData.imageBase64 ? "Cambiar imagen" : "Agregar imagen"
                            }
                        </Button>
                        <Modal
                            animationType='slide'
                            visible={showDialog}
                            onRequestClose={() => {
                                setShowDialog(!showDialog);
                            }}
                        >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    marginBottom: 10,
                                }}>
                                    Fuente de la imagen
                                </Text>
                                <Button
                                    mode="contained"
                                    style={{
                                        margin: 10,
                                    }}
                                    onPress={
                                        async () => {
                                            await launchCamera({
                                                mediaType: 'photo',
                                                includeBase64: true,
                                                maxWidth: 640,
                                                maxHeight: 640,
                                                cameraType: 'back',
                                                selectionLimit: 1,
                                            }, (response) => {
                                                if (response.didCancel) {
                                                    console.log('User cancelled image picker');
                                                } else if (response.errorCode == 'camera_unavailable') {
                                                    console.log('Camera not available on device');
                                                } else if (response.errorCode == 'permission') {
                                                    console.log('Permission not satisfied');
                                                } else if (response.errorCode == 'others') {
                                                    console.log(response.errorMessage);
                                                } else {
                                                    imageField(`data:image/jpeg;base64,${response.assets[0].base64}`);
                                                    setShowDialog(!showDialog);
                                                }
                                            })
                                        }
                                    }
                                >
                                    Cámara
                                </Button>
                                <Button
                                    mode="contained"
                                    style={{
                                        margin: 10,
                                    }}
                                    onPress={async () => {
                                        await launchImageLibrary({
                                            mediaType: 'photo',
                                            includeBase64: true,
                                            maxWidth: 640,
                                            maxHeight: 640,
                                            cameraType: 'back',
                                            selectionLimit: 1,
                                        }, (response) => {
                                            if (response.didCancel) {
                                                console.log('User cancelled image picker');
                                            } else if (response.errorCode == 'camera_unavailable') {
                                                console.log('Camera not available on device');
                                            } else if (response.errorCode == 'permission') {
                                                console.log('Permission not satisfied');
                                            } else if (response.errorCode == 'others') {
                                                console.log(response.errorMessage);
                                            } else {
                                                imageField(`data:image/jpeg;base64,${response.assets[0].base64}`);
                                                setShowDialog(!showDialog);
                                            }
                                        })
                                    }}
                                >
                                    Galería
                                </Button>
                                <Button
                                    mode="contained"
                                    style={{
                                        margin: 30,
                                    }}
                                    onPress={() => {
                                        setShowDialog(!showDialog);
                                    }}
                                    buttonColor={theme.colors.secondary}
                                >
                                    Cancelar
                                </Button>
                            </View>
                        </Modal>
                        {
                            registryData.imageBase64 && <Button
                                mode="contained"
                                style={{
                                    margin: 10,
                                }}
                                onPress={() => { handleSave() }}
                            >
                                Confirmar registro
                            </Button>
                        }
                    </View>
                </ScrollView>
            }
        </>
    );
}

export default QRScreen;