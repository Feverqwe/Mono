import Mono from "./mono";
import PageMonoMixin from "./pageMonoMixin";
import CallFnMixin from "./callFnMixin";
import PageApiMixin from "./pageApiMixin";

class PageMono extends PageApiMixin(CallFnMixin(PageMonoMixin(Mono))) {

}

export default PageMono;