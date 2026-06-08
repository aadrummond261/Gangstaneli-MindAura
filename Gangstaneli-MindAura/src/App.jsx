import { useState } from "react";
import "./App.css";
import logo from "./assets/GangstaneliMindAura.png";
import VoiceInput from "./components/VoiceInput";
import CameraInput from "./components/CameraInput";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [activeFeature, setActiveFeature] = useState(null);

  const userKey = user ? `mindaura_${user.email}` : null;

  function getUserData() {
    return JSON.parse(localStorage.getItem(userKey)) || {
      moods: [],
      medications: [],
      appointments: [],
    };
  }

  function saveUserData(data) {
    localStorage.setItem(userKey, JSON.stringify(data));
  }

  function signup() {
    if (!email || !password) {
      alert("Enter email and password.");
      return;
    }

    localStorage.setItem(
      `user_${email}`,
      JSON.stringify({ email, password })
    );

    const newUser = { email };
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
  }

  function login() {
    const savedUser = JSON.parse(localStorage.getItem(`user_${email}`));

    if (!savedUser || savedUser.password !== password) {
      alert("Wrong email or password.");
      return;
    }

    const currentUser = { email };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    setActiveFeature(null);
  }

  if (!user) {
    return (
      <div className="app auth-page">
        <div className="auth-card">
          <div className="hero-logo-glow small-logo">
            <img src={logo} alt="Gangstaneli MindAura" />
          </div>

          <h1>Gangstaneli MindAura</h1>
          <p>Login or sign up to keep your wellness information saved.</p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {authMode === "login" ? (
            <button onClick={login}>Login</button>
          ) : (
            <button onClick={signup}>Sign Up</button>
          )}

          <button
            className="text-button"
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          >
            {authMode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="logo-glow">
            <img src={logo} alt="Gangstaneli MindAura logo" />
          </div>

          <h2>
            Gangstaneli
            <br />
            MindAura
          </h2>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#voice-camera">Voice & Camera</a>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>
            Gangstaneli <span>MindAura</span>
          </h1>
          <p>
            Welcome, {user.email}. Track your mood, meds, appointments,
            voice reflections, camera input, and support resources.
          </p>
        </div>

        <div className="hero-image">
          <div className="hero-logo-glow">
            <img src={logo} alt="MindAura" />
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <FeatureCard
          icon="😊"
          title="Mood Check-In"
          text="Choose an emoji or type how you feel."
          button="Open Mood"
          onClick={() => setActiveFeature("mood")}
        />

        <FeatureCard
          icon="💊"
          title="Medication Tracker"
          text="Save medications and reminder times."
          button="Open Meds"
          onClick={() => setActiveFeature("meds")}
        />

        <FeatureCard
          icon="📅"
          title="Calendar Tracker"
          text="Track appointments and medication dates."
          button="Open Calendar"
          onClick={() => setActiveFeature("calendar")}
        />

        <FeatureCard
          icon="🎙️"
          title="Voice Check-In"
          text="Speak your reflection."
          button="Open Voice"
          onClick={() => setActiveFeature("voice")}
        />

        <FeatureCard
          icon="📷"
          title="Camera Input"
          text="Turn on your camera."
          button="Open Camera"
          onClick={() => setActiveFeature("camera")}
        />

        <FeatureCard
          icon="🤝"
          title="Support System"
          text="Save trusted resources later."
          button="Open Support"
          onClick={() => setActiveFeature("support")}
        />
      </section>

      {activeFeature && (
        <section className="popup-section">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setActiveFeature(null)}>
              Close
            </button>

            {activeFeature === "mood" && (
              <MoodFeature getUserData={getUserData} saveUserData={saveUserData} />
            )}

            {activeFeature === "meds" && (
              <MedicationFeature getUserData={getUserData} saveUserData={saveUserData} />
            )}

            {activeFeature === "calendar" && (
              <CalendarFeature getUserData={getUserData} saveUserData={saveUserData} />
            )}

            {activeFeature === "voice" && <VoiceInput />}
            {activeFeature === "camera" && <CameraInput />}

            {activeFeature === "support" && (
              <div className="card">
                <h3>Support System</h3>
                <p>Later, this can store emergency contacts and therapist links.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, text, button, onClick }) {
  return (
    <div className="feature-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button onClick={onClick}>{button}</button>
    </div>
  );
}

function MoodFeature({ getUserData, saveUserData }) {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState(getUserData().moods);

  function saveMood() {
    if (!selectedMood && !note) {
      alert("Choose an emoji or type how you feel.");
      return;
    }

    const newMood = {
      id: Date.now(),
      mood: selectedMood,
      note,
      date: new Date().toLocaleString(),
    };

    const data = getUserData();
    const updated = { ...data, moods: [newMood, ...data.moods] };

    saveUserData(updated);
    setMoods(updated.moods);
    setSelectedMood("");
    setNote("");
  }

  return (
    <div className="card">
      <h3>Mood Check-In</h3>

      <div className="emoji-grid">
        {["😊 Happy", "😌 Calm", "😔 Sad", "😟 Stressed", "😴 Tired", "🤩 Excited"].map(
          (mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={selectedMood === mood ? "emoji-btn selected" : "emoji-btn"}
            >
              {mood}
            </button>
          )
        )}
      </div>

      <textarea
        placeholder="Or type how you're feeling..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={saveMood}>Save Mood</button>

      <div className="saved-list">
        {moods.map((item) => (
          <p key={item.id}>
            {item.mood} {item.note} — {item.date}
          </p>
        ))}
      </div>
    </div>
  );
}

function MedicationFeature({ getUserData, saveUserData }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [medications, setMedications] = useState(getUserData().medications);

  function saveMedication() {
    if (!name || !time) {
      alert("Enter medication name and time.");
      return;
    }

    const newMedication = {
      id: Date.now(),
      name,
      time,
    };

    const data = getUserData();
    const updated = {
      ...data,
      medications: [newMedication, ...data.medications],
    };

    saveUserData(updated);
    setMedications(updated.medications);
    setName("");
    setTime("");
  }

  return (
    <div className="card">
      <h3>Medication Tracker</h3>

      <input
        placeholder="Medication name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button onClick={saveMedication}>Save Medication</button>

      <div className="saved-list">
        {medications.map((med) => (
          <p key={med.id}>
            💊 {med.name} at {med.time}
          </p>
        ))}
      </div>
    </div>
  );
}

function CalendarFeature({ getUserData, saveUserData }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState(getUserData().appointments);

  function saveAppointment() {
    if (!title || !date || !time) {
      alert("Enter title, date, and time.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      title,
      date,
      time,
    };

    const data = getUserData();
    const updated = {
      ...data,
      appointments: [newAppointment, ...data.appointments],
    };

    saveUserData(updated);
    setAppointments(updated.appointments);
    setTitle("");
    setDate("");
    setTime("");
  }

  return (
    <div className="card">
      <h3>Calendar Tracker</h3>

      <input
        placeholder="Appointment or reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <button onClick={saveAppointment}>Save Calendar Event</button>

      <div className="saved-list">
        {appointments.map((item) => (
          <p key={item.id}>
            📅 {item.title} — {item.date} at {item.time}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;