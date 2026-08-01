import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './connection';
import path from 'path';
import passport from 'passport'; 
import configurePassport from './config/Passport';

// 1. --- NEW APOLLO IMPORTS ---
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
// import { typeDefs } from './schema/typeDefs'; // create these next
// import { resolvers } from './schema/resolvers'; //  create these next

dotenv.config();
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

const startApolloServer = async () => {
    
    // 2. Initialize Apollo (Commented out until we make the schema files)
    /*
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // 3. Mount Apollo to Express
    app.use(
        '/graphql', 
        expressMiddleware(server, {
            context: async ({ req }) => {
                // This is where we will hook up your Passport/JWT logic later!
                return { req }; 
            }
        })
    );
    */

    // OLD ROUTES
    // import productRoutes from './routes/Productroutes';
    // import authRoutes from './routes/routes'
    // app.use('/api/users/auth', authRoutes);
    // app.use('/api/products', productRoutes);

    app.get('/', (req, res) => {
        res.send('API Live');
    });
    app.get('/health', (req, res) => {
        res.status(200).send('Server is alive and kicking! 🚀');
    });
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
};

startApolloServer();