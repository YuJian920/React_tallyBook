"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post("/api/user/register", controller.user.register);
  router.post("/api/user/login", controller.user.login);
  router.post("/api/user/getUserInfo", _jwt, controller.user.getUserInfo);
  router.post("/api/user/editUserInfo", _jwt, controller.user.editUserInfo);
  router.post("/api/upload", _jwt, controller.upload.upload);
  router.post("/api/bill/add", _jwt, controller.bill.add);
  router.get("/api/bill/list", _jwt, controller.bill.list);
  router.get("/api/bill/detail", _jwt, controller.bill.detail);
  router.post("/api/bill/update", _jwt, controller.bill.update); // 账单更新
  router.post("/api/bill/delete", _jwt, controller.bill.delete); // 删除账单
  router.get('/api/bill/overview', _jwt, controller.bill.overview); // 获取数据
};
