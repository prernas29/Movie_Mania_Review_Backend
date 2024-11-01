const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
var cors = require('cors');
const corsOrigin = {
  origin: true, // Allows all origins
  credentials: true,            
  optionSuccessStatus: 200
};

app.use(cors(corsOrigin));

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require("./userRoutes/userRoute");

app.use("/api/v1", user);

// app.use(express.static(path.join(__dirname, "../imdb/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../imdb/build/index.html"));
// });

module.exports = app;
