const promClient = require('prom-client');
const normalizePath = require('./lib/normalize-path');

module.exports = function (sails) {
  let hook;
  let stats = {};
  let skipRoutes = ['/metrics'];

  return {
    defaults: require('./lib/defaults'),
    initialize: function (cb) {
      hook = this;
      return require('./lib/initialize')(sails, hook, stats, cb);
    },

    routes: {
      before: {
        'all /*': function (req, res, next) {
          if (skipRoutes.indexOf(req.url) !== -1) {
            return next();
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
                return next();
              }
            }
            stats.httpMetric.histogram.startTimer({
              status_code: req.res.statusCode,
              method: req.method,
              path: req.url
            })();

            res.once('finish', function onceFinish () {
              stats.throughputMetric.inc();
            });
          }

          return next();
        },
        'get /metrics': function (req, res, next) {
          return res
            .status(200)
            .set(`Content-Type`, promClient.register.contentType)
            .send(promClient.register.metrics());
        }
      }
    }
  };
};
