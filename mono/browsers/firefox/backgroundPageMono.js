import FirefoxPageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";

class FirefoxBackgroundPageMono extends FirefoxPageMonoMixin(BackgroundPageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default FirefoxBackgroundPageMono;