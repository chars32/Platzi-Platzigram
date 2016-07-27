'use strict'

// Syntaxis emascript modules
import test from 'ava'
import micro, { send } from 'micro' // send es un metodo de micro para enviar datos
import uuid from 'uuid-base62'
import listen from 'test-listen' // Herramienta para hacer testing de microservicios con micro
import request from 'request-promise' // Modulo que me permite httpRequest con Promise (promesas)

// Tes basico para chequear que funcione
// obtener imagen por id
test('GET /:id', async t => {
  let id = uuid.v4()

  // Creamos un servidor con micro el cual puede ser asincrono
  let srv = micro(async (req, res) => {
    send(res, 200, { id: id })
  })

  // listen recibe el srv y crea una url para probarlo
  let url = await listen(srv)
  // Hacemos la peticion http
  let body = await request({ uri: url, json: true })
  // validamos que el body que retorna es igual al id
  t.deepEqual(body, { id: id })
})

// Caracteristica de Ava, se puede definir los test sin necesidad
// de definir que hace el test, agergando todo
test.todo('POST /')
test.todo('POST /:id/like')
