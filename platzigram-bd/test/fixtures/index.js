'use strict'

const uuid = require('uuid-base62')

const fixtures = {
  getImage () {
    return {
      description: 'an #awesome picture with #tags #platzi',
      url: `http://platzigram.test/${uuid.v4()}.jpg`,
      likes: 0,
      liked: false,
      user_id: uuid.uuid()
    }
  }
}

module.exports = fixtures
