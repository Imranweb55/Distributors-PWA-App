// FILE: src/pages/RequestBatterPage.jsx
// NEW FILE — Distributors-PWA-App
// Feature #4/#5/#7: instead of asking customers for money directly, the
// distributor now tells the admin how many kg of Idly/Dosa batter they
// need TODAY, built by entering each customer's order — the totals are
// calculated automatically. Admin then approves (fully or partially)
// with a delivery time, which shows up here once set.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getMyCustomers, submitBatterRequest, getMyBatterRequests } from "../api/distributorApi";

export default function RequestBatterPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState({}); // customerId -> { idlyKg, dosaKg }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyCustomers(), getMyBatterRequests()])
      .then(([c, r]) => {
        setCustomers(c.customers || []);
        // Pre-fill from today's existing pending request, if any, so the
        // distributor can edit instead of starting over.
        const today = (r.requests || [])[0];
        if (today && today.status === "pending") {
          const prefill = {};
          (today.customerOrders || []).forEach((co) => {
            if (co.customer) prefill[co.customer] = { idlyKg: co.idlyKg, dosaKg: co.dosaKg };
          });
          setRows(prefill);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const setRow = (customerId, field, value) => {
    setRows((r) => ({ ...r, [customerId]: { ...r[customerId], [field]: value } }));
  };

  const totalIdly = Object.values(rows).reduce((s, r) => s + (Number(r.idlyKg) || 0), 0);
  const totalDosa = Object.values(rows).reduce((s, r) => s + (Number(r.dosaKg) || 0), 0);

  const handleSubmit = async () => {
    setError("");
    const customerOrders = customers
      .filter((c) => rows[c._id] && (Number(rows[c._id].idlyKg) > 0 || Number(rows[c._id].dosaKg) > 0))
      .map((c) => ({
        customerId: c._id,
        shopName: c.shopName,
        idlyKg: Number(rows[c._id].idlyKg) || 0,
        dosaKg: Number(rows[c._id].dosaKg) || 0,
      }));

    if (customerOrders.length === 0) {
      setError("Enter at least one customer's kg requirement.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await submitBatterRequest(customerOrders);
      setDone(data.request);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen pb-20">
        <BottomNav />
        <div className="p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h2 className="font-semibold text-gray-800 mb-1">Request sent to admin</h2>
            <p className="text-sm text-gray-500 mb-4">
              {done.requestedIdlyKg}kg idly batter + {done.requestedDosaKg}kg dosa batter requested.
              You'll see the approval and delivery time on your Dashboard.
            </p>
            <button onClick={() => navigate("/")} className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <BottomNav />
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-3">Enter today's kg for each customer that ordered. Totals are calculated automatically.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-3">{error}</div>}

        {loading && <p className="text-center text-gray-400 py-10 text-sm">Loading…</p>}
        {!loading && customers.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No customers assigned to you yet — contact admin.</p>
        )}

        <div className="space-y-2">
          {customers.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
              <p className="text-sm font-medium text-gray-800 mb-2">{c.shopName}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400">Idly kg</label>
                  <input
                    type="number" min="0" step="0.5"
                    value={rows[c._id]?.idlyKg || ""}
                    onChange={(e) => setRow(c._id, "idlyKg", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400">Dosa kg</label>
                  <input
                    type="number" min="0" step="0.5"
                    value={rows[c._id]?.dosaKg || ""}
                    onChange={(e) => setRow(c._id, "dosaKg", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {customers.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Total: <b className="text-gray-800">{totalIdly}kg idly / {totalDosa}kg dosa</b></span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Request to Admin"}
          </button>
        </div>
      )}
    </div>
  );
}