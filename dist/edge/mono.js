var mono = (typeof mono !== 'undefined') ? mono : null;

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

  var base = Object.create({
    isLoaded: true,
    onReadyStack: [],
    onReady: function() {
      base.onReadyStack.push([this, arguments]);
    }
  });

  var onLoad = function() {
    document.removeEventListener('DOMContentLoaded', onLoad, false);
    window.removeEventListener('load', onLoad, false);

    mono = factory();

    for (var key in base) {
      if (base.hasOwnProperty(key)) {
        mono[key] = base[key];
      }
    }

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

    /**
     * @param {Function} fn
     * @returns {Function}
     */
    var onceFn = function(fn) {
      return function(msg) {
        if (fn) {
          fn(msg);
          fn = null;
        }
      };
    };

    /**
     * @returns {Number}
     */
    var getTime = function() {
      return parseInt(Date.now() / 1000);
    };

    var msgTools = {
      id: 0,
      idPrefix: Math.floor(Math.random() * 1000),
      /**
       * @returns {String}
       */
      getId: function() {
        return this.idPrefix + '_' + (++this.id);
      },
      /**
       * @typedef {Object} Sender
       * @property {Object} [tab]
       * @property {number} tab.callbackId
       * @property {number} [frameId]
       */
      /**
       * @param {string} id
       * @param {Sender} sender
       * @returns {Function}
       */
      asyncSendResponse: function(id, sender) {
        return function(message) {
          message.responseId = id;

          if (sender.tab && sender.tab.id >= 0) {
            if (sender.frameId !== undefined) {
              browser.tabs.sendMessage(sender.tab.id, message, {
                frameId: sender.frameId
              });
            } else {
              browser.tabs.sendMessage(sender.tab.id, message);
            }
          } else {
            browser.runtime.sendMessage(message);
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
       * @param {Function} _sendResponse
       */
      listener: function(message, sender, _sendResponse) {
        var _this = msgTools;
        var sendResponse = null;
        if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
          if (!message.hasCallback) {
            sendResponse = emptyFn;
          } else {
            sendResponse = _this.asyncSendResponse(message.callbackId, sender);
          }

          var responseFn = onceFn(function(msg) {
            var message = _this.wrap(msg);
            sendResponse(message);
            sendResponse = null;
          });

          _this.listenerList.forEach(function(fn) {
            if (message.hook === fn.hook) {
              fn(message.data, responseFn);
            }
          });
        }
      },
      async: {},
      /**
       *
       * @param {MonoMsg} message
       * @param {Sender} sender
       * @param {Function} sendResponse
       */
      asyncListener: function(message, sender, sendResponse) {
        var _this = msgTools;
        if (message && message.mono && message.responseId && message.idPrefix !== _this.idPrefix && message.isBgPage !== isBgPage) {
          var item = _this.async[message.responseId];
          var fn = item && item.fn;
          if (fn) {
            delete _this.async[message.responseId];
            if (!Object.keys(_this.async).length) {
              browser.runtime.onMessage.removeListener(_this.asyncListener);
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
      wrap: function(msg) {
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
      wait: function(id, responseCallback) {
        this.async[id] = {
          fn: responseCallback,
          time: getTime()
        };

        if (!browser.runtime.onMessage.hasListener(this.asyncListener)) {
          browser.runtime.onMessage.addListener(this.asyncListener);
        }

        this.gc();
      },
      gcTimeout: 0,
      gc: function() {
        var now = getTime();
        if (this.gcTimeout < now) {
          var expire = 180;
          var async = this.async;
          this.gcTimeout = now + expire;
          Object.keys(async).forEach(function(responseId) {
            if (async [responseId].time + expire < now) {
              delete async [responseId];
            }
          });

          if (!Object.keys(async).length) {
            browser.runtime.onMessage.removeListener(this.asyncListener);
          }
        }
      }
    };

    var api = {
      isEdge: true,
      /**
       * @param {*} msg
       * @param {Function} [responseCallback]
       */
      sendMessageToActiveTab: function(msg, responseCallback) {
        var message = msgTools.wrap(msg);

        browser.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          var tabId = tabs[0] && tabs[0].id;
          if (tabId >= 0) {
            var hasCallback = !!responseCallback;
            message.hasCallback = hasCallback;
            if (hasCallback) {
              message.callbackId = msgTools.getId();
              msgTools.wait(message.callbackId, responseCallback);
            }

            browser.tabs.sendMessage(tabId, message, emptyFn);
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

        var hasCallback = !!responseCallback;
        message.hasCallback = hasCallback;
        if (hasCallback) {
          message.callbackId = msgTools.getId();
          msgTools.wait(message.callbackId, responseCallback);
        }

        browser.runtime.sendMessage(message, emptyFn);
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

          if (!browser.runtime.onMessage.hasListener(msgTools.listener)) {
            browser.runtime.onMessage.addListener(msgTools.listener);
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
            browser.runtime.onMessage.removeListener(msgTools.listener);
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