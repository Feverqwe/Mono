var mono = (typeof mono !== 'undefined') ? mono : undefined;

(function(base, factory) {
  "use strict";
  if (mono && mono.isLoaded) {
    return;
  }

  var _mono = mono;
  var fn = function(addon) {
    return factory(_mono, addon);
  };

  if (typeof window !== "undefined") {
    mono = base(fn);
    return;
  }
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
  var browserApi = function() {
    "use strict";
    var isInject = location.protocol !== 'ms-browser-extension:' || location.host !== browser.runtime.id;
    var isBgPage = false;
    !isInject && (function() {
      isBgPage = location.pathname.indexOf('_generated_background_page.html') !== -1;

      if (!isBgPage && browser.runtime.hasOwnProperty('getBackgroundPage')) {
        try {
          browser.runtime.getBackgroundPage(function(bgWin) {
            isBgPage = bgWin === window;
          });
        } catch (e) {}
      }

    })();

    var emptyFn = function() {};

    var cbWrapper = {
      map: {},
      wrapFn: function(fn) {
        var id;
        do {
          id = parseInt(Math.random() * 1000);
        } while (this.map[fn]);
        fn.monoWrapperId = id;
        return this.map[id] = function(msg, sender, response) {
          fn(msg, response);
          return true;
        };
      },
      getFn: function(fn) {
        return this.map[fn.monoWrapperId] || this.wrapFn(fn);
      },
      removeFn: function(fn) {
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
      sendMessageToActiveTab: function(msg, responseCallback) {
        browser.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
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
      sendMessage: function(msg, responseCallback) {
        browser.runtime.sendMessage(msg, responseCallback);
      },
      onMessage: {
        /**
         * @param {Function} callback
         */
        addListener: function(callback) {
          var wrappedCallback = cbWrapper.getFn(callback);
          if (!browser.runtime.onMessage.hasListener(wrappedCallback)) {
            browser.runtime.onMessage.addListener(wrappedCallback);
          }
        },
        /**
         * @param {Function} callback
         */
        removeListener: function(callback) {
          var wrappedCallback = cbWrapper.getFn(callback);
          if (browser.runtime.onMessage.hasListener(wrappedCallback)) {
            browser.runtime.onMessage.removeListener(wrappedCallback);
            cbWrapper.removeFn(callback);
          }
        }
      }
    };

    var initEdgeStorage = function() {
      return {
        /**
         * @param {String|[String]|Object|null|undefined} [keys]
         * @param {Function} callback
         */
        get: function(keys, callback) {
          browser.storage.local.get(keys, callback);
        },
        /**
         * @param {Object} items
         * @param {Function} [callback]
         */
        set: function(items, callback) {
          browser.storage.local.set(items, callback);
        },
        /**
         * @param {String|[String]} [keys]
         * @param {Function} [callback]
         */
        remove: function(keys, callback) {
          browser.storage.local.remove(keys, callback);
        },
        /**
         * @param {Function} [callback]
         */
        clear: function(callback) {
          browser.storage.local.clear(callback);
        }
      };
    };
    var initLocalStorage = function(isInject) {
      var externalStorage = function() {
        return {
          /**
           * @param {String|[String]|Object|null|undefined} [keys]
           * @param {Function} callback
           */
          get: function(keys, callback) {
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
          set: function(items, callback) {
            return api.sendMessage({
              set: items
            }, callback, 'storage');
          },
          /**
           * @param {String|[String]} [keys]
           * @param {Function} [callback]
           */
          remove: function(keys, callback) {
            return api.sendMessage({
              remove: keys
            }, callback, 'storage');
          },
          /**
           * @param {Function} [callback]
           */
          clear: function(callback) {
            return api.sendMessage({
              clear: true
            }, callback, 'storage');
          }
        };
      };

      var wrapLocalStorage = function() {
        var readItem = function(value) {
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

        var writeItem = function(value) {
          return JSON.stringify({
            w: value
          });
        };

        var storage = {
          /**
           * @param {String|[String]|Object|null|undefined} [keys]
           * @param {Function} callback
           */
          get: function(keys, callback) {
            var items = {};
            var defaultItems = {};

            var _keys = [];
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

            _keys.forEach(function(key) {
              var value = readItem(localStorage.getItem(key));
              if (value === undefined) {
                value = defaultItems[key];
              }
              if (value !== undefined) {
                items[key] = value;
              }
            });

            setTimeout(function() {
              callback(items);
            }, 0);
          },
          /**
           * @param {Object} items
           * @param {Function} [callback]
           */
          set: function(items, callback) {
            Object.keys(items).forEach(function(key) {
              if (items[key] !== undefined) {
                localStorage.setItem(key, writeItem(items[key]));
              }
            });

            callback && setTimeout(function() {
              callback();
            }, 0);
          },
          /**
           * @param {String|[String]} [keys]
           * @param {Function} [callback]
           */
          remove: function(keys, callback) {
            var _keys = [];
            if (Array.isArray(keys)) {
              _keys = keys;
            } else {
              _keys = [keys];
            }

            _keys.forEach(function(key) {
              localStorage.removeItem(key);
            });

            callback && setTimeout(function() {
              callback();
            }, 0);
          },
          /**
           * @param {Function} [callback]
           */
          clear: function(callback) {
            localStorage.clear();

            callback && setTimeout(function() {
              callback();
            }, 0);
          }
        };

        api.onMessage.addListener(function(msg, response) {
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
        }, {
          hook: 'storage'
        });

        return storage;
      };

      if (isInject) {
        return externalStorage();
      } else {
        return wrapLocalStorage();
      }
    };
    if (browser.storage) {
      api.storage = initEdgeStorage();
    } else {
      api.storage = initLocalStorage(isInject);
    }
    return {
      api: api
    };
  };

  var mono = browserApi(_addon).api;
  mono.isLoaded = true;
  mono.onReady = function(cb) {
    return cb();
  };

  //@insert

  return mono;
}));