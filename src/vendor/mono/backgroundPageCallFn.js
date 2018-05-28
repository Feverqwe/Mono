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

  listener(message, sender, response) {
    switch (message && message.action) {
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
      const {scope, endPoint: fn} = this.resolvePath(msg.fn);
      return scope[fn].apply(scope, msg.args);
    });
    return this.responsePromise(promise, response);
  }

  /**
   * @param {string} path
   * @return {{scope: Object, endPoint: *}}
   * @private
   */
  resolvePath(path) {
    const parts = path.split('.');
    const endPoint = parts.pop();
    let scope = this.remote;
    while (parts.length) {
      scope = scope[parts.shift()];
    }
    return {scope, endPoint};
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
      response({err: {
          name: err.name,
          message: err.message,
          stack: err.stack
        }});
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