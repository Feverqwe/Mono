import FirefoxApiMixin from "./apiMixin";

const FirefoxBackgroundPageApiMixin = Parent => class extends FirefoxApiMixin(Parent) {
  openTab(url, active) {
    active = (active === undefined) ? true : !!active;
    browser.tabs.create({
      url: url,
      active: active
    });
  }
};

export default FirefoxBackgroundPageApiMixin;