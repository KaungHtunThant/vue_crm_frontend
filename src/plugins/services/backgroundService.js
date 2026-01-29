import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getBackgroundImagesBase = async () => {
  return await axios.get("/bg-images");
};

const saveBackgroundIdBase = async (id) => {
  return await axios.patch(`/bg-images/${id}`);
};

const getBackgroundIdBase = async (id) => {
  return await axios.get(`/bg-images/${id}`);
};

export const getBackgroundImages = withErrorLogging(getBackgroundImagesBase, "getBackgroundImages");
export const saveBackgroundId = withErrorLogging(saveBackgroundIdBase, "saveBackgroundId");
export const getBackgroundId = withErrorLogging(getBackgroundIdBase, "getBackgroundId");
