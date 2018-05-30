import BackgroundPageMono from "../../backgroundPageMono";
import UserscriptPageMonoMixin from "./pageMonoMixin";

class UserscriptBackgroundPageMono extends UserscriptPageMonoMixin(BackgroundPageMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default UserscriptBackgroundPageMono;