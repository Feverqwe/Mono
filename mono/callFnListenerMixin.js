import resolvePath from "./resolvePath";

const CallFnListenerMixin = Parent => class extends Parent {
  constructor() {
    super();

    this.remote = {
      mono: this
    };

    this.callFnListener = this.callFnListener.bind(this);
  }

  initMessages() {
    super.initMessages();

    this.onMessage.addListener(this.callFnListener);
  }

  /**
   * @param {{fn:string,args:*[]}} message
   * @param {Function} response
   * @return {boolean}
   * @private
   */
  responseFn(message, response) {
    const promise = Promise.resolve().then(() => {
      const {scope, endPoint: fn} = resolvePath(this.remote, message.fn);
      const args = message.args || [];
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
      console.error('responsePromise error', err);
    });
    return true;
  }

  callFnListener(message, sender, response) {
    switch (message && message.action) {
      case 'callFn': {
        this.responseFn(message, response);
        return true;
      }
    }
  }

  destroy() {
    this.onMessage.removeListener(this.callFnListener);
    super.destroy();
  }
};

export default CallFnListenerMixin;