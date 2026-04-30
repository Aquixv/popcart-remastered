const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.URI)
    .then(() => console.log("MongoDB Connected! 🚀"))
    .catch((err) => {
        console.error("Database Connection Error:", err.message);
        console.log(" Checking if your IP address is whitelisted in MongoDB Atlas.");
    });

module.exports = mongoose;