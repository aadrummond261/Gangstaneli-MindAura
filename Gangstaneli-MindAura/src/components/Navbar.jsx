import logo from "./assets/GangstaneliMindAura.png"
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" />

        <h2>Gangstaneli MindAura</h2>
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