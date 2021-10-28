/* global describe it */
const assert = require('assert')
const _ = require('underscore')

const detectVerb = require('../src/lib/detect-verb')

describe('DetectVerb util', function () {
  it('parse GET route pattern correctly', function () {
    const parsed = detectVerb('GET /resource/:id')
    assert(_.isEqual(parsed, { verb: 'get', original: '/resource/:id', path: '/resource/:id' }))
  })
  it('parse POST route pattern correctly', function () {
    const parsed = detectVerb('post /resource/:id')
    assert(_.isEqual(parsed, { verb: 'post', original: '/resource/:id', path: '/resource/:id' }))
  })
  it('parse any route pattern correctly', function () {
    const parsed = detectVerb('/*')
    assert(_.isEqual(parsed, { verb: '', original: '/*', path: '/*' }))
  })
})
