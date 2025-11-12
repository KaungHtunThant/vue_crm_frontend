import axios from "@/plugins/axios";

export const payingLevels = () => axios.get("/commission-packages/");
export const payingLevel = (id) => axios.get(`/${id}`);
export const createCommissionPackage = (data) =>
  axios.post("/commission-packages", data);
export const updateCommissionPackage = (id, data) =>
  axios.put(`/commission-packages/${id}`, data);
export const deletePackage = (id) => axios.delete(`/commission-packages/${id}`);
export const deductiontypes = () => axios.get("/deductions/");
export const getUserDeductions = (id) => axios.get(`/deductions/${id}`);
export const saveDeduction = (data) => axios.post("/deductions/", data);
export const deleteDeduction = (id) => axios.delete(`/deductions/${id}`);
export const calculatecommission = async (id) => {
  return axios.get(`/deductions/getsalary/${id}`);
};
