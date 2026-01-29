import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const updateAnswersByDealIdFn = async (deal_id, formData) => {
  return await axios.put(`/answers/${deal_id}`, { answers: formData });
};
export const updateAnswersByDealId = withErrorLogging(
  updateAnswersByDealIdFn,
  "answerService.updateAnswersByDealId"
);
