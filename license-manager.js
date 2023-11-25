
async function encryptData() {
    await logBase64EncodedKeys();
    const data = document.getElementById('dataInput').value;
    const publicKeyString = document.getElementById("publicKey").value;   // Import the public key
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        str2ab(atob(publicKeyString)),
        {   
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["encrypt"]
    );

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        new TextEncoder().encode(data)
    );

    // Show the encrypted data
    document.getElementById('encryptedOutput').value = arrayBufferToBase64(encryptedData);
}

function str2ab(str) {
    const buf = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// key generator:
async function generateRsaKeyPair() {
    // Key generation parameters
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, // Can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true, // Whether the key is extractable (i.e., can be used in exportKey)
        ["encrypt", "decrypt"] // Must be ["encrypt", "decrypt"] or a subset
    );

    return keyPair;
}
async function exportKeyToBase64(key, type) {
    // Export the key to a format suitable for Web Crypto operations
    const exportedKey = await window.crypto.subtle.exportKey(
        type, // "spki" for public key, "pkcs8" for private key
        key
    );

    // Convert the exported key to Base64
    const base64Key = arrayBufferToBase64(exportedKey);
    return base64Key;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
async function logBase64EncodedKeys() {
    const keyPair = await generateRsaKeyPair();
    const publicKeyBase64 = await exportKeyToBase64(keyPair.publicKey, "spki");
    const privateKeyBase64 = await exportKeyToBase64(keyPair.privateKey, "pkcs8");
    document.getElementById("privateKey").value=privateKeyBase64;
    document.getElementById("publicKey").value=publicKeyBase64;
    
    console.log("Public Key (Base64):", publicKeyBase64);
    console.log("Private Key (Base64):", privateKeyBase64);
}


