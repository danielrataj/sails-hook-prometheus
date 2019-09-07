const promClient = require('prom-client')
const normalizePath = require('./lib/normalize-path')

module.exports = function (sails) {
  let hook
  const stats = {}
  const skipRoutes = ['/metrics']

  return {
    defaults: require('./lib/defaults'),
    initialize: function (cb) {
      hook = this
      return require('./lib/initialize')(sails, hook, stats, cb)
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
            }

            const endTimer = stats.httpMetric.histogram.startTimer({
              status_code: (req.res && req.res.statusCode) || res.statusCode || 0,
              method: req.method,
              path: url
            })

            res.once('finish', function onceFinish () {
              stats.throughputMetric.inc()

              endTimer()
            })
          }

          return next()
        },
        'get /metrics': function (req, res, next) {
          return res
            .status(200)
            .set('Content-Type', promClient.register.contentType)
            .send(promClient.register.metrics())
        }
      }
    },

    counter: {
      _metric: null,

      setup ({ name, help, labelNames = [] }) {
        if (!this._metric) {
          this._metric = new promClient.Counter({
            name,
            help,
            labelNames
          })
        }
        return this
      },

      inc ({ amount = 1, labels = {} }) {
        this._metric.inc(labels, amount)
        return this
      }
    },

    gauge: {
      _metric: null,

      setup ({ name, help, labelNames = [] }) {
        if (!this._metric) {
          this._metric = new promClient.Gauge({
            name,
            help,
            labelNames
          })
        }

        return this
      },

      inc ({ amount = 1, labels = {} }) {
        this._metric.set(labels, amount)
        return this
      },

      dec ({ amount = 1, labels = {} }) {
        this._metric.dec(labels, amount)
        return this
      }
    }
  }
}
