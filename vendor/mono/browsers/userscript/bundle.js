import Router from "../../router";

class Bundle extends Router {
  constructor() {
    super();

    this.localeMap = LOCALE_MAP;
    this.backgroudScripts = BACKGROUND_SCRIPTS;
    this.optionsScripts = OPTIONS_SCRIPTS;
    this.popupScripts = POPUP_SCRIPTS;

    this.init();
  }
  init() {

  }
}

export default new Bundle();