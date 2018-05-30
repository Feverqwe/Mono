import SafariPageMono from "./pageMono";
import SafariContentScriptMono from "./contentScriptMono";

const mono = safari.application ? new SafariPageMono() : new SafariContentScriptMono();

export default mono;