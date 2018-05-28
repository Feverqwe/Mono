import {wrapObjectValues, unwrapObjectValues} from "./warpObjectValues";

class RemoteStorage {
  constructor(mono) {
    this.mono = mono;
  }
  get(defaults, callback) {
    this.mono.callFn('mono.storage.remote.get', wrapObjectValues(defaults)).then(result => {
      callback(unwrapObjectValues(result));
    }, err => {
      console.error('storage.get error', defaults, err);
      callback(defaults);
    });
  }
  set(data, callback) {
    this.mono.callFn('mono.storage.remote.set', wrapObjectValues(data)).then(callback, err => {
      console.error('storage.set error', data, err);
      callback();
    });
  }
  remove(keys, callback) {
    this.mono.callFn('mono.storage.remote.remove', keys).then(callback, err => {
      console.error('storage.remove error', keys, err);
      callback();
    });
  }
  clear(callback) {
    this.mono.callFn('mono.storage.remote.clear').then(callback, err => {
      console.error('storage.clear error', err);
      callback();
    });
  }
}

export default RemoteStorage;