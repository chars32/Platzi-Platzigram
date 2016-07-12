var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title'); //title nos ayuda para poder cambiar el titulo de la pagina


page('/signup', function(ctx, next){
	title('Platzigram - Signup'); //aqui pasamos el texto que queremos que tenga el titulo
																//este sustituira el valor de title que pasamos en el server.js
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
})