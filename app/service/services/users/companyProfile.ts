import { CompanyProfileInterface } from "../../interface/users/companyProfile";
import { getDB } from "../dbInstance";

// Create/update Company profile data
const createCompanyProfileService = async (
  input: CompanyProfileInterface,
  mongoConnString: string
) => {
  try {
    let result = {};
    const db = await getDB(mongoConnString);
    result = await db.companyProfile.findOneAndUpdate(
      {},
      { $set: input },
      { upsert: true, new: true }
    );
    return { data: result, status: true };
  } catch (error) {
    return { error: error, status: false };
  }
};

//Fetch company profile data
const findAllCompanyProfileService = async (mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.companyProfile.find();
    return { data: result, status: true };
  } catch (error) {
    console.log("Error in createCompanyProfileService:", error);
    return { error: error, status: false };
  }
};

module.exports = {
  createCompanyProfileService,
  findAllCompanyProfileService,
};
