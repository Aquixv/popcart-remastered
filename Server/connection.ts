import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch((err: Error) => {
        console.error("Database Connection Error:", err.message);
        console.log(" Checking if your IP address is whitelisted in MongoDB Atlas.");
    });

export default mongoose;