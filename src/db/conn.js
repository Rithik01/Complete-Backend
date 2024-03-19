// Your database is different on production, development and testing so from line below we get to know on which connection we are connecting on. Now we will be talking to database everytime so we we will create a utility function like wrapper //
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Mongodb connected !! DB_HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to database ${error}`);
    process.exit(1);
  }
};

export default connectDB;
