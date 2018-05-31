import Mono from "./mono";
import PageMonoMixin from "./pageMonoMixin";
import CallFnMixin from "./callFnMixin";

class PageMono extends CallFnMixin(PageMonoMixin(Mono)) {

}

export default PageMono;