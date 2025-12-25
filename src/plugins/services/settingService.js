import axios from "@/plugins/axios";

export const generateOTP = () => axios.get("/settings/otp/generate");

export const getServerVersion = () => axios.get("/settings/version");

export const getCustomTask = () => {
  return axios.get("/settings/customTask");
};
