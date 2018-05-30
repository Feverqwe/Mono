import ChromePageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";

class ChromePageMono extends ChromePageMonoMixin(PageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
}

export default ChromePageMono;