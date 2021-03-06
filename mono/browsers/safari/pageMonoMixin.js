import LsStorage from "../../lsStorage";
import LocaleMixin from "../../localeMixin";
import {SafariTransportWithActiveTab} from "./transport";
import StorageMixin from "../../storageMixin";
import SafariStorageChangesMixin from "./storageChangesMixin";

const SafariPageMonoMixin = Parent => class extends LocaleMixin(Parent) {
  initI18n() {
    this.i18n = {
      getMessage: (message) => {
        if (!this.locale) {
          this.locale = this.getLocale();
        }
        const item = this.locale[message];
        return item && item.message || '';
      }
    };
  }
  initMessages() {
    const getEvent = message => {
      return {
        message: Object.assign({}, message),
        target: {
          page: {
            dispatchMessage: (eventName, message) => {
              window.monoDispatchMessage(getEvent(message));
            }
          }
        }
      }
    };

    this.transport = new SafariTransportWithActiveTab(this, {
      addListener: listener => {
        if (!listener._listener) {
          listener._listener = event => listener(event.message, event);
        }
        safari.application.addEventListener('message', listener._listener);
      },
      removeListener: listener => {
        if (listener._listener) {
          safari.application.removeEventListener('message', listener._listener);
        }
      },
      sendMessage: message => {
        safari.extension.globalPage.contentWindow.monoDispatchMessage(getEvent(message));
        safari.extension.popovers.forEach(popup => {
          popup.contentWindow.monoDispatchMessage(getEvent(message));
        });
      },
      sendMessageTo: (message, event) => {
        if (event.target.page) {
          event.target.page.dispatchMessage('message', message);
        } else {
          throw new Error('event.target.page is not exists');
        }
      },
      sendMessageToActiveTab: message => {
        const activeBrowserWindow = safari.application.activeBrowserWindow;
        if (activeBrowserWindow) {
          const activeTab = safari.application.activeBrowserWindow.activeTab;
          if (activeTab) {
            const page = activeTab.page;
            if (page) {
              page.dispatchMessage('message', message);
            } else {
              throw new Error('Active page not exists');
            }
          } else {
            throw new Error('Active tab not found');
          }
        } else {
          throw new Error('Active window not found');
        }
      },
      sendMessageToAll: message => {
        safari.extension.globalPage.contentWindow.monoDispatchMessage(getEvent(message));
        safari.extension.popovers.forEach(popup => {
          popup.contentWindow.monoDispatchMessage(getEvent(message));
        });
        safari.application.browserWindows.forEach(window => {
          window.tabs.forEach(tab => {
            tab.page.dispatchMessage('message', message);
          });
        });
      }
    });

    window.monoDispatchMessage = event => {
      if (this.transport.isListen) {
        this.transport.listen(event.message, event);
      }
    };

    super.initMessages();
  }
  initStorage() {
    this.storage = new (StorageMixin(SafariStorageChangesMixin(LsStorage)))(this);
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
};

export default SafariPageMonoMixin;