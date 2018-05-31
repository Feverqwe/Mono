import PageMono from "../../pageMono";
import UserscriptPageMonoMixin from "./pageMonoMixin";
import UserscriptPageApiMixin from "./pageApiMixin";

class UserscriptPageMono extends UserscriptPageApiMixin(UserscriptPageMonoMixin(PageMono)) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default UserscriptPageMono;