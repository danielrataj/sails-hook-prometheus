const promClient = require('prom-client')

module.exports = function (sails) {
  let hook
  let stats = {
    httpMetric: {
      histogram: null,
      up: null
    }
  }

  return {
    defaults: {
      __configKey__: {
        httpMetric: {
          enabled: true,
          name: `http_request_duration_seconds`,
          buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10],
          help: `duration histogram of http responses labeled with: `
        },
        upMetric: {
          enabled: true,
          name: `up`,
          help: '1 = up, 0 = not up'
        }
      }
    },

    initialize: function (cb) {
      hook = this

      if (sails.hooks.http) {
        sails.after('hook:http:loaded', function () {
          if (sails.config[hook.configKey].httpMetric.enabled) {
            const labels = [`status_code`, `method`, `path`]
            const buckets = sails.config[hook.configKey].httpMetric.buckets

            stats.httpMetric = {
              histogram: new promClient.Histogram({
                name: sails.config[hook.configKey].httpMetric.name,
                help: `${sails.config[hook.configKey].httpMetric.help}: ${labels.join(', ')}`,
                labelNames: labels,
                buckets: buckets
              })
            }
          }

          // server is up
          if (sails.config[hook.configKey].upMetric.enabled) {
            stats.up = new promClient.Gauge({
              name: sails.config[hook.configKey].upMetric.name,
              help: sails.config[hook.configKey].upMetric.help
            })

            stats.up.set(1)
          }
        })
      }
      return cb()
    },

    routes: {
      before: {
        'all /*': function (req, res, next) {
          if (sails.config[hook.configKey].httpMetric.enabled) {
            stats.httpMetric.histogram.startTimer({
              status_code: req.res.statusCode,
              method: req.method,
              path: req.url
            })()
          }

          return next()
        },
        'get /metrics': function (req, res, next) {
          return res
            .status(200)
            .set(`Content-Type`, `text/plain`)
            .send(promClient.register.metrics())
        }
      }
    }
  }
}
