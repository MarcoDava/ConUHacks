import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Fetches all repository links for a given GitHub username, handling pagination.
 * @param {string} username - The GitHub username
 * @returns {Promise<string[]>} - List of repository links
 */
async function getRepoLinks(username) {
    const repoLinks = [];
    let page = 1;
    const perPage = 100; // Max allowed by GitHub API

    try {
        while (true) {
            const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
                params: { per_page: perPage, page },
                headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            });

            if (response.data.length === 0) break; // No more repos to fetch

            repoLinks.push(...response.data.map(repo => repo.html_url));
            page++;
        }

        return repoLinks;

    } catch (error) {
        console.error("Error fetching repository links:", error.response?.data?.message || error.message);
        throw new Error("Failed to fetch repository links from GitHub.");
    }
}

app.get('/repos/:username', async (req, res) => {
    const { username } = req.params;
    console.log(`Received request for username: ${username}`); // Add this line

    try {
        const repoLinks = await getRepoLinks(username);
        res.json({ username, repositories: repoLinks });
    } catch (error) {
        console.error("Error fetching repositories:", error); // Add detailed logging
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));