const promClient = require('prom-client')
const normalizePath = require('./lib/normalize-path')
const routeMatcher = require('./lib/route-matcher')
module.exports = function (sails) {
  let hook
  const stats = {}
  const skipRoutes = ['/metrics']
  let findRouteByUrl

  return {
    defaults: require('./lib/defaults'),
    initialize: function (cb) {
      hook = this

      return require('./lib/initialize')(sails, hook, stats, cb)
    },

    configure: () => {
      findRouteByUrl = routeMatcher(sails.config.routes)
      sails.config.policies[sails.config.prometheus.router.identity] = [true]
    },

    registerActions: function (cb) {
      sails.registerAction(function (_, res) {
        return res
          .status(200)
          .set('Content-Type', promClient.register.contentType)
          .send(promClient.register.metrics())
      }, sails.config[hook.configKey].router.identity)
      return cb()
    },

    routes: {
      before: {
        'all /*': function (req, res, next) {
          if (req.isSocket && !sails.config[hook.configKey].sockets.enabled) {
            return next()
          }

          if (skipRoutes.indexOf(req.url) !== -1) {
            return next()
          }

          if (sails.config[hook.configKey].httpMetric.enabled) {
            if (sails.config[hook.configKey].httpMetric.route.exclude.length) {
              if (
                normalizePath(req).match(
                  sails.config[hook.configKey].httpMetric.route.exclude.join(
                    '|'
                  )
                ) !== null
              ) {
                return next()
              }
            }

            let url = req.path

            if (sails.config[hook.configKey].httpMetric.urlQueryString) {
              url = req.url
            } else if (sails.config[hook.configKey].httpMetric.urlParams === false) {
              // use route path for metrics if available - so we dont create metric with each unique parameter...
              url = findRouteByUrl(url) || '/not-resolved'
            }

            const endTimer = stats.httpMetric.histogram.startTimer({
              method: req.method,
              path: url
            })

            res.once('finish', function onceFinish () {
              stats.throughputMetric.inc()

              endTimer({
                status_code: (req.res && req.res.statusCode) || res.statusCode || 0
              })
            })
          }

          return next()
        },
        '/metrics': function (req, res, next) {
          return res
            .status(200)
            .set('Content-Type', promClient.register.contentType)
            .send(promClient.register.metrics())
        }
      }
    },

    counter: (function () {
      const counters = {}

      return {
        setup ({ name, help, labelNames = [] }) {
          if (counters[name]) {
            return
          }
          counters[name] = {
            _metric: new promClient.Counter({
              name,
              help,
              labelNames
            }),

            inc ({ amount = 1, labels = {} }) {
              this._metric.inc(labels, amount)
              return this
            }
          }
          return counters[name]
        }
      }
    }()),

    gauge: (function () {
      const gauges = {}

      return {
        setup ({ name, help, labelNames = [] }) {
          if (gauges[name]) {
            return
          }
          gauges[name] = {
            _metric: new promClient.Gauge({
              name,
              help,
              labelNames
            }),

            inc ({ amount = 1, labels = {} }) {
              this._metric.inc(labels, amount)
              return this
            },

            set ({ amount = 1, labels = {} }) {
              this._metric.set(labels, amount)
              return this
            },

            dec ({ amount = 1, labels = {} }) {
              this._metric.dec(labels, amount)
              return this
            }
          }

          return gauges[name]
        }
      }
    }())
  }
}
