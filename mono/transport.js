import TransportWithResponse from "./transportWithResponse";

/**
 * @typedef {{}} RawTransport
 * @property {function(function)} addListener
 * @property {function(function)} removeListener
 * @property {function(*)} sendMessage
 * @property {function(*, Object)} sendMessageTo
 */

class Transport extends TransportWithResponse {
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
    this.transport.sendMessageTo({
      transportId: this.transportId,
      responseId: rawMessage.callbackId,
      received: true
    }, event);
  }

  waitReceiveReply(callbackId) {
    setTimeout(() => {
      const callback = this.idCallbackMap[callbackId];
      if (callback) {
        if (!callback.received) {
          console.info('No one received a message');
          callback();
        }
      }
    }, 1000);
  }

  /**
   * @param {{callbackId:string,message:*,responseId:string,responseMessage:*,sender:Object}} rawMessage
   * @param {Object} event
   * @private
   */
  listen(rawMessage, event) {
    if (rawMessage.transportId === this.transportId) return;

    if (rawMessage.responseId) {
      const callback = this.idCallbackMap[rawMessage.responseId];
      if (rawMessage.received) {
        if (callback) {
          callback.received = true;
        }
      } else {
        if (callback) {
          callback(rawMessage.responseMessage);
        } else {
          if (rawMessage.responseId.indexOf(this.transportId) === 0) {
            console.warn('Callback is not found', rawMessage);
          }
        }
      }
      return;
    }

    let response = null;
    if (rawMessage.callbackId) {
      this.sendReceiveReply(rawMessage, event);
      response = responseMessage => {
        this.transport.sendMessageTo({
          transportId: this.transportId,
          responseId: rawMessage.callbackId,
          responseMessage: responseMessage
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
      this.waitReceiveReply(rawMessage.callbackId);
      this.idCallbackMap[rawMessage.callbackId] = responseMessage => {
        delete this.idCallbackMap[rawMessage.callbackId];
        response(responseMessage);
      };
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

  destroy() {
    this.idCallbackMap = {};
    super.destroy();
  }
}


/**
 * @typedef {RawTransport} RawTransportPage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class TransportWithActiveTab extends Transport {
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

export default Transport;
export {
  TransportWithActiveTab
};