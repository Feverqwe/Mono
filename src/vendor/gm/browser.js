var browserApi = function () {
    "use strict";
    var emptyFn = function () {};

    var cloneObj = function (msg) {
        var obj = null;
        try {
            obj = JSON.parse(JSON.stringify({w: msg})).w;
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

    var msgTools = {
        listenerBgList: [],
        listenerList: []
    };

    var api = {
        isGM: true,
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessageToActiveTab: function (msg, responseCallback) {
            var responseFn = !responseCallback ? emptyFn : onceFn(responseCallback);

            msgTools.listenerList.forEach(function (fn) {
                setTimeout(function () {
                    fn(cloneObj(msg), responseFn);
                }, 0);
            });
        },
        /**
         * @param {*} msg
         * @param {Function} [responseCallback]
         */
        sendMessage: function (msg, responseCallback) {
            var responseFn = !responseCallback ? emptyFn : onceFn(responseCallback);

            var cloneMsg = cloneObj(msg);
            msgTools.listenerBgList.forEach(function (fn) {
                setTimeout(function () {
                    fn(cloneMsg, responseFn);
                }, 0);
            });
        },
        onMessage: {
            /**
             * @param {Function} callback
             * @param {Object} [details]
             * @param {Boolean} [details.isBg]
             */
            addListener: function (callback, details) {
                details = details || {};
                var listenerList = null;
                if (details.isBg) {
                    listenerList = msgTools.listenerBgList;
                } else {
                    listenerList = msgTools.listenerList;
                }

                if (listenerList.indexOf(callback) === -1) {
                    listenerList.push(callback);
                }
            },
            /**
             * @param {Function} callback
             * @param {Object} [details]
             * @param {Boolean} [details.isBg]
             */
            removeListener: function (callback, details) {
                details = details || {};
                var listenerList = null;
                if (details.isBg) {
                    listenerList = msgTools.listenerBgList;
                } else {
                    listenerList = msgTools.listenerList;
                }

                var pos = listenerList.indexOf(callback);
                if (pos !== -1) {
                    listenerList.splice(pos, 1);
                }
            }
        }
    };

    if (window.chrome) {
        api.isTM = true;
    } else
    if (/Maxthon\//.test(navigator.userAgent)) {
        api.isVM = true;
    } else {
        api.isGmOnly = true;
    }

    var initGmStorage = function () {
        var readItem = function (value) {
            var result = undefined;
            if (typeof value === 'string' && value !== 'MonoEmptyValue') {
                try {
                    result = JSON.parse(value).w;
                } catch (e) {
                    console.error('GM Storage item read error!', e, value);
                }
            }
            return result;
        };

        var writeItem = function (value) {
            return JSON.stringify({w: value});
        };

        return {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                var items = {};
                var defaultItems = {};

                var _keys = [];
                if (keys === undefined || keys === null) {
                    _keys = GM_listValues();
                } else 
                if (Array.isArray(keys)) {
                    _keys = keys;
                } else 
                if (typeof keys === 'object') {
                    _keys = Object.keys(keys);
                    defaultItems = keys;
                } else {
                    _keys = [keys];
                }

                _keys.forEach(function (key) {
                    var value = readItem(GM_getValue(key, 'MonoEmptyValue'));
                    if (value === undefined) {
                        value = defaultItems[key];
                    }
                    if (value !== undefined) {
                        items[key] = value;
                    }
                });

                setTimeout(function () {
                    callback(items);
                }, 0);
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                Object.keys(items).forEach(function (key) {
                    if (items[key] !== undefined) {
                        GM_setValue(key, writeItem(items[key]));
                    }
                });

                callback && setTimeout(function () {
                    callback();
                }, 0);
            },
            /**
             * @param {String|[String]} [keys]
             * @param {Function} [callback]
             */
            remove: function (keys, callback) {
                var _keys = [];
                if (Array.isArray(keys)) {
                    _keys = keys;
                } else {
                    _keys = [keys];
                }

                _keys.forEach(function (key) {
                    GM_deleteValue(key);
                });

                callback && setTimeout(function () {
                    callback();
                }, 0);
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                this.remove(GM_listValues(), callback);
            }
        };
    };

    api.storage = initGmStorage();

    return {
        api: api
    };
};