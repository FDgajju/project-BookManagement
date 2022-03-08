const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const app = require("./index");

// dotenv.config({ path: `${__dirname}/../config.env` });

//mongodb connection
const DB = process.env.DATABASE || "mongodb://localhost:27017/bookManagement";
mongoose
  .connect(DB)
  .then(() => console.log("mongodb running on 27017"))
  .catch((err) => console.log(err));

//express connection
const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`Express app running on port ${port}...`);
  console.log(new Date())
});
