const wrapObjectValues = obj => {
  obj && Object.keys(obj).forEach(key => {
    obj[key] = {w:obj[key]};
  });
  return obj;
};

const unwrapObjectValues = obj => {
  obj && Object.keys(obj).forEach(key => {
    obj[key] = obj[key].w;
  });
  return obj;
};

export {
  wrapObjectValues,
  unwrapObjectValues
};