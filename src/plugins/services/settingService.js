import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const generateOTPFn = () => axios.get("/settings/otp/generate");
export const generateOTP = withErrorLogging(generateOTPFn, "settingService.generateOTP");

const getServerVersionFn = () => axios.get("/settings/version");
export const getServerVersion = withErrorLogging(getServerVersionFn, "settingService.getServerVersion");

const getCustomTaskFn = () => {
  return axios.get("/settings/customTask");
};
export const getCustomTask = withErrorLogging(getCustomTaskFn, "settingService.getCustomTask");
