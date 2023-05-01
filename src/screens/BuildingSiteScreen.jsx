import React, { useState, useCallback, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import {
    Appbar,
    List,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleContext } from '../utils/StyleContext';

function BuildingSiteScreen({ route, navigation }) {

    const style = useContext(StyleContext);

    const payload = route.params;
    const [loading, setLoading] = useState(false);

    handleSetBuildingSite = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            data.buildingSite = payload.buildingSite
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            handleSetBuildingSite()
            setLoading(false)

            return () => {
            }

        }, [])
    );

    const title = "Obra"

    return (
        <>
            <Appbar.Header style={style.appbar}>
                <Appbar.BackAction onPress={() => {
                    navigation.navigate({
                        name: "Obras",
                        params: {
                            ...payload,
                        },
                        merge: true,
                    })
                }}
                    color='white'
                />
                <Appbar.Content title={title} color='white' />
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
                        Cargando información...
                    </Text>
                </View>
                    : <View>
                        <ScrollView>
                            <List.Section>
                                <List.Item
                                    title="Especialidades"
                                    left={props => <List.Icon {...props} icon="account-hard-hat" />}
                                    description={payload.speciality?.name ?? 'Seleccione una especialidad'}
                                    onPress={
                                        () => {
                                            navigation.navigate('Especialidades', payload)
                                        }
                                    }
                                    right={props => <List.Icon {...props} icon="chevron-right" />}
                                />
                                <List.Item
                                    title="Zonas"
                                    left={props => <List.Icon {...props} icon="map-marker-radius" />}
                                    description={payload.zone?.name ?? 'Seleccione una zona'}
                                    onPress={
                                        () => {
                                            navigation.navigate('Zonas', payload)
                                        }
                                    }
                                    right={props => <List.Icon {...props} icon="chevron-right" />}
                                />
                                {
                                    payload.speciality && payload.zone && <List.Item
                                        title="Mostrar actividades"
                                        left={props => <List.Icon {...props} icon="format-list-bulleted" />}
                                        onPress={
                                            () => {
                                                navigation.navigate('Actividades', payload)
                                            }
                                        }
                                    />
                                }
                            </List.Section>
                        </ScrollView>
                    </View>
            }
        </>
    );
}
export default BuildingSiteScreen;