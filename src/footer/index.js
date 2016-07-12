var yo = require('yo-yo');
var translate = require('../translate');

var el = yo`<footer class="site-footer">
  <div class="container">
    <div class="row">
      <div class="col s12 l3 center-align"><a href="#" data-activates="dropdown1" class="dropdown-button btn btn-flat">${translate.message('language')}</a>
        <ul id="dropdown1" class="dropdown-content">
          <li><a href="#" onclick=${lang.bind(null, 'es')}>${translate.message('spanish')}</a></li>
          <li><a href="#" onclick=${lang.bind(null, 'en-US')}>${translate.message('english')}</a></li>
        </ul>
      </div>
      <div class="col s12 l3 push-l6 center-align">© 2016 Platzigram</div>
    </div>
  </div>
</footer>`;

//funcion para cambiar el idioma de la pagina
function lang(locale){
  localStorage.locale = locale; //aqui asignamos valor a locale en localstorage
  location.reload(); //con esta linea recargamos la pagina con el valor de locale
  return false //con este return quitamos el signo de admiracion en la barra de direccion
}

document.body.appendChild(el);