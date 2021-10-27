[![Build Status](https://api.travis-ci.org/danielrataj/sails-hook-prometheus.svg?branch=master)](https://travis-ci.org/danielrataj/sails-hook-prometheus)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=danielrataj_sails-hook-prometheus&metric=alert_status)](https://sonarcloud.io/dashboard?id=danielrataj_sails-hook-prometheus)
![npm](https://img.shields.io/npm/dt/sails-hook-prometheus.svg)
![npm](https://img.shields.io/npm/v/sails-hook-prometheus.svg)
![node](https://img.shields.io/node/v/sails-hook-prometheus.svg)
![NPM](https://img.shields.io/npm/l/sails-hook-prometheus.svg)

# sails-hook-prometheus

Gather Prometheus metrics for your SailsJS application. Also it will opens `/metrics` endpoint where Prometheus can scrap all statistics.

- [sails-hook-prometheus](#sails-hook-prometheus)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Configuration in depth](#configuration-in-depth)
    - [`defaultMetrics.enabled` (boolean)](#defaultmetricsenabled-boolean)
    - [`defaultMetrics.prefix` (string)](#defaultmetricsprefix-string)
    - [`httpMetric.enabled` (boolean)](#httpmetricenabled-boolean)
    - [`httpMetric.name` (string)](#httpmetricname-string)
    - [`httpMetric.type` (string)](#httpmetrictype-string)
    - [`httpMetric.help` (string)](#httpmetrichelp-string)
    - [`httpMetric.buckets` (array of numbers)](#httpmetricbuckets-array-of-numbers)
    - [`httpMetric.route.exclude` (array of strings)](#httpmetricrouteexclude-array-of-strings)
    - [`httpMetric.urlQueryString` (boolean)](#httpmetricurlquerystring-boolean)
    - [`httpMetric.urlParams` (boolean)](#httpmetricurlurlparams-boolean)
    - [`upMetric.enabled` (boolean)](#upmetricenabled-boolean)
    - [`upMetric.name` (string)](#upmetricname-string)
    - [`upMetric.help` (string)](#upmetrichelp-string)
    - [`throughputMetric.enabled` (boolean)](#throughputmetricenabled-boolean)
    - [`throughputMetric.name` (string)](#throughputmetricname-string)
    - [`throughputMetric.help` (string)](#throughputmetrichelp-string)
    - [`sockets.enabled` (boolean)](#socketsenabled-boolean)
  - [Custom metrics](#custom-metrics)
    - [Counter metric](#counter-metric)
    - [Gauge metric](#gauge-metric)
  - [Labels for custom metrics](#labels-for-custom-metrics)
    - [Example for counter metric](#example-for-counter-metric)
  - [Custom `/metrics` endpoint](#custom-metrics-endpoint)
- [Contributors](#contributors)
- [License](#license)

## Installation

Install and save NPM dependency.

```bash
npm install --save sails-hook-prometheus
```

# Configuration

You can override default configuration. Create a file in `/config/prometheus.js` with configuration values listed bellow.

## Configuration in depth

All configuration values bellow are optional.

### `defaultMetrics.enabled` (boolean)

```js
module.exports.prometheus = {
  defaultMetrics: {
    enabled: true
  }
}
```

Enable/disable metric.

### `defaultMetrics.prefix` (string)

```js
module.exports.prometheus = {
  defaultMetrics: {
    prefix: ``
  }
}
```

Prefix for default collected metrics.

### `httpMetric.enabled` (boolean)

```js
module.exports.prometheus = {
  httpMetric: {
    enabled: true
  }
}
```

Enable/disable metric.

### `httpMetric.name` (string)

```js
module.exports.prometheus = {
  httpMetric: {
    name: `http_request_duration_seconds`
  }
}
```

Help text displayed as a metric title under _/metrics_ page.

### `httpMetric.type` (string)

```js
module.exports.prometheus = {
  httpMetric: {
    type: `histogram`
  }
}
```

You can select between _histogram_ or _summary_.

### `httpMetric.help` (string)

```js
module.exports.prometheus = {
  httpMetric: {
    help: `duration histogram of http responses labeled with: `
  }
}
```

Help text displayed next to the metric name.

### `httpMetric.buckets` (array of numbers)

```js
module.exports.prometheus = {
  httpMetric: {
    buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10]
  }
}
```

Buckets related to histogram metric.

### `httpMetric.route.exclude` (array of strings)

```js
module.exports.prometheus = {
  httpMetric: {
    exclude: [
      '\\.css$',
      '\\.js$',
      '\\.(ico|gif|jpg|jpeg|png)$',
      '\\.(eot|ttf|woff|woff2|svg)$'
    ]
  }
}
```

Define which routes are excluded from histogram. Every element in array has to be a regular expression.

### `httpMetric.urlQueryString` (boolean)

```js
module.exports.prometheus = {
  httpMetric: {
    urlQueryString: true
  }
}
```

Include URL query params in `path` label. It is `true` by default but please note your Prometheus server might not be ready for this amount of data (every unique URL).


### `httpMetric.urlParams` (boolean)

```js
module.exports.prometheus = {
  httpMetric: {
    urlParams: true
  }
}
```

Include URL params in `path` label. It is `true` by default but please note your Prometheus server might not be ready for this amount of data (every unique URL).

### `upMetric.enabled` (boolean)

```js
module.exports.prometheus = {
  upMetric: {
    enabled: true
  }
}
```

Enable/disable metric.

### `upMetric.name` (string)

```js
module.exports.prometheus = {
  upMetric: {
    name: `up`
  }
}
```

### `upMetric.help` (string)

```js
module.exports.prometheus = {
  upMetric: {
    help: '1 = up, 0 = not up'
  }
}
```

### `throughputMetric.enabled` (boolean)

```js
module.exports.prometheus = {
  throughputMetric: {
    enabled: false
  }
}
```

Enable/disable metric.

### `throughputMetric.name` (string)

```js
module.exports.prometheus = {
  throughputMetric: {
    name: `throughput`
  }
}
```

### `throughputMetric.help` (string)

```js
module.exports.prometheus = {
  throughputMetric: {
    help: 'The number of requests served'
  }
}
```

### `sockets.enabled` (boolean)

```js
module.exports.prometheus = {
  sockets: {
    enabled: false
  }
}
```

Log socket requests as well. Due to the fact that status code is reserved for HTTP protocol only, the result of status code is always going to be 0.

## Custom metrics
You can add two kind of metrics on your own:

- counter (increase a metric)
- gauge (increase or decrease a metric)

### Counter metric
```js
let counter = sails.hooks.prometheus.counter.setup({
  name: `testcounter`,
  help: `help to the metric`
})

counter.inc() // increase a metric by default 1

 // increase a metric by 2
counter.inc({
  amount: 2
})

// increase a metric by 10
counter.inc({
  amount: 10
})
```

### Gauge metric
```js
let gauge = sails.hooks.prometheus.gauge.setup({
  name: `testgauged`,
  help: `help to the metric`
})

// increase a metric by default 1
gauge.inc()

// increase a metric by 10
gauge.inc({
  amount: 10
})

// decrease a metric by default 1
gauge.dec()

// decrease a metric by 2
gauge.dec({
  amount: 2
})

// set a metric to 100
gauge.set({
  amount: 100
})
```

## Labels for custom metrics
Both count and gauge metrics comes with labels feature as well.

### Example for counter metric

```js
let counter = sails.hooks.prometheus.counter.setup({
  name: `testcounter`,
  help: `help to the metric`
  labelNames: [`counter1`, `counter2`]
})

counter.inc({
  amount: 1,
  labels: {
    counter1: `value`
  }
})
```

*Note:* Gauge metric goes the same.

## Custom `/metrics` endpoint
You can configure your own public route by editing `/config/routes.js` file.

```js
module.exports.routes = {
  'GET /api/v1/metrics': 'prometheus/metrics',
}
```

# Contributors

This project was originally created by Daniel Rataj.

# License

[MIT](./LICENSE)
