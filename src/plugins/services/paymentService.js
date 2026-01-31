import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getAllPaymentTypes = async () => {
  return await axios.get("/payments/payment-types");
};
const _addbalance = (data) => axios.post(`payments/add-balance`, data);
const _updateHospitalPackage = async (data) => {
  return await axios.put(`/payments/updateHospitalPackage`, data);
};

export const getAllPaymentTypes = withErrorLogging(
  _getAllPaymentTypes,
  "paymentService/getAllpaymentTypes"
);
export const addbalance = withErrorLogging(
  _addbalance,
  "paymentService/addbalance"
);
export const updateHospitalPackage = withErrorLogging(
  _updateHospitalPackage,
  "paymentService/updateHospitalPackage"
);
