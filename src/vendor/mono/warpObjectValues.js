const wrapObjectValues = obj => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = {w: obj[key]};
    });
    return result;
  } else {
    return obj;
  }
};

const unwrapObjectValues = obj => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = obj[key].w;
    });
    return result;
  } else {
    return obj;
  }
};

export {
  wrapObjectValues,
  unwrapObjectValues
};