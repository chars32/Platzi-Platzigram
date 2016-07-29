'use strict'

import { send } from 'micro'
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
console.log(env)

const hash = HttpHash()

hash.set('GET /:id', async function getPicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.getImage(id)
  await db.disconnect()
  send(res, 200, image)
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
