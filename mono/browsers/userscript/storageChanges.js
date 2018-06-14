class UserscriptStorageChanges {
  constructor(mono) {
    this.mono = mono;

    this.listener = this.listener.bind(this);
    this.destroyListener = this.destroyListener.bind(this);

    this.initMessages();
  }
  initMessages() {
    this.mono.bundle.messaing.addListener('storage', this.listener);

    this.mono.onDestroy.addListener(this.destroyListener);
  }
  destroyListener() {
    this.mono.onDestroy.removeListener(this.destroyListener);
    this.destroy();
  }
  listener(changes) {
    this.mono.storage.onChanged.dispatch(changes, 'local');
  }
  emit(changes) {
    this.mono.bundle.messaing.emit('storage', changes);
  }
  destroy() {
    this.mono.bundle.messaing.removeListener('storage', this.listener);
  }
}

export default UserscriptStorageChanges;