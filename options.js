let page = document.getElementById('buttonDiv');
const Button = ['save to google','save to local'];
function constructOptions(Button) {
  for (let item of Button) {
    let button = document.createElement('button');
    button.innerHTML = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({google: item}, function() {
        console.log('color is ' + item);//obviously
      })
    });
    page.appendChild(button);
  }
}
constructOptions(Button);