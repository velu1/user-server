let companyProfileController = require("../../controller/users/companyProfile");

module.exports = (app: any) => {
  app.post(
    "/api/company-profile",
    companyProfileController.createCompanyProfile
  );
  app.get(
    "/api/company-profile",
    companyProfileController.findAllCompanyProfile
  );
};
