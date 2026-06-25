import { NavLink, Outlet } from "react-router-dom";
import { studyConfig } from "../../app/studyConfig";
import { EducationLevelSelector } from "../../features/education/EducationLevelSelector";
import { useEducationProfile } from "../../features/education/useEducationProfile";
import { GoogleTranslateBar } from "./GoogleTranslateBar";

const footerNavigation = [
  ["/legal/license", "License"],
  ["/legal/privacy", "Privacy"],
  ["/legal/analytics", "Analytics choices"],
  ["/legal/copyright", "Copyright protected"]
] as const;

export function AppLayout() {
  const { profile, isLoading, selectEducationLevel, clearEducationLevel } = useEducationProfile();
  const navigation = profile ? [
    ["/", "Home"],
    ["/units", profile.sectionPlural],
    ["/flashcards", "Flashcards"],
    ["/review", "Review"],
    ["/quiz", "Quiz"],
    ["/progress", "Progress"],
    ["/import", "Add content"],
    ["/study-materials", "Study materials"]
  ] as const : [];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top-row">
          <div>
            <p className="eyebrow">Your private study space</p>
            <h1>{studyConfig.appName}</h1>
            {profile ? <p className="education-context">{profile.title} · {profile.studyLabel}</p> : null}
          </div>
          <GoogleTranslateBar />
        </div>
        {profile ? (
          <>
            <nav className="main-nav" aria-label="Main navigation">
              {navigation.map(([to, label]) => (
                <NavLink end={to === "/"} key={to} to={to}>{label}</NavLink>
              ))}
            </nav>
            <button className="text-button" type="button" onClick={() => void clearEducationLevel()}>
              Change education level
            </button>
          </>
        ) : null}
      </header>
      <main className="app-main">
        {isLoading ? (
          <section className="empty-state"><p>Preparing your study space…</p></section>
        ) : profile ? (
          <Outlet />
        ) : (
          <EducationLevelSelector onSelect={selectEducationLevel} />
        )}
      </main>
      <footer className="app-footer">
        <p>© 2026 Markellos Markides. All rights reserved.</p>
        <nav className="footer-meta" aria-label="Legal information">
          {footerNavigation.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
      </footer>
    </div>
  );
}
