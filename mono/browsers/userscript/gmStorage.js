class GmStorage {
  wrapValue(value) {
    return JSON.stringify({j:value});
  }
  unwrapValue(value) {
    return JSON.parse(value).j;
  }
  get(keys, callback) {
    GM.listValues().catch(err => {
      console.error(`Get values error`, err);
      return [];
    }).then(existsKeys => {
      const result = {};
      let defaults = {};
      if (!keys) {
        keys = existsKeys;
      }
      if (!Array.isArray(keys)) {
        defaults = keys;
        keys = Object.keys(keys);
      }
      return Promise.all(keys.map(key => {
        let exists = false;
        let value = null;
        return Promise.resolve().then(() => {
          if (existsKeys.indexOf(key) !== -1) {
            return GM.getValue(key).then(result => {
              value = this.unwrapValue(result);
              exists = true;
            });
          }
        }).catch(err => {
          console.error(`Parse key (${key}) error`, err);
        }).then(() => {
          if (!exists && defaults.hasOwnProperty(key)) {
            value = defaults[key];
            exists = true;
          }
          if (exists) {
            result[key] = value;
          }
        });
      })).then(() => {
        callback(result);
      });
    });
  }
  set(items, callback) {
    Promise.all(Object.keys(items).map(key => {
      return GM.setValue(key, this.wrapValue(items[key])).catch(err => {
        console.error(`Set item (${key}) error`, err);
      });
    })).then(() => {
      callback && callback();
    });
  }
  remove(keys, callback) {
    Promise.all(keys.map(key => {
      return GM.deleteValue(key).catch(err => {
        console.error(`Remove key (${key}) error`, err);
      });
    })).then(() => {
      callback && callback();
    });
  }
  clear(callback) {
    GM.listValues().catch(err => {
      console.error(`Get values error`, err);
      return [];
    }).then(values => this.remove(values, callback));
  }
}

export default GmStorage;