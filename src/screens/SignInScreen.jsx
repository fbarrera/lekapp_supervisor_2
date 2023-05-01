import React, { useState, useCallback, useContext } from 'react';
import { GlobalDataContext } from '../utils/GlobalDataContext';
import { StyleContext } from '../utils/StyleContext';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text } from 'react-native';
import {
    Button,
    Card,
    TextInput,
    ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function SignInScreen({ navigation }) {

    const globalData = useContext(GlobalDataContext);
    const style = useContext(StyleContext);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleUserEmailChange = (text) => {
        setUserEmail(text);
    }

    const handleUserPasswordChange = (text) => {
        setUserPassword(text);
    }

    const handleLogin = async () => {

        setLoading(true)

        let endpoint = '/app/authentication/sign-in'
        let url = globalData.baseURL + endpoint

        if (userEmail === '' || userPassword === '') {
            alert('Por favor, ingresa tu usuario y contraseña')
            return
        }

        let data = {
            "userEmail": userEmail,
            "userPassword": userPassword,
            "signon-type": "overseer"
        }

        await axios.post(
            url,
            data
        ).catch(
            (error) => {
                alert('Error al iniciar sesión')
            }
        ).then(
            async (backData) => {
                if (backData && backData.status === 200) {
                    await AsyncStorage.setItem('user_data', JSON.stringify(backData.data))
                    await handleUserData(backData.data.user_data)
                    navigation.navigate('Inicio', { ...backData.data.user_data })
                }
            }
        )

    }

    const handleUserData = async (user_data) => {

        let endpoint = '/app/building-site/set-data'
        let url = globalData.baseURL + endpoint

        let data = {
            "user_data": user_data
        };
        await axios.post(
            url,
            data
        ).catch(
            (error) => {
                alert('Error al cargar información')
            }
        ).then(
            async (backData) => {
                if (backData && backData.status === 200) {
                    await AsyncStorage.setItem('@mydb', JSON.stringify(backData.data))
                }
            }
        ).finally(
            async () => {
                setLoading(false)
            }
        )

    }

    const handleCredentialLoad = async () => {
        let user_data = await AsyncStorage.getItem('user_data')
        if (user_data) {
            let userCredentials = JSON.parse(user_data)
            userCredentials = userCredentials.user_data

            let myActivities = await AsyncStorage.getItem('@myActivities');
            if (!myActivities) {
                await AsyncStorage.setItem('@myActivities', JSON.stringify({}));
            }

            navigation.navigate('Inicio', { ...userCredentials })
        }
    }

    useFocusEffect(
        useCallback(() => {
            handleCredentialLoad()
            return () => {
            }
        }, [])
    );

    return (
        <>
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
                </View> : <View style={style.container}>
                    <Card
                        style={{
                            width: '90%',
                            elevation: 1
                        }}

                    >
                        <Card.Title title="Acceso" subtitle="Ingresa tu nombre de usuario y contraseña" />
                        <Card.Content>
                            <TextInput label="Usuario" value={userEmail}
                                onChangeText={handleUserEmailChange}
                            />
                            <TextInput
                                label="Contraseña"
                                value={userPassword}
                                onChangeText={handleUserPasswordChange}
                                secureTextEntry={secureTextEntry}
                                right={<TextInput.Icon icon={
                                    secureTextEntry ? 'eye' : 'eye-off'
                                } onPress={
                                    () => {
                                        setSecureTextEntry(!secureTextEntry)
                                    }
                                } />}
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained"
                                onPress={handleLogin}
                            >Ingresar
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
            }

        </>
    );
}

export default SignInScreen;