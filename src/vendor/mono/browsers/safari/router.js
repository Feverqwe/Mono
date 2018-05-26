import Router from "../../router";

class SafariRouter extends Router {
  constructor() {
    super();

    this.inject();
  }
  createMonoInstance(type) {
    let instance = null;
    switch (type) {
      case 'contentScript': {
        instance = null; // new Mono(this);
        break;
      }
      default: {
        super.createMonoInstance(type);
      }
    }
    this.addMonoInstance(instance);
    return instance;
  }
}

export default new SafariRouter();