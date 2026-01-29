import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _generateOTP = () => axios.get("/settings/otp/generate");

const _getServerVersion = () => axios.get("/settings/version");

const _getCustomTask = () => {
  return axios.get("/settings/customTask");
};

export const generateOTP = withErrorLogging(_generateOTP, "settingService/generateOTP");
export const getServerVersion = withErrorLogging(_getServerVersion, "settingService/getServerVersion");
export const getCustomTask = withErrorLogging(_getCustomTask, "settingService/getCustomTask");
