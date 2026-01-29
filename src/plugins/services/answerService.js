import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const updateAnswersByDealIdBase = async (deal_id, formData) => {
  return await axios.put(`/answers/${deal_id}`, { answers: formData });
};

export const updateAnswersByDealId = withErrorLogging(
  updateAnswersByDealIdBase,
  "updateAnswersByDealId"
);
