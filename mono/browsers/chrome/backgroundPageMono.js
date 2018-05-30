import ChromePageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";

class ChromeBackgroundPageMono extends ChromePageMonoMixin(BackgroundPageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default ChromeBackgroundPageMono;