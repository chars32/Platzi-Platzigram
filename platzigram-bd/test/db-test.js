'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const fixtures = require('./fixtures')

// Seteamos la dbName y le pasamos el valor compuesto de
// platzigram_ mas caracteres dados por uuid
const dbName = `platzigram_${uuid.v4()}`

// En db almacenaremos la nueva base de datos
const db = new Db({ db: dbName })

// TESTEANDO LA BASE DE DATOS

// Prueba para conectar
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

  let image = fixtures.getImage()

  // created == db.js & image es de fixtures.js
  let created = await db.saveImage(image)
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, ['awesome', 'tags', 'platzi'])
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createdAt)
})

// Prueba para dar like y comparar el numero de ellos
test('like image', async t => {
  t.is(typeof db.likeImage, 'function', 'likeImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.public_id)

  t.true(result.liked)
  t.is(result.likes, image.likes + 1)
})

test('get image', async t => {
  t.is(typeof db.getImage, 'function', 'getImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.getImage(created.public_id)

  t.deepEqual(created, result)
})
