import PageUi from "./pageUi";

class OptionsPageUi extends PageUi {
  constructor(bundle) {
    super(bundle);

    this.optionsScripts = OPTIONS_SCRIPTS;
  }
  getPageScripts() {
    return this.bundle.optionsScripts;
  }
}

export default OptionsPageUi;