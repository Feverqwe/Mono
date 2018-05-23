import Page from "../page";

class ChromeContentScript extends Page {
  constructor(factory) {
    super(factory);

    this.run();
  }
}

export default ChromeContentScript;