import axios from "@/plugins/axios";

export const createTask = (formData) => {
  return axios.post("/tasks", formData);
};

export const updateTask = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};

export const getTasksByDealId = async (dealId) => {
  return await axios.get(`/tasks/${dealId}`);
};
