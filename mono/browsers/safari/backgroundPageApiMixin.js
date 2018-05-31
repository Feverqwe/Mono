import SafariApiMixin from "./apiMixin";

const SafariBackgroundPageApiMixin = Parent => class extends SafariApiMixin(Parent) {
  openTab(url, active) {
    let tab = null;
    let activeWindow = safari.application.activeBrowserWindow;
    if (activeWindow) {
      tab = activeWindow.openTab();
    } else {
      tab = safari.application.openBrowserWindow().activeTab;
    }
    tab.url = url;
    if (active) {
      tab.activate();
    }
  }
};

export default SafariBackgroundPageApiMixin;