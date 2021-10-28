const detectVerb = require('./detect-verb')

module.exports = function (routes) {
  const routeMatchers = {}

  for (const route in routes) {
    const path = detectVerb(route).path
    if (!routeMatchers[path]) {
      // create regExp for current route path
      let matcher = path
      // replace wildcards
      matcher = matcher.replace(/\*/g, '([\\w-]+)')
      // replace url params by regular
      matcher = matcher.replace(/:[^\s/]+/g, '([\\w-]+)')
      routeMatchers[path] = RegExp('^' + matcher + '$')
    }
  }

  const findRouteByUrl = function (url) {
    for (const path in routeMatchers) {
      const regexp = routeMatchers[path]
      if (regexp && String(url).match(regexp)) {
        return path
      }
    }
    return null
  }

  return findRouteByUrl
}
