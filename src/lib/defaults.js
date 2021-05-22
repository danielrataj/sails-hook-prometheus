module.exports = {
  __configKey__: {
    defaultMetrics: {
      enabled: true,
      prefix: ''
    },
    router: {
      identity: 'prometheus/metrics'
    },
    httpMetric: {
      enabled: true,
      type: 'histogram',
      name: 'http_request_duration_seconds',
      buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10],
      help: 'duration histogram of http responses labeled with: ',
      route: {
        exclude: [
          '\\.css$',
          '\\.js$',
          '\\.map$',
          '\\.(ico|gif|jpg|jpeg|png)$',
          '\\.(eot|ttf|woff|woff2|svg)$'
        ]
      },
      urlQueryString: true,
      attachOn5xxEnabled: false,
      attachOn5xx: ['']
    },
    upMetric: {
      enabled: true,
      name: 'up',
      help: '1 = up, 0 = not up'
    },
    throughputMetric: {
      enabled: true,
      name: 'throughput',
      help: 'The number of requests served'
    },
    sockets: {
      enabled: false
    }
  }
}
