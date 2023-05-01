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

function SpecialitiesScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const payload = route.params;

    const handleSelection = async (speciality) => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            data.speciality = speciality
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
        navigation.navigate(
            {
                name: 'Obra',
                params: {
                    ...payload,
                    speciality: speciality,
                },
                merge: true,
            }
        )
    }

    const deleteSelection = async () => {
        delete payload.speciality;
        await AsyncStorage.setItem('@mydb', JSON.stringify(payload))
        navigation.navigate(
            {
                name: 'Obra',
                params: {
                    ...payload
                },
                merge: true,
            });
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
                <Appbar.Content title="Especialidades" color='white' />
            </Appbar.Header>
            <ScrollView>
                <List.Section>
                    {
                        payload.speciality && <List.Item
                            title={'Borrar selección'}
                            left={props => <List.Icon {...props} icon="close" />}
                            onPress={deleteSelection}
                            titleNumberOfLines={3}
                        />
                    }
                    {
                        payload.buildingSite.specialities.map((speciality, index) => {
                            return (
                                <List.Item
                                    key={index}
                                    title={speciality.name}
                                    left={props => <List.Icon {...props} icon="account-hard-hat" />}
                                    onPress={
                                        () => {
                                            handleSelection(speciality)
                                        }
                                    }
                                    titleNumberOfLines={3}
                                />
                            )
                        })
                    }
                </List.Section>
            </ScrollView>
        </>
    );
}
export default SpecialitiesScreen;