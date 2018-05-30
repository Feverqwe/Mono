import resolvePath from "./resolvePath";

const serializeError = require('serialize-error');

class BackgroundPageCallFn {
  constructor(mono) {
    this.mono = mono;

    this.remote = {
      mono: mono
    };

    this.listener = this.listener.bind(this);

    this.init();
  }

  init() {
    this.mono.onMessage.addListener(this.listener);
  }

  listener(msg, sender, response) {
    switch (msg && msg.action) {
      case 'callFn': {
        this.responseFn(msg, response);
        return true;
      }
    }
  }

  /**
   * @param {{fn:string,args:*[]}} msg
   * @param {Function} response
   * @return {boolean}
   * @private
   */
  responseFn(msg, response) {
    const promise = Promise.resolve().then(() => {
      const {scope, endPoint: fn} = resolvePath(this.remote, msg.fn);
      const args = msg.args || [];
      return scope[fn].apply(scope, args);
    });
    return this.responsePromise(promise, response);
  }

  /**
   * @param {Promise} promise
   * @param {Function} response
   * @return {boolean}
   * @private
   */
  responsePromise(promise, response) {
    promise.then(result => {
      response({result: result});
    }, err => {
      response({err: serializeError(err)});
    }).catch(function (err) {
      debug('responsePromise error', err);
    });
    return true;
  }

  destroy() {
    this.mono.onMessage.removeListener(this.listener);
  }
}

export default BackgroundPageCallFn;