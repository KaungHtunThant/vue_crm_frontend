import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const generateOTPBase = () => axios.get("/settings/otp/generate");

const getServerVersionBase = () => axios.get("/settings/version");

const getCustomTaskBase = () => {
  return axios.get("/settings/customTask");
};

export const generateOTP = withErrorLogging(generateOTPBase, "generateOTP");
export const getServerVersion = withErrorLogging(getServerVersionBase, "getServerVersion");
export const getCustomTask = withErrorLogging(getCustomTaskBase, "getCustomTask");
