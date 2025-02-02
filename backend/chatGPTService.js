import axios from "axios";
import { CONFIG } from "./config.js"; 

export async function callChatGPT(requestBody, format = "json") {
    const { githubIssue, developers } = requestBody;

    if (!githubIssue || typeof githubIssue !== "string") {
        throw new Error("GitHub issue is required and must be a string.");
    }
    if (!Array.isArray(developers) || developers.length === 0) {
        throw new Error("Developers list is required and must be an array.");
    }

    // Construct the structured prompt
    let prompt = `GitHub Issue: ${githubIssue}\n\n`;
    developers.forEach((dev, index) => {
        prompt += `Developer: ${dev.name}\nCode from git blame:\n${dev.code}\n\n`;
    });

    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
    };

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You will receive a GitHub issue description, followed by one or more developer names, each associated with code segments extracted using 'git blame'. 
                
                Your task is to determine the best 1 to 3 developers to assign to this issue based on the relevance of their code. Respond strictly in ${format.toUpperCase()} format with the following structure:

                If JSON:
                {
                  "best1": { "name": "Developer Name", "reason": "Why they are the best fit" },
                  "best2": { "name": "Developer Name", "reason": "Why they are the second best fit" },
                  "best3": { "name": "Developer Name", "reason": "Why they are the third best fit" }
                }`
            },
            {
                role: "user",
                content: prompt
            }
        ],
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log("ChatGPT API Response:", response.data);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("ChatGPT API error:", error.response?.data || error.message);
        throw new Error("ChatGPT API call failed");
    }
}
