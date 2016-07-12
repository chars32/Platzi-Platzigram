// importamos las dependencias que necesitamos y las asignamos
// a una variable
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

// declaramos nuestra primera tarea con gulp.task()
// y le damos el nombre de styles como primer valor
// y una funcion como segundo valor
gulp.task('styles', function() {
	gulp
		.src('index.scss') // llamamos al archivo que nos interesa abrir
		.pipe(sass()) // pasa por el primer pipe el cual es el de sass
		.pipe(rename('app.css')) //segundo pipe es renombramos el archivo
		.pipe(gulp.dest('public')); // tercer pipe le deccimos donde se alojara el archivo deseado.
})

// definimos una tarea que tomara todos los archivos que esten 
// en la carpeta assets y los enviara a la carpeta public
gulp.task('assets', function(){
	gulp
		.src('assets/*') // obtenemos todo lo que se encuentra en la carpeta assets
		.pipe(gulp.dest('public'));
})
// esta funcion es la encargada de hacer el bundle la primera vez y hacer
// un rebundle si existe un cambio en el codigo.
function compile(watch){
	var bundle = browserify('./src/index.js', {debug: true}); //lamamos archivo y lo pasamos por browserify
	
	//esto sirve para que no tengamos que estar encendiendo nuestro 
	//npm cada vez que hagamos un cambio
	if (watch) {
		bundle = watchify(bundle);
		bundle.on('update', function(){
			console.log('--> Bundling...');
			rebundle();
		});
	}

	function rebundle() {
		bundle
			.transform(babel, {presets: ['es2015'], plugins: ['syntax-async-functions', 'transform-regenerator']}) //o transformamos con babel(babelify) y lo demas
			.bundle() //despues genera el archivo que fue procesado por babel y browserify
			.on('error', function (err) { console.log(err); this.emit('end') }) //sirve para cachar errores...
																		//en el inspector del navegador
			.pipe(source('index.js')) //source transforma lo que nos devuelve el bundle en algo que entienda gulp
			.pipe(rename('app.js')) //renombramos el archivo
			.pipe(gulp.dest('public')); //guardamos en carpeta destino		
	}
	
	rebundle();
}
//task build el cual se encargara de hacer el bundle por primera vez
//y si detecta cambios hara un rebundle
gulp.task('build', function(){
	return compile(); //retornamos la funcion compile
});

gulp.task('watch', function(){
	return compile(true);
});

// delcaramos la tarea por 'default' y le asignamos las tareas
// que deberan funcionar por default al correr el server
gulp.task('default', ['styles', 'assets', 'build'])