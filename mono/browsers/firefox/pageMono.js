import FirefoxPageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";
import FirefoxPageApiMixin from "./pageApiMixin";

class FirefoxPageMono extends FirefoxPageApiMixin(FirefoxPageMonoMixin(PageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
}

export default FirefoxPageMono;