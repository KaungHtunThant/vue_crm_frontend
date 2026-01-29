import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getBroadcastsFn = async () => {
  return await axios.get("/settings/broadcasts");
};
export const getBroadcasts = withErrorLogging(getBroadcastsFn, "broadcastService.getBroadcasts");

const createBroadcastFn = async (description) => {
  return await axios.post("/settings/broadcasts", {
    description: description,
  });
};
export const createBroadcast = withErrorLogging(createBroadcastFn, "broadcastService.createBroadcast");

const updateBroadcastFn = async (id, description, status, important) => {
  return await axios.patch(`/settings/broadcasts/${id}`, {
    description: description,
    status: status,
    important: important,
  });
};
export const updateBroadcast = withErrorLogging(updateBroadcastFn, "broadcastService.updateBroadcast");

const updateBroadcastPositionFn = async (id, direction) => {
  return await axios.patch(`/settings/broadcasts/position/${id}/${direction}`);
};
export const updateBroadcastPosition = withErrorLogging(updateBroadcastPositionFn, "broadcastService.updateBroadcastPosition");

const deleteBroadcastFn = async (id) => {
  return await axios.delete(`/settings/broadcasts/${id}`);
};
export const deleteBroadcast = withErrorLogging(deleteBroadcastFn, "broadcastService.deleteBroadcast");
