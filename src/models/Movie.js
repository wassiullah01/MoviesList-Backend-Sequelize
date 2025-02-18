"use strict";
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    "Movie",
    {
      imgURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publishYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Movies",
      timestamps: true,
      underscored: true,
    }
  );
  return Movie;
};