// FILE: src/pages/ProfilePage.jsx
// UI-ONLY REDESIGN — replaces the "Coming Soon" placeholder for this
// tab with the real design from the reference image. Name/role/ID below
// fall back to STATIC PLACEHOLDER DATA if no real distributor profile is
// loaded yet (same pattern as HomePage). Logout is the one working
// action here (same as before — just clears local session, no API call)
// since without it there'd be no way to log out and test the login flow.
// Only this file was touched; BottomNav, App.jsx etc. are untouched.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useDistributorAuth } from "../context/DistributorAuthContext";

// PLACEHOLDER IMAGES (per your instruction — no image files created):
//   1. Avatar: /assets/profile-avatar-placeholder.png
//   2. Logo:   /assets/sridhi-logo.png (same placeholder used on Login)
// Until you add the real files under public/assets/, these show as a
// broken-image icon — nothing else is affected.

const MENU = [
  { key: "personal", label: "Personal Information", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "work",     label: "Work Details",          icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "password", label: "Change Password",       icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

export default function ProfilePage() {
  const { distributor, logout } = useDistributorAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const name = distributor?.name || "Ramesh Kumar";
  const role = "Field Sales Executive";
  const employeeId = distributor?.employeeId || "FS001";

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* ── Green header ── */}
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-9 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <span className="text-white text-xl font-bold">Profile</span>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── White content, overlapping the green header ── */}
      <div className="-mt-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 p-4 mb-4">
          <img
            src="/assets/profile-avatar-placeholder.png"
            alt={name}
            className="w-16 h-16 rounded-full object-cover bg-gray-100 flex-shrink-0"
          />
          <div>
            <p className="font-bold text-gray-800 text-[15px]">{name}</p>
            <p className="text-[13px] text-gray-400">{role}</p>
            <p className="text-[13px] text-gray-400">ID: {employeeId}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mb-5">
          {MENU.map((m) => (
            <button key={m.key} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
              <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={m.icon} />
              </svg>
              <span className="flex-1 text-[14px] text-gray-700 font-medium">{m.label}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}

          <div className="w-full flex items-center gap-3 px-4 py-3.5">
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="flex-1 text-[14px] text-gray-700 font-medium">Notifications</span>
            <button
              onClick={() => setNotifications((n) => !n)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${notifications ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"}`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="flex-1 text-[14px] text-gray-700 font-medium">Language</span>
            <span className="text-[13px] text-gray-400 mr-1">English</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1 text-[14px] text-gray-700 font-medium">About App</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
          >
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="flex-1 text-[14px] font-medium text-red-500">Logout</span>
          </button>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <img src="/assets/sridhi-logo.png" alt="Sridhi" className="h-8 object-contain mx-auto mb-2" />
          <p className="text-[13px] font-semibold text-gray-700">Distributors PWA</p>
          <p className="text-[11px] text-gray-400 mt-0.5">v1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}