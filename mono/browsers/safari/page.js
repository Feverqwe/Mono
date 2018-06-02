import SafariPageMono from "./pageMono";
import SafariContentScriptMono from "./contentScriptMono";
import LocaleMixin from "../../localeMixin";

const mono = safari.application ? new SafariPageMono() : new SafariContentScriptMono(new (LocaleMixin(class {}))());

export default mono;