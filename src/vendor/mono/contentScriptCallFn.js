const deserializeError = require('deserialize-error');

class ContentScriptCallFn {
  constructor(mono) {
    this.mono = mono;
  }
  /**
   * @param {string} fnName
   * @param {*[]} [argsArray]
   * @param {{putCallback: boolean}} [options]
   * @return {Promise}
   */
  callFn(fnName, argsArray, options) {
    return this.waitPromise({
      action: 'callFn',
      fn: fnName,
      args: argsArray,
      options: options
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
          const err = deserializeError(response.err);
          return reject(err);
        } else {
          return resolve(response.result);
        }
      });
    });
  }
}

export default ContentScriptCallFn;