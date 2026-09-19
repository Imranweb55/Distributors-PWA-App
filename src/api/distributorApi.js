// FILE: src/api/distributorApi.js
// NEW FILE — Distributors-PWA-App
import axiosInstance from "./axiosInstance";

export const distributorLogin = (employeeId, password) =>
  axiosInstance.post("/api/distributors/auth/login", { employeeId, password }).then((r) => r.data);

export const getMyProfile = () =>
  axiosInstance.get("/api/distributors/me").then((r) => r.data);

export const getMyCustomers = () =>
  axiosInstance.get("/api/distributors/my-customers").then((r) => r.data);

export const submitBatterRequest = (customerOrders) =>
  axiosInstance.post("/api/batter-requests", { customerOrders }).then((r) => r.data);

export const getMyBatterRequests = () =>
  axiosInstance.get("/api/batter-requests/mine").then((r) => r.data);