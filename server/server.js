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

const onlineUsers = new Map(); // Map<userId, socketId>

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // ✅ Add user to online list and broadcast
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online Users:", Array.from(onlineUsers.keys()));

    // Send updated online user list to all clients
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  // 🟡 Typing indicator
  socket.on("typing", ({ chatId, senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { chatId, senderId });
    }
  });

  socket.on("stopTyping", ({ chatId, senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { chatId, senderId });
    }
  });

  // 📨 Send message with delivery status
  socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    const message = {
      senderId,
      receiverId,
      text,
      chatId,
      createdAt: new Date().toISOString(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
      message.delivered = true;
    } else {
      message.delivered = false;
    }

    // Send delivery status back to sender
    socket.emit("messageDelivered", message);
  });

  // 👁️‍🗨️ Read receipt
  socket.on("messageRead", ({ chatId, senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageRead", { chatId, senderId });
    }
  });

  // ❌ Handle disconnect and update online list
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    // Notify all clients of updated online users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
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
