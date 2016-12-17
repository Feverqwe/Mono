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
    var isInject = location.protocol !== 'chrome-extension:' || location.host !== chrome.runtime.id;
    var isBgPage = false;
    !isInject && (function() {
      isBgPage = location.pathname.indexOf('_generated_background_page.html') !== -1;

      if (!isBgPage && chrome.runtime.hasOwnProperty('getBackgroundPage')) {
        try {
          chrome.runtime.getBackgroundPage(function(bgWin) {
            isBgPage = bgWin === window;
          });
        } catch (e) {}
      }

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
      listener: function(message, sender, response) {
        var _this = msgTools;
        if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
          _this.listenerList.forEach(function(fn) {
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
      wrap: function(msg) {
        return {
          mono: true,
          data: msg,
          idPrefix: this.idPrefix,
          isBgPage: isBgPage
        };
      }
    };

    var api = {
      isChrome: true,
      /**
       * @param {*} msg
       * @param {Function} [responseCallback]
       */
      sendMessageToActiveTab: function(msg, responseCallback) {
        var message = msgTools.wrap(msg);

        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          var tabId = tabs[0] && tabs[0].id;
          if (tabId >= 0) {
            chrome.tabs.sendMessage(tabId, message, responseCallback);
          }
        });
      },
      /**
       * @param {*} msg
       * @param {Function} [responseCallback]
       * @param {String} [hook]
       */
      sendMessage: function(msg, responseCallback, hook) {
        var message = msgTools.wrap(msg);
        hook && (message.hook = hook);
        chrome.runtime.sendMessage(message, responseCallback);
      },
      onMessage: {
        /**
         * @param {Function} callback
         * @param {Object} [details]
         */
        addListener: function(callback, details) {
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

    var initChromeStorage = function() {
      return {
        /**
         * @param {String|[String]|Object|null|undefined} [keys]
         * @param {Function} callback
         */
        get: function(keys, callback) {
          chrome.storage.local.get(keys, callback);
        },
        /**
         * @param {Object} items
         * @param {Function} [callback]
         */
        set: function(items, callback) {
          chrome.storage.local.set(items, callback);
        },
        /**
         * @param {String|[String]} [keys]
         * @param {Function} [callback]
         */
        remove: function(keys, callback) {
          chrome.storage.local.remove(keys, callback);
        },
        /**
         * @param {Function} [callback]
         */
        clear: function(callback) {
          chrome.storage.local.clear(callback);
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
          set: function(items, callback) {
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
          remove: function(keys, callback) {
            return api.sendMessage({
              scope: 'mono',
              action: 'storageRemove',
              data: keys
            }, callback);
          },
          /**
           * @param {Function} [callback]
           */
          clear: function(callback) {
            return api.sendMessage({
              scope: 'mono',
              action: 'storageClear'
            }, callback);
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

            _keys.forEach(function(key) {
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
          set: function(items, callback) {
            Object.keys(items).forEach(function(key) {
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
          remove: function(keys, callback) {
            var _keys = null;
            if (Array.isArray(keys)) {
              _keys = keys;
            } else {
              _keys = [keys];
            }

            _keys.forEach(function(key) {
              localStorage.removeItem(key);
            });

            callback && callback();
          },
          /**
           * @param {Function} [callback]
           */
          clear: function(callback) {
            localStorage.clear();

            callback && callback();
          }
        };

        api.onMessage.addListener(function(msg, response) {
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
    if (chrome.storage) {
      api.storage = initChromeStorage();
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