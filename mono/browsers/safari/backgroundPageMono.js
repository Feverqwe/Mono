import BackgroundPageMono from "../../backgroundPageMono";
import SafariPageMonoMixin from "./pageMonoMixin";
import SafariBackgroundPageApiMixin from "./backgroundPageApiMixin";

class SafariBackgroundPageMono extends SafariBackgroundPageApiMixin(SafariPageMonoMixin(BackgroundPageMono)) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
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