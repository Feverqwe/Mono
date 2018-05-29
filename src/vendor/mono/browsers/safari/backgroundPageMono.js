import BackgroundPageMono from "../../backgroundPageMono";
import SafariPageMono from "./pageMono";

class SafariBackgroundPageMono extends SafariPageMono(BackgroundPageMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initOptions();
  }
  initOptions() {
    safari.extension.settings.addEventListener('change', event => {
      if (event.key === 'open_options') {
        this.openTab(safari.extension.baseURI + 'options.html', true);
      }
    });
  }
}

export default SafariBackgroundPageMono;