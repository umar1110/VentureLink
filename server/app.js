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
