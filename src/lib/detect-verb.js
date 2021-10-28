/**
 * Detect HTTP verb in an expression like:
 * `get baz`    or     `get /foo/baz`
 *
 * @api private
 */

module.exports = function (routePattern) {
  var verbExpr = /^\s*(all|get|post|put|delete|trace|options|connect|patch|head)\s+/i
  var matchedVerbs = routePattern.match(verbExpr) || []
  var verbSpecified = matchedVerbs.length ? matchedVerbs[matchedVerbs.length - 1] : ''
  verbSpecified = verbSpecified.toLowerCase()

  // If a verb was specified, eliminate the verb from the original string
  if (verbSpecified) {
    routePattern = routePattern.replace(verbExpr, '').trim()
  } else {
    routePattern = routePattern.trim()
  }

  return {
    verb: verbSpecified,
    original: routePattern,
    path: routePattern
  }
}
