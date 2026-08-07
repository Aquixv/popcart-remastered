import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns'

dotenv.config();

dns.setDefaultResultOrder('ipv4first'); 
mongoose.connect(process.env.URI as string, {
  family: 4,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err: Error) => {
        console.error("Database Connection Error:", err.message);
        console.log(" Checking if your IP address is whitelisted in MongoDB Atlas.");
    });

export default mongoose;