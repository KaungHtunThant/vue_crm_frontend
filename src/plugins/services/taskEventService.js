import axios from "@/plugins/axios";
export const getTaskEvents = async () => {
  return await axios.get(`/taskevents/`);
};
