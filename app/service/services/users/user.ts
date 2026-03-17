import { getDB } from "../dbInstance";

const userLogin = async (input: any, mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    let query = {email: input.email, password: Number(input.password)}
    const result = db.users.findOne(query).populate({
      path: "role",
      populate: {
        path: "rolePermission",
        // Do not specify 'model' here; let Mongoose use 'refPath'
      },
    });
    return result;
  } catch (error) {
    console.log("Error in login:", error);
    return null;
  }
};


const findAllUsers = async ( mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const result = db.users.find({ isSuperAdmin: false, isActive: true, isDeleted: false }).sort({ createdAt: -1 }).populate({
      path: "role",
      populate: {
        path: "rolePermission",
      },
    });
    return result;
  } catch (error) {
    console.log("Error in login:", error);
    return null;
  }
};

//Create User
const createUser = async (input: any, mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const create = await db.users.create(input);
    return { data: create, status: true };
  } catch (error) {
    console.log("Error in createUserService service:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return { error: error, statusCode: 400, status: false };
      }
    }
    return { data: error, status: false };
  }
};

//Update User details
const updateUser = async (
  id: string,
  updateData: any,
  mongoConnString: string
) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.users.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return { data: result, status: true };
  } catch (error) {
    console.log("Error in updateUser service:", error);
    return { data: error, status: false };
  }
};

//Delete User details
const deleteUser = async (id: string, mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    const result = await db.users.findByIdAndUpdate(
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
  userLogin,
  findAllUsers,
  createUser,
  updateUser,
  deleteUser
};
