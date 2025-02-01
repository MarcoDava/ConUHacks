import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = "https://api.github.com/graphql";

/**
 * Fetches blame data for a file in a GitHub repository
 * @param {string} owner - The GitHub username or organization
 * @param {string} repo - The repository name
 * @param {string} branch - The branch name
 * @param {string} filePath - The file path within the repo
 * @returns {Promise<Object>} - Blame data
 */
async function fetchBlameData(owner, repo, branch, filePath) {
    const query = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:${filePath}") {
            ... on Blob {
              blame {
                ranges {
                  commit {
                    oid
                    message
                    author {
                      name
                      email
                      date
                    }
                  }
                  startingLine
                  endingLine
                }
              }
              text
            }
          }
        }
      }
    `;

    try {
        const response = await axios.post(
            GITHUB_API_URL,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            }
        );

        if (response.data.errors) {
            throw new Error(`GitHub API Error: ${response.data.errors[0].message}`);
        }

        return response.data.data.repository.object;
    } catch (error) {
        console.error("Error fetching blame data:", error.message);
        throw new Error("Failed to fetch blame data from GitHub.");
    }
}

/**
 * Extracts lines of code authored by a specific user
 * @param {string} owner - GitHub repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} filePath - Path to the file
 * @param {string} targetUser - Author name
 * @returns {Promise<string[]>} - Lines written by the user
 */
export async function getUserLines(owner, repo, branch, filePath, targetUser) {
    const fileData = await fetchBlameData(owner, repo, branch, filePath);

    if (!fileData || !fileData.blame || !fileData.text) {
        throw new Error("Invalid blame data received.");
    }

    const blameRanges = fileData.blame.ranges;
    const fileLines = fileData.text.split("\n");

    const userLines = [];

    blameRanges.forEach((range) => {
        if (range.commit.author.name === targetUser) {
            const start = range.startingLine - 1; // Convert to 0-based index
            const end = range.endingLine;
            userLines.push(...fileLines.slice(start, end));
        }
    });

    return userLines;
}

/**
 * Fetches full blame data for a file
 * @param {string} owner - GitHub repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Blame data and file content
 */

export async function getBlameData(owner, repo, branch, filePath) {
    return await fetchBlameData(owner, repo, branch, filePath);
}
