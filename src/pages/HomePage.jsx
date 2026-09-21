// FILE: src/pages/HomePage.jsx
// NEW FILE — UI-ONLY, design-first as instructed. Every number/name/
// order below is STATIC PLACEHOLDER DATA (marked clearly) so the page
// renders exactly like the reference image without needing any backend
// endpoint yet. When you're ready to wire it up, only the DUMMY_DATA
// block below needs to be replaced with real API calls (e.g.
// getMyProfile() for the greeting, getMyCustomers().length for New
// Customers, a future orders/ledger endpoint for the rest) — the JSX/
// styling below does not need to change.
import BottomNav from "../components/BottomNav";
import { useDistributorAuth } from "../context/DistributorAuthContext";

// ───────────────────────── DUMMY DATA (replace later) ─────────────────────────
const DUMMY = {
  greetingName: "Ramesh Kumar",
  role: "Field Sales Executive",
  todayLabel: "Today, 18 Sep 2026",
  stats: {
    totalOrders: { value: 12, delta: "+2 vs yesterday" },
    totalCollections: { value: "₹8,750", delta: "+ ₹2,500" },
    newCustomers: { value: 3, delta: "+1 vs yesterday" },
    pendingPayments: { value: "₹4,200", delta: "2 customers" },
  },
  recentOrders: [
    { id: "#OR00015", date: "18 Sep 2026", amount: "₹2,450", status: "Delivered" },
    { id: "#OR00014", date: "17 Sep 2026", amount: "₹1,200", status: "In Transit" },
  ],
};
// ────────────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: "New Order", icon: "M12 4v16m8-8H4" },
  { label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" },
  { label: "Ledger", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Delivery", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" },
];

const STATUS_STYLE = {
  Delivered: "bg-green-50 text-green-600",
  "In Transit": "bg-blue-50 text-blue-600",
};

function StatCard({ icon, iconBg, iconColor, label, value, valueColor, delta, deltaColor, clickable }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
          </svg>
        </div>
        {clickable && (
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      <p className="text-[12.5px] text-gray-500 font-medium mb-1">{label}</p>
      <p className={`text-xl font-bold ${valueColor || "text-gray-900"}`}>{value}</p>
      <p className={`text-[11px] mt-0.5 ${deltaColor || "text-gray-400"}`}>{delta}</p>
    </div>
  );
}

export default function HomePage() {
  const { distributor } = useDistributorAuth();
  // Falls back to the DUMMY greeting name if a real distributor profile
  // isn't loaded yet — purely cosmetic fallback, not a functional change.
  const displayName = distributor?.name || DUMMY.greetingName;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* ── Green header ── */}
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-5 pt-6 pb-14 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white text-2xl italic font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Sridhi
          </span>
          <div className="flex items-center gap-3">
            <button className="relative text-white">
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold">
              {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-9 h-9 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
          <div>
            <p className="text-green-100 text-[13px]">{greeting}</p>
            <p className="text-white text-xl font-bold leading-tight">{displayName}</p>
            <p className="text-green-200 text-[12px]">{DUMMY.role}</p>
          </div>
        </div>
      </div>

      {/* ── White content, overlapping the green header ── */}
      <div className="-mt-5 px-4">
        <p className="text-sm font-semibold text-gray-800 mb-3 px-2">{DUMMY.todayLabel}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            iconBg="bg-green-50" iconColor="text-green-600"
            label="Total Orders" value={DUMMY.stats.totalOrders.value}
            delta={DUMMY.stats.totalOrders.delta} deltaColor="text-green-600"
          />
          <StatCard
            icon="M9 7h6m-6 4h6m-6 4h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            iconBg="bg-green-50" iconColor="text-green-600"
            label="Total Collections" value={DUMMY.stats.totalCollections.value}
            delta={DUMMY.stats.totalCollections.delta} deltaColor="text-green-600"
          />
          <StatCard
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            iconBg="bg-blue-50" iconColor="text-blue-600"
            label="New Customers" value={DUMMY.stats.newCustomers.value} valueColor="text-blue-700"
            delta={DUMMY.stats.newCustomers.delta} deltaColor="text-blue-500"
          />
          <StatCard
            icon="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            iconBg="bg-red-50" iconColor="text-red-500"
            label="Pending Payments" value={DUMMY.stats.pendingPayments.value} valueColor="text-red-600"
            delta={DUMMY.stats.pendingPayments.delta} clickable
          />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100/60 rounded-2xl p-4 mb-5 border border-green-100">
          <svg className="absolute right-3 bottom-2 w-16 h-12 text-green-300 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M6 21V13m5 8V9m5 12V5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8l4-3 4 2 6-5" />
          </svg>
          <p className="font-bold text-green-800 text-[15px]">More Orders</p>
          <p className="font-bold text-green-800 text-[15px] mb-1.5">More Growth</p>
          <p className="text-[12px] text-green-700/80 max-w-[70%]">Keep going! Your efforts build bigger success.</p>
        </div>

        <p className="font-bold text-gray-800 mb-3 px-1">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={a.icon} />
                </svg>
              </div>
              <span className="text-[11px] text-gray-600 font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <p className="font-bold text-gray-800">Recent Orders</p>
          <button className="text-[12.5px] text-green-700 font-semibold flex items-center gap-1">
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 mb-4">
          {DUMMY.recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">{o.id}</p>
                <p className="text-[11px] text-gray-400">{o.date}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{o.amount}</p>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 ${STATUS_STYLE[o.status]}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}