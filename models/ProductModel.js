import { Sequelize } from "sequelize";
import db from '../config/db_config.js';
import Category from "./CategoryModel.js";

const { DataTypes } = Sequelize;

const Products = db.define('products', {
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
      len: [3, 100]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    },
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  urlImage: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  freezeTableName: true
});

Category.hasMany(Products);
Products.belongsTo(Category, { foreignKey: 'categoryId' });

export default Products;