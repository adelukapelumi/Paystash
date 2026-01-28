import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = usePaystashStore();
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            // Navigation handled by auth state listener usually, or manual:
            navigation.navigate('Dashboard');
        } catch (error) {
            alert(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const testNetwork = async () => {
        try {
            console.log('Testing Google...');
            const google = await fetch('https://www.google.com', { method: 'HEAD' });
            alert(`Google Reachable: ${google.status}`);

            console.log('Testing Supabase...');
            const sb = await fetch('https://snrqcbdsrvqsozagvlqx.supabase.co', { method: 'HEAD' });
            alert(`Supabase Reachable: ${sb.status}`);
        } catch (e) {
            alert(`Network Test Failed: ${e.message}`);
        }
    };

    return (
        <ScreenWrapper>
            <Header showBack={true} title="Login" />
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to access your offline wallet.</Text>
                </View>

                <View style={styles.form}>
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

                    <Button
                        title="Log In"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.link}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                    <Button title="Test Network Connection" onPress={testNetwork} variant="outline" style={{ marginTop: 20 }} />
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

export default LoginScreen;
