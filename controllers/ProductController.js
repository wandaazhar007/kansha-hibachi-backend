import path from "path";
import fs from "fs";
import Products from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Products.count({
      where: {
        [Op.or]: [{
          categoryId: {
            [Op.like]: '%' + search + '%'
          }
        }]
      }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Products.findAll({
      attributes: ['uuid', 'id', 'name', 'slug', 'price', 'image', 'urlImage', 'desc', 'categoryId', 'createdAt'],
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

export const getProductsPerCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 1000;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Products.count({
      where: {
        [Op.or]: [{
          categoryId: {
            [Op.like]: '%' + search + '%'
          }
        }]
      }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Products.findAll({
      attributes: ['uuid', 'id', 'name', 'slug', 'price', 'image', 'urlImage', 'desc', 'createdAt'],
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

export const getAllProducts = async (req, res) => {
  try {
    const response = await Products.findAll();
    res.status(200).json(response)
  } catch (error) {
    res.status({ msg: error.message })
  }
}

export const searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 1000;
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
      attributes: ['uuid', 'id', 'name', 'slug', 'price', 'image', 'urlImage', 'desc', 'createdAt'],
      include: [
        {
          model: Category,
          attributes: ['name', 'slug']
        }
      ],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: '%' + search + '%'
            }
          },
          {
            price: {
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

export const getProductById = async (req, res) => {
  const checkId = await Products.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkId) return res.status(404).json({ msg: "Product not found.." });

  try {
    const response = await Products.findOne({
      attributes: ['id', 'uuid', 'name', 'price', 'slug', 'urlImage', 'desc', 'createdAt'],
      include: [
        {
          model: Category,
          attributes: ['name', 'id']
        }
      ],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
    // console.log(response)
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}


export const getProductCart = async (req, res) => {
  const checkId = await Products.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkId) return res.status(404).json({ msg: "Product not found.." });

  try {
    const response = await Products.findAll({
      attributes: ['id', 'uuid', 'name', 'price', 'slug', 'urlImage', 'desc', 'createdAt'],
      include: [
        {
          model: Category,
          attributes: ['name', 'id']
        }
      ],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
    // console.log(response)
  } catch (error) {
    res.status(201).json({ msg: error.message });
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
  const random = Math.floor(Math.random() * 10000);
  const fileName = image.md5 + random + ext;
  // return console.log(fileName);
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
      // if (error) return res.status(500).json({ msg: err.message });
      // res.status(201).json({ msg: error.message });
      res.status(500).json({ msg: error.message });
      // console.log(error.message);
    }
  });
}


export const updateProduct = async (req, res) => {
  const product = await Products.findOne({
    where: {
      id: req.params.id
    }
  });
  // return console.log(product.image);
  if (!product) return res.status(404).json({ msg: "data not found" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    fileName = image.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "invalid image" });
    if (fileSize > 5000000) return res.status(422).json({ msg: " Image must be less then 5Mb" });
    const filepath = `./public/images/products/${product.image}`;
    fs.unlinkSync(filepath);
    image.mv(`./public/images/products/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const name = req.body.name;
  const slug = req.body.slug;
  const price = req.body.price;
  const desc = req.body.desc;
  const categoryId = req.body.categoryId;
  // const fileName = image.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/products/${fileName}`;

  try {
    await Products.update({
      name: name,
      slug: slug,
      price: price,
      image: fileName,
      urlImage: url,
      desc: desc,
      categoryId: categoryId
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: "Success, Product has been updated..." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


export const deleteProducts = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!product) return res.status(404).json({ msg: "Data not found.." });
    const filepath = `./public/images/products/${product.image}`;
    fs.unlinkSync(filepath);
    await Products.destroy({
      where: {
        id: product.id
      }
    });
    res.status(200).json({ msg: "Product has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}