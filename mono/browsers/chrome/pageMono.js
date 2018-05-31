import ChromePageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";
import ChromePageApiMixin from "./pageApiMixin";

class ChromePageMono extends ChromePageApiMixin(ChromePageMonoMixin(PageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default ChromePageMono;