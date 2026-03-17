const loginController = require("../../controller/users/login");

module.exports = (app: any) => {
  app.post("/api/login", loginController.tenantLogin);
  app.post("/api/logout", loginController.logout);
};
