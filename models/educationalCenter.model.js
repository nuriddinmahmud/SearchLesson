import { db, DataTypes } from "../config/database.js";
import sequelize from "../config/database.js";
import Region from "./region.model.js";
import Users from "./user.model.js";

const EducationCenter = db.define("EducationCenter", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  star:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  userID: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: "id",
    },
    allowNull: false,
  },

  regionID: {
    type: DataTypes.INTEGER,
    references: {
      model: Region,
      key: "id",
    },
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {timestamps: true});

export default EducationCenter;
