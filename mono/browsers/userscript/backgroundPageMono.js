import BackgroundPageMono from "../../backgroundPageMono";
import UserscriptPageMonoMixin from "./pageMonoMixin";
import UserscriptBackgroundPageApiMixin from "./backgroundPageApiMixin";

class UserscriptBackgroundPageMono extends UserscriptBackgroundPageApiMixin(UserscriptPageMonoMixin(BackgroundPageMono)) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default UserscriptBackgroundPageMono;