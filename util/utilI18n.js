const localizify = require('localizify');
const es = require('../messages/es.json');
const en = require('../messages/en.json');
const utilGlobal = require("./utilGlobal");
localizify.default.add('en', en);
localizify.default.add('es', es);
exports.msg = function(code,params){
    localizify.default.setLocale(utilGlobal.codeLang);
    return localizify.t(code,params);
}