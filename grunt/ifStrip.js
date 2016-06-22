/**
 * Created by Anton on 09.07.2015.
 */
var idIndex = 0;
exports.setIfId = function(content) {
  "use strict";
  var hasIf = false;
  content = content.replace(/(\/\/@if)(\s+)/g, function(text, aif, space) {
    hasIf = true;
    return aif + idIndex + space;
  });
  hasIf && idIndex++;
  return content;
};
var getResult = function(sIf, options) {
  "use strict";
  var result, key;
  var ifList = sIf.split(/(\|\||&&)/);
  for (var i = 0, item; item = ifList[i]; i++) {
    if (item === '&&') {
      if (!result) {
        break;
      }
      continue;
    } else if (item === '||') {
      if (result) {
        break;
      }
      continue;
    }
    var keyValue = item.split('=');
    key = keyValue[0];
    if (key.slice(-1) === '!') {
      key = key.slice(0, -1);
      result = !options[key];
    } else
    if (key[0] === '!') {
      key = key.substr(1);
      result = !options[key];
    } else {
      var value = strTo(keyValue[1]);
      result = options[key] === value;
    }
  }

  return result;
};
var strTo = function(str) {
  "use strict";
  var value = str;
  if (typeof value !== 'string') {
    return str;
  }
  if (strTo.isNumber.test(value)) {
    value = parseFloat(value);
  } else if (strTo.isBool.test(value)) {
    value = value === 'true';
  }
  return value;
};
strTo.isNumber = /^[\d.]+$/;
strTo.isBool = /^(true|false)$/i;

exports.ifStrip = function(data, options) {
  "use strict";
  return inlineIfStrip(data, options, {
    sComm: '//',
    eComm: ''
  });
};

var inlineIfStrip = function(data, options, details) {
  "use strict";
  details = details || {};
  options = options || {};
  for (var key in options) {
    options[key] = strTo(options[key]);
  }

  var safeR = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;

  var sComm = details.sComm;
  var eComm = details.eComm;

  if (sComm === undefined) {
    sComm = '/*';
  }

  if (eComm === undefined) {
    eComm = '*/';
  }

  var sCommR = sComm.replace(safeR, '\\$&');

  var startPos;
  var n = 1000;
  while (true) {
    if (n-- === 0) {
      console.error('Cycle!', 'inlineIfStrip');
      return;
    }

    startPos = data.indexOf(sComm + '@if', startPos);
    if (startPos === -1) {
      break;
    }

    var str = data.substr(startPos, data.indexOf('>' + eComm, startPos) - startPos);
    var endStr = '<' + eComm;
    var endPos = data.indexOf(str + endStr, startPos);
    var ifLen = str.length + endStr.length;

    var r = new RegExp(sCommR + '@if\\\d*\\\s+([^><]+)');
    var sIf = str.match(r);


    var result = getResult(sIf && sIf[1], options);

    if (!result) {
      data = data.substr(0, startPos) + data.substr(endPos + ifLen);
    } else {
      data = data.substr(0, endPos) + data.substr(endPos + ifLen);
      data = data.substr(0, startPos) + data.substr(startPos + ifLen);
    }
  }

  return data;
};

exports.inlineIfStrip = inlineIfStrip;