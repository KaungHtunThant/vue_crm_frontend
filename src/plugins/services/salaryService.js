import axios from "@/plugins/axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

export const payingLevels = () =>
  axios.get(`/commission-packages/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const payingLevel = (id) =>
  axios.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCommissionPackage = (data) =>
  axios.post(`/commission-packages`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCommissionPackage = (id, data) =>
  axios.put(`/commission-packages/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePackage = (id) =>
  axios.delete(`/commission-packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deductiontypes = () =>
  axios.get(`/deductions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserDeductions = (id) =>
  axios.get(`/deductions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveDeduction = (data) =>
  axios.post(`/deductions/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteDeduction = (id) =>
  axios.delete(`/deductions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const calculatecommission = async (id) => {
  return axios.get(`/deductions/getsalary/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
