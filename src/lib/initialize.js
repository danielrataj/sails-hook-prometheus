const promClient = require('prom-client');

module.exports = function (sails, hook, stats, cb) {
  if (sails.hooks.http) {
    sails.after('hook:http:loaded', function () {
      if (sails.config[hook.configKey].httpMetric.enabled) {
        const labels = [`status_code`, `method`, `path`];
        const buckets = sails.config[hook.configKey].httpMetric.buckets;

        const type =
          sails.config[hook.configKey].httpMetric.type.charAt(0).toUpperCase() +
          sails.config[hook.configKey].httpMetric.type.slice(1);

        stats.httpMetric = {
          histogram: new promClient[type]({
            name: sails.config[hook.configKey].httpMetric.name,
            help: `${
              sails.config[hook.configKey].httpMetric.help
            }: ${labels.join(', ')}`,
            labelNames: labels,
            buckets: buckets,
            prefix: sails.config[hook.configKey].httpMetric.prefix
          })
        };
      }

      // server is up
      if (sails.config[hook.configKey].upMetric.enabled) {
        stats.up = new promClient.Gauge({
          name: sails.config[hook.configKey].upMetric.name,
          help: sails.config[hook.configKey].upMetric.help
        });

        stats.up.set(1);
      }

      // server is up
      if (sails.config[hook.configKey].throughputMetric.enabled) {
        stats.throughputMetric = new promClient.Counter({
          name: sails.config[hook.configKey].throughputMetric.name,
          help: sails.config[hook.configKey].throughputMetric.help
        });
      }

      if (sails.config[hook.configKey].defaultMetrics.enabled) {
        promClient.collectDefaultMetrics({
          prefix: sails.config[hook.configKey].defaultMetrics.prefix
        });
      }
    });
  }
  return cb();
};
