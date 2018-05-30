import PageUi from "./pageUi";

class OptionsPageUi extends PageUi {
  constructor(bundle) {
    super(bundle);

    this.optionsPage = OPTIONS_PAGE;
    this.optionsScripts = OPTIONS_SCRIPTS;
  }
  getPageContent() {
    return this.optionsPage;
  }
  getPageScripts() {
    return this.bundle.optionsScripts;
  }
}

export default OptionsPageUi;