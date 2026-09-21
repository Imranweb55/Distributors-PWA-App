// FILE: src/pages/LoginPage.jsx
// UI-ONLY REDESIGN — matches the reference image exactly (colors,
// spacing, font sizes/weights, icons, button styles). NOTHING functional
// changed: still the same `employeeId` + `password` state, the same
// `distributorLogin()` API call, the same `login()`/navigate() flow as
// before. The visible label/placeholder text was changed to "Mobile
// Number" only because that's what the reference design shows — it
// still submits as the distributor's employeeId, so login continues to
// work exactly as before with no backend change needed.
//
// IMAGE PLACEHOLDERS (per your instruction — no image files created):
//   1. Logo:      /assets/sridhi-logo.png   → replace with your real logo later
//   2. Background:/assets/login-bg.png      → replace with your real background art later
// Both paths are referenced only — until you add the actual files at
// public/assets/sridhi-logo.png and public/assets/login-bg.png in this
// repo, the logo will show as a broken-image icon and the background
// graphic simply won't appear (falls back to the plain white/green
// backdrop below it). Nothing else is affected by this.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { distributorLogin } from "../api/distributorApi";
import { useDistributorAuth } from "../context/DistributorAuthContext";

function GoogleIcon() {
  return (
    <svg className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useDistributorAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await distributorLogin(employeeId.trim(), password);
      login(data.token, data.distributor);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your Employee ID and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex flex-col">
      {/* PLACEHOLDER — decorative background art (leaves/wave graphic from
          the reference image). Not created per your instruction; add the
          real file at public/assets/login-bg.png later and it will
          appear automatically, positioned bottom of the screen. */}
     {/* <div
  className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/assets/login-bg.jpeg')" }}
/> */}

      <div className="relative flex-1 flex flex-col justify-center px-7 py-10 max-w-sm w-full mx-auto">
        {/* Logo — PLACEHOLDER path, not created per your instruction */}
        <div className="flex justify-center mb-6">
          <img src="/assets/sridhi-logo.png" alt="Sridhi" className="h-30 w-auto object-contain" />
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 text-center leading-snug">Login to your account</h1>
        <p className="text-[13px] text-gray-400 text-center mt-1.5 mb-8 leading-relaxed px-2">
          Manage orders, track deliveries and keep your business growing.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] px-4 py-2.5 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">Mobile Number</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">Password</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-gray-200 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-[13px] text-gray-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 accent-green-600 focus:ring-green-500"
              />
              Remember me
            </label>
            <button type="button" className="text-[13px] font-medium text-green-600">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-60 mt-2"
          >
            {loading ? "Logging in…" : (
              <>
                Login
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[12px] text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          className="w-full py-3.5 rounded-2xl border border-gray-200 flex items-center justify-center gap-2.5 text-[14px] font-medium text-gray-700 bg-white"
        >
          <GoogleIcon />
          Login with Google
        </button>

        <p className="text-center text-[13px] text-gray-400 mt-8">
          Don't have an account?{" "}
          <span className="text-green-600 font-semibold">Contact Admin</span>
        </p>
      </div>
    </div>
  );
}