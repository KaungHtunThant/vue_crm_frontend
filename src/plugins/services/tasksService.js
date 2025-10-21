import axios from "@/plugins/axios";
import Cookies from "js-cookie";

// create new task
export const createTask = (formData) => {
  return axios.post("/tasks", formData);
};

// update task
export const updateTask = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};

// fetch tasks count by stage name
export const fetchTasksCountByStageName = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
