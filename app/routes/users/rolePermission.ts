const rolePermissionController = require("../../controller/users/rolePermission");

module.exports = (app: any) => {
  app.post(
    "/api/role-permission",
    rolePermissionController.updateRolePermissions
  );
};
