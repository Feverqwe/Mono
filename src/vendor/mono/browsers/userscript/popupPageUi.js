import PageUi from "./pageUi";

class PopupPageUi extends PageUi {
  constructor(bundle) {
    super(bundle);

    this.popupScripts = POPUP_SCRIPTS;
  }
  getPageScripts() {
    return this.popupScripts;
  }
}

export default PopupPageUi;