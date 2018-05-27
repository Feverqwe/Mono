import TransportWithResponse from "./transportWithResponse";
import {copyMessage} from "./transportWithResponse";

/**
 * @typedef {{}} RawTransport
 * @property {function(function)} addListener
 * @property {function(function)} removeListener
 * @property {function(*)} sendMessage
 * @property {function(*)} sendMessageToActiveTab
 * @property {function(*, Object)} sendMessageTo
 */

class Transport extends TransportWithResponse {
  constructor(/**RawTransport*/transport) {
    super(transport);
    this.transport = transport;
    this.callbackIndex = 0;
    this.idCallbackMap = {};

    this.listen = this.listen.bind(this);
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

    super.listen(rawMessage, responseMessage => {
      this.transport.sendMessageTo({
        transportId: this.transportId,
        responseId: rawMessage.callbackId,
        responseMessage: responseMessage
      }, event);
    });
  }

  putCallbackId(rawMessage, response) {
    rawMessage.callbackId = `${this.transportId}_${++this.callbackIndex}`;
    this.idCallbackMap[rawMessage.callbackId] = responseMessage => {
      delete this.idCallbackMap[rawMessage.callbackId];
      response(responseMessage);
    };
  }

  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessage(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = {
      transportId: this.transportId,
      message: message
    };

    if (response) {
      this.putCallbackId(rawMessage, response);
    }

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

    const rawMessage = {
      transportId: this.transportId,
      message: copyMessage(message)
    };

    if (response) {
      this.putCallbackId(rawMessage, response);
    }

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