import { PrinterConfigurationsInterface } from "../../interface/settings/printerConfigurations";
import { getDB } from "../dbInstance";

//create Parts-In,Depanaelize,Bin,slot printer configuration
const createPrinterConfigsService = async (
  printerConfigsData: PrinterConfigurationsInterface,
  mongoConnString: string
) => {
  try {
    const db = await getDB(mongoConnString);

    // Create a new instance of the model
    const newConfig = new db.printerConfigs(printerConfigsData);
    // Validate the instance`
    await newConfig.validate();

    if (printerConfigsData.partsInNamingSeries) {
      printerConfigsData.partsInNamingSeries =
        printerConfigsData.partsInNamingSeries.toUpperCase();
    }

    const result = await db.printerConfigs.findOneAndUpdate(
      { type: printerConfigsData.type },
      { $set: printerConfigsData },
      { upsert: true, new: true }
    );
    return { data: result, status: true };
  } catch (error) {
    console.log("Error in createPrinterConfigsService:", error);
    return { error: error, status: false };
  }
};

const getPrinterConfigsByTypeService = async (
  data: string,
  mongoConnString: string
) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.printerConfigs.findOne({
      type: data,
    });

    return { data: result, status: true };
  } catch (error) {
    console.log("Error in getPrinterConfigsByTypeService:", error);
    return { error: error, status: false };
  }
};

module.exports = {
  createPrinterConfigsService,
  getPrinterConfigsByTypeService,
};
