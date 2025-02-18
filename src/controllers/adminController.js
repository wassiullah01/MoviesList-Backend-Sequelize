const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");

const getAdminPermissions = async (req, res) => {
    try {
        const users = await sequelize.query(
            `SELECT id, email FROM users`,
            { type: QueryTypes.SELECT }
        );

        if (!users.length) {
            return res.status(404).json({
                status: "error",
                message: "No users found",
            });
        }

        const userPermissions = await sequelize.query(
            `SELECT up.user_id, u.email, p.name AS permission 
             FROM userpermissions up
             JOIN users u ON up.user_id = u.id
             JOIN permissions p ON up.permission_id = p.id`,
            { type: QueryTypes.SELECT }
        );

        const response = users.reduce((acc, user) => {
            acc[user.email] = { email: user.email, permissions: [] };
            return acc;
        }, {});

        userPermissions.forEach((record) => {
            if (record.email && record.permission) {
                response[record.email].permissions.push(record.permission);
            }
        });

        return res.status(200).json({
            status: "success",
            message: "Fetched Successfully",
            data: Object.values(response),
        });

    } catch (error) {
        console.error("Error in getAdminPermissions:", error);
        return res.status(500).json({
            status: "error",
            message: "Error while fetching permissions",
        });
    }
};

const getUserPermissions = async (req, res) => {
    try {
        const email = req.user?.email;
        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email is required",
            });
        }

        const user = await sequelize.query(
            `SELECT id FROM users WHERE email = ?`,
            { replacements: [email], type: QueryTypes.SELECT }
        );

        if (!user.length) {
            return res.status(401).json({
                status: "error",
                message: "User not found",
            });
        }

        const response = await getUserPermissionsList(email);

        return res.status(200).json({
            status: "success",
            message: "Fetched Successfully",
            data: response[0],
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error while fetching user permissions",
        });
    }
};

const updateUserPermissions = async (req, res) => {
    try {
        const { email, permissionType } = req.body;

        if (!email || !permissionType) {
            return res.status(400).json({
                status: "error",
                message: "Email or Permission Type is missing",
            });
        }

        const users = await sequelize.query(
            `SELECT id FROM users WHERE email = ?`,
            { replacements: [email], type: QueryTypes.SELECT }
        );
        if (!users.length) {
            return res.status(401).json({
                status: "error",
                message: "User not found",
            });
        }
        const userId = users[0].id;

        const permissions = await sequelize.query(
            `SELECT id FROM permissions WHERE LOWER(name) = LOWER(?)`,
            { replacements: [permissionType], type: QueryTypes.SELECT }
        );
        if (!permissions.length) {
            return res.status(401).json({
                status: "error",
                message: `Permission '${permissionType}' not found`,
            });
        }
        const permissionId = permissions[0].id;

        const userPermissions = await sequelize.query(
            `SELECT id FROM userpermissions WHERE user_id = ? AND permission_id = ?`,
            { replacements: [userId, permissionId], type: QueryTypes.SELECT }
        );

        if (!userPermissions.length) {
            await sequelize.query(
                `INSERT INTO userpermissions (user_id, permission_id, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`,
                { replacements: [userId, permissionId] }
            );
            const response = await getUserPermissionsList(email);
            return res.status(200).json({
                status: "success",
                message: "Permission saved successfully",
                data: response[0],
            });
        }

        await sequelize.query(
            `DELETE FROM userpermissions WHERE user_id = ? AND permission_id = ?`,
            { replacements: [userId, permissionId] }
        );

        const response = await getUserPermissionsList(email);
        return res.status(200).json({
            status: "success",
            message: "Permission deleted successfully",
            data: response[0],
        });

    } catch (error) {
        console.error("Error in updateUserPermissions:", error);
        return res.status(500).json({
            status: "error",
            message: "Error while updating permissions",
        });
    }
};

async function getUserPermissionsList(email) {
    const users = await sequelize.query(
        `SELECT id, email FROM users WHERE email = ?`,
        { replacements: [email], type: QueryTypes.SELECT }
    );

    if (!users.length) return [];

    const userId = users[0].id;

    const permissions = await sequelize.query(
        `SELECT p.name AS permission 
         FROM userpermissions up
         JOIN permissions p ON up.permission_id = p.id
         WHERE up.user_id = ?`,
        { replacements: [userId], type: QueryTypes.SELECT }
    );

    return [{
        email: users[0].email,
        permissions: permissions.length > 0 ? permissions.map(p => p.permission) : ["No Permissions Assigned"],
    }];
}

module.exports = { getAdminPermissions, getUserPermissions, updateUserPermissions };