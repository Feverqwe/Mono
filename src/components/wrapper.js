var mono = (typeof mono !== 'undefined') ? mono : undefined;

(function(base, factory) {
    "use strict";
    if (mono && mono.isLoaded) {
        return;
    }

    var _mono = mono;
    var fn = function (addon) {
        return factory(_mono, addon);
    };

    if (typeof window !== "undefined") {
        mono = base(fn);
        return;
    }

    //@if0 useFf=1>
    exports.isFF = true;
    exports.isModule = true;

    exports.init = fn;
    //@if0 useFf=1<
}(function base(factory) {
    if (['interactive', 'complete'].indexOf(document.readyState) !== -1) {
        return factory();
    }

    var base = {
        isLoaded: true,
        onReadyStack: [],
        onReady: function() {
            base.onReadyStack.push([this, arguments]);
        }
    };

    var onLoad = function() {
        document.removeEventListener('DOMContentLoaded', onLoad, false);
        window.removeEventListener('load', onLoad, false);

        mono = factory();

        var item;
        while (item = base.onReadyStack.shift()) {
            mono.onReady.apply(item[0], item[1]);
        }
    };

    document.addEventListener('DOMContentLoaded', onLoad, false);
    window.addEventListener('load', onLoad, false);

    return base;
}, function initMono(_mono, _addon) {
    "use strict";
    //@include {browserApiPath}

    var mono = browserApi(_addon).api;
    mono.isLoaded = true;
    mono.onReady = function(cb) {
        return cb();
    };

    //@if true=false>
    0 !== 0 && (window.mono = mono);
    //@if true=false<

    //@insert

    return mono;
}));