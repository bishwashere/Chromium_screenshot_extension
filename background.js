const API_key = "<39 character long api key>";
//let user_sign_in=false;
chrome.runtime.onMessage.addListener((request,sender, sendResponse)=>{
    if(request.message==='get_access'){

        chrome.identity.getAuthToken({"interactive":true}, function(auth_token){
            console.log(auth_token);

        });
        sendResponse('success');
    } else if(request.message === 'create file'){

    }

});
/*//trying to make a new window to display the screenshot image ,ignore for now
let id = 100;

chrome.browserAction.onClicked.addListener(() => {

  chrome.tabs.captureVisibleTab((screenshotUrl) => {
    const viewTabUrl = chrome.extension.getURL('popup.html?id=' + id++)
    let targetId = null;
    chrome.tabs.create({url: viewTabUrl}, (tab) => {
          targetId = tab.id;
                });
    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
   
      if (tabId != targetId || changedProps.status != "complete"){
        return;
      }
     
      chrome.tabs.onUpdated.removeListener(listener);
//display view in new browser window, screenshotUrl have the image data encoded base64 
      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view.location.href == viewTabUrl) {
          view.setScreenshotUrl(screenshotUrl);
          break;
        }
      }
    });


  });
});
*/
