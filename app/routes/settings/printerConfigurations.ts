const printerConfigurationController = require("../../controller/settings/printerConfigurations");

module.exports = (app: any) => {
  app.post(
    "/api/settings/printerConfigurations",
    printerConfigurationController.createPrinterConfigs
  );
  app.get(
    "/api/settings/printerConfigurations/:type",
    printerConfigurationController.getPrinterConfigurationsByType
  );
};
