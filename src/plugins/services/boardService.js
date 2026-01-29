import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getAllBoardsFn = () => {
  return axios.get("/boards/all");
};
export const getAllBoards = withErrorLogging(
  getAllBoardsFn,
  "boardService.getAllBoards"
);

const getBoardIndexFn = () => {
  return axios.get("/boards");
};
export const getBoardIndex = withErrorLogging(
  getBoardIndexFn,
  "boardService.getBoardIndex"
);
