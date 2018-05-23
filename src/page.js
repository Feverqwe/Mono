class Page {
  constructor(factory) {
    this.mono = null;
    this.factory = factory;
  }
  run() {
    return Promise.resolve().then(() => this.factory(this.mono));
  }
}

export default Page;