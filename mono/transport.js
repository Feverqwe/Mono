import Event from "./event";
import copyMessage from "./copyMessage";

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

/**
 * @typedef {{}} RawTransportWithResponse
 * @property {function(function)} addListener
 * @property {function(function)} removeListener
 * @property {function(*,function)} sendMessage
 */

class Transport extends Event {
  constructor(/**RawTransportWithResponse*/transport) {
    super();
    this.transportId = String(parseInt(Math.random() * 1000, 10));
    this.destroyError = null;
    this.isListen = false;
    this.transport = transport;

    this.listen = this.listen.bind(this);
  }

  callListeners(message, sender, response) {
    let result = null;
    this.listeners.forEach(listener => {
      try {
        const r = listener(message, sender, response);
        if (r === true) {
          result = r;
        }
      } catch (err) {
        console.error('Error in event handler for mono.onMessage:', err);
      }
    });
    return result;
  }

  /**
   * @typedef {{}} RawMessage
   * @property {string} transportId
   * @property {*} message
   * @property {{url:string}} sender
   * @property {boolean} _responseFired
   * @property {boolean} _forceResponse
   * @property {boolean} _asyncResponse
   */

  /**
   * @param {RawMessage} rawMessage
   * @param {function(*)} rawResponse
   * @private
   */
  listen(rawMessage, rawResponse) {
    if (rawMessage.transportId === this.transportId) return;

    let response;
    if (rawResponse) {
      response = onceFn((responseMessage, isForce) => {
        if (this.destroyError) {
          console.warn('Send response is skip cause:', this.destroyError);
        } else
        if (!rawMessage._responseFired) {
          rawMessage._responseFired = true;
          rawMessage._forceResponse = isForce;
          try {
            rawResponse(copyMessage(responseMessage));
          } catch (err) {
            console.warn('Send response error', err);
          }
        } else {
          console.warn('Send response is skip cause: Already fired');
        }
      });
    } else {
      response = emptyFn;
    }

    const result = this.callListeners(rawMessage.message, rawMessage.sender || {}, response);
    if (result === true) {
      rawMessage._asyncResponse = true;
    } else
    if (!rawMessage._responseFired) {
      setTimeout(() => {
        if (!rawMessage._responseFired && !rawMessage._asyncResponse) {
          response(undefined, true);
        }
      }, 1);
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
    super.addListener(listener);
    if (this.listeners.length > 0) {
      this.startListen();
    }
  }

  /**
   * @param {function} listener
   */
  removeListener(listener) {
    super.removeListener(listener);
    if (this.listeners.length === 0) {
      this.stopListen();
    }
  }

  getRawMessage(message) {
    return {
      transportId: this.transportId,
      message: copyMessage(message),
      sender: {
        url: location.href
      }
    };
  }

  /**
   * @param {*} message
   * @param {function(*)} [response]
   */
  sendMessage(message, response) {
    if (this.destroyError) throw this.destroyError;

    const rawMessage = this.getRawMessage(message, response);

    this.transport.sendMessage(rawMessage, response);
  }

  destroy() {
    this.destroyError = new Error('Transport is destroyed');
    this.listeners.splice(0);
    this.stopListen();
  }
}


/**
 * @typedef {RawTransportWithResponse} RawTransportWithResponsePage
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

    this.transport.sendMessageToActiveTab(rawMessage, response);
  }
}

export default Transport;
export {
  TransportWithActiveTab
};