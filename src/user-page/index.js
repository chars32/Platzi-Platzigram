// otra manera de importar las librerias requeridas
// fijarse como aqui no se tienen que delcarar varaibles
import page from 'page'
import header from '../header'
import title from 'title'
import empty from 'empty-element'
import template from './template'

// ---- Funcion principal ----
page('/:username', header, loadUser, function (ctx, next) {
	var main = document.getElementById('main-container'); //en la variable main guardamos todo lo que esta en main-container
	title(`Platzigram - ${ctx.params.username}`); //agregamos el titulo a nuestra pagina
	empty(main).appendChild(template(ctx.user)); //primero borramos el main
														   //despues agregamos el template con el contexto que deseamos pasarle (username) 


});

page('/:username/:id', header, loadUser, function (ctx, next) {
	var main = document.getElementById('main-container'); 
	title(`Platzigram - ${ctx.params.username}`);
	empty(main).appendChild(template(ctx.user));
	$(`#modal${ctx.params.id}`).openModal({
		//al salir del modal la barra de direccion quede solo hasta el nombre del usuario
		//localhost:3000/chars/
		complete: function() {
			page(`/${ctx.params.username}`)
		}
	});
});

// ---- Middlewares ----
async function loadUser(ctx, next) {
	try{
		ctx.user = await fetch(`/api/user/${ctx.params.username}`).then(res => res.json());
		next();
	} catch (err) {
		return console.log(err);
	}
}