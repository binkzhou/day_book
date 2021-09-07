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
  config.keys = appInfo.name + "_1606747991901_2392";

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ["*"], // 配置白名单
  };
  config.cors = {
    // origin:'*', //允许所有跨域访问，注释掉则允许上面 白名单 访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };
  config.jwt = {
    secret: "egg-learn",
  };
  exports.mysql = {
    client: {
      host: "1.116.80.174",
      port: "3306",
      user: "root",
      password: "450d2c6798406ce8",
      database: "account",
    },
    app: true,
    agent: false,
  };
  return {
    ...config,
  };
};
