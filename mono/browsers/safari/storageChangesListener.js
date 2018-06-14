class StorageChangesListener {
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
}

export default StorageChangesListener;