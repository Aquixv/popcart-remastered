import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import './connection'; 
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import dns from "node:dns";
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import mongoose from 'mongoose';
import User from './models/Schema';
import * as jwt from 'jsonwebtoken'

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

    // app.use('/api/upload', cloudinary);
    app.get('/', (req, res) => res.send('API Live'));
    app.get('/health', (req, res) => res.status(200).send('Server is alive and kicking! 🚀'));
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
    });
};

startApolloServer();