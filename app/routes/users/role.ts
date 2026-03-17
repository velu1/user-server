const roleController = require("../../controller/users/role");

module.exports = (app: any) => {
  app.post("/api/role", roleController.createRole);
  app.post("/api/role/all", roleController.getAllRoles);
  app.patch("/api/role/:id", roleController.updateRole);
  app.delete("/api/role/:id", roleController.deleteRole);
  app.get("/api/role/assign-roles", roleController.findAllAssignedRoles);
};
