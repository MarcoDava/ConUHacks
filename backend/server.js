import express from "express";
import cors from "cors";
import { createApolloServer } from "./graphql.js";
import { fetchAllUserCode } from "./githubService.js";
import { callChatGPT } from "./chatGPTService.js";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * POST /chat
 * Expects a JSON body with:
 *   - githubIssue: a description of the GitHub issue.
 *   - developers: an array of developers (names or objects) to consider.
 *   - format (optional): response format ("json" by default).
 */
app.post("/chat", async (req, res) => {
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

/**
 * GET /github/user-code
 * Expects query parameters:
 *   - owner: GitHub repository owner.
 *   - repo: GitHub repository name.
 *   - branch: Repository branch (e.g., "main").
 *   - targetUser: The GitHub username whose code you want to extract.
 */
app.get("/github/user-code", async (req, res) => {
  const { owner, repo, branch, targetUser } = req.query;

  if (!owner || !repo || !branch || !targetUser) {
    return res.status(400).json({ error: "Missing required parameters: owner, repo, branch, targetUser." });
  }

  try {
    const userCode = await fetchAllUserCode(owner, repo, branch, targetUser);
    res.json({ code: userCode });
  } catch (error) {
    console.error("Error fetching user code:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

/**
 * Start the Express server and integrate the Apollo GraphQL server.
 */
async function startServer() {
  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server running at http://localhost:4000`);
    console.log(`🚀 GraphQL endpoint at http://localhost:4000${apolloServer.graphqlPath}`);
  });
}

startServer().catch(console.error);
