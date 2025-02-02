import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Fetches all repository links for a given GitHub username
 * @param {string} username - The GitHub username
 * @returns {Promise<string[]>} - List of repository links
 */
async function getRepoLinks(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        });

        // Extract only repository links
        const repoLinks = response.data.map(repo => repo.html_url);
        return repoLinks;

    } catch (error) {
        console.error("Error fetching repository links:", error.message);
        throw new Error("Failed to fetch repository links from GitHub.");
    }
}

app.get('/repos/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const repoLinks = await getRepoLinks(username);
        res.json({ username, repositories: repoLinks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));