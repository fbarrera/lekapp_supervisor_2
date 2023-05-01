import React, { useState, useCallback, useContext } from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    Appbar,
    Button
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleContext } from '../utils/StyleContext';
import currentDate from '../tools/currentDate';

function ActivityScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const payload = route.params;
    const [activityRecords, setActivityRecords] = useState([]);

    const handleActivityLoad = async () => {

        await AsyncStorage.setItem('@mydb', JSON.stringify(payload));

        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            data.activity = payload.activity
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
        let todayActivityInstances = {};
        let activitiesInstances = await AsyncStorage.getItem('@myActivities');
        if (activitiesInstances) {
            activitiesInstances = JSON.parse(activitiesInstances);
            if (activitiesInstances[payload.activity.id]) {
                if (activitiesInstances[payload.activity.id][currentDate()]) {
                    todayActivityInstances = activitiesInstances[payload.activity.id][currentDate()];
                } else {
                    todayActivityInstances = {};
                }
            } else {
                todayActivityInstances = {};
            }
        }
        setActivityRecords(todayActivityInstances);
    }

    const unloadActivity = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            delete data.activity;
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
    }

    useFocusEffect(
        useCallback(() => {
            handleActivityLoad();
            return () => { };
        }, [])
    );

    return (
        <>
            <Appbar.Header style={style.appbar}>
                <Appbar.BackAction onPress={() => {
                    navigation.navigate({
                        name: 'Actividades',
                        params: {
                            ...payload,
                        },
                        merge: true,
                    })
                }}
                    color='white' />
                <Appbar.Content title="Actividad" color='white' />
            </Appbar.Header>
            {
                Object.entries(activityRecords).length === 0 ? (
                    <View style={style.container}>
                        <Text style={
                            {
                                marginBottom: 10,
                                color: 'red'
                            }
                        }>No hay registros el día de hoy para la actividad</Text>
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
                        <Button mode="contained" onPress={() => {
                            navigation.navigate(
                                {
                                    name: 'QR',
                                    params: {
                                        ...payload
                                    },
                                }
                            )
                        }}>
                            Abrir actividad
                        </Button>
                    </View>
                ) : (
                    <View style={style.container}>
                        <Text style={{
                            marginBottom: 20,
                            color: 'green'
                        }}>Hay registros el día de hoy</Text>
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


                        <Button mode="contained" onPress={() => {
                            navigation.navigate(
                                {
                                    name: 'QR',
                                    params: {
                                        ...payload
                                    },
                                }
                            )
                        }}>
                            Editar
                        </Button>
                    </View>
                )
            }
        </>
    );
}
export default ActivityScreen;