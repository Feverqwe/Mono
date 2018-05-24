class Router {
  constructor() {
    this.contentScripts = CONTENT_SCRIPTS;
    this.contentScriptMap = CONTENT_SCRIPT_MAP;
  }
  inject() {
    console.log('inject', this);
  }
}

export default Router;