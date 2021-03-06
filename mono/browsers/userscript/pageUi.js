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
    this.executePageScripts();
  }
  createMono() {
    this.destroyMono();
    this.mono = this.bundle.createMonoInstance('page');
  }
  createPageContainer() {
    this.destroyContainer();
    this.containerNode = document.createElement('div');
    this.containerNode.innerHTML = this.getPageContent();
    document.body.appendChild(this.containerNode);
  }
  getPageContent() {
    return '';
  }
  getPageScripts() {
    return [];
  }
  executePageScripts() {
    return this.bundle.executeScripts(this.getPageScripts(), this.mono);
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