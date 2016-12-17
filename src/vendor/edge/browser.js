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

    var msgTools = {
        idPrefix: Math.floor(Math.random() * 1000),
        /**
         * @typedef {Object} Sender
         * @property {Object} [tab]
         * @property {number} [frameId]
         */
        listenerList: [],
        /**
         * @typedef {Object} MonoMsg
         * @property {boolean} mono
         * @property {string} [hook]
         * @property {string} idPrefix
         * @property {boolean} isBgPage
         * @property {string} [responseId]
         * @property {*} data
         */
        /**
         * @param {MonoMsg} message
         * @param {Sender} sender
         * @param {Function} response
         */
        listener: function (message, sender, response) {
            var _this = msgTools;
            if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
                _this.listenerList.forEach(function (fn) {
                    if (message.hook === fn.hook) {
                        fn(message.data, response);
                    }
                });
                return true;
            }
        },
        /**
         * @param {*} [msg]
         * @returns {MonoMsg}
         */
        wrap: function (msg) {
            return {
                mono: true,
                data: msg,
                idPrefix: this.idPrefix,
                isBgPage: isBgPage
            };
        }
    };

    var api = {
        isEdge: true,
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessageToActiveTab: function (msg, responseCallback) {
            var message = msgTools.wrap(msg);

            browser.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                var tabId = tabs[0] && tabs[0].id;
                if (tabId >= 0) {
                    browser.tabs.sendMessage(tabId, message, responseCallback);
                }
            });
        },
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         * @param {String} [hook]
         */
        sendMessage: function (msg, responseCallback, hook) {
            var message = msgTools.wrap(msg);
            hook && (message.hook = hook);
            browser.runtime.sendMessage(message, responseCallback);
        },
        onMessage: {
            /**
             * @param {Function} callback
             * @param {Object} [details]
             */
            addListener: function (callback, details) {
                details = details || {};
                details.hook && (callback.hook = details.hook);

                if (msgTools.listenerList.indexOf(callback) === -1) {
                    msgTools.listenerList.push(callback);
                }

                if (!browser.runtime.onMessage.hasListener(msgTools.listener)) {
                    browser.runtime.onMessage.addListener(msgTools.listener);
                }
            },
            /**
             * @param {Function} callback
             */
            removeListener: function (callback) {
                var pos = msgTools.listenerList.indexOf(callback);
                if (pos !== -1) {
                    msgTools.listenerList.splice(pos, 1);
                }

                if (!msgTools.listenerList.length) {
                    browser.runtime.onMessage.removeListener(msgTools.listener);
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