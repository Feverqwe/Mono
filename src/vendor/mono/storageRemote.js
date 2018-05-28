class StorageRemote {
  constructor(mono) {
    this.mono = mono;
  }
  get(defaults, callback) {
    this.mono.callFn('mono.storage.get', defaults).then(callback, err => {
      console.error('storage.get error', defaults, err);
      callback(defaults);
    });
  }
  set(data, callback) {
    this.mono.callFn('mono.storage.set', data).then(callback, err => {
      console.error('storage.set error', data, err);
      callback();
    });
  }
  remove(keys, callback) {
    this.mono.callFn('mono.storage.remove', keys).then(callback, err => {
      console.error('storage.remove error', keys, err);
      callback();
    });
  }
  clear(callback) {
    this.mono.callFn('mono.storage.clear').then(callback, err => {
      console.error('storage.clear error', err);
      callback();
    });
  }
}

export default StorageRemote;