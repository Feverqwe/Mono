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
    var isInject = typeof opera.extension.broadcastMessage === 'undefined';
    var inLocalScope = /^widget:\/\//.test(window.location && window.location.href);

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
       * @typedef {Object} Source
       * @property {Function} postMessage
       */
      /**
       * @param {string} id
       * @param {Source} source
       * @returns {Function}
       */
      asyncSendResponse: function(id, source) {
        return function(message) {
          message.responseId = id;

          source.postMessage(message);
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
       * @param {MonoMsg} event.data
       * @param {Source} event.source
       */
      listener: function(event) {
        var _this = msgTools;
        var sendResponse = null;
        var message = event.data;
        if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix) {
          if (message.isBroadcast && !inLocalScope) {
            return;
          }

          if (!message.hasCallback) {
            sendResponse = emptyFn;
          } else {
            sendResponse = _this.asyncSendResponse(message.callbackId, event.source);
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
       * @param {Object} event
       * @param {MonoMsg} event.data
       * @param {Source} event.source
       */
      asyncListener: function(event) {
        var _this = msgTools;
        var message = event.data;
        if (message && message.mono && message.responseId && message.idPrefix !== _this.idPrefix) {
          var item = _this.async[message.responseId];
          var fn = item && item.fn;
          if (fn) {
            delete _this.async[message.responseId];
            if (!Object.keys(_this.async).length) {
              _this.removeMessageListener(_this.asyncListener);
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
          idPrefix: this.idPrefix
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

        this.addMessageListener(this.asyncListener);

        this.gc();
      },
      messageListeners: [],
      /**
       * @param {Function} callback
       */
      addMessageListener: function(callback) {
        var listeners = this.messageListeners;
        if (listeners.indexOf(callback) === -1) {
          opera.extension.addEventListener('message', callback);
          listeners.push(callback);
        }
      },
      /**
       * @param {Function} callback
       */
      removeMessageListener: function(callback) {
        var listeners = this.messageListeners;
        var pos = listeners.indexOf(callback);
        if (pos !== -1) {
          opera.extension.removeEventListener('message', callback);
          listeners.splice(pos, 1);
        }
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
            this.removeMessageListener(this.asyncListener);
          }
        }
      }
    };

    var api = {
      isOpera: true,
      /**
       * @param {*} msg
       * @param {Function} [responseCallback]
       */
      sendMessageToActiveTab: function(msg, responseCallback) {
        var currentTab = opera.extension.tabs.getSelected();
        if (currentTab) {
          var message = msgTools.wrap(msg);

          var hasCallback = !!responseCallback;
          message.hasCallback = hasCallback;
          if (hasCallback) {
            message.callbackId = msgTools.getId();
            msgTools.wait(message.callbackId, responseCallback);
          }

          try {
            currentTab.postMessage(message);
          } catch (e) {
            if (!/INVALID_STATE_ERR/.test(e.message)) {
              throw e;
            }
          }
        }
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

        if (isInject) {
          opera.extension.postMessage(message);
        } else {
          message.isBroadcast = true;
          opera.extension.broadcastMessage(message);
        }
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
            msgTools.removeMessageListener(msgTools.listener);
          }
        }
      }
    };

    var initWidgetPreferences = function() {
      var localStorage = widget.preferences;

      var readItem = function(value) {
        var result = undefined;
        if (typeof value === 'string') {
          try {
            result = JSON.parse(value).w;
          } catch (e) {
            console.error('WidgetPreferences item read error!', e, value);
          }
        }
        return result;
      };

      var writeItem = function(value) {
        return JSON.stringify({
          w: value
        });
      };

      return {
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
    };

    api.storage = initWidgetPreferences();

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