import { useState } from "react";
import { useCachedState } from "../utils/cacheStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const crisisWords = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "hurt myself",
  "can't go on",
];

function buildReply(message) {
  const normalized = message.toLowerCase();

  if (crisisWords.some((word) => normalized.includes(word))) {
    return "I am really glad you said something. If you might hurt yourself or feel in immediate danger, call 988 in the U.S. or 911 now. While you reach out, move away from anything you could use to hurt yourself and text or call one trusted person to stay with you.";
  }

  if (normalized.includes("stress") || normalized.includes("overwhelmed")) {
    return "That sounds heavy. For the next two minutes, pick only one thing that needs your attention first. Breathe in for 4, hold for 2, breathe out for 6, then write the smallest next step.";
  }

  if (normalized.includes("sad") || normalized.includes("depressed") || normalized.includes("down")) {
    return "I hear you. When sadness is loud, do one gentle thing before trying to solve everything: drink water, sit near light, or send one honest message to someone safe.";
  }

  if (normalized.includes("angry") || normalized.includes("mad")) {
    return "That anger is trying to protect something. Before reacting, name what got crossed: respect, safety, time, trust, or control. Then choose one move that protects you without making tomorrow harder.";
  }

  if (normalized.includes("grief") || normalized.includes("miss") || normalized.includes("lost")) {
    return "Grief can hit in waves. You do not have to rush it. Try writing one memory, one thing you wish you could say, and one thing you need tonight.";
  }

  if (normalized.includes("anxious") || normalized.includes("anxiety") || normalized.includes("panic")) {
    return "Let’s bring your body back to now. Name 5 things you see, 4 things you feel, 3 sounds, 2 smells, and 1 thing you can do next. You only need the next minute.";
  }

  if (normalized.includes("happy") || normalized.includes("good") || normalized.includes("excited")) {
    return "I love that. Lock in the good moment: what caused it, how does it feel in your body, and what can you repeat later to protect that energy?";
  }

  return "I’m listening. What feels biggest right now: your thoughts, your body, your relationships, or what you need to get done? Start with one sentence and we can sort it out.";
}

function AIChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useCachedState("ai-chat-messages", [
    {
      id: 1,
      sender: "ai",
      text: "Tell me what is going on. I can help you slow it down and figure out the next step.",
    },
  ], {
    maxItems: 30,
    keep: "last",
  });

  async function getOpenAiReply(message, nextMessages) {
    const response = await fetch(`${API_BASE_URL}/api/ai-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        messages: nextMessages,
      }),
    });

    if (!response.ok) {
      throw new Error("AI backend is not ready.");
    }

    const data = await response.json();
    return data.reply;
  }

  async function sendMessage(event) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const reply = await getOpenAiReply(trimmedInput, nextMessages);
      setMessages([
        ...nextMessages,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: reply,
        },
      ]);
    } catch (apiError) {
      console.error(apiError);
      setError("Using local fallback until the OpenAI backend is running.");
      setMessages([
        ...nextMessages,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: buildReply(trimmedInput),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card ai-chat-card" id="ai-chat">
      <div className="icon">💬</div>
      <h3>MindAura AI Chat</h3>
      <p>Talk through what is going on and get a grounded next step.</p>

      <div className="chat-window">
        {messages.map((message) => (
          <div
            className={message.sender === "user" ? "chat-message user" : "chat-message ai"}
            key={message.id}
          >
            <strong>{message.sender === "user" ? "You" : "MindAura"}</strong>
            <p>{message.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-message ai">
            <strong>MindAura</strong>
            <p>Thinking...</p>
          </div>
        )}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <form className="chat-form" onSubmit={sendMessage}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type what is going on..."
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </section>
  );
}

export default AIChatBox;
