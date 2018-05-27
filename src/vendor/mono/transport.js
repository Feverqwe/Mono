const emptyFn = () => {};
const onceFn = cb => {
  let fired = false;
  return (...args) => {
    if (!fired) {
      fired = true;
      cb(...args);
    }
  };
};

class Transport {
  /**@param {{addListener:function(function),removeListener:function(function),sendMessage:function(*)}} transport*/
  constructor(transport) {
    this.transportId = String(Math.trunc(Math.random() * 1000));
    this.callbackIndex = 0;
    this.idCallbackMap = {};
    this.destroyError = null;
    this.isListen = false;
    this.listeners = [];
    this.transport = transport;

    this.listen = this.listen.bind(this);
  }

  /**
   * @param {{callbackId:string,message:*,responseId:string,responseMessage:*}} rawMessage
   * @private
   */
  listen(rawMessage) {
    if (rawMessage.responseId) {
      const callback = this.idCallbackMap[rawMessage.responseId];
      if (callback) {
        callback(rawMessage.responseMessage);
      } else {
        console.warn('Callback is not found', rawMessage);
      }
      return;
    }

    let response;
    if (rawMessage.callbackId) {
      response = onceFn(responseMessage => {
        if (this.destroyError) {
          console.warn('Send response is skip cause:', this.destroyError);
        } else {
          this.transport.sendMessage({
            responseId: rawMessage.callbackId,
            responseMessage: responseMessage
          });
        }
      });
    } else {
      response = emptyFn;
    }

    let result = null;
    this.listeners.forEach(listener => {
      try {
        const r = listener(rawMessage.message, {}, response);
        if (r === true) {
          result = r;
        }
      } catch (err) {
        console.error('Error in event handler for mono.onMessage:', err);
      }
    });
    if (result !== true) {
      response(undefined);
    }
  }

  /**
   * @private
   */
  startListen() {
    if (!this.isListen) {
      this.isListen = true;
      this.transport.addListener(this.listen);
    }
  }

  /**
   * @private
   */
  stopListen() {
    if (this.isListen) {
      this.isListen = false;
      this.transport.removeListener(this.listen);
    }
  }

  /**
   * @param {function(*,{},function(*)):boolean} listener
   */
  addListener(listener) {
    this.listeners.push(listener);
    if (this.listeners.length > 0) {
      this.startListen();
    }
  }

  /**
   * @param {function} listener
   */
  removeListener(listener) {
    const pos = this.listeners.indexOf(listener);
    if (pos !== -1) {
      this.listeners.splice(pos, 1);
    }
    if (this.listeners.length === 0) {
      this.stopListen();
    }
  }

  /**
   * @param {function} listener
   * @returns {boolean}
   */
  hasListener(listener) {
    return this.listeners.indexOf(listener) !== -1;
  }

  /**
   * @returns {boolean}
   */
  hasListeners() {
    return this.listeners.length > 0;
  }

  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessage(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = {
      message: message
    };

    if (response) {
      rawMessage.callbackId = `${this.transportId}_${++this.callbackIndex}`;
      this.idCallbackMap[rawMessage.callbackId] = responseMessage => {
        delete this.idCallbackMap[rawMessage.callbackId];
        response(responseMessage);
      };
    }

    try {
      this.transport.sendMessage(rawMessage);
    } catch (err) {
      delete this.idCallbackMap[rawMessage.callbackId];
      throw err;
    }
  }

  destroy() {
    this.destroyError = new Error('Transport is destroyed');
    this.idCallbackMap = {};
    this.listeners.splice(0);
    this.stopListen();
  }
}

export default Transport;