import EdgePageMonoMixin from "./pageMonoMixin";
import PageMono from "../../pageMono";
import EdgePageApiMixin from "./pageApiMixin";

class EdgePageMono extends EdgePageApiMixin(EdgePageMonoMixin(PageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default EdgePageMono;