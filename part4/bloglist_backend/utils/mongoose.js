import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/config.js";

mongoose.connect(MONGODB_URI);

export default mongoose;
