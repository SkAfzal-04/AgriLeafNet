import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi 👋 How can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  // 🎤 FIXED MIC
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    // ✅ IMPORTANT FIX
    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech not supported in this browser");
      return;
    }

    // ✅ PREVENT ERROR
    if (listening) return;

    try {
      setListening(true);
      recognitionRef.current.start();
    } catch (err) {
      console.log("Already started");
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };

    const botReply = {
      text: "I am your Agri Assistant 🌱. Ask about diseases, fertilizers, or how to use this app.",
      sender: "bot"
    };

    setMessages([...messages, userMsg, botReply]);
    setInput("");
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl transition"
      >
        💬
      </button>

      {/* 📦 Chat Window */}
      {open && (
        <motion.div
          className="fixed bottom-20 right-6 w-[420px] bg-white rounded-xl shadow-2xl z-50 flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-3 rounded-t-xl flex justify-between">
            <span>Agri Assistant 🌱</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="p-3 h-[400px] overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-green-100 ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input + Voice */}
          <div className="flex items-center border-t p-2 gap-2">

            {/* Input */}
            <input
              type="text"
              className="flex-1 p-2 outline-none"
              placeholder="Type or speak..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* 🎤 WhatsApp Style Mic */}
            <button
              onClick={startListening}
              disabled={listening}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-md transition
                ${
                  listening
                    ? "bg-red-500 animate-pulse cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-95"
                }`}
            >
              <span className="text-white text-lg">🎤</span>

              {/* Pulse Effect */}
              {listening && (
                <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping"></span>
              )}
            </button>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>

          </div>
        </motion.div>
      )}
    </>
  );
}