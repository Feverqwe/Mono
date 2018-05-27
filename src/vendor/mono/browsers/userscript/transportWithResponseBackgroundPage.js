import {TransportWithResponseWithActiveTab} from "../../transportWithResponse";
import TransportWithResponsePage from "../../transportWithResponsePage";

/**
 * @typedef {RawTransportWithResponse} RawTransportWithResponsePage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class TransportWithResponseBackgroundPage extends TransportWithResponseWithActiveTab {
  constructor(/**RawTransportWithResponse*/transport, bundle) {
    super(transport);
    this.bundle = bundle;
  }
  callListeners(message, sender, response) {
    let result = super.callListeners(message, sender, response);
    this.bundle.monoInstances.forEach(mono => {
      if (mono.transport instanceof TransportWithResponsePage) {
        const r = mono.transport.callListeners(message, sender, response);
        if (r === true) {
          result = true;
        }
      }
    });
    return result;
  }
}

export default TransportWithResponseBackgroundPage;