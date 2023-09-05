module.exports = {
  name: '@e3d/web-backoffice-service',
  script: 'serve',
  env: {
    PM2_SERVE_PATH: './dist',
    PM2_SERVE_PORT: 3013,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: '/index.html'
  }
};

