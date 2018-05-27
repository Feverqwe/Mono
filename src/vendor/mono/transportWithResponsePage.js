import {TransportWithResponseWithActiveTab} from "./transportWithResponse";

/**
 * @typedef {RawTransportWithResponse} RawTransportWithResponsePage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class TransportWithResponsePage extends TransportWithResponseWithActiveTab {
  startListen() {}
  stopListen() {}
}

export default TransportWithResponsePage;