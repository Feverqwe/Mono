import {wrapObjectValues, unwrapObjectValues} from "./warpObjectValues";

class RemoteStorage {
  constructor(mono) {
    this.mono = mono;
  }
  get(keys) {
    return this.mono.callFn('mono.storage.remote.get', [wrapObjectValues(keys)]).then(result => unwrapObjectValues(result));
  }
  set(items) {
    return this.mono.callFn('mono.storage.remote.set', [wrapObjectValues(items)]);
  }
  remove(keys) {
    return this.mono.callFn('mono.storage.remote.remove', [keys]);
  }
  clear() {
    return this.mono.callFn('mono.storage.remote.clear');
  }
}

export default RemoteStorage;