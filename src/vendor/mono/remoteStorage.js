import {wrapObjectValues, unwrapObjectValues, isObject} from "./warpObjectValues";

class RemoteStorage {
  constructor(mono) {
    this.mono = mono;
  }
  get(keys, callback) {
    this.mono.callFn('mono.storage.remote.get', [wrapObjectValues(keys)]).then(result => {
      callback(unwrapObjectValues(result));
    }, err => {
      console.error('storage.get error', keys, err);
      if (isObject(keys)) {
        callback(keys);
      } else {
        callback({});
      }
    });
  }
  set(items, callback) {
    this.mono.callFn('mono.storage.remote.set', [wrapObjectValues(items)]).then(callback, err => {
      console.error('storage.set error', items, err);
      callback();
    });
  }
  remove(keys, callback) {
    this.mono.callFn('mono.storage.remote.remove', [keys]).then(callback, err => {
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