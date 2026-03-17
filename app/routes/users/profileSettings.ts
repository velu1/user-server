const updateProfileController = require("../../controller/users/profileSettings");

module.exports = (app: any) => {
  app.patch(
    "/api/profileSettings/:id",
    updateProfileController.updateProfileSettings
  );
  app.get(
    "/api/profileSettings/:id",
    updateProfileController.getProfileSettings
  );
};
