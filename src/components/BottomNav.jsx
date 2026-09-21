// FILE: src/components/BottomNav.jsx
// REWRITTEN — UI-ONLY. Matches the reference image's bottom tab bar:
// Home / Customers / Orders / Ledger / Profile, active tab in green with
// a filled icon, inactive tabs in gray with an outline icon. This is
// now ONLY the bottom bar (the old top header + logout button that used
// to live in this file has moved — HomePage now has its own green
// header per the reference design, and Logout now lives on the Profile
// tab, since that's where reference-style apps usually put it).
import { NavLink } from "react-router-dom";

const TABS = [
  {
    path: "/", label: "Home", end: true,
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    path: "/customers", label: "Customers", end: false,
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
  },
  {
    path: "/orders", label: "Orders", end: false,
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    path: "/ledger", label: "Ledger", end: false,
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    path: "/profile", label: "Profile", end: false,
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-20 max-w-md mx-auto shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-green-700" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <svg
                className="w-[22px] h-[22px]"
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 1.8} d={tab.icon} />
              </svg>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}