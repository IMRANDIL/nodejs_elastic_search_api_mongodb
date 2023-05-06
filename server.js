require("dotenv").config();
require("./config/dbConfig");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 9012;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

// Handle errors for app.listen()
server.on("error", (err) => {
  console.error(`Error starting server: ${err.message}`);
});
