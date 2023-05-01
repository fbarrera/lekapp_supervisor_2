import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import { ThemeContext } from './src/utils/ThemeContext';
import { StyleContext } from './src/utils/StyleContext';
import { GlobalDataContext } from './src/utils/GlobalDataContext';

if (__DEV__) {
    import('./src/tools/ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

export default function Main() {

    const theme = {
        "colors": {
            "primary": "rgb(230, 120, 0)",
            "onPrimary": "rgb(255, 255, 255)",
            "primaryContainer": "rgb(255, 221, 183)",
            "onPrimaryContainer": "rgb(42, 23, 0)",
            "secondary": "rgb(112, 91, 65)",
            "onSecondary": "rgb(255, 255, 255)",
            "secondaryContainer": "rgb(252, 222, 188)",
            "onSecondaryContainer": "rgb(40, 24, 5)",
            "tertiary": "rgb(83, 100, 62)",
            "onTertiary": "rgb(255, 255, 255)",
            "tertiaryContainer": "rgb(214, 233, 185)",
            "onTertiaryContainer": "rgb(18, 31, 3)",
            "error": "rgb(186, 26, 26)",
            "onError": "rgb(255, 255, 255)",
            "errorContainer": "rgb(255, 218, 214)",
            "onErrorContainer": "rgb(65, 0, 2)",
            "background": "rgb(255, 251, 255)",
            "onBackground": "rgb(31, 27, 22)",
            "surface": "rgb(255, 251, 255)",
            "onSurface": "rgb(31, 27, 22)",
            "surfaceVariant": "rgb(240, 224, 208)",
            "onSurfaceVariant": "rgb(80, 69, 57)",
            "outline": "rgb(130, 117, 104)",
            "outlineVariant": "rgb(212, 196, 181)",
            "shadow": "rgb(0, 0, 0)",
            "scrim": "rgb(0, 0, 0)",
            "inverseSurface": "rgb(53, 47, 42)",
            "inverseOnSurface": "rgb(249, 239, 231)",
            "inversePrimary": "rgb(255, 185, 92)",
            "elevation": {
                "level0": "transparent",
                "level1": "rgb(249, 243, 242)",
                "level2": "rgb(245, 238, 235)",
                "level3": "rgb(242, 233, 227)",
                "level4": "rgb(240, 231, 224)",
                "level5": "rgb(238, 228, 219)"
            },
            "surfaceDisabled": "rgba(31, 27, 22, 0.12)",
            "onSurfaceDisabled": "rgba(31, 27, 22, 0.38)",
            "backdrop": "rgba(56, 47, 36, 0.4)"
        }
    }

    const style = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        card_and_info: {
            flex: 1,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
        button: {
            margin: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        listItem: {
            marginTop: 10,
            backgroundColor: "white",
        },
        appbar: {
            backgroundColor: theme.colors.primary,
            color: 'white',
        },
    });

    const globalData = {
        baseURL: 'https://app.lekapp.cl'
    }

    return (
        <PaperProvider theme={theme}>
            <ThemeContext.Provider value={theme}>
                <StyleContext.Provider value={style}>
                    <GlobalDataContext.Provider value={globalData}>
                        <App />
                    </GlobalDataContext.Provider>
                </StyleContext.Provider>
            </ThemeContext.Provider>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);