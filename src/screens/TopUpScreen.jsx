import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard, Smartphone, Building } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const TopUpScreen = () => {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    const topUp = usePaystashStore((state) => state.topUp);

    const handleTopUp = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

        setLoading(true);
        // Mock API call simulation
        setTimeout(() => {
            topUp(amount);
            setLoading(false);
            alert('Top Up Successful!');
            navigation.goBack();
        }, 1500);
    };

    const PaymentMethod = ({ id, icon: Icon, label }) => (
        <TouchableOpacity
            style={[
                styles.methodBtn,
                method === id && styles.methodBtnActive,
            ]}
            onPress={() => setMethod(id)}
        >
            <Icon
                color={method === id ? THEME.COLORS.secondary : THEME.COLORS.textMuted}
                size={24}
            />
            <Text
                style={[
                    styles.methodLabel,
                    method === id && styles.methodLabelActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <Header showBack={true} title="Top Up Account" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.section}>
                        <Input
                            label="Amount to Add"
                            placeholder="0.00"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Payment Method</Text>
                        <View style={styles.methods}>
                            <PaymentMethod id="card" icon={CreditCard} label="Card" />
                            <PaymentMethod id="ussd" icon={Smartphone} label="USSD" />
                            <PaymentMethod id="bank" icon={Building} label="Bank" />
                        </View>
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.row}>
                            <Text style={styles.summaryText}>Amount</Text>
                            <Text style={styles.summaryValue}>₦{amount || '0.00'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.summaryText}>Fee</Text>
                            <Text style={styles.summaryValue}>₦0.00</Text>
                        </View>
                        <View style={[styles.row, styles.total]}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalValue}>₦{amount || '0.00'}</Text>
                        </View>
                    </View>

                    <Button
                        title="Pay with Interswitch"
                        onPress={handleTopUp}
                        loading={loading}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: THEME.SPACING.lg,
    },
    card: {
        backgroundColor: THEME.COLORS.bgCard,
        padding: THEME.SPACING.lg,
        borderRadius: THEME.RADIUS.lg,
        gap: THEME.SPACING.xl,
    },
    section: {
        gap: THEME.SPACING.sm,
    },
    label: {
        color: THEME.COLORS.text,
        fontFamily: THEME.FONTS.sans,
        fontSize: THEME.SIZES.sm,
        fontWeight: '500',
    },
    methods: {
        flexDirection: 'row',
        gap: THEME.SPACING.md,
    },
    methodBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: THEME.SPACING.md,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.RADIUS.md,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: THEME.SPACING.xs,
    },
    methodBtnActive: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        borderColor: THEME.COLORS.secondary,
    },
    methodLabel: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.xs,
        fontFamily: THEME.FONTS.sans,
    },
    methodLabelActive: {
        color: THEME.COLORS.secondary,
    },
    summary: {
        paddingTop: THEME.SPACING.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        gap: THEME.SPACING.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryText: {
        color: THEME.COLORS.textMuted,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
    },
    summaryValue: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.sm,
        fontFamily: THEME.FONTS.sans,
        fontWeight: '500',
    },
    total: {
        marginTop: THEME.SPACING.xs,
        paddingTop: THEME.SPACING.sm,
    },
    totalText: {
        color: THEME.COLORS.text,
        fontSize: THEME.SIZES.base,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    totalValue: {
        color: THEME.COLORS.secondary,
        fontSize: THEME.SIZES.xl,
        fontWeight: 'bold',
        fontFamily: THEME.FONTS.sans,
    },
    button: {
        marginTop: THEME.SPACING.sm,
    },
});

export default TopUpScreen;
