const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const bodyparser = require("body-parser");

const connectDB = require("./app/database/connection");

const app = express();

dotenv.config({ path: ".env" });

const PORT = process.env.PORT;

// middleware

app.use(cors());

// log requests

app.use(morgan("tiny"));

// mongoose connection

connectDB();

// parse request to body-parser

app.use(express.static("public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// load routers

app.use("/api/", require("./app/routes/router"));

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
