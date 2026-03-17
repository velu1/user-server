const logger: any = require("./logger");
exports.getIpFromRequest = (ip: any) => {
  let ipArray = ip.split(":");
  return ipArray[ipArray.length - 1];
};

const getIpRequest: any = (ip: string) => {
  let ipArray = ip.split(":");
  return ipArray[ipArray.length - 1];
};

exports.logCall = (req: any, message: string) => {
  logger.info(`${getIpRequest(req.socket.remoteAddress)} - ${message}`);
};
