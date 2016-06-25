var browserApi = function () {
    "use strict";
    var isInject = !chrome.hasOwnProperty('tabs');
    var isBgPage = false;
    (function () {
        if (chrome.runtime.hasOwnProperty('getBackgroundPage')) {
            isBgPage = location.href.indexOf('_generated_background_page.html') !== -1;
            //@if chromeForceDefineBgPage=1>
            try {
                chrome.runtime.getBackgroundPage(function(bgWin) {
                    isBgPage = bgWin === window;
                });
            } catch (e){}
            //@if chromeForceDefineBgPage=1<
        }
    })();

    var emptyFn = function () {};

    /**
     * @param {Function} fn
     * @returns {Function}
     */
    var onceFn = function (fn) {
        return function (msg) {
            if (fn) {
                fn(msg);
                fn = null;
            }
        };
    };

    /**
     * @returns {Number}
     */
    var getTime = function () {
        return parseInt(Date.now() / 1000);
    };

    var msgTools = {
        id: 0,
        idPrefix: Math.floor(Math.random() * 1000),
        /**
         * @returns {String}
         */
        getId: function () {
            return this.idPrefix + '_' + (++this.id);
        },
        /**
         * @typedef {Object} Sender
         * @property {Object} [tab]
         * @property {number} tab.callbackId
         * @property {number} [frameId]
         */
        /**
         * @param {Function} sendResponse
         * @param {Sender} sender
         * @returns {Function}
         */
        asyncSendResponse: function (sendResponse, sender) {
            var id = this.getId();

            var message = this.wrap();
            message.async = true;
            message.callbackId = id;
            sendResponse(message);

            return function (message) {
                message.async = true;
                message.responseId = id;

                if (sender.tab && sender.tab.id >= 0) {
                    chrome.tabs.sendMessage(sender.tab.id, message, {frameId: sender.frameId});
                } else {
                    chrome.runtime.sendMessage(message);
                }
            };
        },
        listenerList: [],
        /**
         * @typedef {Object} MonoMsg
         * @property {boolean} mono
         * @property {string} [hook]
         * @property {string} idPrefix
         * @property {string} [callbackId]
         * @property {boolean} [async]
         * @property {boolean} isBgPage
         * @property {string} [responseId]
         * @property {boolean} hasCallback
         * @property {*} data
         */
        /**
         * @param {MonoMsg} message
         * @param {Sender} sender
         * @param {Function} sendResponse
         */
        listener: function (message, sender, sendResponse) {
            var _this = msgTools;
            if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
                if (!message.hasCallback) {
                    sendResponse = emptyFn;
                }
                var responseFn = onceFn(function (msg) {
                    var message = _this.wrap(msg);
                    sendResponse(message);
                    sendResponse = null;
                });

                _this.listenerList.forEach(function (fn) {
                    if (message.hook === fn.hook) {
                        fn(message.data, responseFn);
                    }
                });

                if (sendResponse && message.hasCallback) {
                    sendResponse = _this.asyncSendResponse(sendResponse, sender);
                }
            }
        },
        async: {},
        /**
         *
         * @param {MonoMsg} message
         * @param {Sender} sender
         * @param {Function} sendResponse
         */
        asyncListener: function (message, sender, sendResponse) {
            var _this = msgTools;
            if (message && message.mono && message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
                var fn = _this.async[message.responseId].fn;
                if (fn) {
                    delete _this.async[message.responseId];
                    if (!Object.keys(_this.async).length) {
                        chrome.runtime.onMessage.removeListener(_this.asyncListener);
                    }

                    fn(message.data);
                }
            }

            _this.gc();
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
        },
        /**
         * @param {string} id
         * @param {Function} responseCallback
         */
        wait: function (id, responseCallback) {
            this.async[id] = {
                fn: responseCallback,
                time: getTime()
            };

            if (!chrome.runtime.onMessage.hasListener(this.asyncListener)) {
                chrome.runtime.onMessage.addListener(this.asyncListener);
            }

            this.gc();
        },
        responseFn: function (responseCallback) {
            return responseCallback && function (message) {
                if (!message || !message.mono) {
                    return;
                }

                if (!message.async) {
                    return responseCallback(message.data);
                } else {
                    return msgTools.wait(message.callbackId, responseCallback);
                }
            } || emptyFn; // < chrome 27 fix
        },
        gcTimeout: 0,
        gc: function () {
            var expire = 180;
            var now = getTime();
            if (this.gcTimeout < now) {
                this.gcTimeout = now + expire;
                var async = this.async;
                Object.keys(async).forEach(function (responseId) {
                    if (async[responseId].time + expire < now) {
                        delete async[responseId];
                    }
                });

                if (!Object.keys(async).length) {
                    chrome.runtime.onMessage.removeListener(this.asyncListener);
                }
            }
        }
    };

    var api = {
        isChrome: true,
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessageToActiveTab: function (msg, responseCallback) {
            var message = msgTools.wrap(msg);

            message.hasCallback = !!responseCallback;
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                var tabId = tabs[0] && tabs[0].id;
                if (tabId >= 0) {
                    chrome.tabs.sendMessage(tabId, message, msgTools.responseFn(responseCallback));
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
            
            message.hasCallback = !!responseCallback;
            chrome.runtime.sendMessage(message, msgTools.responseFn(responseCallback));
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

                if (!chrome.runtime.onMessage.hasListener(msgTools.listener)) {
                    chrome.runtime.onMessage.addListener(msgTools.listener);
                }
            },
            /**
             * @param {Function} callback
             */
            removeListener: function(callback) {
                var pos = msgTools.listenerList.indexOf(callback);
                if (pos !== -1) {
                    msgTools.listenerList.splice(pos, 1);
                }

                if (!msgTools.listenerList.length) {
                    chrome.runtime.onMessage.removeListener(msgTools.listener);
                }
            }
        }
    };

    var initChromeStorage = function () {
        return {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                chrome.storage.local.get(keys, callback);
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                chrome.storage.local.set(items, callback);
            },
            /**
             * @param {String|[String]} [keys]
             * @param {Function} [callback]
             */
            remove: function (keys, callback) {
                chrome.storage.local.remove(keys, callback);
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                chrome.storage.local.clear(callback);
            }
        };
    };

    //@if useLocalStorage=1>
    //@include ../../components/localStorage.js
    //@if useLocalStorage=1<

    if (chrome.storage) {
        api.storage = initChromeStorage();
    }
    //@if useLocalStorage=1>
    else {
        api.storage = initLocalStorage(isInject);
    }
    //@if useLocalStorage=1<

    return api;
};