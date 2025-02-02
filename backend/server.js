import express from "express";
import cors from "cors";
import { createApolloServer } from "./graphql.js";
import { fetchAllUserCode } from "./githubService.js";
import { callChatGPT } from "./chatGPTService.js";
import { fetchUserRepositories } from "./githubService2.js";

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
  
      // Convert the result string into an actual JSON object
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(result);  // Parse the result string to a JSON object
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
        return res.status(500).json({ error: "Failed to parse ChatGPT response." });
      }
  
      // Return the parsed result as a proper JSON response
      res.json(jsonResponse);
    } catch (error) {
      console.error("ChatGPT API call failed:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});
  

/**
 * GET /github/repositories
 * Expects a query parameter:
 *   - username: The GitHub username whose repositories you want to fetch.
 */
app.get("/github/repositories", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ error: "GitHub username is required." });
    }
  
    try {
      // Fetch the repositories for the given GitHub username
      const repositories = await fetchUserRepositories(username);
      res.json(repositories);
    } catch (error) {
      console.error("Error fetching repositories:", error.message);
      res.status(500).json({ error: "Failed to fetch repositories.", details: error.message });
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
 * POST /process-issue
 * Expects a JSON body with:
 *   - githubIssue: a description of the GitHub issue.
 *   - usernames: an array of GitHub usernames to process.
 */
app.post("/process-issue", async (req, res) => {
    console.log("Request Body:", req.body);
    const { githubIssue, usernames, format } = req.body;

    if (!githubIssue || !Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({ error: "GitHub issue and usernames list are required." });
    }

    try {
        // Initialize an empty array to hold all the developer code
        let allDevelopersCode = [];

        // Loop through each username and process their repositories
        for (const username of usernames) {
            // Fetch repositories for the given username
            const repositories = await fetchUserRepositories(username);

            // For each repository, fetch the user's code from it
            for (const repo of repositories) {
                const { repo_name, repo_owner } = repo;
                
                // Fetch all user code from the repository
                const userCode = await fetchAllUserCode(repo_owner, repo_name, "main", username);

                // Append the user's code to the allDevelopersCode array
                allDevelopersCode.push({
                    name: username,
                    code: userCode,
                });
            }
        }

        // Prepare the body to pass to ChatGPT
        const result = await callChatGPT({ githubIssue, developers: allDevelopersCode }, format || "json");

        // Convert the result (string) to a JSON object
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(result);  // Parse the string to a JSON object
        } catch (error) {
            console.error("Error parsing JSON:", error.message);
            return res.status(500).json({ error: "Failed to parse ChatGPT response." });
        }

        // Return the parsed result as a proper JSON response
        res.json(jsonResponse);
    } catch (error) {
        console.error("Error processing issue:", error.message);
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
