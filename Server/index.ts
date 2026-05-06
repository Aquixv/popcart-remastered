import express from 'express'
const app = express();
import cors from 'cors'
import dotenv from 'dotenv'
import './connection'
import path from 'path';
import productRoutes from './routes/Productroutes';
import authRoutes from './routes/routes'
import passport from 'passport'; 
import configurePassport from './config/Passport';

const PORT = process.env.port || 1500; 

app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL as string, ""],
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



configurePassport(passport);
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
