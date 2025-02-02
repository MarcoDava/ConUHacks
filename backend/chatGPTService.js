// chatGPTService.js - ChatGPT API integration
import axios from "axios";
import { CONFIG } from "./config.js";

export async function callChatGPT(prompt) {
    if (!prompt) {
        throw new Error("Prompt is required");
    }
    
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
    };

    const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("ChatGPT API error:", error.response?.data || error.message);
        throw new Error("ChatGPT API call failed");
    }
}