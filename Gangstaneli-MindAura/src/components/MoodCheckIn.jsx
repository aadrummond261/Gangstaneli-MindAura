function MoodCheckIn({ setMood, setAura }) {
  const handleMood = (selectedMood) => {
    setMood(selectedMood);

    const auraMap = {
      Happy: {
        color: "Golden Yellow",
        energy: "High",
        message: "Your energy feels bright, motivated, and positive.",
      },
      Calm: {
        color: "Sky Blue",
        energy: "Peaceful",
        message: "You seem grounded and emotionally balanced.",
      },
      Stressed: {
        color: "Orange",
        energy: "Tense",
        message: "Take a pause. A short breathing break may help.",
      },
      Sad: {
        color: "Soft Purple",
        energy: "Low",
        message: "Be gentle with yourself today. Support is still available.",
      },
      Tired: {
        color: "Gray Blue",
        energy: "Drained",
        message: "Your body may need rest, water, and a simple routine.",
      },
    };

    setAura(auraMap[selectedMood]);
  };

  return (
    <section className="card">
      <h2>Daily Mood Check-In</h2>
      <p>How are you feeling today?</p>

      <div className="button-group">
        <button onClick={() => handleMood("Happy")}>Happy</button>
        <button onClick={() => handleMood("Calm")}>Calm</button>
        <button onClick={() => handleMood("Stressed")}>Stressed</button>
        <button onClick={() => handleMood("Sad")}>Sad</button>
        <button onClick={() => handleMood("Tired")}>Tired</button>
      </div>
    </section>
  );
}

export default MoodCheckIn;