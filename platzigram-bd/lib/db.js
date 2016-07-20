'use strict'

// Llamamos a los modulos que necesitamos
const co = require('co')
const r = require('rethinkdb')
const Promise = require('bluebird')
const utils = require('./utils')
const uuid = require('uuid-base62')

// Definimos defaults con los parametros por defecto.
// Estos parametros podran ser cambiados en el constructor.
const defaults = {
  host: 'localhost',
  port: 28015,
  db: 'platzigram'
}

class Db {
  // Le pasamos a la funcion constructor los valores para poder hacer la conexion.
  // Pueden ser los valores defaults o los que le pasemos como
  // parametros (options)
  constructor (options) {
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
<<<<<<< HEAD
=======
    this.setup = options.setup || false //para saber si usamos test o no
>>>>>>> Rethinkdb
  }

  // Esta funcion connect sera la que utilizaremos para poder hacer
  // la conexion con la base de datos, dentro de ella definiremos
  // como se hara dicha conexion.
  connect (callback) {
    // Aqui empieza la conexion a la bd. Se usa una promise
    // ver documentacion rethinkdb
    this.connection = r.connect({
      host: this.host,
      port: this.port
    })

    this.connected = true

    // Declaramos las variables para que pueden ser accesadas
    // en los diferentes scopes.
    let db = this.db
    let connection = this.connection

<<<<<<< HEAD
    // ------------------------------------------------------------------
    // OJO --> Debido a que en estos ejemplos no usaremos async y wait en
    // lugar de ellos usaremos el modulo co el cual utiliza yield para
    // recibir una promise.
=======
    if (!this.setup) {
      retunr Promise.resolve(connection).asCallback(callback)
    }

    // ------------------------------------------------------------------
    // OJO --> Debido a que en estos ejemplos no usaremos async y wait en
    // lugar de ellos usaremos el modulo "co" el cual utiliza yield para
    // resolver una promise.
>>>>>>> Rethinkdb
    // ------------------------------------------------------------------

    // La variable setup utiliza 'co' para hacer una funcion generadora
    // (son las que tienen el *) la cual verificara que exista la
    // base de datos con sus tablas, de no existir las crea.
    let setup = co.wrap(function * () {
      let conn = yield connection

      let dbList = yield r.dbList().run(conn)
      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }

      let dbTables = yield r.db(db).tableList().run(conn)
      if (dbTables.indexOf('images') === -1) {
        yield r.db(db).tableCreate('images').run(conn)
<<<<<<< HEAD
=======
        // Creamos indexs
        yield r.db(db).table('images').indexCreate('createdAt').run(conn)
        yield r.db(db).table('images').indexCreate('userId', { multi: true }).run(conn)
>>>>>>> Rethinkdb
      }

      if (dbTables.indexOf('users') === -1) {
        yield r.db(db).tableCreate('users').run(conn)
<<<<<<< HEAD
=======
        // Creamos indexs
        yield r.db(db).table('users').indexCreate('username').run(conn)
>>>>>>> Rethinkdb
      }
      return conn
    })

