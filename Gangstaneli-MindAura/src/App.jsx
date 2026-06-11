import { useState } from "react";
import "./App.css";

import logo from "./assets/GangstaneliMindAura.png";
import Navbar from "./components/Navbar";
import MoodCheckIn from "./components/MoodCheckIn";
import RoutineTracker from "./components/RoutineTracker";
import MedicationTracker from "./components/MedicationTracker";
import SupportSystem from "./components/SupportSystem";
import TherapistResources from "./components/TherapistLinks";
import VoiceInput from "./components/VoiceInput";
import CameraInput from "./components/CameraInput";
import AIChatBox from "./components/AIChatBox";
import ProfileMedia from "./components/ProfileMedia";
import { useCachedState } from "./utils/cacheStorage";

function safeParseUser(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function getStoredUser() {
  return (
    safeParseUser(localStorage.getItem("currentUser")) ||
    safeParseUser(sessionStorage.getItem("currentUser"))
  );
}

function saveCookiePreference(preference) {
  const maxAge = preference === "remember" ? 60 * 60 * 24 * 180 : 60 * 60 * 24;
  document.cookie = `mindaura_cookie_choice=${preference}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function Auth({ setUser, logo }) {
  const [name, setName] = useState("");
  const [cookieChoice, setCookieChoice] = useState("session");

  function handleSubmit(event) {
    event.preventDefault();

    const currentUser = {
      name: name.trim() || "MindAura Member",
      joinedAt: new Date().toISOString(),
      sessionType: cookieChoice,
    };

    saveCookiePreference(cookieChoice);

    if (cookieChoice === "remember") {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.removeItem("currentUser");
    }

    setUser(currentUser);
  }

  return (
    <div className="app auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="hero-logo-glow auth-logo">
          <img src={logo} alt="Gangstaneli MindAura" />
        </div>
        <h1>Gangstaneli MindAura</h1>
        <p>Sign in to see your mood, aura, routines, and support tools.</p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />

        <div className="cookie-options">
          <label className={cookieChoice === "session" ? "selected" : ""}>
            <input
              type="radio"
              name="cookieChoice"
              value="session"
              checked={cookieChoice === "session"}
              onChange={(event) => setCookieChoice(event.target.value)}
            />
            <span>
              <strong>Session only</strong>
              <small>Log me out when this browser session ends.</small>
            </span>
          </label>

          <label className={cookieChoice === "remember" ? "selected" : ""}>
            <input
              type="radio"
              name="cookieChoice"
              value="remember"
              checked={cookieChoice === "remember"}
              onChange={(event) => setCookieChoice(event.target.value)}
            />
            <span>
              <strong>Remember me</strong>
              <small>Keep me signed in on this device.</small>
            </span>
          </label>
        </div>

        <button type="submit">Enter MindAura</button>
      </form>
    </div>
  );
}

function AuraAnalysis({ currentMood, brainColor }) {
  return (
    <section className="card aura-analysis">
      <div className="icon">✨</div>
      <h3>Aura Analysis</h3>
      <p>Your current aura is reading as:</p>
      <strong style={{ color: brainColor }}>{currentMood}</strong>
      <div className="aura-swatch" style={{ background: brainColor }} />
      <p>
        Check in with your mood to update your aura color and receive a focused
        wellness mission.
      </p>
    </section>
  );
}

function CalendarTracker() {
  const [appointment, setAppointment] = useState("");
  const [appointments, setAppointments] = useCachedState("appointments", [], {
    maxItems: 30,
  });

  function addAppointment() {
    if (!appointment.trim()) {
      return;
    }

    setAppointments([{ id: Date.now(), text: appointment }, ...appointments]);
    setAppointment("");
  }

  return (
    <section className="card">
      <div className="icon">📅</div>
      <h3>Appointment Calendar</h3>
      <p>Keep therapy, checkups, and wellness appointments in one place.</p>
      <input
        value={appointment}
        onChange={(event) => setAppointment(event.target.value)}
        placeholder="Example: Therapy on Friday at 2 PM"
      />
      <button onClick={addAppointment}>Add Appointment</button>
      <ul>
        {appointments.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </section>
  );
}

function GriefSupport() {
  const [memory, setMemory] = useState("");
  const [memories, setMemories] = useCachedState("grief-reflections", [], {
    maxItems: 30,
  });

  function saveMemory() {
    if (!memory.trim()) {
      return;
    }

    setMemories([{ id: Date.now(), text: memory }, ...memories]);
    setMemory("");
  }

  return (
    <section className="card">
      <div className="icon">🕊️</div>
      <h3>Grief Support</h3>
      <p>Write a memory, feeling, or grounding thought for hard days.</p>
      <textarea
        value={memory}
        onChange={(event) => setMemory(event.target.value)}
        placeholder="Write what you want to remember or release..."
      />
      <button onClick={saveMemory}>Save Reflection</button>
      <div className="saved-list">
        {memories.map((item) => (
          <p key={item.id}>{item.text}</p>
        ))}
      </div>
    </section>
  );
}

function BrainAura({ color, mood }) {
  return (
    <aside className="brain-panel">
      <h2>Live Brain Aura</h2>
      <p>{mood}</p>
      <div className="glowing-brain" style={{ "--brain-color": color }}>
        <div className="brain-shape">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <p className="brain-caption">
        Your aura shifts as you check in with yourself.
      </p>
    </aside>
  );
}

function PageShell({ title, subtitle, children }) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </main>
  );
}

function ProfilePage({ user }) {
  return (
    <PageShell
      title="Profile"
      subtitle="Manage your saved profile media, voice notes, and camera check-ins."
    >
      <section className="profile-summary">
        <div className="card">
          <div className="icon">👤</div>
          <h3>{user.name || "MindAura Member"}</h3>
          <p>
            Session:{" "}
            {user.sessionType === "remember"
              ? "Remembered on this device"
              : "Session only"}
          </p>
          <p>
            Joined:{" "}
            {user.joinedAt
              ? new Date(user.joinedAt).toLocaleDateString()
              : "Today"}
          </p>
        </div>
        <ProfileMedia />
      </section>

      <section className="page-grid two-column">
        <VoiceInput />
        <CameraInput />
      </section>
    </PageShell>
  );
}

function HomePage({
  brainColor,
  currentMood,
  setBrainColor,
  setCurrentMood,
  setActiveFeature,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            Gangstaneli <span>MindAura</span>
          </h1>
          <p>
            Track your mood, aura, routines, medications, appointments, grief support,
            voice reflections, camera input, and wellness support.
          </p>
          <p className="hero-quote">“Real gangstas protect their mental health.”</p>
        </div>

        <div className="hero-image">
          <div className="hero-logo-glow">
            <img src={logo} alt="Gangstaneli MindAura" />
          </div>
        </div>
      </section>

      <main className="homepage-layout">
        <section className="features">
          <MoodCheckIn
            setBrainColor={setBrainColor}
            setCurrentMood={setCurrentMood}
          />

          <AuraAnalysis currentMood={currentMood} brainColor={brainColor} />

          <AIChatBox />

          <ProfileMedia />

          <MedicationTracker />

          <CalendarTracker />

          <GriefSupport />

          <div className="feature-card">
            <div className="icon">🎙️</div>
            <h3>Voice Check-In</h3>
            <p>Click in to speak your reflection.</p>
            <button onClick={() => setActiveFeature("voice")}>Open Voice</button>
          </div>

          <div className="feature-card">
            <div className="icon">📷</div>
            <h3>Camera Input</h3>
            <p>Click in to turn on your camera.</p>
            <button onClick={() => setActiveFeature("camera")}>Open Camera</button>
          </div>
        </section>

        <BrainAura color={brainColor} mood={currentMood} />
      </main>
    </>
  );
}

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [brainColor, setBrainColor] = useState("#c084fc");
  const [currentMood, setCurrentMood] = useState("Choose a mood");

  if (!user) {
    return <Auth setUser={setUser} logo={logo} />;
  }

  function logout() {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    setActivePage("home");
    setUser(null);
  }

  function renderPage() {
    if (activePage === "profile") {
      return <ProfilePage user={user} />;
    }

    if (activePage === "routine") {
      return (
        <PageShell title="Routine" subtitle="Keep daily habits simple and visible.">
          <section className="page-grid">
            <RoutineTracker />
          </section>
        </PageShell>
      );
    }

    if (activePage === "medications") {
      return (
        <PageShell
          title="Medications"
          subtitle="Look up medication guidance, add dose times, and mark doses taken."
        >
          <section className="page-grid">
            <MedicationTracker />
          </section>
        </PageShell>
      );
    }

    if (activePage === "support") {
      return (
        <PageShell title="Support" subtitle="Keep trusted contacts close when you need backup.">
          <section className="page-grid">
            <SupportSystem />
          </section>
        </PageShell>
      );
    }

    if (activePage === "therapy") {
      return (
        <PageShell
          title="Therapists"
          subtitle="Find wellness and therapy resources without leaving your flow."
        >
          <section className="page-grid">
            <TherapistResources />
          </section>
        </PageShell>
      );
    }

    return (
      <HomePage
        brainColor={brainColor}
        currentMood={currentMood}
        setBrainColor={setBrainColor}
        setCurrentMood={setCurrentMood}
        setActiveFeature={setActiveFeature}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        activePage={activePage}
        logo={logo}
        logout={logout}
        setActivePage={setActivePage}
      />

      {renderPage()}

      {activeFeature && (
        <section className="popup-section">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setActiveFeature(null)}>
              Close
            </button>

            {activeFeature === "voice" && <VoiceInput />}
            {activeFeature === "camera" && <CameraInput />}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
