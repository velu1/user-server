import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { service } from "../../service/app";
const config = require("../../config/auth.config");
// import bcrypt from "bcryptjs";


// User login with tenant
// exports.tenantLogin = async (req: Request, res: Response) => {
//   try {
//     let result: any = await fetchExternalTenants();
//     if (result?.status != 200) {
//       return res.status(500).send({
//         message: "No tenants found!",
//       });
//     } else {
//       let { code, email, password } = req.body;
//       let tenantInfo = result.data?.tableData.find(
//         (rec: any) => rec.code === code
//       );

//       const url = `${config.keyCloakURL}/realms/${code}/protocol/openid-connect/token`;
//       const params = new URLSearchParams();
//       params.append("grant_type", "password");
//       params.append("client_id", tenantInfo?.keycloak?.clientId);
//       params.append("client_secret", tenantInfo?.keycloak?.clientSecret);
//       params.append("username", email);
//       params.append("password", password);

//       const response = await axios.post(url, params, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });
//       // Token generation
//       const userData = jwtDecode(response.data.access_token);
//       const rawRoles = userData?.resource_access?.digitrac?.roles || [];
//       const cleanedRoles = rawRoles.map((role: any) =>
//         role.replace(/^page:/, "")
//       );

//       let token = jwt.sign(
//         {
//           id: userData.sid,
//           firstName: userData.given_name,
//           lastName: userData.family_name,
//           emailId: userData.email,
//           role: "admin",
//           phoneNumber: "",
//           orgName: "",
//           rolePermission: cleanedRoles,
//           code: code,
//         },
//         config.secret,
//         { expiresIn: "10h" } // Token expires in 10hours
//       );

//       res.status(200).send({
//         status: true,
//         message: "Login Successfully.",
//         access_token: response.data.access_token,
//         token: token,
//         tenantInfo: tenantInfo,
//       });
//     }
//   } catch (error: any) {
//     console.error("Error fetching external tenants:", error);
//     if (error?.response?.status === 401) {
//       return res.status(401).send({
//         status: false,
//         message: "Invalid Credentials.",
//         error: error.message,
//       });
//     }
//     return res.status(500).send({
//       message: "Error fetching external tenants",
//       error: error,
//       status: false,
//     });
//   }
// };
exports.tenantLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: false,
        message: "Email, password and tenant code are required",
      });
    }
        const mongoConnString = req.headers["x-tenant-mongodb-uri"];
        
        const user = await service.users.userLogin(
          req.body,
          mongoConnString
        );
        console.log("useruser", user);
        
        if (!user) {
          return res.status(401).send({
            status: false,
            message: "Invalid credentials",
          });
        }
        
        // Validate password
    //     const isPasswordValid = await bcrypt.compare(password, user.password);
    //     console.log("passwordpasswordpassword", isPasswordValid);
    //     if (!isPasswordValid) {
    //   return res.status(401).send({
    //     status: false,
    //     message: "Invalid credentials",
    //   });
    // }
    const rolePermissions = user.role.rolePermission?.map(
      (perm: any) => perm.name
    );
    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        rolePermission: rolePermissions,
        code: user.tenantCode,
      },
      config.secret,
      { expiresIn: "10h" }
    );
    user.role.rolePermission = rolePermissions;
    res.status(200).send({
      status: true,
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        rolePermission: rolePermissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({
      status: false,
      message: "Login failed",
      error,
    });
  }
};


//logout, remove token filed
exports.logout = async (_req: Request, res: Response) => {
  try {
    // const success = await service.login.logout(req.body.id);
    // if (success) {
    //   //token removed Successfully
    //   res.status(200).send({
    //     message: "Successfully.",
    //   });
    // } else {
    //   //Failed to remove token
    res.status(500).send({
      message: "Failure.",
    });
    // }
  } catch (error) {
    console.log("Error in logout:", error);
    res.status(500).send({
      message: "Failed to perform request.",
      detail: error,
    });
  }
};
