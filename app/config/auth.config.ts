require("dotenv").config();

module.exports = {
  secret: "SMARTUPTECHNOLOGIES-JAN-1-2025", // Secret key for generating JWT token
  keyCloakURL: process.env.KEYCLOAK_URL,
  superAdminURL: process.env.SUPERADMIN_URL,
  FRONTEND_CLIENT_URL: process.env.FRONTEND_CLIENT_URL,
  superAdmin: {
    clientId: process.env.SA_CLIENTID,
    clientSecret: process.env.SA_CLIENT_SECRET,
  },
};
