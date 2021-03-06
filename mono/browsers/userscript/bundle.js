import Router from "../../router";
import OptionsPageUi from "./optionsPageUi";
import UserscriptBackgroundPageMono from "./backgroundPageMono";
import UserscriptPageMono from "./pageMono";
import UserscriptContentScriptMono from "./contentScriptMono";

const {EventEmitter} = require('events');

class Bundle extends Router {
  constructor() {
    super();

    this.messaing = new EventEmitter();

    this.backgroundPageLoaded = false;
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
      return this.inject();
  }
  wakeUpBackgroundPage() {
    if (!this.backgroundPageLoaded) {
      this.backgroundPageLoaded = true;
      this.executeBackgroundScripts();
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
  executeBackgroundScripts() {
    this.executeScripts(this.backgroundScripts, this.getBackgroundPageMono());
  }
}

export default new Bundle();