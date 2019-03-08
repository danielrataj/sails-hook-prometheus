# sails-hook-prometheus
Gather Prometheus metrics for your SailsJS application. Also it will opens `/metrics` endpoint where Prometheus can scrap all statistics.

- [sails-hook-prometheus](#sails-hook-prometheus)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Configuration values](#configuration-values)
- [Contributors](#contributors)
- [License](#license)

## Installation
Install and save NPM dependency.

```bash
npm install --save sails-hook-prometheus
```

# Configuration

You can override default configuration. Create a file in `/config/prometheus.file` with the example content:

```js
module.exports.prometheus = {
  httpMetric: {
    enabled: false
  }
};
```

## Configuration values
It will be explained later.

# Contributors
This project was originally created by Daniel Rataj.

# License
[MIT](./LICENSE)
