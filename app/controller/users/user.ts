import * as z from "zod";
import { Request, Response } from "express";
import axios from "axios";
const config = require("../../config/auth.config");
const logger = require("./../../utils/logger");
const { getIpFromRequest } = require("./../../utils/extra");
import { passwordResetTemplate } from "../../utils/templates";
import { sendMail } from "../../email/nodemailer";
import { service } from "../../service/app";

// Helper: get role name from role ID in realm roles
async function getRoleNameById(
  realm: string,
  roleId: string,
  token: string
): Promise<string> {
  const rolesResponse = await axios.get(
    `${config.keyCloakURL}/admin/realms/${realm}/groups`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const roles = rolesResponse.data as Array<{ id: string; name: string }>;
  const role = roles.find((r) => r.id === roleId);
  if (!role) throw new Error(`Role with ID ${roleId} not found`);
  return role.name;
}

function generatePassword(length: number = 16): string {
  const allowed =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-=.,?";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  return pass;
}

async function createRealmUser(
  realmName: string,
  adminAccessToken: string,
  userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }
): Promise<string> {
  const userUrl = `${config.keyCloakURL}/admin/realms/${realmName}/users`;
  const userPayload = {
    username: userData.username,
    email: userData.email,
    enabled: true,
    emailVerified: true,
    credentials: [
      {
        type: "password",
        value: userData.password,
        temporary: false,
      },
    ],
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
  };
  const userRes = await axios.post(userUrl, userPayload, {
    headers: { Authorization: `Bearer ${adminAccessToken}` },
    validateStatus: () => true,
  });
  if (userRes.status !== 201) {
    throw new Error(`Email Id is already exists!`);
  }
  const location = userRes.headers["location"] || userRes.headers["Location"];
  const userId = location ? location.split("/").pop() : undefined;
  if (!userId) throw new Error("Could not determine created user ID");
  return userId;
}

async function addUserToGroup(
  realmName: string,
  userEmail: string,
  groupName: string,
  adminAccessToken: string
): Promise<void> {
  // Get userId by email
  const usersUrl = `${
    config.keyCloakURL
  }/admin/realms/${realmName}/users?email=${encodeURIComponent(userEmail)}`;
  const usersRes = await axios.get(usersUrl, {
    headers: { Authorization: `Bearer ${adminAccessToken}` },
  });
  const user =
    usersRes.data && usersRes.data.length > 0 ? usersRes.data[0] : undefined;
  if (!user)
    throw new Error(
      `User with email '${userEmail}' not found in realm '${realmName}'`
    );
  const userId = user.id;

  // Get groupId by group name
  const groupsUrl = `${config.keyCloakURL}/admin/realms/${realmName}/groups`;
  const groupsRes = await axios.get(groupsUrl, {
    headers: { Authorization: `Bearer ${adminAccessToken}` },
  });
  const group = groupsRes.data.find(
    (g: { name: string }) => g.name === groupName
  );
  if (!group)
    throw new Error(
      `Group with name '${groupName}' not found in realm '${realmName}'`
    );
  const groupId = group.id;

  // Add user to group
  const addGroupUrl = `${config.keyCloakURL}/admin/realms/${realmName}/users/${userId}/groups/${groupId}`;
  const res = await axios.put(
    addGroupUrl,
    {},
    {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      validateStatus: () => true,
    }
  );
  if (res.status !== 204) {
    throw new Error(`Failed to add user to group: ${res.statusText}`);
  }
}

