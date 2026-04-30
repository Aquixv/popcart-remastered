const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); 
require('./connection');
const path = require('path');
const productRoutes = require('./routes/Productroutes');
const passport = require('passport'); 

const PORT = process.env.port || 1500; 
const authRoutes = require('./routes/routes');
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://popcart-seven.vercel.app"],
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



require('./config/Passport')(passport); 
app.use(passport.initialize());

app.use('/api/users/auth', authRoutes);
app.use('/api/products', productRoutes);
app.get('/', (req, res) => {
    res.send('API Live');
});
app.get('/health', (req, res) => {
    res.status(200).send('Server is alive and kicking! 🚀');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
