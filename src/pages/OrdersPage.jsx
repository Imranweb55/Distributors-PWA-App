// FILE: src/pages/OrdersPage.jsx
// REPLACED (was dummy "Orders & Delivery" list) — Feature: real-time
// distributor workflow. This page now has two real states, decided by
// today's BatterRequest status:
//
//   1. No request yet / rejected → "Request Batter" form: pick kg per
//      customer (feature #5). On submit, if the distributor already has
//      fridge stock (feature #7), a warning shows the reduced amount
//      needed and asks to confirm sending less, or requires a reason to
//      still send the full amount — exactly as you described.
//
//   2. Approved / partially approved → "Today's Deliveries": one row per
//      customer from that request, mark each Delivered (paid/credit/
//      partial + amount) or Skipped (kg carries over to tomorrow's stock
//      automatically on the backend). Submitting posts to
//      /api/deliveries, which computes margin per delivery and reduces
//      the distributor's fridge stock only for what was actually
//      delivered (feature #6/#7).
//
//   3. Still pending admin approval → waiting screen.
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import {
  getMyCustomers, getMyBatterRequests, submitBatterRequest,
  getMyProfile, getProducts, submitDeliveries,
} from "../api/distributorApi";

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-green-50 text-green-600",
  partially_approved: "bg-blue-50 text-blue-600",
  rejected: "bg-red-50 text-red-600",
};

