import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GITHUB_API_URL = "https://api.github.com/users";

/**
 * Fetches the list of repositories for a GitHub user, skipping empty repositories
 * @param {string} username - The GitHub username
 * @returns {Promise<Object[]>} - A list of repositories with repo_name and repo_owner attributes
 */
async function fetchUserRepositories(username) {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/${username}/repos`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Optional if using a token for authentication
                "Content-Type": "application/json",
            },
        });

        // Filter out repositories that are empty by checking their size
        const repositories = response.data.filter((repo) => repo.size > 0).map((repo) => ({
            repo_name: repo.name,
            repo_owner: repo.owner.login, // repo.owner.login is the owner's GitHub username
        }));

        return repositories;
    } catch (error) {
        console.error("Error fetching repositories:", error.message);
        throw new Error("Failed to fetch repositories.");
    }
}

export { fetchUserRepositories };
