import Mono from "./mono";
import PageMonoMixin from "./pageMonoMixin";
import CallFnListenerMixin from "./callFnListenerMixin";
import BackgroundPageApiMixin from "./backgroundPageApiMixin";

class BackgroundPageMono extends BackgroundPageApiMixin(CallFnListenerMixin(PageMonoMixin(Mono))) {

}

export default BackgroundPageMono;