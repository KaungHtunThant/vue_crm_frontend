import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getLogsByDealIdFn = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};
export const getLogsByDealId = withErrorLogging(
  getLogsByDealIdFn,
  "logService.getLogsByDealId"
);
