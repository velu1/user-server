import { Request, Response } from "express";
import { service } from "../../service/app";
import { ResponseInterface } from "../../interface/response";
const printerConfigurationLogger = require("../../utils/logger");
const { getIpFromRequest } = require("../../utils/extra");

//create configuration
exports.createPrinterConfigs = async (req: Request, res: Response) => {
  printerConfigurationLogger.info(
    `${getIpFromRequest(req.socket.remoteAddress)} - Create printer ${
      req.body.type
    }`
  );
  try {
    // check if type filed exits in req body
    if (!req.body.type) {
      return res.status(400).json({ message: "The type field is required." });
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
    const createdPrinterConfigResult: ResponseInterface =
      await service.printerConfigurations.createPrinterConfigsService(
        req.body,
        mongoConnString
      );

    printerConfigurationLogger.info(
      `${getIpFromRequest(
        req.socket.remoteAddress
      )} - Created printer successfully`,
      {
        data: createdPrinterConfigResult.data,
      }
    );
    if (createdPrinterConfigResult.status) {
      return res.status(200).send({
        data: createdPrinterConfigResult.data,
        message: "Printer configuration saved successfully.",
      });
    } else {
      return res.status(500).send({
        message: "Some error occurred while creating the printer configuration",
        detail: createdPrinterConfigResult.error,
      });
    }
  } catch (error) {
    console.log("Error in createPrinterConfigs:", error);

    printerConfigurationLogger.error(
      `${getIpFromRequest(req.socket.remoteAddress)} ${
        req.body.firstName + req.body.lastName
      } - catch-error`
    );

    return res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

//Get printer configuration by Type
exports.getPrinterConfigurationsByType = async (
  req: Request,
  res: Response
) => {
  printerConfigurationLogger.info(
    `${getIpFromRequest(req.socket.remoteAddress)} - Fetch printer ${
      req.body.type
    }`
  );
  try {
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
    const getPrinterConfigResult: ResponseInterface =
      await service.printerConfigurations.getPrinterConfigsByTypeService(
        req.params.type,
        mongoConnString
      );
    printerConfigurationLogger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} - Fetch printer`,
      {
        data: getPrinterConfigResult.data,
      }
    );
    if (getPrinterConfigResult.status) {
      return res.status(200).send(getPrinterConfigResult.data);
    } else {
      res.status(500).send({
        message:
          "Some error occurred while fetching printer Configuration data",
        detail: getPrinterConfigResult.error,
      });
    }
  } catch (error) {
    console.log("Error in getPrinterConfigurationsByType:", error);
    return res.status(500).send({
      message: "Failed to perform request.",
      detail: error || "Details error.",
    });
  }
};
