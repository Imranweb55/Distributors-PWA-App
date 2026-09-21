// FILE: src/pages/OrdersPage.jsx
// UI-ONLY REDESIGN — replaces the "Coming Soon" placeholder for this
// tab with the real design from the reference image. Data below is
// STATIC PLACEHOLDER DATA (marked clearly), same pattern as HomePage/
// CustomersPage — no API wired yet. Only this file was touched;
// BottomNav, ComingSoonPage (still used by Ledger/Profile), App.jsx
// etc. are untouched.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// ───────────────────────── DUMMY DATA (replace later) ─────────────────────────
const TABS = ["All", "Pending", "In Transit", "Delivered"];

const ORDERS = [
  {
    id: "#ORD0015", customer: "Hotel Annapoorna", kg: 12, amount: 420,
    date: "18 Sep 2026", time: "10:15 AM", status: "Delivered", driver: "Ramesh (DRV-01)",
  },
  {
    id: "#ORD0014", customer: "Sri Murugan Mess", kg: 8, amount: 280,
    date: "17 Sep 2026", time: "04:20 PM", status: "In Transit", driver: "Selvam (DRV-02)",
  },
  {
    id: "#ORD0013", customer: "Green Park Restaurant", kg: 15, amount: 525,
    date: "17 Sep 2026", time: "11:05 AM", status: "Pending", driver: null,
  },
];
// ────────────────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Delivered:  { pill: "bg-green-100 text-green-700",  icon: "M5 13l4 4L19 7" },
  "In Transit": { pill: "bg-blue-100 text-blue-700",  icon: "M13 7l5 5m0 0l-5 5m5-5H6" },
  Pending:    { pill: "bg-amber-100 text-amber-700",  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");

  const filtered = ORDERS.filter((o) => tab === "All" || o.status === tab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* ── Green header ── */}
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white text-lg font-semibold">Orders &amp; Delivery</span>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap ${
                tab === t ? "bg-green-800 text-white" : "bg-white border border-gray-200 text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((o) => {
            const s = STATUS_STYLE[o.status];
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-800 text-[15px]">{o.id}</p>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${s.pill}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d={s.icon} />
                    </svg>
                    {o.status}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-[14px]">{o.customer}</p>
                    <p className="text-[12.5px] text-gray-500">{o.kg} kg &bull; ₹ {o.amount}</p>
                    <p className="text-[11.5px] text-gray-400">{o.date} &bull; {o.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 text-[12.5px] text-gray-500">
                  {o.driver ? (
                    <>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      Driver: {o.driver}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Driver: Not Assigned
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-semibold">
                    View Details
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-green-700 text-green-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No orders match this filter.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}