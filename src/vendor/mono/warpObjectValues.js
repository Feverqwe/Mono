const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);

const wrapObjectValues = obj => {
  if (isObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      result[key] = {w: obj[key]};
      return result;
    }, {});
  } else {
    return obj;
  }
};

const unwrapObjectValues = obj => {
  if (isObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      result[key] = obj[key].w;
      return result;
    }, {});
  } else {
    return obj;
  }
};

export {
  wrapObjectValues,
  unwrapObjectValues
};