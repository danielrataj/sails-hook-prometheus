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

  it('returns normalized string', function () {
    assert(_.isString(normalizePath(reqWithParams, {
      normalizePath: true
    })))
  })

  it('returns normalized string with regex in path', function () {
    assert(_.isString(normalizePath(reqWithParams, {
      normalizePath: [
        [/[a-z]/, '']
      ]
    })))

    assert(_.isString(normalizePath(reqWithParams, {
      normalizePath: [
        ['[a-z]', '']
      ]
    })))

    assert.throws(
      () => {
        normalizePath(reqWithParams, {
          normalizePath: [
            ['[a-z]', '', '']
          ]
        })
      }, Error)

    assert(_.isString(normalizePath(reqWithParams, {
      urlValueParser: require('url-value-parser')
    })))
  })

  it('URL is the same', function () {
    assert.strictEqual(normalizePath(reqWithoutParams), reqWithoutParams.url)
  })

  it('URL is not the same', function () {
    assert.notStrictEqual(normalizePath(reqWithParams), reqWithParams.url)
  })
})