exports.create = async (req: Request, res: Response) => {
  logger.info(`${getIpFromRequest(req.socket.remoteAddress)} - Create user`);
  try {
    const code = req.headers["x-tenant-code"] as string;
    const token = req.headers["x-access-token"] as string;
    const roleId = req.body.role;
    const roleName = await getRoleNameById(code, roleId, token);

    if (!code || !token) {
      return res
        .status(400)
        .send({ message: "Missing tenant code or access token" });
    }

    const generatedUserPassword = generatePassword(16);
    await createRealmUser(code, token, {
      username: req.body.emailId,
      email: req.body.emailId,
      password: generatedUserPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    await addUserToGroup(code, req.body.emailId, roleName, token);

    let forgotPasswordTemplate = passwordResetTemplate();
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{FRONTEND_CLIENT_URL}}",
      `${config.FRONTEND_CLIENT_URL}`
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{FRONTEND_CLIENT_URL}}",
      `${config.FRONTEND_CLIENT_URL}`
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{USERNAME}}",
      req.body.emailId
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{FIRST_NAME}}",
      req.body.firstName
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{PASSWORD}}",
      generatedUserPassword
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{COMPANY_CODE}}",
      code
    );
    forgotPasswordTemplate = forgotPasswordTemplate.replace(
      "{{COMPANY_CODE}}",
      code
    );
    sendMail({
      to: req.body.emailId,
      subject: "Account creation successful",
      body: forgotPasswordTemplate,
      replyTo: config.REPLY_EMAIL,
    });

    return res.status(200).send({
      message: "User successfully added",
    });
  } catch (error: any) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return res.status(400).send({
        message: "Data validation error list",
        detail: error.issues,
      });
    }

    if (error.response) {
      // Keycloak API errors
      return res.status(error.response.status).send({
        message: "Error creating user in Keycloak",
        detail: error.response.data || error.response.statusText,
      });
    }
    return res.status(500).send({
      message: error.toString(),
      detail: error.toString(),
    });
  }
};

// exports.findAllUsers = async (req: Request, res: Response) => {
//   try {
//     const {
//       page = 1,
//       pageSize = 10,
//       searchQuery = "",
//       sortColumn = "username",
//       sortOrder = "asc",
//       download = false,
//     } = req.body.pagination || {};

//     const code = req.headers["x-tenant-code"];
//     const token = req.headers["x-access-token"];
//     const realm = code;

//     const usersUrl = `${config.keyCloakURL}/admin/realms/${realm}/users`;

//     const userResponse = await axios.get(usersUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     let users = await Promise.all(
//       userResponse.data.map(async (user: any) => {
//         const groupsUrl = `${config.keyCloakURL}/admin/realms/${realm}/users/${user.id}/groups`;
//         let groupId = null;
//         let name = "";

//         try {
//           const groupResponse = await axios.get(groupsUrl, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           // Take the first group (if exists) and use its ID
//           if (groupResponse.data.length > 0) {
//             groupId = groupResponse.data[0].id;
//             name = groupResponse.data[0].name;
//           }
//         } catch (err) {
//           console.warn(`Failed to fetch groups for user ${user.username}`);
//         }

//         const { email, enabled, ...rest } = user;
//         return {
//           ...rest,
//           emailId: email,
//           phoneNumber: "0000000000",
//           pin: "123456",
//           role: {
//             _id: groupId,
//             name: name,
//           },
//           isUserActive: enabled,
//         };
//       })
//     );
//     // Step 1: Apply search filtering
//     if (searchQuery && searchQuery.trim() !== "") {
//       const lower = searchQuery.toLowerCase();
//       users = users.filter(
//         (user) =>
//           user.username?.toLowerCase().includes(lower) ||
//           user.emailId?.toLowerCase().includes(lower) ||
//           user.firstName?.toLowerCase().includes(lower) ||
//           user.lastName?.toLowerCase().includes(lower) ||
//           user.role?.name?.toLowerCase().includes(lower)
//       );
//     }

//     // Step 2: Apply sorting
//     if (sortColumn) {
//       users.sort((a: any, b: any) => {
//         const valA = a[sortColumn];
//         const valB = b[sortColumn];
//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     // Step 3: Save total count before slicing
//     const totalCount = users.length;

//     // Step 4: Paginate (if not downloading)
//     if (!download) {
//       const start = (page - 1) * pageSize;
//       const end = start + pageSize;
//       users = users.slice(start, end);
//     }

//     return res.status(200).send({
//       data: users,
//       count: totalCount,
//       message: "Users fetched successfully",
//     });
//   } catch (error) {
//     console.log("Error in findAllUsers:", error);
//     return res.status(500).send({
//       message: "Failed to perform request.",
//     });
//   }
// };



