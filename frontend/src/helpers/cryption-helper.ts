import sodium from 'libsodium-wrappers-sumo';

export const useCryptionHelper = () => {
  const encrypt = async (plaintext: string) => {
    const key = sodium.from_hex(import.meta.env.VITE_PASSWORD);
    await sodium.ready;
    try {
        const iv = sodium.randombytes_buf(12);
        const assocData = sodium.randombytes_buf(16);

        const cipherText = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
            sodium.from_string(plaintext),
            assocData,
            null,
            iv,
            key
        );

        return sodium.to_hex(iv) + sodium.to_hex(assocData) + sodium.to_hex(cipherText);
    } catch (e) {
        console.error('Encryption failed:', e);
        return '';
    }
};

const decrypt = async (cipherText: string) => {
    const key = sodium.from_hex(import.meta.env.VITE_PASSWORD);
    await sodium.ready;
    try {
        const iv = sodium.from_hex(cipherText.slice(0, 24));
        const assocData = sodium.from_hex(cipherText.slice(24, 56));
        const encryptedData = sodium.from_hex(cipherText.slice(56));

        const decrypted = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
            null,
            encryptedData,
            assocData,
            iv,
            key
        );

        return sodium.to_string(decrypted);
    } catch (e) {
        console.error('Decryption failed:', e);
        return '';
    }
};

  return { encrypt, decrypt };
};

export default useCryptionHelper;
