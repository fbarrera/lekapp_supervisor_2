

import React, { useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleContext } from '../utils/StyleContext';

function TemplateScreen({ route, navigation }) {

    const style = useContext(StyleContext);
    const payload = route.params;

    useFocusEffect(
        useCallback(() => {

            return () => { };
        }, [])
    );

    return (
        <></>
    );
}

export default TemplateScreen;