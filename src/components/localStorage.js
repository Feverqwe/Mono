var initLocalStorage = function (isInject) {
    var externalStorage = function () {
        return {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                if (keys === undefined) {
                    keys = null;
                }
                return api.sendMessage({
                    get: keys
                }, callback, 'storage');
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                return api.sendMessage({
                    set: items
                }, callback, 'storage');
            },
            /**
             * @param {String|[String]} [keys]
             * @param {Function} [callback]
             */
            remove: function (keys, callback) {
                return api.sendMessage({
                    remove: keys
                }, callback, 'storage');
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                return api.sendMessage({
                    clear: true
                }, callback, 'storage');
            }
        };
    };

    var wrapLocalStorage = function () {
        var readItem = function (value) {
            var result = undefined;
            if (typeof value === 'string') {
                try {
                    result = JSON.parse(value).w;
                } catch (e) {
                    console.error('localStorage item read error!', e, value);
                }
            }
            return result;
        };

        var writeItem = function (value) {
            return JSON.stringify({w: value});
        };

        var storage = {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                var result = {};
                var defaultItems = null;

                var _keys = null;
                if (keys === undefined || keys === null) {
                    _keys = Object.keys(localStorage);
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
                    var value = readItem(localStorage.getItem(key));
                    if (defaultItems && value === undefined) {
                        value = defaultItems[key];
                    }
                    if (value !== undefined) {
                        result[key] = value;
                    }
                });

                setTimeout(function () {
                    callback(result);
                }, 0);
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                Object.keys(items).forEach(function (key) {
                    if (items[key] !== undefined) {
                        localStorage.setItem(key, writeItem(items[key]));
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
                var _keys = null;
                if (Array.isArray(keys)) {
                    _keys = keys;
                } else {
                    _keys = [keys];
                }

                _keys.forEach(function (key) {
                    localStorage.removeItem(key);
                });

                callback && setTimeout(function () {
                    callback();
                }, 0);
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                localStorage.clear();

                callback && setTimeout(function () {
                    callback();
                }, 0);
            }
        };

        api.onMessage.addListener(function (msg, response) {
            if (msg) {
                if (msg.get !== undefined) {
                    storage.get(msg.get, response);
                } else
                if (msg.set !== undefined) {
                    storage.set(msg.set, response);
                } else
                if (msg.remove !== undefined) {
                    storage.remove(msg.remove, response);
                } else
                if (msg.clear !== undefined) {
                    storage.clear(response);
                }
            }
        }, {hook: 'storage'});

        return storage;
    };

    if (isInject) {
        return externalStorage();
    } else {
        return wrapLocalStorage();
    }
};