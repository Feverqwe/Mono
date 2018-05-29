import {TransportWithResponseWithActiveTab} from "../../transportWithResponse";

const initPageTransport = mono => {
  return new TransportWithResponseWithActiveTab({
    addListener: listener => {
      mono.bundle.messaing.addListener('page', listener);
      mono.bundle.messaing.addListener('fromActiveTab', listener);
    },
    removeListener: listener => {
      mono.bundle.messaing.removeListener('page', listener);
      mono.bundle.messaing.removeListener('fromActiveTab', listener);
    },
    sendMessage: (message, response) => {
      mono.bundle.messaing.emit('page', message, response);
    },
    sendMessageToActiveTab: (message, response) => {
      mono.bundle.messaing.emit('toActiveTab', message, response);
    },
  });
};

export default initPageTransport;