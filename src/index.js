// require("dotenv").config();
/// Keep note that when you will be using any middleware then you will use app.use() like if u are using the cors middleware then you will do app.use(cors())

import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/conn.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(`Error ${error}`);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
