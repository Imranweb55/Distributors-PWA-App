// FILE: src/pages/CustomersPage.jsx
// UPDATED — Feature: real-time distributor workflow.
//   - Real customers from getMyCustomers() (no more dummy list) — this
//     already includes customers added by the admin AND by the
//     distributor themselves (feature #4).
//   - Tap the phone icon → opens the phone dialer (tel: link).
//   - Tap the WhatsApp icon → opens WhatsApp with the customer's number
//     and a pre-filled message, one tap, per your spec.
//   - "+ Add Customer" → the distributor can add a new shop directly
//     from here (POST /api/distributors/my-customers), auto-assigned to
//     themselves.
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { getMyCustomers, createMyCustomer } from "../api/distributorApi";
import { useDistributorAuth } from "../context/DistributorAuthContext";

function AddCustomerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ shopName: "", ownerName: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.shopName || !form.phone) { setError("Shop name and phone are required."); return; }
    setSaving(true);
    try {
      const data = await createMyCustomer(form);
      onCreated(data.customer);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add customer.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5">
        <p className="font-bold text-gray-800 mb-4">Add New Customer</p>
        {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">{error}</div>}
        <div className="space-y-3 mb-4">
          <input placeholder="Shop name *" value={form.shopName} onChange={(e) => set("shopName", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
          <input placeholder="Owner name" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
          <input placeholder="Phone number *" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
          <input placeholder="Address" value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium disabled:opacity-60">
            {saving ? "Adding…" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { distributor } = useDistributorAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    setLoading(true);
    getMyCustomers().then((d) => setCustomers(d.customers || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = customers.filter((c) => (c.shopName + c.phone).toLowerCase().includes(search.toLowerCase()));

  const whatsappLink = (customer) => {
    const phone = (customer.phone || "").replace(/\D/g, "");
    const msg = `Hi ${customer.ownerName || customer.shopName}, this is ${distributor?.name || "your distributor"} from Sridhi. Regarding your today's Idly/Dosa batter order — please confirm your requirement. Thank you!`;
    return `https://wa.me/91${phone.length === 10 ? phone : phone.slice(-10)}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 pt-6 pb-9 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-semibold">My Customers</span>
          <button onClick={() => setShowAdd(true)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="-mt-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 px-4 py-3 mb-4">
          <svg className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer name, phone..." className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none" />
        </div>

        {loading && <p className="text-center text-gray-400 py-10 text-sm">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm mb-3">No customers assigned to you yet.</p>
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-green-700 text-white text-sm font-medium">+ Add your first customer</button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {filtered.map((c) => (
            <div key={c._id} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-[14px] truncate">{c.shopName}</p>
                <p className="text-[12px] text-gray-400">{c.phone}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">Total: {c.totalKg || 0}kg · {c.totalOrders || 0} orders</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a href={whatsappLink(c)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.87 11.87 0 0012.02 0C5.4 0 .06 5.34.06 11.96c0 2.1.56 4.15 1.62 5.96L0 24l6.24-1.64a11.9 11.9 0 005.78 1.48h.01c6.62 0 11.96-5.34 11.96-11.96 0-3.2-1.24-6.2-3.47-8.4zM12.03 21.4a9.4 9.4 0 01-4.8-1.31l-.34-.2-3.58.94.96-3.5-.22-.36a9.44 9.44 0 01-1.45-5.01c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 016.7 2.78 9.4 9.4 0 012.77 6.7c0 5.23-4.25 9.43-9.52 9.43zm5.18-7.08c-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.74.92-.9 1.11-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.95.14.19 2 3.05 4.85 4.28.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onCreated={(c) => { setShowAdd(false); setCustomers((list) => [c, ...list]); }}
        />
      )}

      <BottomNav />
    </div>
  );
}