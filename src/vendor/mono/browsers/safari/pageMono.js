import Storage from "../../storage";
import Mono from "../../mono";
import LsStorage from "../../lsStorage";
import {TransportWithActiveTab} from "../../transport";

class SafariPageMono extends Mono {
  initTransport() {
    const getEvent = message => {
      return {
        message: message,
        target: {
          tab: {
            dispatchMessage: (eventName, message) => {
              window.monoDispatchMessage(getEvent(message));
            }
          }
        }
      }
    };
    this.transport = new TransportWithActiveTab({
      addListener: listener => {
        listener._listener = event => listener(event.message, event);
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
        if (event.target.tab) {
          event.target.tab.dispatchMessage('message', message);
        } else {
          console.warn('event.target.tab is not exists', event);
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
            }
          }
        }
      },
    });
    window.monoDispatchMessage = event => this.transport.listen(event.message, event);
  }
  initStorage() {
    this.storage = new Storage(new LsStorage());
  }
  init() {
    super.init();
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
  }
}

export default SafariPageMono;