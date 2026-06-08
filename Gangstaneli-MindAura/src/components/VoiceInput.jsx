import { useRef, useState } from "react";

function VoiceInput() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      alert("Voice input failed. Allow microphone permission and try Chrome.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function stopVoiceInput() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }

  return (
    <div className="card">
      <div className="icon">🎙️</div>
      <h3>Voice Check-In</h3>
      <p>Click start, speak, and your words should appear below.</p>

      {!listening ? (
        <button onClick={startVoiceInput}>Start Voice</button>
      ) : (
        <button onClick={stopVoiceInput}>Stop Listening</button>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your voice reflection will appear here..."
      />
    </div>
  );
}

export default VoiceInput;