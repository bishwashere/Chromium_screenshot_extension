let page = document.getElementById('buttonDiv');
const  googleRevokeApi= 'https://accounts.google.com/o/oauth2/revoke?token='
const Button = ['save to google','save to local','logout'];
function notifier(item){
  chrome.notifications.create(
    "screenshot saver", {
      type: "basic",
      silent: true,
      iconUrl: "ico.png",
      title: "Screenshot",
      message: "will be ".concat(item.replace('save', "saved")),
    },
    function(id) {
      
        chrome.tabs.getCurrent(function(tab) {
          chrome.tabs.query({windowType:'normal'}, function(tabs) {
            console.log('Number of open tabs in all normal browser windows:',tab);
            const h = {}
            for  (f of tabs)
            {
              if( h[f.windowId]){
                h[f.windowId]+=1
                continue
              }
              h[f.windowId]=1
            }
            if (h[tab.windowId] >1 ){
              setTimeout( ()=>{chrome.notifications.clear(id);chrome.tabs.remove(tab.id);},888);
            }
            else {
              chrome.tabs.create({url:'chrome://newtab'});
              setTimeout( ()=>{chrome.tabs.remove(tab.id);},60);
              setTimeout(()=>{chrome.notifications.clear(id);},888)
            }
          }
          ); 
        });
      
    }
    );
}
function constructOptions(Button) {
  for (let item of Button) {
    let button = document.createElement('button');
    button.innerHTML = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({google: item}, function() {
        console.log('option is ' + item);//obviously
        notifier(item);    
        if(item=='save to google'){
        chrome.identity.getAuthToken({
                  "interactive": true
                }, (auth_token) => {});
      }
      if(item == 'logout'){
                   chrome.identity.getAuthToken({ 'interactive': false }, (currentToken) => {
                    if(currentToken== undefined){
                      chrome.storage.sync.set({google: 'save to local'},()=>{});
                      return;
                    }
                       if (!chrome.runtime.lastError && currentToken != undefined) {
                             // Remove the local cached token
                           chrome.identity.removeCachedAuthToken({ token: currentToken }, () => {
                             chrome.storage.sync.set({google: 'save to local'},()=>{});
                           
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
    page.appendChild(button);
  }
}
constructOptions(Button);
