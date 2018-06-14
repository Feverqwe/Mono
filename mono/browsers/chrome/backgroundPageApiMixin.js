import ChromeApiMixin from "./apiMixin";

const ChromeBackgroundPageApiMixin = Parent => class extends ChromeApiMixin(Parent) {
  openTab(url, active) {
    active = (active === undefined) ? true : !!active;
    chrome.tabs.create({
      url: url,
      active: active
    });
  }
};

export default ChromeBackgroundPageApiMixin;