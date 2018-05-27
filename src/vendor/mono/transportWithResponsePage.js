import TransportWithResponse from "./transportWithResponse";

/**
 * @typedef {RawTransportWithResponse} RawTransportWithResponsePage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class TransportWithResponsePage extends TransportWithResponse {
  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessageToActiveTab(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = {
      transportId: this.transportId,
      message: this.copyMessage(message)
    };

    this.transport.sendMessageToActiveTab(rawMessage, response);
  }
}

export default TransportWithResponsePage;