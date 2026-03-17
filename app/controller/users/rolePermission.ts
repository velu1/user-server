import { Request, Response } from "express";
import axios from "axios";
const config = require("../../config/auth.config");

exports.updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const code = req.headers["x-tenant-code"];
    const token = req.headers["x-access-token"];
    const clientIdHeader = req.headers["x-keycloak-clientid"];

    // Get clientId
    const clientIdURL = `${config.keyCloakURL}/admin/realms/${code}/clients?clientId=${clientIdHeader}`;
    const clientIdResult = await axios.get(clientIdURL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!clientIdResult.data || clientIdResult.data.length === 0) {
      return res.status(500).send({
        message: "Error in fetching client details",
      });
    }
    const clientUUID = clientIdResult.data[0].id;
    // Get all roles for this client
    const rolesURL = `${config.keyCloakURL}/admin/realms/${code}/clients/${clientUUID}/roles`;
    const allRolesResult = await axios.get(rolesURL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (allRolesResult?.status !== 200) {
      return res.status(500).send({
        message: "Error in tenant fetching roles",
      });
    }

    const allRoles = allRolesResult.data;

    // Step 1: Fetch existing role mappings for the group
    const getMappingsURL = `${config.keyCloakURL}/admin/realms/${code}/groups/${req.body.id}/role-mappings/clients/${clientUUID}`;
    const existingMappingsResult = await axios.get(getMappingsURL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const existingMappings = existingMappingsResult.data;

    // Step 2: Delete all existing role mappings for this group if any exist
    if (existingMappings.length > 0) {
      const deleteMappingURL = `${config.keyCloakURL}/admin/realms/${code}/groups/${req.body.id}/role-mappings/clients/${clientUUID}`;
      await axios.delete(deleteMappingURL, {
        headers: { Authorization: `Bearer ${token}` },
        data: existingMappings, // keycloak requires sending roles array in delete request
      });
    }

    // Step 3: Prepare new role mappings from your input
    const rolePermission = req.body.rolePermission;
    const normalize = (id: any) => id.replace(/-/g, "");

    const reqData = allRoles
      .filter((role: any) => rolePermission.includes(normalize(role.id)))
      .map((role: any) => ({ id: role.id, name: role.name }));

    // Step 4: Assign new role mappings
    const assignUrl = `${config.keyCloakURL}/admin/realms/${code}/groups/${req.body.id}/role-mappings/clients/${clientUUID}`;
    const updatedRolesRes = await axios.post(assignUrl, reqData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (updatedRolesRes.status >= 200 && updatedRolesRes.status < 300) {
      return res.status(200).send({
        data: updatedRolesRes.data,
        message: "Role permissions successfully updated",
      });
    } else {
      return res.status(500).send({
        message: "Error while updating role permissions",
        detail: updatedRolesRes.data,
      });
    }
  } catch (error: any) {
    console.log("Error in updateRolePermissions:", error);

    return res.status(500).send({
      message: "Failed to perform request.",
      detail: error.response?.data || error.message || error,
    });
  }
};
