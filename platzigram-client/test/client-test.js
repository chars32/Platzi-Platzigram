'use strict'

const test = require('ava')
const platzigram = require('../')
// const fixtures = require('./fixtures')

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
