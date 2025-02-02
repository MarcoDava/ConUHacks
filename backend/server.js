//import express from "express";
//import cors from "cors";
//import { createApolloServer } from "./graphql.js";
//import { callChatGPT } from "./chatGPTService.js";
//import { CONFIG } from "./config.js";
//
//const app = express();
//app.use(cors());
//app.use(express.json());
//
//
//app.post("/chat", async (req, res) => {
//    const { prompt, format } = req.body;
//
//    if (!prompt) {
//        return res.status(400).json({ error: "Prompt is required" });
//    }
//
//    try {
//        const result = await callChatGPT(prompt, format || "json");
//        res.json({ result });
//    } catch (error) {
//        res.status(500).json({ error: error.message });
//    }
//});
//
//// Start both Express and Apollo Server
//async function startServer() {
//    const apolloServer = createApolloServer();
//    await apolloServer.start();
//    apolloServer.applyMiddleware({ app });
//    
//    app.listen(CONFIG.PORT, () => {
//        console.log(`🚀 Server running at http://localhost:${CONFIG.PORT}`);
//    });
//}
//
//startServer().catch(console.error);

import express from "express";
import cors from "cors";
import { createApolloServer } from "./graphql.js";
import { callChatGPT } from "./chatGPTService.js";
import { CONFIG } from "./config.js";
import { fetchAllUserCode } from "./githubService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    console.log("Received request body:", req.body); 

    const { githubIssue, developers, format } = req.body;

    if (!githubIssue || !Array.isArray(developers)) {
        return res.status(400).json({ error: "GitHub issue and developer list are required." });
    }

    try {
        const result = await callChatGPT({ githubIssue, developers }, format || "json");
        res.json({ result });
    } catch (error) {
        console.error("ChatGPT API call failed:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/github/user-code", async (req, res) => {
    const { owner, repo, branch, targetUser } = req.query;

    if (!owner || !repo || !branch || !targetUser) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    try {
        const userCode = await fetchAllUserCode(owner, repo, branch, targetUser);
        res.json({ code: userCode });
    } catch (error) {
        console.error("Error fetching user code:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
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
