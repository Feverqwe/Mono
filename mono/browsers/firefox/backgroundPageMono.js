import FirefoxPageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";
import FirefoxBackgroundPageApiMixin from "./backgroundPageApiMixin";

class FirefoxBackgroundPageMono extends FirefoxBackgroundPageApiMixin(FirefoxPageMonoMixin(BackgroundPageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default FirefoxBackgroundPageMono;