// exports.updateUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     if (!userId) {
//       return res.status(400).send({
//         message: "Update request must include user ID",
//       });
//     }

//     const code = req.headers["x-tenant-code"] as string;
//     const token = req.headers["x-access-token"] as string;
//     const roleId = req.body.role;

//     // Step 1: Get role name by roleId
//     const roleName = await getRoleNameById(code, roleId, token);
//     if (!roleName) {
//       return res.status(400).send({
//         message: "Invalid role ID. No matching role found.",
//       });
//     }

//     // Step 2: Prepare user update payload
//     const reqData: any = {
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.emailId,
//       username: req.body.emailId,
//       enabled: req?.body?.status === "Active" ? true : false,
//     };

//     // Step 3: Update user in Keycloak
//     const url = `${config.keyCloakURL}/admin/realms/${code}/users/${userId}`;
//     await axios.put(url, reqData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Step 4: Update user's group
//     await addUserToGroup(code, req.body.emailId, roleName, token);

//     logger.info(
//       `${getIpFromRequest(req.socket.remoteAddress)} ${
//         req.body.firstName + req.body.lastName
//       } - User updated successfully`
//     );

//     return res.status(200).send({
//       message: "User successfully updated",
//     });
//   } catch (error: any) {
//     logger.error("Error updating user:", error);
//     return res.status(500).send({
//       message: "Failed to update user.",
//       detail: error?.response?.data || error.message,
//     });
//   }
// };

// //Delete user data with the ID in the request.
// exports.deleteUser = async (req: Request, res: Response) => {
//   try {
//     if (!req.params.id) {
//       res.status(500).send({
//         message: "Delete data must include user ID",
//       });
//     }
//     const code = req.headers["x-tenant-code"];
//     let token = req.headers["x-access-token"];
//     const url = `${config.keyCloakURL}/admin/realms/${code}/users/${req.params.id}`;
//     const deletedData: any = await axios.delete(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (deletedData.status) {
//       return res.status(200).send({
//         message: "User deleted successfully",
//       });
//     }
//   } catch (error) {
//     return res.status(500).send({
//       message: "Failed to perform request",
//       detail: error,
//     });
//   }
// };

exports.resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmPassword, code, userId } = req.body;

  if (!userId || !code) {
    return res.status(400).send({ message: "userId and realm are required" });
  }

  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .send({ message: "All password fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .send({ message: "New password and confirm password do not match" });
  }

  try {
    // Step 1: Get tenant/client info (client_id & secret)
    let result: any = await fetchExternalTenants();
    if (result?.status !== 200) {
      return res.status(500).json({ message: "No tenants found!" });
    }

    const tenantInfo: any = result.data?.tableData.find(
      (rec: any) => rec.code === code
    );

    if (!tenantInfo || !tenantInfo.keycloak) {
      return res
        .status(400)
        .json({ message: "Tenant or Keycloak credentials not found." });
    }
    const tokenUrl = `${config.keyCloakURL}/realms/master/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", config.superAdmin.clientId);
    params.append("client_secret", config.superAdmin.clientSecret);

    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to get access token: ${JSON.stringify(response.data)}`
      );
    }

    const adminAccessToken = response.data.access_token;

    // Step 3: Get user's email by userId
    const userDetailsUrl = `${config.keyCloakURL}/admin/realms/${code}/users/${userId}`;
    const userDetailsRes = await axios.get(userDetailsUrl, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });

    const userEmail = userDetailsRes.data.email;

    if (!userEmail) {
      return res.status(404).json({ message: "User email not found." });
    }

    // Step 5: Reset password using Admin API
    const resetUrl = `${config.keyCloakURL}/admin/realms/${code}/users/${userId}/reset-password`;
    console.log("resetUrlresetUrl", resetUrl);

    const resetPayload = {
      type: "password",
      value: newPassword,
      temporary: false,
    };

    const resetRes = await axios.put(resetUrl, resetPayload, {
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (resetRes.status === 204) {
      return res.status(200).send({ message: "Password updated successfully" });
    } else {
      return res
        .status(500)
        .send({ message: "Failed to reset password", detail: resetRes.data });
    }
  } catch (error: any) {
    logger.error("Error updating user:", error);
    return res.status(500).send({
      message: "Failed to update user.",
      detail: error?.response?.data || error.message,
    });
  }
};

