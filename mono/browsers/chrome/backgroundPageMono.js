import ChromePageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";
import ChromeBackgroundPageApiMixin from "./backgroundPageApiMixin";

class ChromeBackgroundPageMono extends ChromeBackgroundPageApiMixin(ChromePageMonoMixin(BackgroundPageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default ChromeBackgroundPageMono;