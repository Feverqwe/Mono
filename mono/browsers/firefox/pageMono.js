import FirefoxPageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";
import FirefoxPageApiMixin from "./pageApiMixin";

class FirefoxPageMono extends FirefoxPageApiMixin(FirefoxPageMonoMixin(PageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default FirefoxPageMono;