const proxy = require('http-proxy-middleware');

const target = process.env.API_URI || 'localhost:4000/api';

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
};
