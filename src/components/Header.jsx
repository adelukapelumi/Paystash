import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QrCode, ArrowLeft } from 'lucide-react-native';
import { THEME } from '../constants/theme';

const Header = ({ title, showBack = false, showLogo = true }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft color={THEME.COLORS.text} size={24} />
                    </TouchableOpacity>
                )}
                {showLogo && !showBack && (
                    <View style={styles.logoContainer}>
                        <QrCode color={THEME.COLORS.secondary} size={24} />
                    </View>
                )}
            </View>

            <View style={styles.center}>
                {title ? (
                    <Text style={styles.title}>{title}</Text>
                ) : (
                    showLogo && <Text style={styles.logoText}>PayStash</Text>
                )}
            </View>

            <View style={styles.right} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.SPACING.md,
        paddingVertical: THEME.SPACING.md,
        backgroundColor: THEME.COLORS.bg,
        borderBottomWidth: 1,
        borderBottomColor: THEME.COLORS.bgCard,
    },
    left: {
        width: 40,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 40,
    },
    backButton: {
        padding: 4,
    },
    logoContainer: {
        padding: 4,
    },
    title: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.lg,
        fontWeight: '600',
        fontFamily: THEME.FONTS.sans,
    },
    logoText: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.xl,
        fontWeight: '700',
        fontFamily: THEME.FONTS.sans,
        marginLeft: THEME.SPACING.xs,
    },
});

export default Header;
