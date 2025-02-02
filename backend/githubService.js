import axios from "axios";
import { CONFIG } from "./config.js";

/**
 * Fetches the list of files in a GitHub repository
 * @param {string} owner - GitHub username or organization
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @returns {Promise<Array>} - List of file paths
 */
export async function fetchFileList(owner, repo, branch) {
    const query = `
        query {
            repository(owner: "${owner}", name: "${repo}") {
                object(expression: "${branch}:") {
                    ... on Tree {
                        entries {
                            path
                            type
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            CONFIG.GITHUB_API_URL,
            { query },
            { headers: { Authorization: `Bearer ${CONFIG.GITHUB_TOKEN}` } }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        const tree = response.data?.data?.repository?.object;
        if (!tree || !tree.entries) {
            throw new Error("GitHub API did not return file list.");
        }

        return tree.entries.filter(entry => entry.type === "blob").map(entry => entry.path);
    } catch (error) {
        console.error("❌ GitHub API error while fetching file list:", error.message);
        throw new Error("Failed to fetch GitHub repository file list.");
    }
}

/**
 * Fetches all the code written by a specific user in a GitHub repository
 * @param {string} owner - GitHub username or organization
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} targetUser - GitHub username of the author
 * @returns {Promise<string>} - Concatenated code written by the user
 */
export async function fetchAllUserCode(owner, repo, branch, targetUser) {
    try {
        const fileList = await fetchFileList(owner, repo, branch);
        console.log(`✅ Retrieved ${fileList.length} files.`);

        if (fileList.length === 0) {
            throw new Error("No files found in the repository.");
        }

        let userCode = "";

        for (const filePath of fileList) {
            console.log(`🔍 Checking file: ${filePath}`);

            try {
                const codeFromFile = await fetchUserCode(owner, repo, branch, filePath, targetUser);

                if (codeFromFile.length > 0) {
                    userCode += `\n// File: ${filePath}\n${codeFromFile}\n`;
                }
            } catch (fileError) {
                console.error(`❌ Error processing file ${filePath}:`, fileError.message);
            }
        }

        if (!userCode) {
            throw new Error(`No code found for user: ${targetUser}`);
        }

        console.log("✅ Successfully retrieved user code!");
        return userCode;
    } catch (error) {
        console.error("🚨 Error in fetchAllUserCode:", error.message);
        throw new Error("Failed to fetch user code for all files.");
    }
}

/**
 * Fetches `git blame` data for a file and returns only the code written by a specific user
 * @param {string} owner - GitHub username or organization
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} filePath - File path within the repo
 * @param {string} targetUser - GitHub username of the author
 * @returns {Promise<string>} - Lines of code authored by the specified user
 */
async function fetchUserCode(owner, repo, branch, filePath, targetUser) {
    const query = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:${filePath}") {
            ... on Blob {
              text
              blame {
                ranges {
                  commit {
                    author {
                      name
                    }
                  }
                  startingLine
                  endingLine
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await axios.post(
            CONFIG.GITHUB_API_URL,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${CONFIG.GITHUB_TOKEN}`,
                },
            }
        );

        if (response.data.errors) {
            console.warn(`⚠️ GitHub API Warning for file ${filePath}:`, response.data.errors[0].message);
            console.warn(`🔄 Falling back to retrieving full file content.`);
            return await fetchFullFileContent(owner, repo, branch, filePath);
        }

        const fileData = response.data?.data?.repository?.object;

        if (!fileData || !fileData.blame) {
            console.warn(`⚠️ Warning: 'blame' is missing for file ${filePath}. Falling back to full file.`);
            return await fetchFullFileContent(owner, repo, branch, filePath);
        }

        const blameRanges = fileData.blame.ranges;
        const fileLines = fileData.text.split("\n");
        let userCode = [];

        blameRanges.forEach((range) => {
            if (range.commit.author.name === targetUser) {
                const start = range.startingLine - 1;
                const end = range.endingLine;
                userCode.push(...fileLines.slice(start, end));
            }
        });

        return userCode.length > 0 ? userCode.join("\n") : await fetchFullFileContent(owner, repo, branch, filePath);
    } catch (error) {
        console.error(`❌ Error fetching user code for file ${filePath}:`, error.message);
        return await fetchFullFileContent(owner, repo, branch, filePath);
    }
}
