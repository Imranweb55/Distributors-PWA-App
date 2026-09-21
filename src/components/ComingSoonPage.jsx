// FILE: src/components/ComingSoonPage.jsx
// NEW FILE — UI-ONLY. A shared shell for any bottom-nav tab that hasn't
// been designed yet (Customers, Orders, Ledger, Profile for now). Each
// of those pages is a thin wrapper around this component (see
// CustomersPage.jsx / OrdersPage.jsx / LedgerPage.jsx / ProfilePage.jsx)
// so that once you design one of them for real, you just replace that
// one page file — this shell keeps working for the others.
import BottomNav from "./BottomNav";

export default function ComingSoonPage({ title, icon, footer }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto flex flex-col">
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
        <button className="text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-5">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        <p className="text-lg font-bold text-gray-800 mb-1">Coming Soon</p>
        <p className="text-sm text-gray-400">
          {title} page design is on the way. Check back soon!
        </p>
        {footer}
      </div>

      <BottomNav />
    </div>
  );
}