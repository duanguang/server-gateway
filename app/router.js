'use strict';
const LRU = require('lru-cache')
/**
 * @param {Egg.Application} app - egg application
 */
const pathToRegexp = require('path-to-regexp')
module.exports = app => {
  const { router, controller } = app;
  const credentials = app.middlewares.credentials()
  router.get('/', controller.home.index);
  const mockUrlPost = pathToRegexp('/api/config/gateway/:url*', [])
  app.post(mockUrlPost,credentials,'config.create')
  app.get(mockUrlPost, credentials, 'config.show')

  app.post('/api/config/mergeRequest', credentials, 'config.mergeRequest')
};
