import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const usePaystashStore = create(
    persist(
        (set, get) => ({
            // State
            walletBalance: 5000.00, // Unified mock balance
            offlineBalance: 5000.00, // Sync with wallet for simulation
            isOffline: false,
            transactions: [
                {
                    id: 'tx_init_1',
                    title: 'Transfer to Sarah',
                    date: new Date().toISOString(), // Use ISO string for serializability
                    amount: -5000,
                    type: 'debit',
                    status: 'confirmed',
                },
            ],
            pendingSync: [],

            // Actions
            setOffline: (status) => set({ isOffline: status }),

            // --- Core Actions (Payer-Generated Flow) ---

            // Payer: Generates QR, Locks Funds
            generatePaymentCredential: (amount, recipientId) => {
                const state = get();
                const numericAmount = parseFloat(amount);

                if (state.isOffline && numericAmount > state.offlineBalance) {
                    // Offline balance check if applicable
                }

                if (numericAmount > state.availableBalance) {
                    // return { success: false, error: 'Insufficient balance' };
                    // For MVP demo, allowing it if walletBalance is enough, assuming walletBalance ~ availableBalance
                }
                // Strict check:
                if (numericAmount > state.walletBalance) {
                    return { success: false, error: 'Insufficient balance' };
                }


                // Lock Funds
                const newTransaction = {
                    id: Date.now().toString(),
                    type: 'debit',
                    title: `Payment to ${recipientId}`,
                    amount: -numericAmount,
                    date: new Date().toISOString(),
                    status: 'locked', // Payer waits for sync or scan
                    recipientId: recipientId
                };

                const payload = JSON.stringify({
                    type: 'paystash-payment',
                    id: newTransaction.id,
                    amount: numericAmount,
                    recipientId: recipientId,
                    payerId: 'user-payer-123', // In real app, from auth
                    expiresAt: Date.now() + 5 * 60 * 1000,
                    signature: 'mock-signature-valid'
                });

                set((state) => ({
                    walletBalance: state.walletBalance - numericAmount, // Deduct immediately
                    // lockedBalance: state.lockedBalance + numericAmount, // If we tracked locked separately
                    transactions: [newTransaction, ...state.transactions],
                    pendingSync: [...state.pendingSync, newTransaction.id]
                }));

                return { success: true, payload };
            },

            // Payer: Cancel generated QR (Unlock)
            cancelPaymentCredential: (txId) => {
                const state = get();
                const tx = state.transactions.find(t => t.id === txId);

                if (!tx || tx.status !== 'locked') return { success: false, error: 'Transaction not found or not locked' };

                const refundAmount = Math.abs(tx.amount);

                set((state) => ({
                    walletBalance: state.walletBalance + refundAmount,
                    transactions: state.transactions.filter(t => t.id !== txId), // Remove the locked tx or mark as cancelled
                    pendingSync: state.pendingSync.filter(id => id !== txId)
                }));
                return { success: true };
            },

            // Receiver: Scans Payer's QR
            processPaymentScan: (data) => {
                const state = get();
                const { amount, recipientId, id, type } = data;

                if (type !== 'paystash-payment') return { success: false, error: 'Invalid QR Type' };

                // Prevent processing same transaction twice locally
                if (state.transactions.find(t => t.id === id)) {
                    return { success: false, error: 'Transaction already processed' };
                }

                const newTransaction = {
                    id: id, // Use Payer's Tx ID for reconciliation match
                    type: 'credit',
                    title: `Payment from Payer`,
                    amount: parseFloat(amount),
                    date: new Date().toISOString(),
                    status: state.isOffline ? 'pending-sync' : 'finalized'
                };

                if (state.isOffline) {
                    // Offline: Add to Pending In (conceptually). For MVP, we might just add to visible balance but with 'pending-sync' status
                    set((state) => ({
                        // offlineBalance: state.offlineBalance + parseFloat(amount), // Offline receiving logic varies
                        transactions: [newTransaction, ...state.transactions],
                        pendingSync: [...state.pendingSync, id]
                    }));
                    return { success: true, status: 'offline' };

                } else {
                    // Online: Add to Available immediately (Simulate backend success)
                    set((state) => ({
                        walletBalance: state.walletBalance + parseFloat(amount),
                        transactions: [newTransaction, ...state.transactions],
                    }));
                    return { success: true, status: 'online' };
                }
            },

            receiveMoney: (amount, fromUser) => {
                const numAmount = parseFloat(amount);
                if (isNaN(numAmount) || numAmount <= 0) return { success: false, error: 'Invalid amount' };

                const state = get();
                // In a real app, this would verify the voucher signature with backend.
                // For now, we simulate success.

                const newTx = {
                    id: `tx_${Date.now()}`,
                    title: `Received from ${fromUser || 'Unknown'}`,
                    date: new Date().toISOString(),
                    amount: numAmount,
                    type: 'credit',
                    status: 'confirmed',
                };

                set((state) => ({
                    transactions: [newTx, ...state.transactions],
                    walletBalance: state.walletBalance + numAmount,
                    // If offline logic applies to receiving, handle it here.
                    // For now, assume receiving requires online or just updates local balance blindly.
                }));

                return { success: true };
            },

            addTransaction: (tx) => {
                const state = get();
                const isOffline = state.isOffline;

                // If offline and it's a debit, check/deduct offline balance
                if (isOffline && tx.type === 'debit') {
                    if (state.offlineBalance < Math.abs(tx.amount)) {
                        return { success: false, error: 'Insufficient offline balance' };
                    }
                    // Deduct from offline balance
                    set((state) => ({
                        offlineBalance: state.offlineBalance + tx.amount // amount is negative
                    }));
                }

                const newTx = {
                    ...tx,
                    id: tx.id || `tx_${Date.now()}`,
                    date: new Date().toISOString(),
                    status: isOffline ? 'pending-sync' : 'confirmed',
                };

                set((state) => ({
                    transactions: [newTx, ...state.transactions],
                    // Only update walletBalance if ONLINE. If Offline, we already updated offlineBalance above.
                    walletBalance: isOffline ? state.walletBalance : state.walletBalance + (newTx.amount || 0),
                    pendingSync: isOffline ? [...state.pendingSync, newTx.id] : state.pendingSync
                }));
                return { success: true };
            },

            // Sync logic
            processPendingSync: () => {
                set((state) => {
                    if (state.pendingSync.length === 0) return {};

                    const updatedTransactions = state.transactions.map(t =>
                        state.pendingSync.includes(t.id) ? { ...t, status: 'confirmed' } : t
                    );

                    // In a real app, we'd also sync with backend here.
                    // For now, we just mark them confirmed and clear the queue.
                    return {
                        transactions: updatedTransactions,
                        pendingSync: []
                    };
                });
            }
        }),
        {
            name: 'paystash-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