    // En este return mediante varible Promise utilizado bluebird, que nos
    // da la opcion de utilizar el connect como una Promise o
    // como si lu usaramos con un callback.
    return Promise.resolve(setup()).asCallback(callback)
  }

  // Funcion con la cual desconectaremos nuestra bd.
  disconnect (callback) {
    // Cuando this.connected sea igual a False
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }
    // Cuando this.connected sea igual a True
    this.connected = false
    return Promise.resolve(this.connection)
      .then((conn) => conn.close())
  }
  // Funcion para guardar imagenes
  saveImage (image, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db

    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection
      image.createdAt = new Date()
      image.tags = utils.extractTags(image.description)

      // insertamos la imagen en la base de datos.
      let result = yield r.db(db).table('images').insert(image).run(conn)

      // si hubiera errores retornamos un reject
      // recordar que aui Promise funciona con bluebird
      if (result.errors > 0) {
        return Promise.reject(new Error(result.first_error))
      }
      // aqui obtenemos el id que le da rethink a nuestra nueva imagen
      image.id = result.generated_keys[0]

<<<<<<< HEAD
      // actualizamos el valor a la public_id
      yield r.db(db).table('images').get(image.id).update({
        public_id: uuid.encode(image.id)
=======
      // actualizamos el valor a la publicId
      yield r.db(db).table('images').get(image.id).update({
        publicId: uuid.encode(image.id)
>>>>>>> Rethinkdb
      }).run(conn)

      // pasamos la variable create con los valores
      let created = yield r.db(db).table('images').get(image.id).run(conn)

      // retornamos el valor de created
      return Promise.resolve(created)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }
<<<<<<< HEAD
=======

  // Funcion para hacer like a las imagenes
  likeImage (id, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db
    let getImage = this.getImage.bind(this)
    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection

      let image = yield getImage(id)

      yield r.db(db).table('images').get(image.id).update({
        liked: true,
        likes: image.likes + 1
      }).run(conn)

      let created = yield getImage(id)
      return Promise.resolve(created)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para obtener imagen
  getImage (id, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db
    let imageId = uuid.decode(id)

    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection

      let image = yield r.db(db).table('images').get(imageId).run(conn)

      if (!image) {
        return Promise.reject(new Error(`image ${imageId} not found`))
      }

      return Promise.resolve(image)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para obtener todas las imagenes
  getImages (callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db

    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection

      let images = yield r.db(db).table('images').orderBy({
        index: r.desc('createdAt')
      }).run(conn)

      let result = yield images.toArray()

      return Promise.resolve(result)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para obtener imagenes por usuario
  getImagesByUser (userId, password, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let connection = this.connection
    let db = this.db

    let tasks = co.wrap(function * () {
      let conn = yield connection

      yield r.db(db).table('images').indexWait().run(conn)
      let images = yield r.db(db).table('images').getAll(userId, {
        index: 'userId'
      }).orderBy(r.desc('createdAt')).run(conn)

      let result = yield images.toArray()

      return Promise.resolve(result)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para obtener imagenes por tag
  getImagesByTag (tag, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let connection = this.connection
    let db = this.db
    tag = utils.normalize(tag)

    let tasks = co.wrap(function * () {
      let conn = yield connection

      yield r.db(db).table('images').indexWait().run(conn)
      let images = yield r.db(db).table('images').filter((img) => {
        return img('tags').contains(tag)
      }).orderBy(r.desc('createdAt')).run(conn)

      let result = yield images.toArray()

      return Promise.resolve(result)
    })

    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para guardar usuario
  saveUser (user, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db

    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection

      user.password = utils.encrypt(user.password)
      user.createdAt = new Date()

      let result = yield r.db(db).table('users').insert(user).run(conn)

      if (result.errors > 0) {
        return Promise.reject(new Error(result.first_error))
      }

      user.id = result.generated_keys[0]

      let created = yield r.db(db).table('users').get(user.id).run(conn)

      return Promise.resolve(created)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para obtener usuario
  getUser (username, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    // referenciamos la conexion y base de datos
    // por que vamos a usar corrutinas(co)
    let connection = this.connection
    let db = this.db

    // declaramos nuestra corrutina, recordar que estas funcionan
    // como las promesas de js.
    let tasks = co.wrap(function * () {
      let conn = yield connection

      yield r.db(db).table('users').indexWait().run(conn)
      let users = yield r.db(db).table('users').getAll(username, {
        index: 'username'
      }).run(conn)

      let result = null
      try {
        result = yield users.next()
      } catch (e) {
        return Promise.reject(new Error(`user ${username} not found`))
      }
      return Promise.resolve(result)
    })
    return Promise.resolve(tasks()).asCallback(callback)
  }

  // Funcion para autenticar usuario
  authenticate (username, password, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let getUser = this.getUser.bind(this)

    let tasks = co.wrap(function * () {
      let user = null

      try {
        user = yield getUser(username)
      } catch (e) {
        return Promise.resolve(false)
      }

      if (user.password === utils.encrypt(password)) {
        return Promise.resolve(true)
      }
      return Promise.resolve(false)
    })

    return Promise.resolve(tasks()).asCallback(callback)
  }
>>>>>>> Rethinkdb
}

module.exports = Db
