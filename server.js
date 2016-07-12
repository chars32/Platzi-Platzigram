// declaramos variable express la cual contendra la libreria express
var express = require('express');

var multer  = require('multer');
var ext = require('file-extension');

var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var config = require('./config');

var s3 = new aws.S3({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey
})

var storage = multerS3({
	s3: s3,
	bucket: 'platzigram-fotos',
	acl: 'public-read',
	metadata: function(req, file, cb){
		cb(null, { fieldName: file.fieldname})
	},
	filename: function(req, file, cb){
		cb(null, +Date.now() + '.' + ext(file.originalname))
	}
})

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, +Date.now() + '.' + ext(file.originalname))
//   }
// })
 
var upload = multer({ storage: storage }).single('picture');

// debido a que la variable express es una funcion es necesario declarar 
// otra variable llamada app la cual contendra el valor de la varible express
var app = express();

// seteamos el motor de las vistas el cual sera pug(antes jade)
app.set('view engine', 'pug');

// ruta de la carpeta donde estaran los archivos estaticos
app.use(express.static('public'));

app.get('/', function(req, res){ //en la ruta raiz
	res.render('index', {title: 'Platzigram'}); // renderiza la plantilla especificada, con extension pug
})

app.get('/signup', function(req, res){ //en la ruta signup
	res.render('index', {title: 'Platzigram - Signup'}); //renderiza plantilla
})

app.get('/signin', function(req, res){ //en la ruta signin 
	res.render('index', {title: 'Platzigram - Signin'}); //renderiza plantilla
})

//con esto direccion consumimos la api que nos mandara la informacion del backend
//en este ejemplo la informacion la pasaremos con la variable pictures
//pero en un proyecto real la informacion la manda la api de la pagina a consultar
//ejemplo: twitter, facebook, marvel
app.get('/api/pictures', function(req, res, next){
	var pictures = [
		{
			user: {
				username: 'chars',
				avatar: 'https://pbs.twimg.com/profile_images/496330850418425856/eSnEPVN3.jpeg'
			},
			url: 'office.jpg',
			likes: 0,
			liked: false,
			createdAt: new Date().getTime() //esto me daba un error de invalid range,
																			//le agregamos el .gettime() para que funcionara
		},
		{
			user: {
				username: 'chars',
				avatar: 'https://pbs.twimg.com/profile_images/496330850418425856/eSnEPVN3.jpeg'
			},
			url: 'office.jpg',
			likes: 1,
			liked: true,
			createdAt: new Date().setDate(new Date().getDate()-10)
		}
	];
	
	setTimeout(() => res.send(pictures), 2000);
})

app.post('/api/pictures', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // return res.send(500, "Error uploading file");
      return res.status(500).send("Error uploading file");
    }
    res.send('File uploaded');
  })
})

app.get('/api/user/:username', function(req, res){
	const user = {
		username: 'chars',
		avatar: 'https://pbs.twimg.com/profile_images/496330850418425856/eSnEPVN3_400x400.jpeg',
		pictures: [
			{
				id: 1,
				src: 'https://scontent-dfw1-1.xx.fbcdn.net/t31.0-8/13502987_10154252687704804_7988663828440928251_o.jpg',
				likes: 3					
			},
			{
				id: 2,
				src: 'http://www.atraccion360.com/media/aa/styles/gallerie/public/images/2015/09/autos-disenados-por-mexicanos-1_0.jpg?itok=2Mp7WfFi',
				likes: 10					
			},
			{
				id: 3,
				src: 'https://scontent-dfw1-1.xx.fbcdn.net/t31.0-8/13558651_10154262033439804_7021049963231554097_o.jpg',
				likes: 5					
			},
			{
				id: 4,
				src: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ5ssRY5xJ5t5e2haASl76cdvi_hBkf6S70w0ljHbLGnQ0mbz3R',
				likes: 34					
			},
			{
				id: 5,
				src: 'http://fotosdemotosyautos.com/wp-content/uploads/2015/09/auto-de-lujo-5.jpg',
				likes: 31					
			},
			{
				id: 6,
				src: 'http://fotosdemotosyautos.com/wp-content/uploads/2015/09/auto-de-lujo-5.jpg',
				likes: 1					
			}
		]
	}

	res.send(user);
})

// ruta para la pagina del usuario
app.get('/:username', function(req, res){
	res.render('index', { tile: `Platzigram - ${req.params.username}` })
})

//ruta para las fotos del usuario
app.get('/:username/:id', function(req, res){
	res.render('index', { tile: `Platzigram - ${req.params.username}` })
})

app.listen(3000, function(err){ //puerto donde se correra la pagina
	if(err) return console.log('Hubo un error'), process.exit(1);

	console.log("Platzigram escuchando puerto 3000");
})