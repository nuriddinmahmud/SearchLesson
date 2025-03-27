const { db, DataTypes } = require("../config/database");
const ResourceCategory = require("./resourceCategory.model");
const User = require("./user.model");

const Resource = db.define(
  "Resource",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ResourceCategory,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  { timestamps: false }
);

Resource.belongsTo(ResourceCategory, { foreignKey: "categoryID", onDelete: "CASCADE", onUpdate: "CASCADE" });
ResourceCategory.hasMany(Resource, { foreignKey: "categoryID", onDelete: "CASCADE", onUpdate: "CASCADE" });

Resource.belongsTo(User, { foreignKey: "userID", onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Resource, { foreignKey: "userID", onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = Resource;
