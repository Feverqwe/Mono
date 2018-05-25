import Router from "../../router";
import PopupPageUi from "./popupPageUi";
import OptionsPageUi from "./optionsPageUi";

class Bundle extends Router {
  constructor() {
    super();

    this.backgroundScripts = BACKGROUND_SCRIPTS;

    this.popupPageUi = null;
    this.optionsPageUi = null;

    this.init();
  }
  init() {
    this.runBackgroundPage().then(() => {
      return this.inject();
    });
  }
  showPopup() {
    this.closePopup();
    this.popupPageUi = new PopupPageUi(this);
    this.popupPageUi.create();
  }
  closePopup() {
    if (this.popupPageUi) {
      this.popupPageUi.destroy();
    }
    this.popupPageUi = null;
  }
  showOptions() {
    this.closeOptions();
    this.optionsPageUi = new OptionsPageUi(this);
    this.optionsPageUi.create();
  }
  closeOptions() {
    if (this.optionsPageUi) {
      this.optionsPageUi.destroy();
    }
    this.optionsPageUi = null;
  }
  runBackgroundPage() {
    return Promise.resolve().then(() => {
      this.executeBackgroundScript(this.backgroundScripts.join('\n'), null);
    });
  }
  executeBackgroundScript(code, mono) {
    return new Function('MONO', code)(mono);
  }
}

export default new Bundle();