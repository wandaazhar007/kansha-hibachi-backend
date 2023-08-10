import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";

export const getCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await Category.count({
    where: {
      [Op.or]: [{
        name: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        slug: {
          [Op.like]: '%' + search + '%'
        }
      }]
    }
  });
  const totalPage = Math.ceil(totalRows / limit);

  const result = await Category.findAll({
    attributes: ['id', 'uuid', 'name', 'slug', 'createdAt'],
    where: {
      [Op.or]: [{
        name: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        slug: {
          [Op.like]: '%' + search + '%'
        }
      }]
    },
    offset: offset,
    limit: limit,
    order: [
      ['id', 'DESC']
    ]
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage
  });
}

export const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      attributes: ['id', 'uuid', 'name', 'slug'],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}

export const createCategory = async (req, res) => {
  const { name, slug } = req.body;
  const checkSlug = await Category.findOne({
    where: {
      slug: slug
    }
  });
  if (checkSlug) return res.status(500).json({ msg: "Slug already exist.." });

  try {
    await Category.create({
      name: name,
      slug: slug
    });
    res.status(200).json({ msg: "Category has been created successfully" });
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}

export const updateCategory = async (req, res) => {
  const { name, slug } = req.body;
  const checkSlug = await Category.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkSlug) return res.status(500).json({ msg: "Category not found.." });

  try {
    await Category.update({
      name: name,
      slug: slug
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: "Category has been updated.." });
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}

export const deleteCategory = async (req, res) => {
  // const { name, slug } = req.body;
  const checkSlug = await Category.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkSlug) return res.status(404).json({ msg: "Category not found.." });

  try {
    await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: "Category has been deleted successfully.." });
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}