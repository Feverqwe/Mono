class ContentScriptCallFn {
  constructor(mono) {
    this.mono = mono;
  }
  /**
   * @param {string} fnName
   * @param {*[]} argsArray
   * @return {Promise}
   */
  callFn(fnName, argsArray = []) {
    return this.waitPromise({
      action: 'callFn',
      fn: fnName,
      args: argsArray
    });
  }

  /**
   * @param {*} msg
   * @return {Promise}
   * @private
   */
  waitPromise(msg) {
    return new Promise((resolve, reject) => {
      this.mono.sendMessage(msg, response => {
        if (response.err) {
          const err = new Error();
          Object.assign(err, response.err);
          return reject(err);
        } else {
          return resolve(response.result);
        }
      });
    });
  }
}

export default ContentScriptCallFn;