import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QrCode, ArrowLeft, WifiOff, RefreshCw } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const Header = ({ title, showBack = false, showLogo = true }) => {
    const navigation = useNavigation();
    const { isOffline, isSyncing } = usePaystashStore();

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

            <View style={styles.right}>
                {isSyncing ? (
                    <View style={[styles.badge, styles.syncBadge]}>
                        <ActivityIndicator size="small" color={THEME.COLORS.secondary} />
                    </View>
                ) : isOffline ? (
                    <View style={[styles.badge, styles.offlineBadge]}>
                        <WifiOff size={14} color="white" />
                        <Text style={styles.badgeText}>Offline</Text>
                    </View>
                ) : null}
            </View>
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
        width: 60, // Increased width for back button
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 60, // Increased width to match left
        alignItems: 'flex-end',
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
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    offlineBadge: {
        backgroundColor: THEME.COLORS.error,
    },
    syncBadge: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        padding: 6,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
});

export default Header;
