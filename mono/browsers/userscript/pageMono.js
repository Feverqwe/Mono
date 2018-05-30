import PageMono from "../../pageMono";
import UserscriptPageMonoMixin from "./pageMonoMixin";

class UserscriptPageMono extends UserscriptPageMonoMixin(PageMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
}

export default UserscriptPageMono;