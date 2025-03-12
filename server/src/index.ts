import express, { Request, Response } from 'express'
import router from './routes/index.route';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import handleError from './middlewares/error.middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

//connect to database
mongoose.connect(process.env.MONGODB_KEY || "", {dbName: process.env.DBNAME})
  .then(() => console.log('Connected to database'))
  .catch((e) => {console.log(e)})

//use routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
