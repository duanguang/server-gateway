'use strict';
const path=require('path');
const baseDir = path.resolve('.');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1514863052989_3195';
  config.cors={
    credentials: true
  }

  // add your config here
  config.middleware = ['gzip'];
  config.gzip={
    threshold: 1024, // 小于 1k 的响应体不压缩
  }
  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true,
    gzip:true
    // maxAge: 31536000,
  };
  return config;
};
