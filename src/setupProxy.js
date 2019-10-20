const proxy = require('http-proxy-middleware');

const target = process.env.API_URI || 'http://104.248.92.150:8080';

module.exports = function(app) {
  app.use(
    proxy('/api/oauth', {
      target,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/api/oauth': '/oauth' // remove api for oauth
      }
    })
  );
  app.use(
    proxy('/api', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
  app.use(
    proxy('/static/uploads', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
  app.use(
    proxy('/static/exports', {
      target,
      secure: false,
      logLevel: 'debug'
    })
  );
};
