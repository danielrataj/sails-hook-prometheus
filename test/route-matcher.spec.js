/* global describe it */
const assert = require('assert')
const _ = require('underscore')
const routeMatcher = require('../src/lib/route-matcher')

describe('RouteMatcher', function () {
  it('match correct route', function () {
    const routes = {
      'POST /resources/:id/items': 'ResourceController.createItem',
      'GET /resources/:id/items': 'ResourceController.findItem',
      'GET /other': { controller: 'OtherController', action: 'action' }
    }
    const findByUrl = routeMatcher(routes)
    const route = findByUrl('/resources/someId/items')
    assert(_.isEqual(route, '/resources/:id/items'))
  })
  it('return null if doesnt match any', function () {
    const routes = {
      'POST /resources/:id/items': 'ResourceController.createItem',
      'GET /resources/:id/items': 'ResourceController.findItem',
      'GET /other': { controller: 'OtherController', action: 'action' }
    }
    const findByUrl = routeMatcher(routes)
    const route = findByUrl('/not-found')
    assert(_.isEqual(route, null))
  })
  it('match wildcard route', function () {
    const routes = {
      'GET /wild/some-*': 'WildController.findItem',
      'GET /*': 'AllController.findItem'
    }
    const findByUrl = routeMatcher(routes)
    const route = findByUrl('/wild/some-thing')
    assert(_.isEqual(route, '/wild/some-*'))
  })
  it('match wildcard route', function () {
    const routes = {
      'GET /wild/some-*': 'WildController.findItem',
      'GET /*': 'AllController.findItem'
    }
    const findByUrl = routeMatcher(routes)
    const route = findByUrl('/any-thing')
    assert(_.isEqual(route, '/*'))
  })
})
