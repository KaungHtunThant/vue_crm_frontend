import axios from "@/plugins/axios";
import Cookies from "js-cookie";

export const payingLevels = async () => {
  const token = Cookies.get("authToken");
  return await axios.get(`/commission-packages/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const payingLevel = async (id) => {
  const token = Cookies.get("authToken");
  return await axios.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createCommissionPackage = async (data) => {
  const token = Cookies.get("authToken");
  return await axios.post(`/commission-packages`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCommissionPackage = async (id, data) => {
  const token = Cookies.get("authToken");
  return await axios.put(`/commission-packages/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deletePackage = async (id) => {
  const token = Cookies.get("authToken");
  return await axios.delete(`/commission-packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deductiontypes = async () => {
  const token = Cookies.get("authToken");
  return await axios.get(`/deductions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserDeductions = async (id) => {
  const token = Cookies.get("authToken");
  return await axios.get(`/deductions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveDeduction = async (data) => {
  const token = Cookies.get("authToken");
  return await axios.post(`/deductions/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteDeduction = async (id) => {
  const token = Cookies.get("authToken");
  return await axios.delete(`/deductions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const calculatecommission = async (id) => {
  const token = Cookies.get("authToken");
  return await axios.get(`/deductions/getsalary/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
