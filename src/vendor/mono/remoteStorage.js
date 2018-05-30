import {unwrapObjectValues, wrapObjectValues} from "./warpObjectValues";

class RemoteStorage {
  constructor(mono) {
    this.mono = mono;
  }
  get(keys, callback) {
    this.mono.callFn('mono.storage.remote.get', [wrapObjectValues(keys)]).then(result => {
      callback(unwrapObjectValues(result));
    }, err => {
      this.mono.lastError = err;
      callback();
      this.mono.clearLastError();
    });
  }
  set(items, callback) {
    this.mono.callFn('mono.storage.remote.set', [wrapObjectValues(items)]).then(() => {
      callback && callback();
    }, err => {
      this.mono.lastError = err;
      callback && callback();
      this.mono.clearLastError();
    });
  }
  remove(keys, callback) {
    this.mono.callFn('mono.storage.remote.remove', [keys]).then(() => {
      callback && callback();
    }, err => {
      this.mono.lastError = err;
      callback();
      this.mono.clearLastError();
    });
  }
  clear(callback) {
    this.mono.callFn('mono.storage.remote.clear').then(() => {
      callback && callback();
    }, err => {
      this.mono.lastError = err;
      callback();
      this.mono.clearLastError();
    });
  }
}

export default RemoteStorage;