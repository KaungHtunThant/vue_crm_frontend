import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getBroadcasts = async () => {
  return await axios.get("/settings/broadcasts");
};

const _createBroadcast = async (description) => {
  return await axios.post("/settings/broadcasts", {
    description: description,
  });
};

const _updateBroadcast = async (id, description, status, important) => {
  return await axios.patch(`/settings/broadcasts/${id}`, {
    description: description,
    status: status,
    important: important,
  });
};

const _updateBroadcastPosition = async (id, direction) => {
  return await axios.patch(`/settings/broadcasts/position/${id}/${direction}`);
};

const _deleteBroadcast = async (id) => {
  return await axios.delete(`/settings/broadcasts/${id}`);
};

export const getBroadcasts = withErrorLogging(
  _getBroadcasts,
  "broadcastService/getBroadcasts"
);
export const createBroadcast = withErrorLogging(
  _createBroadcast,
  "broadcastService/createBroadcast"
);
export const updateBroadcast = withErrorLogging(
  _updateBroadcast,
  "broadcastService/updateBroadcast"
);
export const updateBroadcastPosition = withErrorLogging(
  _updateBroadcastPosition,
  "broadcastService/updateBroadcastPosition"
);
export const deleteBroadcast = withErrorLogging(
  _deleteBroadcast,
  "broadcastService/deleteBroadcast"
);
