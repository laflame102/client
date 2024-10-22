import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:5050");

const WebSocket = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    socket.on("message", ({ room, message }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: [...(prevMessages[room] || []), message],
      }));
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (newRoom && !rooms.includes(newRoom)) {
      socket.emit("joinRoom", newRoom);
      setRooms([...rooms, newRoom]);
      setNewRoom("");
    }
  };

  const leaveRoom = (room) => {
    socket.emit("leaveRoom", room);
    setRooms(rooms.filter((r) => r !== room));
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      delete updatedMessages[room];
      return updatedMessages;
    });
    if (activeRoom === room) {
      setActiveRoom(null);
    }
  };

  const sendMessage = (room) => {
    if (message && room) {
      socket.emit("chatMessage", { room, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Чат з кількома кімнатами</h1>
      <div className="join-room">
        <input
          type="text"
          placeholder="Введіть назву кімнати"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="room-input"
        />
        <button onClick={joinRoom} className="join-button">
          Приєднатися до нової кімнати
        </button>
      </div>

      <div className="rooms-container">
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room} className="room-panel">
              <button
                className={`room-button ${activeRoom === room ? "active" : ""}`}
                onClick={() => setActiveRoom(room)}
              >
                Кімната: {room}
              </button>
              <button onClick={() => leaveRoom(room)} className="leave-button">
                Вийти
              </button>
            </div>
          ))}
        </div>

        <div className="chat-content">
          {activeRoom ? (
            <div className="room-chat">
              <h2 className="room-name">Чат в кімнаті: {activeRoom}</h2>

              <div className="messages-container">
                <ul className="messages-list">
                  {(messages[activeRoom] || []).map((msg, index) => (
                    <li key={index} className="message-item">
                      {msg}
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Введіть повідомлення"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="message-input"
                />
                <button
                  onClick={() => sendMessage(activeRoom)}
                  className="send-button"
                >
                  Відправити
                </button>
              </div>
            </div>
          ) : (
            <p className="select-room-text">
              Оберіть кімнату, щоб переглянути чат
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocket;
