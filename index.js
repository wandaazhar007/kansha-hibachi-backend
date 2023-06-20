import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(fileUpload());
app.use(express.json());



app.listen(port, () => console.log(`Server running on port ${port}`));