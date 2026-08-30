import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
// import './connection'; 
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import dns from "node:dns";
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { setServers } from 'node:dns';
import {upload, cloudinary } from './cloudinary';
import mongoose from 'mongoose';
import User from './models/Schema';
import * as jwt from 'jsonwebtoken'
import Userrouter from './routes/routes';
import Productrouter from './routes/Productroutes';
import configurePassport from './config/Passport';
import authRoutes from './routes/routes'
import { PassportStatic } from 'passport';

import passport from 'passport'
import sendEmail from './util/email';


setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first'); 
mongoose.connect(process.env.URI as string, {
  family: 4,
})

.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('MongoDB connection error:', err));
const app = express();
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
app.use('/api', authRoutes);
app.use('/api/users/auth', Userrouter);

const startApolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(
        '/graphql', 
        expressMiddleware(server, {
            context: async ({ req }) => {
                let user = null;

                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    try {
                        const token = authHeader.split(' ')[1];
                        const decoded = jwt.verify(token, process.env.API_SECRET as string) as any;
                        user = await User.findById(decoded.id || decoded._id).select('-password');
                    } catch (error) {
                        console.error("Invalid token:", error);
                    }
                }
                return { user }; 
            }
        })
    );
app.use('/api/products', Productrouter);
app.use('/api/email', sendEmail);
    app.post('/users/auth/profile/upload', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ecommerce_avatars',
      resource_type: 'auto',
    });

    res.json({ avatarUrl: result.secure_url });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
});

    app.get('/', (req, res) => res.send('API Live'));
    app.get('/health', (req, res) => res.status(200).send('Server is alive and kicking! 🚀'));
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
    });
};

startApolloServer();