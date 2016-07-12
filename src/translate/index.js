// Esto es solo para navegador Safari ya que el no tiene definido
// intl por defaul. Esto es un polyfill.
if (!window.Intl) {
	window.Intl = require('intl');
	require('intl/locale-data/jsonp/en-US.js');
	require('intl/locale-data/jsonp/es.js');
}

// La libreria formatjs.io tiene un apartado el cual se llama int-relativeformat
// el cual se encarga de formatear las fechas y en estas 4 lineas siguientes
// se muestra como se importa.
//Aqui aparte de declarat la variable, la mandamos al campo global con window esto
//para que pueda ser utilizada, ya que de no ser asi nos marca error.
var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');
var IntlMessageFormat = require('intl-messageformat');

require('intl-relativeformat/dist/locale-data/en.js'); //los idiomas que se quieran usar.
require('intl-relativeformat/dist/locale-data/es.js');

var es = require('./es');
var en = require('./en-US');

var MESSAGES = {};
MESSAGES.es = es;
MESSAGES['en-US'] = en;

var locale = localStorage.locale || 'es';

module.exports = {
  message: function (text, opts) {
    opts = opts || {};
    var msg = new IntlMessageFormat(MESSAGES[locale][text], locale, null);
    return msg.format(opts); 
  },
  date: new IntlRelativeFormat(locale)
}
