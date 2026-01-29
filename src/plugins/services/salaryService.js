import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const payingLevelsBase = () => axios.get("/commission-packages");
const payingLevelBase = (id) => axios.get(`/commission-packages/${id}`);
const createCommissionPackageBase = (data) =>
  axios.post(`/commission-packages`, data);
const updateCommissionPackageBase = (id, data) =>
  axios.put(`/commission-packages/${id}`, data);
const deletePackageBase = (id) => axios.delete(`/commission-packages/${id}`);
const deductiontypesBase = () => axios.get(`/deductions`);
const getUserDeductionsBase = (id) => axios.get(`/deductions/${id}`);
const saveDeductionBase = (data) => axios.post(`/deductions`, data);
const deleteDeductionBase = (id) => axios.delete(`/deductions/${id}`);
const calculatecommissionBase = (id) =>
  axios.get(`/deductions/getsalary/${id}`, id);

export const payingLevels = withErrorLogging(payingLevelsBase, "payingLevels");
export const payingLevel = withErrorLogging(payingLevelBase, "payingLevel");
export const createCommissionPackage = withErrorLogging(
  createCommissionPackageBase,
  "createCommissionPackage"
);
export const updateCommissionPackage = withErrorLogging(
  updateCommissionPackageBase,
  "updateCommissionPackage"
);
export const deletePackage = withErrorLogging(
  deletePackageBase,
  "deletePackage"
);
export const deductiontypes = withErrorLogging(
  deductiontypesBase,
  "deductiontypes"
);
export const getUserDeductions = withErrorLogging(
  getUserDeductionsBase,
  "getUserDeductions"
);
export const saveDeduction = withErrorLogging(
  saveDeductionBase,
  "saveDeduction"
);
export const deleteDeduction = withErrorLogging(
  deleteDeductionBase,
  "deleteDeduction"
);
export const calculatecommission = withErrorLogging(
  calculatecommissionBase,
  "calculatecommission"
);
