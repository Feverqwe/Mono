import BackgroundPageMono from "../../backgroundPageMono";
import UserscriptPageMonoMixin from "./pageMonoMixin";

class UserscriptBackgroundPageMono extends UserscriptPageMonoMixin(BackgroundPageMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
  }
}

export default UserscriptBackgroundPageMono;