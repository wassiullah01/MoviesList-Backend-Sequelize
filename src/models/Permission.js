"use strict";
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Permissions",
      timestamps: true,
      underscored: true,
    }
  );

  Permission.associate = (models) => {
    Permission.belongsToMany(models.User, {
      through: models.UserPermission,
      foreignKey: "permission_id",
      otherKey: "user_id",
      as: "users",
    });
  };

  return Permission;
};