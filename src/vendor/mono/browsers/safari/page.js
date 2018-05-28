import SafariPageMono from "./pageMono";
import SafariContentScriptPageMono from "./contentScriptPageMono";

const mono = safari.application ? new SafariPageMono() : new SafariContentScriptPageMono();

export default mono;