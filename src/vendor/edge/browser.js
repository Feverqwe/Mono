var browserApi = function () {
    "use strict";
    var isInject = location.protocol !== 'ms-browser-extension:' || location.host !== browser.runtime.id;
    var isBgPage = false;
    !isInject && (function () {
        isBgPage = location.pathname.indexOf('_generated_background_page.html') !== -1;
        //@if edgeForceDefineBgPage=1>
        if (!isBgPage && browser.runtime.hasOwnProperty('getBackgroundPage')) {
            try {
                browser.runtime.getBackgroundPage(function (bgWin) {
                    isBgPage = bgWin === window;
                });
            } catch (e) {}
        }
        //@if edgeForceDefineBgPage=1<
    })();

    var cbWrapper = {
        map: {},
        wrapFn: function (fn) {
            var id;
            do {
                id = parseInt(Math.random() * 1000);
            } while (this.map[id]);
            fn.monoWrapperId = id;
            return this.map[id] = function (msg, sender, response) {
                fn(msg, response);
                return true;
            };
        },
        getFn: function (fn) {
            return this.map[fn.monoWrapperId] || this.wrapFn(fn);
        },
        removeFn: function (fn) {
            var id = fn.monoWrapperId;
            delete this.map[id];
        }
    };

    var api = {
        isEdge: true,
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessageToActiveTab: function (msg, responseCallback) {
            browser.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                var tabId = tabs[0] && tabs[0].id;
                if (tabId >= 0) {
                    browser.tabs.sendMessage(tabId, msg, responseCallback);
                }
            });
        },
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessage: function (msg, responseCallback) {
            browser.runtime.sendMessage(msg, responseCallback);
        },
        onMessage: {
            /**
             * @param {Function} callback
             */
            addListener: function (callback) {
                var wrappedCallback = cbWrapper.getFn(callback);
                if (!browser.runtime.onMessage.hasListener(wrappedCallback)) {
                    browser.runtime.onMessage.addListener(wrappedCallback);
                }
            },
            /**
             * @param {Function} callback
             */
            removeListener: function (callback) {
                var wrappedCallback = cbWrapper.getFn(callback);
                if (browser.runtime.onMessage.hasListener(wrappedCallback)) {
                    browser.runtime.onMessage.removeListener(wrappedCallback);
                    cbWrapper.removeFn(callback);
                }
            }
        }
    };

    var initEdgeStorage = function () {
        return {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                browser.storage.local.get(keys, callback);
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                browser.storage.local.set(items, callback);
            },
            /**
             * @param {String|[String]} [keys]
             * @param {Function} [callback]
             */
            remove: function (keys, callback) {
                browser.storage.local.remove(keys, callback);
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                browser.storage.local.clear(callback);
            }
        };
    };
    
    //@if useLocalStorage=1>
    //@include ../../components/localStorage.js
    //@if useLocalStorage=1<

    if (browser.storage) {
        api.storage = initEdgeStorage();
    }
    //@if useLocalStorage=1>
    else {
        api.storage = initLocalStorage(isInject);
    }
    //@if useLocalStorage=1<

    return {
        api: api
    };
};