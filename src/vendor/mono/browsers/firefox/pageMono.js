import FirefoxPageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";

class FirefoxPageMono extends FirefoxPageMonoMixin(PageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
}

export default FirefoxPageMono;