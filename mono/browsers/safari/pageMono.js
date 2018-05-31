import PageMono from "../../pageMono";
import SafariPageMonoMixin from "./pageMonoMixin";
import SafariPageApiMixin from "./pageApiMixin";

class SafariPageMono extends SafariPageApiMixin(SafariPageMonoMixin(PageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default SafariPageMono;