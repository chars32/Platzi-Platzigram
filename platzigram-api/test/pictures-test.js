'use strict'

// Syntaxis emascript modules
import test from 'ava'
import micro from 'micro' // send es un metodo de micro para enviar datos
import listen from 'test-listen' // Herramienta para hacer testing de microservicios con micro
import request from 'request-promise' // Modulo que me permite httpRequest con Promise (promesas)
import fixtures from './fixtures/'
import pictures from '../pictures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  // Creamos un servidor con micro el cual puede ser asincrono
  let srv = micro(pictures)
  // listen recibe el srv y crea una url para probarlo
  t.context.url = await listen(srv)
})

// Test basico para chequear que funcione
// obtener imagen por id
test('GET /:id', async t => {
  // let id = uuid.v4()
  let image = fixtures.getImage()
  let url = t.context.url

  // Hacemos la peticion http
  let body = await request({ uri: `${url}/${image.publicId}`, json: true })
  // validamos que el body que retorna es igual al id
  t.deepEqual(body, image)
})

// Test para lista de imagenes
test('GET /list', async t => {
  let images = fixtures.getImages()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/list`,
    json: true
  }

  let body = await request(options)

  t.deepEqual(body, images)
})

// Test para mostrar imagenes por tag
test('GET /tag/:tag', async t => {
  let images = fixtures.getImagesByTag()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/tag/awesome`,
    json: true
  }

  let body = await request(options)

  t.deepEqual(body, images)
})
// Test cuando no tiene token el POST
test('no token POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true
  }

  t.throws(request(options), /invalid token/)
})

// Test cuando es invalido el token en el POST
test('invalid token POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let token = await utils.signToken({ userId: 'hacky' }, config.secret)
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  t.throws(request(options), /invalid token/)
})

// Test donde todo funciona correctamente con el POST y token
test('secure POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let token = await utils.signToken({ userId: image.userId }, config.secret)
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

// Test para dar like a la imagen
test('POST /:id/like', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: `${url}/${image.id}/like`,
    json: true
  }

  let body = await request(options)
  let imageNew = JSON.parse(JSON.stringify(image))
  imageNew.liked = true
  imageNew.likes = 1

  t.deepEqual(body, imageNew)
})

// Caracteristica de Ava, se puede definir los test sin necesidad
// de definir que hace el test, agergando todo
