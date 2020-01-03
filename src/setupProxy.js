const proxy = require('http-proxy-middleware');

const target = 'http://localhost:4000';

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target,
      secure: false,
      logLevel: 'debug'
    }),
    proxy('/images', {
      target,
      secure: false,
      logLevel: 'debug'
    }),
    proxy('/auth', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
};
