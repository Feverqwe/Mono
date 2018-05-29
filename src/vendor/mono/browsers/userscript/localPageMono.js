import PageMono from "../../pageMono";
import UserscriptPageMono from "./pageMono";

class UserscriptLocalPageMono extends UserscriptPageMono(PageMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
  }
}

export default UserscriptLocalPageMono;