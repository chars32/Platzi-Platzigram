'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const utils = require('../lib/utils')
const fixtures = require('./fixtures')

// TESTEANDO LA BASE DE DATOS

// Conectar BD
test.beforeEach('setup database', async t => {
  // Seteamos la dbName y le pasamos el valor compuesto de
  // platzigram_ mas caracteres dados por uuid
  const dbName = `platzigram_${uuid.v4()}`

  // En db almacenaremos la nueva base de datos
  const db = new Db({ db: dbName })

  await db.connect()

  t.context.db = db
  t.context.dbName = dbName

  t.true(db.connected, 'should be connected')
})

// Desconectar DB
test.afterEach('disconnect database', async t => {
  let db = t.context.db
  let dbName = t.context.dbName

  await db.disconnect()
  t.false(db.connected, 'should be disconnected')

  // Borrar base de datos
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

// Prueba para grabar imagen
test('save image', async t => {
  let db = t.context.db

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
  let db = t.context.db

  t.is(typeof db.likeImage, 'function', 'likeImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.public_id)

  t.true(result.liked)
  t.is(result.likes, image.likes + 1)
})

// Prueba para obtener una imagen
test('get image', async t => {
  let db = t.context.db

  t.is(typeof db.getImage, 'function', 'getImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.getImage(created.public_id)

  t.deepEqual(created, result)
})

// Prueba para obtener todas las imagenes
test('list all images', async t => {
  let db = t.context.db

  let images = fixtures.getImages(3)
  let saveImages = images.map(img => db.saveImage(img))
  let created = await Promise.all(saveImages)
  let result = await db.getImages()

  t.is(created.length, result.length)
})

// Prueba para guardar usuarios
test('save user', async t => {
  let db = t.context.db

  t.is(typeof db.saveUser, 'function', 'saveUser is a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  let created = await db.saveUser(user)

  t.is(user.username, created.username)
  t.is(user.email, created.email)
  t.is(user.name, created.name)
  t.is(utils.encrypt(plainPassword), created.password)
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt) // truthy verifica que exista un valor
})

// Prueba para obtener los usuarios
test('get user', async t => {
  let db = t.context.db

  t.is(typeof db.getUser, 'function', 'getUser is a function')

  let user = fixtures.getUser()
  let created = await db.saveUser(user)
  let result = await db.getUser(user.username)

  t.deepEqual(created, result)
  t.throws(db.getUser('foo'), /not found/)
})

// Preuba para autentificar a los usuarios
test('authenticate user', async t => {
  let db = t.context.db

  t.is(typeof db.authenticate, 'function', 'authenticate is a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  await db.saveUser(user)

  let success = await db.authenticate(user.username, plainPassword)
  t.true(success)

  let fail = await db.authenticate(user.username, 'foo')
  t.false(fail)
})
