var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent'); //esta libreria sirve para hacer request
var header = require('../header'); //este header es un middleweare que se encuentra en el archivo
								   //index.js de la carpeta header
var axios = require('axios'); //esta libreria sirve para usar el metodo request con promesas(then)
							 //hace lo mismo que superagent pero con promesas

// ---- Esta es la función principal ------
page('/', header, loading, asyncLoad, function(ctx, next){ //aqui estan los middlewares
	title('Platzigram');
	var main = document.getElementById('main-container');

  empty(main).appendChild(template(ctx.pictures));
})

//---- Aqui empiezan los middlewares y funciones necesarias -----

function loading (ctx, next) {
	var el = document.createElement('div');
	el.classList.add('loader');
	document.getElementById('main-container').appendChild(el);
	next();
}

//este es un middleware el cual nos ayuda a cargar las imagens
//las cuales son llamadas mediante la url (server.js)
//1. esta funcion es con superagent
function loadPictures(ctx, next) {
	request
		.get('/api/pictures')
		.end(function (err, res){
			if (err) return console.log(err);

			ctx.pictures = res.body; //pasamos el contexto en ctx.pictures
															 //el contexto contiene el res.body el cual es
															 //las imagenes que contiene la variable pictures
															 //que se encuentra en server.js

			next(); //se llama a la funcion next para que siga a la funcion siguiente en
							//en la funcion de page de arriba. 
		})
}

//2. esta funcion es con axios
function loadPicturesAxios(ctx, next) {
	axios
		.get('/api/pictures')
		.then(function (res){
			ctx.pictures = res.data; //axios no tiene body, en lugar tiene un data 
			next();
		})
		.catch(function (err){
			console.log(err);
		})
}

//3. este metodo Fetch es nativo de los navegadores
function loadPicturesFetch(ctx, next) {
	fetch('api/pictures')
		.then(function(res){
			return res.json(); //este res.json es el parametro que le pasamos
												//a la siguiente promesa como pictures
		})
		.then(function (pictures) {
			ctx.pictures = pictures;
			next();
		})
		.catch(function (err ) {
			console.log(err);
		})
}

async function asyncLoad(ctx, next){
	try{
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());
		next();
	}catch(err){
		return console.log(err);
	}
}