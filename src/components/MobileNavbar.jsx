import logo from '../assets/logo.png';

export default function MobileNavbar({ onToggleSidebar, role = 'admin' }) {
  const roleDisplay = {
    admin: 'Admin',
    teacher: 'Faculty',
    student: 'Student',
  }[role] || 'Portal';

  return (
    <header className="mobile-navbar">
      <div className="mobile-navbar-left">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="mobile-brand">
          <img src={logo} alt="ABSAS Logo" className="mobile-brand-logo" />
          <span className="mobile-brand-text">ABSAS-SIMS</span>
        </div>
      </div>

      <div className="mobile-role-pill">
        <span className="mobile-role-dot"></span>
        <span>{roleDisplay}</span>
      </div>
    </header>
  );
}
