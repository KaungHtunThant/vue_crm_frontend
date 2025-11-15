import axios from "@/plugins/axios";

export const getRatings = async () => {
  return await axios.get("/ratings");
};

export const getAllRatings = async () => {
  return await axios.get("/ratings/all");
};
