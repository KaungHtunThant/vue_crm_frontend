import axios from "@/plugins/axios";
// Broadcast services
export const getBroadcasts = async () => {
  return await axios.get("/settings/broadcasts");
};
export const getKanbanBroadcasts = async () => {
  return await axios.get("/kanban/broadcasts");
};

export const createBroadcast = async (description) => {
  return await axios.post("/settings/broadcasts", {
    description: description,
  });
};
export const updateBroadcastPosition = async (id, direction) => {
  return await axios.patch(`/settings/broadcasts/position/${id}/${direction}`);
};

export const deleteBroadcast = async (id) => {
  return await axios.delete(`/settings/broadcasts/${id}`);
};
export const updateBroadcast = async (id, description, status, important) => {
  return await axios.patch(`/settings/broadcasts/${id}`, {
    description: description,
    status: status,
    important: important,
  });
};
