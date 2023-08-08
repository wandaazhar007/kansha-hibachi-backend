import Users from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}

export const registerUser = async (req, res) => {
  const { name, email, password, confPassword, role, image, urlImage } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password doesn't match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      image: image,
      urlImage: urlImage
    });
    res.status(200).json({ msg: "User has been created successfully.." })
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
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15s'
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
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