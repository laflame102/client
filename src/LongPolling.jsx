import React, { useEffect, useState } from "react";
import axios from "axios";

const LongPolling = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    try {
      const { data } = await axios.get("http://localhost:5050/get-messages");
      setMessages((prev) => [data, ...prev]);

      await subscribe();
    } catch (error) {
      setTimeout(() => {
        subscribe();
      }, 5000);
    }
  };

  const sendMessage = async () => {
    await axios.post("http://localhost:5050/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          width="370"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={sendMessage}>send</button>
      </div>
      <div>
        {messages.map((mess) => {
          return <div key={mess.id}>{mess.message}</div>;
        })}
      </div>
    </div>
  );
};

export default LongPolling;
