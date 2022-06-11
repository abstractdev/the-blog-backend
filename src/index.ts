import { createConnection } from "typeorm";
import express from "express";
import dotenv from "dotenv";
import router from "./routes";
const app = express();
dotenv.config();

const connection = (async () => {
  try {
    //connect to database
    await createConnection();
    console.log("Connected to Postgres");
    //express middleware
    app.use(express.json());
    app.use("/", router);
    //init express server
    app.listen(process.env.PORT);
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
})();
