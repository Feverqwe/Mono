import SafariLocalPageMono from "./localPageMono";
import SafariContentScriptMono from "./contentScriptMono";

const mono = safari.application ? new SafariLocalPageMono() : new SafariContentScriptMono();

export default mono;