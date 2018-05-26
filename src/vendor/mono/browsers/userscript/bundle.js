import Router from "../../router";
import PopupPageUi from "./popupPageUi";
import OptionsPageUi from "./optionsPageUi";
import UserscriptBackgroundPageMono from "./backgroundPageMono";
import UserscriptPageMono from "./pageMono";
import UserscriptContentScriptMono from "./contentScriptMono";

class Bundle extends Router {
  constructor() {
    super();

    this.backgroundScripts = BACKGROUND_SCRIPTS;
    this.backgroundPageMono = null;

    this.popupPageUi = null;
    this.optionsPageUi = null;

    this.init();
  }
  createMonoInstance(type) {
    let instance = null;
    switch (type) {
      case 'backgroundPage': {
        instance = new UserscriptBackgroundPageMono(this);
        break;
      }
      case 'page': {
        instance = new UserscriptPageMono(this);
        break;
      }
      case 'contentScript': {
        instance = new UserscriptContentScriptMono(this);
        break;
      }
      default: {
        super.createMonoInstance(type);
      }
    }
    this.addMonoInstance(instance);
    return instance;
  }
  init() {
    if (this.hasInjectScripts()) {
      this.runBackgroundPage().then(() => {
        return this.inject();
      });
    }
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
  getBackgroundPageMono() {
    if (!this.backgroundPageMono) {
      this.backgroundPageMono = this.createMonoInstance('backgroundPage');
    }
    return this.backgroundPageMono;
  }
  runBackgroundPage() {
    return Promise.resolve().then(() => {
      this.executeBackgroundScript(this.backgroundScripts.join('\n'), this.getBackgroundPageMono());
    });
  }
  executeBackgroundScript(code, mono) {
    return new Function('MONO', code)(mono);
  }
}

export default new Bundle();