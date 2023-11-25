
async function decryptData(encryptedData,privateKeyString) {
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        str2ab(atob(privateKeyString)),
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["decrypt"]
    );

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        base64ToArrayBuffer(encryptedData)
    );

    // Show the decrypted data
    return new TextDecoder().decode(decryptedData);

}

function str2ab(str) {
    const buf = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function changeChannel() {
    document.getElementById("channelName").classList.add("d-none");
    document.getElementById("unlockForm").classList.remove("d-none");
}