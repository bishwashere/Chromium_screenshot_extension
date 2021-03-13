const API_key = "AIzaSyCfUGdFGbXEsZIi-LhHiXDJBL_LZhJ0hxY";
let user_sign_in=false;
chrome.browserAction.onClicked.addListener(
	()=>{
		chrome.tabs.captureVisibleTab((screenshotUrl) => 
		{
			const contentType = 'image/jpeg';
			const b64Data = String(screenshotUrl.split(/,(.+)/)[1]);
			const byteCharacters = atob(b64Data);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
			    byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], {type: contentType});//file
	
			chrome.storage.sync.get('google', function(data) {
				if(data.google=='save to google'){
					chrome.identity.getAuthToken({"interactive":true}, (auth_token)=>{
						console.log(auth_token);
						var metadata = {
						    'name': 'sampleName', // Filename at Google Drive
						    'mimeType': 'image/jpeg', // mimeType at Google Drive
						   // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
						     };
						var form = new FormData();
						form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
						form.append('file', blob);
						var xhr = new XMLHttpRequest();
						xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
						xhr.setRequestHeader('Authorization', 'Bearer' + auth_token);
						xhr.responseType = 'json';
						xhr.onload = () => {
						    console.log(xhr.response.id); // Retrieve uploaded file ID.
						};
						xhr.send(form);

					});
				}
				else{
					var download = document.createElement('a');
					download.href= URL.createObjectURL(blob);
					download.download= 'screenshot-';
					download.click();

				}
			});
		});  
});