import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import path from "path";
const userConfig = require("./app/config/index");
import { socketConnection } from "./app/socket";
const http = require("http");
const app: Express = express();
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // You can replace "*" with your frontend domain
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});


// For access the images from public folder
app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/:value1", (_req: Request, res: Response) => {
  res.send("User module");
});

require("./app/routes/users/user")(app);
require("./app/routes/settings/settings")(app);
require("./app/routes/users/role")(app);
require("./app/routes/users/rolePermission")(app);
require("./app/routes/users/companyProfile")(app);
require("./app/routes/settings/printerConfigurations")(app);
require("./app/routes/users/login")(app);
require("./app/routes/users/profileSettings")(app);
const server = http.createServer(app);
server.maxConnections = 1000;
socketConnection(server);
app.listen(userConfig.config.server.users, () => {
  console.log(`Connected.... ${userConfig.config.server.users}`);
});
