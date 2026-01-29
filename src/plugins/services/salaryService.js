import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const payingLevelsFn = () => axios.get("/commission-packages");
export const payingLevels = withErrorLogging(payingLevelsFn, "salaryService.payingLevels");

const payingLevelFn = (id) => axios.get(`/commission-packages/${id}`);
export const payingLevel = withErrorLogging(payingLevelFn, "salaryService.payingLevel");

const createCommissionPackageFn = (data) =>
  axios.post(`/commission-packages`, data);
export const createCommissionPackage = withErrorLogging(createCommissionPackageFn, "salaryService.createCommissionPackage");

const updateCommissionPackageFn = (id, data) =>
  axios.put(`/commission-packages/${id}`, data);
export const updateCommissionPackage = withErrorLogging(updateCommissionPackageFn, "salaryService.updateCommissionPackage");

const deletePackageFn = (id) => axios.delete(`/commission-packages/${id}`);
export const deletePackage = withErrorLogging(deletePackageFn, "salaryService.deletePackage");

const deductiontypesFn = () => axios.get(`/deductions`);
export const deductiontypes = withErrorLogging(deductiontypesFn, "salaryService.deductiontypes");

const getUserDeductionsFn = (id) => axios.get(`/deductions/${id}`);
export const getUserDeductions = withErrorLogging(getUserDeductionsFn, "salaryService.getUserDeductions");

const saveDeductionFn = (data) => axios.post(`/deductions`, data);
export const saveDeduction = withErrorLogging(saveDeductionFn, "salaryService.saveDeduction");

const deleteDeductionFn = (id) => axios.delete(`/deductions/${id}`);
export const deleteDeduction = withErrorLogging(deleteDeductionFn, "salaryService.deleteDeduction");

const calculatecommissionFn = (id) =>
  axios.get(`/deductions/getsalary/${id}`, id);
export const calculatecommission = withErrorLogging(calculatecommissionFn, "salaryService.calculatecommission");
