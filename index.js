import express from 'express';
import cors from 'cors';
import session from 'express-session';
import FileUpload from "express-fileupload";
import SequelizeStore from 'connect-session-sequelize';
import dotenv from 'dotenv';
// import UserRouter from './routes/UserRouter.js';
import UserRouter from './routes/userRouter.js'
import ProductRouter from './routes/productRouter.js';
import CategoryRouter from './routes/CategoryRoute.js'
import db from './config/db_config.js';

dotenv.config();
const PORT = process.env.PORT
const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db
});
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto'
  }
}));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

(async () => {
  console.log("database connected");
  await db.sync();
})();

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(UserRouter);
app.use(ProductRouter);
app.use(CategoryRouter);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));