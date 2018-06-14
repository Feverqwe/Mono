const getStorageChanges = (oldStorage, storage) => {
  const changes = {};
  Object.keys(oldStorage).forEach(key => {
    let change = changes[key];
    if (!change) {
      change = changes[key] = {};
    }
    change.oldValue = oldStorage[key];
  });
  Object.keys(storage).forEach(key => {
    let change = changes[key];
    if (!change) {
      change = changes[key] = {};
    }
    change.newValue = storage[key];
  });
  Object.keys(changes).forEach(key => {
    const change = changes[key];
    if (change.oldValue === change.newValue) {
      delete changes[key];
    }
  });
  return changes;
};

export default getStorageChanges;