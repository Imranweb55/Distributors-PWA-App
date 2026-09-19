// FILE: src/context/DistributorAuthContext.jsx
// NEW FILE — Distributors-PWA-App
// Same pattern as the Admin Dashboard's AdminAuthContext.jsx.
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const DistributorAuthContext = createContext();

export function DistributorAuthProvider({ children }) {
  const [distributor, setDistributor] = useState(() => {
    const s = localStorage.getItem("sridhi_distributor");
    return s ? JSON.parse(s) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("sridhi_distributor_token") || null);
  const [checking, setChecking] = useState(!!localStorage.getItem("sridhi_distributor_token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("sridhi_distributor_token");
    if (!storedToken) { setChecking(false); return; }

    axiosInstance.get("/api/distributors/me")
      .then((res) => {
        const fresh = res.data.distributor;
        localStorage.setItem("sridhi_distributor", JSON.stringify(fresh));
        setDistributor(fresh);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("sridhi_distributor_token");
          localStorage.removeItem("sridhi_distributor");
          setToken(null);
          setDistributor(null);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const login = (t, d) => {
    localStorage.setItem("sridhi_distributor_token", t);
    localStorage.setItem("sridhi_distributor", JSON.stringify(d));
    setToken(t);
    setDistributor(d);
  };

  const logout = () => {
    localStorage.removeItem("sridhi_distributor_token");
    localStorage.removeItem("sridhi_distributor");
    setToken(null);
    setDistributor(null);
  };

  if (checking) return null;

  return (
    <DistributorAuthContext.Provider value={{ distributor, token, login, logout }}>
      {children}
    </DistributorAuthContext.Provider>
  );
}

export function useDistributorAuth() {
  return useContext(DistributorAuthContext);
}