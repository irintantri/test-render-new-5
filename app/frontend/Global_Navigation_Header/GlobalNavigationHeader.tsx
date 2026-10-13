/** Persistent top bar: brand (left) + notifications and profile (right). Asset: 77a95ca6 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "@shared/auth";
import { ROUTES } from "@shared/lib";
import { useUserContext } from "./useUserContext";
import "./GlobalNavigationHeader.css";

export function GlobalNavigationHeader() {
  const { userProfile, isLoading } = useUserContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<"none" | "bell" | "profile">("none");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu("none");
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="gnh">
      <button className="gnh__brand" onClick={() => navigate(ROUTES.icfDashboard)} aria-label="Consent IQ home">
        <span className="gnh__powered">Powered by Agilisium</span>
        <span className="gnh__divider" />
        <span className="gnh__titles">
          <span className="gnh__title">Consent IQ</span>
          <span className="gnh__subtitle">Informed Consent Platform</span>
        </span>
      </button>

      <div className="gnh__actions" ref={ref}>
        <button className="gnh__bell" aria-label={`Notifications (${userProfile.unreadNotifications})`} onClick={() => setMenu(menu === "bell" ? "none" : "bell")}>
          <Bell size={18} />
          {userProfile.unreadNotifications > 0 && <span className="gnh__badge">{userProfile.unreadNotifications}</span>}
        </button>
        {menu === "bell" && (
          <div className="gnh__menu gnh__menu--bell">
            <div className="gnh__menu-title">Notifications</div>
            <div className="gnh__menu-item gnh__menu-item--static">
              You have {userProfile.unreadNotifications} pending task{userProfile.unreadNotifications === 1 ? "" : "s"}.
            </div>
            <button className="gnh__menu-item" onClick={() => navigate(ROUTES.icfDashboard)}>
              <LayoutDashboard size={14} /> View dashboard
            </button>
          </div>
        )}

        <button className="gnh__profile" onClick={() => setMenu(menu === "profile" ? "none" : "profile")} aria-haspopup="menu">
          <span className="gnh__avatar">{userProfile.avatarInitials ?? (isLoading ? "" : "?")}</span>
          <span className="gnh__who">
            <span className="gnh__name">{userProfile.name ?? (isLoading ? "Loading…" : "User Name")}</span>
            <span className="gnh__role">{userProfile.role ?? ""}</span>
          </span>
          <ChevronDown size={16} className="gnh__chev" />
        </button>
        {menu === "profile" && (
          <div className="gnh__menu" role="menu">
            <button className="gnh__menu-item" role="menuitem" onClick={() => navigate(ROUTES.welcome)}>
              <LayoutDashboard size={14} /> My overview
            </button>
            <button className="gnh__menu-item" role="menuitem" onClick={() => navigate(ROUTES.aiGenerate)}>
              <Sparkles size={14} /> AI document generation
            </button>
            <button
              className="gnh__menu-item"
              role="menuitem"
              onClick={() => {
                signOut();
                navigate(ROUTES.login);
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
