import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _payingLevels = () => axios.get("/commission-packages");
const _payingLevel = (id) => axios.get(`/commission-packages/${id}`);
const _createCommissionPackage = (data) =>
  axios.post(`/commission-packages`, data);
const _updateCommissionPackage = (id, data) =>
  axios.put(`/commission-packages/${id}`, data);
const _deletePackage = (id) => axios.delete(`/commission-packages/${id}`);
const _deductiontypes = () => axios.get(`/deductions`);
const _getUserDeductions = (id) => axios.get(`/deductions/${id}`);
const _saveDeduction = (data) => axios.post(`/deductions`, data);
const _deleteDeduction = (id) => axios.delete(`/deductions/${id}`);
const _calculatecommission = (id) =>
  axios.get(`/deductions/getsalary/${id}`, id);

export const payingLevels = withErrorLogging(
  _payingLevels,
  "salaryService/payingLevels"
);
export const payingLevel = withErrorLogging(
  _payingLevel,
  "salaryService/payingLevel"
);
export const createCommissionPackage = withErrorLogging(
  _createCommissionPackage,
  "salaryService/createCommissionPackage"
);
export const updateCommissionPackage = withErrorLogging(
  _updateCommissionPackage,
  "salaryService/updateCommissionPackage"
);
export const deletePackage = withErrorLogging(
  _deletePackage,
  "salaryService/deletePackage"
);
export const deductiontypes = withErrorLogging(
  _deductiontypes,
  "salaryService/deductiontypes"
);
export const getUserDeductions = withErrorLogging(
  _getUserDeductions,
  "salaryService/getUserDeductions"
);
export const saveDeduction = withErrorLogging(
  _saveDeduction,
  "salaryService/saveDeduction"
);
export const deleteDeduction = withErrorLogging(
  _deleteDeduction,
  "salaryService/deleteDeduction"
);
export const calculatecommission = withErrorLogging(
  _calculatecommission,
  "salaryService/calculatecommission"
);
