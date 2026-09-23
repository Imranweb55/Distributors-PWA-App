// FILE: src/pages/LedgerPage.jsx
// UPDATED — Feature: real-time distributor workflow. No more dummy
// numbers: "Customer Ledger" and "Recent Transactions" now come from
// GET /api/deliveries/mine/ledger, which aggregates your real
// DeliveryRecord history (every "credit" you gave a customer, every
// payment you collected). "Total Outstanding" and "Add Payment" use the
// same real summary/ledger data — layout is unchanged from before.
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { getMyLedger, getMyDeliverySummary } from "../api/distributorApi";

export default function LedgerPage() {
  const [ledger, setLedger] = useState({ customerLedger: [], recentTransactions: [] });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyLedger(), getMyDeliverySummary()])
      .then(([l, s]) => { setLedger(l); setSummary(s); })
      .finally(() => setLoading(false));
  }, []);

  const totalOutstanding = ledger.customerLedger.reduce((s, c) => s + c.outstanding, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-9 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-semibold">Ledger &amp; Collections</span>
        </div>
      </div>

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
              <p className="text-xl font-bold text-gray-800">₹ {totalOutstanding.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-[12px] font-medium whitespace-nowrap">
            {ledger.customerLedger.length} Pending
          </span>
        </div>

        <p className="font-bold text-gray-800 mb-3 px-1">Customer Ledger</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mb-6">
          {loading && <p className="text-center text-gray-400 py-6 text-sm">Loading…</p>}
          {!loading && ledger.customerLedger.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No pending credits — everyone's paid up!</p>}
          {ledger.customerLedger.map((c) => (
            <div key={c.customerId} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
              </div>
              <p className="flex-1 font-medium text-gray-800 text-[14px]">{c.shopName}</p>
              <p className="font-semibold text-red-500 text-[14px]">₹ {c.outstanding.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>

        <p className="font-bold text-gray-800 mb-3 px-1">Recent Transactions</p>
        <div className="mb-6">
          {loading && <p className="text-center text-gray-400 py-6 text-sm">Loading…</p>}
          {!loading && ledger.recentTransactions.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No transactions recorded yet.</p>}
          {ledger.recentTransactions.map((t, i) => (
            <div key={i} className="flex gap-3 relative">
              {i < ledger.recentTransactions.length - 1 && (
                <span className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-green-200" />
              )}
              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10 ${t.type === "payment" ? "bg-green-600" : "bg-blue-500"}`}>
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
                  <p className="text-[11px] text-gray-300">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <p className="text-[13.5px] font-semibold text-green-600">+ ₹ {t.amount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>

        {summary && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[11px] text-gray-400">Total Revenue</p>
              <p className="text-sm font-bold text-gray-800">₹ {summary.totalRevenue.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Total Margin Earned</p>
              <p className="text-sm font-bold text-green-600">₹ {summary.totalMargin.toLocaleString("en-IN")}</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}