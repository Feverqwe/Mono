import ChromePageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";

class ChromeBackgroundPageMono extends ChromePageMonoMixin(BackgroundPageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
}

export default ChromeBackgroundPageMono;