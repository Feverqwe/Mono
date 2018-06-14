import Transport from "../../transport";

/**
 * @typedef {{}} RawTransport
 * @property {function(function)} addListener
 * @property {function(function)} removeListener
 * @property {function(*)} sendMessage
 * @property {function(*, Object)} sendMessageTo
 * @property {function(*)} sendMessageToAll
 */

class SafariTransport extends Transport {
  constructor(mono, /**RawTransport*/transport) {
    super(transport);
    this.mono = mono;
    this.callbackIndex = 0;
    this.idCallbackMap = {};

    this.listen = this.listen.bind(this);
  }

  getCallbackId() {
    return `${this.transportId}_${++this.callbackIndex}`
  }

  sendReceiveReply(rawMessage, event) {
    try {
      this.transport.sendMessageTo({
        transportId: this.transportId,
        responseId: rawMessage.callbackId,
        received: true
      }, event);
    } catch (err) {
      console.warn('sendReceiveReply error', err);
    }
  }

  waitReceiveReply(callbackId) {
    const callback = this.idCallbackMap[callbackId];
    callback.receiverResponse = {};
    callback.receivers = [];
    setTimeout(() => {
      const callback = this.idCallbackMap[callbackId];
      if (callback) {
        if (!callback.receivers.length) {
          console.info('No one received a message');
          callback();
        }
      }
    }, 1000);
  }

  addCloseListener(callbackId, transportId, event) {
    const callback = this.idCallbackMap[callbackId];
    if (callback) {
      const tab = event.target;
      if (tab && tab.addEventListener) {
        const listener = callback[`closeListener_${transportId}`] = () => {
          this.listen({
            transportId,
            responseId: callbackId,
            forceResponse: true,
          }, event);
        };
        tab.addEventListener('close', listener);
      }
    }
  }

  removeCloseListener(callbackId, transportId, event) {
    const callback = this.idCallbackMap[callbackId];
    if (callback) {
      const listener = callback[`closeListener_${transportId}`];
      callback[`closeListener_${transportId}`] = null;
      const tab = event.target;
      if (tab && tab.removeEventListener) {
        if (listener) {
          tab.removeEventListener('close', listener);
        }
      }
    }
  }

  /**
   * @typedef {RawMessage} SafariRawMessage
   * @property {string} callbackId
   * @property {*} responseMessage
   * @property {string} responseId
   * @property {boolean} received
   * @property {boolean} forceResponse
   */

  /**
   * @param {SafariRawMessage} rawMessage
   * @param {Object} event
   * @private
   */
  listen(rawMessage, event) {
    if (rawMessage.transportId === this.transportId) return;

    if (rawMessage.responseId) {
      const callback = this.idCallbackMap[rawMessage.responseId];
      if (rawMessage.received) {
        if (callback) {
          callback.receivers.push(rawMessage.transportId);
          this.addCloseListener(rawMessage.responseId, rawMessage.transportId, event);
        }
      } else {
        if (callback) {
          callback.receiverResponse[rawMessage.transportId] = rawMessage;
          this.removeCloseListener(rawMessage.responseId, rawMessage.transportId, event);
          if (callback.receivers.every(id => callback.receiverResponse[id])) {
            let responseMessage = undefined;
            callback.receivers.some(transportId => {
              const rawMessage = callback.receiverResponse[transportId];
              if (!rawMessage.forceResponse) {
                responseMessage = rawMessage.responseMessage;
                return true;
              }
            });
            callback(responseMessage);
          }
        } else {
          if (rawMessage.responseId.indexOf(this.transportId) === 0) {
            console.warn('Callback is not found', rawMessage);
          }
        }
      }
      return;
    }

    if (rawMessage.sender) {
      rawMessage.sender.tab = event.target;
    }

    let response = null;
    if (rawMessage.callbackId) {
      this.sendReceiveReply(rawMessage, event);
      response = responseMessage => {
        this.transport.sendMessageTo({
          transportId: this.transportId,
          responseId: rawMessage.callbackId,
          responseMessage: responseMessage,
          forceResponse: rawMessage._forceResponse,
        }, event);
      };
    }

    super.listen(rawMessage, response);
  }

  getRawMessage(message, response) {
    const rawMessage = super.getRawMessage(message, response);
    if (response) {
      !this.isListen && this.startListen();

      rawMessage.callbackId = this.getCallbackId();
      this.idCallbackMap[rawMessage.callbackId] = responseMessage => {
        delete this.idCallbackMap[rawMessage.callbackId];
        response(responseMessage);
      };
      this.waitReceiveReply(rawMessage.callbackId);
    }
    return rawMessage;
  }

  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessage(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = this.getRawMessage(message, response);

    try {
      this.transport.sendMessage(rawMessage);
    } catch (err) {
      this.mono.lastError = err;
      const wrappedResponse = this.idCallbackMap[rawMessage.callbackId];
      wrappedResponse && wrappedResponse();
      this.mono.clearLastError();
    }
  }

  sendMessageToAll(message) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = this.getRawMessage(message, response);

    try {
      this.transport.sendMessageToAll(rawMessage);
    } catch (err) {
      this.mono.lastError = err;
      this.mono.clearLastError();
    }
  }

  destroy() {
    this.idCallbackMap = {};
    super.destroy();
  }
}


/**
 * @typedef {RawTransport} RawTransportPage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class SafariTransportWithActiveTab extends SafariTransport {
  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessageToActiveTab(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = this.getRawMessage(message, response);

    try {
      this.transport.sendMessageToActiveTab(rawMessage);
    } catch (err) {
      this.mono.lastError = err;
      const wrappedResponse = this.idCallbackMap[rawMessage.callbackId];
      wrappedResponse && wrappedResponse();
      this.mono.clearLastError();
    }
  }
}

export default SafariTransport;
export {
  SafariTransportWithActiveTab
};