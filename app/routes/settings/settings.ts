const systemConfigController = require("../../controller/settings/systemConfig");

module.exports = (app: any) => {
  app
    .route("/api/settings/system-config")
    .post(systemConfigController.createSettings)
    .get(systemConfigController.getAllSettings);
};
