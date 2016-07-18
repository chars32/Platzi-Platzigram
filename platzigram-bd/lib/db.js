'use strict'

// Llamamos a los modulos que necesitamos
const co = require('co')
const r = require('rethinkdb')
const Promise = require('bluebird')

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
  // parametros (options),
  constructor (options){
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
  }

  // Esta funcion connect sera la que utilizaremos para poder hacer 
  // la conexion con la base de datos, dentro de ella definiremos
  // como se hara dicha conexion.
  connect(callback) {
    //Aqui empieza la conexion a la bd. Se usa una promise
    //ver documentacion rethinkdb
    this.connection = r.connect({ 
      host: this.host,
      port: this.port
    })

    // Declaramos las variables para que pueden ser accesadas
    // en los diferentes scopes.
    let db = this.db
    let connection = this.connection

    // ------------------------------------------------------------------
    // OJO --> Debido a que en estos ejemplos no usaremos async y wait en 
    // lugar de ellos usaremos el modulo co el cual utiliza yield para 
    // recibir una promise.
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
      if (dbTables.indexOf('images') === -1){
        yield r.db(db).tableCreate('images').run(conn)
      }

      if (dbTables.indexOf('users') === -1){
        yield r.db(db).tableCreate('users').run(conn)
      }

      return conn

    })

    // En este return mediante Promise utilizamos bluebird, que nos
    // da la opcion de utilizar el connect como una Promise o 
    // como si lu usaramos con un callback.
    return Promise.resolve(setup()).asCallback(callback)
  }
}

module.exports = Db
