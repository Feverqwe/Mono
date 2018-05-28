class Messaging {
  constructor() {

    this.listener = this.listener.bind(this);

    this.init();
  }
  init() {
    safari.application.addEventListener('message', this.listener);
  }
  listener(event) {
    const {message, target} = event;
    const response = message => {
      if (target.page) {
        target.page.dispatchMessage('message', message);
      } else {
        console.warn('event.target.page is not exists');
      }
    };
    
    let result = window.monoDispatchMessage(message, response);
    safari.extension.popovers.forEach(popup => {
      const r = popup.contentWindow.monoDispatchMessage(message, response);
      if (r) {
        result = true;
      }
    });
    safari.application.browserWindows.forEach(window => {
      window.tabs.forEach(tab => {
        const page = tab.page;
        if (page && isSameOrigin(tab.url)) {
          page.dispatchMessage('message', {
            action: 'monoDispatchMessage',
            message
          });
        }
      });
    });
  }
  destroy() {
    safari.application.removeEventListener('message', this.listener);
  }
}

export default Messaging;