import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:5050");

const Telegram = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1 className="chat-title">Чат</h1>
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div key={index} className="message-item">
              {msg}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Введіть повідомлення..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-button" onClick={sendMessage}>
            Відправити
          </button>
        </div>
      </div>
    </div>
  );
};
// k

export default Telegram;
