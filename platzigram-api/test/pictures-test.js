'use strict'

// Syntaxis emascript modules
import test from 'ava'
import micro from 'micro' // send es un metodo de micro para enviar datos
import listen from 'test-listen' // Herramienta para hacer testing de microservicios con micro
import request from 'request-promise' // Modulo que me permite httpRequest con Promise (promesas)
import fixtures from './fixtures/'
import pictures from '../pictures'

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

test('POST /', async t => {
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
  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

// Caracteristica de Ava, se puede definir los test sin necesidad
// de definir que hace el test, agergando todo
test.todo('POST /:id/like')
