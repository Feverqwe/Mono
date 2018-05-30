const isSameOrigin = url => {
  const origin = location.origin.substr(0, location.origin.lastIndexOf('-'));
  return url.indexOf(origin) === 0;
};

export default isSameOrigin;