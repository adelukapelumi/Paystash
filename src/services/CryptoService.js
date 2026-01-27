import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PAIR_STORAGE_KEY = 'paystash_keypair';

export const CryptoService = {
    /**
     * Generate or Retrieve the User's Key Pair
     * @returns {Promise<{publicKey: string, secretKey: string}>} Base64 encoded keys
     */
    getOrCreateKeyPair: async () => {
        try {
            const storedKeys = await AsyncStorage.getItem(KEY_PAIR_STORAGE_KEY);
            if (storedKeys) {
                return JSON.parse(storedKeys);
            }

            // Generate new keys
            const keyPair = nacl.sign.keyPair();
            const keys = {
                publicKey: util.encodeBase64(keyPair.publicKey),
                secretKey: util.encodeBase64(keyPair.secretKey)
            };

            await AsyncStorage.setItem(KEY_PAIR_STORAGE_KEY, JSON.stringify(keys));
            return keys;
        } catch (error) {
            console.error('CryptoService: Key Generation Failed', error);
            throw error;
        }
    },

    /**
     * Sign a data object
     * @param {Object} data - The data to sign
     * @param {string} secretKeyBase64 - The signer's secret key
     * @returns {string} The signature in Base64
     */
    sign: (data, secretKeyBase64) => {
        try {
            const secretKey = util.decodeBase64(secretKeyBase64);
            const messageUint8 = util.decodeUTF8(JSON.stringify(data));
            const signature = nacl.sign.detached(messageUint8, secretKey);
            return util.encodeBase64(signature);
        } catch (error) {
            console.error('CryptoService: Signing Failed', error);
            throw error;
        }
    },

    /**
     * Verify a signature
     * @param {Object} data - The original data object
     * @param {string} signatureBase64 - The signature to verify
     * @param {string} publicKeyBase64 - The signer's public key
     * @returns {boolean} True if valid
     */
    verify: (data, signatureBase64, publicKeyBase64) => {
        try {
            const publicKey = util.decodeBase64(publicKeyBase64);
            const signature = util.decodeBase64(signatureBase64);
            const messageUint8 = util.decodeUTF8(JSON.stringify(data));

            return nacl.sign.detached.verify(messageUint8, signature, publicKey);
        } catch (error) {
            console.error('CryptoService: Verification Failed', error);
            return false;
        }
    }
};
