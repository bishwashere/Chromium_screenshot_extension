// popup-script.js
document.querySelector('#sign-in').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'get_access' }, function (response) {
        console.log(response);
    });
});


