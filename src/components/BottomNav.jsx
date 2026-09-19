// FILE: src/components/BottomNav.jsx
// NEW FILE — Distributors-PWA-App
// Simple mobile-style bottom tab bar (this app is used on distributors'
// phones as an installed PWA).
import { NavLink, useNavigate } from "react-router-dom";
import { useDistributorAuth } from "../context/DistributorAuthContext";

const TABS = [
  { path: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" },
  { path: "/customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" },
  { path: "/request-batter", label: "Request Batter", icon: "M12 4v16m8-8H4" },
];

export default function BottomNav() {
  const { logout } = useDistributorAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white sticky top-0 z-10">
        <span className="font-semibold text-sm">Sridhi Distributors</span>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="text-xs bg-blue-700/60 px-3 py-1.5 rounded-full"
        >
          Logout
        </button>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={tab.icon} />
            </svg>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}