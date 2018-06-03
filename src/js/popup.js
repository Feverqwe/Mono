import mono from "mono";

console.log('Popup');

window.pMono = mono;

console.log('popup window', window);

mono.onMessage.addListener(function (message, sender, response) {
  console.log('popup onMessage', message, sender);
  if (/!$/.test(message)) {
    response(`r! ${message}`);
  }
});