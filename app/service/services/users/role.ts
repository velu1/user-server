import { getDB } from "../dbInstance";

const findAllRoles = async ( mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const result = db.roles.find({ name: { $nin: "Super Admin" }, isDeleted: false }).sort({ createdAt: -1 });
    return result;
  } catch (error) {
    console.log("Error in login:", error);
    return null;
  }
};

//Create User
const createRole = async (input: any, mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const create = await db.roles.create(input);
    return { data: create, status: true };
  } catch (error) {
    console.log("Error in create role service:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return { error: error, statusCode: 400, status: false };
      }
    }
    return { data: error, status: false };
  }
};

//Update User details
const updateRole = async (
  id: string,
  updateData: any,
  mongoConnString: string
) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.roles.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return { data: result, status: true };
  } catch (error) {
    console.log("Error in updateRole service:", error);
    return { data: error, status: false };
  }
};

//Delete User details
const deleteRole = async (id: string, mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.roles.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      }
    );
    return { data: result, status: true };
  } catch (error) {
    console.log("Error in deleteUser service:", error);
    return { data: error, status: false };
  }
};

module.exports = {
  findAllRoles,
  createRole,
  updateRole,
  deleteRole
};
