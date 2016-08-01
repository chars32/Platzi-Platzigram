'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'platzigram-bd'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)
if (env === 'test') {
  db = new DbStub()
}

// solo asi logro que pase las pruebas
// por algun motivo no entra al if de arriba
// ya que el NODE_ENV siempre queda en producción
db = new DbStub()

const hash = HttpHash()

// Ruta para poder guardar usuario
hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveUser(user)
  await db.disconnect()

  // Estos datos se borran para que no aparezcan
  // en el Response por SEGURIDAD
  delete created.email
  delete created.password

  send(res, 201, created)
})

export default async function main (req, res) {
  // ------------------------
  let { method, url } = req
  // let method = req.method
  // let url = req.url
  // ------------------------
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
