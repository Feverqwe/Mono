import {TransportWithResponseWithActiveTab, TransportWithResponsePage} from "../../transportWithResponse";

/**
 * @typedef {RawTransportWithResponse} RawTransportWithResponsePage
 * @property {function(*,function)} sendMessageToActiveTab
 */

class TransportWithResponseBackgroundPage extends TransportWithResponseWithActiveTab {
  constructor(/**RawTransportWithResponse*/transport, bundle) {
    super(transport);
    this.bundle = bundle;
  }
  callListeners(...args) {
    let result = super.callListeners(...args);
    this.bundle.monoInstances.forEach(mono => {
      if (mono.transport instanceof TransportWithResponsePage) {
        const r = mono.transport.callListeners(...args);
        if (r === true) {
          result = true;
        }
      }
    });
    return result;
  }
}

export default TransportWithResponseBackgroundPage;