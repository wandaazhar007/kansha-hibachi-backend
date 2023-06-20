import { Sequelize } from "sequelize";
import db from '../config/db_config.js';
// import Posts from './PostModel.js';

const { DataTypes } = Sequelize;

const Category = db.define('categories', {
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
    }
  }
}, {
  freezeTableName: true
});

// Category.hasMany(Posts);
// Posts.belongsTo(Category, {foreignKey: 'categoryId'});

export default Category;