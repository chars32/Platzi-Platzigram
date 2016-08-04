'use strict'

// Seteando de manera basica eñ client
const Client = require('./lib/client')

exports.createClient = function (options) {
  return new Client(options)
}
