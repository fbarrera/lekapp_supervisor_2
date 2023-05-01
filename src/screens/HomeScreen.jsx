import React, { useCallback, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import {
    Button,
    ActivityIndicator,
    Appbar,
    Portal,
    FAB,
    Dialog,
} from 'react-native-paper';
import { StyleContext } from '../utils/StyleContext';
import { ThemeContext } from '../utils/ThemeContext';
import { GlobalDataContext } from '../utils/GlobalDataContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Base64 from '../tools/base64';

function HomeScreen({ route, navigation }) {

    const globalData = useContext(GlobalDataContext);
    const style = useContext(StyleContext);
    const theme = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [sync, setSync] = useState(false);
    const [open, setOpen] = useState(false);
    const [openExitDialog, setOpenExitDialog] = useState(false);
    const [buildingSiteData, setBuildingSiteData] = useState([]);
    const { id, first_name, role } = route.params

    const handleBuildingSiteData = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            setBuildingSiteData(data.buildingSites)
        }
    }

    const handleSync = async () => {
        setSync(true)
        setLoading(true)

        let user_data = await AsyncStorage.getItem('user_data');
        if (user_data) {
            user_data = JSON.parse(user_data)

            let data = await AsyncStorage.getItem('@myActivities')
            if (data) {
                data = JSON.parse(data)
                if (Object.keys(data).length === 0) {
                    alert('No hay actividades para sincronizar')
                    setLoading(false)
                    setSync(false)
                    return
                }
                Object.entries(data).forEach(([key, value]) => {
                    //key: activity id
                    Object.entries(value).forEach(async ([key2, value2]) => {
                        //key2: date
                        let comments = value2.comments
                        let machinery = value2.machinery
                        //remove newline from value2.imageBase64

                        let imageBase64 = Base64.btoa(value2.imageBase64)
                        let qty = value2.qty
                        let status = value2.status
                        let date = key2
                        let activityId = key

                        let payload = {
                            "user_data": user_data.user_data,
                            "activityId": activityId,
                            "date": date,
                            "qty": qty,
                            "status": status,
                            "comments": comments,
                            "machinery": machinery,
                            "imageBase64": imageBase64,
                        };

                        await axios({
                            method: 'post',
                            url: globalData.baseURL + '/app/activities/update',
                            data: payload,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            maxBodyLength: Infinity,
                            maxContentLength: Infinity,
                        }).catch(
                            function (error) {
                                if (error.response) {
                                    console.log(error.response.data);
                                    console.log(error.response.status);
                                    console.log(error.response.headers);
                                } else if (error.request) {
                                    console.log(error.request);
                                } else {
                                    console.log('Error', error.message);
                                }
                                console.log(error.config);
                            }
                        ).then(
                            async (backData) => {

                            }
                        ).finally(
                            async () => {
                                setLoading(false)
                                setSync(false)
                            }
                        )
                    })
                })
                alert('Sincronización exitosa');
                await AsyncStorage.setItem('@myActivities', JSON.stringify({}))
                let payload = await AsyncStorage.getItem('@mydb');
                navigation.navigate({
                    name: 'Inicio',
                    params: {
                        ...payload
                    },
                    merge: true,
                })
            } else {
                setLoading(false);
                setSync(false);
                alert('Error al sincronizar');
            }
        } else {
            setLoading(false);
            setSync(false);
            alert('Error al sincronizar');
        }

    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            handleBuildingSiteData()
            setLoading(false)
            return () => {
            }
        }, [])
    );

    return (
        <>
            <Appbar.Header style={style.appbar}>
                <Appbar.Content title="Inicio" color='white' />
            </Appbar.Header>
            {
                loading ? <View style={style.container}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                    />
                    <Text style={{
                        marginTop: 10,
                    }}>
                        {
                            sync ? 'Sincronizando...' : 'Cargando...'
                        }
                    </Text>
                </View> : <>
                    <View style={style.container}>
                        <Text>
                            Bienvenido/a, {first_name}
                        </Text>
                        <Text>
                            Usted se encuentra en la pantalla de {role}
                        </Text>
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 20,
                            }}
                        >
                            Obras disponibles: {buildingSiteData?.length ?? 0}
                        </Text>
                        <Portal>
                            <FAB.Group
                                open={open}
                                icon={open ? 'backspace' : 'cog'}
                                label={open ? 'Volver' : ''}
                                actions={[
                                    {
                                        icon: 'domain', label: 'Ver obras', onPress: () => {
                                            navigation.navigate('Obras')
                                        }
                                    },
                                    {
                                        icon: 'sync', label: 'Sincronizar', onPress: () => handleSync()
                                    },
                                    {
                                        icon: 'exit-to-app', label: 'Cerrar sesión', onPress: () => {
                                            setOpenExitDialog(true)
                                        }
                                    }
                                ]}
                                onStateChange={({ open }) => setOpen(open)}
                                onPress={() => {
                                    if (open) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </Portal>
                        <Portal>
                            <Dialog visible={openExitDialog} onDismiss={() => {
                                setOpenExitDialog(false)
                            }}>
                                <Dialog.Title>Cerrar sesión</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium">¿Desea cerrar la sesión?</Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={
                                        () => {
                                            setOpenExitDialog(false)
                                        }
                                    }
                                        mode="contained"
                                        style={{
                                            ...style.button,
                                            backgroundColor: theme.colors.secondary
                                        }}
                                    >
                                        No
                                    </Button>
                                    <Button onPress={
                                        async () => {
                                            setOpenExitDialog(false)
                                            await AsyncStorage.clear();
                                            navigation.popToTop()
                                        }
                                    }
                                        mode="contained"
                                        style={style.button}
                                    >
                                        Sí
                                    </Button>

                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </>
            }
        </>
    );
}

export default HomeScreen;