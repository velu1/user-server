import { Request, Response } from "express";
const logger = require("../../utils/logger");
const { getIpFromRequest } = require("../../utils/extra");
const config = require("../../config/auth.config");
import axios from "axios";

// Update profile settings
exports.updateProfileSettings = async (req: Request, res: Response) => {
  logger.info(
    `${getIpFromRequest(req.socket.remoteAddress)} - Update Profile Settings`
  );
  try {
    let reqData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.emailId,
      attributes: {
        phoneNumber: req.body.phoneNumber,
      },
    };
    const userId = req.params.id;
    const code = req.headers["x-tenant-code"];
    let token = req.headers["x-access-token"];
    const url = `${config.keyCloakURL}/admin/realms/${code}/users/${userId}`;
    const createData: any = await axios.put(url, reqData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (createData.status) {
      logger.info(
        `${getIpFromRequest(req.socket.remoteAddress)} ${
          req.body.firstName + req.body.lastName
        } - Update user success`
      );

      return res.status(200).send({
        data: createData.data,
        message: "User successfully updated",
      });
    } else {
      logger.info(
        `${getIpFromRequest(req.socket.remoteAddress)}  ${
          req.body.firstName + req.body.lastName
        } - Update user fail`
      );
      // Handle validation errors with status code 400
      if (createData.statusCode === 400) {
        return res.status(400).send({
          message: "Validation error while updating the User.",
          detail: createData.error.message,
        });
      }
      return res.status(500).send({
        message: "Some error occurred while updating the user.",
      });
    }
  } catch (error) {
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} - Create/Update catch-fail`
    );
    return res.status(500).send({
      message: "Failed to perform request.",
      detail: error || "Details error.",
    });
  }
};

// Get profile settings
exports.getProfileSettings = async (req: Request, res: Response) => {
  logger.info(
    `${getIpFromRequest(req.socket.remoteAddress)} - Fetch Profile Settings`
  );
  try {
    const userId = req.params.id;
    const code = req.headers["x-tenant-code"];
    let token = req.headers["x-access-token"];
    const url = `${config.keyCloakURL}/admin/realms/${code}/users/${userId}`;
    const createData: any = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (createData.status) {
      logger.info(
        `${getIpFromRequest(req.socket.remoteAddress)} ${
          req.body.firstName + req.body.lastName
        } - Fetch user success`
      );

      return res.status(200).send({
        data: createData.data,
        message: "User successfully fetched",
      });
    } else {
      logger.info(
        `${getIpFromRequest(req.socket.remoteAddress)}  ${
          req.body.firstName + req.body.lastName
        } - Fetch user fail`
      );
      return res.status(500).send({
        message: "Some error occurred while fetching the user.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Failed to perform request.",
      detail: error || "Details error.",
    });
  }
};
