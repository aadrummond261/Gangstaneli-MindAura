import logo from "../assets/GangstaneliMindAura.png";
import "./Navbar.css";

function Navbar({ logo: brandLogo = logo, logout, activePage, setActivePage }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "routine", label: "Routine" },
    { id: "medications", label: "Meds" },
    { id: "support", label: "Support" },
    { id: "therapy", label: "Therapists" },
  ];

  return (
    <nav className="navbar">
      <button className="nav-left nav-brand-button" onClick={() => setActivePage("home")}>
        <img src={brandLogo} alt="Gangstaneli MindAura logo" className="logo" />

        <div>
          <h2>Gangstaneli MindAura</h2>
          <p>Mood, aura, and wellness</p>
        </div>
      </button>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            className={activePage === item.id ? "nav-link active" : "nav-link"}
            key={item.id}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
        {logout && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
