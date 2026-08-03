import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './connection'; // Still works perfectly
import path from 'path';
import passport from 'passport'; 
import configurePassport from './config/Passport';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import dns from "node:dns/promises";

// We'll import these once you actually write them
// import { typeDefs } from './schema/typeDefs'; 
// import { resolvers } from './schema/resolvers'; 

dns.setServers(["1.1.1.1", "8.8.8.8"]);
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
    const server = new ApolloServer({
        typeDefs: `#graphql 
          type Query { _empty: String }
        `,
        resolvers: { Query: { _empty: () => "Setup Complete" } },
    });

    await server.start();

    app.use(
        '/graphql', 
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                return { req, res }; 
            }
        })
    );

    // 3. Keep a dedicated REST route for your Cloudinary/Multer uploads!
    // import uploadRoutes from './routes/uploadRoutes';
    // app.use('/api/upload', uploadRoutes);

    app.get('/', (req, res) => res.send('API Live'));
    app.get('/health', (req, res) => res.status(200).send('Server is alive and kicking! 🚀'));
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
    });
};

startApolloServer();