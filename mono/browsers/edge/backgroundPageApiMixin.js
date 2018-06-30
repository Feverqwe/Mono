import EdgeApiMixin from "./apiMixin";

const EdgeBackgroundPageApiMixin = Parent => class extends EdgeApiMixin(Parent) {
  openTab(url, active) {
    active = (active === undefined) ? true : !!active;
    browser.tabs.create({
      url: url,
      active: active
    });
  }
};

export default EdgeBackgroundPageApiMixin;