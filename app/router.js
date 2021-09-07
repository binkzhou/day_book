module.exports = (app) => {
  const { router, controller } = app;
  router.post("/api/user/register", controller.user.register);
  router.post("/api/user/login", controller.user.login);
  router.get("/api/user/get_userinfo", controller.user.getUserInfo);
  router.post("/api/user/update_userinfo", controller.user.modifyUserInfo);
  router.post("/api/user/update_password", controller.user.modifyPassword);
};