exports.forgotPassword = async (req: Request, res: Response) => {
  try {
    let result: any = await fetchExternalTenants();
    if (result?.status !== 200) {
      return res.status(500).json({ message: "No tenants found!" });
    }
    const { code, emailId } = req.body;
    if (!code || !emailId) {
      return res
        .status(400)
        .json({ message: "Realm (code) and emailId are required." });
    }

    const tenantInfo: any = result.data?.tableData.find(
      (rec: any) => rec.code === code
    );

    if (!tenantInfo || !tenantInfo.keycloak) {
      return res
        .status(400)
        .json({ message: "Tenant or Keycloak credentials not found." });
    }
    const tokenUrl = `${config.keyCloakURL}/realms/master/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", config.superAdmin.clientId);
    params.append("client_secret", config.superAdmin.clientSecret);

    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to get access token: ${JSON.stringify(response.data)}`
      );
    }

    const adminAccessToken = response.data.access_token;

    // Search user by email
    const userSearchUrl = `${config.keyCloakURL}/admin/realms/${code}/users?email=${emailId}`;
    const usersRes = await axios.get(userSearchUrl, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });

    const user = usersRes.data?.[0];
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    return res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(
      "Forgot password error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: "Internal server error",
      detail: error.response?.data || error.message,
    });
  }
};

async function fetchExternalTenants(): Promise<unknown> {
  const tokenUrl = `${config.keyCloakURL}/realms/master/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", config.superAdmin.clientId);
  params.append("client_secret", config.superAdmin.clientSecret);
  const tokenResponse = await axios.post(tokenUrl, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken)
    throw new Error("Failed to obtain access token from Keycloak");
  const response = await axios.get(
    `${config.superAdminURL}/v1/external/tenants`,
    {
      headers: { Authorization: `Bearer ${accessToken} ` },
    }
  );

  return response.data;
}




exports.findAllUsers = async (req: Request, res: Response) => {
  try {
   const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
      const users = await service.users.findAllUsers(
        mongoConnString
      );
    return res.status(200).send({
      data: users,
      count: users.length,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.log("Error in findAllUsers:", error);
    return res.status(500).send({
      message: "Failed to perform request.",
    });
  }
};

exports.create = async (req: Request, res: Response) => {
  logger.info(`${getIpFromRequest(req.socket.remoteAddress)} - Create user`);
  try {
     const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.users.createUser(
      req.body, mongoConnString
    );
    return res.status(200).send({
      message: "User successfully added",
    });
  } catch (error: any) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return res.status(400).send({
        message: "Data validation error list",
        detail: error.issues,
      });
    }

    if (error.response) {
      // Keycloak API errors
      return res.status(error.response.status).send({
        message: "Error creating user",
        detail: error.response.data || error.response.statusText,
      });
    }
    return res.status(500).send({
      message: error.toString(),
      detail: error.toString(),
    });
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).send({
        message: "Update request must include user ID",
      });
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.users.updateUser(
      userId,
      req.body,
      mongoConnString
    );
    
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} ${
        req.body.firstName + req.body.lastName
      } - User updated successfully`
    );

    return res.status(200).send({
      message: "User successfully updated",
    });
  } catch (error: any) {
    logger.error("Error updating user:", error);
    return res.status(500).send({
      message: "Failed to update user.",
      detail: error?.response?.data || error.message,
    });
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  try {
     if (!req.params.id) {
      res.status(500).send({
        message: "Delete data must include id",
      });
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.users.deleteUser(
      req.params.id,
      req.body,
      mongoConnString
    );
    
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} ${
        req.body.firstName + req.body.lastName
      } - User deleted successfully`
    );

    return res.status(200).send({
      message: "User successfully deleted",
    });
  } catch (error: any) {
    logger.error("Error deleting user:", error);
    return res.status(500).send({
      message: "Failed to delete user.",
      detail: error?.response?.data || error.message,
    });
  }
};