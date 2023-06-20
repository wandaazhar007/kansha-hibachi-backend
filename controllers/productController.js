import path from "path";
import fs from "fs";
import Products from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Products.count({
      where: {
        [Op.or]: [{
          title: {
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
    const result = await Posts.findAll({
      attributes: ['uuid', 'name', 'slug', 'price', 'image', 'urlImage', 'desc', 'createdAt'],
      include: [
        {
          model: Category,
          attributes: ['name', 'slug']
        }
      ],
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
    res.status(200).json(
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
      }
    );
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}