import Router from "../../router";

class SafariRouter extends Router {
  constructor() {
    super();

    this.inject();
  }
}

export default new SafariRouter();