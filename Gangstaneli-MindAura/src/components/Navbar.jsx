import logo from "../assets/GangstaneliMindAura.png";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Gangstaneli MindAura logo" className="logo" />

        <div>
          <h2>Gangstaneli MindAura</h2>
          <p>Mood, aura, and wellness</p>
        </div>
      </div>

      <div className="nav-links">
        <a href="#support">Support</a>
        <a href="#therapy">Therapists</a>
        <a href="#routine">Routine</a>
      </div>
    </nav>
  );
}

export default Navbar;