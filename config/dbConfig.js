require("dotenv").config();
const mongoose = require("mongoose");

//connect the db

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("error connecting mongodb atlas");
    process.exit(1);
  });
