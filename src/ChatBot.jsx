import { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const dragRef = useRef(null);
  const pos = useRef({
    x: window.innerWidth - 340,
    y: window.innerHeight - 635,
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8004/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": navigator.userAgent,
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error 😓 Unable to reply." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleClearMessages = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([]);
      setTyping(false);
    }
  };
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - pos.current.x;
      offsetY = e.clientY - pos.current.y;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      pos.current.x = e.clientX - offsetX;
      pos.current.y = e.clientY - offsetY;
      el.style.left = `${pos.current.x}px`;
      el.style.top = `${pos.current.y}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const header = el.querySelector(".chat-header");
    if (header) header.addEventListener("mousedown", onMouseDown);

    return () => {
      if (header) header.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {open && (
        <div
          ref={dragRef}
          style={{
            position: "fixed",
            left: `${pos.current.x}px`,
            top: `${pos.current.y}px`,
            width: "320px",
            height: "545px",
            backgroundColor: "yellow",
            color: "white",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
            transition: "all 0.2s ease",
            userSelect: "none",
          }}
        >
          <div
            className='chat-header'
            style={{
              padding: "10px",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "move",
              backgroundColor: "#333",
            }}
          >
            <strong>Chat Bot 🤖</strong>
            <button
              onClick={handleClearMessages}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          <div
            ref={chatRef}
            style={{ flex: 1, padding: "10px", overflowY: "auto" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    backgroundColor: msg.sender === "user" ? "#007bff" : "#333",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    display: "inline-block",
                    color: "white",
                    fontSize: msg.sender === "bot" ? "12px" : "14px",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {typing && (
              <div style={{ fontStyle: "italic", color: "#aaa" }}>
                Bot is typing...
              </div>
            )}
          </div>
          <div style={{ padding: "10px", borderTop: "1px solid #333" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "none",
              }}
              placeholder='Type your message...'
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
