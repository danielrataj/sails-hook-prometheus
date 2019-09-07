/* global describe it */
const assert = require('assert')
const _ = require('underscore')
const normalizePath = require('../src/lib/normalize-path')

const reqWithoutParams = {
  url: '/url'
}

const reqWithParams = {
  url: '/url?with=params'
}

describe('Normalize-path feature', function () {
  it('returns string', function () {
    assert(_.isString(normalizePath(reqWithParams)))
  })

  it('URL is the same', function () {
    assert.strictEqual(normalizePath(reqWithoutParams), reqWithoutParams.url)
  })

  it('URL is not the same', function () {
    assert.notStrictEqual(normalizePath(reqWithParams), reqWithParams.url)
  })
})
