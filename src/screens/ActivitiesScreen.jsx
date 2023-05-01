import React, { useState, useCallback, useContext } from 'react';
import {
    ScrollView,
} from 'react-native';
import {
    Appbar,
    List,
    Searchbar
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StyleContext } from '../utils/StyleContext';

function ActivitiesScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const payload = route.params;

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [doSearch, setDoSearch] = useState(false);
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);

    const onChangeSearch = query => setSearchQuery(query);

    const handleActivitiesLoad = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            data.buildingSite = payload.buildingSite
            data.speciality = payload.speciality
            data.zone = payload.zone
            data.buildingSiteActivities = [];
            payload.activities.forEach(buildingSite => {
                if (buildingSite.id === data.buildingSite.id) {
                    buildingSite.areas.forEach(
                        area => {
                            data.zone.fk_area == area.id && area.zones.forEach(
                                zone => {
                                    data.zone.id == zone.id && zone.activities.forEach(
                                        activity => {
                                            data.zone.id == activity.fk_zone && data.buildingSiteActivities.push(activity);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            });
            setActivities(data.buildingSiteActivities);
            setFilteredActivities(data.buildingSiteActivities);
            unloadActivity();
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
        setLoading(false);
    }

    const unloadTemporalData = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            delete data.speciality;
            delete data.zone;
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
    }

    const unloadActivity = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            delete data.activity;
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
    }

    const unloadActivities = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            delete data.buildingSiteActivities;
            await AsyncStorage.setItem('@mydb', JSON.stringify(data))
        }
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            handleActivitiesLoad();
            unloadTemporalData();
            setLoading(false)
            return () => unloadActivities();

        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const filtered = activities.filter(activity => {
                //use activity.name or activity.activity_code to search
                return activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || activity.activity_code.toLowerCase().includes(searchQuery.toLowerCase())
            })
            setFilteredActivities(filtered)
        }, [searchQuery])

    );

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
                <Appbar.Content title="Actividades" color='white' />
                <Appbar.Action icon={doSearch ? 'close' : 'magnify'}
                    color='white'
                    onPress={
                        () => setDoSearch(!doSearch)}
                />
            </Appbar.Header>
            {
                doSearch && <Searchbar
                    placeholder="Buscar por nombre/código"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    icon={
                        searchQuery.length > 0 ?
                            'arrow-right' :
                            'magnify'
                    }
                    mode='view'
                />
            }
            <ScrollView>
                <List.Section>
                    {
                        filteredActivities.map((activity, index) => {
                            return (
                                <List.Item
                                    key={index}
                                    title={activity.activity_code}
                                    description={activity.name}
                                    left={props => <List.Icon {...props} icon="star" />}
                                    onPress={
                                        () => {
                                            navigation.navigate(
                                                {
                                                    name: 'Actividad',
                                                    params: {
                                                        ...payload,
                                                        activity: activity,
                                                        merge: true,
                                                    },
                                                }
                                            )
                                        }
                                    }
                                />
                            )
                        })
                    }
                </List.Section>
            </ScrollView>
        </>
    );
}
export default ActivitiesScreen;