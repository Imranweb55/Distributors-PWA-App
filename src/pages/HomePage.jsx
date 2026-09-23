// FILE: src/pages/HomePage.jsx
// UPDATED — Feature: real-time distributor workflow. Every number here
// is now REAL, live data from your backend (no more DUMMY object):
//   - getMyProfile()        → name, zone, current fridge stock
//   - getMyDeliverySummary()→ today's margin/revenue/collections/credits,
//                             and all-time totals — this is the exact
//                             margin logic you asked for: margin is
//                             computed on the backend per delivery as
//                             (what the customer paid) − (what the
//                             company charged the distributor for that
//                             kg), snapshotted at delivery time.
//   - getProducts()         → the per-kg company/customer rate card, so
//                             the distributor can see exactly what
//                             margin they make per kg of Idly/Dosa.
//   - getMyDeliveries()     → today's delivered/skipped list.
//   - getMyBatterRequests() → today's request + approval status.
// The layout/styling is unchanged from before — only the data source.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useDistributorAuth } from "../context/DistributorAuthContext";
import {
  getMyProfile,
  getMyDeliverySummary,
  getProducts,
  getMyDeliveries,
  getMyBatterRequests,
} from "../api/distributorApi";

const QUICK_ACTIONS = [
  { label: "Request Batter", icon: "M12 4v16m8-8H4", path: "/orders" },
  { label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0", path: "/customers" },
  { label: "Ledger", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", path: "/ledger" },
  { label: "Deliveries", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1", path: "/orders" },
];

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function StatCard({ icon, iconBg, iconColor, label, value, valueColor, delta, deltaColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
          </svg>
        </div>
      </div>
      <p className="text-[12.5px] text-gray-500 font-medium mb-1">{label}</p>
      <p className={`text-xl font-bold ${valueColor || "text-gray-900"}`}>{value}</p>
      {delta && <p className={`text-[11px] mt-0.5 ${deltaColor || "text-gray-400"}`}>{delta}</p>}
    </div>
  );
}

export default function HomePage() {
  const { distributor: authDistributor } = useDistributorAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [todayRequest, setTodayRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyDeliverySummary(), getProducts(), getMyDeliveries(), getMyBatterRequests()])
      .then(([p, s, pr, d, r]) => {
        setProfile(p.distributor);
        setSummary(s);
        setProducts(pr.products || []);
        setTodayDeliveries(d.records || []);
        setTodayRequest((r.requests || [])[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile?.name || authDistributor?.name || "Distributor";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";
  const stock = profile?.currentStockKg || { idly: 0, dosa: 0 };

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
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold">
              {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div>
            <p className="text-green-100 text-[13px]">{greeting}</p>
            <p className="text-white text-xl font-bold leading-tight">{displayName}</p>
            <p className="text-green-200 text-[12px]">{profile?.zone?.name ? `Zone: ${profile.zone.name}` : profile?.employeeId}</p>
          </div>
        </div>
      </div>

      {/* ── White content, overlapping the green header ── */}
      <div className="-mt-8 px-4">
        <p className="text-sm font-semibold text-gray-800 mb-3 px-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1"
            iconBg="bg-green-50" iconColor="text-green-600"
            label="Today's Margin" value={loading ? "…" : money(summary?.todayMargin)}
            delta={loading ? "" : `Total: ${money(summary?.totalMargin)}`} deltaColor="text-green-600"
          />
          <StatCard
            icon="M9 7h6m-6 4h6m-6 4h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            iconBg="bg-green-50" iconColor="text-green-600"
            label="Today's Collections" value={loading ? "…" : money(summary?.todayCollections)}
            delta={loading ? "" : `Revenue: ${money(summary?.todayRevenue)}`} deltaColor="text-green-600"
          />
          <StatCard
            icon="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            iconBg="bg-red-50" iconColor="text-red-500"
            label="Today's Credits" value={loading ? "…" : money(summary?.todayCredits)} valueColor="text-red-600"
            delta="Amount pending from customers"
          />
          <StatCard
            icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            iconBg="bg-blue-50" iconColor="text-blue-600"
            label="Fridge Stock" value={loading ? "…" : `${stock.idly + stock.dosa} kg`} valueColor="text-blue-700"
            delta={loading ? "" : `Idly ${stock.idly}kg · Dosa ${stock.dosa}kg`} deltaColor="text-blue-500"
          />
        </div>

        {/* Rate card — exactly how much margin per kg */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="font-semibold text-gray-800 text-sm mb-3">Your Margin Per Kg</p>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.key} className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-600">{p.name}</span>
                  <span className="text-gray-400">Company ₹{p.companyRatePerKg}/kg</span>
                  <span className="text-gray-400">Customer ₹{p.customerRatePerKg}/kg</span>
                  <span className="font-semibold text-green-600">+₹{p.customerRatePerKg - p.companyRatePerKg}/kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100/60 rounded-2xl p-4 mb-5 border border-green-100">
          <p className="font-bold text-green-800 text-[15px]">Today's Request</p>
          {todayRequest ? (
            <>
              <p className="text-[12.5px] text-green-700/90 mt-1">
                {todayRequest.requestedIdlyKg}kg idly / {todayRequest.requestedDosaKg}kg dosa requested — status: <b>{todayRequest.status.replace("_", " ")}</b>
              </p>
              {todayRequest.deliveryTime && <p className="text-[12px] text-green-700/70 mt-0.5">Delivery time: {todayRequest.deliveryTime}</p>}
            </>
          ) : (
            <p className="text-[12.5px] text-green-700/80 mt-1">You haven't requested batter today yet.</p>
          )}
          <button onClick={() => navigate("/orders")} className="mt-3 px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-semibold">
            {todayRequest ? "Manage Today's Order" : "Request Batter"}
          </button>
        </div>

        <p className="font-bold text-gray-800 mb-3 px-1">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={a.icon} />
                </svg>
              </div>
              <span className="text-[11px] text-gray-600 font-medium text-center">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <p className="font-bold text-gray-800">Today's Deliveries</p>
          <button onClick={() => navigate("/orders")} className="text-[12.5px] text-green-700 font-semibold flex items-center gap-1">
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 mb-4">
          {loading && <p className="text-center text-gray-400 py-6 text-sm">Loading…</p>}
          {!loading && todayDeliveries.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No deliveries recorded yet today.</p>}
          {todayDeliveries.slice(0, 5).map((d) => (
            <div key={d._id} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">{d.shopName || d.customer?.shopName}</p>
                <p className="text-[11px] text-gray-400">{d.idlyKg}kg idly · {d.dosaKg}kg dosa</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{money(d.amountCharged)}</p>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                d.status === "skipped" ? "bg-gray-100 text-gray-500"
                : d.paymentStatus === "credit" ? "bg-amber-50 text-amber-600"
                : "bg-green-50 text-green-600"
              }`}>
                {d.status === "skipped" ? "Skipped" : d.paymentStatus === "credit" ? "Credit" : "Paid"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}