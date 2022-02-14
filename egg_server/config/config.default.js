/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1644757824847_1184";

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ["*"], // 配置白名单
  };

  config.jwt = {
    secret: "egg_server",
  };

  config.multipart = {
    mode: "file",
  };

  config.cors = {
    origin: "*", // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  exports.mysql = {
    client: {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "",
      database: "egg_tallybook",
    },
    app: true,
    agent: false,
  };

  return {
    ...config,
    ...userConfig,
  };
};
