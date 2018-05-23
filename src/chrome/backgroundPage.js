import Page from "../page";

class ChromeBackgroundPage extends Page {
  constructor(factory) {
    super(factory);

    this.run();
  }
}

export default ChromeBackgroundPage;