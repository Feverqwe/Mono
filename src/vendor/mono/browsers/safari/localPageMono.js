import PageMono from "../../pageMono";
import SafariPageMono from "./pageMono";

class SafariLocalPageMono extends SafariPageMono(PageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
}

export default SafariLocalPageMono;