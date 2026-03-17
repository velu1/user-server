// import * as z from "zod";
import { Request, Response } from "express";
// import { service } from "../../service/app";
// import { ResponseInterface } from "../../interface/response";

//Add Settings
exports.createSettings = async (_req: Request, _res: Response) => {
  // try {
  //   const mongoConnString = req.headers["x-tenant-mongodb-uri"];
  //   const createSettingsData: ResponseInterface =
  //     await service.systemConfig.createUpdateSystemConfig(
  //       req.body,
  //       mongoConnString
  //     );
  //   if (createSettingsData.status) {
  //     return res.status(200).send({
  //       data: createSettingsData.data,
  //       message: "Created Successfully ",
  //     });
  //   } else {
  //     return res.status(400).send({
  //       message: "Error in adding Settings Meta ",
  //     });
  //   }
  // } catch (error) {
  //   if (error instanceof z.ZodError) {
  //     return res.status(500).send({
  //       message: "Data validation error list",
  //       detail: error.issues,
  //     });
  //   }
  //   return res.status(500).send({
  //     message: "Failed to perform request",
  //     detail: `${error}`,
  //   });
  // }
};

//get all Settings Meta
exports.getAllSettings = async (_req: Request, res: Response) => {
  try {
    // const mongoConnString = req.headers["x-tenant-mongodb-uri"];
    // const getAllSettings: any =
    //   await service.systemConfig.getAllsystemConfig(mongoConnString);
    const getAllSettings = {
      status: true,
      data: {}
    }
    if (getAllSettings.status) {
      return res.status(200).send(getAllSettings.data);
    } else {
      return res.status(400).send({ message: "Internal Server Error" });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error in fetching",
    });
  }
};
