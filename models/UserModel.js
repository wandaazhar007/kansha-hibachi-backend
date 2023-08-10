import { Sequelize } from "sequelize";
import db from "../config/db_config.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 30]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 30]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING
  },
  urlImage: {
    type: DataTypes.STRING
  },
  refreshToken: {
    type: DataTypes.TEXT
  },
}, {
  freezeTableName: true
});

export default Users;