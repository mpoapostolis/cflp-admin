const proxy = require('http-proxy-middleware');

const target = process.env.API_URI || 'http://localhost:4000';

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
};
