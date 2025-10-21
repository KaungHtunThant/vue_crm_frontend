import axios from "@/plugins/axios";

export const getLogsByDealId = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};
export const getKanbanQuestions = async (deal_id) => {
  return await axios.get(`/kanban/qa/${deal_id}`);
};
export const updateAnswersByDealId = async (deal_id, formData) => {
  console.log("formData", formData);
  return await axios.put(`/answers/${deal_id}`, { answers: formData });
};
