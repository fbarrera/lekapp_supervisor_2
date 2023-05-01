import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Paragraph } from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  Button,
  Card,
  TextInput,
  ActivityIndicator,
  FAB,
  Portal,
  Dialog,
  List,
  Searchbar,
  Appbar
} from 'react-native-paper';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import BuildingSitesScreen from './src/screens/BuildingSitesScreen';
import BuildingSiteScreen from './src/screens/BuildingSiteScreen';
import SpecialitiesScreen from './src/screens/SpecialitiesScreen';
import ZonesScreen from './src/screens/ZonesScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import QRScreen from './src/screens/QRScreen';

const Stack = createNativeStackNavigator();
const stackTransitionConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

function App() {

  //AsyncStorage.clear();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Bienvenido" component={SignInScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Inicio" component={HomeScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Obras" component={BuildingSitesScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Obra" component={BuildingSiteScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Especialidades" component={SpecialitiesScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Zonas" component={ZonesScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Actividades" component={ActivitiesScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="Actividad" component={ActivityScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
        <Stack.Screen name="QR" component={QRScreen}
          options={{
            transitionSpec: {
              open: stackTransitionConfig,
              close: stackTransitionConfig,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;