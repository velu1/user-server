import { Request, Response } from "express";
const logger = require("./../../utils/logger");
const { getIpFromRequest } = require("../../utils/extra");
import axios from "axios";
const config = require("../../config/auth.config");
import { service } from "../../service/app";

//Create Role
// exports.createRole = async (req: Request, res: Response) => {
//   logger.info(`${getIpFromRequest(req.socket.remoteAddress)} - Create role`);
//   try {
//     let reqData = {
//       path: req.body.name,
//       name: req.body.name,
//       attributes: {
//         description: [req.body.description],
//       },
//     };
//     const code = req.headers["x-tenant-code"];
//     let token = req.headers["x-access-token"];
//     const url = `${config.keyCloakURL}/admin/realms/${code}/groups`;
//     const createData: any = await axios.post(url, reqData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (createData.status) {
//       logger.info(
//         `${getIpFromRequest(req.socket.remoteAddress)} ${
//           req.body.firstName + req.body.lastName
//         } - Create one user success`
//       );

//       return res.status(200).send({
//         data: createData.data,
//         message: "User successfully added",
//       });
//     } else {
//       logger.info(
//         `${getIpFromRequest(req.socket.remoteAddress)}  ${
//           req.body.firstName + req.body.lastName
//         } - Create one user fail`
//       );
//       // Handle validation errors with status code 400
//       if (createData.statusCode === 400) {
//         return res.status(400).send({
//           message: "Validation error while creating the User.",
//           detail: createData.error.message,
//         });
//       }
//       return res.status(500).send({
//         message: "Some error occurred while creating the user.",
//       });
//     }
//   } catch (error: any) {
//     return res.status(500).send({
//       message: error.response?.data?.errorMessage,
//     });
//   }
// };

// exports.updateRole = async (req: Request, res: Response) => {
//   logger.info(`${getIpFromRequest(req.socket.remoteAddress)} - Update role`);
//   try {
//     const groupId = req.params.id;
//     const realm = req.headers["x-tenant-code"];
//     const token = req.headers["x-access-token"];

//     if (!groupId || !realm || !token) {
//       return res.status(400).send({
//         message: "Missing role ID, tenant code, or access token.",
//       });
//     }
//     const url = `${config.keyCloakURL}/admin/realms/${realm}/groups/${groupId}`;
//     const updateData = {
//       name: req.body.name,
//       attributes: {
//         description: [req.body.description || "N/A"],
//       },
//     };
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//     await axios.put(url, updateData, { headers });
//     logger.info(
//       `${getIpFromRequest(req.socket.remoteAddress)} - Role updated: ${
//         req.body.name
//       }`
//     );
//     return res.status(200).send({
//       message: "Role updated successfully.",
//     });
//   } catch (error: any) {
//     logger.error(
//       "Error updating role in Keycloak:",
//       error?.response?.data || error
//     );
//     return res.status(500).send({
//       message: "Failed to update role.",
//       detail: error?.response?.data?.errorMessage || error.message,
//     });
//   }
// };

//Delete user data with the ID in the request.
exports.deleteRole = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(500).send({
        message: "Delete data must include role ID",
      });
    }
    const code = req.headers["x-tenant-code"];
    let token = req.headers["x-access-token"];
    const url = `${config.keyCloakURL}/admin/realms/${code}/groups/${req.params.id}`;
    const deletedData: any = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (deletedData.status) {
      return res.status(200).send({
        message: "Role deleted successfully",
      });
    }
  } catch (error) {
    return res.status(200).send({
      message: "Failed to perform request",
      details: error,
    });
  }
};

// Fetch all role details with group descriptions
// exports.getAllRoles = async (req: Request, res: Response) => {
//   const { page, pageSize, searchQuery, sortColumn, sortOrder, download }: any =
//     req.body.pagination;
//   const code = req.headers["x-tenant-code"];
//   const token = req.headers["x-access-token"];
//   const baseUrl = `${config.keyCloakURL}/admin/realms/${code}/groups`;

//   try {
//     // Step 1: Fetch all groups
//     const groupResult = await axios.get(baseUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (groupResult?.status !== 200) {
//       return res.status(500).send({
//         message: "Error fetching groups",
//         detail: groupResult.data,
//       });
//     }
//     const groups = groupResult.data;
//     // Step 2: Fetch role mappings and detailed group info in parallel
//     const groupRoleMappings = await Promise.all(
//       groups.map(async (group: any) => {
//         const groupId = group.id;
//         // Fetch detailed group info to get attributes including description
//         const groupDetailUrl = `${baseUrl}/${groupId}`;
//         const groupDetailResult = await axios.get(groupDetailUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         // Extract description from attributes (if exists)
//         let description = "-";
//         const attributes = groupDetailResult.data.attributes || {};
//         if (attributes.description) {
//           description = Array.isArray(attributes.description)
//             ? attributes.description[0]
//             : attributes.description;
//         }
//         // Fetch role mappings
//         const roleMappingUrl = `${config.keyCloakURL}/admin/realms/${code}/groups/${groupId}/role-mappings`;
//         const roleMappingResult = await axios.get(roleMappingUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         return {
//           groupId,
//           groupName: group.name,
//           description,
//           roles: roleMappingResult.data,
//         };
//       })
//     );

//     // Step 3: Transform data to required format
//     let transformed = groupRoleMappings.map((group) => {
//       const rolePermissionIds: string[] = [];

//       const clientMappings = group.roles?.clientMappings || {};
//       Object.values(clientMappings).forEach((client: any) => {
//         client.mappings.forEach((mapping: any) => {
//           rolePermissionIds.push(mapping.id);
//         });
//       });

