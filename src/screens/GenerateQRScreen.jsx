import { Lock, XCircle } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const GenerateQRScreen = () => {
    const [amount, setAmount] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [qrValue, setQrValue] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentTxId, setCurrentTxId] = useState(null);
    const { generatePaymentCredential, cancelPaymentCredential, walletBalance } = usePaystashStore(); // Simply use walletBalance as THE balance

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiresAt - now;

            if (diff <= 0) {
                setQrValue(null);
                setExpiresAt(null);
                setTimeLeft('');
                Alert.alert('Expired', 'The QR code has expired.');
                clearInterval(interval);
                return;
            }

            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const handleGenerate = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        const currentBalance = walletBalance; // Single source of truth
        if (parseFloat(amount) > currentBalance) {

            Alert.alert('Error', `Insufficient balance. Available: ₦${currentBalance.toLocaleString()}`);
            return;
        }

        if (!recipientId.trim()) {
            Alert.alert('Error', 'Please enter Recipient ID');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmAndGenerate = () => {
        setShowConfirmation(false);
        const result = generatePaymentCredential(amount, recipientId);

        if (result.success) {
            const payloadObj = JSON.parse(result.payload);
            setQrValue(result.payload);
            setCurrentTxId(payloadObj.id);
            setExpiresAt(payloadObj.expiresAt);
        } else {
            Alert.alert('Error', result.error || 'Failed to generate QR');
        }
    };

    const handleNewCode = () => {
        // Just reset state to allow new generation.
        // Funds remain locked (stashed) for the previous transaction.
        setQrValue(null);
        setExpiresAt(null);
        setTimeLeft('');
        setCurrentTxId(null);
        setAmount('');
        setRecipientId('');
    };

    return (
        <ScreenWrapper>
            <Header title="Pay via QR" showBack={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {showConfirmation ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Confirm Transaction</Text>
                            <View style={styles.confirmationBox}>
                                <Text style={styles.confirmLabel}>Recipient:</Text>
                                <Text style={styles.confirmValue}>{recipientId}</Text>

                                <Text style={styles.confirmLabel}>Amount:</Text>
                                <Text style={styles.confirmValue}>₦{parseFloat(amount).toLocaleString()}</Text>

                                <View style={styles.warningBox}>
                                    <Text style={styles.warningText}>
                                        Note: Funds will be locked immediately after you proceed.
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={confirmAndGenerate}>
                                <Text style={styles.buttonText}>Proceed & Lock Funds</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => setShowConfirmation(false)}>
                                <Text style={styles.outlineButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : !qrValue ? (
                        <View style={styles.form}>
                            <Text style={styles.headerText}>Enter details to generate a payment code.</Text>

                            <View style={styles.balanceContainer}>
                                <View style={styles.balanceHeaderRow}>
                                    <View style={styles.iconContainer}>
                                        <Lock size={16} color={THEME.COLORS.primary} />
                                    </View>
                                    <Text style={styles.balanceLabel}>Available Balance</Text>
                                </View>
                                <Text style={styles.balanceValue}>
                                    ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                            </View>

                            <Text style={styles.label}>Amount to Pay</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                placeholderTextColor={THEME.COLORS.textMuted}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            <Text style={styles.label}>Recipient ID (Merchant)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Recipient ID"
                                placeholderTextColor={THEME.COLORS.textMuted}
                                value={recipientId}
                                onChangeText={setRecipientId}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity style={styles.button} onPress={handleGenerate}>
                                <Lock size={20} color={THEME.COLORS.primary} style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Generate Code</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.qrContainer}>
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={qrValue}
                                    size={200}
                                    color="black"
                                    backgroundColor="white"
                                />
                            </View>
                            <Text style={styles.lockedText}>
                                ₦{parseFloat(amount).toLocaleString()} STASHED (LOCKED)
                            </Text>
                            <Text style={styles.qrText}>
                                Show this to {recipientId}.
                            </Text>
                            <View style={styles.warningBox}>
                                <Text style={styles.warningText}>
                                    Money is stashed (locked). Confirm it was scanned.
                                </Text>
                            </View>

                            {timeLeft ? <Text style={styles.timerText}>Expires in: {timeLeft}</Text> : null}

                            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleNewCode}>
                                <Text style={styles.outlineButtonText}>Scanned? Create New Code</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: THEME.SPACING.lg,
    },
    headerText: {
        color: THEME.COLORS.textMuted,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.sm,
        marginBottom: THEME.SPACING.md,
    },
    form: {
        gap: THEME.SPACING.md,
    },
    label: {
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.sm,
        marginBottom: -THEME.SPACING.sm,
    },
    balanceContainer: {
        backgroundColor: '#1A1A1A', // Darker card background
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.lg,
        marginBottom: THEME.SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        gap: THEME.SPACING.sm,
    },
    balanceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.SPACING.sm,
    },
    iconContainer: {
        backgroundColor: 'rgba(52, 211, 153, 0.1)', // Primary color low opacity
        padding: 6,
        borderRadius: 20,
    },
    balanceLabel: {
        color: THEME.COLORS.textMuted,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.sm,
        fontWeight: '500',
    },
    balanceValue: {
        color: 'white',
        fontFamily: THEME.FONTS.sans,
        fontSize: 32, // Large and bold
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    input: {
        backgroundColor: THEME.COLORS.bgCard,
        borderRadius: THEME.RADIUS.md,
        padding: THEME.SPACING.md,
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    button: {
        backgroundColor: THEME.COLORS.secondary,
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.md,
        alignItems: 'center',
        marginTop: THEME.SPACING.md,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: THEME.COLORS.error,
    },
    buttonText: {
        color: THEME.COLORS.primary,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.md,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.md,
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: THEME.SPACING.lg,
    },
    qrWrapper: {
        padding: THEME.SPACING.xl,
        backgroundColor: 'white',
        borderRadius: THEME.RADIUS.lg,
    },
    qrText: {
        color: THEME.COLORS.textMuted,
        textAlign: 'center',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.md,
    },
    lockedText: {
        color: '#fbbf24', // Amber
        textAlign: 'center',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.xl,
        fontWeight: 'bold',
        marginTop: THEME.SPACING.sm,
    },
    timerText: {
        color: THEME.COLORS.text,
        textAlign: 'center',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.lg,
        fontWeight: 'bold',
        marginTop: -THEME.SPACING.sm,
    },
    confirmationBox: {
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.md,
        gap: THEME.SPACING.sm,
        marginTop: THEME.SPACING.sm,
    },
    confirmLabel: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
    },
    confirmValue: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.lg,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
        marginBottom: THEME.SPACING.sm,
    },
    warningBox: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.sm,
        marginTop: THEME.SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    warningText: {
        color: THEME.COLORS.warning,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
        textAlign: 'center',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: THEME.COLORS.secondary,
        marginTop: THEME.SPACING.md,
        padding: THEME.SPACING.md,
        borderRadius: THEME.RADIUS.md,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: THEME.COLORS.secondary,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.md,
    }
});


export default GenerateQRScreen;
