'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
<<<<<<< HEAD

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
=======
const utils = require('../lib/utils')
const fixtures = require('./fixtures')

// TESTEANDO LA BASE DE DATOS

// Conectar BD
test.beforeEach('setup database', async t => {
  // Seteamos la dbName y le pasamos el valor compuesto de
  // platzigram_ mas caracteres dados por uuid
  const dbName = `platzigram_${uuid.v4()}`

  // En db almacenaremos la nueva base de datos
  const db = new Db({ db: dbName, setup: true })

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
>>>>>>> Rethinkdb
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

// Prueba para grabar imagen
test('save image', async t => {
<<<<<<< HEAD
  t.is(typeof db.saveImage, 'function', 'saveImage is function')

  let image = {
    description: 'an #awesome picture with #tags #platzi',
    url: `https://platzigram.test/${uuid.v4()}.jpg`,
    likes: 0,
    liked: false,
    user_id: uuid.uuid()
  }

  // created == db.js & image es de aqui
=======
  let db = t.context.db

  t.is(typeof db.saveImage, 'function', 'saveImage is function')

  let image = fixtures.getImage()

  // created == db.js & image es de fixtures.js
>>>>>>> Rethinkdb
  let created = await db.saveImage(image)
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, ['awesome', 'tags', 'platzi'])
<<<<<<< HEAD
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createdAt)
})
=======
  t.is(created.userId, image.userId)
  t.is(typeof created.id, 'string')
  t.is(created.publicId, uuid.encode(created.id))
  t.truthy(created.createdAt)
})

// Prueba para dar like y comparar el numero de ellos
test('like image', async t => {
  let db = t.context.db

  t.is(typeof db.likeImage, 'function', 'likeImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.publicId)

  t.true(result.liked)
  t.is(result.likes, image.likes + 1)
})

// Prueba para obtener una imagen
test('get image', async t => {
  let db = t.context.db

  t.is(typeof db.getImage, 'function', 'getImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.getImage(created.publicId)

  t.deepEqual(created, result)

  t.throws(db.getImage('foo'), /not found/)
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

  let failure = await db.authenticate('foo', 'bar')
  t.false(failure)
})

// Preuba para listar imagenes por usuarios
test('list images by user', async t => {
  let db = t.context.db

  t.is(typeof db.getImagesByUser, 'function', 'getImagesByUser is a function')

  let images = fixtures.getImages(10)
  let userId = uuid.uuid()
  let random = Math.round(Math.random() * images.length)

  let saveImages = []
  for (let i = 0; i < images.length; i++) {
    if (i < random) {
      images[i].userId = userId
    }

    saveImages.push(db.saveImage(images[i]))
  }

  await Promise.all(saveImages)

  let result = await db.getImagesByUser(userId)

  t.is(result.length, random)
})

// Preuba para listar imagenes por tags
test('list images by tag', async t => {
  let db = t.context.db

  t.is(typeof db.getImagesByTag, 'function', 'getImagesByTag is a function')

  let images = fixtures.getImages(10)
  let tag = '#filterit'
  let random = Math.round(Math.random() * images.length)

  let saveImages = []
  for (let i = 0; i < images.length; i++) {
    if (i < random) {
      images[i].description = tag
    }

    saveImages.push(db.saveImage(images[i]))
  }

  await Promise.all(saveImages)

  let result = await db.getImagesByTag(tag)

  t.is(result.length, random)
})
>>>>>>> Rethinkdb
