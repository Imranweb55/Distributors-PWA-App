// FILE: src/pages/LedgerPage.jsx
// UI-ONLY REDESIGN — replaces the "Coming Soon" placeholder for this
// tab with the real design from the reference image. Data below is
// STATIC PLACEHOLDER DATA (marked clearly), same pattern as the other
// redesigned tabs — no API wired yet. Only this file was touched;
// BottomNav, ComingSoonPage (still used by Profile), App.jsx etc. are
// untouched.
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// ───────────────────────── DUMMY DATA (replace later) ─────────────────────────
const TOTAL_OUTSTANDING = "8,750";
const PENDING_COUNT = 3;

const CUSTOMER_LEDGER = [
  { name: "Hotel Annapoorna",      amount: "2,450", dueDays: 5 },
  { name: "Sri Murugan Mess",      amount: "1,200", dueDays: 3 },
  { name: "Green Park Restaurant", amount: "3,800", dueDays: 7 },
  { name: "Sakthi Hotel",          amount: "950",   dueDays: 4 },
];

const TRANSACTIONS = [
  { type: "payment", title: "Payment Received", customer: "Hotel Annapoorna",   date: "16 Sep 2026 • 11:20 AM", amount: "2,000" },
  { type: "payment", title: "Payment Received", customer: "Ravi Tiffin Center", date: "17 Sep 2026 • 08:45 PM", amount: "1,500" },
  { type: "order",   title: "Order Placed",     customer: "Hotel Annapoorna",   date: "17 Sep 2026 • 10:12 AM", amount: "575" },
];
// ────────────────────────────────────────────────────────────────────────────

export default function LedgerPage() {
  const navigate = useNavigate();

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
          <span className="text-white text-lg font-semibold">Ledger &amp; Collections</span>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── White content, overlapping the green header ── */}
      <div className="-mt-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between p-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] text-gray-500">Total Outstanding</p>
              <p className="text-xl font-bold text-gray-800">₹ {TOTAL_OUTSTANDING}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-[12px] font-medium whitespace-nowrap">
            {PENDING_COUNT} Pending
          </span>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <p className="font-bold text-gray-800">Customer Ledger</p>
          <button className="text-[12.5px] text-blue-600 font-semibold flex items-center gap-1">
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mb-6">
          {CUSTOMER_LEDGER.map((c) => (
            <div key={c.name} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
              </div>
              <p className="flex-1 font-medium text-gray-800 text-[14px]">{c.name}</p>
              <div className="text-right">
                <p className="font-semibold text-gray-800 text-[14px]">₹ {c.amount}</p>
                <p className="text-[11px] text-red-500 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Due {c.dueDays} days
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-bold text-gray-800 mb-3 px-1">Recent Transactions</p>

        <div className="mb-6">
          {TRANSACTIONS.map((t, i) => (
            <div key={i} className="flex gap-3 relative">
              {i < TRANSACTIONS.length - 1 && (
                <span className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-green-200" />
              )}
              <div
                className={`w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10 ${
                  t.type === "payment" ? "bg-green-600" : "bg-blue-500"
                }`}
              >
                {t.type === "payment" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                  </svg>
                )}
              </div>
              <div className="flex-1 flex items-center justify-between pb-5">
                <div>
                  <p className="text-[13.5px] font-semibold text-gray-800">{t.title}</p>
                  <p className="text-[12px] text-gray-400">{t.customer}</p>
                  <p className="text-[11px] text-gray-300">{t.date}</p>
                </div>
                <p className="text-[13.5px] font-semibold text-green-600">+ ₹ {t.amount}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-3.5 rounded-2xl bg-green-800 text-white text-[14px] font-semibold flex items-center justify-center gap-2 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
          </svg>
          Add Payment
        </button>
      </div>

      <BottomNav />
    </div>
  );
}