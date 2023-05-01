import React, { useState, useCallback, useContext } from 'react';
import {
    ScrollView,
} from 'react-native';
import {
    Appbar,
    List,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleContext } from '../utils/StyleContext';

function ZonesScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const payload = route.params;

    const handleSelection = async (zone) => {

        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            data.zone = zone
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
        navigation.navigate(
            {
                name: 'Obra',
                params: {
                    ...payload,
                    zone: zone,
                },
                merge: true,
            }
        )
    }

    const deleteSelection = async () => {
        delete payload.zone;
        await AsyncStorage.setItem('@mydb', JSON.stringify(payload))
        navigation.navigate(
            {
                name: 'Obra',
                params: {
                    ...payload
                },
                merge: true,
            }
        )
    }

    return (
        <>
            <Appbar.Header style={style.appbar}>
                <Appbar.BackAction onPress={() => {
                    navigation.navigate({
                        name: 'Obra',
                        params: {
                            ...payload,
                        },
                        merge: true,
                    })
                }}
                    color='white'
                />
                <Appbar.Content title="Zonas" color='white' />
            </Appbar.Header>
            <ScrollView>
                <List.Section>
                    {
                        payload.zone && <List.Item
                            title={'Borrar selección'}
                            left={props => <List.Icon {...props} icon="close" />}
                            onPress={deleteSelection}
                            titleNumberOfLines={3}
                        />
                    }
                    {
                        payload.buildingSite.areas.map((area, index) => {
                            return (
                                <List.Accordion
                                    key={index}
                                    title={area.name}
                                    left={props => <List.Icon {...props} icon="map-marker-radius" />}
                                >
                                    {
                                        area.zones.map((zone, index) => {
                                            return (
                                                <List.Item
                                                    key={index}
                                                    title={zone.name}
                                                    left={props => <List.Icon {...props} icon="map-marker" />}
                                                    onPress={
                                                        () => {
                                                            handleSelection(zone)
                                                        }
                                                    }
                                                    titleNumberOfLines={3}
                                                />
                                            )
                                        })
                                    }
                                </List.Accordion>
                            )
                        })
                    }
                </List.Section>
            </ScrollView>
        </>
    );
}
export default ZonesScreen;