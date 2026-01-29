import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getBroadcastsBase = async () => {
  return await axios.get("/settings/broadcasts");
};

const createBroadcastBase = async (description) => {
  return await axios.post("/settings/broadcasts", {
    description: description,
  });
};

const updateBroadcastBase = async (id, description, status, important) => {
  return await axios.patch(`/settings/broadcasts/${id}`, {
    description: description,
    status: status,
    important: important,
  });
};

const updateBroadcastPositionBase = async (id, direction) => {
  return await axios.patch(`/settings/broadcasts/position/${id}/${direction}`);
};

const deleteBroadcastBase = async (id) => {
  return await axios.delete(`/settings/broadcasts/${id}`);
};

export const getBroadcasts = withErrorLogging(
  getBroadcastsBase,
  "getBroadcasts"
);
export const createBroadcast = withErrorLogging(
  createBroadcastBase,
  "createBroadcast"
);
export const updateBroadcast = withErrorLogging(
  updateBroadcastBase,
  "updateBroadcast"
);
export const updateBroadcastPosition = withErrorLogging(
  updateBroadcastPositionBase,
  "updateBroadcastPosition"
);
export const deleteBroadcast = withErrorLogging(
  deleteBroadcastBase,
  "deleteBroadcast"
);
