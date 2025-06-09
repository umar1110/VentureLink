import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { socket } from "../../socket";

const MessagesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id;
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [deliveredMap, setDeliveredMap] = useState({});
  const [showNewChat, setShowNewChat] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    socket.emit("addUser", currentUserId);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [currentUserId]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get(
        `http://localhost:4000/api/v1/chats/${currentUserId}`,
        { withCredentials: true }
      );
      setChats(res.data.data);
    };
    fetchChats();
  }, [currentUserId]);

  const fetchMessages = async (chatId) => {
    const res = await axios.get(
      `http://localhost:4000/api/v1/messages/${chatId}`
    );
    setMessages(res.data.data);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const receiver = selectedChat.participants.find(
      (p) => p._id !== currentUserId
    );

    const messageData = {
      chatId: selectedChat._id,
      text,
    };

    const res = await axios.post(
      "http://localhost:4000/api/v1/message/send",
      messageData,
      { withCredentials: true }
    );

    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: receiver._id,
      text,
      chatId: selectedChat._id,
    });

    setMessages((prev) => [...prev, res.data.data]);
    setText("");
    socket.emit("stopTyping", {
      chatId: selectedChat._id,
      senderId: currentUserId,
      receiverId: receiver._id,
    });
  };

  const handleTyping = () => {
    const receiver = selectedChat.participants.find(
      (p) => p._id !== currentUserId
    );
    socket.emit("typing", {
      chatId: selectedChat._id,
      senderId: currentUserId,
      receiverId: receiver._id,
    });
  };

  const handleBlur = () => {
    const receiver = selectedChat.participants.find(
      (p) => p._id !== currentUserId
    );
    socket.emit("stopTyping", {
      chatId: selectedChat._id,
      senderId: currentUserId,
      receiverId: receiver._id,
    });
  };

  const handleCreateChat = async () => {
    try {
      const createRes = await axios.post(
        "http://localhost:4000/api/v1/chat/create",
        {
          email: newEmail,
        },
        { withCredentials: true }
      );
      setChats((prev) => [...prev, createRes.data.data]);
      setShowNewChat(false);
      setNewEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating chat");
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("receiveMessage", (data) => {
      if (data.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, data]);
        socket.emit("messageRead", {
          chatId: data.chatId,
          senderId: currentUserId,
          receiverId: data.senderId,
        });
      }
    });

    socket.on("typing", ({ chatId }) => {
      if (chatId === selectedChat?._id) setIsTyping(true);
    });

    socket.on("stopTyping", ({ chatId }) => {
      if (chatId === selectedChat?._id) setIsTyping(false);
    });

    socket.on("messageDelivered", (msg) => {
      setDeliveredMap((prev) => ({ ...prev, [msg._id]: msg.delivered }));
    });

    socket.on("messageRead", ({ chatId }) => {
      if (chatId === selectedChat?._id) {
        // Optional: update UI to show read status
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageDelivered");
      socket.off("messageRead");
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50 lg:col-span-3">
      <div className="w-1/3 border-r bg-white">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="text-sm text-blue-500"
          >
            + New
          </button>
        </div>

        {showNewChat && (
          <div className="p-4 border-b bg-gray-50">
            <input
              type="email"
              placeholder="Enter email to start chat"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <button
              onClick={handleCreateChat}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Start Chat
            </button>
          </div>
        )}

        <div>
          {chats.map((chat) => {
            const partner = chat.participants.find(
              (p) => p._id !== currentUserId
            );
            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedChat?._id === chat._id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={partner.profilePicture?.url}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(partner._id) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {partner.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate w-40">
                    {partner.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat && (
          <div className="flex items-center border-b px-6 py-4 bg-white">
            {(() => {
              const partner = selectedChat.participants.find(
                (p) => p._id !== currentUserId
              );
              return (
                <>
                  <div className="relative">
                    <img
                      src={partner.profilePicture?.url}
                      alt="Chat User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {onlineUsers.includes(partner._id) && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{partner.fullName}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {onlineUsers.includes(partner._id) ? "Online" : "Offline"}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex ${
                msg?.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                ref={scrollRef}
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                  msg?.sender === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs text-right opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
                {/* {msg?.sender === currentUserId && (
                  <p className="text-[10px] text-right text-white/80">
                    {deliveredMap[msg._id] ? "Delivered" : "Sending..."}
                  </p>
                )} */}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-gray-500 italic">Typing...</div>
          )}
        </div>

        {selectedChat && (
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handleTyping();
                }}
                onBlur={handleBlur}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
