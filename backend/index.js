const axios = require("axios");
const dotenv = require("dotenv");
const readline = require("readline");

// Load environment variables from .env file
dotenv.config();

// OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

// Function to call the ChatGPT API
async function callChatGPT(prompt) {
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
    };

    try {
        const response = await axios.post(url, data, { headers });
        const result = response.data.choices[0].message.content;
        return result;
    } catch (error) {
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

// Create an interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Prompt the user for input
rl.question("Enter your input: ", async (prompt) => {
    try {
        const response = await callChatGPT(prompt);
        console.log("ChatGPT response:", response);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        rl.close();
    }
});