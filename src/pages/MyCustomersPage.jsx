// FILE: src/pages/MyCustomersPage.jsx
// NEW FILE — Distributors-PWA-App
// Feature #2/#6: the customers the admin has handed over to this
// distributor to maintain (daily deliveries, orders, payments etc).
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { getMyCustomers } from "../api/distributorApi";

export default function MyCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCustomers().then((d) => setCustomers(d.customers || [])).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    (c.shopName + c.phone).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <BottomNav />
      <div className="p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading && <p className="text-center text-gray-400 py-10 text-sm">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No customers assigned to you yet.</p>
        )}

        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800 text-sm">{c.shopName}</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.tag === "regular" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                  {c.tag}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{c.phone}</p>
              {c.address && <p className="text-xs text-gray-400">{c.address}</p>}
              <p className="text-xs text-gray-500 mt-1">Total delivered: {c.totalKg || 0} kg · {c.totalOrders || 0} orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}