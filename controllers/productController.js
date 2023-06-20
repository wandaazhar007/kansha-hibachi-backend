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
    const result = await Products.findAll({
      attributes: ['uuid', 'name', 'slug', 'price', 'image', 'urlImage', 'desc', 'createdAt'],
      include: [
        {
          model: Category,
          attributes: ['name', 'slug']
        }
      ],
      where: {
        [Op.or]: [
          {
            categoryId: {
              [Op.like]: '%' + search + '%'
            }
          }
        ]
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

export const createProduct = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No Image Uploaded" });
  const name = req.body.name;
  const slug = req.body.slug;
  const price = req.body.price;
  const image = req.files.image;
  const desc = req.body.desc;
  const categoryId = req.body.categoryId;
  const fileSize = image.data.length;
  const ext = path.extname(image.name);
  const fileName = image.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

  image.mv(`./public/images/products/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Products.create({
        name: name,
        slug: slug,
        price: price,
        image: fileName,
        urlImage: url,
        desc: desc,
        categoryId: categoryId
      });
      res.status(200).json({ msg: "Products has been saved" });
    } catch (error) {
      console.log(error.message);
    }
  })
}