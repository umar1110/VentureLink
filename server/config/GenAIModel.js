const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Initialize with API key
// 1. Initialize with API key
exports.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
