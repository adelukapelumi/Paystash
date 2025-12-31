import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowDownLeft, Building } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const WithdrawScreen = () => {
    const navigation = useNavigation();
    const { walletBalance, addTransaction } = usePaystashStore();
    const [amount, setAmount] = useState('');
    const [accountName, setAccountName] = useState('John Doe'); // Mock pre-filled
    const [accountNumber, setAccountNumber] = useState('1234567890');
    const [bank, setBank] = useState('GTBank');
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Invalid amount');
            return;
        }

        if (parseFloat(amount) > walletBalance) {
            Alert.alert('Error', 'Insufficient balance');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            addTransaction({
                title: `Withdrawal to ${bank}`,
                amount: -parseFloat(amount),
                type: 'debit',
                status: 'confirmed' // In real app, might be 'pending'
            });

            setIsLoading(false);
            Alert.alert(
                'Success',
                `Withdrawal of ₦${parseFloat(amount).toLocaleString()} initiated.`,
                [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
            );
        }, 1500);
    };

    return (
        <ScreenWrapper>
            <Header title="Withdraw Funds" showBack={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>₦{walletBalance.toLocaleString()}</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Bank Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bank Name</Text>
                            <TextInput
                                style={styles.input}
                                value={bank}
                                onChangeText={setBank}
                                placeholder="Select Bank"
                                placeholderTextColor={THEME.COLORS.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Account Number</Text>
                            <TextInput
                                style={styles.input}
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                keyboardType="numeric"
                                placeholder="0000000000"
                                placeholderTextColor={THEME.COLORS.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Account Name</Text>
                            <TextInput
                                value={accountName}
                                editable={false} // Mock: Auto-fetched
                                style={[styles.input, { opacity: 0.7 }]}
                            />
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Amount (₦)</Text>
                            <TextInput
                                style={[styles.input, styles.amountInput]}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor={THEME.COLORS.textMuted}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleWithdraw}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Text style={styles.buttonText}>Processing...</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <ArrowDownLeft color="black" size={20} />
                                <Text style={styles.buttonText}>Withdraw Money</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
        paddingBottom: 40
    },
    balanceCard: {
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.lg,
        marginBottom: THEME.SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    balanceLabel: {
        color: THEME.COLORS.textMuted,
        marginBottom: THEME.SPACING.xs,
        fontFamily: THEME.FONTS.sans,
    },
    balanceAmount: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES['3xl'],
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    formSection: {
        marginBottom: THEME.SPACING.xl,
    },
    sectionTitle: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.md,
        fontWeight: '600',
        marginBottom: THEME.SPACING.md,
        fontFamily: THEME.FONTS.sans,
    },
    inputGroup: {
        marginBottom: THEME.SPACING.md,
    },
    label: {
        color: THEME.COLORS.textMuted,
        marginBottom: THEME.SPACING.xs,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
    },
    input: {
        backgroundColor: THEME.COLORS.bgCard,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: THEME.RADIUS.md,
        padding: THEME.SPACING.md,
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.md,
    },
    amountInput: {
        fontSize: THEME.SIZES.xl,
        fontWeight: 'bold',
        color: THEME.COLORS.primary,
    },
    button: {
        backgroundColor: THEME.COLORS.primary,
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: THEME.SIZES.md,
        fontFamily: THEME.FONTS.sans,
    }
});

export default WithdrawScreen;
