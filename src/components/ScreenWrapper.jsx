import React from 'react';
import {
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Platform,
} from 'react-native';
import { THEME } from '../constants/theme';

const ScreenWrapper = ({ children, style, withScrollView = false }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={THEME.COLORS.bg}
            />
            <View style={[styles.content, style]}>{children}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.COLORS.bg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
    },
});

export default ScreenWrapper;
