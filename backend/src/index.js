import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql.js";

dotenv.config();

const app = express();
app.use(cors());

// Initialize Apollo Server
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
    });
}

startServer();