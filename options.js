let page = document.getElementById('buttonDiv');
const Button = ['save to google','save to local'];
function constructOptions(Button) {
  for (let item of Button) {
    let button = document.createElement('button');
    button.innerHTML = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({google: item}, function() {
        console.log('option is ' + item);//obviously
         chrome.notifications.create(
                        "screenshot saver", {
                          type: "basic",
                          iconUrl: "ico.png",
                          title: "Screenshot",
                          message: "will be ".concat(item.replace('save', "saved")),
                        },
                        function() {window.close();}
                      );
        
      })
    });
    page.appendChild(button);
  }
}

constructOptions(Button);
