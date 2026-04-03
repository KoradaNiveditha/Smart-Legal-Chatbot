import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ Backend URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "User", text: message };

    setChat((prev) => [...prev, userMessage]);
    setHistory((prev) => [...prev, message]);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message,
      });

      const botMessage = { sender: "Bot", text: res.data.reply };

      setChat((prev) => [
        ...prev,
        { sender: "Spacer" },
        botMessage,
        { sender: "Spacer" },
      ]);

      setMessage("");

    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Server not responding. Try again." },
      ]);
    }
  };

  const clearChat = () => {
    setChat([]);
    setHistory([]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="app-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>⚖ Smart Legal Chatbot</h2>

        <button className="clear-btn" onClick={clearChat}>
          Clear History
        </button>

        <div className="history">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">

        {chat.length === 0 ? (
          <div className="center-screen">
            <h1>Welcome 👋</h1>
            <p>Ask anything related to Indian law.</p>

            <div className="center-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <>
            <div className="chat-box">
              {chat.map((msg, index) => {
                if (msg.sender === "Spacer") {
                  return <div key={index} style={{ height: "15px" }} />;
                }

                return (
                  <div
                    key={index}
                    className={
                      msg.sender === "User"
                        ? "user-message"
                        : "bot-message"
                    }
                  >
                    {msg.text}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;