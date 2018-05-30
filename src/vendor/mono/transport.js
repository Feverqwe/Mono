import TransportWithResponse from "./transportWithResponse";

/**
 * @typedef {{}} RawTransport
 * @property {function(function)} addListener
 * @property {function(function)} removeListener
 * @property {function(*)} sendMessage
 * @property {function(*, Object)} sendMessageTo
 */

class Transport extends TransportWithResponse {
  constructor(/**RawTransport*/transport) {
    super(transport);
    this.callbackIndex = 0;
    this.idCallbackMap = {};

    this.listen = this.listen.bind(this);
  }

  getCallbackId() {
    return `${this.transportId}_${++this.callbackIndex}`
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
      if (callback) {
        callback(rawMessage.responseMessage);
      } else {
        if (rawMessage.responseId.indexOf(this.transportId) === 0) {
          console.warn('Callback is not found', rawMessage);
        }
      }
      return;
    }

    let response = null;
    if (rawMessage.callbackId) {
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
      rawMessage.callbackId = this.getCallbackId();
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
      delete this.idCallbackMap[rawMessage.callbackId];
      throw err;
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
      delete this.idCallbackMap[rawMessage.callbackId];
      throw err;
    }
  }
}

export default Transport;
export {
  TransportWithActiveTab
};