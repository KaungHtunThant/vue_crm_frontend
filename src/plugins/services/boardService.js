import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getAllBoardsBase = () => {
  return axios.get("/boards/all");
};

const getBoardIndexBase = () => {
  return axios.get("/boards");
};

export const getAllBoards = withErrorLogging(getAllBoardsBase, "getAllBoards");
export const getBoardIndex = withErrorLogging(getBoardIndexBase, "getBoardIndex");
