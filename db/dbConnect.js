// external imports
const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      // these are options to ensure that the connection is done properly
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.log(error);
    });
};

module.exports = dbConnect;
 