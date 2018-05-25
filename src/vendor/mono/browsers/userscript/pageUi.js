const Mono = null;

class PageUi {
  constructor(bundle) {
    this.bundle = bundle;
    this.containerNode = null;
    this.mono = null;
  }
  create() {
    this.createPageContainer();
    this.createMono();
    this.mono.container = this.containerNode;
    this.executePageScript();
  }
  createMono() {
    this.destroyMono();
    this.mono = new Mono();
  }
  createPageContainer() {
    this.destroyContainer();
    this.containerNode = document.createElement('div');
    document.appendChild(this.containerNode);
  }
  getPageScripts() {
    return [];
  }
  executePageScript() {
    return new Function('MONO', this.getPageScripts().join('\n'))(this.mono);
  }
  destroyMono() {
    if (this.mono) {
      this.mono.destroy();
    }
    this.mono = null;
  }
  destroyContainer() {
    if (this.containerNode) {
      const parent = this.containerNode.parentNode;
      if (parent) {
        parent.removeChild(this.containerNode);
      }
    }
    this.containerNode = null;
  }
  destroy() {
    this.destroyMono();
    this.destroyContainer();
  }
}

export default PageUi;