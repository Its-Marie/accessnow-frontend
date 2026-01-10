import "./Header.css";

export default function Header() {
  return (
    <header className="an-header">
      <div className="an-container">
        {/* Brand */}
        <h1 className="brand">AccessNow</h1>

        {/* Navigation */}
        <div className="nav-right">
          <nav className="nav-links">
            <a href="/help">Help</a>
            <a href="/login">Login</a>
          </nav>

          <a href="/registration" className="nav-cta">
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}
