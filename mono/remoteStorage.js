import {unwrapObjectValues, wrapObjectValues} from "./warpObjectValues";

class RemoteStorage {
  constructor(mono) {
    this.mono = mono;
  }
  onError(callback, err, notOptionalCallback) {
    this.mono.lastError = err;
    if (notOptionalCallback || callback) {
      callback();
    }
    this.mono.clearLastError();
  }
  get(keys, callback) {
    this.mono.callFn('mono.storage.remote.get', [wrapObjectValues(keys)]).then(result => {
      callback(unwrapObjectValues(result));
    }, err => {
      this.onError(callback, err, true);
    });
  }
  set(items, callback) {
    this.mono.callFn('mono.storage.remote.set', [wrapObjectValues(items)]).then(callback, err => {
      this.onError(callback, err);
    });
  }
  remove(keys, callback) {
    this.mono.callFn('mono.storage.remote.remove', [keys]).then(callback, err => {
      this.onError(callback, err);
    });
  }
  clear(callback) {
    this.mono.callFn('mono.storage.remote.clear').then(callback, err => {
      this.onError(callback, err);
    });
  }
}

export default RemoteStorage;