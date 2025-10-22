import axios from "@/plugins/axios";

export const getBackgroundImages = async () => {
  return await axios.get("/bg-images");
};

export const saveBackgroundId = async (id) => {
  return await axios.patch(`/bg-images/${id}`);
};

export const getBackgroundId = async (id) => {
  return await axios.get(`/bg-images/${id}`);
};
