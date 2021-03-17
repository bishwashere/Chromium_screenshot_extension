chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		google: 'save to local'
	}, function() {
		console.log('save to local by default');
	});
});
chrome.browserAction.onClicked.addListener(
		(tab) => {
			chrome.tabs.captureVisibleTab({
					format: 'png'
				}, (screenshotUrl) => {
					const date = new Date();
					const screendate= 'screenshot '.concat(date.toISOString().substring(0, 10)).concat(" at ").concat(date.toLocaleTimeString().replaceAll(':', '.'));
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
					}); //file

					chrome.storage.sync.get('google', function(data) {
							if (data.google == 'save to google') {
								chrome.identity.getAuthToken({
									"interactive": true
								}, (auth_token) => {
									console.log(auth_token);
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
											chrome.notifications.create(
												"screenshot saver", {
													type: "progress",
													iconUrl: "ico.png",
													progress: 100,
													title: "Screenshot",
													message: "Saved to google drive!",
												},
												function() {}
											);
										}
										return res.json();
									}).then(function(val) {
										console.log(val);
									});

								});
							} else {
								chrome.downloads.download({
										url: screenshotUrl,
										filename: screendate.concat('.png')
										});

								}
							});
					});
			});
