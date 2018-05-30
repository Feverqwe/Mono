import PageUi from "./pageUi";

class PopupPageUi extends PageUi {
  constructor(bundle) {
    super(bundle);

    this.popupPage = POPUP_PAGE;
    this.popupScripts = POPUP_SCRIPTS;
  }
  getPageContent() {
    return this.popupPage;
  }
  getPageScripts() {
    return this.popupScripts;
  }
}

export default PopupPageUi;