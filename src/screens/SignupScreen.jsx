import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { THEME } from '../constants/theme';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        // Mock signup logic
        console.log('Signup data:', formData);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Dashboard');
        }, 1500);
    };

    return (
        <ScreenWrapper>
            <Header showBack={true} title="Sign Up" />
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the offline payment revolution.</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChangeText={(text) => handleChange('name', text)}
                    />
                    <Input
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        secureTextEntry
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        secureTextEntry
                    />

                    <Button
                        title="Create Account"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
        flex: 1,
    },
    headerSection: {
        marginBottom: THEME.SPACING.xl,
    },
    title: {
        fontSize: THEME.SIZES['2xl'],
        fontWeight: 'bold',
        color: THEME.COLORS.text,
        marginBottom: THEME.SPACING.sm,
        fontFamily: THEME.FONTS.sans,
    },
    subtitle: {
        fontSize: THEME.SIZES.base,
        color: THEME.COLORS.textMuted,
        fontFamily: THEME.FONTS.sans,
    },
    form: {
        gap: THEME.SPACING.md,
    },
    button: {
        marginTop: THEME.SPACING.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: THEME.SPACING.lg,
    },
    footerText: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
    },
    link: {
        color: THEME.COLORS.secondary,
        fontSize: THEME.SIZES.sm,
        fontWeight: '600',
        fontFamily: THEME.FONTS.sans,
    },
});

export default SignupScreen;
