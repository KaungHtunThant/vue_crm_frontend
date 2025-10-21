import axios from "@/plugins/axios";

export const updateAnswersByDealId = async (deal_id, formData) => {
  return await axios.put(`/answers/${deal_id}`, { answers: formData });
};
