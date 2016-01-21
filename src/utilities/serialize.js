const serialize = function(obj) {
  let returnVal;
  if (obj != undefined) {
    switch (obj.constructor) {
      case Array:
        let vArr = '[';
        for (var i = 0; i < obj.length; i++) {
          if (i > 0)
            vArr += ',';
          vArr += serialize(obj[i]);
        }
        vArr += ']';
        return vArr;
      case String:
        returnVal = escape(`${ obj }`);
        return returnVal;
      case Number:
        returnVal = isFinite(obj) ? obj.toString() : '';
        return returnVal;
      case Date:
        returnVal = `${ obj }`;
        return returnVal;
      default:
        if (typeof obj === 'object') {
          var vobj = [];
          for (var attr in obj) {
            if (typeof obj[attr] != 'function') {
              vobj.push(`${ attr }=${ serialize(obj[attr]) }`);
            }
          }
          if (vobj.length > 0)
            return `${ vobj.join('&') }`;
          else
            return '';
        } else {
          return obj.toString();
        }
    }
  }
  return null;
};

export default serialize;
