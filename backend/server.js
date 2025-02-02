import express from "express";
import cors from "cors";
import { createApolloServer } from "./graphql.js";
import { callChatGPT } from "./chatGPTService.js";
import { CONFIG } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

// REST API Route: ChatGPT
app.post("/chat", async (req, res) => {
    try {
        const result = await callChatGPT(req.body.prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start both Express and Apollo Server
async function startServer() {
    const apolloServer = createApolloServer();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    
    app.listen(CONFIG.PORT, () => {
        console.log(`🚀 Server running at http://localhost:${CONFIG.PORT}`);
    });
}

startServer().catch(console.error);