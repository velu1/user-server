import { Request, Response } from "express";
import { service } from "../../service/app";
import { ResponseInterface } from "../../interface/response";
const logger = require("../../utils/logger");
const { getIpFromRequest } = require("../../utils/extra");

// Function to handle response
const handleResponse = (
  req: Request,
  res: Response,
  queryResult: ResponseInterface
) => {
  if (queryResult.status) {
    logger.info(
      `${getIpFromRequest(
        req.socket.remoteAddress
      )} - company profile successfully created`
    );
    res.status(200).send({
      data: queryResult.data,
      message: `Company Profile created successfully`,
    });
  } else {
    logger.info(
      `${getIpFromRequest(
        req.socket.remoteAddress
      )} - Error occurred while creating the company profile`
    );
    res.status(500).send({
      message: `Some error occurred while creating the company profile`,
      detail: queryResult.error,
    });
  }
};

// Create/Update Company profile data
exports.createCompanyProfile = async (req: Request, res: Response) => {
  logger.info(
    `${getIpFromRequest(
      req.socket.remoteAddress
    )} - Create/Update Company Profile`
  );

  try {
    if (req.body.image) {
      const base64Image = req.body.image.split("base64,").pop();
      // Save base64 image in the DB (imageData field)
      req.body.imageData = base64Image;
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
    const queryResult: ResponseInterface =
      await service.companyProfile.createCompanyProfileService(
        req.body,
        mongoConnString
      );
    handleResponse(req, res, queryResult);
  } catch (error) {
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} - Create/Update catch-fail`
    );
    return res.status(500).send({
      message: "Failed to perform request.",
      detail: error || "Unknown error.",
    });
  }
};

// Get all company profiles
exports.findAllCompanyProfile = async (req: Request, res: Response) => {
  try {
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
    const queryResult: ResponseInterface =
      await service.companyProfile.findAllCompanyProfileService(
        mongoConnString
      );
    if (queryResult.status) {
      // Optionally attach prefix for image preview
      const formatted = queryResult.data.map((item: any) => ({
        ...item._doc,
        image: `data:image/png;base64,${item.image}`, // Ready to preview in frontend
      }));

      res.status(200).send(formatted);
    } else {
      res.status(500).send({
        message: "Some error occurred while fetching company profile data",
        detail: queryResult.error,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request.",
      detail: error || "Unknown error.",
    });
  }
};
