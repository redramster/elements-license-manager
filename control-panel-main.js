let managedData = {};

window.controlPanel.serviceModules.registerServiceModuleProvider({
    // ServiceModules are required to provide metadata about themselves
    getServiceModuleMetadata() {
        return {
            displayName: 'Subathon',
            description: 'the main service handling the subathon',
        };
    },

    // Will be called every time `configDataChanged` event fires
    async createServiceModuleInstance() {
        // set up managed data & form elements

        managedData = await window.controlPanel.api.fetchManagedData();
        if (managedData.key1 != undefined) {
            document.getElementById('licenseKey1').value = managedData.key1;
            document.getElementById('licenseKey2').value = managedData.key2;
            let channelName=await decryptData(managedData.key1,managedData.key2);
            setUnlocked(channelName)
        }
        async function handle_managedDataChanged() {
            //
            managedData = await window.controlPanel.api.fetchManagedData();
            if (managedData.key != undefined) {
                document.getElementById('licenseKey1').value = managedData.key1;
                document.getElementById('licenseKey2').value = managedData.key2;           
                let channelName=await decryptData(managedData.key1,managedData.key2);
                setUnlocked(channelName);
            }
        }

        window.controlPanel.events.on('managedDataChanged', handle_managedDataChanged);

 
        return {
            // Will be called every time `configDataChanged` event fires
            // and when widget shuts down
            async dispose() {
                // Unsubscribe from events, free resources
                console.log("dispose");
                window.widget.controlPanel.off('managedDataChanged', handle_managedDataChanged);
            }
        }
    },
});
function setUnlocked(channelName){
    // Show the decrypted data
    document.getElementById('decryptedOutput').textContent = channelName;
    document.getElementById("channelName").classList.remove("d-none");
    document.getElementById("unlockForm").classList.add("d-none");

}
async function unlock(){
    const encryptedData = document.getElementById('licenseKey1').value;
    const privateKeyString = document.getElementById('licenseKey2').value;   // Import the private key
    let channelName=await decryptData(encryptedData,privateKeyString);
    setUnlocked(channelName);
    managedData.key1 = encryptedData;
    managedData.key2 = privateKeyString;
    storeManagedData();
}


// store the data
async function storeManagedData() {
    // this will store the data and once stored will invoke the update managed data (where the values in the form are propogated)
    await window.controlPanel.api.storeManagedData({ managedData: managedData });
}
