var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function pictureCard(pic){
	var el; //esta se define por que si no js lo toma como undefined

	function render(picture){ //con esta funcion rendereamos los datos que nos mandan mediante picture
		return yo`<div class="card ${picture.liked ? 'liked' : ''}">
			<div class="card-image">
				<img class="activator" src="${picture.url}" ondblclick=${like.bind(null, undefined)} />
				<i class="fa fa-heart like-heart ${ picture.likedHeart ? 'liked' : ''}"></i>
			</div>

			<div class="card-content">
				<a href="/${picture.user.username}" class="card-title">
					<img src="${picture.user.avatar}" class="avatar"/>
					<span class="username">${picture.user.username}</span>
				</a>

				<small class="right time">${translate.date.format(picture.createdAt)}</small>
				<p>
					<a href="#" class="left" onclick=${like.bind(null, true, false)}><i class="fa fa-heart-o" aria-hidden="true"></i></a>
					<a href="#" class="left" onclick=${like.bind(null, false, false)}><i class="fa fa-heart" aria-hidden="true"></i></a>
					<span class="left likes">${translate.message('likes', { likes: picture.likes })}</span>
				</p>
			</div>
		</div>`;
	}
	//con esta funcion aumetamos o disminuimos el numero de me gusta(corazon)
	function like(liked, dblclick){
		// esta funcion sirve para el dobleclick sobre la imagen
		if (dblclick) {
			//doble asignacion
			pic.likedHeart = pic.liked = !pic.liked;
			liked = pic.liked;
		} else {
			pic.liked = liked;
		}
		pic.likes += liked ? 1 : -1;

		var newEl = render(pic);
		yo.update(el, newEl);

		function doRender() {
			var newEl = render(pic);
			yo.update(el, newEl);
		}

		setTimeout(function () {
			pic.likedHeart = false;
			doRender();
		}, 1500)

		return false;
	}

	// function dislike(){
	// 	pic.liked = false;
	// 	pic.likes--;
	// 	var newEl = render(pic);
	// 	yo.update(el, newEl);
	// 	return false;
	// }

	el = render(pic); //mandamos a llamar la funcion render y le pasamos el atributo pic(esto es lo primero que se hace)
	return el
}