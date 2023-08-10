import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getUserById, getUsers, login, logout, registerUser } from "../controllers/UserController.js";


const router = express.Router();

router.get('/user', getUsers);
router.get('/user/:id', getUserById);
router.post('/user', registerUser);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', refreshToken);

export default router;