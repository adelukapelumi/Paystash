import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, Plus, Wifi, WifiOff, Eye, EyeOff } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    // Connect to store
    const {
        walletBalance,
        isOffline,
        transactions,
    } = usePaystashStore();

    const toggleBalanceVisibility = () => {
        setIsBalanceVisible(!isBalanceVisible);
    };

    const ActionCard = ({ icon: Icon, label, onPress }) => (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
            <View style={styles.actionIcon}>
                <Icon color={THEME.COLORS.secondary} size={24} />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const TransactionItem = ({ title, date, amount, status }) => {
        const isPending = status === 'pending-sync';
        const isCredit = parseFloat(amount) > 0;

        return (
            <View style={styles.transactionItem}>
                <View style={[
                    styles.transactionIcon,
                    isPending && { backgroundColor: 'rgba(255, 193, 7, 0.1)' }
                ]}>
                    <ArrowUpRight
                        color={isPending ? THEME.COLORS.warning : THEME.COLORS.text}
                        size={16}
                    />
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{title}</Text>
                    <View style={styles.dateRow}>
                        <Text style={styles.transactionDate}>
                            {new Date(date).toLocaleDateString()}
                        </Text>
                        {isPending && (
                            <View style={styles.pendingBadge}>
                                <Text style={styles.pendingText}>Pending Sync</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Text style={[
                    styles.transactionAmount,
                    isCredit && { color: THEME.COLORS.success }
                ]}>
                    {isBalanceVisible
                        ? (amount < 0 ? '-' : '+') + '₦' + Math.abs(amount).toLocaleString()
                        : '****'}
                </Text>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <Header showLogo={true} />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Network Status Indicator */}
                <View style={styles.modeToggle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {isOffline ? <WifiOff size={16} color={THEME.COLORS.textMuted} /> : <Wifi size={16} color={THEME.COLORS.secondary} />}
                        <Text style={styles.modeText}>
                            {isOffline ? 'Offline Mode' : 'Online Mode'}
                        </Text>
                    </View>
                    {isOffline && (
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Disconnected</Text>
                        </View>
                    )}
                </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.balanceLabel}>Available Balance</Text>
                            <TouchableOpacity onPress={toggleBalanceVisibility}>
                                {isBalanceVisible ?
                                    <EyeOff color={THEME.COLORS.textMuted} size={16} /> :
                                    <Eye color={THEME.COLORS.textMuted} size={16} />
                                }
                            </TouchableOpacity>
                        </View>
                        <Wallet color={THEME.COLORS.secondary} size={20} />
                    </View>
                    <Text style={styles.balanceAmount}>
                        {isBalanceVisible ?
                            `₦${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                            '₦ ****'}
                    </Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsGrid}>
                    <ActionCard icon={QrCode} label="Scan QR" onPress={() => navigation.navigate('ScanQR')} />
                    <ActionCard icon={ArrowUpRight} label="Generate QR" onPress={() => navigation.navigate('GenerateQR')} />
                    <ActionCard icon={ArrowDownLeft} label="Withdraw" onPress={() => navigation.navigate('Withdraw')} />
                    <ActionCard icon={Plus} label="Top Up" onPress={() => navigation.navigate('TopUp')} />
                </View>

                {/* Recent Transactions */}
                <View style={styles.transactionsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {transactions.length === 0 ? (
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    ) : (
                        <View style={styles.transactionList}>
                            {transactions.slice(0, 5).map((tx) => (
                                <TransactionItem
                                    key={tx.id}
                                    title={tx.title}
                                    date={tx.date}
                                    amount={tx.amount}
                                    status={tx.status}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
    },
    modeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.SPACING.md,
        gap: THEME.SPACING.sm,
    },
    modeText: {
        color: THEME.COLORS.textMuted,
        fontFamily: THEME.FONTS.sans,
    },
    balanceCard: {
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.lg,
        marginBottom: THEME.SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(100, 255, 218, 0.1)',
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.SPACING.sm,
    },
    balanceLabel: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
    },
    balanceAmount: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES['3xl'],
        fontWeight: 'bold',
        marginBottom: THEME.SPACING.md,
        fontFamily: THEME.FONTS.sans,
    },
    balanceFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: THEME.SPACING.sm,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.SPACING.md,
        marginBottom: THEME.SPACING.xl,
    },
    actionCard: {
        width: '47%', // Roughly half minus gap
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        marginBottom: THEME.SPACING.sm,
        padding: THEME.SPACING.sm,
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        borderRadius: THEME.RADIUS.full,
    },
    actionLabel: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.sm,
        fontWeight: '500',
        fontFamily: THEME.FONTS.sans,
    },
    transactionsSection: {
        marginBottom: THEME.SPACING.xl,
    },
    sectionTitle: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.lg,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.SPACING.md,
    },
    viewAllText: {
        color: THEME.COLORS.secondary,
        fontSize: THEME.SIZES.sm,
        fontWeight: '600',
        fontFamily: THEME.FONTS.sans,
    },
    transactionList: {
        gap: THEME.SPACING.sm,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.md,
    },
    transactionIcon: {
        padding: THEME.SPACING.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.RADIUS.full,
        marginRight: THEME.SPACING.md,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.sm,
        fontWeight: '500',
        marginBottom: 2,
        fontFamily: THEME.FONTS.sans,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    transactionDate: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.xs,
        fontFamily: THEME.FONTS.sans,
    },
    pendingBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4
    },
    pendingText: {
        color: THEME.COLORS.warning,
        fontSize: 10,
        fontWeight: 'bold'
    },
    transactionAmount: {
        color: THEME.COLORS.text,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    emptyText: {
        color: THEME.COLORS.textMuted,
        fontStyle: 'italic',
        marginTop: 10
    },
    statusBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: THEME.COLORS.warning,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    }
});

export default DashboardScreen;
