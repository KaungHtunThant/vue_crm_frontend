import axios from "@/plugins/axios";
export const getAllPaymentTypes = async () => {
  return await axios.get("/payments/payment-types");
};
export const addbalance = (data) => axios.post(`payments/add-balance`, data);
export const updateHospitalPackage = async (data) => {
  return await axios.put(`/payments/updateHospitalPackage`, data);
};
