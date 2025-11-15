import axios from "@/plugins/axios";

export const getAllBoards = () => {
  return axios.get("/boards/all");
};

export const getBoardIndex = () => {
  return axios.get("/boards");
};
