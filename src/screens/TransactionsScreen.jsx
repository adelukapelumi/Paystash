import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowUpRight, Filter } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const TransactionsScreen = () => {
    const { transactions } = usePaystashStore();

    const TransactionItem = ({ item }) => {
        const isPending = item.status === 'pending-sync';
        const isCredit = parseFloat(item.amount) > 0;

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
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <View style={styles.dateRow}>
                        <Text style={styles.transactionDate}>
                            {new Date(item.date).toLocaleString()}
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
                    {item.amount < 0 ? '-' : '+'}₦{Math.abs(item.amount).toLocaleString()}
                </Text>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <Header title="Transaction History" showBack={true} />
            <View style={styles.content}>

                {/* Optional: Filter Bar could go here */}
                {/* <View style={styles.filterBar}> ... </View> */}

                {transactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <TransactionItem item={item} />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: THEME.SPACING.lg,
    },
    listContent: {
        paddingVertical: THEME.SPACING.md,
        gap: THEME.SPACING.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: THEME.COLORS.textMuted,
        fontStyle: 'italic',
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
});

export default TransactionsScreen;
