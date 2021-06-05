chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		google: 'save to local'
	}, function() {
		console.log('save to local by default');
	});
});

const  googleRevokeApi= 'https://accounts.google.com/o/oauth2/revoke?token='
function create_the_blob(screenshotUrl){

					const contentType = 'image/png';
					const b64Data = String(screenshotUrl.split(/,(.+)/)[1]);
					const byteCharacters = atob(b64Data);
					const byteNumbers = new Array(byteCharacters.length);
					for (let i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}
					const byteArray = new Uint8Array(byteNumbers);
					const blob = new Blob([byteArray], {
						type: contentType
					}); 
					return blob;

}
function downloader_local(screenshotUrl,screendate){
	chrome.downloads.setShelfEnabled(false);
	chrome.downloads.download({
		url: screenshotUrl,
		filename: screendate.concat('.png')
		});
	setTimeout(function(){
		chrome.downloads.setShelfEnabled(true);
	},90);

}
function createBasicNotification(messagee,time=2000){
	         	chrome.notifications.create(
				"screenshot saver", {
					type: "basic",
					iconUrl: "ico.png",
					silent: true,
					title: "Screenshot",
					message: messagee,
				},
				function(id) {
					setTimeout(function(){chrome.notifications.clear(id);}, time);}
			);

}
function flicker(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.scripting.insertCSS(
     {
       target: {tabId: tabs[0].id},
       files: ["mystyles.css"],
     });
  
		 chrome.scripting.executeScript( {target: {tabId: tabs[0].id}, files: ['foreground.js'] }, () => console.log('i injected'))
	});
}
function createProgressNotification(messagee,time=800){
	chrome.notifications.create(
		"screenshot saver", {
			type: "progress",
			iconUrl: "ico.png",
			progress: 100,
			title: "Screenshot",
			message: messagee,
		},
		function(id) {setTimeout(function(){chrome.notifications.clear(id);}, time);}
	);

}
chrome.action.onClicked.addListener(
		(tab) => {
			chrome.tabs.captureVisibleTab({
					format: 'png'
				}, (screenshotUrl) => {
					const date = new Date();
					const screendate= 'screenshot '.concat(date.toISOString().substring(0, 10)).concat(" at ").concat(date.toLocaleTimeString().replaceAll(':', '.'));
					const blob = create_the_blob(screenshotUrl);
					//file

					chrome.storage.sync.get('google', function(data) {
							if (data.google == 'save to google') {
								
								chrome.identity.getAuthToken({
									"interactive": true
								}, (auth_token) => {
									try{
									if(typeof(auth_token)==undefined){
										throw undefined;
									}}
									catch (e){
										downloader_local(screenshotUrl,screendate);
										
										createBasicNotification('Saving to local drive! because error');
										console.log(e);
										return;
									}

									//console.log(auth_token);
									let metadata = {
										name: screendate, // Filename
										mimeType: 'image/png', // mimeType at Google Drive
										parents: ['root'], // Folder ID in Google Drive
									};
									let form = new FormData();
									form.append(
										'metadata',
										new Blob([JSON.stringify(metadata)], {
											type: 'application/json'
										})
									);
									form.append('file', blob);
									fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
										method: 'POST',
										headers: new Headers({
											Authorization: 'Bearer ' + auth_token
										}),
										body: form,
									}).then((res) => {
										if (res.status == 200) {
											//createProgressNotification('saved to google',800);
											flicker()

										}
										return res.json();
									}).then(function(val) {
										console.log(val);
									});

								});
						
							} else if (data.google == 'save to local') {
								flicker();
								downloader_local(screenshotUrl,screendate);

								} else if(data.google == 'logout'){
									 chrome.identity.getAuthToken({ 'interactive': false }, (currentToken) => {
									 	if(currentToken== undefined){
									 		chrome.storage.sync.set({google: 'save to local'},()=>{});
									 		downloader_local(screenshotUrl,screendate);
									 		return;

									 	}
									     if (!chrome.runtime.lastError && currentToken != undefined) {
									           // Remove the local cached token
									         chrome.identity.removeCachedAuthToken({ token: currentToken }, () => {
									         	 chrome.storage.sync.set({google: 'save to local'},()=>{});
									         	 downloader_local(screenshotUrl,screendate);
									         	 createBasicNotification("logged out successfully!, saving Locally :)",2000);
									         	});

									               // Make a request to revoke token in the server
									                     const xhr = new XMLHttpRequest()
									                           xhr.open('GET', `${googleRevokeApi}${currentToken}`)
									                                 xhr.send()
									                             }
									                         });
								}

							});
					});
			});
