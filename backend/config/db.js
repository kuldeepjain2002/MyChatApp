const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.Mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`connection done: ${conn.connection.host}`);
  } catch (error) {
    console.log("oops");
    console.log(`error : ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
