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
    var isPopup = safari.self.identifier === 'popup';
    var isBgPage = safari.self.addEventListener === undefined;
    var isInject = !isPopup && safari.application === undefined;

    var localUrl = null;
    var localUrlLen = null;
    if (isBgPage) {
      localUrl = location.href.substr(0, location.href.indexOf('/', 19));
      localUrlLen = localUrl.length;
    }

    var emptyFn = function() {};

    var cloneObj = function(msg) {
      var obj = null;
      try {
        obj = JSON.parse(JSON.stringify({
          w: msg
        })).w;
      } catch (e) {
        console.error('CloneObj error!', e);
      }

      return obj;
    };

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
       * @typedef {Object} Target
       * @property {Object} page
       * @property {Function} page.dispatchMessage
       */
      /**
       * @param {string} id
       * @param {Target} target
       * @returns {Function}
       */
      asyncSendResponse: function(id, target) {
        return function(message) {
          message.responseId = id;

          if (target.page) {
            target.page.dispatchMessage("message", message);
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
       * @property {string} [responseId]
       * @property {boolean} hasCallback
       * @property {*} data
       */
      /**
       * @param {Object} event
       * @param {MonoMsg} event.message
       * @param {Target} event.target
       */
      listener: function(event) {
        var _this = msgTools;
        var sendResponse = null;
        var message = event.message;
        if (message && message.mono && !message.responseId && message.idPrefix !== _this.idPrefix) {
          if (!message.hasCallback) {
            sendResponse = emptyFn;
          } else {
            sendResponse = _this.asyncSendResponse(message.callbackId, event.target);
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
       * @param {MonoMsg} event.message
       * @param {Target} event.target
       */
      asyncListener: function(event) {
        var _this = msgTools;
        var message = event.message;
        if (message && message.mono && message.responseId && message.idPrefix !== _this.idPrefix) {
          var item = _this.async[message.responseId];
          var fn = item && item.fn;
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

        msgTools.addMessageListener(this.asyncListener);

        this.gc();
      },
      /**
       * @param {MonoMsg} message
       */
      broadcastMessage: function(message) {
        var _this = this;
        for (var p = 0, popup; popup = safari.extension.popovers[p]; p++) {
          popup.contentWindow.monoSafariDirectOnMessage({
            message: cloneObj(message),
            target: {
              page: {
                dispatchMessage: function(name, message) {
                  setTimeout(function() {
                    _this.asyncListener({
                      message: cloneObj(message)
                    });
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
      sendMessageViaBridge: function(message) {
        var _this = this;
        safari.extension.globalPage.contentWindow.monoSafariDirectOnMessage({
          message: cloneObj(message),
          target: {
            page: {
              dispatchMessage: function(name, message) {
                setTimeout(function() {
                  _this.asyncListener({
                    message: cloneObj(message)
                  });
                }, 0);
              }
            }
          }
        });
      },
      messageListeners: [],
      /**
       * @param {Function} callback
       */
      addMessageListener: function(callback) {
        var listeners = this.messageListeners;
        if (listeners.indexOf(callback) === -1) {
          if (isBgPage) {
            safari.application.addEventListener("message", callback);
          } else {
            safari.self.addEventListener("message", callback);
          }
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
          if (isBgPage) {
            safari.application.removeEventListener("message", callback);
          } else {
            safari.self.removeEventListener("message", callback);
          }
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
        if (activeTab && activeTab.page) {
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
        addListener: function(callback, details) {
          details = details || {};
          details.hook && (callback.hook = details.hook);

          if (msgTools.listenerList.indexOf(callback) === -1) {
            msgTools.listenerList.push(callback);
          }

          if ((isPopup || isBgPage) && !window.monoSafariDirectOnMessage) {
            window.monoSafariDirectOnMessage = function(event) {
              setTimeout(function() {
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

    api.storage = initLocalStorage(isInject);

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