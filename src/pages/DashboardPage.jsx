// FILE: src/pages/DashboardPage.jsx
// NEW FILE — Distributors-PWA-App
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useDistributorAuth } from "../context/DistributorAuthContext";
import { getMyCustomers, getMyBatterRequests } from "../api/distributorApi";

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-green-50 text-green-600",
  partially_approved: "bg-blue-50 text-blue-600",
  rejected: "bg-red-50 text-red-600",
};

export default function DashboardPage() {
  const { distributor } = useDistributorAuth();
  const [customers, setCustomers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyCustomers(), getMyBatterRequests()])
      .then(([c, r]) => { setCustomers(c.customers || []); setRequests(r.requests || []); })
      .finally(() => setLoading(false));
  }, []);

  const todayRequest = requests[0]; // most recent, sorted desc by createdAt

  return (
    <div className="min-h-screen pb-20">
      <BottomNav />

      <div className="p-4 space-y-4">
        <div className="bg-blue-600 text-white rounded-2xl p-5">
          <p className="text-xs text-blue-100">Welcome back</p>
          <p className="text-lg font-bold">{distributor?.name}</p>
          <p className="text-xs text-blue-100 mt-1">Zone: {distributor?.zone?.name || "—"} · ID: {distributor?.employeeId}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-[11px] text-gray-400">My Customers</p>
            <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-[11px] text-gray-400">Current Stock (kg)</p>
            <p className="text-2xl font-bold text-gray-800">
              {(distributor?.currentStockKg?.idly || 0) + (distributor?.currentStockKg?.dosa || 0)}
            </p>
            <p className="text-[10px] text-gray-400">Idly {distributor?.currentStockKg?.idly || 0} · Dosa {distributor?.currentStockKg?.dosa || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-800 text-sm">Today's Batter Request</p>
            {todayRequest && (
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${STATUS_STYLE[todayRequest.status]}`}>
                {todayRequest.status.replace("_", " ")}
              </span>
            )}
          </div>

          {loading && <p className="text-sm text-gray-400">Loading…</p>}

          {!loading && !todayRequest && (
            <p className="text-sm text-gray-400 mb-3">You haven't requested batter today yet.</p>
          )}

          {!loading && todayRequest && (
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>Requested: {todayRequest.requestedIdlyKg}kg idly / {todayRequest.requestedDosaKg}kg dosa</p>
              {todayRequest.status !== "pending" && (
                <p>Approved: {todayRequest.approvedIdlyKg}kg idly / {todayRequest.approvedDosaKg}kg dosa</p>
              )}
              {todayRequest.deliveryTime && <p>Delivery time: <b>{todayRequest.deliveryTime}</b></p>}
              {todayRequest.adminNote && <p className="text-xs text-gray-500">Note: {todayRequest.adminNote}</p>}
            </div>
          )}

          <Link
            to="/request-batter"
            className="block text-center w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
          >
            {todayRequest ? "Update Today's Request" : "Request Today's Batter"}
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="font-semibold text-gray-800 text-sm mb-2">Recent Requests</p>
          {requests.slice(0, 5).map((r) => (
            <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
              <span className="text-xs text-gray-700">{r.requestedIdlyKg + r.requestedDosaKg}kg requested</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLE[r.status]}`}>
                {r.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {requests.length === 0 && <p className="text-sm text-gray-400">No requests yet.</p>}
        </div>
      </div>
    </div>
  );
}