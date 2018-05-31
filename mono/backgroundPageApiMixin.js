const BackgroundPageApiMixin = Parent => class extends Parent {
  openTab(url, active) {
    this.unimplemented();
  }
};

export default BackgroundPageApiMixin;