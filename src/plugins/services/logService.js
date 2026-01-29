import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getLogsByDealId = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};

export const getLogsByDealId = withErrorLogging(
  _getLogsByDealId,
  "logService/getLogsByDealId"
);
