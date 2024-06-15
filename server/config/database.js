const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("db connection successfull"))
    .catch((err) => {
      console.log("err in db connection ", err);
      process.exit(1);
    });
};
