import { useState } from "react";
import { useCachedState } from "../utils/cacheStorage";

function MoodCheckIn({ setBrainColor, setCurrentMood }) {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [savedMoods, setSavedMoods] = useCachedState("moods", [], {
    maxItems: 40,
  });

  const moodCoach = {
    "😊 Happy": {
      color: "#FFD700",
      message: "Your aura is glowing today. Keep that positive energy going.",
      mission: "Celebrate one win today.",
    },
    "😌 Calm": {
      color: "#60A5FA",
      message: "Your mind feels peaceful. Protect that calm energy.",
      mission: "Take 5 quiet minutes for yourself.",
    },
    "😔 Sad": {
      color: "#818CF8",
      message:
        "You seem a little down today. A short walk or fresh air may help.",
      mission: "Take a 10-minute walk.",
    },
    "😟 Stressed": {
      color: "#FB923C",
      message:
        "Your energy feels overwhelmed. Slow down and focus on one thing.",
      mission: "Try deep breathing for 1 minute.",
    },
    "😴 Tired": {
      color: "#A78BFA",
      message: "Your mind may need rest and recovery today.",
      mission: "Drink water and take a short break.",
    },
    "🤩 Excited": {
      color: "#EC4899",
      message: "Your energy is high. Use it toward something meaningful.",
      mission: "Work on one goal today.",
    },
    "🕊️ Grieving": {
      color: "#C4B5FD",
      message: "Grief has no schedule. Be patient with yourself today.",
      mission: "Write one memory or take a peaceful walk.",
    },
  };

  const currentCoach = moodCoach[selectedMood];

  function chooseMood(mood) {
    setSelectedMood(mood);
    setBrainColor(moodCoach[mood].color);
    setCurrentMood(mood);
  }

  function saveMood() {
    if (!selectedMood && !note) {
      alert("Choose an emoji or type how you feel.");
      return;
    }

    const newMood = {
      id: Date.now(),
      mood: selectedMood || "Typed Reflection",
      note,
      date: new Date().toLocaleString(),
    };

    setSavedMoods([newMood, ...savedMoods]);
    setSelectedMood("");
    setNote("");
  }

  return (
    <div className="card mood-feature-layout">
      <div className="icon">😊</div>
      <h3>Mood Check-In</h3>

      <p>Choose an emoji or type how you feel.</p>

      <p className="feature-quote">
        “Strong minds. Real healing. That’s gangsta.”
      </p>

      <div className="emoji-grid">
        {Object.keys(moodCoach).map((mood) => (
          <button
            key={mood}
            onClick={() => chooseMood(mood)}
            className={selectedMood === mood ? "emoji-btn selected" : "emoji-btn"}
          >
            {mood}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Or type how you're feeling..."
      />

      {currentCoach && (
        <div className="coach-text">
          <h4>MindAura Coach</h4>
          <p>{currentCoach.message}</p>
          <strong>Today’s Mission: {currentCoach.mission}</strong>
        </div>
      )}

      <button onClick={saveMood}>Save Mood</button>

      <div className="saved-list">
        {savedMoods.map((item) => (
          <p key={item.id}>
            {item.mood} {item.note && `— ${item.note}`} <br />
            <small>{item.date}</small>
          </p>
        ))}
      </div>
    </div>
  );
}

export default MoodCheckIn;
