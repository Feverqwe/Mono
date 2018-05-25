const getScriptsFormHtml = html => {
  const m = /src="(.+)"/g.exec(html);
  if (m) {
    m.shift();
  }
  return m || [];
};

module.exports = getScriptsFormHtml;