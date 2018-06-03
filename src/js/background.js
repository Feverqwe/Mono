import mono from "mono";

console.log('Background page');

window.bMono = mono;

console.log('bg window', window);

mono.onMessage.addListener(function (message, sender, response) {
  console.log('bg onMessage', message, sender);
  if (/!$/.test(message)) {
    response(`r! ${message}`);
  }
});