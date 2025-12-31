import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Header from '../components/Header';
import { THEME } from '../constants/theme';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper>
            <Header showLogo={true} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroSection}>
                    <Text style={styles.title}>
                        Payments without <Text style={styles.highlight}>internet</Text>.
                        {'\n'}Anytime. Anywhere.
                    </Text>
                    <Text style={styles.subtitle}>
                        The first offline-first digital wallet. Send money, pay merchants, and manage your finances without a data connection.
                    </Text>

                    <View style={styles.buttonGroup}>
                        <Button
                            title="Get Started"
                            onPress={() => navigation.navigate('Signup')}
                            style={styles.button}
                        />
                        <Button
                            title="Log In"
                            variant="outline"
                            onPress={() => navigation.navigate('Login')}
                            style={styles.button}
                        />
                    </View>
                </View>

                <View style={styles.featureSection}>
                    <Text style={styles.sectionTitle}>Why PayStash?</Text>
                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>Offline First</Text>
                        <Text style={styles.featureText}>
                            No internet? No problem. PayStash works using secure QR codes and Bluetooth technology.
                        </Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>Secure</Text>
                        <Text style={styles.featureText}>
                            Bank-grade encryption ensures your money is safe, even when you're offline.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
    },
    heroSection: {
        marginBottom: THEME.SPACING['2xl'],
        alignItems: 'center',
    },
    title: {
        fontSize: THEME.SIZES['3xl'],
        fontWeight: 'bold',
        color: THEME.COLORS.text,
        textAlign: 'center',
        marginBottom: THEME.SPACING.md,
        fontFamily: THEME.FONTS.sans,
    },
    highlight: {
        color: THEME.COLORS.secondary,
    },
    subtitle: {
        fontSize: THEME.SIZES.base,
        color: THEME.COLORS.textMuted,
        textAlign: 'center',
        marginBottom: THEME.SPACING.xl,
        lineHeight: 24,
        fontFamily: THEME.FONTS.sans,
    },
    buttonGroup: {
        width: '100%',
        gap: THEME.SPACING.md,
    },
    button: {
        width: '100%',
    },
    featureSection: {
        marginTop: THEME.SPACING.lg,
    },
    sectionTitle: {
        fontSize: THEME.SIZES.xl,
        fontWeight: 'bold',
        color: THEME.COLORS.text,
        marginBottom: THEME.SPACING.md,
        fontFamily: THEME.FONTS.sans,
    },
    featureCard: {
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.md,
        marginBottom: THEME.SPACING.md,
    },
    featureTitle: {
        fontSize: THEME.SIZES.lg,
        fontWeight: '600',
        color: THEME.COLORS.secondary,
        marginBottom: THEME.SPACING.sm,
        fontFamily: THEME.FONTS.sans,
    },
    featureText: {
        fontSize: THEME.SIZES.sm,
        color: THEME.COLORS.textMuted,
        lineHeight: 20,
        fontFamily: THEME.FONTS.sans,
    },
});

export default HomeScreen;
