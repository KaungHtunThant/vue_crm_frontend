import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getBackgroundImagesFn = async () => {
  return await axios.get("/bg-images");
};
export const getBackgroundImages = withErrorLogging(getBackgroundImagesFn, "backgroundService.getBackgroundImages");

const saveBackgroundIdFn = async (id) => {
  return await axios.patch(`/bg-images/${id}`);
};
export const saveBackgroundId = withErrorLogging(saveBackgroundIdFn, "backgroundService.saveBackgroundId");

const getBackgroundIdFn = async (id) => {
  return await axios.get(`/bg-images/${id}`);
};
export const getBackgroundId = withErrorLogging(getBackgroundIdFn, "backgroundService.getBackgroundId");
