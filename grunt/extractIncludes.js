var fs = require('fs');
var Path = require('path');
var extractIncludes = function (content, parentPath) {
    "use strict";
    content = content.replace(/\r?\n[\s\t]*\/\/@include\s+([\w_\-\/\.]+)/g, function (text, path) {
        var filePath = Path.normalize(Path.join(parentPath, path));
        var childPath = Path.dirname(filePath);
        var content = '\n' + String(fs.readFileSync(filePath));
        return extractIncludes(content, childPath);
    });
    return content;
};
exports.extractIncludes = extractIncludes;