import axios from "@/plugins/axios";

export const getLogsByDealId = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};
