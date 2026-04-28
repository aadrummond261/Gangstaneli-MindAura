import { useState } from "react";
import "./App.css";
import logo from "./assets/GangstaneliMindAura.png";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [mood, setMood] = useState("");
  const [med, setMed] = useState("");
  const [routine, setRoutine] = useState("");
  const [support, setSupport] = useState("");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <img src={logo} alt="Gangstaneli MindAura Logo" />
          <h2>Gangstaneli<br />MindAura</h2>
        </div>

        <div className="links">
          <button onClick={() => setActiveSection("home")}>Home</button>
          <button onClick={() => setActiveSection("mood")}>Mood</button>
          <button onClick={() => setActiveSection("routine")}>Routine</button>
          <button onClick={() => setActiveSection("support")}>Support</button>
          <button onClick={() => setActiveSection("therapy")}>Therapists</button>
        </div>

        <button onClick={() => setActiveSection("aura")}>Your Aura</button>
      </nav>

      {activeSection === "home" && (
        <>
          <main className="hero">
            <section className="hero-text">
              <h1>
                Gangstaneli <br />
                <span>MindAura</span>
              </h1>

              <p>
                Your mental wellness and aura tracking app. Track your mood,
                build healthy routines, stay on top of meds, and connect with
                support that uplifts you.
              </p>

              <button onClick={() => setActiveSection("mood")}>
                Start Your Wellness Journey
              </button>
            </section>

            <section className="hero-logo-box">
              <img src={logo} alt="Gangstaneli MindAura Logo" />
            </section>
          </main>

          <section className="cards">
            <div className="card">
              <div className="icon">😊</div>
              <h3>Mood Check-In</h3>
              <p>Check in with your emotions and see your aura.</p>
              <button onClick={() => setActiveSection("mood")}>Check In</button>
            </div>

            <div className="card">
              <div className="icon">💊</div>
              <h3>Medication Tracker</h3>
              <p>Set reminders and track your medications.</p>
              <button onClick={() => setActiveSection("meds")}>View Meds</button>
            </div>

            <div className="card">
              <div className="icon">📅</div>
              <h3>Routine Tracker</h3>
              <p>Build healthy habits and track your daily routine.</p>
              <button onClick={() => setActiveSection("routine")}>
                View Routine
              </button>
            </div>

            <div className="card">
              <div className="icon">🤝</div>
              <h3>Support System</h3>
              <p>Save trusted people you can rely on.</p>
              <button onClick={() => setActiveSection("support")}>
                View Support
              </button>
            </div>

            <div className="card">
              <div className="icon">💜</div>
              <h3>Therapist Resources</h3>
              <p>Find therapy and wellness resources.</p>
              <button onClick={() => setActiveSection("therapy")}>
                View Therapists
              </button>
            </div>

            <div className="card">
              <div className="icon">🎙️</div>
              <h3>Voice & Camera</h3>
              <p>Future features for deeper emotional check-ins.</p>
              <button onClick={() => setActiveSection("comingSoon")}>
                Coming Soon
              </button>
            </div>
          </section>
        </>
      )}

      {activeSection === "mood" && (
        <section className="page-card">
          <h1>Mood Check-In</h1>
          <p>How are you feeling today?</p>

          <div className="mood-buttons">
            {["Happy", "Calm", "Stressed", "Sad", "Tired"].map((item) => (
              <button key={item} onClick={() => setMood(item)}>
                {item}
              </button>
            ))}
          </div>

          {mood && <h2>Your current mood is: {mood}</h2>}
        </section>
      )}

      {activeSection === "aura" && (
        <section className="page-card">
          <h1>Your Aura</h1>
          <p>
            Mood: <strong>{mood || "Not checked in yet"}</strong>
          </p>
          <p>
            Aura Message:{" "}
            <strong>
              {mood
                ? "Your aura is glowing based on your current mood."
                : "Complete a mood check-in to see your aura."}
            </strong>
          </p>
        </section>
      )}

      {activeSection === "meds" && (
        <section className="page-card">
          <h1>Medication Tracker</h1>
          <input
            type="text"
            placeholder="Example: Take vitamins at 8 AM"
            value={med}
            onChange={(e) => setMed(e.target.value)}
          />
          <button>Add Medication</button>
          {med && <p>Saved reminder: {med}</p>}
        </section>
      )}

      {activeSection === "routine" && (
        <section className="page-card">
          <h1>Routine Tracker</h1>
          <input
            type="text"
            placeholder="Example: Drink water, journal, walk"
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
          />
          <button>Add Routine</button>
          {routine && <p>Saved routine: {routine}</p>}
        </section>
      )}

      {activeSection === "support" && (
        <section className="page-card">
          <h1>Support System</h1>
          <input
            type="text"
            placeholder="Example: Mom - 302-555-1234"
            value={support}
            onChange={(e) => setSupport(e.target.value)}
          />
          <button>Save Contact</button>
          {support && <p>Saved contact: {support}</p>}
        </section>
      )}

      {activeSection === "therapy" && (
        <section className="page-card">
          <h1>Therapist Resources</h1>
          <a href="https://www.psychologytoday.com/us/therapists" target="_blank">
            Psychology Today
          </a>
          <a href="https://www.therapyden.com/" target="_blank">
            TherapyDen
          </a>
          <a href="https://openpathcollective.org/" target="_blank">
            Open Path Collective
          </a>
        </section>
      )}

      {activeSection === "comingSoon" && (
        <section className="page-card">
          <h1>Voice & Camera</h1>
          <p>This feature is coming soon.</p>
        </section>
      )}

      <footer>
  <img src={logo} alt="Gangstaneli MindAura Logo" />

  <div>
    <h3>You matter. Your mind matters. Your aura matters.</h3>
    <p>Take it one step at a time. You’re doing great. ✨</p>
  </div>
</footer>
    </div>
  );
}

export default App;