//       const cleanedRolePermission = rolePermissionIds.map((id: any) =>
//         id.replaceAll("-", "")
//       );

//       return {
//         name: group.groupName,
//         description: group.description || "",
//         rolePermission: cleanedRolePermission,
//         defaultRole: true,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         id: group.groupId,
//       };
//     });
//     // Step 4: Apply search filter if searchQuery is provided
//     if (searchQuery && searchQuery.trim() !== "") {
//       const lowerSearch = searchQuery.toLowerCase();
//       transformed = transformed.filter(
//         (item) =>
//           item.name.toLowerCase().includes(lowerSearch) ||
//           item.description.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Step 5: Apply sorting
//     if (sortColumn) {
//       transformed.sort((a: any, b: any) => {
//         const valA = a[sortColumn];
//         const valB = b[sortColumn];
//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     // Step 6: Store total count before pagination
//     const totalCount = transformed.length;

//     // Step 7: Apply pagination only if download is false
//     if (!download) {
//       const startIndex = (page - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
//       transformed = transformed.slice(startIndex, endIndex);
//     }
//     // Step 4: Return final response
//     return res.status(200).send({
//       data: transformed,
//       count: totalCount,
//       message: "Groups with role mappings fetched successfully",
//     });
//   } catch (error: any) {
//     console.error(
//       "Error fetching groups or role mappings:",
//       error?.response?.data || error
//     );
//     return res.status(500).send({
//       message: "Error fetching groups or role mappings",
//       detail: error?.response?.data || error.toString(),
//     });
//   }
// };

//Fetch all dashboard card details
exports.findAllAssignedRoles = async (req: Request, res: Response) => {
  try {
    const code = req.headers["x-tenant-code"];
    let token = req.headers["x-access-token"];
    const clientId = req.headers["x-keycloak-clientid"];
    // Get clientId
    const clientIdURL = `${config.keyCloakURL}/admin/realms/${code}/clients?clientId=${clientId}`;
    const cleintIdResuslt: any = await axios.get(clientIdURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (cleintIdResuslt.data.length === 0) {
      res.status(500).send({
        message: "Error in fetching client details",
      });
    }

    const url = `${config.keyCloakURL}/admin/realms/${code}/clients/${cleintIdResuslt.data[0]?.id}/roles`;
    const queryResult: any = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (queryResult?.status === 200) {
      // return res.status(200).send({
      //   data: queryResult.data,
      //   count: queryResult.data.length,
      //   message: "Roles permissions fetched successfully",
      // });
      const transformedData = queryResult.data.map((role: any) => ({
        type:
          role.name
            .split(":")[1]
            ?.replace(/-/g, " ")
            .replace(/\b\w/g, (l: any) => l.toUpperCase()) || role.name,
        id: role.id.replace(/-/g, ""), // remove hyphens to match your id format if needed
      }));

      // Wrap into your expected structure
      const finalOutput = [
        {
          type: transformedData,
        },
      ];

      return res.status(200).send(finalOutput);
    } else {
      res.status(500).send({
        message: "Some error occurred while fetching role permissions data",
        detail: queryResult.error,
      });
    }
  } catch (error) {
    console.log("Error in findAllAssignedRoles:", error);
    return res.status(500).send({
      message: "Failed to perform request.",
    });
  }
};

exports.getAllRoles = async (req: Request, res: Response) => {
  try {
   const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    const roles = await service.roles.findAllRoles(
      mongoConnString
    );
    return res.status(200).send({
      data: roles,
      count: roles.length,
      message: "Roles fetched successfully",
    });
  } catch (error) {
    console.log("Error in getAllRoles:", error);
    return res.status(500).send({
      message: "Failed to perform request.",
    });
  }
};


exports.createRole = async (req: Request, res: Response) => {
  logger.info(`${getIpFromRequest(req.socket.remoteAddress)} - Create Role`);
  try {
     const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.roles.createRole(
      req.body, mongoConnString
    );
    return res.status(200).send({
      message: "Role successfully added",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      // Keycloak API errors
      return res.status(error.response.status).send({
        message: "Error creating role",
        detail: error.response.data || error.response.statusText,
      });
    }
    return res.status(500).send({
      message: error.toString(),
      detail: error.toString(),
    });
  }
};

exports.updateRole = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    if (!roleId) {
      return res.status(400).send({
        message: "Update request must include role ID",
      });
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.roles.updateRole(
      roleId,
      req.body,
      mongoConnString
    );
    
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} ${
        req.body.firstName + req.body.lastName
      } - Role updated successfully`
    );

    return res.status(200).send({
      message: "Role successfully updated",
    });
  } catch (error: any) {
    logger.error("Error updating role:", error);
    return res.status(500).send({
      message: "Failed to update role.",
      detail: error?.response?.data || error.message,
    });
  }
};

exports.deleteRole = async (req: Request, res: Response) => {
  try {
     if (!req.params.id) {
      res.status(500).send({
        message: "Delete data must include role ID",
      });
    }
    const mongoConnString = req.headers["x-tenant-mongodb-uri"];
           
    await service.roles.deleteRole(
      req.params.id,
      req.body,
      mongoConnString
    );
    
    logger.info(
      `${getIpFromRequest(req.socket.remoteAddress)} ${
        req.body.firstName + req.body.lastName
      } - Role deleted successfully`
    );

    return res.status(200).send({
      message: "Role successfully deleted",
    });
  } catch (error: any) {
    logger.error("Error deleting role:", error);
    return res.status(500).send({
      message: "Failed to delete role.",
      detail: error?.response?.data || error.message,
    });
  }
};
