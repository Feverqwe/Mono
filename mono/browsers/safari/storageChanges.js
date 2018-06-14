class SafariStorageChanges {
  constructor(mono) {
    this.mono = mono;

    this.listener = this.listener.bind(this);

    this.initMessages();
  }
  initMessages() {
    this.mono.onMessage.addListener(this.listener);
  }
  listener(message) {
    if (message && message.action === 'storageChanges') {
      this.mono.storage.onChanged.dispatch(message.changes, 'local');
    }
  }
  emit(changes) {
    this.mono.storage.onChanged.dispatch(changes, 'local');
    this.mono.transport.sendMessageToAll({
      action: 'storageChanges',
      changes
    });
  }
}

export default SafariStorageChanges;