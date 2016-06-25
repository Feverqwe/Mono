var browserApi = function () {
    "use strict";
    var isPopup = safari.self.identifier === 'popup';
    var isBgPage = safari.self.addEventListener === undefined;
    var isInject = !isPopup && safari.application === undefined;

    var localUrl = null;
    var localUrlLen = null;
    if (isBgPage) {
        localUrl = location.href.substr(0, location.href.indexOf('/', 19));
        localUrlLen = localUrl.length;
    }

    var emptyFn = function () {};

    var cloneObj = function (msg) {
        var obj = null;
        try {
            obj = JSON.parse(JSON.stringify({w:msg})).w;
        } catch (e) {
            console.error('CloneObj error!', e);
        }

        return obj;
    };

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
         * @typedef {Object} Target
         * @property {Object} page
         * @property {Function} page.dispatchMessage
         */
        /**
         * @param {string} id
         * @param {Target} target
         * @returns {Function}
         */
        asyncSendResponse: function (id, target) {
            return function (message) {
                message.responseId = id;

                target.page.dispatchMessage("message", message);
            };
        },
        listenerList: [],
        /**
         * @typedef {Object} MonoMsg
         * @property {boolean} mono
         * @property {string} [hook]
         * @property {string} idPrefix
         * @property {string} [callbackId]
         * @property {string} [responseId]
         * @property {boolean} hasCallback
         * @property {*} data
         */
        /**
         * @param {Object} event
         * @param {MonoMsg} event.message
         * @param {Target} event.target
         */
        listener: function (event) {
            var _this = msgTools;
            var sendResponse = null;
            var message = event.message;
            if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix) {
                if (!message.hasCallback) {
                    sendResponse = emptyFn;
                } else {
                    sendResponse = _this.asyncSendResponse(message.callbackId, event.target);
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
            }
        },
        async: {},
        /**
         * @param {Object} event
         * @param {MonoMsg} event.message
         * @param {Target} event.target
         */
        asyncListener: function (event) {
            var _this = msgTools;
            var message = event.message;
            if (message && message.mono && message.responseId && message.idPrefix !== _this.idPrefix) {
                var fn = _this.async[message.responseId].fn;
                if (fn) {
                    delete _this.async[message.responseId];
                    if (!Object.keys(_this.async).length) {
                        msgTools.removeMessageListener(_this.asyncListener);
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
                idPrefix: this.idPrefix
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

            msgTools.addMessageListener(this.asyncListener);

            this.gc();
        },
        /**
         * @param {MonoMsg} message
         */
        broadcastMessage: function (message) {
            var _this = this;
            for (var p = 0, popup; popup = safari.extension.popovers[p]; p++) {
                popup.contentWindow.monoSafariDirectOnMessage({
                    message: cloneObj(message),
                    target: {
                        page: {
                            dispatchMessage: function (name, message) {
                                setTimeout(function () {
                                    _this.asyncListener({message: cloneObj(message)});
                                }, 0);
                            }
                        }
                    }
                });
            }
            for (var w = 0, window; window = safari.application.browserWindows[w]; w++) {
                for (var t = 0, tab; tab = window.tabs[t]; t++) {
                    if (tab.url && tab.url.substr(0, localUrlLen) === localUrl) {
                        tab.page.dispatchMessage("message", message);
                    }
                }
            }
        },
        /**
         * @param {MonoMsg} message
         */
        sendMessageViaBridge: function (message) {
            var _this = this;
            safari.extension.globalPage.contentWindow.monoSafariDirectOnMessage({
                message: cloneObj(message),
                target: {
                    page: {
                        dispatchMessage: function(name, message) {
                            setTimeout(function () {
                                _this.asyncListener({message: cloneObj(message)});
                            }, 0);
                        }
                    }
                }
            });
        },
        /**
         * @param {Function} callback
         */
        addMessageListener: function (callback) {
            if (isBgPage) {
                safari.application.addEventListener("message", callback);
            } else {
                safari.self.addEventListener("message", callback);
            }
        },
        /**
         * @param {Function} callback
         */
        removeMessageListener: function (callback) {
            if (isBgPage) {
                safari.application.removeEventListener("message", callback);
            } else {
                safari.self.removeEventListener("message", callback);
            }
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
                    msgTools.removeMessageListener(this.asyncListener);
                }
            }
        }
    };

    var api = {
        isSafari: true,
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessageToActiveTab: function(msg, responseCallback) {
            var activeTab = safari.application.activeBrowserWindow && safari.application.activeBrowserWindow.activeTab;
            if (activeTab) {
                var message = msgTools.wrap(msg);

                var hasCallback = !!responseCallback;
                message.hasCallback = hasCallback;
                if (hasCallback) {
                    message.callbackId = msgTools.getId();
                    msgTools.wait(message.callbackId, responseCallback);
                }

                activeTab.page.dispatchMessage("message", message);
            }
        },
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         * @param {String} [hook]
         */
        sendMessage: function (msg, responseCallback, hook) {
            var message = msgTools.wrap(msg);
            hook && (message.hook = hook);

            var hasCallback = !!responseCallback;
            message.hasCallback = hasCallback;
            if (hasCallback) {
                message.callbackId = msgTools.getId();
                msgTools.wait(message.callbackId, responseCallback);
            }

            if (isInject) {
                safari.self.tab.dispatchMessage("message", message);
            } else
            if (isPopup) {
                msgTools.sendMessageViaBridge(message);
            } else {
                msgTools.broadcastMessage(message);
            }
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

                if ((isPopup || isBgPage) && !window.monoSafariDirectOnMessage) {
                    window.monoSafariDirectOnMessage = function (event) {
                        setTimeout(function () {
                            msgTools.listener(event);
                        }, 0);
                    };
                }
                msgTools.addMessageListener(msgTools.listener);
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
                    if ((isPopup || isBgPage) && window.monoSafariDirectOnMessage) {
                        window.monoSafariDirectOnMessage = null;
                    }
                    msgTools.removeMessageListener(msgTools.listener);
                }
            }
        }
    };

    //@include ../../components/localStorage.js

    api.storage = initLocalStorage(isInject);

    return api;
};