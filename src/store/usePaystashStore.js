import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from '../services/CryptoService';

export const usePaystashStore = create(
    persist(
        (set, get) => ({
            // State
            walletBalance: 5000.00, // Unified mock balance
            offlineBalance: 5000.00, // Sync with wallet for simulation
            isOffline: false,
            isSyncing: false,
            keys: null, // { publicKey, secretKey }
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
            setSyncing: (status) => set({ isSyncing: status }),

            initKeys: async () => {
                const keys = await CryptoService.getOrCreateKeyPair();
                set({ keys });
            },

            // --- Core Actions (Payer-Generated Flow) ---

            // Payer: Generates QR, Locks Funds
            generatePaymentCredential: (amount, recipientId) => {
                const state = get();
                const numericAmount = parseFloat(amount);

                if (!state.keys) {
                    return { success: false, error: 'Security Keys not initialized. Restart App.' };
                }

                if (state.isOffline && numericAmount > state.offlineBalance) {
                    // Offline balance check if applicable
                }

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

                const transactionData = {
                    type: 'paystash-payment',
                    id: newTransaction.id,
                    amount: numericAmount,
                    recipientId: recipientId,
                    payerId: 'user-payer-123', // In real app, from auth
                    expiresAt: Date.now() + 5 * 60 * 1000,
                    payerPublicKey: state.keys.publicKey // Embed Public Key for Self-Contained Verification
                };

                // Sign the Data
                const signature = CryptoService.sign(transactionData, state.keys.secretKey);

                const finalPayload = JSON.stringify({
                    data: transactionData,
                    signature: signature
                });

                set((state) => ({
                    walletBalance: state.walletBalance - numericAmount, // Deduct immediately
                    // lockedBalance: state.lockedBalance + numericAmount, // If we tracked locked separately
                    transactions: [newTransaction, ...state.transactions],
                    pendingSync: [...state.pendingSync, newTransaction.id]
                }));

                return { success: true, payload: finalPayload };
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
            processPaymentScan: (scannedPayload) => {
                const state = get();

                let parsedPayload;
                try {
                    parsedPayload = typeof scannedPayload === 'string' ? JSON.parse(scannedPayload) : scannedPayload;
                } catch (e) {
                    return { success: false, error: 'Invalid QR Format' };
                }

                const { data, signature } = parsedPayload;

                if (!data || !signature || data.type !== 'paystash-payment') {
                    return { success: false, error: 'Invalid Payment QR' };
                }

                // Verify Signature
                const isValid = CryptoService.verify(data, signature, data.payerPublicKey);

                if (!isValid) {
                    return { success: false, error: 'SECURITY ALERT: Payment Signature Invalid! Data may have been tampered with.' };
                }

                const { amount, id } = data;

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
                // ... (Legacy direct receive, kept for compatibility if needed, or can be deprecated)
                const numAmount = parseFloat(amount);
                // ... logic ...
                return { success: true };
            },

            // ... (Rest of sync logic)
            // Sync logic
            processPendingSync: async () => { // Async for simulation
                const state = get();
                if (state.pendingSync.length === 0) return;

                set({ isSyncing: true });

                // Simulate Network Delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                set((state) => {
                    const updatedTransactions = state.transactions.map(t =>
                        state.pendingSync.includes(t.id) ? { ...t, status: 'confirmed' } : t
                    );

                    return {
                        transactions: updatedTransactions,
                        pendingSync: [],
                        isSyncing: false
                    };
                });
            }
        }),
        {
            name: 'paystash-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.initKeys();
            }
        }
    )
);
