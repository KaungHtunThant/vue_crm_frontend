import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getAllBoards = () => {
  return axios.get("/boards/all");
};

const _getBoardIndex = () => {
  return axios.get("/boards");
};

export const getAllBoards = withErrorLogging(
  _getAllBoards,
  "boardService/getAllBoards"
);
export const getBoardIndex = withErrorLogging(
  _getBoardIndex,
  "boardService/getBoardIndex"
);
