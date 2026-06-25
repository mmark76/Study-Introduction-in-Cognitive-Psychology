import { NavLink, Outlet } from "react-router-dom";
import { studyConfig } from "../../app/studyConfig";

const navigation = [
  ["/", "Αρχική"],
  ["/units", studyConfig.unitsLabel],
  ["/flashcards", "Flashcards"],
  ["/review", "Επανάληψη"],
  ["/quiz", "Quiz"],
  ["/progress", "Πρόοδος"],
  ["/study-materials", "Υλικό μελέτης"]
] as const;

const footerNavigation = [
  ["/legal/license", "License"],
  ["/legal/privacy", "Privacy"],
  ["/legal/analytics", "Analytics choices"],
  ["/legal/copyright", "Copyright protected"]
] as const;

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Local-first learning</p>
          <h1>{studyConfig.appName}</h1>
          {studyConfig.subjectName ? <p>{studyConfig.subjectName}</p> : null}
        </div>
        <nav className="main-nav" aria-label="Κύρια πλοήγηση">
          {navigation.map(([to, label]) => (
            <NavLink end={to === "/"} key={to} to={to}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main"><Outlet /></main>
      <footer className="app-footer">
        <p>© 2026 Markellos Markides. All rights reserved.</p>
        <nav className="footer-meta" aria-label="Legal information">
          {footerNavigation.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
      </footer>
    </div>
  );
}