/* ══════════════════ Carry-over stock warning modal ══════════════════ */
function CarryOverModal({ totals, stock, onSendReduced, onSendFull, onClose }) {
  const netIdly = Math.max(0, totals.idly - stock.idly);
  const netDosa = Math.max(0, totals.dosa - stock.dosa);
  const [reason, setReason] = useState("");
  const [wantsFull, setWantsFull] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5">
        <p className="font-bold text-gray-800 mb-2">You already have stock in your fridge</p>
        <p className="text-sm text-gray-500 mb-4">
          You need {totals.idly}kg idly / {totals.dosa}kg dosa today, but you already have
          {" "}{stock.idly}kg idly / {stock.dosa}kg dosa in stock. You only need to request
          {" "}<b>{netIdly}kg idly / {netDosa}kg dosa</b> more.
        </p>

        {!wantsFull ? (
          <div className="space-y-3">
            <button onClick={() => onSendReduced(netIdly, netDosa)} className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold">
              Send Reduced Request ({netIdly}kg / {netDosa}kg)
            </button>
            <button onClick={() => setWantsFull(true)} className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">
              Still Send Full Amount ({totals.idly}kg / {totals.dosa}kg)
            </button>
            <button onClick={onClose} className="w-full text-center text-xs text-gray-400 mt-1">Cancel</button>
          </div>
        ) : (
          <div>
            <label className="text-xs font-medium text-gray-500">Reason for requesting full amount despite having stock</label>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. existing stock is reserved for another shop's pending order"
              className="w-full mt-1 mb-3 px-3 py-2 rounded-xl border border-gray-200 text-sm h-20"
            />
            <div className="flex gap-3">
              <button onClick={() => setWantsFull(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Back</button>
              <button
                onClick={() => reason.trim() && onSendFull(reason.trim())}
                disabled={!reason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium disabled:opacity-50"
              >
                Send Full Amount
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════ Request Batter form ══════════════════════════ */
function RequestBatterForm({ customers, stock, rejectedNote, onSubmitted }) {
  const [rows, setRows] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCarryOver, setShowCarryOver] = useState(false);

  const setRow = (id, field, value) => setRows((r) => ({ ...r, [id]: { ...r[id], [field]: Math.max(0, Number(value) || 0) } }));
  const bump = (id, field, delta) => setRow(id, field, (rows[id]?.[field] || 0) + delta);

  const totals = customers.reduce(
    (acc, c) => ({ idly: acc.idly + (rows[c._id]?.idlyKg || 0), dosa: acc.dosa + (rows[c._id]?.dosaKg || 0) }),
    { idly: 0, dosa: 0 }
  );

  const buildOrders = () =>
    customers
      .filter((c) => (rows[c._id]?.idlyKg || 0) > 0 || (rows[c._id]?.dosaKg || 0) > 0)
      .map((c) => ({ customerId: c._id, shopName: c.shopName, idlyKg: rows[c._id]?.idlyKg || 0, dosaKg: rows[c._id]?.dosaKg || 0 }));

  const doSubmit = async (options) => {
    setSubmitting(true);
    setError("");
    try {
      const data = await submitBatterRequest(buildOrders(), options);
      onSubmitted(data.request);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally { setSubmitting(false); setShowCarryOver(false); }
  };

  const handleSubmit = () => {
    setError("");
    const orders = buildOrders();
    if (orders.length === 0) { setError("Enter at least one customer's kg requirement."); return; }

    const hasStock = stock.idly > 0 || stock.dosa > 0;
    if (hasStock && (totals.idly > 0 || totals.dosa > 0)) {
      setShowCarryOver(true);
    } else {
      doSubmit({ finalIdlyKg: totals.idly, finalDosaKg: totals.dosa });
    }
  };

  return (
    <div className="px-4 pt-4 pb-32">
      {rejectedNote && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">
          Your last request was rejected{rejectedNote ? `: ${rejectedNote}` : "."} Submit a new one below.
        </div>
      )}
      <p className="text-sm text-gray-500 mb-3">Enter today's kg for each customer that ordered. Totals are calculated automatically.</p>
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-3">{error}</div>}

      <div className="space-y-2">
        {customers.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
            <p className="text-sm font-medium text-gray-800 mb-2">{c.shopName}</p>
            <div className="grid grid-cols-2 gap-3">
              {["idlyKg", "dosaKg"].map((field) => (
                <div key={field}>
                  <label className="text-[10px] text-gray-400">{field === "idlyKg" ? "Idly kg" : "Dosa kg"}</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button onClick={() => bump(c._id, field, -1)} className="w-7 h-7 rounded-full border border-green-700 text-green-700 flex items-center justify-center text-sm font-bold">−</button>
                    <input
                      type="number" min="0"
                      value={rows[c._id]?.[field] || 0}
                      onChange={(e) => setRow(c._id, field, e.target.value)}
                      className="w-12 text-center px-1 py-1 rounded-lg border border-gray-200 text-sm"
                    />
                    <button onClick={() => bump(c._id, field, 1)} className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {customers.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No customers assigned to you yet — add one from the Customers tab.</p>}
      </div>

      {customers.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Total: <b className="text-gray-800">{totals.idly}kg idly / {totals.dosa}kg dosa</b></span>
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">
            {submitting ? "Sending…" : "Send Request to Admin"}
          </button>
        </div>
      )}

      {showCarryOver && (
        <CarryOverModal
          totals={totals} stock={stock}
          onClose={() => setShowCarryOver(false)}
          onSendReduced={(idly, dosa) => doSubmit({ finalIdlyKg: idly, finalDosaKg: dosa })}
          onSendFull={(reason) => doSubmit({ finalIdlyKg: totals.idly, finalDosaKg: totals.dosa, carryOverReason: reason })}
        />
      )}
    </div>
  );
}

/* ══════════════════════════ Today's Deliveries ══════════════════════════ */
function DeliveriesFlow({ request, products, onDone }) {
  const [rows, setRows] = useState(() => {
    const init = {};
    (request.customerOrders || []).forEach((c, i) => {
      init[c.customer || `${c.shopName}-${i}`] = {
        customerId: c.customer, shopName: c.shopName,
        idlyKg: c.idlyKg, dosaKg: c.dosaKg,
        status: "delivered", paymentStatus: "paid", amountPaid: "", skipReason: "",
      };
    });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const rate = (key) => products.find((p) => p.key === key) || { companyRatePerKg: 0, customerRatePerKg: 0 };
  const idlyRate = rate("idly"), dosaRate = rate("dosa");

  const amountFor = (r) => r.idlyKg * idlyRate.customerRatePerKg + r.dosaKg * dosaRate.customerRatePerKg;

  const setField = (key, field, value) => setRows((r) => ({ ...r, [key]: { ...r[key], [field]: value } }));

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const records = Object.values(rows).map((r) => ({
        customerId: r.customerId, shopName: r.shopName,
        idlyKg: r.idlyKg, dosaKg: r.dosaKg,
        status: r.status,
        paymentStatus: r.paymentStatus,
        amountCharged: amountFor(r),
        amountPaid: r.paymentStatus === "partial" ? Number(r.amountPaid) || 0 : undefined,
        skipReason: r.skipReason,
      }));
      await submitDeliveries(request._id, records);
      setDone(true);
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit deliveries.");
    } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="px-4 pt-10 text-center">
        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <p className="font-semibold text-gray-800">Today's deliveries recorded</p>
        <p className="text-sm text-gray-400 mt-1">Check your Home page for updated margin and collections.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-32">
      <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4 text-sm text-green-700">
        Approved: {request.approvedIdlyKg}kg idly / {request.approvedDosaKg}kg dosa
        {request.deliveryTime && <> · Delivery time: <b>{request.deliveryTime}</b></>}
      </div>
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-3">{error}</div>}

      <div className="space-y-3">
        {Object.entries(rows).map(([key, r]) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800 text-sm">{r.shopName}</p>
              <span className="text-xs text-gray-400">{r.idlyKg}kg idly · {r.dosaKg}kg dosa</span>
            </div>

            <div className="flex gap-2 mb-2">
              <button onClick={() => setField(key, "status", "delivered")} className={`flex-1 py-2 rounded-xl text-xs font-medium ${r.status === "delivered" ? "bg-green-700 text-white" : "border border-gray-200 text-gray-500"}`}>Delivered</button>
              <button onClick={() => setField(key, "status", "skipped")} className={`flex-1 py-2 rounded-xl text-xs font-medium ${r.status === "skipped" ? "bg-gray-700 text-white" : "border border-gray-200 text-gray-500"}`}>Skipped</button>
            </div>

            {r.status === "delivered" ? (
              <>
                <div className="flex gap-2 mb-2">
                  {["paid", "credit", "partial"].map((p) => (
                    <button key={p} onClick={() => setField(key, "paymentStatus", p)} className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize ${r.paymentStatus === p ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-500"}`}>{p}</button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Amount: ₹{amountFor(r)}</p>
                {r.paymentStatus === "partial" && (
                  <input
                    type="number" placeholder="Amount paid now"
                    value={r.amountPaid} onChange={(e) => setField(key, "amountPaid", e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                )}
              </>
            ) : (
              <input
                placeholder="Reason (optional) — kg stays in your stock"
                value={r.skipReason} onChange={(e) => setField(key, "skipReason", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <button onClick={submit} disabled={submitting} className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {submitting ? "Saving…" : "Save Today's Deliveries"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ Page ══════════════════════════ */
export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({ idly: 0, dosa: 0 });
  const [request, setRequest] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getMyCustomers(), getProducts(), getMyProfile(), getMyBatterRequests()])
      .then(([c, p, prof, r]) => {
        setCustomers(c.customers || []);
        setProducts(p.products || []);
        setStock(prof.distributor?.currentStockKg || { idly: 0, dosa: 0 });
        setRequest((r.requests || [])[0] || null);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-semibold">Orders &amp; Delivery</span>
          {request && (
            <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLE[request.status]}`}>{request.status.replace("_", " ")}</span>
          )}
        </div>
      </div>

      {loading && <p className="text-center text-gray-400 py-10 text-sm">Loading…</p>}

      {!loading && (!request || request.status === "rejected") && (
        <RequestBatterForm
          customers={customers} stock={stock}
          rejectedNote={request?.status === "rejected" ? request.adminNote : ""}
          onSubmitted={(r) => setRequest(r)}
        />
      )}

      {!loading && request && request.status === "pending" && (
        <div className="px-4 pt-6 text-center">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏳</div>
          <p className="font-semibold text-gray-800">Waiting for admin approval</p>
          <p className="text-sm text-gray-400 mt-1">Requested: {request.requestedIdlyKg}kg idly / {request.requestedDosaKg}kg dosa</p>
        </div>
      )}

      {!loading && request && (request.status === "approved" || request.status === "partially_approved") && (
        <DeliveriesFlow request={request} products={products} onDone={load} />
      )}

      <BottomNav />
    </div>
  );
}