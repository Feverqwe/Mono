import EdgePageMonoMixin from "./pageMonoMixin";
import BackgroundPageMono from "../../backgroundPageMono";
import EdgeBackgroundPageApiMixin from "./backgroundPageApiMixin";

class EdgeBackgroundPageMono extends EdgeBackgroundPageApiMixin(EdgePageMonoMixin(BackgroundPageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default EdgeBackgroundPageMono;