/**
 * "Signing in…" screen: GET /api/users/me → /dashboard on success, /login on error.
 * Also exports the brand panel artwork (asset c6ab4ae1) shared by onboarding screens.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/auth";
import { ROUTES } from "@shared/lib";
import { Spinner } from "@shared/ui";
import "./onboarding.css";

export function BrandPanel() {
  return (
    <aside className="brand-panel" aria-hidden="true">
      <span className="brand-panel__circle brand-panel__circle--a" />
      <span className="brand-panel__circle brand-panel__circle--b" />
      <span className="brand-panel__circle brand-panel__circle--c" />
      <div className="brand-panel__content">
        <svg className="brand-panel__art" viewBox="0 0 200 210" fill="none">
          <rect x="22" y="6" width="160" height="200" rx="10" fill="#fff" fillOpacity=".18" />
          <rect x="30" y="14" width="144" height="184" rx="8" fill="#fff" fillOpacity=".16" />
          {[[46, 34, 110], [46, 46, 86], [46, 66, 106], [46, 78, 98], [46, 90, 106], [46, 110, 108], [46, 122, 74], [46, 134, 88]].map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="4" rx="2" fill="#fff" fillOpacity={i < 2 ? 0.75 : 0.45} />
          ))}
          <rect x="66" y="160" width="40" height="3" rx="1.5" fill="#fff" fillOpacity=".5" />
          <circle cx="173" cy="49" r="26" fill="#fff" fillOpacity=".22" />
          <circle cx="173" cy="49" r="18" fill="#fff" fillOpacity=".5" />
          <path d="M173 40v18M164 49h18" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="38" cy="166" r="18" fill="#10b981" />
          <path d="m30 166 6 6 11-12" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="136" cy="160" r="8" fill="#fff" fillOpacity=".7" />
          <path d="M122 181c1-9 6-13 14-13s13 4 14 13" stroke="#fff" strokeOpacity=".8" strokeWidth="2.4" fill="none" />
          <circle cx="161" cy="155" r="8" fill="#fff" fillOpacity=".55" />
          <path d="M148 177c1-9 6-13 13-13s13 4 14 13" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" fill="none" />
        </svg>
        <h2 className="brand-panel__title">Consent IQ</h2>
        <p className="brand-panel__desc">AI-powered Informed Consent Form authoring platform built for clinical research compliance and efficiency.</p>
        <div className="brand-panel__stats">
          <div>
            <b>500+</b>
            <span>Protocols</span>
          </div>
          <i />
          <div>
            <b>99%</b>
            <span className="brand-panel__accent">Compliance</span>
          </div>
          <i />
          <div>
            <b>3x</b>
            <span className="brand-panel__accent">Faster</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="onboarding">
      <BrandPanel />
      <section className="onboarding__main">{children}</section>
    </div>
  );
}

export function AuthLoadingScreen() {
  const { token, loadUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.login, { replace: true });
      return;
    }
    let alive = true;
    loadUser()
      .then(() => alive && navigate(ROUTES.welcome, { replace: true }))
      .catch(() => alive && navigate(ROUTES.login, { replace: true }))
      .finally(() => alive && setIsLoading(false));
    return () => {
      alive = false;
    };
  }, [token, loadUser, navigate]);

  return (
    <OnboardingLayout>
      {isLoading && (
        <div className="signing-in" role="status">
          <Spinner size={36} />
          <span>Signing in…</span>
        </div>
      )}
    </OnboardingLayout>
  );
}
