const dotenv = require("dotenv");
dotenv.config({ path: "server/config.env" });

const { Server } = require("socket.io");
const http = require("http");
const cloudinary = require("cloudinary").v2;
const app = require("./app");
const connectDatabase = require("./config/dbConnect");

connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (userId) => {
    console.log("User joined To Room", userId);

    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
// Handling SIGTERM signal
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down the server");
  server.close(() => {
    console.log("Process terminated");
  });
});
