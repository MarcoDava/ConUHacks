import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_REST_API_URL = 'https://api.github.com/repos';

/**
 * Fetches the list of files in a GitHub repository
 * @param {string} owner - The GitHub username or organization
 * @param {string} repo - The repository name
 * @param {string} branch - The branch name
 * @returns {Promise<Array>} - List of file paths in the repository
 */
async function fetchFileList(owner, repo, branch) {
    const query = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:") {
            ... on Tree {
              entries {
                name
                type
                path
              }
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
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Make sure GITHUB_TOKEN is correctly set
                },
            }
        );

        // Log the entire response to see if there's any additional info
        console.log("GitHub API Response:", response.data);

        if (response.data.errors) {
            // If the error is related to the branch being invalid or missing, skip this repo
            if (response.data.errors[0].message.includes("not found") || response.data.errors[0].message.includes("Invalid reference")) {
                console.warn(`Skipping repository ${owner}/${repo} because branch "${branch}" is invalid or missing.`);
                return [];  // Skip this repository
            }
            throw new Error(`GitHub API Error: ${response.data.errors[0].message}`);
        }

        const repository = response.data.data.repository;
        if (!repository || !repository.object) {
            console.warn(`Repository ${owner}/${repo} not found or no file tree data available. Skipping.`);
            return [];  // Skip this repository if file tree is not available
        }

        const files = repository.object.entries?.filter(entry => entry.type === "blob") || [];

        // If no files are found, log that and return an empty array
        if (files.length === 0) {
            console.warn(`No files found in repository ${owner}/${repo} on branch ${branch}. Skipping.`);
        }

        return files.map(file => file.path);
    } catch (error) {
        console.error("Error fetching file list:", error.message);
        return [];  // Return empty array if error occurs
    }
}



/**
 * Fetches the code authored by a specific user for a file using GraphQL API (with fallback to REST API)
 * @param {string} owner - The GitHub username or organization
 * @param {string} repo - The repository name
 * @param {string} branch - The branch name
 * @param {string} filePath - The file path within the repo
 * @param {string} targetUser - The GitHub username of the user whose code we want to fetch
 * @returns {Promise<string[]>} - Lines of code authored by the specified user
 */
async function fetchUserCode(owner, repo, branch, filePath, targetUser) {
    const query = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:${filePath}") {
            ... on Blob {
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
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                },
            }
        );

        if (response.data.errors) {
            throw new Error(`GitHub API Error: ${response.data.errors[0].message}`);
        }

        const fileData = response.data.data.repository.object;
        if (fileData && fileData.text) {
            return fileData.text.split("\n");
        }

        // If no blame data is available, fallback to REST API for blame info
        console.warn(`No blame found for file ${filePath}, fetching full code...`);

        const restResponse = await axios.get(
            `${GITHUB_REST_API_URL}/${owner}/${repo}/commits?path=${filePath}&sha=${branch}`,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                },
            }
        );

        // Get the full file content from the REST API
        const fileContent = await axios.get(
            `${GITHUB_REST_API_URL}/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                },
            }
        );

        // If successful, return all lines of the file
        return Buffer.from(fileContent.data.content, 'base64').toString('utf8').split("\n");
    } catch (error) {
        console.error("Error fetching user code:", error.message);
        return [];  // Return empty array if error occurs
    }
}

/**
 * Fetches all user code for all files in a GitHub repository
 * @param {string} owner - The GitHub username or organization
 * @param {string} repo - The repository name
 * @param {string} branch - The branch name
 * @param {string} targetUser - The GitHub username of the user whose code we want to fetch
 * @returns {Promise<Object>} - A map of file paths to lines of code authored by the target user
 */
async function fetchAllUserCode(owner, repo, branch, targetUser) {
    try {
        const fileList = await fetchFileList(owner, repo, branch);
        const userCode = {};

        // Fetch the user code for each file
        for (const filePath of fileList) {
            try {
                const userCodeForFile = await fetchUserCode(owner, repo, branch, filePath, targetUser);

                // If no code was returned from blame, fallback to full file code
                if (userCodeForFile.length === 0) {
                    console.warn(`No code found for user ${targetUser} in file ${filePath}, returning full code.`);
                    userCodeForFile.push(...(await fetchUserCode(owner, repo, branch, filePath, '')));
                }

                if (userCodeForFile.length > 0) {
                    userCode[filePath] = userCodeForFile;
                }
            } catch (fileError) {
                console.error(`Error fetching code for file ${filePath}:`, fileError.message);
            }
        }

        return userCode;
    } catch (error) {
        console.error("Error fetching user code for all files:", error.message);
        throw new Error("Failed to fetch user code for all files.");
    }
}

export { fetchAllUserCode, fetchUserCode, fetchFileList };
