import ApiMixin from "./apiMixin";

const BackgroundPageApiMixin = Parent => class extends ApiMixin(Parent) {
  openTab(url, active) {
    this.unimplemented();
  }
};

export default BackgroundPageApiMixin;