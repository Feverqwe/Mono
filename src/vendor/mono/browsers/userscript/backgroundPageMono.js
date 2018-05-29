import BackgroundPageMono from "../../backgroundPageMono";
import UserscriptPageMono from "./pageMono";

class UserscriptBackgroundPageMono extends UserscriptPageMono(BackgroundPageMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
  }
}

export default UserscriptBackgroundPageMono;