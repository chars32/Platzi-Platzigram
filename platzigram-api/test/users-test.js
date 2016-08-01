'use strict'

import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import fixtures from './fixtures/'
import users from '../users'

test.beforeEach(async t => {
  let srv = micro(users)
  t.context.url = await listen(srv)
})

// Test para guardar usuario
test('POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      name: user.name,
      password: user.password,
      email: user.email
    },
    // Este es un metodo del modulo request
    resolveWithFullResponse: true
  }

  let response = await request(options)

  // Estos datos se borran para que no aparezcan
  // en el Response por SEGURIDAD
  delete user.email
  delete user.password

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, user)
})

// Prueba para obtener usuario por nombre de usuario
test('GET /:username', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/${user.username}`,
    json: true
  }

  let body = await request(options)

  delete user.email
  delete user.password

  t.deepEqual(body, user)
})
