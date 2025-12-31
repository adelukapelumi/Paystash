import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    style,
    containerStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={THEME.COLORS.textMuted}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.SPACING.md,
    },
    label: {
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.sm,
        marginBottom: THEME.SPACING.xs,
        fontWeight: '500',
    },
    input: {
        backgroundColor: THEME.COLORS.bgCard,
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.base,
        paddingHorizontal: THEME.SPACING.md,
        paddingVertical: THEME.SPACING.sm + 4,
        borderRadius: THEME.RADIUS.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: THEME.COLORS.error,
    },
    errorText: {
        color: THEME.COLORS.error,
        fontSize: THEME.SIZES.xs,
        marginTop: THEME.SPACING.xs,
    },
});

export default Input;
