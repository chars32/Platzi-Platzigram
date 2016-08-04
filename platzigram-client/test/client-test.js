'use strict'

const test = require('ava')
const platzigram = require('../')
const fixtures = require('./fixtures')
// nock lo que hace es hacer mocking de un servidor http
const nock = require('nock')

let options = {
  endpoints: {
    pictures: 'http://platzigram.test/picture',
    users: 'http://platzigram.test/user',
    auth: 'http://platzigram.test/auth'
  }
}

// Test para que cada que se ejecute un test se instancie un contexto
test.beforeEach(t => {
  t.context.client = platzigram.createClient(options)
})

// Test basico para iniciar el client
test('client', t => {
  const client = platzigram.createClient()

  t.is(typeof client.getPicture, 'function')
  t.is(typeof client.savePicture, 'function')
  t.is(typeof client.likePicture, 'function')
  t.is(typeof client.listPicture, 'function')
  t.is(typeof client.listPictureByTag, 'function')
  t.is(typeof client.saveUser, 'function')
  t.is(typeof client.getUser, 'function')
  t.is(typeof client.auth, 'function')
})
 // Test obtener las imagenes
test('getPicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()

 // Creamos un servidor falso (mock)
  nock(options.endpoints.pictures)
    .get(`/${image.publicId}`)
    .reply(200, image)

  let result = await client.getPicture(image.publicId)

  t.deepEqual(image, result)
})
