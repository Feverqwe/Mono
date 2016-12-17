var initLocalStorage = function (isInject) {
    var externalStorage = function () {
        return {
            /**
             * @param {String|[String]|Object|null|undefined} [keys]
             * @param {Function} callback
             */
            get: function (keys, callback) {
                return api.sendMessage({
                    scope: 'mono',
                    action: 'storageGet',
                    data: keys
                }, callback);
            },
            /**
             * @param {Object} items
             * @param {Function} [callback]
             */
            set: function (items, callback) {
                return api.sendMessage({
                    scope: 'mono',
                    action: 'storageSet',
                    data: items
                }, callback);
            },
            /**
             * @param {String|[String]} [keys]
             * @param {Function} [callback]
             */
            remove: function (keys, callback) {
                return api.sendMessage({
                    scope: 'mono',
                    action: 'storageRemove',
                    data: keys
                }, callback);
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                return api.sendMessage({
                    scope: 'mono',
                    action: 'storageClear'
                }, callback);
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

                callback(result);
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

                callback && callback();
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

                callback && callback();
            },
            /**
             * @param {Function} [callback]
             */
            clear: function (callback) {
                localStorage.clear();

                callback && callback();
            }
        };

        api.onMessage.addListener(function (msg, response) {
            if (msg && msg.scope === 'mono') {
                if (msg.action === 'storageGet') {
                    storage.get(msg.data, response);
                } else
                if (msg.action === 'storageSet') {
                    storage.set(msg.data, response);
                } else
                if (msg.action === 'storageRemove') {
                    storage.remove(msg.data, response);
                } else
                if (msg.action === 'storageClear') {
                    storage.clear(response);
                }
            }
        });

        return storage;
    };

    if (isInject) {
        return externalStorage();
    } else {
        return wrapLocalStorage();
    }
};