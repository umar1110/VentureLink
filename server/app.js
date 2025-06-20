const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(cookieParser());
app.use(express.json({ extended: false }));
// Enable CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const { genAI } = require("./config/GenAIModel.js");
async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Test prompt");
    const response = await result.response;
    const text = response.text();
    console.log("Gemini says:", text);
  } catch (err) {
    console.error("Gemini API error:", err.message);
    if (err.message.includes("429")) {
      console.log("🛑 You have hit the rate limit. Try again later.");
    }
  }
}

// main();
// Importing routes
const userRoutes = require("./routes/User.Route");
const chatRoutes = require("./routes/Chat.Route");
const messageRoutes = require("./routes/ChatMessage.Route.js");
const ideaRoutes = require("./routes/Idea.Route.js");
app.use("/api/v1", userRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", messageRoutes);
app.use("/api/v1", ideaRoutes);

// Importing Middleware
const errorMiddleware = require("./middlewares/error.js");

app.use(errorMiddleware);
module.exports = app;
