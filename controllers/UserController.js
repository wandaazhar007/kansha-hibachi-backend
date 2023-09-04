import path from "path";
import fs from "fs";
import Users from "../models/UserModel.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await Users.count({
    where: {
      [Op.or]: [{
        name: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        email: {
          [Op.like]: '%' + search + '%'
        }
      }]
    }
  });
  const totalPage = Math.ceil(totalRows / limit);

  const result = await Users.findAll({
    attributes: ['id', 'uuid', 'name', 'email', 'createdAt', 'role', 'image', 'urlImage'],
    where: {
      [Op.or]: [{
        name: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        email: {
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

export const registerUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  const image = req.files.image;
  const fileSize = image.data.length;
  const ext = path.extname(image.name);
  const random = Math.floor(Math.random() * 10000);
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const fileName = image.md5 + random + ext;
  // return console.log(fileName);
  const url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

  if (password !== confPassword) return res.status(400).json({ msg: "Password doesn't match" });

  image.mv(`./public/images/users/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Users.create({
        name: name,
        email: email,
        password: hashPassword,
        role: role,
        image: fileName,
        urlImage: url
      });
      res.status(200).json({ msg: "User has been created successfully.." })
    } catch (error) {
      res.status(500).json({ msg: error.message });
      console.log(error.message);
    }
  }
  )
}

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!user) return res.status(404).json({ msg: "data not found" });
  let fileName = "";
  if (req.files === null) {
    fileName = user.image;
  } else {
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    const random = Math.floor(Math.random() * 10000);
    fileName = image.md5 + random + ext;
    // fileName = image.md5 + ext;
    // return console.log(fileName)
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "invalid image" });
    if (fileSize > 5000000) return res.status(422).json({ msg: " Image must be less then 5Mb" });
    const filepath = `./public/images/users/${user.image}`;
    fs.unlinkSync(filepath);
    image.mv(`./public/images/users/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  // return console.log('fileName', fileName);

  const name = req.body.name;
  // const password = req.body.password;
  // const { name, email, password, confPassword, role } = req.body;
  // console.log(password)
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);
  const email = req.body.email;
  const role = req.body.role;
  const url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;

  try {
    await Users.update({
      name: name,
      email: email,
      role: role,
      image: fileName,
      urlImage: url
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: "Success, User has been updated.." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

}

export const getUserById = async (req, res) => {
  const checkId = await Users.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkId) return res.status(404).json({ msg: "User not found.." });

  try {
    const response = await Users.findOne({
      attributes: ['id', 'uuid', 'name', 'email', 'role', 'urlImage', 'createdAt'],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}


export const deleteUserById = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!user) return res.status(404).json({ msg: "user not found" });
    const filepath = `public/images/users/${user.image}`;
    fs.unlinkSync(filepath);
    await Users.destroy({
      where: {
        id: user.id
      }
    });
    res.status(200).json({ msg: "User has been deleted successfully.." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email
      }
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const urlImage = user[0].urlImage;
    // console.log(role);
    const role = user[0].role;
    const accessToken = jwt.sign({ userId, name, email, role, urlImage }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15s'
    });
    const refreshToken = jwt.sign({ userId, name, email, role, urlImage }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });
    await Users.update({ refreshToken: refreshToken }, {
      where: {
        id: userId
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // for upload to hosting need set secure: true
      // secure: true
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
}

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // return console.log(refreshToken)
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refreshToken: refreshToken
    }
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({ refreshToken: null }, {
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}