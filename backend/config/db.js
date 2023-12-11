import mongoose from "mongoose";

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to mongoDB with host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connection to mongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connection;
