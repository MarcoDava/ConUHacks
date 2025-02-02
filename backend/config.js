// config.js - Centralized configuration
import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 4000,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_API_URL: "https://api.github.com/graphql",
};
