import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { X, Camera } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import { THEME } from '../constants/theme';
import { usePaystashStore } from '../store/usePaystashStore';

const ScanQRScreen = () => {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const receiveMoney = usePaystashStore((state) => state.receiveMoney);
    // New Action for Receiver
    const processPaymentScan = usePaystashStore((state) => state.processPaymentScan);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);

        try {
            const parsedData = JSON.parse(data);

            if (parsedData.type === 'paystash-payment') { // Receiver Scanning Payer's Payment

                const result = processPaymentScan(parsedData);

                if (result.success) {
                    if (result.status === 'online') {
                        Alert.alert(
                            "Payment Received",
                            `₦${parsedData.amount.toLocaleString()} received from Payer to pending balance (Simulated Online).`,
                            [{ text: "OK", onPress: () => navigation.navigate('Dashboard') }]
                        );
                    } else {
                        Alert.alert(
                            "Offline Payment Received",
                            `₦${parsedData.amount.toLocaleString()} added to Pending Balance. Will finalize when online.`,
                            [{ text: "OK", onPress: () => navigation.navigate('Dashboard') }]
                        );
                    }
                } else {
                    Alert.alert(
                        "Error Processing Payment",
                        result.error || "Unknown error",
                        [{ text: "OK", onPress: () => setScanned(false) }]
                    );
                }

            } else {
                Alert.alert(
                    "Invalid QR Code",
                    "This is not a Paystash Payment QR.",
                    [{ text: "OK", onPress: () => setScanned(false) }]
                );
            }
        } catch (e) {
            Alert.alert(
                "Read Error",
                "Could not parse QR code data.",
                [{ text: "OK", onPress: () => setScanned(false) }]
            );
        }
    };
    // Removed old handler functions as logic is now inline or in store


    // 5. Removed legacy processPayment functions

    return (
        <View style={styles.container}>
            {!scanned ? (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                                <X color="white" size={24} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Receive Payment</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <View style={styles.scanArea}>
                            <View style={styles.scanFrame} />
                            <Text style={styles.instruction}>Align QR code within the frame</Text>
                        </View>

                        <View style={styles.footer}>
                            <Camera color="white" size={32} />
                            <Text style={styles.footerText}>Camera Active</Text>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.processing}>
                    <Text style={styles.processingText}>Processing...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white'
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    scanArea: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: THEME.COLORS.secondary,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    instruction: {
        color: 'white',
        marginTop: 20,
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    footerText: {
        color: 'white',
        marginTop: 10,
    },
    processing: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.COLORS.bgCard
    },
    processingText: {
        color: THEME.COLORS.text,
        fontSize: 18
    }
});

export default ScanQRScreen;
