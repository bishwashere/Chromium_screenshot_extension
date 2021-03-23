let page = document.getElementById('buttonDiv');
const Button = ['save to google','save to local','logout'];
function notifier(item)
{
	  chrome.notifications.create(
                        "screenshot saver", {
                          type: "basic",
                          silent: true,
                          iconUrl: "ico.png",
                          title: "Screenshot",
                          message: "will be ".concat(item.replace('save', "saved")),
                        },
                        function(id) {
                        setTimeout(function()
                           {
                            chrome.notifications.clear(id);chrome.tabs.getCurrent(function(tab) {
                            chrome.tabs.remove(tab.id, function() { });
                            });
                            }, 640);
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
      })
    });
    page.appendChild(button);
  }
}
constructOptions(Button);
