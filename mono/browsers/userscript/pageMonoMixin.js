import UserscriptStorage from "./storage";
import Storage from "../../storage";
import {TransportWithActiveTab} from "../../transport";
import GmStorage from "./gmStorage";

const UserscriptPageMonoMixin = Parent => class extends Parent {
  initI18n() {
    this.locale = this.bundle.getLocale();
    this.i18n = {
      getMessage: (message) => {
        const item = this.locale[message];
        return item && item.message || '';
      }
    };
  }
  initMessages() {
    this.transport = new TransportWithActiveTab({
      addListener: listener => {
        this.bundle.messaing.addListener('page', listener);
        this.bundle.messaing.addListener('fromActiveTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('page', listener);
        this.bundle.messaing.removeListener('fromActiveTab', listener);
      },
      sendMessage: (message, response) => {
        const result = this.bundle.messaing.emit('page', message, response);
        if (!result) {
          console.info('No one received a message');
          response();
        }
      },
      sendMessageToActiveTab: (message, response) => {
        const result = this.bundle.messaing.emit('toActiveTab', message, response);
        if (!result) {
          console.info('No one received a message');
          response();
        }
      },
    });

    super.initMessages();
  }
  initStorage() {
    if (typeof GM === 'object') {
      this.storage = new Storage(this, new GmStorage());
    } else {
      this.storage = new Storage(this, new UserscriptStorage());
    }
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
};

export default UserscriptPageMonoMixin;