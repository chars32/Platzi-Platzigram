'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')

// Seteamos la dbName y le pasamos el valor compuesto de
// platzigram_ mas caracteres dados por uuid
const dbName = `platzigram_${uuid.v4()}`

// En db almacenaremos la nueva base de datos
const db = new Db({ db: dbName })

// TESTEANDO LA BASE DE DATOS

// Prueva para conectar
test.before('setup database', async t => {
  await db.connect()
  t.true(db.connected, 'should be connected')
})

// Prueba para desconectarse
test.after('disconnect database', async t => {
  await db.disconnect()
  t.false(db.connected, 'should be disconnected')
})

// Lo que debe hacer con la bd siempre despues de desconectarse
test.after.always('cleanup database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

// Prueba para grabar imagen
test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is function')

  let image = {
    url: `https://platzigram.test/${uuid.v4()}.jpg`,
    likes: 0,
    liked: false,
    user_id: uuid.uuid()
  }

  let created = await db.saveImage(image)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})
