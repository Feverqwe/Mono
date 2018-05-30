import PageMono from "../../pageMono";
import SafariPageMonoMixin from "./pageMonoMixin";

class SafariPageMono extends SafariPageMonoMixin(PageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default SafariPageMono;