import mono from "mono";

console.log('anyFrame', location.href);

window.aMono = mono;

console.log('anyFrame window', window);

mono.onMessage.addListener(function (message, sender, response) {
  console.log('anyFrame onMessage', message, sender);
  if (/!$/.test(message)) {
    response(`r! ${message}`);
  }
});