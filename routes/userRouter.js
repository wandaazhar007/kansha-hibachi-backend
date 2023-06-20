import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { getUsers, login, logout, registerUser } from "../controllers/userController.js";


const router = express.Router();

router.get('/user', verifyToken, getUsers);
router.post('/user', registerUser);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', refreshToken);

export default router;