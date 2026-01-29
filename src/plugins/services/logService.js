import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getLogsByDealIdBase = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};

export const getLogsByDealId = withErrorLogging(
  getLogsByDealIdBase,
  "getLogsByDealId"
);
