import mono from "mono";

console.log('Options');

window.oMono = mono;

console.log('options window', window);

mono.onMessage.addListener(function (message, sender, response) {
  console.log('options onMessage', message, sender);
  if (/!$/.test(message)) {
    response(`r! ${message}`);
  }
});