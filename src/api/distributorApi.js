// FILE: src/api/distributorApi.js
// NEW FILE — Distributors-PWA-App
import axiosInstance from "./axiosInstance";

export const distributorLogin = (employeeId, password) =>
  axiosInstance.post("/api/distributors/auth/login", { employeeId, password }).then((r) => r.data);

export const getMyProfile = () =>
  axiosInstance.get("/api/distributors/me").then((r) => r.data);

export const getMyCustomers = () =>
  axiosInstance.get("/api/distributors/my-customers").then((r) => r.data);

// NEW — Feature: real-time distributor workflow. Add a customer directly
// from the PWA (feature #4).
export const createMyCustomer = (payload) =>
  axiosInstance.post("/api/distributors/my-customers", payload).then((r) => r.data);

// UPDATED — now also accepts an optional carryOverReason (sent only
// when the distributor already has stock but still requests the full
// amount) and an optional { finalIdlyKg, finalDosaKg } override (sent
// when the distributor agrees to only request the shortfall after
// stock is accounted for).
export const submitBatterRequest = (customerOrders, { carryOverReason, finalIdlyKg, finalDosaKg } = {}) =>
  axiosInstance.post("/api/batter-requests", { customerOrders, carryOverReason, finalIdlyKg, finalDosaKg }).then((r) => r.data);

export const getMyBatterRequests = () =>
  axiosInstance.get("/api/batter-requests/mine").then((r) => r.data);

// NEW — Feature: real-time distributor workflow. Batter rate catalog
// (Idly/Dosa — company cost + customer price), used to show per-kg
// rates and estimate margin while building a request/delivery.
export const getProducts = () =>
  axiosInstance.get("/api/products").then((r) => r.data);

// NEW — Feature: real-time distributor workflow. Today's Deliveries +
// margin/revenue/credit summary for the Home page.
export const submitDeliveries = (batterRequestId, records) =>
  axiosInstance.post("/api/deliveries", { batterRequestId, records }).then((r) => r.data);

export const getMyDeliveries = (date) =>
  axiosInstance.get("/api/deliveries/mine", { params: date ? { date } : {} }).then((r) => r.data);

export const getMyDeliverySummary = () =>
  axiosInstance.get("/api/deliveries/mine/summary").then((r) => r.data);

export const getMyLedger = () =>
  axiosInstance.get("/api/deliveries/mine/ledger").then((r) => r.data);