import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.log("Please provide a valid MongoDB URI");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(mongoUri);

export default mongoose;