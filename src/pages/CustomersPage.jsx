// FILE: src/pages/CustomersPage.jsx
// UI-ONLY REDESIGN — replaces the "Coming Soon" placeholder for this
// tab with the real design from the reference image. Data below is
// STATIC PLACEHOLDER DATA (marked clearly), same pattern as HomePage —
// no API wired yet, per your instruction. Only this file was touched;
// BottomNav, ComingSoonPage (still used by Orders/Ledger/Profile),
// App.jsx etc. are untouched.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// ───────────────────────── DUMMY DATA (replace later) ─────────────────────────
const TABS = [
  { key: "all", label: "All", count: 24 },
  { key: "active", label: "Active", count: 21 },
  { key: "credit", label: "Credit", count: 3 },
];

const CUSTOMERS = [
  { name: "Hotel Annapoorna",    location: "Anna Nagar", outstanding: "2,450", status: "credit" },
  { name: "Sri Murugan Mess",    location: "Velachery",  outstanding: "1,200", status: "active" },
  { name: "Green Park Restaurant", location: "T. Nagar", outstanding: "3,800", status: "active" },
  { name: "Sakthi Hotel",        location: "Adyar",      outstanding: "950",   status: "active" },
  { name: "New A1 Mess",         location: "Tambaram",   outstanding: "2,100", status: "credit" },
  { name: "Ravi Tiffin Center",  location: "Chromepet",  outstanding: "680",   status: "active" },
];
// ────────────────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  credit: "bg-amber-100 text-amber-700",
};

export default function CustomersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS
    .filter((c) => tab === "all" || c.status === tab)
    .filter((c) => (c.name + c.location).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* ── Green header ── */}
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-9 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white text-lg font-semibold">Customers</span>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── White content, overlapping the green header ── */}
      <div className="-mt-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 px-4 py-3 mb-4">
          <svg className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, phone..."
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <svg className="w-[18px] h-[18px] text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap ${
                tab === t.key ? "bg-green-800 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {filtered.map((c) => (
            <div key={c.name} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-[14px] truncate">{c.name}</p>
                <p className="text-[12px] text-gray-400">{c.location}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Outstanding: <span className="text-red-500 font-medium">₹ {c.outstanding}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLE[c.status]}`}>
                  {c.status === "credit" ? "Credit" : "Active"}
                </span>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No customers match this filter.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}