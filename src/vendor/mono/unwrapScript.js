const unwrapScript = fn => {
  let string = fn.toString();
  const pos = string.indexOf('{') + 1;
  string = string.substr(pos, string.lastIndexOf('}') - pos);
  return string;
};

export default unwrapScript;