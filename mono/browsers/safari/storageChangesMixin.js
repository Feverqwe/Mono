import getStorageChanges from "../../getStorageChanges";

const SafariStorageChangesMixin = Parent => class extends Parent {
  constructor(mono) {
    super(mono);
    this.mono = mono;

    this.changesListener = this.changesListener.bind(this);

    this.initChangesListener();
  }
  initChangesListener() {
    this.mono.onMessage.addListener(this.changesListener);
  }
  changesListener(message) {
    if (message && message.action === 'storageChanges') {
      this.onChanged.dispatch(message.changes, 'local');
    }
  }
  handleChange(oldStorage, storage) {
    const changes = getStorageChanges(oldStorage, storage);
    if (changes) {
      this.onChanged.dispatch(changes, 'local');
      this.mono.transport.sendMessageToAll({
        action: 'storageChanges',
        changes
      });
    }
  }
};

export default SafariStorageChangesMixin;