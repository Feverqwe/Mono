import Storage from "../../storage";
import Mono from "../../mono";
import LsStorage from "../../lsStorage";
import isSameOrigin from "./isSameOrigin";
import {TransportWithActiveTab} from "../../transport";

class SafariPageMono extends Mono {
  initTransport() {
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
        safari.extension.popovers.forEach(popup => {
          popup.contentWindow.monoDispatchMessage({
            message: message,
            target: {
              page: {
                dispatchMessage: window.monoDispatchMessage
              }
            }
          });
        });
        safari.application.browserWindows.forEach(window => {
          window.tabs.forEach(tab => {
            const page = tab.page;
            if (page && isSameOrigin(tab.url)) {
              page.dispatchMessage('message', message);
            }
          });
        });
      },
      sendMessageTo: (message, event) => {
        if (event.target.page) {
          event.target.page.dispatchMessage('message', message);
        } else {
          console.warn('event.target.page is not exists');
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
    window.monoDispatchMessage = this.transport.listen._listener;
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