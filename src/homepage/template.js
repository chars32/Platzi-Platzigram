var yo = require('yo-yo');
var layout = require('../layout');
var picture = require('../picture-card'); //traemos el index.js de picture-card
var translate = require('../translate');
var request = require('superagent');

module.exports = function (pictures) { //utilizamos una funcion la cual recibe de parametro las pictures
									   //las cuales estan declaradas en el index.js del homepage

	//declaramos una variable el que tiene todo el html con yo
	var el = yo`<div class="container timeline">

		 <div class="row">
      <div class="col s12 m10 offset-m1 l8 offset-l2 center-align">
        <form enctype="multipart/form-data" class="form-upload" id="formUpload" onsubmit=${onsubmit}>
          <div id="fileName" class="fileUpload btn btn-flat cyan">
            <span><i class="fa fa-camera" aria-hidden="true"></i> ${translate.message('upload-picture')}</span>
            <input name="picture" id="file" type="file" class="upload" onchange=${onchange} />
          </div>
          <button id="btnUpload" type="submit" class="btn btn-flat cyan hide">${translate.message('upload')}</button>
          <button id="btnCancel" type="button" class="btn btn-flat red hide" onclick=${cancel}><i class="fa fa-times" aria-hidden="true"></i></button>
        </form>
      </div>
    </div>

	  <div class="row">
	    <div class="col s12 m10 offset-m1 l6 offset-l3">
	      ${pictures.map(function(pic){ //aqui es donde mandamos a llamar la funcion principal del index.js de picture-card
					return picture(pic); //y le pasamos cada una de las pics que sacamos con la funcion map
	      })}
	    </div>
	  </div>
	</div>`;

	function toggleButtons() {
    document.getElementById('fileName').classList.toggle('hide');
    document.getElementById('btnUpload').classList.toggle('hide');
    document.getElementById('btnCancel').classList.toggle('hide');
  }

	function cancel() {
		toggleButtons()
		document.getElementById('formUpload').reset();
	}

	function onchange() {
		toggleButtons();
	}

	function onsubmit(ev) {
		ev.preventDefault(); //evitamos el request que tiene la funcion onsubmit

		var data = new FormData(this); //llamamos a todo el formulario con 'this'
		request
			.post('/api/pictures')
			.send(data)
			.end(function (err, res) {
				console.log(arguments);
			})
	}

	return layout(el);
	
}