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

function BuildingSitesScreen({ route, navigation }) {

    const style = useContext(StyleContext);

    const payload = route.params
    const [loading, setLoading] = useState(false);
    const [buildingSitesData, setBuildingSiteData] = useState([]);
    const [activitiesData, setActivitiesData] = useState([]);

    const handleBuildingSiteData = async () => {
        let data = await AsyncStorage.getItem('@mydb')
        if (data) {
            data = JSON.parse(data)
            setBuildingSiteData(data.buildingSites)
            setActivitiesData(data.activities)
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
                <Appbar.BackAction onPress={() => {
                    navigation.navigate({
                        name: 'Inicio',
                        params: {
                            ...payload,
                        },
                        merge: true,
                    })
                }}
                    color='white'
                />
                <Appbar.Content title="Obras" color='white' />
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
                    :
                    <ScrollView>
                        <List.Section>
                            <List.Subheader>
                                Obras disponibles
                            </List.Subheader>
                            {
                                buildingSitesData.map((buildingSite, index) => {
                                    return (
                                        <List.Item
                                            style={{
                                                marginTop: 10,
                                            }}
                                            key={index}
                                            title={buildingSite.name}
                                            left={props => <List.Icon {...props} icon="domain" />}
                                            onPress={() => {
                                                navigation.navigate('Obra', {
                                                    ...payload,
                                                    buildingSites: buildingSitesData,
                                                    buildingSite: buildingSite,
                                                    activities: activitiesData,
                                                    merge: true,
                                                })
                                            }}
                                        />
                                    )
                                })
                            }
                        </List.Section>
                    </ScrollView>
            }
        </>
    );
}

export default BuildingSitesScreen;