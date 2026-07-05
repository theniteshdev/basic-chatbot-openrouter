import { useState, useRef, useEffect } from "react";

import "./Chat.css";

import Message from "./Message";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const bottom = useRef();

  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const response = await fetch(
      "https://basic-chatbot-openrouter-1.onrender.com/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: text,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong! :(",
        },
      ]);
      setLoading(false);
      setText("");

      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: data.reply,
      },
    ]);

    setText("");

    setLoading(false);
  } // end function

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}

        {loading && <Message role="bot" text="Typing..." />}

        <div ref={bottom}></div>
      </div>

      <div className="input">
        <input
          value={text}
          placeholder="Ask something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
