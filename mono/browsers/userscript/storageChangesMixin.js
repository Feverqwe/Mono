import getStorageChanges from "../../getStorageChanges";

const UserscriptStorageChangesMixin = Parent => class extends Parent {
  constructor(mono) {
    super();
    this.mono = mono;

    this.changesListener = this.changesListener.bind(this);

    this.initChangesListener();
  }
  initChangesListener() {
    this.mono.bundle.messaing.addListener('storage', this.changesListener);

    const destroyListener = () => {
      this.mono.onDestroy.removeListener(destroyListener);

      this.mono.bundle.messaing.removeListener('storage', this.changesListener);
    };
    this.mono.onDestroy.addListener(destroyListener);
  }
  changesListener(changes) {
    this.onChanged.dispatch(changes, 'local');
  }
  handleChange(oldStorage, storage) {
    const changes = getStorageChanges(oldStorage, storage);
    if (changes) {
      this.mono.bundle.messaing.emit('storage', changes);
    }
  }
};

export default UserscriptStorageChangesMixin;