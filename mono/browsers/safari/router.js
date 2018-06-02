import Router from "../../router";
import SafariContentScriptMono from "./contentScriptMono";

class SafariRouter extends Router {
  constructor() {
    super();

    this.inject();
  }
  createMonoInstance(type) {
    let instance = null;
    switch (type) {
      case 'contentScript': {
        instance = new SafariContentScriptMono(this);
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

export default typeof safari !== 'undefined' && new SafariRouter();