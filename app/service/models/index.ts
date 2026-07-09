import { connectDBs } from "./dbConnection";

export const initDB = async (mongodbURI: string) => {
  return connectDBs(mongodbURI).then(async (connection) => {
    const db = {
      companyProfile: require("./users/companyProfile")(connection),
      printerConfigs: require("./settings/printerConfigurations")(connection),
      users: require("./users/user")(connection),
      roles: require("./users/role")(connection),
      dashboardcard: require("./users/dashboardCard")(connection),
    };
    await seed(db);
    await patchMissingCards(db);

    return db;
  });
};

export const seed = async (db: any) => {
  try {
      let settingsInfo = await db.printerConfigs.findOne().select("dataSeed");
      if (settingsInfo && settingsInfo.dataSeed) {
          return { status: "exists", message: "Data seed already exists!" };
        }
        console.log("hello seed");
    const dashboardCardData: any = [
      {
        name: "administration",
        description: "Admin only access",
        default: true,
      },
      {
        name: "inward-system",
        description: "Only access to Incoming related pages",
        default: true,
      },
      {
        name: "reports",
        description: "Access reports",
        default: true,
      },
      {
        name: "settings",
        description: "Access settings",
        default: true,
      },
      {
        name: "template",
        description: "Access template",
        default: true,
      },
      {
        name: "traceability",
        description: "Access traceability module",
        default: true,
      },
      {
        name: "audit-traceability",
        description: "Access audit traceability module",
        default: true,
      },
    ];

    const dashboardCards = await db.dashboardcard.insertMany(dashboardCardData);

    const role = [
      {
        name: "Super Admin",
        description: "Super Admin role",
        rolePermission: [
          dashboardCards[0].id,
          dashboardCards[1].id,
          dashboardCards[2].id,
          dashboardCards[3].id,
          dashboardCards[4].id,
          dashboardCards[5].id,
          dashboardCards[6].id,
        ],
        defaultRole: true,
      },
      {
        name: "Admin",
        description: "Admin role",
        rolePermission: [
          dashboardCards[0].id,
          dashboardCards[1].id,
          dashboardCards[2].id,
          dashboardCards[3].id,
          dashboardCards[4].id,
          dashboardCards[5].id,
          dashboardCards[6].id,
        ],
        defaultRole: true,
        isDeleted: false
      },

      {
        name: "Production",
        description: "Production role",
        rolePermission: [],
        defaultRole: true,
        isDeleted: false
      },
      {
        name: "PCB",
        description: "PCB role",
        rolePermission: [],
        defaultRole: true,
        isDeleted: false
      },
    ];

    const roles = await db.roles.insertMany(role);

    const usersData = [
      {
        firstName: "Super",
        lastName: "Admin",
        phoneNumber: "1234567891",
        email: "superAdmin@gmail.com",
         password: 123456,
        defaultUser: true,
        role: roles[0].id,
        isSuperAdmin: true,
        isDeleted: false,
        ipConfig: {
          type: 1,
          ip: "All",
        },
      },
      {
        firstName: "Admin",
        lastName: "A",
        phoneNumber: "1234567890",
        email: "admin@gmail.com",
        role: roles[1].id,
         password: 123456,
        defaultUser: true,
        isSuperAdmin: false,
        isDeleted: false,
        ipConfig: {
          type: 1,
          ip: "All",
        },
      },
      {
        firstName: "Production",
        lastName: "P",
        phoneNumber: "1234567891",
        email: "production@gmail.com",
        role: roles[2].id,
        password: 123456,
        isSuperAdmin: false,
        defaultUser: true,
        isDeleted: false,
        ipConfig: {
          type: 1,
          ip: "All",
        },
      },
      {
        firstName: "PCB",
        lastName: "P",
        phoneNumber: "1234567892",
        email: "PCB@gmail.com",
        role: roles[3].id,
         password: 123456,
        isSuperAdmin: false,
        defaultUser: true,
        isDeleted: false,
        ipConfig: {
          type: 1,
          ip: "All",
        },
      },
    ];

    await db.users.insertMany(usersData);
    await db.printerConfigs.create({ dataSeed: true });

    return { status: "success", message: "Data-Seed-Successful" };
  } catch (error) {
    console.log("errrrrrrrrrrrrrrrrrrrrrr", error);
    return { status: false, message: "Data-Seed-Error" };
  }
};

// Runs every startup — adds missing dashboard cards and grants them to
// Super Admin / Admin roles so already-seeded databases stay up to date.
export const patchMissingCards = async (db: any) => {
  try {
    const required = [
      { name: "traceability", description: "Access traceability module" },
      { name: "audit-traceability", description: "Access audit traceability module" },
    ];

    for (const card of required) {
      let existing = await db.dashboardcard.findOne({ name: card.name });
      if (!existing) {
        existing = await db.dashboardcard.create({ name: card.name, description: card.description, default: true });
        console.log(`Patched missing dashboard card: ${card.name}`);
      }
      // Grant to all default admin-level roles
      await db.roles.updateMany(
        { name: { $in: ["Super Admin", "Admin"] }, rolePermission: { $ne: existing.id } },
        { $addToSet: { rolePermission: existing.id } }
      );
    }
  } catch (error) {
    console.log("patchMissingCards error:", error);
  }
};