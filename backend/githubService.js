import axios from "axios";
import { CONFIG } from "./config.js";

export async function fetchFileList(owner, repo, branch) {
    const query = `
        query {
            repository(owner: "${owner}", name: "${repo}") {
                object(expression: "${branch}:") {
                    ... on Tree {
                        entries { name type path }
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
        
        return response.data.data.repository.object.entries.filter(e => e.type === "blob").map(e => e.path);
    } catch (error) {
        console.error("GitHub API error:", error.message);
        throw new Error("Failed to fetch GitHub repository data");
    }
}