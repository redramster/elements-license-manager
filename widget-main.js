let managedData={}

window.widget.serviceModules.registerServiceModuleProvider({
	// ServiceModules are required to provide metadata about themselves
	getServiceModuleMetadata() {
		return {
			displayName: 'License Manager',
			description: 'a service that handles license',
		};
	},

	// Will be called every time `configDataChanged` event fires
	async createServiceModuleInstance() {
		// Fetch resources, subscribe to events
        managedData = await window.widget.api.fetchManagedData();
        if (managedData.key1 != undefined) {
            // check for key
           let channelName=await decryptData(managedData.key1,managedData.key2);
           if (window.widget.env.connectedPlatforms[0].displayName!=channelName){
                console.log("**********");
                console.log("Not the right channelname, please register widget using control panel");
                console.log("**********");
                return;
           }
           console.log("registered successfully");
        }
        async function handle_managedDataChanged() {
            //
            managedData = await window.widget.api.fetchManagedData();
            if (managedData.key1 != undefined) {
                // check for key
               let channelName=await decryptData(managedData.key1,managedData.key2);
               if (window.widget.env.connectedPlatforms[0].displayName==channelName){
                    console.log("license registration succeeded, please refresh widget");
               }else{
                    console.log("**********");
                    console.log("Not the right channelname, please register widget using control panel");
                    console.log("**********");
               }
            }
        }
        window.widget.events.on('managedDataChanged', handle_managedDataChanged);
		return {
			// Will be called every time `configDataChanged` event fires
			// and when widget shuts down
			async dispose() {
                window.widget.events.off('managedDataChanged', handle_managedDataChanged);
				// Unsubscribe from events, free resources
			}
		}
	},
});