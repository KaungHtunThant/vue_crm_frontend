import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getBackgroundImages = async () => {
  return await axios.get("/bg-images");
};

const _saveBackgroundId = async (id) => {
  return await axios.patch(`/bg-images/${id}`);
};

const _getBackgroundId = async (id) => {
  return await axios.get(`/bg-images/${id}`);
};

export const getBackgroundImages = withErrorLogging(_getBackgroundImages, "backgroundService/getBackgroundImages");
export const saveBackgroundId = withErrorLogging(_saveBackgroundId, "backgroundService/saveBackgroundId");
export const getBackgroundId = withErrorLogging(_getBackgroundId, "backgroundService/getBackgroundId");
