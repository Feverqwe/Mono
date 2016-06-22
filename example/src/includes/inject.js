/**
 * Created by Anton on 20.06.2016.
 */
mono.onReady(function () {
    if (mono.isSafari && !/^https?:\/\/ya\.ru\/(.+|$)/.test(location.href)) {
        return;
    }

    console.error("Inject page!");

    var onReady = function () {
        initBase('inject');
    };

    var onDomReady = function () {
        document.removeEventListener("DOMContentLoaded", onDomReady, false);
        window.removeEventListener("load", onDomReady, false);
        onReady();
    };
    if (document.readyState === 'complete') {
        onDomReady();
    } else {
        document.addEventListener('DOMContentLoaded', onDomReady, false);
        window.addEventListener('load', onDomReady, false);
    }
});