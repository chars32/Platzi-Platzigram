require("babel-polyfill");
var page = require('page'); //declaramos la variable page que contendra a page.js
							//page.js es una libreria que utilizamos para hacer
							//paginas "one page".

//requerimos las rutas que tendra nuestra app
require('./header');
require('./homepage'); 
require('./signup');
require('./signin');
require('./user-page');
require('./footer');

//llamamos a la funcion page
page(); 
