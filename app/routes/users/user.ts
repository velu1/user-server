const userController = require("../../controller/users/user");

module.exports = (app: any) => {
  app.post("/api/user", userController.create);
  app.post("/api/user/all", userController.findAllUsers);
  app.patch("/api/user/:id", userController.updateUser);
  app.delete("/api/user/:id", userController.deleteUser);
  app.post("/api/reset-password", userController.resetPassword);
  app.post("/api/forgot-password", userController.forgotPassword);
};
