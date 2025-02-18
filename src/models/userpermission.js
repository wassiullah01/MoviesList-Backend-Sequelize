"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define(
    "UserPermission",
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      permission_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Permissions",
          key: "id",
        },
      },
    },
    {
      tableName: "User_Permissions",
      timestamps: true,
      underscored: true,
    }
  );

  UserPermission.associate = (models) => {
    UserPermission.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    UserPermission.belongsTo(models.Permission, { foreignKey: "permission_id", as: "permission" });
  };

  return UserPermission;
};